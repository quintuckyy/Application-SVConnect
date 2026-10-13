import { auth, db } from "../services/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import {
  getLoanProducts,
  getMemberID,
  getMemberRef,
  getLoanRef,
  createNotification,
  showSpinner,
  hideSpinner,
  showSuccess,
} from "../services/firebaseFunctions.js";
import { collection, addDoc } from "firebase/firestore";
import {
  validateLoanApplication,
  calculateAge,
  parseDateInput,
  addBusinessDays,
  MIN_BORROWER_AGE,
  MAX_BORROWER_AGE,
} from "../lib/loanRules.js";

export function LoanApplication(loanType) {
  return `
    <nav class="h-17 md:flex md:items-center md:justify-between relative">
        <div class="flex justify-between items-center w-full">
            <div class="flex items-center m-4 ml-4 transition duration-200 transform active:scale-95">
                <button onclick="location.hash='#/home'" class="p-2 transition">
                    <img src="img/back.png" class="w-6 h-6" alt="">
                </button>
            </div>
            <h1 class="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold text-gray-800">
                <!-- optional title -->
            </h1>
            <div class="mt-1 mr-2 absolute right-4 top-1/2 -translate-y-1/2 ">
                <img src="img/stVincentLOGO.jpg" 
                    alt="St. Vincent Logo" 
                    class="w-12 h-12 object-contain rounded-full">
            </div>
        </div>
    </nav>
    <div class="max-w-2xl mx-auto p-6 fade-in">
        <div class="bg-white rounded-2xl shadow-lg border border-white/20 p-8 mb-8 hover-lift">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 id="loanTitle" class="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
                    <p class="text-gray-600">Complete your application in just a few minutes</p>
                </div>
                <div class="hidden sm:block">
                    <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <i class="fas fa-hand-holding-usd text-white text-2xl"></i>
                    </div>
                </div>
            </div>
            <!-- Loan Info Button -->
            <button id="viewLoanInfoBtn" class="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-800 to-emerald-700 text-white font-medium rounded-xl transition-all duration-200 hover-lift">
                <i class="fas fa-info-circle mr-2"></i>
                View Loan Information
                <i class="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
            </button>
        </div>
    </div>

     <!-- Terms and Conditions Modal -->
    <div id="termsOverlay" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col relative">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 class="text-2xl font-bold text-gray-800">Terms and Conditions</h2>
                <button id="closeTermsBtn" class="text-gray-500 hover:text-gray-700 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <!-- Scrollable Content -->
            <div class="overflow-y-auto flex-1 p-6">
                <div class="prose max-w-none">
                    <h3 class="text-lg font-semibold mb-3">Loan Agreement Terms</h3>
                    <p class="mb-4 text-gray-700">By submitting this loan application, you agree to the following terms and conditions:</p>
                    
                    <div class="space-y-4 text-sm text-gray-600">
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-2">1. Application Processing</h4>
                            <p>All loan applications are subject to approval by St. Vincent Cooperative. Processing typically takes 1-3 business days.</p>
                        </div>
                        
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-2">2. Required Documentation</h4>
                            <p>You must provide accurate and complete information. Any false or misleading information may result in application rejection.</p>
                        </div>
                        
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-2">3. Credit Check Authorization</h4>
                            <p>You authorize St. Vincent Cooperative to perform credit checks and verify the information provided in this application.</p>
                        </div>
                        
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-2">4. Interest Rates and Fees</h4>
                            <p>Interest rates are fixed at the time of application approval. Additional fees may apply based on the loan type selected.</p>
                        </div>
                        
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-2">5. Repayment Terms</h4>
                            <p>You agree to repay the loan according to the approved payment schedule. Late payments may incur penalties.</p>
                        </div>
                        
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-2">6. Privacy and Data Protection</h4>
                            <p>Your personal information will be kept confidential and used solely for loan processing purposes in accordance with data privacy laws.</p>
                        </div>
                        
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-2">7. Loan Modification</h4>
                            <p>St. Vincent Cooperative reserves the right to modify loan terms if necessary, with proper notification to the borrower.</p>
                        </div>
                        
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-2">8. Default and Penalties</h4>
                            <p>Failure to meet payment obligations may result in penalties, legal action, and negative impact on your credit standing.</p>
                        </div>
                    </div>
                    
                    <div class="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                        <p class="text-sm text-blue-800">
                            <strong>Important:</strong> Please read all terms carefully before proceeding with your application. By checking the agreement box, you confirm that you have read, understood, and agree to these terms.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-6 border-t border-gray-200 bg-gray-50">
                <button id="acceptTermsBtn" class="w-full bg-gradient-to-r from-green-800 to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-shadow">
                    I Accept the Terms and Conditions
                </button>
            </div>
        </div>
    </div>

    <!-- Loan Information Modal -->
    <div id="overlay" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col relative">
            
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200 pt-8">
                <h2 class="text-2xl font-bold text-gray-800">Loan Information</h2>
                <button class="text-gray-500 hover:text-gray-700 transition-colors">
                </button>
            </div>

            <!-- Scrollable Content -->
            <div class="overflow-y-auto flex-1 p-6">
                
                <!-- Loan Image -->
                <div class="mb-6 rounded-xl overflow-hidden">
                    <img 
                        id="loanImg"
                        src="" 
                        alt="Loan Image"
                        class="w-full h-full object-cover"
                    />
                </div>


                <!-- Additional Info -->
                <div class="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p class="text-xs text-yellow-800">
                        <strong>Note:</strong> All loan applications are subject to approval. Please read all terms and conditions carefully before proceeding.
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-6 border-t border-gray-200 bg-gray-50">
                <button id="closeBtn" class="w-full bg-gradient-to-r from-green-800 to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-shadow">
                    Continue with Application
                </button>
            </div>
        </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 mb-6">
        <div class="bg-white rounded-lg shadow-lg p-8">
            <!-- Header -->
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Loan Application Form</h1>
                <p class="text-gray-600">Please fill out all required fields to apply for your loan</p>
            </div>

        <form id="applicationForm" class="space-y-6">
            <!-- Personal Information Section -->
            <div class="border-b border-gray-200 pb-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                <div class="mb-4">
                    <label for="branch" class="block text-sm font-medium text-gray-700 mb-2">Branch *</label>
                    <select id="branch" name="branch" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Branch</option>
                    <option value="MB">Main Branch</option>
                    <option value="RBO">Romblon Branch Office</option>
                    <option value="SBO">Sibuyan Branch Office</option>
                    </select>
                </div>  
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="Member ID" class="block text-sm font-medium text-gray-700 mb-2">Member ID *</label>
                        <input type="text" id="memID" name="Member ID" disabled
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div>
                        <label for="civilStatus" class="block text-sm font-medium text-gray-700 mb-2">Civil Status *</label>
                        <select id="civilStatus" name="civilStatus" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500">
                        <option value="">Select</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Separated">Separated</option>
                        </select>
                    </div>
                    <div>
                        <label for="dateOfBirth" class="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                        <input type="date" id="dateOfBirth" name="dateOfBirth" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div class="flex items-center gap-6 md:col-span-2">
                    <!-- Age -->
                        <div>
                            <label for="age" class="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                            <input type="number" id="age" name="age" min="18" max="80" maxlength="2" required
                            class="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500">
                        </div>
                        <!-- Gender -->
                        <div>
                            <label for="gender" class="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                            <select id="gender" name="gender" required
                            class="w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500">
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Address Information Section -->
            <div class="border-b border-gray-200 pb-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Address Information</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Permanent Address -->
                    <div class="md:col-span-2">
                        <label for="permAddress" class="block text-sm font-medium text-gray-700 mb-2">Permanent Address *</label>
                        <textarea id="permAddress" name="permAddress" rows="2" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>

                    <!-- Present Address -->
                    <div class="md:col-span-2">
                        <label for="presAddress" class="block text-sm font-medium text-gray-700 mb-2">Present Address *</label>
                        <textarea id="presAddress" name="presAddress" rows="2" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                    <div>
                        <label for="zipCode" class="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                        <input type="text" id="zipCode" name="zipCode" maxlength="4" 
                            pattern="[0-9]{4}" inputmode="numeric" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div>
                        <label for="housingStatus" class="block text-sm font-medium text-gray-700 mb-2">Housing Status *</label>
                        <select id="housingStatus" name="housingStatus" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Select Housing Status</option>
                            <option value="own">Own</option>
                            <option value="rent">Rent</option>
                            <option value="mortgage">Mortgage</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Employment Information Section -->
            <div class="border-b border-gray-200 pb-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Employment Information</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label for="employmentType" class="block text-sm font-medium text-gray-700 mb-2">Employment Type *</label>
                    <select id="employmentType" name="employmentType" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                        <option value="">Select</option>
                        <option value="Employed">Employed</option>
                        <option value="Self-Employed">Self-Employed</option>
                    </select>
                    </div>
                    <div>
                        <label for="incomeSource" class="block text-sm font-medium text-gray-700 mb-2">Source of Income *</label>
                        <select id="incomeSource" name="incomeSource" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                        <option value="">Select</option>
                        <option value="Business">Business</option>
                        <option value="Employment">Employment</option>
                        <option value="Pension">Pension</option>
                        <option value="OFW Remittance">OFW Remittance</option>
                        <option value="Agri-Related">Agri-Related</option>
                        </select>
                    </div>
                    <div>
                        <label for="incomeReceived" class="block text-sm font-medium text-gray-700 mb-2">Income Received Via *</label>
                        <select id="incomeReceived" name="incomeReceived" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                        <option value="">Select</option>
                        <option value="ATM">ATM</option>
                        <option value="Cash">Cash</option>
                        <option value="Check">Check</option>
                        <option value="Others">Others</option>
                        </select>
                    </div>
                    <div>
                        <label for="monthlyIncome" class="block text-sm font-medium text-gray-700 mb-2">Monthly Net Income (₱) *</label>
                        <input placeholder="Required Income is ₱5,000.00 monthly" type="number" id="monthlyIncome" name="monthlyIncome" min="0" step="0.01" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                </div>
            </div>

            <!-- Loan Information Section -->
            <div class="border-b border-gray-200 pb-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Loan Information</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="loanType" class="block text-sm font-medium text-gray-700 mb-2">Type of Loan</label>
                        <input type="text" id="loanType" name="loanTerm" min="0" step="0.01" disabled
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div>
                        <label for="interestRate" class="block text-sm font-medium text-gray-700 mb-2">Interest Rate</label>
                        <input type="number" id="interestRate" name="loanTerm" min="0" step="0.01" disabled
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div>
                        <label for="loanAmount" class="block text-sm font-medium text-gray-700 mb-2">Requested Loan Amount *</label>
                        <input placeholder="₱499,000.00" type="number" id="loanAmount" name="loanAmount" min="1000" step="100" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div>
                        <label id="minMaxMonths" for="loanTerm" class="block text-sm font-medium text-gray-700 mb-2">Loan Term (Months) * </label>
                        <input placeholder="" type="number" id="loanTerm" name="loanTerm" min="0" step="0.01"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>
                </div>
            </div>

            <!-- Agreement Section -->
            <div class="space-y-4">
                <div class="flex items-start mt-8">
                    <input type="checkbox" id="terms" name="terms" required
                        class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                    <label for="terms" class="ml-2 text-sm text-gray-700">
                        I agree to the <a id="termsLink" class="text-blue-600 hover:text-blue-800 underline cursor-pointer">Terms and Conditions</a> *
                    </label>
                </div>
                <div class="flex items-start">
                    <input type="checkbox" id="creditCheck" name="creditCheck" required
                        class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                    <label for="creditCheck" class="ml-2 text-sm text-gray-700">
                        I authorize a credit check to be performed *
                    </label>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 pt-6">
                <button type="submit" id="submitBtn" 
                    class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200">
                    Submit Application
                </button>
                <button type="button" id="clearBtn"
                    class="flex-1 bg-red-100 text-red-700 py-3 px-6 rounded-md font-medium hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200">
                    Clear Form
                </button>
            </div>
        </form>

        <div class="flex flex-col sm:flex-row gap-4 pt-6">
            <button type="button" onclick="location.hash='#/home'"
                class="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-md font-medium hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200">
                Back to Home Page
            </button>
        </div>

        <!-- Footer -->
        <div class="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>Your information is secure and encrypted. Processing typically takes 1-3 business days.</p>
        </div>
        </div>
    </div>
    `;
}

