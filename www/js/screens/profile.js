import { auth } from "../services/firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  getMemberID,
  getMemberRef,
  formatDate,
  showSpinner,
  hideSpinner,
  showSuccess,
} from "../services/firebaseFunctions.js";

export function Profile() {
  return `
        <div class="rounded-b-2xl bg-gradient-to-r from-green-800 to-emerald-700 text-white px-6 py-8 shadow-lg">
        <div class="max-w-4xl mx-auto">
            <div class="flex items-center mb-6">
                <div class=" hover:bg-white/10 p-2 rounded-lg transition">
                </div>
                <h1 class="text-2xl font-bold">Profile</h1>
            </div>
            
            <!-- Profile Header -->
            <div class="flex items-center space-x-6">
                <div class="relative">
                    <div class="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
                        <i class="fas fa-user text-4xl text-white"></i>
                    </div>
                </div>
                <div class="flex-1">
                    <h2 data-field="userName" class="text-2xl font-bold mb-1">Loading...</h2>
                    <p data-field="memberSince" class="text-green-100 text-sm">Member since Loading...</p>
                    <div class="flex items-center mt-2 space-x-4">
                        <span class="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                            <i class="fas fa-shield-alt mr-1"></i> Registered
                        </span>
                        <span class=" px-3 py-1 rounded-full text-xs font-medium">
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-6 py-6 -mt-4">
        <!-- Personal Information Card -->
        <div class="bg-white rounded-2xl shadow-md p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-gray-800">Personal Information</h3>
            </div>
            
            <div class="space-y-4">
                <div class="flex items-start">
                    <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-4">
                        <i class="fas fa-map-marker-alt text-green-700"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-gray-500">Address</p>
                        <p data-field="address" class="text-gray-800 font-medium">Loading...</p>
                    </div>
                </div>
                
                <div class="flex items-start">
                    <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-4">
                        <i class="fas fa-phone text-green-700"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-gray-500">Phone Number</p>
                        <p data-field="mobile" class="text-gray-800 font-medium">Loading...</p>
                    </div>
                </div>
                
                <div class="flex items-start">
                    <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-4">
                        <i class="fas fa-envelope text-green-700"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-gray-500">Email</p>
                        <p data-field="email" class="text-gray-800 font-medium">Loading...</p>
                    </div>
                </div>
                
                <div class="flex items-start">
                    <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-4">
                        <i class="fas fa-id-badge text-green-700"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-gray-500">Member ID</p>
                        <p data-field="memberID" class="text-gray-800 font-medium">Loading...</p>
                    </div>
                </div>
                
                <div class="flex items-start">
                    <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-4">
                        <i class="fas fa-calendar text-green-700"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-gray-500">Date of Birth</p>
                        <p data-field="birthday" class="text-gray-800 font-medium">Loading...</p>
                    </div>
                </div>
                
                <div class="flex items-start">
                    <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-4">
                        <i class="fas fa-venus-mars text-green-700"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-gray-500">Sex</p>
                        <p data-field="sex" class="text-gray-800 font-medium">Loading...</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Support & Help Card -->
        <div class="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Support & Help</h3>
            
            <div class="space-y-3">
                <button onclick="location.hash='#/customerSupport'" class="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition group">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-100 transition">
                            <i class="fas fa-headset text-green-700"></i>
                        </div>
                        <div class="text-left">
                            <p class="font-medium text-gray-800">Contact Support</p>
                            <p class="text-sm text-gray-500">Get help from our team</p>
                        </div>
                    </div>
                    <i class="fas fa-chevron-right text-gray-400"></i>
                </button>
                
                <button onclick="location.hash='#/FAQs'" class="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition group">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-100 transition">
                            <i class="fas fa-question-circle text-green-700"></i>
                        </div>
                        <div class="text-left">
                            <p class="font-medium text-gray-800">FAQs</p>
                            <p class="text-sm text-gray-500">Find answers to common questions</p>
                        </div>
                    </div>
                    <i class="fas fa-chevron-right text-gray-400"></i>
                </button>
            </div>
        </div>

        <!-- Logout Button -->
        <button id="logoutBtn" class="w-full bg-red-100 hover:bg-red-100 text-red-600 font-medium py-4 rounded-xl transition flex items-center justify-center mb-6">
            <i class="fas fa-sign-out-alt mr-2"></i>
            Logout
        </button>
    </div>
    <div class="h-16"></div>
    `;
}

export function initProfileDashboard() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        showSpinner();
        const memberID = await getMemberID(user);
        const docSnap = await getMemberRef(memberID);
        const membershipDate = docSnap.createdAt;
        const formattedDate = membershipDate.toDate().toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });

        const userData = {
          userName: docSnap.displayName,
          address: docSnap.address,
          mobile: docSnap.contact,
          email: docSnap.email,
          memberSince: `Member Since ${formattedDate}`,
          memberID: memberID,
          birthday: formatDate(docSnap.birthDate),
          sex: docSnap.sex,
        };
        hideSpinner();
        document.querySelectorAll("[data-field]").forEach((el) => {
          const field = el.dataset.field;
          el.textContent = userData[field];
        });
        const logoutBtn = document.getElementById("logoutBtn");
        logoutBtn.addEventListener("click", async (e) => {
          e.preventDefault();
          await logout();
        });
      } catch (err) {
        console.log(err);
      }
    }
  });
}

async function logout() {
  try {
    await signOut(auth);
    showSuccess("You’ve been logged out.");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  } catch (error) {
    console.error(error);
  }
}
