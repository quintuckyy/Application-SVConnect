# SVConnect Mobile Application

A cooperative member service mobile application built for **St. Vincent Ferrer Multi-Purpose Cooperative (SVFMPC)** in Romblon. SVConnect gives members self-service access to their loan, savings, and transaction information, alongside cooperative announcements and support resources — replacing manual, in-branch inquiries with an always-available mobile experience.

This repository contains the **member-facing mobile application**. It is designed to work alongside a separate web-based admin dashboard used by cooperative staff to manage member accounts and records.

> Capstone project — **approved by St. Vincent Cooperative management for turnover**.

---

## Project Overview

SVFMPC previously relied on in-person, manual processes for members to check their savings balance, loan status, or transaction history. SVConnect digitizes these services into a single mobile app, giving members on-demand visibility into their cooperative account without needing to visit or call the office.

The app is built as a hybrid mobile application: a JavaScript single-page web app packaged into a native Android app using Capacitor, backed by Firebase for authentication and member data.

---

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Tailwind CSS
- Capacitor
- Android
- Firebase
- Firestore
- Supabase
- Node.js

---

## Main Features

- Member authentication (registration, login, email verification, password reset)
- Home dashboard with quick actions and live cooperative announcements
- Loan services: browse loan types, submit applications, track application/loan status, view completed loans
- Savings balance viewing
- Transaction history
- Push notifications and an in-app notification center
- Member profile and account settings (including dark mode)
- Customer support, FAQs, Terms & Conditions, and About the Cooperative pages

## Member App Features

| Screen | Description |
|---|---|
| Home | Dashboard with quick-access actions and the latest cooperative announcement |
| Savings | View current savings balance |
| Transactions | Browse transaction history |
| Loans | Loan type selection, loan application form, loan overview/status, and completed loans history |
| Notifications | In-app notification list synced from Firestore |
| Profile | View and manage member account details |
| Settings | App preferences, including dark mode |
| Customer Support | Contact/support information |
| About SVFMPC | Information about the cooperative |
| FAQs | Frequently asked questions |
| Terms & Conditions | App/cooperative terms |

---

## System Purpose

SVConnect exists to give SVFMPC members direct, self-service visibility into their cooperative accounts — loans, savings, and transactions — from their phone, and to keep them informed through announcements and notifications. It is the member-facing half of a two-part system, complemented by a separate staff admin dashboard for managing cooperative records.

## Project Impact

- Digitizes previously manual, in-branch member inquiries (loan status, savings balance, transaction history)
- Reduces staff workload for routine account-status questions
- Improves member access to timely cooperative announcements and promotions
- Provides a foundation the cooperative can build on for future digital services

---

## Project Structure

```
SVConnect/
├── android/                  # Native Android project (Capacitor-generated)
│   ├── app/
│   │   ├── google-services.json           # Firebase native config (⚠ see Security Notes)
│   │   ├── google-services.json.example   # Placeholder version, safe to commit
│   │   └── src/main/...
│   └── ...                        # Gradle wrapper, build config
├── assets/                   # Source icon artwork (used by @capacitor/assets)
├── icons/                    # Generated app icons & splash screens
├── keystore/                 # Android signing keystore (⚠ see Security Notes)
├── public/                   # Compiled/static stylesheets and web manifest
│   ├── output.css
│   ├── style.css
│   └── manifest.webmanifest
├── www/                      # Web app source (the app packaged into Android)
│   ├── index.html            # Login screen
│   ├── register.html         # Registration screen
│   ├── app.html               # Authenticated app shell
│   ├── img/                  # Static in-app images
│   └── js/
│       ├── app.js            # Hash-based route registry
│       ├── login.js          # Login/registration logic
│       ├── screens/          # One module per app screen (home, savings, loans, ...)
│       └── services/
│           ├── firebase.js                    # Firebase app/auth/Firestore init (real config)
│           ├── firebase.config.example.js      # Placeholder Firebase config shape
│           ├── supabase.config.example.js      # Placeholder Supabase config shape
│           └── firebaseFunctions.js            # Firestore read/write helpers
├── capacitor.config.json     # Capacitor app configuration
├── firestore.indexes.json    # Firestore composite index definitions
└── package.json
```

---

## Local Setup Instructions