export async function initLoanApplication(loanType) {
  try {
    console.log(`Loan: ${loanType}`);
    const termsLink = document.getElementById("termsLink");
    const termsOverlay = document.getElementById("termsOverlay");
    const closeTermsBtn = document.getElementById("closeTermsBtn");
    const acceptTermsBtn = document.getElementById("acceptTermsBtn");
    const termsCheckbox = document.getElementById("terms");

    // Terms and Conditions modal handlers
    termsLink.addEventListener("click", (e) => {
      e.preventDefault();
      termsOverlay.classList.remove("hidden");
    });

    closeTermsBtn.addEventListener("click", () => {
      termsOverlay.classList.add("hidden");
    });

    acceptTermsBtn.addEventListener("click", () => {
      termsCheckbox.checked = true;
      termsOverlay.classList.add("hidden");
    });

    termsOverlay.addEventListener("click", (e) => {
      if (e.target === termsOverlay) {
        termsOverlay.classList.add("hidden");
      }
    });

    const loanDetails = await getLoanProducts(loanType);
    const nameID = document.getElementById("nameID");
    const subBtn = document.getElementById("applicationForm");
    const infoBtn = document.getElementById("viewLoanInfoBtn");
    const overlay = document.getElementById("overlay");
    const closeBtn = document.getElementById("closeBtn");

    document.getElementById("loanTitle").textContent = `St. Vincent ${loanDetails.loan}`;
    document.getElementById("loanImg").src = loanDetails.imgURL;

    setupAgeValidation();

    console.log(`Type of Loan: ${loanDetails.loan}`);
    console.log(`URL: ${loanDetails.imgURL}`);

    const loanSnap = await getLoanProducts(loanType);
    const maxTrm = loanSnap.loanTerms.maxMonths;
    const minTrm = loanSnap.loanTerms.minMonths;
    document.getElementById("minMaxMonths").innerHTML = `Loan Term (Months ${minTrm}-${maxTrm}) *`;

    //function for loan INFO buttons
    infoBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      overlay.classList.remove("hidden");
    });

    closeBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      overlay.classList.add("hidden");
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.add("hidden");
    });

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const memberID = await getMemberID(user);
        const memberSnap = await getMemberRef(memberID);
        document.getElementById("memID").value = memberID;
        document.getElementById("loanType").value = loanDetails.loan;
        document.getElementById("interestRate").value = loanDetails.interestRate;
        //pre fields in form
        document.getElementById("permAddress").value = memberSnap.address;
        document.getElementById("presAddress").value = memberSnap.address;
        document.getElementById("dateOfBirth").value = memberSnap.birthDate.toDate().toLocaleDateString("en-CA");

        if (nameID) {
          alert(memberID);
          nameID.textContent = `${memberID}`;
        }

        if (subBtn) {
          handleAppForm(memberID, loanType);
        }
      } else {
        alert("No user logged in!");
      }
    });
  } catch (err) {
    console.log(err);
  }
}

