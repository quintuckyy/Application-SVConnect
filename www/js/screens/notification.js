import { auth, db } from "../services/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";;
import { getMemberID, getNotifRef, formatDate, showSpinner, hideSpinner, showSuccess } from "../services/firebaseFunctions.js";
import { updateDoc, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

export function Notification() {
    return`
        <!-- TOP NAV (same palette as other screens) -->
        <nav class="bg-gradient-to-r from-green-800 to-emerald-700 shadow-md sticky top-0 z-10">
            <div class="h-16 px-3 flex items-center justify-between">
            <!-- Back -->
            <button onclick="location.hash='#/home'"
                class="w-10 h-10 flex items-center justify-center rounded-full text-white text-lg active:scale-95 transition">
                <i class="fa-solid fa-arrow-left"></i>
            </button>

            <!-- Title -->
            <h1 class="text-lg font-bold text-white tracking-wide">Notifications</h1>

            <!-- Placeholder for alignment -->
            <div class="w-10 h-10"></div>
            </div>
            <div class="h-[2px] bg-green-500/70"></div>
        </nav>

        <!-- CONTENT -->
        <div class="flex-grow overflow-y-auto bg-gray-100">
            <div class="p-4 space-y-3 max-w-xl mx-auto">

            <!-- Optional header -->
            <div class="flex items-center justify-between">
                <p class="text-sm font-semibold text-gray-600">Recent</p>
                <button id="markAllAsRead" class="text-xs text-green-700 font-medium flex items-center gap-1">
                    <i class="fa-solid fa-check"></i>
                    <span>Mark All</span>
                </button>
            </div>

            <div id="notifBody"></div>

            <!-- Empty State -->
            <div id="notifEmptyState" class="hidden">
                <div class="bg-white rounded-2xl shadow-lg p-8 text-center mt-8">
                    <div class="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">No Notifications Yet</h3>
                    <p class="text-gray-500 text-sm mb-6">Your notifications will appear here once there are updates to your account.</p>
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
        </div>
    `
}

export function initNotifications() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                showSpinner();
                const notifEmptyState = document.getElementById('notifEmptyState');
                const notifBody = document.getElementById('notifBody');
                const memberID = await getMemberID(user);
                const notifSnap = await getNotifRef(memberID);
                renderNotif(memberID)
                hideSpinner();

                if (!notifSnap || notifSnap.length === 0) {
                    notifEmptyState.classList.remove("hidden")
                    notifBody.classList.add("hidden")
                    return
                }

                notifEmptyState.classList.add("hidden")
                notifBody.classList.remove("hidden")

            } catch (err) {
                console.log(err)
            }
        }
    })
}
//everytime na may bagong notification malalagay itong code na to
async function renderNotif(memberID) {
    try {
        const notifBody = document.getElementById('notifBody');
        notifBody.innerHTML = ``;
        const notifSnap = await getNotifRef(memberID);

        notifSnap.forEach(notif => {
            const formattedDate = notif.createdAt.toDate().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            })
            const notifContainer = document.createElement('div')  
            notifContainer.innerHTML = `
            <div onclick="openNotif('${notif.id}')" id="notif-${notif.id}" class="${notif.seen === false ? 'bg-gray-200 font-bold' : ''} mb-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex gap-3">
                <!-- left icon -->
                <div id="notifIcon-${notif.id}" class="${notif.seen === false ? 'bg-gray-200' : ''} w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <i class="fa-regular fa-bell text-emerald-700"></i>
                </div>

                <!-- content -->
                <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                    <h2 class="text-sm font-bold text-gray-900 truncate">${notif.title}</h2>
                    <div class="flex items-center gap-2 shrink-0">
                        <span class="text-[11px] text-gray-500">${formattedDate}</span>
                        <span id="dot-${notif.id}" class="w-2 h-2 rounded-full ${notif.seen === false ? 'bg-emerald-600 font-semibold' : ''}"></span>
                    </div>
                </div>
                <p class="text-xs text-gray-600 mt-1 leading-snug">${notif.message}</p>
                </div>
                <button onclick="deleteNotif(event, '${notif.id}')" class="text-red-500 ml-2 hover:text-red-600" aria-label="Delete Notification">
                    <i class="fa-solid fa-trash text-sm"></i>
                </button>
            </div>
            `
            notifBody.appendChild(notifContainer);
        })
        //mark all as read func
        const markAllAsRead = document.getElementById("markAllAsRead")
        markAllAsRead.onclick = async function () {
        try {
            const notifSnap = await getNotifRef(memberID);

            //update each notif doc
            const updates = notifSnap.map(n =>
                updateDoc(doc(db, "Members", memberID, "Notifications", n.id), {
                    seen: true
                })
            );

            await Promise.all(updates);

            //remove green dots in UI
            notifSnap.forEach(n => {
                const dot = document.getElementById(`dot-${n.id}`);
                const notifIcon = document.getElementById(`notifIcon-${n.id}`);
                const card = document.getElementById(`notif-${n.id}`);
                if (dot) {
                    dot.classList.remove("bg-emerald-600");
                    notifIcon.classList.remove("bg-gray-200");
                    card.classList.remove("bg-gray-200", "font-bold");
                }
                    
            });

            } catch (err) {
                console.log(err);
            }
        };

        window.deleteNotif = async function(e, notifID) {
            e.stopPropagation();
            try {
                const result = confirm("Are you sure you want to delete this Notification?");
                if (!result) return;

                await deleteDoc(doc(db, "Members", memberID, "Notifications", notifID));

                //re-render the notification list
                renderNotif(memberID);

                showSuccess("Notification Deleted Successfully")
            } catch (err) {
                console.log(err);
            }
        }

        //func when opening a notif
        window.openNotif = async function(notifID) {
            const dot = document.getElementById(`dot-${notifID}`)
            const notifIcon = document.getElementById(`notifIcon-${notifID}`);
            const card = document.getElementById(`notif-${notifID}`);
            try {
                const loanRef = doc(db, "Members", memberID, "Notifications", notifID)
                const querySnapshot = await getDoc(loanRef);
                await updateDoc(loanRef, {seen : true})
                dot.classList.remove('bg-emerald-600');
                notifIcon.classList.remove("bg-gray-200");
                card.classList.remove("bg-gray-200", "font-bold");

                document.getElementById('notification-detail-overlay').classList.remove('hidden');
                const createdAt = querySnapshot.data().createdAt.toDate();
                const formattedTime = createdAt.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true     // 12-hour format with AM/PM
                });
                
                const userData = {
                    title: querySnapshot.data().title,
                    dateTime: `${formatDate(querySnapshot.data().createdAt)} • ${formattedTime}`,
                    message: querySnapshot.data().message
                }

                document.querySelectorAll("[data-field]").forEach(el => {
                    const field = el.dataset.field
                    el.textContent = userData[field]
                })

                document.getElementById("closeBtn").addEventListener('click', function(e) {
                    document.getElementById('notification-detail-overlay').classList.add('hidden');
                })

                document.getElementById('notification-detail-overlay').addEventListener('click', function(e) {
                    if (e.target === this) {
                        document.getElementById('notification-detail-overlay').classList.add('hidden');
                    }
                });


            } catch (err) {
                console.log(err)
            } 
        }
    } catch (err) {
        console.log(err)
    }
}