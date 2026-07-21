export function LoanType() {
    return`
    <div class="min-h-screen flex flex-col bg-white">
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
            <h1 class="mr-8 text-lg font-bold text-white tracking-wide">
                Loan Type
            </h1>
            <div class="h-[2px] bg-green-500/70"></div>
        </nav>

        <div class="bg-gradient-to-r from-green-800 to-emerald-700 rounded-t-3xl p-6 mt-2 flex-1">
          <ul class="space-y-4">
            ${loanOption("personalLoan", "Personal Loan", "fa-solid fa-user")}
            ${loanOption("educationalLoan", "Educational Loan", "fa-solid fa-graduation-cap")}
            ${loanOption("hospitalizationLoan", "Hospitalization Loan", "fa-solid fa-hospital")}
            ${loanOption("motorcycleLoan", "Motorcycle Loan", "fa-solid fa-motorcycle")}
            ${loanOption("microFinanceLoan", "Micro Finance Loan", "fa-solid fa-coins")}
          </ul>
        </div>
    </div>
    `
}

function loanOption(id, label, icon) {
    return`
      <li>
        <div onclick="openLoanForm('${id}')"
           class="flex items-center rounded-lg px-4 py-3 sm:px-6 sm:py-4 justify-between
                  hover:bg-green-300 hover:scale-[1.02] transition duration-200 w-full cursor-pointer shadow-sm">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-md flex items-center justify-center">
              <i class="${icon} text-white text-lg sm:text-xl"></i>
            </div>
            <span class="font-medium text-sm sm:text-base text-white">${label}</span>
          </div>
          <span class="text-xl sm:text-2xl text-white">&#8250;</span>
        </div>
      </li>
    `
}

window.openLoanForm = function (loanID) {
  location.hash = `#/loan-application?loan=${loanID}`
}