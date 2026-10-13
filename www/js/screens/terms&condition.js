export function TermsAndCondition() {
  return `
        <!-- TOP NAV -->
        <nav class="bg-gradient-to-r from-green-800 to-emerald-700 shadow-md sticky top-0 z-10">
            <div class="h-16 px-3 flex items-center justify-between">
            
            <!-- Back -->
            <button onclick="location.hash='#/home'"
                class="w-10 h-10 flex items-center justify-center rounded-full text-white text-lg
                        active:scale-95 transition">
                <i class="fa-solid fa-arrow-left"></i>
            </button>

            <!-- Title -->
            <h1 class="text-lg font-bold text-white tracking-wide">
                Terms &amp; Conditions
            </h1>

            <!-- Notifications -->
            <button onclick="location.hash='#/notification'" class="w-10 h-10 flex items-center justify-center rounded-full text-white text-lg
                        active:scale-95 transition relative"
                aria-label="Notifications">
                <i class="fa-regular fa-bell"></i>
                <span id="notifDot" class="hidden absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-gray-900"></span>
            </button>

            </div>
            <div class="h-[2px] bg-green-500/70"></div>
        </nav>

        <!-- CONTENT -->
        <div class="flex-grow overflow-y-auto bg-gray-100">
            <div class="p-4 space-y-4 max-w-xl mx-auto">

            <!-- Header card -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                <div class="flex items-center gap-2 text-emerald-700 font-semibold">
                <i class="fa-solid fa-file-contract"></i>
                <p class="text-sm">Please read carefully before using the app.</p>
                </div>
            </div>

            <!-- Term item -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 space-y-2">
                <div class="flex items-start justify-between gap-3">
                <h2 class="font-semibold text-base text-gray-900">
                    1. Acceptance of Terms
                </h2>
                <i class="fa-solid fa-check text-emerald-700 text-sm mt-1"></i>
                </div>
                <p class="text-sm text-gray-700 leading-relaxed text-justify">
                By accessing or using the services provided by St. Vincent Ferrer Parish MPC,
                you agree to comply with and be bound by these Terms and Conditions.
                If you do not agree, please do not use our services.
                </p>
            </div>

            <!-- Term item -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 space-y-2">
                <div class="flex items-start justify-between gap-3">
                <h2 class="font-semibold text-base text-gray-900">
                    2. User Obligations
                </h2>
                <i class="fa-solid fa-user-shield text-emerald-700 text-sm mt-1"></i>
                </div>
                <p class="text-sm text-gray-700 leading-relaxed text-justify">
                You agree to provide accurate and complete information when registering
                and to keep your account details up-to-date. You are responsible for
                maintaining the confidentiality of your account credentials.
                </p>
            </div>

            <!-- Term item -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 space-y-2">
                <div class="flex items-start justify-between gap-3">
                <h2 class="font-semibold text-base text-gray-900">
                    3. Intellectual Property
                </h2>
                <i class="fa-solid fa-copyright text-emerald-700 text-sm mt-1"></i>
                </div>
                <p class="text-sm text-gray-700 leading-relaxed text-justify">
                All content, logos, and designs in this application are the intellectual
                property of St. Vincent Ferrer Parish MPC. Unauthorized use,
                reproduction, or distribution is strictly prohibited.
                </p>
            </div>

            <!-- Term item -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 space-y-2">
                <div class="flex items-start justify-between gap-3">
                <h2 class="font-semibold text-base text-gray-900">
                    4. Limitation of Liability
                </h2>
                <i class="fa-solid fa-triangle-exclamation text-emerald-700 text-sm mt-1"></i>
                </div>
                <p class="text-sm text-gray-700 leading-relaxed text-justify">
                St. Vincent Ferrer Parish MPC is not liable for any direct, indirect,
                incidental, or consequential damages resulting from your use of the app.
                The app is provided on an “as-is” basis without warranties of any kind.
                </p>
            </div>

            <!-- Term item -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 space-y-2">
                <div class="flex items-start justify-between gap-3">
                <h2 class="font-semibold text-base text-gray-900">
                    5. Governing Law
                </h2>
                <i class="fa-solid fa-scale-balanced text-emerald-700 text-sm mt-1"></i>
                </div>
                <p class="text-sm text-gray-700 leading-relaxed text-justify">
                These terms are governed by the laws of the Republic of the Philippines.
                Any legal action related to this agreement shall be brought exclusively
                in the courts of the Philippines.
                </p>
            </div>

            <!-- Term item -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 space-y-2">
                <div class="flex items-start justify-between gap-3">
                <h2 class="font-semibold text-base text-gray-900">
                    6. Changes to Terms
                </h2>
                <i class="fa-solid fa-pen-to-square text-emerald-700 text-sm mt-1"></i>
                </div>
                <p class="text-sm text-gray-700 leading-relaxed text-justify">
                We may modify these terms at any time. Updates will be posted on this page.
                Continued use of the service after changes means you accept the new terms.
                </p>
            </div>

            <!-- Footer note -->
            <div class="text-center text-xs text-gray-500 py-2">
                Last updated: 2025
            </div>

            </div>
        </div>
    `;
}
