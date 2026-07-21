export function AboutSVFMPC() {
    return`
        <nav class="bg-gradient-to-r from-green-800 to-emerald-700 shadow-md sticky top-0 z-10">
        <div class="h-16 px-3 flex items-center justify-between">
        <button onclick="location.hash='#/home'"
            class="w-10 h-10 flex items-center justify-center rounded-full text-white text-lg
                    active:scale-95 transition">
            <i class="fa-solid fa-arrow-left"></i>
        </button>
        <h1 class="text-lg font-bold text-white tracking-wide">
            About SVFMPC
        </h1>
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
        <div class="p-4 space-y-5 max-w-xl mx-auto">

        <!-- TOP LOGO + FULL NAME -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5
                    flex flex-col items-center text-center gap-3">
            <!-- Logo container (replace src with your logo) -->
            <div class="h-20 w-20 rounded-full bg-gray-100 shadow-sm
                        flex items-center justify-center overflow-hidden">
            <img src="img/stVincentLOGO.jpg" alt=""
                class="h-full w-full object-contain">
            </div>

            <!-- Full name -->
            <h2 class="text-base font-bold text-gray-900 leading-snug">
            St. Vincent Ferrer Parish<br>
            Multi-Purpose Cooperative
            </h2>
        </div>

        <!-- Cooperative History -->
        <section class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-1">
            <div class="flex items-center gap-2 justify-center">
            <h2 class="text-lg font-bold text-gray-900">Cooperative History</h2>
            </div>

            <div class="flex items-center justify-center -mt-2">
            <img
                src="img/st.vincent_img.jpg"
                alt="St. Vincent image"
                class="h-72 w-full max-w-md object-contain rounded-xl shadow-sm pt-0"
            >
            </div>

            <p class="text-sm text-gray-700 leading-relaxed text-justify">
            St. Vincent Coop was founded on April 20, 1991. Its founding father, Msgr. Agustin Gialogo,
            the Parish Priest of Odiongan, Romblon at that time, registered the coop with the Cooperative
            Development Authority on August 8, 1991, with 15 members pooling a capital of ₱15,000.00.
            <br><br>
            St. Vincent Coop expanded its scope of operation with four (4) branches in the Province of Romblon:
            Romblon Branch, Sibuyan Branch, San Jose Branch, and San Agustin Branch. It also established
            consumer stores in Odiongan, Romblon.
            </p>
        </section>

        <!-- Officers -->
        <section class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-3">
            <div class="flex items-center gap-2 justify-center">
            <h2 class="text-lg font-bold text-gray-900">SVFPMPC Officers</h2>
            </div>

            <div class="flex items-center justify-center">
            <img
                src="img/stvincent_officers.png"
                alt="SVFPMPC Officers"
                class="h-72 w-full max-w-md object-contain rounded-xl shadow-sm"
            />
            </div>
        </section>

        <!-- Management & Staff -->
        <section class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-3">
            <div class="flex items-center gap-2 justify-center">
            <h2 class="text-lg font-bold text-gray-900">Management &amp; Staff</h2>
            </div>

            <div class="flex items-center justify-center">
            <img
                src="img/stvincent_staff.png"
                alt="Management and Staff"
                class="h-72 w-full max-w-md object-contain rounded-xl shadow-sm"
            />
            </div>

            <div class="flex items-center justify-center">
            <img
                src="img/stvincent_staff2.png"
                alt="Management and Staff (continued)"
                class="h-72 w-full max-w-md object-contain rounded-xl shadow-sm"
            />
            </div>
        </section>

        </div>
    </div>
    `
}