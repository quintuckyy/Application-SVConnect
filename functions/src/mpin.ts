import { createHash, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { FieldValue, Timestamp, type Firestore } from "firebase-admin/firestore";
import { HttpsError } from "firebase-functions/https";

const scrypt = promisify(scryptCb) as (pwd: string, salt: string, keylen: number) => Promise<Buffer>;

export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 15;

// MPIN hashes live in memberSecrets/{memberId}, which Security Rules make unreadable
// from the app. Only Cloud Functions (Admin SDK) can read or write them.
export interface MemberSecret {
  uid: string;
  mpinHash: string;
  mpinSalt: string;
  algo: "scrypt";
  failedAttempts?: number;
  lockedUntil?: Timestamp | null;
}

export async function hashMpin(mpin: string, salt = randomBytes(16).toString("hex")) {
  // scrypt is deliberately slow and memory-hard, unlike SHA-256: a 4-digit MPIN
  // has only 10,000 values, so the hash must be expensive to brute-force.
  const hash = (await scrypt(mpin, salt, 32)).toString("hex");
  return { mpinHash: hash, mpinSalt: salt, algo: "scrypt" as const };
}

function sameHex(a: string, b: string) {
  const x = Buffer.from(a, "hex");
  const y = Buffer.from(b, "hex");
  return x.length === y.length && timingSafeEqual(x, y);
}

// The original app stored SHA-256(mpin + salt) on the member document.
function legacySha256(mpin: string, salt: string) {
  return createHash("sha256")
    .update(mpin + salt)
    .digest("hex");
}

export function assertMpinFormat(mpin: unknown): asserts mpin is string {
  if (typeof mpin !== "string" || !/^\d{4}$/.test(mpin)) {
    throw new HttpsError("invalid-argument", "MPIN must be 4 digits.");
  }
}

/**
 * Check an MPIN for a member, enforcing a lockout after repeated failures.
 * Upgrades MPINs saved in the original SHA-256 format to scrypt on first success.
 * Returns true or false; throws `resource-exhausted` while locked.
 */
export async function verifyMemberMpin(db: Firestore, memberId: string, mpin: string): Promise<boolean> {
  const secretRef = db.doc(`memberSecrets/${memberId}`);
  const memberRef = db.doc(`Members/${memberId}`);
  const [secretSnap, memberSnap] = await Promise.all([secretRef.get(), memberRef.get()]);
  const secret = secretSnap.data() as MemberSecret | undefined;
  const member = memberSnap.data();

  if (secret?.lockedUntil && secret.lockedUntil.toMillis() > Date.now()) {
    throw new HttpsError(
      "resource-exhausted",
      `Too many wrong MPIN attempts. Try again in ${LOCKOUT_MINUTES} minutes.`,
    );
  }

  let ok: boolean;
  if (secret?.mpinHash) {
    const { mpinHash } = await hashMpin(mpin, secret.mpinSalt);
    ok = sameHex(mpinHash, secret.mpinHash);
  } else if (member?.mpinHash && member?.mpinSalt) {
    ok = sameHex(legacySha256(mpin, member.mpinSalt), member.mpinHash);
    if (ok) {
      // Move the MPIN off the readable member document and onto scrypt
      await secretRef.set({ uid: member.uid ?? null, ...(await hashMpin(mpin)), failedAttempts: 0, lockedUntil: null });
      await memberRef.update({ mpinHash: FieldValue.delete(), mpinSalt: FieldValue.delete() });
      return true;
    }
  } else {
    return false;
  }

  if (ok) {
    if (secret?.failedAttempts) await secretRef.update({ failedAttempts: 0, lockedUntil: null });
    return true;
  }

  const failed = (secret?.failedAttempts ?? 0) + 1;
  const lock = failed >= MAX_FAILED_ATTEMPTS;
  await secretRef.set(
    {
      failedAttempts: lock ? 0 : failed,
      lockedUntil: lock ? Timestamp.fromMillis(Date.now() + LOCKOUT_MINUTES * 60_000) : null,
    },
    { merge: true },
  );
  return false;
}
