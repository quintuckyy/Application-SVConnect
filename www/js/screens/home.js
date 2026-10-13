import { auth, db } from "../services/firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  getMemberID,
  getMemberRef,
  getNotifRef,
  getTransacRef,
  getPaymentRef,
  getApprovedLoan,
  getApprovedLoanIDs,
  createNotification,
  showSuccess,
} from "../services/firebaseFunctions.js";
import { doc, updateDoc } from "firebase/firestore";
import { supabase } from "../services/supabase.js";

export function Home() {
  return `
    <div id="Homespinner" 
        class="hidden fixed inset-0 flex items-center justify-center bg-black/20 z-[9999]">
        <div class="w-10 h-10 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
    </div>
    
    <!-- Pull to Refresh Indicator -->
    <div id="pullRefreshIndicator" class="fixed top-0 left-0 right-0 flex justify-center pointer-events-none z-[9998] transition-all duration-300" style="transform: translateY(-100px); opacity: 0;">
        <div class="bg-white rounded-full shadow-lg p-3 mt-20">
            <div class="w-8 h-8 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
        </div>
    </div>
    
    <nav class="bg-gradient-to-r from-green-800 to-emerald-700 text-gray-100 h-15 shadow md:flex md:items-center md:justify-between shadow-lg">
        <ul id="menuContainer" class="w-[350px] pl-5 h-full md:flex md:items-center md:z-auto md:static absolute bg-gradient-to-r from-green-800 to-emerald-700 w-2/4 shadow-2xl md:w-auto md:py-0 py-4 md:opacity-100 opacity-0 right-[100%]
                top-0 left-[-100%] transition-all duration-700 rounded-r-2xl md:bg-white z-50 flex flex-col justify-between">
            <div>
                <li class="mb-2 mt-10">
                    <div class="flex items-center space-x-3 px-4 py-4">
                        <img src="img/stVincentLOGO.jpg" class="w-12 h-12 rounded-full object-cover">
                        <div class="flex flex-col">
                        <span class="text-white font-bold text-lg">St. Vincent Connect</span>
                        <span class="text-gray-200 text-xs">Your trusted member portal</span>
                        </div>
                    </div>
                </li>
                <li>
                    <div onclick="navigateScreen('customerSupport')"
                        class="flex items-center justify-between rounded-lg px-4 py-6 sm:px-6 sm:py-4
                                hover:bg-green-700 hover:scale-[1.02] transition duration-200 w-full cursor-pointer shadow-md">
                        <div class="flex items-center space-x-3">
                        <img src="img/customer.png" class="w-8 h-8 sm:w-10 sm:h-10 filter brightness-0 invert">
                        <div class="flex flex-col">
                            <span class="font-medium text-sm sm:text-base text-white">Contact Us</span>
                            <span class="mt-1 text-xs text-gray-200">Customer care support</span>
                        </div>
                        </div>
                        <span class="text-xl sm:text-2xl text-white">&#8250;</span>
                    </div>
                </li>

                <li>
                <div onclick="navigateScreen('aboutSVFMPC')"
                    class="mt-4 flex items-center justify-between rounded-lg px-4 py-6 sm:px-6 sm:py-4
                            hover:bg-green-700 hover:scale-[1.02] transition duration-200 w-full cursor-pointer shadow-md">
                    <div class="flex items-center space-x-3">
                    <img src="img/about.png" class="w-8 h-8 sm:w-10 sm:h-10 filter brightness-0 invert">
                    <div class="flex flex-col">
                        <span class="font-medium text-sm sm:text-base text-white">About SVFMPC</span>
                        <span class="mt-1 text-xs text-gray-200">Learn more about us</span>
                    </div>
                    </div>
                    <span class="text-xl sm:text-2xl text-white">&#8250;</span>
                </div>
                </li>

                <li>
                <div onclick="navigateScreen('terms&condition')"
                    class="mt-4 flex items-center justify-between rounded-lg px-4 py-6 sm:px-6 sm:py-4
                            hover:bg-green-700 hover:scale-[1.02] transition duration-200 w-full cursor-pointer shadow-md">
                    <div class="flex items-center space-x-3">
                    <img src="img/terms.png" class="w-8 h-8 sm:w-10 sm:h-10 filter brightness-0 invert">
                    <div class="flex flex-col">
                        <span class="font-medium text-sm sm:text-base text-white">Terms & Conditions</span>
                        <span class="mt-1 text-xs text-gray-200">View policies and guidelines</span>
                    </div>
                    </div>
                    <span class="text-xl sm:text-2xl text-white">&#8250;</span>
                </div>
                </li>
            </div>

            <li class="mb-6">
                <div id="logoutBtn" 
                    class="flex items-center justify-between rounded-lg px-4 py-6 sm:px-6 sm:py-4
                            hover:scale-[1.02] transition duration-200 w-full cursor-pointer shadow-md">
                    <div class="flex items-center space-x-3">
                    <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    <div class="flex flex-col">
                        <span class="font-medium text-sm sm:text-base text-white">Logout</span>
                        <span class="text-xs text-gray-200">Sign out of your account</span>
                    </div>
                    </div>
                </div>
            </li>
        </ul>
        <div class="flex justify-between items-center">
            <span class="text-4xl md:hidden block mr-2 z-50">
                <ion-icon class="transition-all ease-in duration-150 pl-3" name="menu" onclick="Menu(this)"></ion-icon>
            </span>
            <h1 class="text-xl font-bold md:hidden tracking-wide">SVConnect</h1>
              <div class ="mr-2 mb-4 w-12 h-12 p-2 my-2 transition duration-200 transform active:scale-95">
                <button onclick="location.hash='#/notification'" class="w-9 h-9 flex items-center justify-center backdrop-blur-sm">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                </button>
                <span id="notifDot" class="hidden absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main id="mainContent" class="px-4 py-4 space-y-4 max-w-7xl mx-auto">
        
        <!-- Greeting & Profile Section -->
        <section class="bg-gradient-to-r from-green-800 to-emerald-700 rounded-2xl p-6 shadow-lg text-white">
            <div class="flex items-center justify-between">
                <div>
                    <h1 id="greetings" class="text-2xl font-bold mb-2">Loading....</h1>
                    <p class="text-green-100 text-xs">Let's get started with your cooperative journey</p>
                </div>
                <div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <img src="img/stVincentLOGO.jpg" class="w-12 h-12 rounded-full object-cover">
                </div>
            </div>
            
            <!-- Member Info Card -->
            <div class="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div class="flex items-center space-x-3">
                    <div id="userInitials" class="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        
                    </div>
                    <div class="flex-1">
                        <h3 id="userName" class="font-bold text-lg">Loading....</h3>
                        <p id="userID" class="text-green-100 text-sm">Member ID: <span class="font-mono">Loading....</span></p>
                    </div>
                    <svg class="w-5 h-5 text-green-200" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                </div>
            </div>
        </section>

        <!-- Quick Actions -->
        <section class="bg-white rounded-2xl p-6 shadow-sm">
            <h2 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <i class="fas fa-bolt text-indigo-600"></i>
                Quick Actions
            </h2>
            <div class="grid grid-cols-3 gap-3">
                <!-- Loans -->
                <button onclick="location.hash='#/loan'" class="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                    <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30">
                        <i class="fas fa-hand-holding-usd text-white text-xl"></i>
                    </div>
                    <span class="text-sm font-semibold text-slate-800">Loans</span>
                    <span class="text-xs text-slate-500 mt-0.5">Apply & Track</span>
                </button>
                
                <!-- Savings -->
                <button onclick="location.hash='#/savings'" class="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                    <div class="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/30">
                        <i class="fas fa-piggy-bank text-white text-xl"></i>
                    </div>
                    <span class="text-sm font-semibold text-slate-800">Savings</span>
                    <span class="text-xs text-slate-500 mt-0.5">View Balance</span>
                </button>
                
                <!-- Transactions -->
                <button onclick="location.hash='#/transactions'" class="relative flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                    <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-purple-500/30">
                        <i class="fas fa-exchange-alt text-white text-xl"></i>
                    </div>
                    <span class="text-sm font-semibold text-slate-800">Transactions</span>
                    <span class="text-xs text-slate-500 mt-0.5">History</span>
                    <span id="transacDot" class="hidden absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
                </button>
            </div>
        </section>

        <!-- Announcements Banner -->
        <section class="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-6 shadow-lg text-white overflow-hidden relative">
          <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                <div class="relative z-10 md:flex md:items-center md:gap-6">
                    <div class="md:flex-1 md:min-w-0">
                        <div class="flex items-center gap-2 mb-2">
                            <span  class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 flex-shrink-0">
                                <i class="fa-solid fa-bullhorn text-white text-base leading-none "></i>
                            </span>
                            <h2 id="homeAnnTitle" class="text-xl font-bold">St. Vincent Coop Connect</h2>
                        </div>
                        <p id="homeAnnSubtitle" class="text-sm mb-4 text-white/90">
                             Your most awaited cooperative app is finally here! Manage your loans, savings, and transactions with ease.
                        </p>
                    </div>
                    <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3 mb-3 md:mb-0 md:w-64 md:flex-shrink-0">
                    <img
                        id="homeAnnImage"
                        src="img/St_Vincent_Pre-Image.jpg"
                        alt="Announcement"
                        class="rounded-lg w-full h-auto object-contain"
                    />
                    </div>
                </div>
                <a
                    id="homeAnnButton"
                    href="#"
                    target="_blank"
                    rel="noopener"
                    class="relative z-10 bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold text-sm
                            hover:bg-orange-50 transition duration-200 shadow-md inline-flex
                            items-center justify-center mt-3 hidden"
                    >
                    Learn More →
                </a>
        </section>
    </main>
    <div class="h-20"></div>
    `;
}

