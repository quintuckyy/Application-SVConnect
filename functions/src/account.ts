import { FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { HttpsError, onCall } from "firebase-functions/https";
import { addNotification, db, memberIdFor, requireAuth } from "./common.js";
import { assertMpinFormat, verifyMemberMpin } from "./mpin.js";

const RECENT_SIGN_IN_SECONDS = 5 * 60;

/**
 * Unlink the caller's login from their member record and delete the login.
 * The member record itself stays: the cooperative still needs it.
 * Requires a sign-in within the last 5 minutes (the app re-authenticates with the
 * password first) and the correct MPIN.
 */
export const deleteMyAccount = onCall(async (request) => {
  const auth = requireAuth(request);
  const signedInAt = Number(auth.token.auth_time);
  if (!signedInAt || Date.now() / 1000 - signedInAt > RECENT_SIGN_IN_SECONDS) {
    throw new HttpsError("failed-precondition", "Please enter your password again to confirm.");
  }
  const { mpin } = request.data ?? {};
  assertMpinFormat(mpin);
  const memberId = await memberIdFor(request);

  const firestore = db();
  if (!(await verifyMemberMpin(firestore, memberId, mpin))) {
    throw new HttpsError("permission-denied", "Incorrect MPIN.");
  }

  const memberRef = firestore.doc(`Members/${memberId}`);
  await firestore.runTransaction(async (tx) => {
    tx.update(memberRef, {
      email: FieldValue.delete(),
      uid: FieldValue.delete(),
      registered: FieldValue.delete(),
      registeredAt: FieldValue.delete(),
      firstLoginNotificationSent: FieldValue.delete(),
      mpinHash: FieldValue.delete(),
      mpinSalt: FieldValue.delete(),
    });
    tx.delete(firestore.doc(`memberSecrets/${memberId}`));
    addNotification(tx, memberRef, {
      title: "Gmail Removed",
      message: "Your Gmail account has been removed from the system.",
      type: "gmailRemoved",
    });
  });

  await getAuth().deleteUser(auth.uid);
  return { ok: true };
});

/**
 * Forgot-password check: the cooperative requires the MPIN before a reset email is sent.
 * The reset link itself goes only to the account's inbox, which is the real protection;
 * this adds the MPIN check with a lockout, and gives the same answer for an unknown
 * email and a wrong MPIN so it can't be used to discover registered emails.
 */
export const verifyPasswordResetMpin = onCall(async (request) => {
  const { email, mpin } = request.data ?? {};
  if (typeof email !== "string" || email.length > 254) throw new HttpsError("invalid-argument", "Enter your email.");
  assertMpinFormat(mpin);

  const firestore = db();
  const match = await firestore.collection("Members").where("email", "==", email.trim()).limit(1).get();
  const ok = !match.empty && (await verifyMemberMpin(firestore, match.docs[0].id, mpin));
  if (!ok) throw new HttpsError("permission-denied", "Email or MPIN is incorrect.");
  return { ok: true };
});
