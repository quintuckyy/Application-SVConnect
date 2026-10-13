import { db } from "../services/firebase.js";
import { whenSignedIn } from "../services/session.js";

import { getMemberID, getTransacRef, formatDate } from "../services/firebaseFunctions.js";
import { showSpinner, hideSpinner, showError } from "../services/ui.js";
import { escapeHtml } from "../lib/html.js";
import { updateDoc, doc, getDoc } from "firebase/firestore";

export function Transactions() {
  return `
    <!-- TOP NAV -->
    <nav class="bg-gradient-to-r from-green-800 to-emerald-700 shadow-md sticky top-0 z-10">
        <div class="h-16 px-3 flex items-center justify-between">

        <!-- Back -->
        <button onclick="location.hash='#/home'""
            class="w-10 h-10 flex items-center justify-center rounded-full text-white text-lg
                    active:scale-95 transition">
            <i class="fa-solid fa-arrow-left"></i>
        </button>

        <!-- Title -->
        <h1 class="mr-8 text-lg font-bold text-white tracking-wide">
            Transactions
        </h1>

        <div class="h-[2px] bg-green-500/70"></div>
    </nav>

    <!-- CONTENT -->
    <div class="flex-grow overflow-y-auto bg-gray-100">
        <div class="p-4 space-y-3 max-w-xl mx-auto">

        <!-- Section header -->
        <div class="flex items-center justify-between">
            <p class="text-sm font-semibold text-gray-600">Recent transactions</p>
            
        </div>

        <div id="transacBody"></div>

        <!-- Empty State -->
        <div id="transactionEmptyState" class="">
            <div class="bg-white rounded-2xl shadow-lg p-8 text-center mt-8">
                <div class="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">No Transactions Yet</h3>
                <p class="text-gray-500 text-sm mb-6">Your transaction history will appear here once you make payments or updates to your account.</p>
            </div>
        </div>

        <!-- Notification Detail Popup Overlay -->
            <div id="notification-detail-overlay" class="hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                <div class="bg-white rounded-lg max-w-lg w-full shadow-2xl">
                
                <!-- Header -->
                <div class="bg-emerald-700 text-white p-5 rounded-t-lg flex items-start justify-between">
                    <div class="flex gap-3 items-start flex-1">
                    <div class="bg-white bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                        </svg>
                    </div>
                    <div>
                        <h2 data-field="title" class="text-xl font-bold mb-1">Loan Balance Updated</h2>
                        <p data-field="dateTime" class="text-sm text-emerald-50">November 29, 2024 • 2:45 PM</p>
                    </div>
                    </div>
                    <button id="closeBtn" class="text-white hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    </button>
                </div>

                <!-- Content -->
                <div class="p-6">
                    <div class="mb-6">
                    <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">Message</h3>
                    <p data-field="message" class="text-gray-700 leading-relaxed">
                        Admin has updated your loan balance. Your remaining balance has been adjusted based on your recent payment. Please check your loan overview for detailed information about the changes.
                    </p>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 class="text-sm font-semibold text-gray-500 uppercase mb-3">Transaction Details</h3>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Amount:</span>
                            <span data-field="paymentAmt" class="font-semibold text-emerald-700">₱143,035.25</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Date:</span>
                            <span data-field="paymentDate" class="text-gray-800 font-semibold">-₱3,892.87</span>
                        </div>
                        <div class="h-px bg-gray-300 my-2"></div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Updated Balance:</span>
                            <span data-field="newBal" class="font-bold text-emerald-600">₱140,143.38</span>
                        </div>
                    </div>
                    </div>

                    <div class="mb-6">
                    <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">From</h3>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span class="text-emerald-700 font-semibold">A</span>
                        </div>
                        <div>
                            <p class="font-semibold text-gray-800">System Administrator</p>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
    </div>
    `;
}

export function initTransactions() {
  whenSignedIn(async (user) => {
    try {
      showSpinner();
      const memberID = await getMemberID(user);
      await renderTransac(memberID);
    } catch (err) {
      console.error("Loading transactions failed:", err);
      showError("Your transactions couldn't be loaded. Check your connection and try again.");
    } finally {
      hideSpinner();
    }
  });
}

const peso = (value) =>
  typeof value === "number"
    ? `₱${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "—";

async function renderTransac(memberID) {
  const transacBody = document.getElementById("transacBody");
  const emptyState = document.getElementById("transactionEmptyState");
  const transacSnap = await getTransacRef(memberID);

  emptyState.classList.toggle("hidden", transacSnap.length > 0);
  transacBody.classList.toggle("hidden", transacSnap.length === 0);
  transacBody.innerHTML = ``;

  transacSnap.forEach((transac) => {
    const formattedDate = transac.createdAt.toDate().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const id = escapeHtml(transac.id);
    const transacContainer = document.createElement("div");
    transacContainer.innerHTML = `
            <div onclick="openTransac('${id}')" id="trans-${id}" class="${transac.seen === false ? "bg-gray-200 font-bold" : ""} mb-2 rounded-2xl shadow-sm border border-gray-200 p-4 flex gap-3">
                <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                    <h2 class="text-sm font-bold text-gray-900 truncate">${escapeHtml(transac.title)}</h2>
                    <div class="flex items-center gap-2 shrink-0">
                        <span class="text-[11px] text-gray-500">${formattedDate}</span>
                        <span id="dot-${id}" class="w-2 h-2 rounded-full ${transac.seen === false ? "bg-emerald-600 font-semibold" : ""}"></span>
                    </div>
                </div>

                <p class="text-xs text-gray-600 mt-1 leading-snug">${escapeHtml(transac.message)}</p>
                </div>
            </div>
            `;
    transacBody.appendChild(transacContainer);
  });

  const overlay = document.getElementById("notification-detail-overlay");
  const close = () => overlay.classList.add("hidden");
  document.getElementById("closeBtn").onclick = close;
  overlay.onclick = (e) => {
    if (e.target === overlay) close();
  };

  window.openTransac = async function (transacID) {
    try {
      const transacRef = doc(db, "Members", memberID, "Transactions", transacID);
      const data = (await getDoc(transacRef)).data();
      const createdAt = data.createdAt.toDate();
      const formattedTime = createdAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

      // Staff-posted transactions may not have every field; show a dash instead of failing
      const details = {
        title: data.title,
        dateTime: `${formatDate(data.createdAt)} • ${formattedTime}`,
        message: data.message,
        paymentDate: data.paymentDate ? formatDate(data.paymentDate) : "—",
        paymentAmt: peso(data.amount),
        newBal: peso(data.newBal),
      };
      overlay.querySelectorAll("[data-field]").forEach((el) => {
        el.textContent = details[el.dataset.field] ?? "—";
      });
      overlay.classList.remove("hidden");

      if (data.seen === false) {
        await updateDoc(transacRef, { seen: true });
        document.getElementById(`dot-${transacID}`)?.classList.remove("bg-emerald-600");
        document.getElementById(`trans-${transacID}`)?.classList.remove("bg-gray-200", "font-bold");
      }
    } catch (err) {
      console.error("Opening transaction failed:", err);
      showError("This transaction couldn't be opened. Try again.");
    }
  };
}