function domVal() {
  return {
    branch: document.getElementById("branch").value,
    memberID: document.getElementById("memID").value.trim(),
    civilStatus: document.getElementById("civilStatus").value,
    age: document.getElementById("age").value.trim(),
    gender: document.getElementById("gender").value,
    birthDate: document.getElementById("dateOfBirth").value,
    permanentAddress: document.getElementById("permAddress").value.trim(),
    presentAddress: document.getElementById("presAddress").value.trim(),
    zipCode: document.getElementById("zipCode").value.trim(),
    housingStatus: document.getElementById("housingStatus").value,
    employmentType: document.getElementById("employmentType").value,
    incomeSource: document.getElementById("incomeSource").value,
    incomeReceived: document.getElementById("incomeReceived").value,
    monthlyIncome: Number(document.getElementById("monthlyIncome").value),
    loanAmount: Number(document.getElementById("loanAmount").value.trim()),
    loanTerm: Number(document.getElementById("loanTerm").value.trim()),
    interestRate: Number(document.getElementById("interestRate").value.trim()),
    loanType: document.getElementById("loanType").value.trim(),
  };
}

async function handleAppForm(memberID, loanType) {
  const subBtn = document.getElementById("applicationForm");
  document.getElementById("clearBtn").addEventListener("click", (e) => {
    e.preventDefault();
    const confirmed = confirm("⚠️ Clear all form data? This action cannot be undone.");

    if (confirmed) {
      document.getElementById("applicationForm").reset();
      location.reload();
    }
  });
  subBtn.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formVal = domVal();
    try {
      const result = confirm(`Do you want to submit this Loan Application?`);
      if (!result) return;
      showSpinner();
      const memberSnap = await getMemberRef(memberID);
      const loanDoc = await getLoanRef(memberID);
      const loanSnap = await getLoanProducts(loanType);

      const errors = validateLoanApplication({
        monthlyIncome: formVal.monthlyIncome,
        loanAmount: formVal.loanAmount,
        loanTerm: formVal.loanTerm,
        shareCapital: memberSnap.shareCapital,
        termLimits: loanSnap.loanTerms,
        hasExistingApplication: !loanDoc.empty,
      });
      hideSpinner();
      if (errors.length) {
        if (!loanDoc.empty) document.getElementById("submitBtn").classList.add("disabled");
        alert(errors.join("\n"));
        return;
      }

      const dateApplied = new Date();
      const deadlineDate = addBusinessDays(dateApplied, 3);

      await addDoc(collection(db, "Members", memberID, "loanApplications"), {
        ...formVal,
        dateApplied: dateApplied,
        status: "Pending",
      });

      await createNotification(
        memberID,
        "Loan Submitted",
        `Your loan application has been submitted. Kindly visit our office between ${formatDate(dateApplied)} to ${formatDate(deadlineDate)} (3 business days) to complete the processing.
                 Please be advised that if you do not visit by the deadline, your application will not be processed further`,
        "loanApplication",
      );
      showSuccess(
        `Your loan application has been submitted. Kindly visit our office between ${formatDate(dateApplied)} to ${formatDate(deadlineDate)} (3 business days) to complete the processing.`,
      );
      setTimeout(() => {
        location.hash = "#/home";
      }, 3000);
    } catch (err) {
      console.error("Loan application failed:", err);
      hideSpinner();
      alert("Your application could not be submitted. Check your connection and try again.");
    }
  });
}

