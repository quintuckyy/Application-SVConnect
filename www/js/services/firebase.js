import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, onAuthStateChanged, updatePassword, EmailAuthProvider, reauthenticateWithCredential, signOut, deleteUser   } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, collection, query, where, addDoc, getDocs, getDoc, setDoc, updateDoc, deleteField, orderBy } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUSaSpGLkMddALk3aaTi9ex3A3xAXjQJQ",
  authDomain: "st-vincent-coop-connect-aaed7.firebaseapp.com",
  projectId: "st-vincent-coop-connect-aaed7",
  storageBucket: "st-vincent-coop-connect-aaed7.firebasestorage.app",
  messagingSenderId: "548947783035",
  appId: "1:548947783035:web:5b9c85e041749e926021de"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);