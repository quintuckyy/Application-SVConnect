export function Products() {
  return `
    <!-- Header -->
    <div class="mb-6 bg-gradient-to-r from-green-800 to-emerald-700 text-white px-6 py-8 shadow-lg rounded-b-2xl">
        <div class="max-w-6xl mx-auto">
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center">
                    <button onclick="location.hash='#/home'" class="mr-4 hover:bg-white/10 p-2 rounded-lg transition">
                        <i class="fas fa-arrow-left text-xl"></i>
                    </button>
                    <h1 class="text-2xl font-bold">Our Products</h1>
                </div>
                <img src="img/stVincentLOGO.jpg" alt="St. Vincent Logo" class="rounded-full h-16 w-auto">
            </div>
            
            <p class="text-green-100 text-sm">Discover our comprehensive range of financial products designed to meet your needs</p>
        </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-6 py-6 -mt-4">
        <!-- Loan Products Section -->
        <div class="bg-green-50 rounded-2xl shadow-md p-6 mb-6">
            <div class="mb-6">
                <h3 class="text-xl font-bold text-gray-800 mb-2">Loan Products</h3>
                <p class="text-sm text-gray-500">Choose the loan that best fits your needs</p>
            </div>
            
            <div class="loan-container">
                <!-- Educational Loan -->
                <div class="mb-9 product-card bg-white border-2 border-gray-100 rounded-xl overflow-hidden shadow-xl hover:shadow-xl cursor-pointer">
                    <div class="aspect-[400/566] bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden relative">
                        <img src="https://stvincentromblon.coop/wp-content/uploads/2024/05/27-400x566.png" 
                             alt="Educational Loan" 
                             class="w-full h-full object-cover">
                        <div class="absolute top-4 right-4 bg-green-700 text-white px-3 py-1 rounded-full text-xs font-bold">
                            Popular
                        </div>
                    </div>
                    <div class="p-5">
                        <h4 class="text-lg font-bold text-gray-800 mb-2">Educational Loan</h4>
                        <p class="text-sm text-gray-600 mb-4">Invest in your future with our flexible education financing options</p>
                    </div>
                </div>

                <!-- Hospitalization Loan -->
                <div class="mb-9 product-card bg-white border-2 border-gray-100 rounded-xl overflow-hidden shadow-xl hover:shadow-xl cursor-pointer">
                    <div class="aspect-[400/566] bg-gradient-to-br from-blue-50 to-cyan-50 overflow-hidden">
                        <img src="https://stvincentromblon.coop/wp-content/uploads/2024/05/28-400x566.png" 
                             alt="Hospitalization Loan" 
                             class="w-full h-full object-cover">
                    </div>
                    <div class="p-5">
                        <h4 class="text-lg font-bold text-gray-800 mb-2">Hospitalization Loan</h4>
                        <p class="text-sm text-gray-600 mb-4">Get the healthcare support you need when you need it most</p>
                    </div>
                </div>

                <!-- Micro Finance Loan -->
                <div class="mb-9 product-card bg-white border-2 border-gray-100 rounded-xl overflow-hidden shadow-xl hover:shadow-xl cursor-pointer">
                    <div class="aspect-[400/566] bg-gradient-to-br from-amber-50 to-yellow-50 overflow-hidden">
                        <img src="https://stvincentromblon.coop/wp-content/uploads/2024/05/15-600x849.png" 
                             alt="Micro Finance Loan" 
                             class="w-full h-full object-cover">
                    </div>
                    <div class="p-5">
                        <h4 class="text-lg font-bold text-gray-800 mb-2">Micro Finance Loan</h4>
                        <p class="text-sm text-gray-600 mb-4">Small loans designed to help you achieve big opportunities</p>
                    </div>
                </div>

                <!-- Motorcycle Loan -->
                <div class="mb-9 product-card bg-white border-2 border-gray-100 rounded-xl overflow-hidden shadow-xl hover:shadow-xl cursor-pointer">
                    <div class="aspect-[400/566] bg-gradient-to-br from-red-50 to-orange-50 overflow-hidden">
                        <img src="https://stvincentromblon.coop/wp-content/uploads/2024/05/3-400x566.png" 
                             alt="Motorcycle Loan" 
                             class="w-full h-full object-cover">
                    </div>
                    <div class="p-5">
                        <h4 class="text-lg font-bold text-gray-800 mb-2">Motorcycle Loan</h4>
                        <p class="text-sm text-gray-600 mb-4">Get mobile with ease through affordable motorcycle financing</p>
                    </div>
                </div>

                <!-- Personal Loan -->
                <div class="mb-9 product-card bg-white border-2 border-gray-100 rounded-xl overflow-hidden shadow-xl hover:shadow-xl cursor-pointer">
                    <div class="aspect-[400/566] bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden relative">
                        <img src="https://stvincentromblon.coop/wp-content/uploads/2024/05/7-400x566.png" 
                             alt="Personal Loan" 
                             class="w-full h-full object-cover">
                        <div class="absolute top-4 right-4 bg-green-700 text-white px-3 py-1 rounded-full text-xs font-bold">
                            Flexible
                        </div>
                    </div>
                    <div class="p-5">
                        <h4 class="text-lg font-bold text-gray-800 mb-2">Personal Loan</h4>
                        <p class="text-sm text-gray-600 mb-4">Flexible financing solution for all your personal needs</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Savings Products Section -->
        <div class="bg-green-50 rounded-2xl shadow-md p-6 mb-6">
            <div class="mb-6">
                <h3 class="text-xl font-bold text-gray-800 mb-2">Savings Products</h3>
                <p class="text-sm text-gray-500">Build your financial future with us</p>
            </div>
            
            <div class="max-w-md mx-auto">
                <div class="product-card bg-white border-2 border-green-100 rounded-xl overflow-hidden shadow-xl hover:shadow-xl cursor-pointer">
                    <div class="aspect-[400/566] bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden relative">
                        <img src="https://stvincentromblon.coop/wp-content/uploads/2024/05/16-400x566.png" 
                             alt="Member Savings" 
                             class="w-full h-full object-cover">
                        <div class="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                            <i class="fas fa-star mr-1"></i>Recommended
                        </div>
                    </div>
                    <div class="p-6">
                        <h4 class="text-xl font-bold text-gray-800 mb-2">Member Savings</h4>
                        <p class="text-sm text-gray-600 mb-4">Start your savings journey and watch your money grow with competitive interest rates</p>
                        
                        <div class="grid grid-cols-2 gap-3 mb-4">
                            <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                                <div class="flex items-center mb-2">
                                    <i class="fas fa-percentage text-green-700 text-lg"></i>
                                </div>
                                <p class="text-xs text-gray-600 mb-1">Interest Rate</p>
                                <p class="font-bold text-green-700 text-sm">Competitive</p>
                            </div>
                            <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                                <div class="flex items-center mb-2">
                                    <i class="fas fa-coins text-green-700 text-lg"></i>
                                </div>
                                <p class="text-xs text-gray-600 mb-1">Min. Deposit</p>
                                <p class="font-bold text-green-700 text-sm">Flexible</p>
                            </div>
                        </div>
                        
                        <button onclick="location.hash='#/savings'" class="w-full bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 text-white font-medium py-3 rounded-lg transition text-sm shadow-md">
                            <i class="fas fa-piggy-bank mr-2"></i>Open Account
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Benefits Card -->
        <div class="bg-gradient-to-r from-green-700 to-emerald-600 rounded-2xl shadow-lg p-8 text-white mb-6">
            <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <i class="fas fa-check-double text-2xl"></i>
                </div>
                <h3 class="text-xl font-bold">Why Choose Our Products?</h3>
            </div>
            <div class="grid md:grid-cols-3 gap-4">
                <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                        <i class="fas fa-percentage text-xl"></i>
                    </div>
                    <h4 class="font-bold mb-2">Competitive Rates</h4>
                    <p class="text-sm text-green-50">Get the best interest rates with flexible terms that work for you</p>
                </div>
                <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                        <i class="fas fa-bolt text-xl"></i>
                    </div>
                    <h4 class="font-bold mb-2">Quick Approval</h4>
                    <p class="text-sm text-green-50">Fast processing with minimal requirements for your convenience</p>
                </div>
                <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                        <i class="fas fa-headset text-xl"></i>
                    </div>
                    <h4 class="font-bold mb-2">Dedicated Support</h4>
                    <p class="text-sm text-green-50">Our team is always here to guide you every step of the way</p>
                </div>
            </div>
        </div>

        <!-- Contact Support -->
        <div class="bg-white rounded-2xl shadow-md p-8 mb-6">
            <div class="text-center max-w-md mx-auto">
                <div class="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <i class="fas fa-comments text-green-700 text-3xl"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Need Help Choosing?</h3>
                <p class="text-sm text-gray-600 mb-6">Our financial advisors are ready to help you find the perfect product for your needs</p>
                <div class="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onclick="location.hash='#/customerSupport'" class="bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 text-white font-medium py-3 px-8 rounded-lg transition shadow-md">
                        <i class="fas fa-phone mr-2"></i>Contact Support
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="h-20"></div>
    `;
}