**Prerequisites:** Node.js and npm.

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Run the web app directly in a browser for UI development. The project was developed using the [VS Code Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension against `www/index.html` (default port `5503` — see `.vscode/settings.json`).
   - Note: Capacitor native plugins (Camera, Push Notifications, Toast) only function inside the built native app, not in a plain browser preview.
3. (Optional) Rebuild Tailwind's compiled stylesheet after editing styles:
   ```bash
   npx @tailwindcss/cli -i <input.css> -o public/output.css --watch
   ```
   Note: both `index.html` and `app.html` also load Tailwind via the CDN script (`cdn.tailwindcss.com`), so a CLI build isn't required just to run the app locally.

---

## Android / Capacitor Setup

This project requires a JDK and the Android SDK. Full Android Studio is not required — the SDK command-line tools are enough.

1. Install **JDK 21** and the **Android SDK** (command-line tools, `platform-tools`, `platforms;android-35`, `build-tools;35.0.0`).
2. Create `android/local.properties` pointing at your SDK install (this file is gitignored and machine-specific):
   ```properties
   sdk.dir=C:\\path\\to\\Android\\Sdk
   ```
3. Sync web assets into the native project after any change to `www/`:
   ```bash
   npx cap sync android
   ```
4. Build a debug APK:
   ```bash
   cd android
   ./gradlew.bat assembleDebug     # Windows
   ./gradlew assembleDebug         # macOS/Linux
   ```
   Output: `android/app/build/outputs/apk/debug/app-debug.apk`

A **release** build additionally requires a signing keystore configured in `android/app/build.gradle` — see Security Notes below before generating or reusing one.

---

## Firebase Setup / Configuration

The app uses **Firebase Authentication** and **Cloud Firestore**, initialized in `www/js/services/firebase.js`, plus native Firebase Cloud Messaging via `android/app/google-services.json`. **Push notifications** are also wired up through **OneSignal** (App ID set in `android/app/src/main/AndroidManifest.xml`).

To run this project against your **own** Firebase project instead of the cooperative's live project:

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password provider) and **Cloud Firestore**.
3. Copy `www/js/services/firebase.config.example.js` into your own `firebaseConfig` values and use it in `firebase.js` (do not commit real values into the `.example` file).
4. Download your own `google-services.json` from Project Settings → your Android app, and place it at `android/app/google-services.json` (a placeholder shape is provided at `android/app/google-services.json.example`).
5. Deploy the Firestore indexes defined in `firestore.indexes.json` if needed:
   ```bash
   firebase deploy --only firestore:indexes
   ```
6. If you use push notifications, create your own [OneSignal](https://onesignal.com/) app and replace the `onesignal_app_id` / `com.onesignal.GoogleProjectNumber` values in `AndroidManifest.xml`.

The home-screen announcement banner additionally reads from a **Supabase** table (`www/js/screens/home.js`). Use `www/js/services/supabase.config.example.js` as a template for your own `SUPABASE_URL` / `SUPABASE_ANON_KEY` to use this feature independently of the cooperative's data.

---

## Security Notes

Do not commit real Firebase configuration, Supabase keys, OneSignal App IDs, signing keystores, `.env` files, or any production/member data to this repository. Use the `*.example` files as templates and keep real values local or in a secrets manager.

⚠️ **Two files with live/production values are currently tracked in this repo's git history** and should be removed before the repository is made public:

| File | Why it matters |
|---|---|
| `keystore/keystore` | The Android app's **signing key**. Anyone with this file can sign builds that Android/Play Store will trust as genuine updates to this app. Highest priority to remove. |
| `android/app/google-services.json` | Live Firebase project configuration (project ID, app ID, API key). Not a traditional secret — the same values ship inside every compiled APK — but it identifies the cooperative's live Firebase project and shouldn't be published unnecessarily. |

Also present in tracked source (lower risk, but public once pushed): a Firebase web API key in `firebase.js`, a Supabase anon key in `home.js`, and a OneSignal App ID / Google project number in `AndroidManifest.xml`. These key types are designed to be client-visible and are protected by Firebase Security Rules / Supabase Row Level Security rather than secrecy — but it's still worth confirming those rules are properly locked down before going public, since the exact values are now discoverable.

**Before pushing this repo publicly, run:**

```bash
git rm --cached keystore/keystore
git rm --cached android/app/google-services.json
git rm --cached android/app/release/output-metadata.json
git rm --cached android/app/release/baselineProfiles/0/app-release.dm
git rm --cached android/app/release/baselineProfiles/1/app-release.dm
git commit -m "Untrack signing keystore, Firebase config, and release build artifacts"
```

This stops tracking the files going forward (they stay on your local disk) — `.gitignore` has been updated so they won't be re-added by accident. **This does not remove them from existing git history.** If this repo will be public, either start a fresh repo from the current working tree or scrub history (e.g. `git filter-repo`) before pushing, and rotate the Firebase/Supabase/OneSignal keys since their current values are already exposed in past commits either way.

---

## Resume Summary

*Built SVConnect, a hybrid Android app (Capacitor + vanilla JS) giving cooperative members self-service access to loans, savings, and transactions via Firebase Auth/Firestore — approved by the client for turnover.*

## Future Improvements

- Untrack and rotate the currently-committed keystore and Firebase config (see Security Notes)
- Replace placeholder Android package identifiers (`com.example.myapp` / `com.examle.myapp`) with a proper production application ID before release
- Add automated tests (currently no test suite is configured)
- Add a signed, reproducible release build pipeline (CI) instead of manual keystore-based signing
- Expand offline support/error handling for unreliable mobile network conditions
- Add in-app loan payment or e-wallet integration, if within cooperative policy

## Project Status

**Completed / Approved for turnover.** The application has been reviewed and approved by St. Vincent Cooperative management. Minor UI refinements and the security hardening steps noted above are recommended before wider public release or handoff.
