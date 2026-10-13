// Server-side actions. With VITE_USE_CLOUD_FUNCTIONS=true each call goes to a Cloud Function,
// which validates it with the Admin SDK and strict Security Rules. Otherwise the same action
// runs in the app against Firestore directly, for projects that don't have Cloud Functions
// deployed yet (they require Firebase's Blaze plan). Screens call these functions and don't
// need to know which path is used.
import { deleteUser } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { auth, db, functions, useCloudFunctions } from "./firebase.js";
import { createNotification } from "./firebaseFunctions.js";
import { generateSalt, hashMPIN, mpinMatches } from "../lib/mpin.js";
import { addBusinessDays, validateLoanApplication } from "../lib/loanRules.js";

export class ApiError extends Error {
  /** @param {string} code e.g. "permission-denied" @param {string} message shown to the member */
  constructor(code, message, details) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

async function callFunction(name, data) {
  try {
    const result = await httpsCallable(functions, name)(data);
    return result.data;
  } catch (err) {
    const code = String(err.code || "internal").replace(/^functions\//, "");
    const message = code === "internal" ? "Something went wrong. Please try again." : err.message;
    throw new ApiError(code, message, err.details);
  }
}

const longDate = (d) => d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

/** @returns {Promise<"available"|"taken"|"not_found">} */
export async function checkMemberId(memberId) {
  if (useCloudFunctions) return (await callFunction("checkMemberId", { memberId })).status;

  const snap = await getDoc(doc(db, "Members", memberId));
  if (!snap.exists()) return "not_found";
  const member = snap.data();
  return member.uid || member.email ? "taken" : "available";
}

/** Link the signed-in login to a member record and store the MPIN. */
export async function linkMemberAccount(memberId, mpin) {
  const user = auth.currentUser;
  if (useCloudFunctions) {
    await callFunction("completeRegistration", { memberId, mpin });
    await user.getIdToken(true); // pick up the memberId claim
    return;
  }

  const salt = generateSalt();
  await setDoc(
    doc(db, "Members", memberId),
    {
      email: user.email,
      uid: user.uid,
      registered: true,
      mpinHash: await hashMPIN(mpin, salt),
      mpinSalt: salt,
      // Not createdAt: that's the cooperative's membership date
      registeredAt: new Date(),
    },
    { merge: true },
  );
}

/**
 * Submit a loan application.
 * @returns {Promise<{applied: string, deadline: string}>} formatted dates for the confirmation message
 */
export async function submitLoanApplication(memberId, loanType, application) {
  if (useCloudFunctions) return callFunction("submitLoanApplication", { loanType, application });

  const [memberSnap, productSnap, existing] = await Promise.all([
    getDoc(doc(db, "Members", memberId)),
    getDoc(doc(db, "loanProducts", loanType)),
    getDocs(query(collection(db, "Members", memberId, "loanApplications"), limit(1))),
  ]);
  const product = productSnap.data();
  const errors = validateLoanApplication({
    monthlyIncome: application.monthlyIncome,
    loanAmount: application.loanAmount,
    loanTerm: application.loanTerm,
    shareCapital: memberSnap.data()?.shareCapital,
    termLimits: product.loanTerms,
    hasExistingApplication: !existing.empty,
  });
  if (errors.length) throw new ApiError("failed-precondition", errors.join("\n"), { errors });

  const applied = new Date();
  const deadline = addBusinessDays(applied, 3);
  await addDoc(collection(db, "Members", memberId, "loanApplications"), {
    ...application,
    memberID: memberId,
    loanType: product.loan,
    interestRate: product.interestRate,
    dateApplied: applied,
    status: "Pending",
  });
  await createNotification(
    memberId,
    "Loan Submitted",
    `Your loan application has been submitted. Kindly visit our office between ${longDate(applied)} to ${longDate(deadline)} (3 business days) to complete the processing. Please be advised that if you do not visit by the deadline, your application will not be processed further`,
    "loanApplication",
  );
  return { applied: longDate(applied), deadline: longDate(deadline) };
}

/**
 * Unlink and delete the signed-in member's login. The caller must have re-authenticated
 * with the password just before, because Firebase requires a recent sign-in.
 */
export async function deleteMyAccount(memberId, mpin) {
  if (useCloudFunctions) {
    await callFunction("deleteMyAccount", { mpin });
    return;
  }

  const memberRef = doc(db, "Members", memberId);
  const member = (await getDoc(memberRef)).data();
  if (!(await mpinMatches(mpin, member?.mpinHash, member?.mpinSalt))) {
    throw new ApiError("permission-denied", "Incorrect MPIN.");
  }
  // Firestore first: once the login is deleted, the app can no longer write as this member
  await createNotification(
    memberId,
    "Gmail Removed",
    "Your Gmail account has been removed from the system.",
    "gmailRemoved",
  );
  await updateDoc(memberRef, {
    email: deleteField(),
    uid: deleteField(),
    registered: deleteField(),
    registeredAt: deleteField(),
    firstLoginNotificationSent: deleteField(),
    mpinHash: deleteField(),
    mpinSalt: deleteField(),
  });
  await deleteUser(auth.currentUser);
}

/** Forgot password: check the MPIN for this email before a reset email is sent. */
export async function verifyPasswordResetMpin(email, mpin) {
  if (useCloudFunctions) {
    await callFunction("verifyPasswordResetMpin", { email, mpin });
    return;
  }

  const match = await getDocs(query(collection(db, "Members"), where("email", "==", email), limit(1)));
  const member = match.docs[0]?.data();
  if (!(await mpinMatches(mpin, member?.mpinHash, member?.mpinSalt))) {
    throw new ApiError("permission-denied", "Email or MPIN is incorrect.");
  }
}
