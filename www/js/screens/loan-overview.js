import { whenSignedIn } from "../services/session.js";
import { assessLoan } from "../lib/loanStatus.js";
import { escapeHtml } from "../lib/html.js";

import {
  getMemberID,
  getMemberRef,
  getSavingsRef,
  getApprovedLoan,
  getPaymentRef,
} from "../services/firebaseFunctions.js";
import { showSpinner, hideSpinner, showError } from "../services/ui.js";

export function LoanOverview() {
  return `
    <!-- Pull to Refresh Indicator -->
    <div id="pullRefreshIndicator" class="fixed top-0 left-0 right-0 flex justify-center pointer-events-none z-[9998] transition-all duration-300" style="transform: translateY(-100px); opacity: 0;">
        <div class="bg-white rounded-full shadow-lg p-3 mt-20">
            <div class="w-8 h-8 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
        </div>
    </div>
<main id="mainContent">
    <div class="bg-gradient-to-r from-emerald-700 to-green-700 text-white px-4 pt-6 pb-8">
        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3">
                <button onclick="location.hash='#/home'" class="w-10 h-10 flex items-center justify-center backdrop-blur-sm">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <div>
                    <h1 class="text-lg font-semibold">Loan Overview</h1>
                    <p id="nameID" class="text-green-100 text-xs">Loading....</p>
                </div>
            </div>
        </div>

        <!-- Empty State for Balance Card -->
        <div id="balanceEmptyState" class="hidden bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20 text-center">
            <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <p class="text-white font-semibold mb-1">No Active Loan</p>
            <p class="text-green-100 text-sm">You don't have any active loans at the moment</p>
        </div>
        
        <!-- Total Balance Card -->
        <div id="balanceCard" class="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 border border-white border-opacity-20">
            <p class="text-green-100 text-sm mb-1">Remaining Balance</p>
            <p data-field="remainingBal" class="text-3xl font-bold mb-3">Loading....</p>
            <div class="flex items-center space-x-2 mb-4">
                <span data-field="totalLoan" class="text-green-200 text-sm">Total Loan: Loading....</span>
            </div>
            <div class="mb-3"> 
                <div id="progressBar" class="progress-bar h-2 rounded-full mb-2"></div>
                <p id="progressText" class="text-sm text-white text-opacity-90">0.0% Completed</p>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 -mt-4">

        <!-- Empty State for Loan Details -->
        <div id="loanDetailsEmptyState" class="hidden bg-white rounded-2xl shadow-lg mb-4 overflow-hidden">
            <div class="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                <h2 class="text-lg font-semibold text-gray-800">Loan Details</h2>
            </div>
            
            <div class="p-8 text-center">
                <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <p class="text-gray-700 font-semibold mb-1">No Loan Details</p>
                <p class="text-gray-500 text-sm">Loan information will appear here once available</p>
            </div>
        </div>

        <!-- Loan Details Card -->
        <div id="loanDetailsCard" class="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden">
            <div class="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                <h2 class="text-lg font-semibold text-gray-800">Loan Details</h2>
            </div>

            <div class="p-4">
                <!-- Loan Type & Status -->
                <div class="flex space-x-3 mb-4">
                    <div class="flex-1 bg-gray-50 rounded-lg p-3">
                        <p class="text-xs text-gray-500 mb-1">Loan Type</p>
                        <p data-field="loanType" class="text-sm font-semibold text-gray-800">Loading....</p>
                    </div>
                    <div class="flex-1 bg-green-50 rounded-lg p-3">
                        <p class="text-xs text-gray-500 mb-1">Status</p>
                        <div class="flex items-center">
                            <span class="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                            <p data-field="loanStat" class="text-sm font-semibold text-green-700">Loading....</p>
                        </div>
                    </div>
                </div>

                <!-- Payment Info -->
                <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-4 border border-blue-100">
                    <p class="text-xs text-green-700 mb-1">Monthly Payment</p>
                    <p data-field="monthlyPay" class="text-2xl font-bold text-green-800 mb-2">Loading....</p>
                    <div class="flex items-center justify-between text-xs">
                        <span data-field="interestRate" class="text-green-600">Loading....</span>
                        <span class="text-gray-500">Next Due: <span id="nextDue">Loading....</span></span>
                    </div>
                </div>

                <!-- Loan Details Grid -->
                <div class="space-y-3 mb-4">
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Start Date</span>
                        <span data-field="startDate" class="text-sm font-semibold text-gray-800">Loading....</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Loan Term</span>
                        <span data-field="loanTerm" class="text-sm font-semibold text-gray-800">Loading....</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Principal</span>
                        <span data-field="principal" class="text-sm font-semibold text-gray-800">Loading....</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Monthly Interest</span>
                        <span data-field="monthInterest" class="text-sm font-semibold text-gray-800">Loading....</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Savings Build-up</span>
                        <span data-field="savingsBuildUp" class="text-sm font-semibold text-gray-800">Loading....</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Share Capital Build-up</span>
                        <span data-field="shareCapitalBuildUp" class="text-sm font-semibold text-gray-800">Loading....</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Total Paid</span>
                        <span data-field="totalPaid" class="text-sm font-semibold text-green-700">Loading....</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Penalties</span>
                        <span data-field="penalty" class="text-sm font-semibold text-red-600">Loading....</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Payment History Card -->
        <div class="bg-white rounded-2xl shadow-lg mb-4 max-h-80 overflow-y-auto">
            <div class="shadow-sm sticky top-0 z-1 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                <div class="flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-gray-800">Payment History</h2>
                    <div class="flex space-x-2">
                    </div>
                </div>
            </div>

            <div class="p-4">

                <div id="paymentBody"></div>
                <!-- Empty State -->
                <div id="emptyState" class="text-center py-8">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <p class="text-gray-500 font-medium">No payment history yet</p>
                    <p class="text-xs text-gray-400 mt-1">Payment records will appear here</p>
                </div>

            </div>
            
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 gap-3 mb-6">
            <div class="bg-white rounded-xl shadow p-4">
                <div class="flex items-center justify-between mb-2">
                    <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                </div>
                <p class="text-xs text-gray-500 mb-1">Payments Made</p>
                <p data-field="payments" class="text-lg font-bold text-gray-800"></p>
            </div>

            <div class="bg-white rounded-xl shadow p-4">
                <div class="flex items-center justify-between mb-2">
                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                </div>
                <p class="text-xs text-gray-500 mb-1">Months Remaining</p>
                <p data-field="monthsRemaining" class="text-lg font-bold text-gray-800"></p>
            </div>
        </div>
        <button onclick="location.hash='#/completedLoans'" class="shadow-xl mb-10 h-16 w-full bg-gradient-to-r from-emerald-700 to-green-700 hover:bg-opacity-30 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2 transition-all">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm font-medium text-white">Completed Loans</span>
        </button>
    </div>
</main>
    `;
}

