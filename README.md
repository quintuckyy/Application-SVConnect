# SVConnect Mobile Application

SVConnect is the member-facing mobile app for St. Vincent Ferrer Multi-Purpose Cooperative (SVFMPC) in Romblon. Members can check their savings, track loan applications, review transaction history, and see cooperative announcements from their phone instead of having to go to the office for every inquiry. It pairs with a separate web admin dashboard that staff use to manage member records.

This was built as a capstone project and has since been approved by SVFMPC management for turnover.

---

## Tech Stack

- HTML
- CSS
- JavaScript
- Tailwind CSS
- Capacitor
- Android
- Firebase Authentication
- Cloud Firestore
- Firebase Cloud Messaging
- Supabase

---

## Features

- Registration and login, with email verification and password reset
- Home dashboard with quick actions and the current cooperative announcement
- Loan browsing, application submission, status tracking, and a completed-loans history
- Savings balance and transaction history
- In-app notifications
- Profile and settings (dark mode included)
- Customer support, FAQs, terms & conditions, and an about-the-cooperative page

---

## Project structure

```
SVConnect/
├── android/               # Capacitor-generated native Android project
│   └── app/
│       ├── google-services.json          # real Firebase config, gitignored
│       └── google-services.json.example  # placeholder, safe to commit
├── keystore/               # Android signing key 
├── public/                 # compiled CSS + web manifest
├── www/                     # the actual app
│   ├── index.html           # login
│   ├── register.html
│   ├── app.html               # shell for the logged-in app
│   └── js/
│       ├── app.js             # route table
│       ├── login.js
│       ├── screens/           # one file per screen
│       └── services/
│           ├── firebase.js                 # Firebase init
│           ├── firebaseFunctions.js         # Firestore reads/writes
│           ├── firebase.config.example.js
│           └── supabase.config.example.js
├── capacitor.config.json
└── package.json
```

---

## Running it locally

You'll need Node.js.

```bash
npm install
```

For UI work, the app was developed by just serving `www/index.html` with VS Code's Live Server extension (port 5503, see `.vscode/settings.json`). Capacitor plugins like Camera or Push Notifications won't work in a plain browser preview — those need the native build.

Tailwind is loaded via CDN in the HTML, so no build step is required to run the app. If you're editing styles and want the compiled stylesheet updated too:

```bash
npx @tailwindcss/cli -i <input.css> -o public/output.css --watch
```

---

## Building the Android app

You need a JDK (21 — Capacitor 7's Android library won't compile on 17) and the Android SDK. Android Studio isn't required, the command-line tools are enough.

1. Install JDK 21 and the SDK (`platform-tools`, `platforms;android-35`, `build-tools;35.0.0`).
2. Point Gradle at your SDK in `android/local.properties` (gitignored, machine-specific):
   ```properties
   sdk.dir=C:\\path\\to\\Android\\Sdk
   ```
3. After any change under `www/`, sync it into the native project:
   ```bash
   npx cap sync android
   ```
4. Build:
   ```bash
   cd android
   ./gradlew.bat assembleDebug   # Windows
   ./gradlew assembleDebug       # macOS/Linux
   ```
   The APK lands in `android/app/build/outputs/apk/debug/app-debug.apk`.

A release build additionally needs a signing keystore referenced from `android/app/build.gradle` — see the security notes below before generating or reusing one.

---

## Firebase / Supabase / OneSignal setup

`www/js/services/firebase.js` initializes Firebase Auth and Firestore. `android/app/google-services.json` does the same on the native side for Cloud Messaging. To point this at your own project instead of the cooperative's:

1. Create a Firebase project, enable Email/Password auth and Firestore.
2. Copy the shape from `firebase.config.example.js` into `firebase.js` with your own values.
3. Download your own `google-services.json` from Firebase's Android app settings and drop it in `android/app/` (there's a `.example` version showing the expected shape).
4. If you need the Firestore composite indexes, `firebase deploy --only firestore:indexes` using `firestore.indexes.json`.
5. For push notifications, create your own OneSignal app and swap the `onesignal_app_id` in `AndroidManifest.xml`.

The announcement banner on the home screen pulls from a Supabase table (`www/js/screens/home.js`) — `supabase.config.example.js` shows what to fill in for your own Supabase project.

---

## Project Summary

SVConnect Mobile Application is a member-facing app developed as a capstone project for St. Vincent Ferrer Multi-Purpose Cooperative in Romblon. It allows members to apply loans, view savings records, transaction history, announcements, and notifications from their phone.

---

## Future Improvements

- Add offline support for unreliable mobile connections
- Improve push notifications for loan updates, announcements, and payment reminders
- Add automated testing for core member app features
- Replace the default Android package name before production release
- Add CI/CD for Android build and release workflow
- Improve error handling, loading states, and mobile responsiveness
- Strengthen Firebase and Firestore security rules
- Add detailed loan payment tracking and due date reminders

## Project Status

Completed as a capstone project and approved by St. Vincent Cooperative management for turnover. Further improvements may include production package naming, automated testing, CI/CD release builds, and offline support.
