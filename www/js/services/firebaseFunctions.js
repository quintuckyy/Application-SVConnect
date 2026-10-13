import { db } from "./firebase.js";
import { doc, collection, addDoc, getDoc, getDocs, query, where, updateDoc, orderBy, limit } from "firebase/firestore";

export async function getLoanProducts(loanID) {
  const loanRef = doc(db, "loanProducts", loanID);
  const loanSnap = await getDoc(loanRef);
  return loanSnap.data();
}
// The signed-in user's Member ID. Read from the memberId claim that registration sets
// (no database read); accounts registered without Cloud Functions are looked up by uid.
export async function getMemberID(user) {
  const { claims } = await user.getIdTokenResult();
  if (typeof claims.memberId === "string") return claims.memberId;

  const q = query(collection(db, "Members"), where("uid", "==", user.uid), limit(1));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) throw new Error("This account isn't linked to a member.");
  return querySnapshot.docs[0].id;
}
//get Member Reference
export async function getMemberRef(memberID) {
  const memberRef = doc(db, "Members", memberID);
  const memberSnap = await getDoc(memberRef);
  return memberSnap.data();
}
//get Loan Application Reference
export async function getLoanRef(memberID) {
  const memberRef = doc(db, "Members", memberID);
  const loanCol = collection(memberRef, "loanApplications");
  const loanDoc = await getDocs(loanCol);
  return loanDoc;
}
//get Member Approved Loans
export async function getApprovedLoan(memberID) {
  const memberRef = doc(db, "Members", memberID);
  const q = query(collection(memberRef, "approvedLoans"));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;

  const aprovedloanDoc = querySnapshot.docs[0].data();
  return aprovedloanDoc;
}
//get approvedLoan ID
export async function getApprovedLoanIDs(memberID) {
  const memberRef = doc(db, "Members", memberID);
  const q = query(collection(memberRef, "approvedLoans"));
  const querySnapshot = await getDocs(q);

  const loanIDs = querySnapshot.docs.map((docSnap) => docSnap.id);
  return loanIDs;
}
//get Member Savings Reference
export async function getSavingsRef(memberID) {
  const memberRef = doc(db, "Members", memberID);
  const q = query(collection(memberRef, "savingsAccount"));
  const querySnapshot = await getDocs(q);
  const savingsDoc = querySnapshot.docs[0].data();
  return savingsDoc;
}
//get Member Notif Reference
export async function getNotifRef(memberID) {
  const memberRef = doc(db, "Members", memberID);
  const q = query(collection(memberRef, "Notifications"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const list = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return list;
}
//get Member Transac Reference
export async function getTransacRef(memberID) {
  const memberRef = doc(db, "Members", memberID);
  const q = query(collection(memberRef, "Transactions"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const list = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return list;
}
//get Member Payment Reference
export async function getPaymentRef(memberID) {
  const memberRef = doc(db, "Members", memberID);
  const q = query(collection(memberRef, "paymentHistory"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const list = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return list;
}

//get Member CompletedLoan Reference
export async function getCompletedLoansRef(memberID) {
  const memberRef = doc(db, "Members", memberID);
  const q = query(collection(memberRef, "completedLoans"), orderBy("completionDate", "desc"));
  const querySnapshot = await getDocs(q);
  const list = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return list;
}
//update dispName of user
export async function updateName(memberID, data) {
  const memberRef = doc(db, "Members", memberID);
  const dispName = await updateDoc(memberRef, { displayName: data });
  return dispName;
}
//date convertion
export function formatDate(date) {
  const formattedDate = date.toDate().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return formattedDate;
}

/**
 * Creates a notification for a member
 * @param {string} memberID - Member document ID (e.g., "436922")
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification category (ex: "loan", "login", "loanApplication")
 */
export async function createNotification(memberID, title, message, type) {
  try {
    await addDoc(collection(db, "Members", memberID, "Notifications"), {
      title,
      message,
      type,
      createdAt: new Date(),
      seen: false,
    });
    console.log("Notification created:", type);
  } catch (err) {
    console.error("Error creating notification:", err);
  }
}
