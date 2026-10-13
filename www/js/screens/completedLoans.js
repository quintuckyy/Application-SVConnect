import { auth } from "../services/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import {
  getMemberID,
  getMemberRef,
  getCompletedLoansRef,
  formatDate,
  showSpinner,
  hideSpinner,
} from "../services/firebaseFunctions.js";

export function CompletedLoans() {
  return `
        <div class="bg-gradient-to-r from-green-800 to-emerald-700 text-white px-4 pt-6 pb-8">
        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3">
                <button onclick="location.hash='#/home'" class="w-10 h-10 flex items-center justify-center backdrop-blur-sm">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <div>
                    <h1 class="text-lg font-semibold">Completed Loans</h1>
                    <p class="text-green-100 text-xs">Your loan history</p>
                </div>
            </div>
        </div>

        <div class="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 border border-white border-opacity-20">
            <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                    <span id="memberInitials" class="text-white text-lg font-bold">JD</span>
                </div>
                <div class="flex-1">
                    <p id="memberName" class="text-white font-semibold text-base">Loading....</p>
                    <p class="text-green-100 text-xs">Member ID: <span id="memberId">Loading....</span></p>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 -mt-4 pb-6">
        <!-- Completed Loans List -->
        <div id="completedLoansList" class="space-y-3">
            
            <!-- Sample Loan Card 1 -->
            <div id="loanCardBody"></div>

        <!-- Empty State (hidden when there are loans) -->
        <div id="emptyState" class="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">No Completed Loans</h3>
            <p class="text-sm text-gray-500">You haven't completed any loans yet.</p>
            <p class="text-xs text-gray-400 mt-1">Completed loans will appear here</p>
        </div>
    </div>
    `;
}

export function initCompletedLoans() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        showSpinner();
        const memberID = await getMemberID(user);
        const docSnap = await getMemberRef(memberID);

        document.getElementById("memberName").textContent = docSnap.displayName;
        document.getElementById("memberId").textContent = memberID;
        document.getElementById("memberInitials").textContent = docSnap.displayName
          .split(" ")
          .map((n) => n[0])
          .join("");
        hideSpinner();
        renderCompletedLoans(memberID);
      } catch (err) {
        console.log(err);
      }
    }
  });
}

async function renderCompletedLoans(memberID) {
  try {
    const loanCardBody = document.getElementById("loanCardBody");
    const emptyState = document.getElementById("emptyState");
    loanCardBody.innerHTML = ``;
    const completedLoanSnap = await getCompletedLoansRef(memberID);

    if (!completedLoanSnap || completedLoanSnap.length === 0) {
      emptyState.classList.remove("hidden");
      loanCardBody.classList.add("hidden");
      return;
    }

    emptyState.classList.add("hidden");
    loanCardBody.classList.remove("hidden");

    completedLoanSnap.forEach((compLoan) => {
      const loanContainer = document.createElement("div");
      loanContainer.innerHTML = `
                <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
                    <div class="p-4">
                        <div class="flex items-start justify-between mb-3">
                            <div class="flex-1">
                                <div class="flex items-center space-x-2 mb-1">
                                    <h3 class="text-base font-semibold text-gray-800">${compLoan.loanType}</h3>
                                    <span class="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full flex items-center">
                                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                        </svg>
                                        Paid
                                    </span>
                                </div>
                                <p class="text-xs text-gray-500">Completion Date: ${formatDate(compLoan.completionDate)}</p>
                            </div>
                        </div>

                        <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 mb-3 border border-green-100">
                            <div class="flex justify-between items-center">
                                <div>
                                    <p class="text-xs text-gray-600 mb-0.5">Principal Amount</p>
                                    <p class="text-lg font-bold text-gray-800">₱${Number(compLoan.totalLoan).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-xs text-gray-600 mb-0.5">Total Paid</p>
                                    <p class="text-lg font-bold text-green-700">₱${Number(compLoan.totalPaid).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p class="text-xs text-gray-500 mb-0.5">Started</p>
                                <p class="font-semibold text-gray-800">${formatDate(compLoan.dateApproved)}</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 mb-0.5">Duration</p>
                                <p class="font-semibold text-gray-800">${compLoan.loanTerms}</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 mb-0.5">Interest Rate</p>
                                <p class="font-semibold text-gray-800">${compLoan.interestRate}</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 mb-0.5">Interest Paid</p>
                                <p class="font-semibold text-red-600">₱${Number(compLoan.totalInterest).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
      loanCardBody.appendChild(loanContainer);
      hideSpinner();
    });
  } catch (err) {
    console.log(err);
  }
}
