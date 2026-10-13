// Tests for firestore.fallback.rules: the rules for a live project without Cloud Functions.
// Each test mirrors a write the app makes in that mode, or an attack the rules must stop.
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";
import {
  addDoc,
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

let env;

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-svconnect-fallback",
    firestore: { rules: readFileSync("firestore.fallback.rules", "utf8") },
  });
});
afterAll(() => env.cleanup());

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, "loanProducts/personalLoan"), { loan: "Personal Loan", interestRate: 0.12 });
    // Unregistered member
    await setDoc(doc(db, "Members/100001"), { displayName: "Juan Dela Cruz", shareCapital: 15000 });
    // Registered member
    await setDoc(doc(db, "Members/100002"), {
      displayName: "Maria Santos",
      shareCapital: 25000,
      uid: "uid-maria",
      email: "maria@example.com",
      registered: true,
      mpinHash: "a".repeat(64),
      mpinSalt: "b".repeat(32),
    });
    await setDoc(doc(db, "Members/100002/approvedLoans/loan1"), {
      remainingBalance: 50400,
      monthlyPayment: 5600,
      penalties: 0,
    });
    await setDoc(doc(db, "Members/100002/Notifications/n1"), {
      title: "Hi",
      message: "Hello",
      type: "loan",
      seen: false,
    });
  });
});

const anonymous = () => env.unauthenticatedContext().firestore();
const maria = () => env.authenticatedContext("uid-maria", { email: "maria@example.com" }).firestore();
const newUser = () => env.authenticatedContext("uid-new", { email: "juan@example.com" }).firestore();
const stranger = () => env.authenticatedContext("uid-stranger", { email: "x@example.com" }).firestore();

const link = (overrides = {}) => ({
  email: "juan@example.com",
  uid: "uid-new",
  registered: true,
  mpinHash: "c".repeat(64),
  mpinSalt: "d".repeat(32),
  registeredAt: new Date(),
  ...overrides,
});

describe("registration", () => {
  it("lets anyone check an unregistered Member ID", () => assertSucceeds(getDoc(doc(anonymous(), "Members/100001"))));
  it("keeps registered members private", () => assertFails(getDoc(doc(anonymous(), "Members/100002"))));
  it("blocks listing members", () => assertFails(getDocs(collection(anonymous(), "Members"))));

  it("lets a new account link an unclaimed member", () =>
    assertSucceeds(setDoc(doc(newUser(), "Members/100001"), link(), { merge: true })));
  it("blocks linking a member someone already registered", () =>
    assertFails(
      setDoc(doc(stranger(), "Members/100002"), link({ uid: "uid-stranger", email: "x@example.com" }), { merge: true }),
    ));
  it("blocks linking with someone else's uid", () =>
    assertFails(setDoc(doc(newUser(), "Members/100001"), link({ uid: "uid-other" }), { merge: true })));
  it("blocks linking with a different email than the account's", () =>
    assertFails(setDoc(doc(newUser(), "Members/100001"), link({ email: "other@example.com" }), { merge: true })));
  it("blocks raising share capital while registering", () =>
    assertFails(setDoc(doc(newUser(), "Members/100001"), link({ shareCapital: 999999 }), { merge: true })));
  it("blocks registering without signing in", () =>
    assertFails(setDoc(doc(anonymous(), "Members/100001"), link(), { merge: true })));
});

describe("registered member", () => {
  it("can read their own record", () => assertSucceeds(getDoc(doc(maria(), "Members/100002"))));
  it("can find their record by uid", () =>
    assertSucceeds(getDocs(query(collection(maria(), "Members"), where("uid", "==", "uid-maria")))));
  it("can't read another registered member", async () => {
    await env.withSecurityRulesDisabled((ctx) =>
      setDoc(doc(ctx.firestore(), "Members/100003"), { displayName: "Pedro", uid: "uid-pedro" }),
    );
    await assertFails(getDoc(doc(maria(), "Members/100003")));
  });
  it("can change their display name", () =>
    assertSucceeds(updateDoc(doc(maria(), "Members/100002"), { displayName: "Maria S." })));
  it("can't change their share capital", () =>
    assertFails(updateDoc(doc(maria(), "Members/100002"), { shareCapital: 999999 })));
  it("can delete their login fields", () =>
    assertSucceeds(
      updateDoc(doc(maria(), "Members/100002"), {
        email: deleteField(),
        uid: deleteField(),
        registered: deleteField(),
        mpinHash: deleteField(),
        mpinSalt: deleteField(),
      }),
    ));
  it("can't hand their record to another uid", () =>
    assertFails(updateDoc(doc(maria(), "Members/100002"), { uid: "uid-stranger" })));
});

describe("loans", () => {
  const app = (overrides = {}) => ({
    status: "Pending",
    memberID: "100002",
    loanAmount: 30000,
    loanTerm: 12,
    dateApplied: new Date(),
    ...overrides,
  });
  const apps = (db) => collection(db, "Members/100002/loanApplications");
  const loan = (db) => doc(db, "Members/100002/approvedLoans/loan1");

  it("lets a member apply", () => assertSucceeds(addDoc(apps(maria()), app())));
  it("blocks applying as already approved", () => assertFails(addDoc(apps(maria()), app({ status: "Approved" }))));
  it("blocks applying for another member", () =>
    assertFails(addDoc(collection(stranger(), "Members/100002/loanApplications"), app())));

  it("lets the overdue check flag the loan and add the 2% penalty", () =>
    assertSucceeds(updateDoc(loan(maria()), { isOverDue: true, penaltyEligible: true, penalties: 112 })));
  it("blocks a penalty larger than 2% of the monthly payment", () =>
    assertFails(updateDoc(loan(maria()), { penaltyEligible: true, penalties: 5000 })));
  it("blocks clearing a penalty", async () => {
    await env.withSecurityRulesDisabled((ctx) =>
      updateDoc(loan(ctx.firestore()), { penaltyEligible: true, penalties: 112 }),
    );
    await assertFails(updateDoc(loan(maria()), { penalties: 0 }));
  });
  it("blocks un-flagging an overdue loan", async () => {
    await env.withSecurityRulesDisabled((ctx) => updateDoc(loan(ctx.firestore()), { isOverDue: true }));
    await assertFails(updateDoc(loan(maria()), { isOverDue: false }));
  });
  it("blocks changing the balance", () => assertFails(updateDoc(loan(maria()), { remainingBalance: 0 })));
});

describe("notifications", () => {
  const notification = (overrides = {}) => ({
    title: "Loan Submitted",
    message: "Your loan application has been submitted.",
    type: "loanApplication",
    createdAt: new Date(),
    seen: false,
    ...overrides,
  });
  const inbox = (db) => collection(db, "Members/100002/Notifications");

  it("lets the app report its own events", () => assertSucceeds(addDoc(inbox(maria()), notification())));
  it("blocks faking a cooperative notice", () =>
    assertFails(addDoc(inbox(maria()), notification({ type: "loan", title: "Loan Approved" }))));
  it("blocks writing to another member's inbox", () => assertFails(addDoc(inbox(stranger()), notification())));
  it("lets a member mark one read", () =>
    assertSucceeds(updateDoc(doc(maria(), "Members/100002/Notifications/n1"), { seen: true })));
});

describe("never readable", () => {
  it("MPIN secrets used by Cloud Functions", () => assertFails(getDoc(doc(maria(), "memberSecrets/100002"))));
  it("loan products while signed out", () => assertFails(getDoc(doc(anonymous(), "loanProducts/personalLoan"))));
});
