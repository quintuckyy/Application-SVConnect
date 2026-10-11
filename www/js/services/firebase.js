import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, onAuthStateChanged, updatePassword, EmailAuthProvider, reauthenticateWithCredential, signOut, deleteUser   } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, collection, query, where, addDoc, getDocs, getDoc, setDoc, updateDoc, deleteField, orderBy } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCSezEazACkGVI-TImbWNfnvfZHvetQlR8",
  authDomain: "st-vincent-coop-connect.firebaseapp.com",
  databaseURL: "https://st-vincent-coop-connect-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "st-vincent-coop-connect",
  storageBucket: "st-vincent-coop-connect.firebasestorage.app",
  messagingSenderId: "1050498334476",
  appId: "1:1050498334476:web:2e1d39eb4b4d8633fd9329"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);