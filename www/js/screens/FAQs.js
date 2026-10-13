import { whenSignedIn } from "../services/session.js";

export function FAQs() {
  return `
        <!-- Top Nav -->
        <nav class="bg-gradient-to-r from-green-800 to-emerald-700 shadow-md sticky top-0 z-10">
            <div class="h-14 px-3 flex items-center justify-between">
            <button
                onclick="location.hash='#/home'"
                class="w-10 h-10 flex items-center justify-center rounded-full text-white text-lg active:scale-95 transition"
            >
                <i class="fa-solid fa-arrow-left"></i>
            </button>

            <h1 class="text-lg font-bold text-white tracking-wide">
                FAQ's
            </h1>

            <button onclick="location.hash='#/notification'"
                class="w-10 h-10 flex items-center justify-center rounded-full text-white text-lg active:scale-95 transition"
                aria-label="Notifications"
            >
                <i class="fa-regular fa-bell"></i>
            </button>
            </div>
            <div class="h-[2px] bg-green-500/70"></div>
        </nav>

        <!-- Content -->
        <main class="flex-1 overflow-y-auto">
            <section class="px-4 pt-4 pb-6">
            <div class="mx-auto w-full max-w-xl space-y-5">
                <!-- Page Intro -->
                <header class="space-y-2">
                <p class="text-xs font-medium uppercase tracking-[0.18em] text-emerald-700/80">
                    ST. VINCENT FERRER PARISH MPC
                </p>
                <h2 class="text-2xl font-semibold tracking-tight">
                    How can we help you?
                </h2>
                <p class="text-sm text-gray-500 leading-relaxed">
                    Browse common questions about using SVConnect, checking your savings,
                    and managing your loans.
                </p>
                </header>

                <!-- Search -->
                <div class="bg-white rounded-2xl shadow-sm border border-emerald-100/60 px-3.5 py-2.5 flex items-center gap-2">
                <span class="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 text-sm">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </span>
                <input
                    id="faqSearch"
                    type="text"
                    placeholder="Search FAQs (e.g. loan, savings, login)"
                    class="w-full bg-transparent placeholder:text-gray-400 text-sm focus:outline-none"
                />
                </div>

                <!-- Category Chips -->
                <div class="mt-2 -mx-4 px-4">
                <div class="flex gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
                    <button
                    data-filter="all"
                    class="faq-chip shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full bg-emerald-700 text-white font-semibold shadow-sm active:scale-95 transition"
                    >
                    All
                    </button>
                    <button
                    data-filter="membership"
                    class="faq-chip shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full bg-white border border-emerald-100 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50/60 active:scale-95 transition"
                    >
                    Membership
                    </button>
                    <button
                    data-filter="savings"
                    class="faq-chip shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full bg-white border border-emerald-100 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50/60 active:scale-95 transition"
                    >
                    Savings
                    </button>
                    <button
                    data-filter="loans"
                    class="faq-chip shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full bg-white border border-emerald-100 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50/60 active:scale-95 transition"
                    >
                    Loans
                    </button>
                    <button
                    data-filter="app"
                    class="faq-chip shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full bg-white border border-emerald-100 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50/60 active:scale-95 transition"
                    >
                    App
                    </button>
                </div>
                </div>

                <!-- FAQ List -->
                <div class="bg-white rounded-2xl shadow-sm border border-emerald-100/70 divide-y divide-emerald-50">
                <!-- MEMBERSHIP -->
                <details class="group faq-item" data-category="membership">
                    <summary
                    class="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none"
                    >
                    <div class="flex items-start gap-3">
                        <span
                        class="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 text-xs"
                        >
                        <i class="fa-solid fa-user-plus"></i>
                        </span>
                        <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-gray-900 m-0">
                            How do I register for St. Vincent Coop Connect?
                        </p>
                        <p class="text-[11px] text-gray-400 mt-0.5 mb-0">
                            Membership &amp; account creation
                        </p>
                        </div>
                    </div>
                    <span
                        class="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-xs group-open:rotate-180 transition-transform"
                    >
                        <i class="fa-solid fa-chevron-down"></i>
                    </span>
                    </summary>
                    <div class="px-11 pb-3 text-sm text-gray-600 leading-relaxed">
                    To register, you must first verify your Member ID. Once verified, you can create your account, 
                    set up your email, and choose a secure password. If you’re not yet a member, please visit 
                    the St. Vincent Ferrer Parish Multi-Purpose Cooperative office to apply.
                    </div>
                </details>

                <details class="group faq-item" data-category="membership">
                    <summary
                    class="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none"
                    >
                    <div class="flex items-start gap-3">
                        <span
                        class="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 text-xs"
                        >
                        <i class="fa-solid fa-id-card"></i>
                        </span>
                        <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-gray-900 m-0">
                            How to become a member of St. Vincent Ferrer Parish MPC?
                        </p>
                        <p class="text-[11px] text-gray-400 mt-0.5 mb-0">
                            Basic membership requirements
                        </p>
                        </div>
                    </div>
                    <span
                        class="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-xs group-open:rotate-180 transition-transform"
                    >
                        <i class="fa-solid fa-chevron-down"></i>
                    </span>
                    </summary>
                    <div class="px-11 pb-3 text-sm text-gray-600 leading-relaxed">
                    To become a member, visit the cooperative office to fill out the membership application form, submit the 
                    required valid IDs and documents, and pay the initial share capital and membership fee. Once your application 
                    is reviewed and approved, your membership will be activated. For complete details, visit 
                    <a 
                        href="https://stvincentromblon.coop/how-to-be-a-member/" 
                        class="font-bold text-emerald-700 underline"
                    >
                        St. Vincent Ferrer Parish MPC Membership
                    </a>.
                    </div>
                </details>

                <details class="group faq-item" data-category="membership">
                    <summary
                    class="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none"
                    >
                    <div class="flex items-start gap-3">
                        <span
                        class="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 text-xs"
                        >
                        <i class="fa-solid fa-address-card"></i>
                        </span>
                        <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-gray-900 m-0">
                            How do I update my personal information?
                        </p>
                        <p class="text-[11px] text-gray-400 mt-0.5 mb-0">
                            Updating member details
                        </p>
                        </div>
                    </div>
                    <span
                        class="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-xs group-open:rotate-180 transition-transform"
                    >
                        <i class="fa-solid fa-chevron-down"></i>
                    </span>
                    </summary>
                    <div class="px-11 pb-3 text-sm text-gray-600 leading-relaxed">
                    For security, changes to your name, address, or registered number
                    must be processed by the cooperative. You may start a request through
                    the app’s support &amp; help section and then visit the office with a valid ID
                    to confirm the changes.
                    </div>
                </details>

                <!-- SAVINGS -->
                <details class="group faq-item" data-category="savings">
                    <summary
                    class="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none"
                    >
                    <div class="flex items-start gap-3">
                        <span
                        class="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 text-xs"
                        >
                        <i class="fa-solid fa-piggy-bank"></i>
                        </span>
                        <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-gray-900 m-0">
                            How can I check my savings and share capital?
                        </p>
                        <p class="text-[11px] text-gray-400 mt-0.5 mb-0">
                            View balances inside the app
                        </p>
                        </div>
                    </div>
                    <span
                        class="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-xs group-open:rotate-180 transition-transform"
                    >
                        <i class="fa-solid fa-chevron-down"></i>
                    </span>
                    </summary>
                    <div class="px-11 pb-3 text-sm text-gray-600 leading-relaxed">
                    On the home screen, tap the <span class="font-medium">“Savings”</span> icon. You’ll see your 
                    savings details such as total assets, current balance, and share capital.
                    </div>
                </details>

                <details class="group faq-item" data-category="savings">
                    <summary
                    class="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none"
                    >
                    <div class="flex items-start gap-3">
                        <span
                        class="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 text-xs"
                        >
                        <i class="fa-solid fa-wallet"></i>
                        </span>
                        <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-gray-900 m-0">
                            When will my deposits appear in the app?
                        </p>
                        <p class="text-[11px] text-gray-400 mt-0.5 mb-0">
                            Posting of savings transactions
                        </p>
                        </div>
                    </div>
                    <span
                        class="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-xs group-open:rotate-180 transition-transform"
                    >
                        <i class="fa-solid fa-chevron-down"></i>
                    </span>
                    </summary>
                    <div class="px-11 pb-3 text-sm text-gray-600 leading-relaxed">
                    Deposits made over-the-counter in the cooperative are usually posted on the same banking
                    day. If an update is still missing after 1–2 business days, please contact the cooperative.
                    </div>
                </details>

                <details class="group faq-item" data-category="savings">
                    <summary
                    class="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none"
                    >
                    <div class="flex items-start gap-3">
                        <span
                        class="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 text-xs"
                        >
                        <i class="fa-solid fa-circle-info"></i>
                        </span>
                        <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-gray-900 m-0">
                            What is the difference between savings and share capital?
                        </p>
                        <p class="text-[11px] text-gray-400 mt-0.5 mb-0">
                            Understanding your cooperative funds
                        </p>
                        </div>
                    </div>
                    <span
                        class="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-xs group-open:rotate-180 transition-transform"
                    >
                        <i class="fa-solid fa-chevron-down"></i>
                    </span>
                    </summary>
                    <div class="px-11 pb-3 text-sm text-gray-600 leading-relaxed">
                    <span class="font-medium">Savings</span> is the amount you regularly deposit and
                    can withdraw based on the cooperative’s policies. 
                    <span class="font-medium">Share capital</span> represents your ownership in the
                    cooperative and is usually not withdrawn while you are an active member.
                    Both are recorded in your account, but they serve different purposes.
                    </div>
                </details>

                <!-- LOANS -->
                <details class="group faq-item" data-category="loans">
                    <summary
                    class="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none"
                    >
                    <div class="flex items-start gap-3">
                        <span
                        class="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 text-xs"
                        >
                        <i class="fa-solid fa-hand-holding-dollar"></i>
                        </span>
                        <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-gray-900 m-0">
                            How do I apply for a loan using the app?
                        </p>
                        <p class="text-[11px] text-gray-400 mt-0.5 mb-0">
                            Online loan application steps
                        </p>
                        </div>
                    </div>
                    <span
                        class="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-xs group-open:rotate-180 transition-transform"
                    >
                        <i class="fa-solid fa-chevron-down"></i>
                    </span>
                    </summary>
                    <div class="px-11 pb-3 text-sm text-gray-600 leading-relaxed">
                    Go to the <span class="font-medium">“Loans”</span> icon and tap
                    <span class="font-medium">“Apply for a Loan”</span>. Choose your
                    preferred loan product, fill out the required details, and submit
                    your application. Our staff will review it and you’ll receive updates
                    via the app notifications.
                    </div>
                </details>

                <details class="group faq-item" data-category="loans">
                    <summary
                    class="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none"
                    >
                    <div class="flex items-start gap-3">
                        <span
                        class="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 text-xs"
                        >
                        <i class="fa-solid fa-list-check"></i>
                        </span>
                        <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-gray-900 m-0">
                            How can I view my loan balance and payment schedule?
                        </p>
                        <p class="text-[11px] text-gray-400 mt-0.5 mb-0">
                            Monitoring your active loans
                        </p>
                        </div>
                    </div>
                    <span
                        class="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-xs group-open:rotate-180 transition-transform"
                    >
                        <i class="fa-solid fa-chevron-down"></i>
                    </span>
                    </summary>
                    <div class="px-11 pb-3 text-sm text-gray-600 leading-relaxed">
                    Under the <span class="font-medium">“Loans”</span> tab, select <span class="font-medium">“View Your Loan”</span> 
                    to see the remaining balance, due dates, and loan progress. You can also review your transactions
                    from the same screen.
                    </div>
                </details>

                <details class="group faq-item" data-category="loans">
                    <summary
                    class="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none"
                    >
                    <div class="flex items-start gap-3">
                        <span
                        class="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 text-xs"
                        >
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        </span>
                        <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-gray-900 m-0">
                            What should I do if I miss a loan payment?
                        </p>
                        <p class="text-[11px] text-gray-400 mt-0.5 mb-0">
                            Missed payments and penalties
                        </p>
                        </div>
                    </div>
                    <span
                        class="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-xs group-open:rotate-180 transition-transform"
                    >
                        <i class="fa-solid fa-chevron-down"></i>
                    </span>
                    </summary>
                    <div class="px-11 pb-3 text-sm text-gray-600 leading-relaxed">
                    If you miss a due date, please visit the cooperative or contact our
                    staff as soon as possible. Late payments may incur penalties and can
                    affect your eligibility for future loans. Our team can explain your
                    options and help you get back on track.
                    </div>
                </details>

                <!-- APP -->
                <details class="group faq-item" data-category="app">
                    <summary
                    class="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none"
                    >
                    <div class="flex items-start gap-3">
                        <span
                        class="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 text-xs"
                        >
                        <i class="fa-solid fa-lock"></i>
                        </span>
                        <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-gray-900 m-0">
                            I forgot my password. What should I do?
                        </p>
                        <p class="text-[11px] text-gray-400 mt-0.5 mb-0">
                            Resetting your Coop Connect password
                        </p>
                        </div>
                    </div>
                    <span
                        class="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-xs group-open:rotate-180 transition-transform"
                    >
                        <i class="fa-solid fa-chevron-down"></i>
                    </span>
                    </summary>
                    <div class="px-11 pb-3 text-sm text-gray-600 leading-relaxed">
                    On the Settings page, tap <span class="font-medium">“Change Password”</span> 
                    and enter your new password. You can also reset it from the login page by clicking
                    <span class="font-medium">“Forgot Password”</span>, entering your Gmail account, 
                    and opening the reset link sent to your email.
                    </div>
                </details>

                <details class="group faq-item" data-category="app">
                    <summary
                    class="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none"
                    >
                    <div class="flex items-start gap-3">
                        <span
                        class="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 text-xs"
                        >
                        <i class="fa-solid fa-right-from-bracket"></i>
                        </span>
                        <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-gray-900 m-0">
                            How do I log out of my Coop Connect account?
                        </p>
                        <p class="text-[11px] text-gray-400 mt-0.5 mb-0">
                            Signing out of the app
                        </p>
                        </div>
                    </div>
                    <span
                        class="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-xs group-open:rotate-180 transition-transform"
                    >
                        <i class="fa-solid fa-chevron-down"></i>
                    </span>
                    </summary>
                    <div class="px-11 pb-3 text-sm text-gray-600 leading-relaxed">
                    Go to the <span class="font-medium">“Profile”</span> or
                    <span class="font-medium">“Settings”</span> section of the app, then tap
                    <span class="font-medium">“Log Out”</span>. This will securely sign you out of your account on that device.
                    </div>
                </details>

                <details class="group faq-item" data-category="app">
                    <summary
                    class="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none"
                    >
                    <div class="flex items-start gap-3">
                        <span
                        class="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 text-xs"
                        >
                        <i class="fa-solid fa-mobile-screen-button"></i>
                        </span>
                        <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-gray-900 m-0">
                            The app is slow or not loading. How can I fix it?
                        </p>
                        <p class="text-[11px] text-gray-400 mt-0.5 mb-0">
                            Basic troubleshooting steps
                        </p>
                        </div>
                    </div>
                    <span
                        class="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-xs group-open:rotate-180 transition-transform"
                    >
                        <i class="fa-solid fa-chevron-down"></i>
                    </span>
                    </summary>
                    <div class="px-11 pb-3 text-sm text-gray-600 leading-relaxed">
                    Check your internet connection and close other apps running in the
                    background. You can also clear the app cache or restart your phone.
                    If issues continue, please contact our support team for further assistance.
                    </div>
                </details>
                </div>


                <!-- Need more help card -->
                <div class="mt-4 bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-500 text-white rounded-2xl p-4 shadow-sm flex items-start gap-3">
                <div
                    class="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm"
                >
                    <i class="fa-solid fa-headset text-lg"></i>
                </div>
                <div class="flex-1">
                    <p class="text-sm font-semibold tracking-tight">
                    Still need help?
                    </p>
                    <p class="text-xs text-emerald-50 mt-1 leading-relaxed">
                    Message us through the in-app support, visit the cooperative office,
                    or call our official hotline during office hours.
                    </p>
                    <div class="mt-3 flex flex-wrap gap-2 text-xs">
                    <button
                        onclick="location.hash='#/customerSupport'"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-emerald-800 font-semibold shadow-sm active:scale-95 transition"
                    >
                        <i class="fa-solid fa-message"></i>
                        Contact Support
                    </button>
                    <a
                        href="tel:09071019348"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/40 text-emerald-50 active:scale-95 transition"
                    >
                        <i class="fa-solid fa-phone"></i>
                        Call Hotline
                    </a>
                    </div>
                </div>
                </div>
            </div>
            </section>
        </main>
    `;
}

