import { auth } from "../services/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";;
import { getLoanRef, getMemberID, getMemberRef } from "../services/firebaseFunctions.js";

export function LoanMenu() {
    return`
    <!-- NAV -->
    <nav class="p-4 flex items-center">

      <button onclick="location.hash='#/home'" class="p-2 transition">
        <img src="img/back.png" class="w-6 h-6" alt="">
      </button>
    </nav>

  <!-- MAIN CONTENT -->
  <div class="flex justify-center px-6 mt-2">
    <div class="w-full max-w-md bg-white rounded-3xl shadow-xl p-6">

      <h1 class="text-3xl font-extrabold text-center mb-6 text-gray-800 tracking-wide">
        Manage Your Loans
      </h1>

      <!-- Card Illustration -->
      <div class="flex justify-center mb-6">
        <div class="w-28 h-28 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
          <ion-icon name="wallet-outline" class="text-white text-5xl"></ion-icon>
        </div>
      </div>

      <!-- Buttons Section -->
      <div class="space-y-4">

        <!-- Apply Loan -->
          <button id="applyLoanBtn" onclick="location.hash='#/loanType'"
                  class="w-full flex items-center justify-center gap-3 
                         bg-gradient-to-r from-blue-600 to-blue-500 
                         text-white py-3 rounded-xl font-semibold 
                         shadow hover:shadow-lg hover:scale-[1.02] active:scale-95 transition">
            <ion-icon name="document-text-outline" class="text-2xl"></ion-icon>
            Apply for a Loan
          </button>

        <!-- View Loans -->
          <button onclick="location.hash='#/loan-overview'"
                  class="w-full flex items-center justify-center gap-3
                         bg-gradient-to-r from-green-600 to-green-500
                         text-white py-3 rounded-xl font-semibold 
                         shadow hover:shadow-lg hover:scale-[1.02] active:scale-95 transition">
            <ion-icon name="list-circle-outline" class="text-2xl"></ion-icon>
            View Your Loan
          </button>
      </div>
    </div>
  </div>
    `
}

export function initLoans() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const memberID = await getMemberID(user);
        const loanSnap = await getLoanRef(memberID);
        
        const applyLoanBtn = document.getElementById("applyLoanBtn");
        
        if (!loanSnap.empty) {
          // Disable button if there's an existing loan
          applyLoanBtn.disabled = true;
          applyLoanBtn.classList.remove("from-blue-600", "to-blue-500", "hover:shadow-lg", "hover:scale-[1.02]", "active:scale-95");
          applyLoanBtn.classList.add("from-gray-400", "to-gray-400", "opacity-60", "cursor-not-allowed");
          applyLoanBtn.innerHTML = `
            <ion-icon name="lock-closed-outline" class="text-2xl"></ion-icon>
            Existing Loan Application
          `;
        } else {
          // Enable button if no existing loan
          applyLoanBtn.addEventListener("click", () => {
            location.hash = '#/loanType';
          });
        }
      } catch (err) {
        console.log(err)
      }
    }
  })
}