export function initLoanOverview() {
  whenSignedIn(async (user) => {
    if (user) {
      initPullToRefresh();
      showSpinner();
      const balanceCard = document.getElementById("balanceCard");
      const loanDetailsCard = document.getElementById("loanDetailsCard");
      const balanceEmptyState = document.getElementById("balanceEmptyState");
      const loanDetailsEmptyState = document.getElementById("loanDetailsEmptyState");

      const memberID = await getMemberID(user);
      const docSnap = await getMemberRef(memberID);
      const loanDoc = await getApprovedLoan(memberID);
      document.getElementById("nameID").textContent = `${docSnap.displayName} • ID: ${memberID}`;
      hideSpinner();
      if (!loanDoc || loanDoc.length === 0) {
        balanceEmptyState.classList.remove("hidden");
        loanDetailsEmptyState.classList.remove("hidden");
        balanceCard.classList.add("hidden");
        loanDetailsCard.classList.add("hidden");
        return;
      }

      balanceEmptyState.classList.add("hidden");
      loanDetailsEmptyState.classList.add("hidden");
      balanceCard.classList.remove("hidden");
      loanDetailsCard.classList.remove("hidden");

      try {
        checkOverDue(memberID);
        if (!loanDoc) return; //if there are no approvedLoans
        const savingsDoc = await getSavingsRef(memberID);
        const term = parseInt(loanDoc.loanTerms);
        const rawInterest = Number(loanDoc.monthlyInterest);
        const cleanValue = Math.abs(rawInterest);

        const dateIndex = parseInt(loanDoc.dueDateIndex);
        if (dateIndex <= term) {
          document.getElementById("nextDue").textContent = `${loanDoc.dueDate[dateIndex]}`;
        }

        const userData = {
          remainingBal: `₱${Number(loanDoc.remainingBalance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          totalLoan: `Total Loan: ₱${Number(loanDoc.totalLoan).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          loanStat: loanDoc.loanStatus,
          loanType: loanDoc.loanType,
          monthInterest: `₱${cleanValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          startDate: loanDoc.startDate.toDate().toLocaleDateString(),
          loanTerm: `${term} Months`,
          interestRate: `${Number(loanDoc.interestRate * 100).toFixed(2)}%p.a.`,
          monthlyPay: `₱${Number(loanDoc.monthlyPayment).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          totalPaid: `₱${Number(loanDoc.totalPaid).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          penalty: `₱${Number(loanDoc.penalties).toFixed(2)}`,
          savingsBuildUp: `₱${Number(savingsDoc.savingsBuildUp).toFixed(2)}`,
          shareCapitalBuildUp: `₱${Number(savingsDoc.capitalBuildUp).toFixed(2)}`,
          principal: `₱${Number(loanDoc.principal).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          payments: loanDoc.dueDateIndex,
          monthsRemaining: loanDoc.monthsRemaining,
        };

        document.querySelectorAll("[data-field]").forEach((el) => {
          const field = el.dataset.field;
          el.textContent = userData[field];
        });

        const totalPayment = Number(loanDoc.totalPayment); //logical error, should be based from totalLoan with interest
        const totalPaid = Number(loanDoc.totalPaid);
        const progressPercentage = (totalPaid / totalPayment) * 100;

        const progressBar = document.getElementById("progressBar");
        progressBar.style.background = `linear-gradient(90deg, #ffffff ${progressPercentage}%, rgba(255,255,255,0.3) ${progressPercentage}%)`;

        document.getElementById("progressText").textContent = `${progressPercentage.toFixed(1)}% Completed`;
        renderPayHistory(memberID);
      } catch (err) {
        console.error(err);
        hideSpinner();
        showError("Your loan details couldn't be loaded. Check your connection and try again.");
      }
    }
  });
}

async function renderPayHistory(memberID) {
  const paymentBody = document.getElementById("paymentBody");
  const emptyState = document.getElementById("emptyState");
  paymentBody.innerHTML = ``;
  const paymentSnap = await getPaymentRef(memberID);

  if (!paymentSnap || paymentSnap.length === 0) {
    emptyState.classList.remove("hidden");
    paymentBody.classList.add("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  paymentBody.classList.remove("hidden");

  paymentSnap.forEach((pay) => {
    const formattedDate = pay.paymentDate.toDate().toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const paymentContainer = document.createElement("div");
    paymentContainer.innerHTML = `
        <div class="space-y-3">
            <div class="flex justify-between items-center py-2">
                <div>
                    <p class="font-semibold text-gray-900">${formattedDate}</p>
                    <p class="text-xs text-gray-500">Payment ${escapeHtml(Number(pay.paymentIndex) + 1)}</p>
                </div>
                <div class="text-right">
                    <p class="font-semibold text-green-600">₱${pay.paymentAmt.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p class="text-sm text-gray-500">Remaining: ₱${Number(pay.remainingBal).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            </div>
        </div>
        `;
    paymentBody.appendChild(paymentContainer);
  });
}

async function checkOverDue(memberID) {
  try {
    const loanDoc = await getApprovedLoan(memberID);
    if (!loanDoc) return; //if there are no approvedLoans
    const payments = await getPaymentRef(memberID);
    if (assessLoan(loanDoc, payments, new Date()).overdue) {
      alert("⚠️Loan Overdue.");
    }
  } catch (err) {
    console.error("Overdue check failed:", err);
  }
}

function initPullToRefresh() {
  const mainContent = document.getElementById("mainContent");
  const indicator = document.getElementById("pullRefreshIndicator");
  let startY = 0;
  let currentY = 0;
  let isPulling = false;
  const pullThreshold = 80; //distance needed to trigger refresh

  mainContent.addEventListener(
    "touchstart",
    (e) => {
      //only enable pull-to-refresh if at the top of the page
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    },
    { passive: true },
  );

  mainContent.addEventListener(
    "touchmove",
    (e) => {
      if (!isPulling) return;

      currentY = e.touches[0].clientY;
      const pullDistance = currentY - startY;

      //only show indicator when pulling down
      if (pullDistance > 0 && window.scrollY === 0) {
        // Don't prevent default to allow normal scrolling

        //calculate transform and opacity based on pull distance
        const progress = Math.min(pullDistance / pullThreshold, 1);
        const translateY = Math.min(pullDistance * 0.5, 60);

        // Remove transition during drag for smooth movement
        indicator.style.transition = "none";
        indicator.style.transform = `translateY(${translateY - 100}px)`;
        indicator.style.opacity = progress;
      }
    },
    { passive: true },
  );

  mainContent.addEventListener("touchend", async () => {
    if (!isPulling) return;

    const pullDistance = currentY - startY;

    // Re-enable transitions for smooth animation
    indicator.style.transition = "all 0.3s ease";

    // Reset pulling state
    isPulling = false;

    // If pulled past threshold, trigger refresh
    if (pullDistance > pullThreshold && window.scrollY === 0) {
      indicator.style.transform = "translateY(10px)";
      indicator.style.opacity = "1";

      // Hide the indicator, then reload the page to fetch fresh loan data
      setTimeout(() => {
        indicator.style.transform = "translateY(-100px)";
        indicator.style.opacity = "0";

        // Reload after animation completes
        setTimeout(() => {
          location.reload();
        }, 300);
      }, 500);
    } else {
      // Reset indicator immediately if threshold not met
      indicator.style.transform = "translateY(-100px)";
      indicator.style.opacity = "0";
    }

    startY = 0;
    currentY = 0;
  });
}
/*async function checkCompletion(memberID, loanID) {
    try {
        const loanRef = doc(db, "Members", memberID, "approvedLoans", loanID);
        const completedRef = doc(db, "Members", memberID, "completedLoans", loanID);
        const loanSnap = await getDoc(loanRef);
        const loanDoc = await getApprovedLoan(memberID);

        if (loanSnap.data()?.loanStatus === "Completed") {
            return; // Exit early - already processed
        }

        await updateDoc(loanRef, {
            loanStatus: "Completed",
            monthInterest: 0.0,
            monthlyPayment: 0.0,
            principalBalance: 0.0,
        })

        await setDoc(completedRef, {
            ...loanSnap.data(),
            status: "Completed",
            completionDate: new Date()
        })

        await createNotification(memberID,
            "Loan Fully Paid!",
            `🎉 Congratulations! Your ${loanDoc.loanType} is now fully paid and officially completed. Thank you for your consistent payments.`,
            "loanCompleted"
        )

        // delete loan application (1 doc, but ID ≠ loanID)
        const appCol = collection(db, "Members", memberID, "loanApplications");
        const appQ = query(appCol, where("loanID", "==", loanID));
        const appSnap = await getDocs(appQ);
        appSnap.forEach(a => deleteDoc(doc(db, "Members", memberID, "loanApplications", a.id)));

        // delete payment history (many docs)
        const payCol = collection(db, "Members", memberID, "paymentHistory");
        const payQ = query(payCol, where("loanID", "==", loanID));
        const paySnap = await getDocs(payQ);
        paySnap.forEach(p => deleteDoc(doc(db, "Members", memberID, "paymentHistory", p.id)));

        await deleteDoc(loanRef);

    } catch (err) {
        console.log(err)
    }
}*/