export function initFAQs() {
  whenSignedIn(async (user) => {
    if (user) {
      try {
        const filterButtons = document.querySelectorAll(".faq-chip[data-filter]");
        const faqItems = document.querySelectorAll(".faq-item[data-category]");
        const searchInput = document.getElementById("faqSearch");

        let activeCategory = "all";

        function applyFilter() {
          const term = searchInput.value.trim().toLowerCase();

          faqItems.forEach((item) => {
            const cat = item.dataset.category;
            const text = item.textContent.toLowerCase();

            const matchCategory = activeCategory === "all" || cat === activeCategory;
            const matchSearch = term === "" || text.includes(term);

            if (matchCategory && matchSearch) {
              item.classList.remove("hidden");
            } else {
              item.classList.add("hidden");
            }
          });
        }

        filterButtons.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            activeCategory = btn.dataset.filter;

            // Reset all buttons to inactive state
            filterButtons.forEach((b) => {
              b.className = b.className.replace(/bg-\S+|text-\S+|shadow-\S+|border-\S+/g, "").trim();
              b.classList.add("bg-white", "text-gray-700", "border", "border-gray-200");
            });

            // Set clicked button to active state
            btn.className = btn.className.replace(/bg-\S+|text-\S+|shadow-\S+|border-\S+/g, "").trim();
            btn.classList.add("bg-emerald-700", "text-white", "shadow-sm", "border", "border-emerald-700");

            applyFilter();
          });
        });

        searchInput.addEventListener("input", applyFilter);

        // Initial filter (All + empty search)
        applyFilter();
      } catch (err) {
        console.error(err);
      }
    }
  });
}
