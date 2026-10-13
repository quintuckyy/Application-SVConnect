import { db } from "./firebase.js";
import { mpinMatches } from "../lib/mpin.js";
import {
  doc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteField,
  orderBy,
} from "firebase/firestore";

export async function getLoanProducts(loanID) {
  const loanRef = doc(db, "loanProducts", loanID);
  const loanSnap = await getDoc(loanRef);
  return loanSnap.data();
}
//get Member ID
export async function getMemberID(user) {
  const q = query(collection(db, "Members"), where("uid", "==", user.uid));
  const querySnapshot = await getDocs(q);
  const memberDoc = querySnapshot.docs[0];
  return memberDoc.id;
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
//delete doc
export async function deleteUserAcc(memberID) {
  const memberRef = doc(db, "Members", memberID);
  const deleteAcc = await updateDoc(memberRef, {
    email: deleteField(),
    uid: deleteField(),
    registered: deleteField(),
    firstLoginNotificationSent: deleteField(),
    mpinHash: deleteField(),
    mpinSalt: deleteField(),
    createdAt: deleteField(),
  });
  return deleteAcc;
}
// Check an MPIN against the member's stored salted hash
export async function verifyMPIN(memberID, inputMPIN) {
  const memberSnap = await getDoc(doc(db, "Members", memberID));
  if (!memberSnap.exists()) return false;
  const { mpinHash, mpinSalt } = memberSnap.data();
  return mpinMatches(inputMPIN, mpinHash, mpinSalt);
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

//spinnerFunc
export function showSpinner() {
  document.getElementById("spinner").classList.remove("hidden");
}

export function hideSpinner() {
  document.getElementById("spinner").classList.add("hidden");
}

//toast func
export function showSuccess(message) {
  const successOverlay = document.getElementById("successOverlay");
  const successMessage = document.getElementById("successMessage");
  const closeSuccess = document.getElementById("closeSuccess");

  if (!successOverlay || !successMessage || !closeSuccess) {
    console.error("❌ Toast elements not found in DOM.");
    return;
  }

  successMessage.textContent = message;
  successOverlay.classList.remove("hidden");
  successOverlay.classList.add("flex");

  //close when OK is clicked
  closeSuccess.onclick = () => {
    successOverlay.classList.add("hidden");
    successOverlay.classList.remove("flex");
  };
}