export function initHomeDashboard() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      document.getElementById("Homespinner").classList.remove("hidden");
      loadLatestAnnouncement();
      const memberID = await getMemberID(user);
      const docSnap = await getMemberRef(memberID);
      const notifSnap = await getNotifRef(memberID);
      const transacSnap = await getTransacRef(memberID);
      const notifDot = document.getElementById("notifDot");
      const transacDot = document.getElementById("transacDot");

      const loanIDs = await getApprovedLoanIDs(memberID);
      checkOverDueHome(memberID, loanIDs[0]);
      document.getElementById("Homespinner").classList.add("hidden");
      const hasUnseenNotif = notifSnap.some((notif) => notif.seen === "false" || notif.seen === false);
      const hasUnseenTransac = transacSnap.some((transac) => transac.seen === "false" || transac.seen === false);

      if (hasUnseenNotif) {
        notifDot.classList.remove("hidden");
      } else {
        notifDot.classList.add("hidden");
      }

      if (hasUnseenTransac) {
        transacDot.classList.remove("hidden");
      } else {
        transacDot.classList.add("hidden");
      }

      document.getElementById("userName").textContent = docSnap.displayName;
      document.getElementById("userID").textContent = `Member ID: ${memberID}`;
      document.getElementById("userInitials").textContent = docSnap.displayName
        .split(" ")
        .map((n) => n[0])
        .join("");
      //greetings
      const hour = new Date().getHours();
      const greetingElement = document.getElementById("greetings");
      if (hour < 12) {
        greetingElement.textContent = `Good Morning, ${docSnap.displayName.split(" ")[0]}`;
      } else if (hour < 18) {
        greetingElement.textContent = `Good Afternoon, ${docSnap.displayName.split(" ")[0]}`;
      } else {
        greetingElement.textContent = `Good Evening, ${docSnap.displayName.split(" ")[0]}`;
      }
      const logoutBtn = document.getElementById("logoutBtn");
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        await logout();
      });

      // Initialize pull-to-refresh
      initPullToRefresh();
    }
  });
}

