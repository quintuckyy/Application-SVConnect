import { auth } from "../services/firebase.js";
import { onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut, deleteUser } from "firebase/auth";
import { getMemberID, getMemberRef, updateName, deleteUserAcc, createNotification, showSpinner, hideSpinner, showSuccess, verifyMPIN } from "../services/firebaseFunctions.js";

export function Settings() {
    return`
    <nav class="mb-0 bg-gradient-to-r from-green-800 to-emerald-700 h-15 shadow md:flex md:items-center md:justify-between sticky top-0 z-50">
        <div class="h-16 flex justify-center items-center w-full py-3">

            <!-- Centered Title -->
            <h1 class="text-xl font-bold text-white tracking-wide">Settings</h1>

        </div>
    </nav>

    <!-- Wrapper for centering on large screens -->
    <div class="flex justify-center px-4">
        <!-- Main Card -->
        <div class="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md lg:max-w-2xl mt-6 space-y-6 border border-gray-100">
            <!-- Profile Section -->
            <div class="flex flex-col items-center space-y-3">

                <!-- Modern User Icon -->
                <div class="bg-gradient-to-r from-green-800 to-emerald-700 p-5 rounded-full shadow-md">
                    <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 
                        2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 
                        5v3h20v-3c0-3.3-6.7-5-10-5z"/>
                    </svg>
                </div>

                <p class="text-gray-600 font-medium">
                    Hey there, 
                    <span id="userName" class="text-green-600 font-semibold">Loading....</span>
                </p>
            </div>

            <!-- Display Name -->
            <div>
                <label for="displayNameInput" class="block text-gray-700 text-sm font-semibold mb-2">Display Name</label>
                <input id="displayNameInput" type="text" value="" 
                    class="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none shadow-sm">
                <button id="changeNameBtn" class="w-full mt-3 bg-gradient-to-r from-green-800 to-emerald-700 hover:bg-green-700 text-white font-semibold py-2 rounded-xl shadow-sm transition">
                    Save
                </button>
            </div>

            <!-- Security Section -->
            <div>
                <h2 class="text-gray-700 text-sm font-semibold mb-2">Security</h2>
                
                <!-- Change Password Toggle -->
                <button id="togglePasswordBtn" class="flex items-center justify-between w-full py-3 border-t border-b focus:outline-none">
                    <span class="text-gray-700">Change Password</span>
                    <ion-icon id="arrowIcon" name="chevron-forward-outline"
                            class="text-xl text-gray-500 transition-transform duration-200"></ion-icon>
                </button>

                <!-- Hidden Password Inputs -->
                <div id="passwordSection" class="hidden mt-3 space-y-4">
                    <form id="passForm" class="space-y-4">
                        <!-- Current Password -->
                        <div>
                            <label for="currentPassword" class="block text-gray-700 text-sm font-medium mb-2">Current Password</label>
                            <div class="relative">
                                <input required id="currentPassword" type="password" placeholder="Enter current password"
                                    class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-green-400 focus:border-green-500 outline-none shadow-sm transition-all">
                                <button type="button" id="toggleCurrentPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>

                        <!-- New Password -->
                        <div>
                            <label for="newPassword" class="block text-gray-700 text-sm font-medium mb-2">New Password</label>
                            <div class="relative">
                                <input required id="newPassword" type="password" placeholder="Enter new password"
                                    class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-green-400 focus:border-green-500 outline-none shadow-sm transition-all">
                                <button type="button" id="toggleNewPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Confirm Password -->
                        <div>
                            <label for="confirmPassword" class="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
                            <div class="relative">
                                <input required id="confirmPassword" type="password" placeholder="Re-enter new password"
                                    class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-green-400 focus:border-green-500 outline-none shadow-sm transition-all">
                                <button type="button" id="toggleConfirmPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>

                        <div id="msg" class="text-sm text-red-600 text-center font-semibold min-h-[20px]"></div>

                        <!-- Submit Button -->
                        <button type="submit" id="submitBtn" class="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 active:scale-95 transform">
                            <i class="fas fa-key mr-2"></i>Change Password
                        </button>
                    </form>    
                </div>
            </div>

            <!-- Account Section -->
            <div>
                <h2 class="text-gray-700 text-sm font-semibold mb-2">Account</h2>
                <button id="deleteBtn" class="mb-4 w-full border border-red-500 text-red-600 font-semibold py-2 rounded-xl hover:bg-red-50 transition shadow-sm">
                    Delete Account
                </button>
            </div>
        </div>
    </div>
    <div class="h-20"></div>
    `
}