function setupAgeValidation() {
  const ageInput = document.getElementById("age");
  const dateOfBirthInput = document.getElementById("dateOfBirth");

  //calculate max date (18 years ago) and min date (80 years ago)
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - MIN_BORROWER_AGE, today.getMonth(), today.getDate());
  const minDate = new Date(today.getFullYear() - MAX_BORROWER_AGE, today.getMonth(), today.getDate());

  //set date input restrictions
  dateOfBirthInput.max = maxDate.toISOString().split("T")[0];
  dateOfBirthInput.min = minDate.toISOString().split("T")[0];

  //validate age matches birthdate
  function validateAgeAndBirthdate() {
    const age = parseInt(ageInput.value);
    if (!age || !dateOfBirthInput.value) return;

    const calculatedAge = calculateAge(parseDateInput(dateOfBirthInput.value));

    if (calculatedAge !== age) {
      alert(`Age ${age} does not match the birthdate. Calculated age is ${calculatedAge}.`);
      dateOfBirthInput.value = "";
      return false;
    }
    return true;
  }

  //auto-calculate age from birthdate
  dateOfBirthInput.addEventListener("change", function () {
    if (this.value) {
      ageInput.value = calculateAge(parseDateInput(this.value));
    }
  });

  //validate when age is entered
  ageInput.addEventListener("change", validateAgeAndBirthdate);
  dateOfBirthInput.addEventListener("blur", validateAgeAndBirthdate);
}

// Function to format date as "Month DD, YYYY"
function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}
