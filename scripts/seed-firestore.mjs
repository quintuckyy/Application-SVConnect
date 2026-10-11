// Seeds a Firestore project with fake test data so the app can be run end to end.
//
// Usage:
//   1. Firebase console → Project settings → Service accounts → Generate new private key.
//      Save it as serviceAccountKey.json in the repo root (it is gitignored), or point
//      GOOGLE_APPLICATION_CREDENTIALS at it.
//   2. npm run seed              (writes the data)
//      npm run seed -- --dry-run (prints what would be written, writes nothing)
//
// Every document uses a fixed ID, so running it again overwrites the same test records.
// Member documents are merged, so an account you already registered keeps its login fields.

import { readFileSync, existsSync } from "node:fs";
import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

// Only ever seed this project. Never point this script at the cooperative's live project.
const ALLOWED_PROJECT = "st-vincent-coop-connect";
const DRY_RUN = process.argv.includes("--dry-run");

function loadCredential() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const key = JSON.parse(readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf8"));
    return { credential: applicationDefault(), projectId: key.project_id };
  }
  if (existsSync("serviceAccountKey.json")) {
    const key = JSON.parse(readFileSync("serviceAccountKey.json", "utf8"));
    return { credential: cert(key), projectId: key.project_id };
  }
  console.error("No credentials found. Save your service account key as serviceAccountKey.json in the repo root, or set GOOGLE_APPLICATION_CREDENTIALS.");
  process.exit(1);
}

const { credential, projectId } = loadCredential();
if (projectId !== ALLOWED_PROJECT) {
  console.error(`Refusing to seed "${projectId}". This script only writes to "${ALLOWED_PROJECT}".`);
  process.exit(1);
}

initializeApp({ credential, projectId });
const db = getFirestore();

