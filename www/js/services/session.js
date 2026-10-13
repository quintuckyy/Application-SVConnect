import { auth } from "./firebase.js";

/**
 * The signed-in user once Firebase has restored the session, or null.
 * Resolves once, unlike onAuthStateChanged, which keeps a listener alive forever.
 */
export async function getSignedInUser() {
  await auth.authStateReady();
  return auth.currentUser;
}

/**
 * Run a screen's data loading for the signed-in user. Screens used to call
 * onAuthStateChanged on every visit, which added a listener each time that was
 * never removed; this runs the callback once per visit.
 */
export function whenSignedIn(callback) {
  getSignedInUser()
    .then((user) => (user ? callback(user) : undefined))
    .catch((err) => console.error("Session check failed:", err));
}