export function initSettings() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                showSpinner();
                setupPasswordToggle('toggleCurrentPassword', 'currentPassword');
                setupPasswordToggle('toggleNewPassword', 'newPassword');
                setupPasswordToggle('toggleConfirmPassword', 'confirmPassword');
                const memberID = await getMemberID(user);
                const docSnap = await getMemberRef(memberID);

                const saveBtn = document.getElementById("changeNameBtn");
                document.getElementById("userName").textContent = docSnap.displayName
                document.getElementById("displayNameInput").value = docSnap.displayName
                hideSpinner();

                saveBtn.addEventListener("click", async (e) => {
                    e.preventDefault()
                    const userAppName = document.getElementById("displayNameInput").value

                    if (userAppName === "") {
                        alert("Name cannot be empty.");
                        return;
                    }

                    let result = confirm("Are you sure you want to change your display name?")
                    if (result) {
                        await updateName(memberID, userAppName);
                        showSuccess("Your app name has been changed.")
                        document.getElementById("userName").textContent = userAppName;
                    }
                })

                const button = document.getElementById("togglePasswordBtn");
                const section = document.getElementById("passwordSection");
                const icon = document.getElementById("arrowIcon");

                button.addEventListener("click", async (e) => {
                    e.preventDefault()
                    section.classList.toggle("hidden");
                    icon.name = section.classList.contains("hidden")
                        ? "chevron-forward-outline"
                        : "chevron-down-outline";
                });

                const passwordSaveBtn = document.getElementById("passForm");
                const deleteBtn = document.getElementById("deleteBtn");
                passwordSaveBtn.addEventListener("submit", async (e) => {
                    e.preventDefault();
                    await changePassword(user)
                    
                });

                deleteBtn.addEventListener("click", async (e) => {
                    e.preventDefault()
                    const result = confirm("Are you sure you want to delete your account? This action will permanently remove your account, including your registered email and MPIN. All associated data will be deleted and cannot be recovered.")
                    if (result) {
                        await deleteAccount(memberID)
                    }
                })

            } catch (err) {
                console.log(err)
            }
        }
    })
}

async function changePassword(user) {
    const memberID = await getMemberID(user);
    const currentPass = document.getElementById("currentPassword").value.trim();
    const newPass = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const msg = document.getElementById("msg");

    try {
        msg.textContent = "";

        if (newPass.length < 6) {
            msg.textContent = "Password must be at least 6 characters.";
            document.getElementById("newPassword").classList.add('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')
            document.getElementById("confirmPassword").classList.add('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')
            return;
        }

        document.getElementById("newPassword").classList.remove('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')
        document.getElementById("confirmPassword").classList.remove('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')

        if (newPass !== confirmPassword) {
            msg.textContent = "Passwords do not match.";
            document.getElementById("currentPassword").classList.add('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')
            document.getElementById("newPassword").classList.add('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')
            document.getElementById("confirmPassword").classList.add('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')
            return
        }

        document.getElementById("newPassword").classList.remove('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')
        document.getElementById("confirmPassword").classList.remove('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')

        if (newPass == currentPass) {
            msg.textContent = "New password must be different from current password.";
            document.getElementById("newPassword").classList.add('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')
            return
        }

        document.getElementById("newPassword").classList.remove('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')

        // 1. Re-authenticate the user
        const credential = EmailAuthProvider.credential(
            user.email,
            currentPass
        );
        showSpinner();
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPass);
        await createNotification(memberID,
            "Password Reset Successful",
            "You have successfully reset your password.",
            "passwordReset"
        )
        hideSpinner();
        showSuccess("Your password has been updated. Please Log-in")
        await logout()

    } catch (err) {
        console.log(err)
        document.getElementById("currentPassword").classList.add('border-red-400', 'ring-2', 'ring-red-400', 'ring-opacity-50')
        alert("Error updating password: The current password you entered is incorrect");
        hideSpinner();
    }
}

async function deleteAccount(memberID) {
    const user = auth.currentUser;
    try {
        //authenticate user first for security
        const currentPassword = prompt("Please enter your current password to confirm:");
        if (!currentPassword) {
            alert("Current Password is required to proceed.");
            return;
        }

        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        const userInputMPIN = prompt("Please enter your MPIN to continue:");
        if (!userInputMPIN) {
            alert("MPIN is required to proceed.");
            return;
        }

        //verify MPIN
        showSpinner();
        const isValid = await verifyMPIN(memberID, userInputMPIN);
        if (!isValid) {
            alert("Incorrect MPIN.");
            hideSpinner();
            return;
        }

        //delete user
        await deleteUser(user);
        await deleteUserAcc(memberID)
        await createNotification(memberID,
            "Gmail Removed",
            "Your Gmail account has been removed from the system.",
            "gmailRemoved"
        )
        
        showSuccess("Your account has been deleted successfully. Please Log-in");
        hideSpinner();
        setTimeout(() => {
            window.location.href = "index.html"; // redirect after deletion
        }, 2500);
    } catch (error) {
        console.error(error);

        if (error.code === "auth/wrong-password") {
            alert("The current password you entered is incorrect.");
        } else if (error.code === "auth/requires-recent-login") {
            alert("Please log in again to delete your account.");
        } else {
            alert("The current password you entered is incorrect.");
        }
    }
}

async function logout() {
    try {
        await signOut(auth);
        setTimeout(() => {
            window.location.href = "index.html";
        }, 3000);
    } catch (error) {
        console.error(error);
    }
}

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

