import { whenSignedIn } from "../services/session.js";

import { getMemberID, getMemberRef, getSavingsRef } from "../services/firebaseFunctions.js";
import { showSpinner, hideSpinner, showError } from "../services/ui.js";

export function Savings() {
  return `
        <!-- Header -->
        <div class="bg-gradient-to-r from-green-800 to-emerald-700 text-white px-4 pt-6 pb-8">
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center space-x-3">
                    <button class="rounded-lg from-blue-600 to-indigo-600">
                        <button onclick="location.hash='#/home'">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                        </button> 
                    </button>
                    <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-lg font-bold backdrop-blur-sm">
                        <span data-field="userProfile" class="text-white font-bold text-sm"></span>
                    </div>
                    <div>
                        <h1 data-field="name" class="text-lg font-semibold">Loading....</h1>
                        <p data-field="userID" class="text-blue-100 text-xs">Loading....</p>
                    </div>
                </div>
            </div>
            
            <!-- Total Balance Card -->
            <div class="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 border border-white border-opacity-20">
                <p class="text-blue-100 text-sm mb-1">Total Assets</p>
                <p data-field="totalAssets" class="text-3xl font-bold mb-3">Loading....</p>
                <div class="flex items-center space-x-2">
                    <span class="text-blue-200 text-sm">Member Since:</span>
                    <span data-field="memberSince" class="text-green-200 text-xs">Loading....</span>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="px-4 -mt-4">
            <!-- Savings Account Card -->
            <div class="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden">
                <div class="p-4 bg-green-50 border-b border-blue-100">
                    <h2 class="text-lg font-semibold text-gray-800">Savings Account</h2>
                </div>
                
                <div class="p-4">
                    <!-- Account Number -->
                    <div class="mb-4">
                        <p class="text-xs text-gray-500 mb-1">Account Number</p>
                        <p data-field="accNum" class="text-base font-semibold text-gray-800">Loading....</p>
                    </div>

                    <!-- Account Type & Status -->
                    <div class="flex space-x-3 mb-4">
                        <div class="flex-1 bg-gray-50 rounded-lg p-3">
                            <p class="text-xs text-gray-500 mb-1">Type</p>
                            <p data-field="accType" class="text-sm font-semibold text-gray-800">Loading....</p>
                        </div>
                        <div class="flex-1 bg-green-50 rounded-lg p-3">
                            <p class="text-xs text-gray-500 mb-1">Status</p>
                            <div class="flex items-center">
                                <span class="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                                <p data-field="savingsStat" class="text-sm font-semibold text-green-700">Loading....</p>
                            </div>
                        </div>
                    </div>

                    <!-- Balance -->
                    <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-4 border border-green-100">
                        <p class="text-xs text-green-700 mb-1">Current Balance</p>
                        <p data-field="currentBal" class="text-2xl font-bold text-green-800 mb-2">Loading....</p>
                        <div class="flex items-center justify-between text-xs">
                            <span data-field="interestRate" class="text-green-600">Loading....</span>
                            <span data-field="dateOpened" class="text-gray-500">Loading....</span>
                        </div>
                    </div>

                    <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-4 border border-green-100">
                        <p class="text-xs text-green-700 mb-1">Loan Disbursed Amount</p>
                        <p data-field="disbursedAmount" class="text-2xl font-bold text-green-800 mb-2">Loading....</p>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Savings Build-up</span>
                        <span data-field="savingsBuildUp" class="text-sm font-semibold text-gray-800">₱0.0</span>
                    </div>
                </div>
            </div>

            <!-- Share Capital Card -->
            <div class="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden">
                <div class="p-4 bg-green-50 border-b border-purple-100">
                    <h2 class="text-lg font-semibold text-gray-800">Share Capital</h2>
                </div>
                
                <div class="p-4">
                    <!-- Share Capital Amount -->
                    <div class="bg-green-50 rounded-xl p-4 mb-4 border border-purple-100">
                        <p class="text-xs text-green-700 mb-1">Total Share Capital</p>
                        <p data-field="shareCapital" class="text-2xl font-bold text-green-800">Loading....</p>
                        <div class="mt-2 inline-block bg-green-200 text-green-800 rounded-full px-3 py-1">
                            <span class="text-xs font-semibold">✓ Fully Paid</span>
                        </div>
                    </div>

                    <!-- Share Details -->
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Number of Shares</span>
                            <span data-field="shares" class="text-sm font-semibold text-gray-800">Loading....</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Par Value</span>
                            <span data-field="parValue" class="text-sm font-semibold text-gray-800">Loading....</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Capital Build-up</span>
                            <span data-field="capitalBuildUp" class="text-sm font-semibold text-gray-800">₱0.0</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Dividends (2024)</span>
                            <span data-field="dividends" class="text-sm font-semibold text-purple-700">Loading....</span>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    `;
}