//pull-to-refresh functionality
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
        e.preventDefault();

        //calculate transform and opacity based on pull distance
        const progress = Math.min(pullDistance / pullThreshold, 1);
        const translateY = Math.min(pullDistance * 0.5, 60);

        indicator.style.transform = `translateY(${translateY - 100}px)`;
        indicator.style.opacity = progress;
      }
    },
    { passive: false },
  );

  mainContent.addEventListener("touchend", async () => {
    if (!isPulling) return;

    const pullDistance = currentY - startY;

    // If pulled past threshold, trigger refresh
    if (pullDistance > pullThreshold && window.scrollY === 0) {
      indicator.style.transform = "translateY(10px)";
      indicator.style.opacity = "1";

      // Refresh the page
      await refreshHomePage();

      // Hide indicator after refresh
      setTimeout(() => {
        indicator.style.transform = "translateY(-100px)";
        indicator.style.opacity = "0";
      }, 500);
    } else {
      // Reset indicator if threshold not met
      indicator.style.transform = "translateY(-100px)";
      indicator.style.opacity = "0";
    }

    isPulling = false;
    startY = 0;
    currentY = 0;
  });
}

// Function to refresh the home page
async function refreshHomePage() {
  try {
    // Reload the current data
    const user = auth.currentUser;
    if (user) {
      const memberID = await getMemberID(user);
      const docSnap = await getMemberRef(memberID);
      const notifSnap = await getNotifRef(memberID);
      const transacSnap = await getTransacRef(memberID);

      // Reload latest announcement
      await loadLatestAnnouncement();

      // Update notification and transaction dots
      const notifDot = document.getElementById("notifDot");
      const transacDot = document.getElementById("transacDot");

      const hasUnseenNotif = notifSnap.some((notif) => notif.seen === "false" || notif.seen === false);
      const hasUnseenTransac = transacSnap.some((transac) => transac.seen === "false" || transac.seen === false);

      if (hasUnseenNotif) {
        notifDot.classList.remove("hidden");
      } else {
        notifDot.classList.add("hidden");
      }

      if (hasUnseenTransac) {
        transacDot.classList.remove("hidden");
      } else {
        transacDot.classList.add("hidden");
      }

      // Update greeting based on current time
      const hour = new Date().getHours();
      const greetingElement = document.getElementById("greetings");
      const firstName = docSnap.displayName.split(" ")[0];

      if (hour < 12) {
        greetingElement.textContent = `Good Morning, ${firstName}`;
      } else if (hour < 18) {
        greetingElement.textContent = `Good Afternoon, ${firstName}`;
      } else {
        greetingElement.textContent = `Good Evening, ${firstName}`;
      }

      // Check for overdue loans
      const loanIDs = await getApprovedLoanIDs(memberID);
      if (loanIDs.length > 0) {
        await checkOverDueHome(memberID, loanIDs[0]);
      }
    }
  } catch (error) {
    console.error("Error refreshing home page:", error);
  }
}

