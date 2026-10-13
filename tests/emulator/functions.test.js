// Cloud Functions integration tests. Run with `npm run test:emulator`, which starts the
// Auth, Firestore and Functions emulators. Calls go through the real client SDK, as in the app.
import { createHash } from "node:crypto";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { initializeApp as initClient, deleteApp } from "firebase/app";
import { connectAuthEmulator, createUserWithEmailAndPassword, getAuth, signOut } from "firebase/auth";
import { connectFunctionsEmulator, getFunctions, httpsCallable } from "firebase/functions";
import { initializeApp as initAdmin, deleteApp as deleteAdminApp } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getFirestore as getAdminFirestore, Timestamp } from "firebase-admin/firestore";
import { runPenaltyCheck } from "../../functions/src/penalties.ts";

const PROJECT = "demo-svconnect";
let client, auth, functions, admin, db;
const call = (name, data) => httpsCallable(functions, name)(data).then((r) => r.data);

beforeAll(() => {
  client = initClient({ projectId: PROJECT, apiKey: "demo-key", authDomain: `${PROJECT}.firebaseapp.com` });
  auth = getAuth(client);
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  functions = getFunctions(client, "asia-southeast1");
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  admin = initAdmin({ projectId: PROJECT }, "admin");
  db = getAdminFirestore(admin);
});

afterAll(async () => {
  await deleteApp(client);
  await deleteAdminApp(admin);
});