export function initSavingsOverview() {
  whenSignedIn(async (user) => {
    if (user) {
      try {
        showSpinner();
        const memberID = await getMemberID(user);
        const docSnap = await getMemberRef(memberID);
        const savingsDoc = await getSavingsRef(memberID);
        const membershipDate = docSnap.createdAt;
        const formattedDate = membershipDate.toDate().toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });

        const userData = {
          name: docSnap.displayName,
          userID: `ID: ${memberID}`,
          userProfile: docSnap.displayName
            .split(" ")
            .map((n) => n[0])
            .join(""),
          accNum: savingsDoc.accountNumber,
          accType: savingsDoc.accountType,
          savingsStat: savingsDoc.status,
          currentBal: `₱${Number(savingsDoc.balance).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
          interestRate: `${savingsDoc.interestRate * 100}.00% interest p.a.`,
          dateOpened: `Opened: ${savingsDoc.createdAt.toDate().toLocaleDateString()}`,
          shareCapital: `₱${Number(docSnap.shareCapital).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
          totalAssets: `₱${Number(savingsDoc.totalAssets).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
          disbursedAmount: `₱${Number(savingsDoc.disbursedAmount).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
          parValue: `₱${Number(savingsDoc.ParValue).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
          dividends: `${savingsDoc.dividends * 100}%`,
          shares: savingsDoc.numberOfShares,
          memberSince: formattedDate,
          savingsBuildUp: `₱${Number(savingsDoc.savingsBuildUp).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
          capitalBuildUp: `₱${Number(savingsDoc.capitalBuildUp).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
        };

        document.querySelectorAll("[data-field]").forEach((el) => {
          const field = el.dataset.field;
          el.textContent = userData[field];
        });
        hideSpinner();
        /*document.getElementById("name").textContent = docSnap.displayName
                document.getElementById("userID").textContent = `ID: ${memberID}`
                document.getElementById("userProfile").innerHTML = docSnap.displayName.split(' ').map(n => n[0]).join('')
                document.getElementById("accNum").textContent = savingsDoc.accountNumber
                document.getElementById("accType").textContent = savingsDoc.accountType
                document.getElementById("savingsStat").textContent = savingsDoc.status
                document.getElementById("currentBal").textContent = `₱${Number(savingsDoc.balance).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
                document.getElementById("interestRate").textContent = `${savingsDoc.interestRate*100}.00% interest p.a.`
                document.getElementById("dateOpened").textContent = `Opened: ${savingsDoc.createdAt.toDate().toLocaleDateString()}`
                document.getElementById("shareCapital").textContent = `₱${Number(docSnap.shareCapital).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
                document.getElementById("totalAssets").textContent = `₱${Number(savingsDoc.totalAssets).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
                document.getElementById("interestEarned").textContent = `₱${Number(savingsDoc.interestEarned).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
                document.getElementById("disbursedAmount").textContent = `₱${Number(savingsDoc.disbursedAmount).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
                document.getElementById("parValue").textContent = `₱${Number(savingsDoc.ParValue).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
                document.getElementById("dividends").textContent = `${savingsDoc.dividends*100}%`
                document.getElementById("shares").textContent = savingsDoc.numberOfShares
                document.getElementById("memberSince").textContent = formattedDate
                document.getElementById("savingsBuildUp").textContent = `₱${Number(loanDoc.savingsBuildUp).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
                document.getElementById("capitalBuildUp").textContent = `₱${Number(loanDoc.capitalBuildUp).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`*/
      } catch (err) {
        console.error(err);
        hideSpinner();
        showError("Your savings couldn't be loaded. Check your connection and try again.");
      }
    }
  });
}
