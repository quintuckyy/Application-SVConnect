// Security Rules tests. Run with `npm run test:emulator` (starts the Firestore emulator).
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  addDoc,
} from "firebase/firestore";

let env;

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-svconnect-rules",
    firestore: { rules: readFileSync("firestore.rules", "utf8") },
  });
});
afterAll(() => env.cleanup());

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, "loanProducts/personalLoan"), { loan: "Personal Loan", interestRate: 0.12 });
    await setDoc(doc(db, "Members/100001"), { displayName: "Juan Dela Cruz", uid: "uid-juan", shareCapital: 15000 });
    await setDoc(doc(db, "Members/100002"), { displayName: "Maria Santos", uid: "uid-maria", shareCapital: 25000 });
    await setDoc(doc(db, "Members/100001/approvedLoans/loan1"), { remainingBalance: 42000, penalties: 0 });
    await setDoc(doc(db, "Members/100001/Notifications/n1"), {
      title: "Hi",
      message: "Hello",
      type: "loan",
      seen: false,
    });
    await setDoc(doc(db, "Members/100001/Transactions/t1"), { title: "Deposit", message: "₱500", seen: false });
    await setDoc(doc(db, "memberSecrets/100001"), { uid: "uid-juan", mpinHash: "x", mpinSalt: "y" });
  });
});

// Juan with the memberId claim that completeRegistration sets
const juan = () => env.authenticatedContext("uid-juan", { memberId: "100001", email_verified: true }).firestore();
// Juan before claims existed: only the uid on the member document links him
const juanNoClaim = () => env.authenticatedContext("uid-juan").firestore();
const stranger = () => env.authenticatedContext("uid-stranger").firestore();
const anonymous = () => env.unauthenticatedContext().firestore();

const newNotification = (overrides = {}) => ({
  title: "Welcome",
  message: "Welcome to SVConnect!",
  type: "login",
  createdAt: new Date(),
  seen: false,
  ...overrides,
});

describe("Members", () => {
  it("lets a member read their own record", () => assertSucceeds(getDoc(doc(juan(), "Members/100001"))));
  it("lets a member without the claim read their record via uid", () =>
    assertSucceeds(getDoc(doc(juanNoClaim(), "Members/100001"))));
  it("blocks reading another member", () => assertFails(getDoc(doc(juan(), "Members/100002"))));
  it("blocks anyone signed out", () => assertFails(getDoc(doc(anonymous(), "Members/100001"))));
  it("blocks a signed-in stranger", () => assertFails(getDoc(doc(stranger(), "Members/100001"))));

  it("allows finding your own member by uid", () =>
    assertSucceeds(getDocs(query(collection(juan(), "Members"), where("uid", "==", "uid-juan")))));
  it("blocks listing every member (the old login lookup)", () => assertFails(getDocs(collection(juan(), "Members"))));

  it("allows changing the display name", () =>
    assertSucceeds(updateDoc(doc(juan(), "Members/100001"), { displayName: "Juan D." })));
  it("rejects an empty display name", () => assertFails(updateDoc(doc(juan(), "Members/100001"), { displayName: "" })));
  it("allows marking the first-login notice as sent", () =>
    assertSucceeds(updateDoc(doc(juan(), "Members/100001"), { firstLoginNotificationSent: true })));
  it("blocks raising your own share capital", () =>
    assertFails(updateDoc(doc(juan(), "Members/100001"), { shareCapital: 999999 })));
  it("blocks relinking the account to another uid", () =>
    assertFails(updateDoc(doc(juan(), "Members/100001"), { uid: "uid-attacker" })));
  it("blocks creating member records", () =>
    assertFails(setDoc(doc(juan(), "Members/999999"), { displayName: "Fake" })));
  it("blocks deleting your member record", () => assertFails(deleteDoc(doc(juan(), "Members/100001"))));
});

describe("memberSecrets", () => {
  it("hides MPIN hashes even from their owner", () => assertFails(getDoc(doc(juan(), "memberSecrets/100001"))));
  it("blocks writing MPIN hashes from the app", () =>
    assertFails(setDoc(doc(juan(), "memberSecrets/100001"), { mpinHash: "mine" })));
});

describe("loan data", () => {
  it("lets a member read their approved loan", () =>
    assertSucceeds(getDoc(doc(juan(), "Members/100001/approvedLoans/loan1"))));
  it("blocks reading another member's loans", () =>
    assertFails(getDocs(collection(juan(), "Members/100002/approvedLoans"))));
  it("blocks clearing your own penalty", () =>
    assertFails(updateDoc(doc(juan(), "Members/100001/approvedLoans/loan1"), { penalties: 0, remainingBalance: 0 })));
  it("blocks submitting a loan application directly (must go through Cloud Functions)", () =>
    assertFails(
      addDoc(collection(juan(), "Members/100001/loanApplications"), { loanAmount: 1000, status: "Approved" }),
    ));
  it("lets a member read their loan applications", () =>
    assertSucceeds(getDocs(collection(juan(), "Members/100001/loanApplications"))));
  it("blocks writing payment history", () =>
    assertFails(addDoc(collection(juan(), "Members/100001/paymentHistory"), { paymentAmt: 50000 })));
});

describe("loanProducts", () => {
  it("are readable when signed in", () => assertSucceeds(getDoc(doc(juan(), "loanProducts/personalLoan"))));
  it("are not readable signed out", () => assertFails(getDoc(doc(anonymous(), "loanProducts/personalLoan"))));
  it("cannot be changed from the app", () =>
    assertFails(updateDoc(doc(juan(), "loanProducts/personalLoan"), { interestRate: 0 })));
});

describe("Notifications", () => {
  const notifications = (db) => collection(db, "Members/100001/Notifications");

  it("allows the first-login notification", () => assertSucceeds(addDoc(notifications(juan()), newNotification())));
  it("allows the password-changed notification", () =>
    assertSucceeds(addDoc(notifications(juan()), newNotification({ type: "passwordReset" }))));
  it("blocks faking a cooperative notice", () =>
    assertFails(addDoc(notifications(juan()), newNotification({ type: "loan", title: "Loan Approved" }))));
  it("blocks extra fields", () => assertFails(addDoc(notifications(juan()), newNotification({ link: "https://x" }))));
  it("blocks back-dated notifications", () =>
    assertFails(addDoc(notifications(juan()), newNotification({ createdAt: new Date(2020, 0, 1) }))));
  it("blocks notifications already marked seen", () =>
    assertFails(addDoc(notifications(juan()), newNotification({ seen: true }))));
  it("blocks writing to another member's inbox", () =>
    assertFails(addDoc(collection(juan(), "Members/100002/Notifications"), newNotification())));

  it("allows marking one as read", () =>
    assertSucceeds(updateDoc(doc(juan(), "Members/100001/Notifications/n1"), { seen: true })));
  it("blocks editing the message", () =>
    assertFails(updateDoc(doc(juan(), "Members/100001/Notifications/n1"), { message: "Edited" })));
  it("allows deleting your own", () => assertSucceeds(deleteDoc(doc(juan(), "Members/100001/Notifications/n1"))));
});

describe("Transactions", () => {
  it("allows marking one as read", () =>
    assertSucceeds(updateDoc(doc(juan(), "Members/100001/Transactions/t1"), { seen: true })));
  it("blocks changing the amount", () =>
    assertFails(updateDoc(doc(juan(), "Members/100001/Transactions/t1"), { message: "₱500,000" })));
  it("blocks deleting transactions", () => assertFails(deleteDoc(doc(juan(), "Members/100001/Transactions/t1"))));
});