beforeEach(async () => {
  await signOut(auth);
  await fetch(`http://127.0.0.1:8080/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, {
    method: "DELETE",
  });
  await fetch(`http://127.0.0.1:9099/emulator/v1/projects/${PROJECT}/accounts`, { method: "DELETE" });

  await db.doc("loanProducts/personalLoan").set({
    loan: "Personal Loan",
    interestRate: 0.12,
    loanTerms: { minMonths: 6, maxMonths: 24 },
  });
  await db
    .doc("Members/100001")
    .set({ displayName: "Juan Dela Cruz", shareCapital: 15000, createdAt: Timestamp.fromDate(new Date(2020, 0, 15)) });
  await db.doc("Members/100002").set({ displayName: "Maria Santos", shareCapital: 25000 });
});

// Create a login, link it to a member, and verify the email (the emulator has no inbox)
async function register(memberId, mpin = "4321", email = `m${memberId}@example.com`) {
  const { user } = await createUserWithEmailAndPassword(auth, email, "secret123");
  await call("completeRegistration", { memberId, mpin });
  await getAdminAuth(admin).updateUser(user.uid, { emailVerified: true });
  await user.getIdToken(true); // pick up the memberId claim and verified email
  return user;
}

const application = (overrides = {}) => ({
  branch: "Odiongan",
  civilStatus: "Single",
  gender: "Male",
  birthDate: "1990-05-12",
  permanentAddress: "Brgy. Poblacion",
  presentAddress: "Brgy. Poblacion",
  zipCode: "5505",
  housingStatus: "Owned",
  employmentType: "Employed",
  incomeSource: "Salary",
  incomeReceived: "Monthly",
  age: 36,
  monthlyIncome: 15000,
  loanAmount: 50000,
  loanTerm: 12,
  ...overrides,
});

describe("checkMemberId", () => {
  it("reports an unknown ID", async () => {
    expect(await call("checkMemberId", { memberId: "999999" })).toEqual({ status: "not_found" });
  });

  it("reports an unclaimed ID as available", async () => {
    expect(await call("checkMemberId", { memberId: "100001" })).toEqual({ status: "available" });
  });

  it("rejects anything that isn't digits", async () => {
    await expect(call("checkMemberId", { memberId: "../Members" })).rejects.toMatchObject({
      code: "functions/invalid-argument",
    });
  });
});

describe("completeRegistration", () => {
  it("links the login, sets the claim and stores the MPIN as scrypt off the member record", async () => {
    const user = await register("100001", "4321");

    const member = (await db.doc("Members/100001").get()).data();
    expect(member.uid).toBe(user.uid);
    expect(member.registered).toBe(true);
    expect(member.mpinHash).toBeUndefined();
    // The cooperative's membership date is left alone
    expect(member.createdAt.toDate()).toEqual(new Date(2020, 0, 15));

    const secret = (await db.doc("memberSecrets/100001").get()).data();
    expect(secret.algo).toBe("scrypt");
    expect(secret.mpinHash).toMatch(/^[0-9a-f]{64}$/);

    const { claims } = await user.getIdTokenResult();
    expect(claims.memberId).toBe("100001");
    expect(await call("checkMemberId", { memberId: "100001" })).toEqual({ status: "taken" });
  });

  it("refuses a Member ID someone else already registered", async () => {
    await register("100001");
    await signOut(auth);
    await createUserWithEmailAndPassword(auth, "intruder@example.com", "secret123");
    await expect(call("completeRegistration", { memberId: "100001", mpin: "1111" })).rejects.toMatchObject({
      code: "functions/already-exists",
    });
  });

  it("requires a 4-digit MPIN", async () => {
    await createUserWithEmailAndPassword(auth, "x@example.com", "secret123");
    await expect(call("completeRegistration", { memberId: "100001", mpin: "12" })).rejects.toMatchObject({
      code: "functions/invalid-argument",
    });
  });

  it("requires sign-in", async () => {
    await expect(call("completeRegistration", { memberId: "100001", mpin: "1234" })).rejects.toMatchObject({
      code: "functions/unauthenticated",
    });
  });
});

describe("submitLoanApplication", () => {
  it("saves a valid application with server-controlled fields", async () => {
    await register("100001");
    const result = await call("submitLoanApplication", {
      loanType: "personalLoan",
      application: { ...application(), interestRate: 0, status: "Approved", memberID: "100002" },
    });
    expect(result.deadline).toMatch(/\d{4}$/);

    const apps = await db.collection("Members/100001/loanApplications").get();
    expect(apps.size).toBe(1);
    const saved = apps.docs[0].data();
    // Values a tampered request tried to set are ignored or replaced
    expect(saved.status).toBe("Pending");
    expect(saved.interestRate).toBe(0.12);
    expect(saved.memberID).toBe("100001");
    expect(saved.loanType).toBe("Personal Loan");

    const notes = await db.collection("Members/100001/Notifications").where("type", "==", "loanApplication").get();
    expect(notes.size).toBe(1);
  });

  it("rejects a second application while one is pending", async () => {
    await register("100001");
    await call("submitLoanApplication", { loanType: "personalLoan", application: application() });
    await expect(
      call("submitLoanApplication", { loanType: "personalLoan", application: application() }),
    ).rejects.toMatchObject({ code: "functions/failed-precondition" });
  });

  it("enforces the same rules as the app", async () => {
    await register("100001");
    const error = await call("submitLoanApplication", {
      loanType: "personalLoan",
      application: application({ monthlyIncome: 3000, loanTerm: 48 }),
    }).catch((e) => e);
    expect(error.code).toBe("functions/failed-precondition");
    expect(error.details.errors).toHaveLength(2);
  });

  it("requires a verified email", async () => {
    await createUserWithEmailAndPassword(auth, "new@example.com", "secret123");
    await call("completeRegistration", { memberId: "100001", mpin: "4321" });
    await expect(
      call("submitLoanApplication", { loanType: "personalLoan", application: application() }),
    ).rejects.toMatchObject({ code: "functions/failed-precondition" });
  });

  it("rejects an unknown loan type", async () => {
    await register("100001");
    await expect(
      call("submitLoanApplication", { loanType: "freeMoneyLoan", application: application() }),
    ).rejects.toMatchObject({ code: "functions/invalid-argument" });
  });
});

describe("deleteMyAccount", () => {
  it("rejects a wrong MPIN", async () => {
    await register("100001", "4321");
    await expect(call("deleteMyAccount", { mpin: "0000" })).rejects.toMatchObject({
      code: "functions/permission-denied",
    });
  });

  it("unlinks the login, deletes it, and keeps the member record", async () => {
    const user = await register("100001", "4321");
    await call("deleteMyAccount", { mpin: "4321" });

    const member = (await db.doc("Members/100001").get()).data();
    expect(member.uid).toBeUndefined();
    expect(member.email).toBeUndefined();
    expect(member.displayName).toBe("Juan Dela Cruz");
    expect(member.createdAt.toDate()).toEqual(new Date(2020, 0, 15));
    expect((await db.doc("memberSecrets/100001").get()).exists).toBe(false);
    await expect(getAdminAuth(admin).getUser(user.uid)).rejects.toMatchObject({ code: "auth/user-not-found" });
    expect(await call("checkMemberId", { memberId: "100001" })).toEqual({ status: "available" });
  });
});

describe("verifyPasswordResetMpin", () => {
  it("accepts the right email and MPIN", async () => {
    await register("100001", "4321", "juan@example.com");
    await signOut(auth);
    expect(await call("verifyPasswordResetMpin", { email: "juan@example.com", mpin: "4321" })).toEqual({ ok: true });
  });

  it("gives the same answer for an unknown email and a wrong MPIN", async () => {
    await register("100001", "4321", "juan@example.com");
    await signOut(auth);
    const unknown = await call("verifyPasswordResetMpin", { email: "nobody@example.com", mpin: "4321" }).catch(
      (e) => e,
    );
    const wrong = await call("verifyPasswordResetMpin", { email: "juan@example.com", mpin: "0000" }).catch((e) => e);
    expect(unknown.code).toBe("functions/permission-denied");
    expect(wrong.code).toBe(unknown.code);
    expect(wrong.message).toBe(unknown.message);
  });

  it("locks the MPIN after 5 wrong attempts", async () => {
    await register("100001", "4321", "juan@example.com");
    await signOut(auth);
    for (let i = 0; i < 5; i++) {
      await call("verifyPasswordResetMpin", { email: "juan@example.com", mpin: "0000" }).catch(() => {});
    }
    // Even the right MPIN is refused while locked
    await expect(call("verifyPasswordResetMpin", { email: "juan@example.com", mpin: "4321" })).rejects.toMatchObject({
      code: "functions/resource-exhausted",
    });
  });

  it("upgrades an MPIN saved by the original app from SHA-256 to scrypt", async () => {
    const salt = "abcd";
    await db.doc("Members/100002").update({
      email: "maria@example.com",
      uid: "legacy-uid",
      mpinSalt: salt,
      mpinHash: createHash("sha256")
        .update("2468" + salt)
        .digest("hex"),
    });

    expect(await call("verifyPasswordResetMpin", { email: "maria@example.com", mpin: "2468" })).toEqual({ ok: true });

    const member = (await db.doc("Members/100002").get()).data();
    expect(member.mpinHash).toBeUndefined();
    expect((await db.doc("memberSecrets/100002").get()).data().algo).toBe("scrypt");
    // And the upgraded hash still accepts the same MPIN
    expect(await call("verifyPasswordResetMpin", { email: "maria@example.com", mpin: "2468" })).toEqual({ ok: true });
  });
});

describe("runPenaltyCheck", () => {
  const loanRef = () => db.doc("Members/100001/approvedLoans/loan1");

  beforeEach(async () => {
    await loanRef().set({
      loanStatus: "Active",
      dueDate: ["Oct 15, 2026", "Nov 15, 2026"],
      dueDateIndex: 0,
      monthlyPayment: 4666.67,
      penalties: 0,
    });
  });

  it("marks an unpaid loan overdue and notifies the member once", async () => {
    await runPenaltyCheck(db, new Date(2026, 9, 17));
    await runPenaltyCheck(db, new Date(2026, 9, 18));

    expect((await loanRef().get()).data().isOverDue).toBe(true);
    const notes = await db.collection("Members/100001/Notifications").where("type", "==", "loanOverDue").get();
    expect(notes.size).toBe(1);
  });

  it("applies the 2% penalty after the grace period", async () => {
    await runPenaltyCheck(db, new Date(2026, 9, 25));
    const loan = (await loanRef().get()).data();
    expect(loan.penaltyEligible).toBe(true);
    expect(loan.penalties).toBe(93.33);
  });

  it("leaves a paid installment alone", async () => {
    await db.doc("Members/100001/paymentHistory/p1").set({ paymentIndex: 0 });
    const result = await runPenaltyCheck(db, new Date(2026, 9, 25));
    expect(result.updated).toBe(0);
    expect((await loanRef().get()).data().isOverDue).toBeUndefined();
  });
});
