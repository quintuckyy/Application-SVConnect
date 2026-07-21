import { Home, initHomeDashboard } from './screens/home.js'
import { LoanApplication, initLoanApplication, } from './screens/loan-application.js';
import { LoanOverview, initLoanOverview } from './screens/loan-overview.js';
import { LoanMenu, initLoans } from './screens/loan.js'
import { LoanType } from './screens/loanType.js';
import { Savings, initSavingsOverview } from './screens/savings.js';
import { Transactions, initTransactions } from './screens/transactions.js';
import { Products } from "./screens/products.js";
import { Settings, initSettings } from "./screens/settings.js";
import { Profile, initProfileDashboard } from "./screens/profile.js";
import { CustomerSupport } from "./screens/customerSupport.js";
import { AboutSVFMPC } from './screens/aboutSVFMPC.js';
import { TermsAndCondition } from './screens/terms&condition.js';
import { Notification, initNotifications } from './screens/notification.js';
import { CompletedLoans, initCompletedLoans } from './screens/completedLoans.js';
import { FAQs, initFAQs } from './screens/FAQs.js';

// Map routes to components

//APP.JS ANG NAGLALAGAY NG HTML CONTENT SA APP.HTML

const routes = {
    '': Home,
    '#/': Home,
    '#/home': Home,
    '#/loan': LoanMenu,
    '#/savings': Savings,
    '#/transactions': Transactions,
    '#/loanType': LoanType,
    '#/loan-application': LoanApplication,
    '#/loan-overview': LoanOverview,
    '#/products': Products,
    '#/settings': Settings,
    '#/profile': Profile,
    '#/customerSupport': CustomerSupport,
    '#/aboutSVFMPC': AboutSVFMPC,
    '#/terms&condition': TermsAndCondition,
    '#/notification': Notification,
    '#/completedLoans': CompletedLoans,
    '#/FAQs': FAQs,
}

let navigationHistory = [];
let isCapacitorReady = false;
let isDeviceReady = false;
let backHandlerAttached = false;

// Bottom navigation routes
const bottomNavRoutes = new Set(['#/', '#/home', '#/products', '#/settings', '#/profile']);

function trackNavigation(hash) {
    if (!hash) return;
    const last = navigationHistory[navigationHistory.length - 1];
    if (last !== hash) {
        navigationHistory.push(hash);
    }
}

function routeIsInNav(routeHash) {
    if (bottomNavRoutes.has(routeHash)) return true;
    if (routeHash === '#/' || routeHash === '#/home') return true;
    if (routeHash.startsWith('#/products')) return true;
    if (routeHash.startsWith('#/settings')) return true;
    if (routeHash.startsWith('#/profile')) return true;
    return false;
}

function renderBottomNav(activeHash) {
    const nav = document.getElementById('bottom-nav');
    if (!nav) return;
    
    if (!routeIsInNav(activeHash)) {
        nav.innerHTML = '';
        nav.classList.add('hidden');
        return;
    }
    nav.classList.remove('hidden');

    nav.innerHTML = `
        <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div class="max-w-7xl mx-auto">
                <div class="grid grid-cols-4 gap-1">
                    <!-- Home -->
                    <a href="#/home" class="${activeHash === '#/home' ? 'text-green-600 font-semibold' : 'text-gray-600'} flex flex-col items-center py-3 px-4 transition duration-200 hover:bg-green-50 active:scale-95">
                        <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                        </svg>
                        <span class="text-xs font-semibold">Home</span>
                    </a>
                    
                    <!-- Products -->
                    <a href="#/products" class="${activeHash === '#/products' ? 'text-green-600 font-semibold' : 'text-gray-600'} flex flex-col items-center py-3 px-4 transition duration-200 hover:bg-gray-50 active:scale-95">
                        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                        <span class="text-xs font-medium">Products</span>
                    </a>
                    
                    <!-- Settings -->
                    <a href="#/settings" class="${activeHash === '#/settings' ? 'text-green-600 font-semibold' : 'text-gray-600'} flex flex-col items-center py-3 px-4 transition duration-200 hover:bg-gray-50 active:scale-95">
                        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span class="text-xs font-medium">Settings</span>
                    </a>
                    
                    <!-- Profile -->
                    <a href="#/profile" class="${activeHash === '#/profile' ? 'text-green-600 font-semibold' : 'text-gray-600'} flex flex-col items-center py-3 px-4 transition duration-200 hover:bg-gray-50 active:scale-95">
                        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span class="text-xs font-medium">Profile</span>
                    </a>
                </div>
            </div>
        </nav>
    `;
}

