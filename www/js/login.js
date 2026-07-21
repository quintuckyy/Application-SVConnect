import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUSaSpGLkMddALk3aaTi9ex3A3xAXjQJQ",
  authDomain: "st-vincent-coop-connect-aaed7.firebaseapp.com",
  projectId: "st-vincent-coop-connect-aaed7",
  storageBucket: "st-vincent-coop-connect-aaed7.firebasestorage.app",
  messagingSenderId: "548947783035",
  appId: "1:548947783035:web:5b9c85e041749e926021de"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const signUp = document.getElementById("step2");
const registerUser = document.getElementById("registerBtn");
const loginUser = document.getElementById("loginForm");
const forgotBtn = document.getElementById("forgotPass");

if (registerUser) {
  //Verify Member
  registerUser.addEventListener('click', async (e) => {
    e.preventDefault();
    const id = document.getElementById("member_id").value.trim();
    const step2 = document.getElementById("step2");
    const message = document.getElementById("message");
    
    if (id == "") {
      message.textContent = "Please enter your Member ID";
      return;
    }

    try {
      const docRef = doc(db, "Members", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();

        if (data.email && data.email.trim() !== "") {
          document.getElementById("member_id").classList.add('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')
          message.textContent = "❌ This ID is taken. Please enter a different ID to continue.";
          return;
        }
        document.getElementById("member_id").classList.remove('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')
        localStorage.setItem("currentMemberID", id); 
        window.showSuccessMessage("Member ID Number Verified");
        step2.classList.remove("hidden");
        document.getElementById("step1").classList.add("hidden");
        message.textContent = "";
      } else {
        document.getElementById("member_id").classList.add('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')
        message.textContent = "Member ID Number not found";
      }

    } catch (err) {
      console.error(err);
      message.textContent = "Error checking Member ID";
    }
  })
}

if (signUp) {
  //Create Account
  signUp.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirm = document.getElementById("confirm").value.trim();
    const mpin = document.getElementById("mpin").value.trim();
    const mpinInput = document.getElementById("mpin");

    const salt = generateSalt();
    const mpinHash = await hashMPIN(mpin, salt);

    const msg = document.getElementById("register_msg");
    const id = localStorage.getItem("currentMemberID");
    
    mpinInput.addEventListener("keypress", (e) => {
      // Allow only digits
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    });

    msg.textContent = "";

    if (password.length < 6) {
      msg.textContent = "Password must be at least 6 characters.";
      document.getElementById("password").classList.add('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')
      document.getElementById("confirm").classList.add('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')
      return;
    }

      document.getElementById("password").classList.remove('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')
      document.getElementById("confirm").classList.remove('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')

    if (password !== confirm) {
      msg.textContent = "Passwords do not match.";
      document.getElementById("password").classList.add('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')
      document.getElementById("confirm").classList.add('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')
      return;
    }

      document.getElementById("password").classList.remove('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')
      document.getElementById("confirm").classList.remove('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "Members", id), {
        email: email,
        uid: user.uid, 
        registered: true,
        mpinHash: mpinHash,
        mpinSalt: salt,
        createdAt: new Date()
      }, { merge: true});

      await sendEmailVerification(user);
      window.showSuccessMessage("Account successfully created. Please check your email for the verification link to complete your account setup.");
      localStorage.removeItem("currentMemberID");
      setTimeout(() =>{
        window.location.href = "index.html";
      }, 3500);

    } catch (err){
      console.error(err);
      msg.textContent = "Invalid Input.";
    }
  });
}

