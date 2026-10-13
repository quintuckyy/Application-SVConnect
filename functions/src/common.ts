import { FieldValue, getFirestore, type DocumentReference, type Transaction } from "firebase-admin/firestore";
import { HttpsError, type CallableRequest } from "firebase-functions/https";

export const db = () => getFirestore();

export function requireAuth(request: CallableRequest) {
  if (!request.auth) throw new HttpsError("unauthenticated", "Sign in first.");
  return request.auth;
}

export function requireVerifiedEmail(request: CallableRequest) {
  const auth = requireAuth(request);
  if (auth.token.email_verified !== true) {
    throw new HttpsError("failed-precondition", "Verify your email address first.");
  }
  return auth;
}

/**
 * The caller's Member ID. Comes from the `memberId` custom claim set at registration;
 * falls back to looking up Members by uid for accounts registered before claims existed.
 */
export async function memberIdFor(request: CallableRequest): Promise<string> {
  const auth = requireAuth(request);
  const fromClaim = auth.token.memberId;
  if (typeof fromClaim === "string" && fromClaim) return fromClaim;

  const snap = await db().collection("Members").where("uid", "==", auth.uid).limit(1).get();
  if (snap.empty) throw new HttpsError("failed-precondition", "This account isn't linked to a member.");
  return snap.docs[0].id;
}

export interface NotificationInput {
  title: string;
  message: string;
  type: string;
}

// Same shape the app's createNotification() writes
export function notificationData(n: NotificationInput) {
  return { ...n, createdAt: FieldValue.serverTimestamp(), seen: false };
}

export function addNotification(tx: Transaction, memberRef: DocumentReference, n: NotificationInput) {
  tx.create(memberRef.collection("Notifications").doc(), notificationData(n));
}

// Date in the Philippines, regardless of the server's time zone
export function manilaNow(now = new Date()) {
  return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Manila" }));
}

export const longDate = (d: Date) => d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
