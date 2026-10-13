# SVConnect Mobile Application

SVConnect is the member-facing mobile app for St. Vincent Ferrer Multi-Purpose Cooperative (SVFMPC) in Romblon. Members can check their savings, track loan applications, review transaction history, and see cooperative announcements from their phone instead of having to go to the office for every inquiry. It pairs with a separate web admin dashboard that staff use to manage member records.

This was built as a capstone project and has since been approved by SVFMPC management for turnover.

---

## Tech Stack

- JavaScript (ES modules), HTML, Tailwind CSS 3
- Vite (build and dev server), Capacitor 7 (Android)
- Firebase Authentication and Cloud Firestore (Firebase JS SDK from npm)
- Supabase (home-screen announcements)
- Vitest (unit tests), ESLint, Prettier

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
├── android/                 # Capacitor-generated native Android project
├── scripts/
│   └── seed-firestore.mjs   # fills a Firestore project with fictional test data
├── tests/                   # Vitest unit tests
├── www/                     # app source (Vite root)
│   ├── index.html           # login
│   ├── register.html
│   ├── app.html             # shell for the logged-in app
│   ├── styles.css           # Tailwind + Font Awesome, compiled by Vite
│   ├── public/img/          # images, copied as-is into the build
│   └── js/
│       ├── app.js           # hash router
│       ├── login.js         # registration, login, password reset
│       ├── screens/         # one file per screen (render + init)
│       ├── lib/             # pure logic: loan rules, MPIN hashing (unit tested)
│       └── services/        # Firebase, Firestore queries, Supabase
├── .env.example             # copy to .env and fill in
├── vite.config.js
├── capacitor.config.json    # webDir: dist (the Vite build output)
└── package.json
```

---

## Running it locally

You'll need Node.js 20 or newer.

```bash
npm install
cp .env.example .env    # then fill in your Firebase and Supabase values
npm run dev             # http://localhost:5503
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build |
| `npm test` | Run the unit tests |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run android` | Build and copy into the Android project |
| `npm run seed` | Write fictional test data to Firestore (see below) |

Capacitor plugins like Push Notifications only work in the native build, not in the browser.

---

## Building the Android app

You need a JDK (21 — Capacitor 7's Android library won't compile on 17) and the Android SDK. Android Studio isn't required, the command-line tools are enough.

1. Install JDK 21 and the SDK (`platform-tools`, `platforms;android-35`, `build-tools;35.0.0`).
2. Point Gradle at your SDK in `android/local.properties` (gitignored, machine-specific):
   ```properties
   sdk.dir=C:\\path\\to\\Android\\Sdk
   ```
3. Build the web app and sync it into the native project:
   ```bash
   npm run android
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

The web app reads its Firebase and Supabase settings from `.env` (see `.env.example`). Firebase web config isn't secret; access is controlled by Firestore Security Rules.

1. Create a Firebase project, enable Email/Password sign-in, and create a Firestore database.
2. Put the web app config in `.env`.
3. Seed test data: Project settings → Service accounts → Generate new private key, save it as `serviceAccountKey.json` in the repo root (gitignored), then run `npm run seed`. Register in the app with Member ID 100001, 100002 or 100003. The script refuses to write to any project except the one named in it.
4. For Android push notifications, download your own `google-services.json` into `android/app/` and set your own `onesignal_app_id` in `AndroidManifest.xml`.

The home-screen announcement comes from a Supabase `announcements` table. If the Supabase variables are empty, the banner keeps its default content.

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
