import { FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { HttpsError, onCall } from "firebase-functions/https";
import { db, requireAuth } from "./common.js";
import { assertMpinFormat, hashMpin } from "./mpin.js";

function assertMemberId(memberId: unknown): asserts memberId is string {
  if (typeof memberId !== "string" || !/^\d{1,12}$/.test(memberId)) {
    throw new HttpsError("invalid-argument", "Member ID must be digits only.");
  }
}

/**
 * Step 1 of registration, before an account exists: is this Member ID real and unclaimed?
 * Returns only a status, never member data, so the Members collection can stay private.
 */
export const checkMemberId = onCall(async (request) => {
  const { memberId } = request.data ?? {};
  assertMemberId(memberId);

  const snap = await db().doc(`Members/${memberId}`).get();
  if (!snap.exists) return { status: "not_found" };
  const member = snap.data()!;
  return { status: member.uid || member.email ? "taken" : "available" };
});

/**
 * Step 2, after createUserWithEmailAndPassword: link the new account to the member,
 * store the MPIN as a scrypt hash, and set the memberId custom claim used by Security Rules.
 */
export const completeRegistration = onCall(async (request) => {
  const auth = requireAuth(request);
  const { memberId, mpin } = request.data ?? {};
  assertMemberId(memberId);
  assertMpinFormat(mpin);

  const firestore = db();
  const memberRef = firestore.doc(`Members/${memberId}`);
  const secretRef = firestore.doc(`memberSecrets/${memberId}`);
  const secret = await hashMpin(mpin);

  await firestore.runTransaction(async (tx) => {
    const [memberSnap, alreadyLinked] = await Promise.all([
      tx.get(memberRef),
      tx.get(firestore.collection("Members").where("uid", "==", auth.uid).limit(1)),
    ]);
    if (!memberSnap.exists) throw new HttpsError("not-found", "Member ID Number not found.");
    const member = memberSnap.data()!;
    if (member.uid && member.uid !== auth.uid) {
      throw new HttpsError("already-exists", "This Member ID is already registered.");
    }
    if (!alreadyLinked.empty && alreadyLinked.docs[0].id !== memberId) {
      throw new HttpsError("already-exists", "This account is already linked to another member.");
    }

    tx.update(memberRef, {
      email: auth.token.email ?? null,
      uid: auth.uid,
      registered: true,
      // Kept separate from createdAt, which is the cooperative's membership date
      registeredAt: FieldValue.serverTimestamp(),
    });
    tx.set(secretRef, { uid: auth.uid, ...secret, failedAttempts: 0, lockedUntil: null });
  });

  await getAuth().setCustomUserClaims(auth.uid, { memberId });
  return { memberId };
});