//user login
if (loginUser) {
  loginUser.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("errorMessage");
    msg.textContent = "";
    try {
      //user sign in using gmail
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      //check gmail verification
      if (!user.emailVerified) {
        document.getElementById("email").classList.add('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50');
        msg.textContent = "⚠️ Please verify your email before logging in. ";

        //create resend button if not verified
        const resend = document.createElement("button");
        resend.className = "bg-transparent border-none text-blue-600 hover:text-blue-800 active:underline focus:outline-none";
        resend.textContent = "Resend Link";
        msg.appendChild(resend);

        resend.addEventListener("click", async (e) => {
          e.preventDefault();
          const currentUser = auth.currentUser;
          if (currentUser && !currentUser.emailVerified) {
            await sendEmailVerification(currentUser);
            window.showSuccessMessage("A new verification link has been sent! Please check your email.");
          }
        });

        return; //stops execution if not verified
      }
      document.getElementById("email").classList.remove('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50');
      document.getElementById("password").classList.remove('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50');
      document.getElementById("logInSpinner").classList.remove("hidden");
      //proceed with login notification if gmail is verified
      const membersRef = collection(db, "Members");
      const snapshot = await getDocs(membersRef);
      let memberDocId = null;

      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.email === user.email) {
          memberDocId = doc.id;
        }
      });

      if (memberDocId) {
        const memberRef = doc(db, "Members", memberDocId);
        const memberSnap = await getDoc(memberRef);
        const data = memberSnap.data();

        //add first-login notification
        if (!data.firstLoginNotificationSent) {
          await addDoc(collection(db, "Members", memberDocId, "Notifications"), {
            title: "Welcome",
            message: "Welcome to SVConnect! You have successfully logged in. Explore your dashboard and manage your account with ease.",
            type: "login",
            createdAt: new Date(),
            seen: false
          });

          //mark notification as sent
          await updateDoc(memberRef, { firstLoginNotificationSent: true });
          console.log("First login notification saved!");
        }
      } else {
        console.log("Member document not found for email:", user.email);
      }
      
      document.getElementById("logInSpinner").classList.remove("hidden");
      window.showSuccessMessage("Login successful!");
      setTimeout(() => {
        window.location.href = "app.html";
      }, 2500);

    } catch (err) {
      console.error(err);
      msg.textContent = "Invalid email or password.";
      document.getElementById("email").classList.add('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50');
      document.getElementById("password").classList.add('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50');
    }
  });
}

if (forgotBtn) {
  forgotBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    // asks for email first, this is needed to get the id
    const email = prompt("Enter your email:");
    if (!email) return;

    //query firestore to find the member document by email
    const membersRef = collection(db, "Members");
    const qSnap = await getDocs(query(membersRef, where("email", "==", email)));
    if (qSnap.empty) {
      alert("Email not found. Please try again.");
      return;
    }

    const docSnap = qSnap.docs[0];
    const memberID = docSnap.id; //get the doc ID

    //ask for MPIN
    const userInputMPIN = prompt("Please enter your MPIN to continue:");
    if (!userInputMPIN) {
      alert("MPIN is required to proceed.");
      return;
    }

    //verify MPIN
    const isValid = await verifyMPIN(memberID, userInputMPIN);
    if (!isValid) {
      alert("Incorrect MPIN.");
      return;
    }
    
    try {
      await sendPasswordResetEmail(auth, email);
      window.showSuccessMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      console.error(err);
      alert("Invalid Email Address. Please try again.");
    }
  });
}

//for show pass
function setupPasswordToggle(toggleBtnId, passwordInputId) {
    const toggleBtn = document.getElementById(toggleBtnId);
    const passwordInput = document.getElementById(passwordInputId);
    
    if (toggleBtn && passwordInput) {
      toggleBtn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          passwordInput.type = 'password';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      });
    }
  }

  // Initialize password toggles for login
  setupPasswordToggle('toggleLoginPassword', 'password');

  // Initialize password toggles for register
  setupPasswordToggle('toggleRegPassword', 'password');
  setupPasswordToggle('toggleConfirmPassword', 'confirm');
  setupPasswordToggle('toggleMPINPassword', 'mpin');


// Privacy overlay functionality
const privacyOverlay = document.getElementById('privacyOverlay');
const openPrivacy = document.getElementById('openPrivacy');
const closePrivacy = document.getElementById('closePrivacy');

if (openPrivacy) {
  openPrivacy.addEventListener('click', () => {
    privacyOverlay.classList.remove('hidden');
    privacyOverlay.classList.add('flex');
  });
}

if (closePrivacy) {
  closePrivacy.addEventListener('click', () => {
    privacyOverlay.classList.add('hidden');
    privacyOverlay.classList.remove('flex');
  });
}

// Close when clicking outside the modal
if (privacyOverlay) {
  privacyOverlay.addEventListener('click', (e) => {
    if (e.target === privacyOverlay) {
      privacyOverlay.classList.add('hidden');
      privacyOverlay.classList.remove('flex');
    }
  });
}

// Generate a random 16-byte salt
function generateSalt() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2,'0')).join('');
}

// Hash MPIN + salt using SHA-256
async function hashMPIN(mpin, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(mpin + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
//verify the hashed mpin
export async function verifyMPIN(memberID, inputMPIN) {
  const docRef = doc(db, "Members", memberID);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return false;

  const { mpinHash, mpinSalt } = docSnap.data();
  const inputHash = await hashMPIN(inputMPIN, mpinSalt);

  return inputHash === mpinHash;
}