function Menu(e) {
  let list = document.querySelector("ul");
  if (e.name === "menu") {
    e.name = "close";
    list.classList.add("left-0");
    list.classList.add("opacity-100");
    list.classList.remove("left-[-100%]");
    document.body.classList.add("overflow-hidden");
  } else {
    e.name = "menu";
    list.classList.remove("left-0");
    list.classList.remove("opacity-100");
    list.classList.add("left-[-100%]");
    document.body.classList.remove("overflow-hidden");
  }
}
window.Menu = Menu;

//remove overflow hidden when menu contents are clicked
function navigateScreen(screenId) {
  let list = document.querySelector("ul");
  list.classList.remove("left-0", "opacity-100");
  list.classList.add("left-[-100%]");
  document.body.classList.remove("overflow-hidden");

  window.location.hash = `#/${screenId}`;
}
window.navigateScreen = navigateScreen;

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

async function checkOverDueHome(memberID, loanID) {
  try {
    const loanDoc = await getApprovedLoan(memberID);
    const paymentSnap = await getPaymentRef(memberID);
    if (!loanDoc) return; //if there are no approvedLoans
    const loanRef = doc(db, "Members", memberID, "approvedLoans", loanID);
    const dueDateIndex = loanDoc.dueDateIndex;
    const dueDate = new Date(loanDoc.dueDate[dueDateIndex]);
    const today = loanDoc.TESTDATE.toDate();
    const formattedDate = dueDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const isOverDue = today > dueDate;
    const graceLimit = new Date(dueDate);
    graceLimit.setDate(graceLimit.getDate() + 7);
    const paidThisMonth = paymentSnap.some((pay) => pay.paymentIndex === dueDateIndex);

    if (!paidThisMonth && today > graceLimit && isOverDue && isOverDue && loanDoc.penaltyEligible !== true) {
      await createNotification(
        memberID,
        "Loan Penalty!",
        `⚠️ Your loan payment is overdue! A penalty of 2% of your monthly amortization has been applied. 
                    Please settle your payment immediately. Due date: ${formattedDate}`,
        "loanPenaltyEligible",
      );
      await updateDoc(loanRef, {
        penaltyEligible: true,
        penalties: loanDoc.monthlyPayment * 0.02,
      });
      console.log("penalty eligible");
    }
    if (isOverDue && loanDoc.isOverDue !== true) {
      await createNotification(
        memberID,
        "Loan Overdue!",
        `⚠️Your loan payment is overdue! Please settle immediately. Due date is ${formattedDate}`,
        "loanOverDue",
      );
      await updateDoc(loanRef, { isOverDue: true });
    }
  } catch (err) {
    console.log(err);
  }
}

export async function loadLatestAnnouncement() {
  const titleEl = document.getElementById("homeAnnTitle");
  const subtitleEl = document.getElementById("homeAnnSubtitle");
  const imgEl = document.getElementById("homeAnnImage");
  const btnEl = document.getElementById("homeAnnButton");

  if (!supabase) return;

  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return;
    }

    titleEl.textContent = data.title || "What's New?";
    subtitleEl.textContent = data.description || "";
    if (data.image_url) {
      imgEl.src = data.image_url;
    }

    const link = (data.link_url || "").trim();

    if (link) {
      btnEl.classList.remove("hidden");

      if (btnEl.tagName.toLocaleLowerCase() === "a") {
        btnEl.href = link;
        btnEl.target = "__blank";
        btnEl.rel = "noopener;";
      } else {
        btnEl.onclick = () => {
          window.open(link, "__blank");
        };
      }
    } else {
      btnEl.classList.add("hidden");
      btnEl.removeAttribute("href");
      btnEl.onclick = null;
    }
  } catch (err) {
    console.error("Failed to load announcement", err);
  }
}
