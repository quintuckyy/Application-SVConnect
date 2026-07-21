export function CustomerSupport() {
    return`
        <!-- TOP NAV (same as other screens) -->
        <nav class="bg-gradient-to-r from-green-800 to-emerald-700 shadow-md sticky top-0 z-10">
            <div class="h-16 px-3 flex items-center justify-between">
            <button onclick="location.hash='#/home'"
                class="w-10 h-10 flex items-center justify-center rounded-full text-white text-lg active:scale-95 transition">
                <i class="fa-solid fa-arrow-left"></i>
            </button>

            <h1 class="text-lg font-bold text-white tracking-wide">Customer Support</h1>

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

            <!-- LOGO / HEADER CARD -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col items-center gap-3">
                <div class="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <i class="fa-solid fa-headset text-emerald-700 text-2xl"></i>
                </div>
                <p class="text-sm text-gray-600 text-center">
                We’re here to help. Contact us anytime.
                </p>
            </div>

            <!-- EMAIL US -->
            <section class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-3">
                <div class="flex items-center justify-between">
                <h2 class="text-base font-bold text-gray-900">Email us</h2>
                <div class="h-[2px] flex-grow mx-3 bg-gray-200"></div>
                </div>

                <div class="space-y-2">
                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                    <i class="fa-regular fa-envelope text-emerald-700 text-base"></i>
                    <div class="min-w-0">
                        <p class="text-sm font-semibold truncate">ho@stvincentromblon.coop</p>
                        <p class="text-xs text-gray-500">Primary support email</p>
                    </div>
                    </div>

                    <a href="mailto:ho@stvincentromblon.coop"
                    class="w-9 h-9 shrink-0 rounded-lg border border-emerald-200 text-emerald-700
                            flex items-center justify-center active:scale-95 transition">
                    <i class="fa-solid fa-paper-plane text-sm"></i>
                    </a>
                </div>
                </div>
            </section>

            <!-- CALL US -->
            <section class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-3">
                <div class="flex items-center justify-between">
                <h2 class="text-base font-bold text-gray-900">Call us</h2>
                <div class="h-[2px] flex-grow mx-3 bg-gray-200"></div>
                </div>

                <div class="space-y-3">

                <!-- Odiongan -->
                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                    <i class="fa-solid fa-mobile-screen text-emerald-700 text-base"></i>
                    <div class="min-w-0">
                        <p class="text-sm font-semibold">Odiongan Branch</p>
                        <p class="text-xs text-gray-600">(0907)-101-9348</p>
                    </div>
                    </div>

                    <a href="tel:09071019348"
                    class="w-9 h-9 shrink-0 rounded-lg border border-emerald-200 text-emerald-700
                            flex items-center justify-center active:scale-95 transition">
                    <i class="fa-solid fa-phone text-sm"></i>
                    </a>
                </div>

                <!-- Romblon -->
                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                    <i class="fa-solid fa-mobile-screen text-emerald-700 text-base"></i>
                    <div class="min-w-0">
                        <p class="text-sm font-semibold">Romblon Branch</p>
                        <p class="text-xs text-gray-600">(0946)-121-1042</p>
                    </div>
                    </div>

                    <a href="tel:09461211042"
                    class="w-9 h-9 shrink-0 rounded-lg border border-emerald-200 text-emerald-700
                            flex items-center justify-center active:scale-95 transition">
                    <i class="fa-solid fa-phone text-sm"></i>
                    </a>
                </div>

                <!-- Sibuyan -->
                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                    <i class="fa-solid fa-mobile-screen text-emerald-700 text-base"></i>
                    <div class="min-w-0">
                        <p class="text-sm font-semibold">Sibuyan Branch</p>
                        <p class="text-xs text-gray-600">(0916)-6712057</p>
                    </div>
                    </div>

                    <a href="tel:09166712057"
                    class="w-9 h-9 shrink-0 rounded-lg border border-emerald-200 text-emerald-700
                            flex items-center justify-center active:scale-95 transition">
                    <i class="fa-solid fa-phone text-sm"></i>
                    </a>
                </div>

                <!-- San Jose -->
                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                    <i class="fa-solid fa-mobile-screen text-emerald-700 text-base"></i>
                    <div class="min-w-0">
                        <p class="text-sm font-semibold">San Jose Office</p>
                        <p class="text-xs text-gray-600">(0945)-875-871</p>
                    </div>
                    </div>

                    <a href="tel:0945875871"
                    class="w-9 h-9 shrink-0 rounded-lg border border-emerald-200 text-emerald-700
                            flex items-center justify-center active:scale-95 transition">
                    <i class="fa-solid fa-phone text-sm"></i>
                    </a>
                </div>

                </div>
            </section>

            <!-- VISIT US -->
            <section class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-3">
                <div class="flex items-center justify-between">
                <h2 class="text-base font-bold text-gray-900">Visit us</h2>
                <div class="h-[2px] flex-grow mx-3 bg-gray-200"></div>
                </div>

                <div class="space-y-2">
                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                    <i class="fa-solid fa-location-dot text-emerald-700 text-base"></i>
                    <div class="min-w-0">
                        <p class="text-sm font-semibold truncate">Odiongan, Romblon</p>
                        <p class="text-xs text-gray-600">J.P Laurel St. Dapawan Odiongan, Romblon</p>
                    </div>
                    </div>

                    <a href="https://www.google.com/maps/place/JP+Laurel+St,+Odiongan,+Romblon/@12.3990706,121.9845614,18z/data=!4m6!3m5!1s0x33a4c270fa093ec3:0xdd85a06cefff9b15!8m2!3d12.4002708!4d121.9841336!16s%2Fg%2F1pzvlxbsm?entry=ttu&g_ep=EgoyMDI1MTIwMi4wIKXMDSoASAFQAw%3D%3D"
                    class="w-9 h-9 shrink-0 rounded-lg border border-emerald-200 text-emerald-700
                            flex items-center justify-center active:scale-95 transition">
                    <i class="fa-solid fa-arrow-up-right-from-square text-sm"></i>
                    </a>
                </div>

                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                    <i class="fa-solid fa-globe text-emerald-700 text-base"></i>
                    <div class="min-w-0">
                        <p class="text-sm font-semibold truncate">stvincentromblon.coop</p>
                        <p class="text-xs text-gray-600">Official website</p>
                    </div>
                    </div>

                    <a href="https://stvincentromblon.coop" target="_blank"
                    class="w-9 h-9 shrink-0 rounded-lg border border-emerald-200 text-emerald-700
                            flex items-center justify-center active:scale-95 transition">
                    <i class="fa-solid fa-arrow-up-right-from-square text-sm"></i>
                    </a>
                </div>
                </div>
            </section>

            <!-- FOOTER NOTE -->
            <p class="text-center text-xs text-gray-500 py-2">
                Support hours: Mon–Fri, 8:00 AM – 5:00 PM
            </p>
            </div>
        </div>
    `
}