// ---------- helpers ----------
const ts = (date) => Timestamp.fromDate(date);
const daysAgo = (n) => new Date(Date.now() - n * 86_400_000);
const addMonths = (date, n) => { const d = new Date(date); d.setMonth(d.getMonth() + n); return d; };
// The app shows dueDate entries as text and parses them with new Date(), e.g. "Nov 15, 2026"
const dueText = (date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const round2 = (n) => Math.round(n * 100) / 100;

// ---------- loan products (read by loan-application.js) ----------
const loanProducts = {
  personalLoan:        { loan: "Personal Loan",        interestRate: 0.12, loanTerms: { minMonths: 6,  maxMonths: 24 } },
  educationalLoan:     { loan: "Educational Loan",     interestRate: 0.08, loanTerms: { minMonths: 6,  maxMonths: 12 } },
  hospitalizationLoan: { loan: "Hospitalization Loan", interestRate: 0.06, loanTerms: { minMonths: 3,  maxMonths: 12 } },
  motorcycleLoan:      { loan: "Motorcycle Loan",      interestRate: 0.14, loanTerms: { minMonths: 12, maxMonths: 36 } },
  microFinanceLoan:    { loan: "Micro Finance Loan",   interestRate: 0.10, loanTerms: { minMonths: 3,  maxMonths: 12 } },
};
for (const p of Object.values(loanProducts)) p.imgURL = "img/loan.png";

// ---------- members (all fictional) ----------
// Member IDs are the document IDs you enter on the registration screen.
const members = {
  "100001": {
    displayName: "Juan Dela Cruz",
    address: "Brgy. Poblacion, Odiongan, Romblon",
    contact: "0917 000 0001",
    sex: "Male",
    birthDate: ts(new Date(1990, 4, 12)),
    shareCapital: 15000,
    createdAt: ts(daysAgo(400)),
  },
  "100002": {
    displayName: "Maria Santos",
    address: "Brgy. Tabing Dagat, Odiongan, Romblon",
    contact: "0917 000 0002",
    sex: "Female",
    birthDate: ts(new Date(1985, 9, 3)),
    shareCapital: 25000,
    createdAt: ts(daysAgo(900)),
  },
  "100003": {
    displayName: "Pedro Reyes",
    address: "Brgy. Libertad, Odiongan, Romblon",
    contact: "0917 000 0003",
    sex: "Male",
    birthDate: ts(new Date(1998, 1, 20)),
    shareCapital: 5000,
    createdAt: ts(daysAgo(60)),
  },
};

function savingsAccount(memberId, balance, shares) {
  return {
    accountNumber: `SA-${memberId}-01`,
    accountType: "Regular Savings",
    status: "Active",
    balance,
    interestRate: 0.02,
    interestEarned: round2(balance * 0.02),
    createdAt: members[memberId].createdAt,
    totalAssets: balance + members[memberId].shareCapital,
    disbursedAmount: 0,
    ParValue: 100,
    dividends: 0.05,
    numberOfShares: shares,
    savingsBuildUp: round2(balance * 0.1),
    capitalBuildUp: round2(members[memberId].shareCapital * 0.1),
  };
}

// Member 100002 has an active 12-month personal loan with 3 payments made.
// TESTDATE is set to "now" because home.js and loan-overview.js use it as today's date.
function activeLoan() {
  const principal = 50000, months = 12, rate = 0.12;
  const monthlyInterest = round2((principal * rate) / 12);
  const monthlyPayment = round2(principal / months + monthlyInterest);
  const totalPayment = round2(monthlyPayment * months);
  const paid = 3;
  const start = daysAgo(100);
  const dueDates = Array.from({ length: months }, (_, i) => addMonths(start, i + 1));
  const payments = dueDates.slice(0, paid).map((d, i) => ({
    paymentIndex: i,
    paymentAmt: monthlyPayment,
    remainingBal: round2(totalPayment - monthlyPayment * (i + 1)),
    paymentDate: ts(d),
    createdAt: ts(d),
  }));
  return {
    loan: {
      loanType: "Personal Loan",
      loanStatus: "Active",
      principal,
      totalLoan: principal,
      totalPayment,
      totalPaid: round2(monthlyPayment * paid),
      remainingBalance: round2(totalPayment - monthlyPayment * paid),
      interestRate: rate,
      monthlyInterest,
      monthlyPayment,
      loanTerms: months,
      monthsRemaining: months - paid,
      startDate: ts(start),
      dueDate: dueDates.map(dueText),
      dueDateIndex: paid,
      penalties: 0,
      isOverDue: false,
      penaltyEligible: false,
      TESTDATE: ts(new Date()),
    },
    payments,
  };
}

const { loan, payments } = activeLoan();

// Subcollection documents, keyed by member ID → collection → doc ID.
const subcollections = {
  "100001": {
    savingsAccount: { main: savingsAccount("100001", 12500, 150) },
    Transactions: {
      t1: { title: "Savings Deposit", message: "₱2,500.00 was deposited to your Regular Savings account.", createdAt: ts(daysAgo(5)), seen: false },
      t2: { title: "Share Capital", message: "₱1,000.00 was added to your share capital.", createdAt: ts(daysAgo(40)), seen: true },
    },
  },
  "100002": {
    savingsAccount: { main: savingsAccount("100002", 38200.5, 250) },
    approvedLoans: { "loan-2026-001": loan },
    paymentHistory: Object.fromEntries(payments.map((p, i) => [`pay-${i + 1}`, p])),
    completedLoans: {
      "loan-2024-007": {
        loanType: "Educational Loan",
        totalLoan: 20000,
        totalPaid: 21600,
        totalInterest: 1600,
        interestRate: "8% p.a.",
        loanTerms: "12 Months",
        dateApproved: ts(daysAgo(800)),
        completionDate: ts(daysAgo(435)),
      },
    },
    Transactions: {
      t1: { title: "Loan Payment Received", message: `Payment 3 of ₱${monthlyPaymentText()} was posted to your Personal Loan.`, createdAt: payments[2].createdAt, seen: false },
      t2: { title: "Savings Deposit", message: "₱5,000.00 was deposited to your Regular Savings account.", createdAt: ts(daysAgo(20)), seen: true },
    },
    Notifications: {
      n1: { title: "Loan Approved", message: "Your Personal Loan of ₱50,000.00 has been approved.", type: "loan", createdAt: ts(daysAgo(100)), seen: true },
    },
  },
  "100003": {
    savingsAccount: { main: savingsAccount("100003", 1500, 50) },
  },
};

function monthlyPaymentText() {
  return loan.monthlyPayment.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ---------- write ----------
const writes = [];
for (const [id, data] of Object.entries(loanProducts)) writes.push({ path: `loanProducts/${id}`, data, merge: false });
for (const [id, data] of Object.entries(members)) writes.push({ path: `Members/${id}`, data, merge: true });
for (const [memberId, cols] of Object.entries(subcollections)) {
  for (const [col, docs] of Object.entries(cols)) {
    for (const [docId, data] of Object.entries(docs)) writes.push({ path: `Members/${memberId}/${col}/${docId}`, data, merge: false });
  }
}

if (DRY_RUN) {
  for (const w of writes) console.log(`${w.merge ? "merge" : "set  "}  ${w.path}`);
  console.log(`\nDry run: ${writes.length} documents would be written to ${projectId}.`);
  process.exit(0);
}

const batch = db.batch();
for (const w of writes) batch.set(db.doc(w.path), w.data, { merge: w.merge });
await batch.commit();
console.log(`Seeded ${writes.length} documents into ${projectId}.`);
console.log("Register in the app with Member ID 100001, 100002 or 100003.");
