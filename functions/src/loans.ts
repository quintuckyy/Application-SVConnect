import { FieldValue } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/https";
// Shared with the app, so the client and server enforce identical rules
import { addBusinessDays, validateLoanApplication } from "../../www/js/lib/loanRules.js";
import { addNotification, db, longDate, manilaNow, memberIdFor, requireVerifiedEmail } from "./common.js";

const TEXT_FIELDS = [
  "branch",
  "civilStatus",
  "gender",
  "birthDate",
  "permanentAddress",
  "presentAddress",
  "zipCode",
  "housingStatus",
  "employmentType",
  "incomeSource",
  "incomeReceived",
] as const;
const NUMBER_FIELDS = ["age", "monthlyIncome", "loanAmount", "loanTerm"] as const;

// Accept only known form fields, with sane types and lengths
function cleanApplication(input: unknown) {
  if (!input || typeof input !== "object") throw new HttpsError("invalid-argument", "Missing application.");
  const raw = input as Record<string, unknown>;
  const clean: Record<string, string | number> = {};
  for (const key of TEXT_FIELDS) {
    const value = raw[key];
    if (value !== undefined && typeof value !== "string")
      throw new HttpsError("invalid-argument", `${key} must be text.`);
    clean[key] = String(value ?? "")
      .trim()
      .slice(0, 200);
  }
  for (const key of NUMBER_FIELDS) {
    const value = Number(raw[key]);
    if (!Number.isFinite(value)) throw new HttpsError("invalid-argument", `${key} must be a number.`);
    clean[key] = value;
  }
  return clean;
}

export const submitLoanApplication = onCall(async (request) => {
  requireVerifiedEmail(request);
  const memberId = await memberIdFor(request);
  const { loanType } = request.data ?? {};
  if (typeof loanType !== "string" || !/^[A-Za-z]{1,40}$/.test(loanType)) {
    throw new HttpsError("invalid-argument", "Unknown loan type.");
  }
  const application = cleanApplication(request.data?.application);

  const firestore = db();
  const memberRef = firestore.doc(`Members/${memberId}`);
  const productRef = firestore.doc(`loanProducts/${loanType}`);
  const applied = manilaNow();
  const deadline = addBusinessDays(applied, 3);

  await firestore.runTransaction(async (tx) => {
    // Reading existing applications inside the transaction prevents double submission
    const [memberSnap, productSnap, existing] = await Promise.all([
      tx.get(memberRef),
      tx.get(productRef),
      tx.get(memberRef.collection("loanApplications").limit(1)),
    ]);
    if (!productSnap.exists) throw new HttpsError("invalid-argument", "Unknown loan type.");
    const product = productSnap.data()!;

    const errors = validateLoanApplication({
      monthlyIncome: application.monthlyIncome,
      loanAmount: application.loanAmount,
      loanTerm: application.loanTerm,
      shareCapital: memberSnap.get("shareCapital"),
      termLimits: product.loanTerms,
      hasExistingApplication: !existing.empty,
    });
    if (errors.length) throw new HttpsError("failed-precondition", errors.join("\n"), { errors });

    tx.create(memberRef.collection("loanApplications").doc(), {
      ...application,
      // Taken from the server, never from the request
      memberID: memberId,
      loanType: product.loan,
      interestRate: product.interestRate,
      dateApplied: FieldValue.serverTimestamp(),
      status: "Pending",
    });
    addNotification(tx, memberRef, {
      title: "Loan Submitted",
      message: `Your loan application has been submitted. Kindly visit our office between ${longDate(applied)} to ${longDate(deadline)} (3 business days) to complete the processing. Please be advised that if you do not visit by the deadline, your application will not be processed further`,
      type: "loanApplication",
    });
  });

  return { applied: longDate(applied), deadline: longDate(deadline) };
});