// Initialize back button handler - only when Capacitor is ready
function initBackButtonHandler() {
    if (backHandlerAttached) return;
    if (!window.Capacitor || !window.Capacitor.App) {
        console.log("Capacitor App plugin not ready yet");
        return;
    }

    backHandlerAttached = true;

    try {
        const { App } = window.Capacitor;
        App.addListener("backButton", () => {
            const current = location.hash.split("?")[0] || "#/home";

            // If on a main tab → exit
            if (bottomNavRoutes.has(current)) {
                App.exitApp();
                return;
            }

            // Go back in SPA history
            if (navigationHistory.length > 1) {
                navigationHistory.pop();
                const previous = navigationHistory[navigationHistory.length - 1];
                if (previous) {
                    location.hash = previous;
                    return;
                }
            }

            // Fallback → home
            location.hash = "#/home";
        });
        console.log("Back button handler attached");
    } catch (error) {
        console.error("Error attaching back button handler:", error);
    }
}

// Main mount function
function mount() {
    const root = document.getElementById('app');
    if (!root) {
        console.error("App root element not found");
        return;
    }

    let hash = location.hash.split('?')[0];
    const queryString = location.hash.split('?')[1] || '';
    const params = new URLSearchParams(queryString);

    // Default to home if no hash
    if (!hash || hash === "" || hash === "#") {
        location.hash = "#/home";
        return;
    }

    const component = routes[hash] ?? Home;

    try {
        trackNavigation(hash);

        // Render the component
        switch (hash) {
            case "#/home": {
                //
                root.innerHTML = Home();
                initHomeDashboard();
                break;
            }

            case "#/loan": {
                root.innerHTML = LoanMenu();
                initLoans()
                break;
            }

            case "#/loanType": {
                root.innerHTML = LoanType();
                break;
            }

            case "#/loan-application": {
                const loanType = params.get("loan");
                root.innerHTML = LoanApplication(loanType);
                initLoanApplication(loanType);
                break;
            }

            case "#/loan-overview": {
                root.innerHTML = LoanOverview();
                initLoanOverview();
                break;
            }

            case "#/savings": {
                root.innerHTML = Savings();
                initSavingsOverview();
                break;
            }

            case "#/transactions": {
                root.innerHTML = Transactions();
                initTransactions();
                break;
            }

            case "#/products": {
                root.innerHTML = Products();
                break;
            }

            case "#/settings": {
                root.innerHTML = Settings();
                initSettings();
                break;
            }

            case "#/profile": {
                root.innerHTML = Profile();
                initProfileDashboard();
                break;
            }

            case "#/customerSupport": {
                root.innerHTML = CustomerSupport();
                break;
            }

            case "#/aboutSVFMPC": {
                root.innerHTML = AboutSVFMPC();
                break;
            }

            case "#/terms&condition": {
                root.innerHTML = TermsAndCondition();
                break;
            }

            case "#/notification": {
                root.innerHTML = Notification();
                initNotifications();
                break;
            }

            case "#/completedLoans": {
                root.innerHTML = CompletedLoans();
                initCompletedLoans();
                break;
            }

            case '#/FAQs': {
                root.innerHTML = FAQs();
                initFAQs();
                break;
            }

            default: {
                root.innerHTML = component();
                break;
            }
        }

        // Render bottom navigation
        renderBottomNav(hash);

    } catch (err) {
        console.error("Mount error:", err);
        root.innerHTML = `<div class="p-4 text-red-600">Error loading page: ${err.message}</div>`;
    }
}

// Wait for Capacitor to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded");
    
    // Check if Capacitor is available
    if (window.Capacitor) {
        isCapacitorReady = true;
        console.log("Capacitor detected");
        
        // Initialize back button after a short delay to ensure plugin is loaded
        setTimeout(() => {
            initBackButtonHandler();
        }, 300);
    } else {
        console.log("Capacitor not available (likely running in browser)");
    }

    // Set up routing
    window.addEventListener('hashchange', mount);
    mount();
});