import { auth, db } from "./services/firebase.js";
import { getMemberID } from "./services/firebaseFunctions.js";
import { checkMemberId, linkMemberAccount, passwordResetChecksMpin, verifyPasswordResetMpin } from "./services/api.js";
import { askForInput, MPIN_FIELD } from "./services/dialog.js";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, collection, addDoc, updateDoc } from "firebase/firestore";

const signUp = document.getElementById("step2");
const registerUser = document.getElementById("registerBtn");
const loginUser = document.getElementById("loginForm");
const forgotBtn = document.getElementById("forgotPass");

if (registerUser) {
  //Verify Member
  registerUser.addEventListener("click", async (e) => {
    e.preventDefault();
    const id = document.getElementById("member_id").value.trim();
    const step2 = document.getElementById("step2");
    const message = document.getElementById("message");

    if (id == "") {
      message.textContent = "Please enter your Member ID";
      return;
    }

    try {
      const status = await checkMemberId(id);
      if (status !== "not_found") {
        if (status === "taken") {
          document
            .getElementById("member_id")
            .classList.add("border-red-400", "ring-2", "ring-red-400", "ring-opacity-50");
          message.textContent = "❌ This ID is taken. Please enter a different ID to continue.";
          return;
        }
        document
          .getElementById("member_id")
          .classList.remove("border-red-400", "ring-2", "ring-red-400", "ring-opacity-50");
        localStorage.setItem("currentMemberID", id);
        window.showSuccessMessage("Member ID Number Verified");
        step2.classList.remove("hidden");
        document.getElementById("step1").classList.add("hidden");
        message.textContent = "";
      } else {
        document
          .getElementById("member_id")
          .classList.add("border-red-400", "ring-2", "ring-red-400", "ring-opacity-50");
        message.textContent = "Member ID Number not found";
      }
    } catch (err) {
      console.error(err);
      message.textContent = "Error checking Member ID";
    }
  });
}

if (signUp) {
  //Create Account
  signUp.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirm = document.getElementById("confirm").value.trim();
    const mpin = document.getElementById("mpin").value.trim();

    const msg = document.getElementById("register_msg");
    const id = localStorage.getItem("currentMemberID");

    msg.textContent = "";

    if (!/^\d{4}$/.test(mpin)) {
      msg.textContent = "MPIN must be exactly 4 digits.";
      return;
    }

    if (password.length < 6) {
      msg.textContent = "Password must be at least 6 characters.";
      document.getElementById("password").classList.add("border-red-400", "ring-2", "ring-red-400", "ring-opacity-50");
      document.getElementById("confirm").classList.add("border-red-400", "ring-2", "ring-red-400", "ring-opacity-50");
      return;
    }

    document.getElementById("password").classList.remove("border-red-400", "ring-2", "ring-red-400", "ring-opacity-50");
    document.getElementById("confirm").classList.remove("border-red-400", "ring-2", "ring-red-400", "ring-opacity-50");

    if (password !== confirm) {
      msg.textContent = "Passwords do not match.";
      document.getElementById("password").classList.add("border-red-400", "ring-2", "ring-red-400", "ring-opacity-50");
      document.getElementById("confirm").classList.add("border-red-400", "ring-2", "ring-red-400", "ring-opacity-50");
      return;
    }

    document.getElementById("password").classList.remove("border-red-400", "ring-2", "ring-red-400", "ring-opacity-50");
    document.getElementById("confirm").classList.remove("border-red-400", "ring-2", "ring-red-400", "ring-opacity-50");

    let user;
    try {
      ({ user } = await createUserWithEmailAndPassword(auth, email, password));
      try {
        await linkMemberAccount(id, mpin);
      } catch (linkErr) {
        // Don't leave a login behind that isn't linked to any member
        await deleteUser(user).catch(() => {});
        throw linkErr;
      }

      await sendEmailVerification(user);
      window.showSuccessMessage(
        "Account successfully created. Please check your email for the verification link to complete your account setup.",
      );
      localStorage.removeItem("currentMemberID");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 3500);
    } catch (err) {
      console.error(err);
      msg.textContent =
        err.code === "auth/email-already-in-use"
          ? "That email is already registered. Sign in instead."
          : err.code === "auth/invalid-email"
            ? "Enter a valid email address."
            : err.message || "Registration failed. Please try again.";
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
        document.getElementById("email").classList.add("border-red-400", "ring-2", "ring-red-400", "ring-opacity-50");
        msg.textContent = "⚠️ Please verify your email before logging in. ";

        //create resend button if not verified
        const resend = document.createElement("button");
        resend.className =
          "bg-transparent border-none text-blue-600 hover:text-blue-800 active:underline focus:outline-none";
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
      document.getElementById("email").classList.remove("border-red-400", "ring-2", "ring-red-400", "ring-opacity-50");
      document
        .getElementById("password")
        .classList.remove("border-red-400", "ring-2", "ring-red-400", "ring-opacity-50");
      document.getElementById("logInSpinner").classList.remove("hidden");
      // Find this login's member: a token claim or a single uid lookup, not a scan of every member
      const memberDocId = await getMemberID(user).catch(() => null);

      if (memberDocId) {
        const memberRef = doc(db, "Members", memberDocId);
        const memberSnap = await getDoc(memberRef);
        const data = memberSnap.data();

        //add first-login notification
        if (!data.firstLoginNotificationSent) {
          await addDoc(collection(db, "Members", memberDocId, "Notifications"), {
            title: "Welcome",
            message:
              "Welcome to SVConnect! You have successfully logged in. Explore your dashboard and manage your account with ease.",
            type: "login",
            createdAt: new Date(),
            seen: false,
          });

          //mark notification as sent
          await updateDoc(memberRef, { firstLoginNotificationSent: true });
        }
      }

      document.getElementById("logInSpinner").classList.remove("hidden");
      window.showSuccessMessage("Login successful!");
      setTimeout(() => {
        window.location.href = "app.html";
      }, 2500);
    } catch (err) {
      console.error(err);
      msg.textContent = "Invalid email or password.";
      document.getElementById("email").classList.add("border-red-400", "ring-2", "ring-red-400", "ring-opacity-50");
      document.getElementById("password").classList.add("border-red-400", "ring-2", "ring-red-400", "ring-opacity-50");
    }
  });
}

if (forgotBtn) {
  forgotBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const input = await askForInput({
      title: "Reset your password",
      message: passwordResetChecksMpin
        ? "Enter the email you registered with and your MPIN. We'll email you a link to set a new password."
        : "Enter the email you registered with. We'll email you a link to set a new password.",
      fields: [
        { name: "email", label: "Email address", type: "email", autocomplete: "email" },
        ...(passwordResetChecksMpin ? [MPIN_FIELD] : []),
      ],
      submitLabel: "Send reset link",
    });
    if (!input) return;
    const { email, mpin } = input;

    try {
      // Checked on the server when Cloud Functions are on, with a lockout after 5 wrong tries.
      // The same message is shown for an unknown email and a wrong MPIN.
      await verifyPasswordResetMpin(email, mpin);
    } catch (err) {
      alert(err.message);
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
    toggleBtn.addEventListener("click", function () {
      const icon = this.querySelector("i");

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    });
  }
}

// Initialize password toggles for login
setupPasswordToggle("toggleLoginPassword", "password");

// Initialize password toggles for register
setupPasswordToggle("toggleRegPassword", "password");
setupPasswordToggle("toggleConfirmPassword", "confirm");
setupPasswordToggle("toggleMPINPassword", "mpin");

// Privacy overlay functionality
const privacyOverlay = document.getElementById("privacyOverlay");
const openPrivacy = document.getElementById("openPrivacy");
const closePrivacy = document.getElementById("closePrivacy");

if (openPrivacy) {
  openPrivacy.addEventListener("click", () => {
    privacyOverlay.classList.remove("hidden");
    privacyOverlay.classList.add("flex");
  });
}

if (closePrivacy) {
  closePrivacy.addEventListener("click", () => {
    privacyOverlay.classList.add("hidden");
    privacyOverlay.classList.remove("flex");
  });
}

// Close when clicking outside the modal
if (privacyOverlay) {
  privacyOverlay.addEventListener("click", (e) => {
    if (e.target === privacyOverlay) {
      privacyOverlay.classList.add("hidden");
      privacyOverlay.classList.remove("flex");
    }
  });
}
