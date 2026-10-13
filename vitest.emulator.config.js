import { createRequire } from "node:module";
import { defineConfig } from "vitest/config";

// Resolve firebase-admin the way the Cloud Functions package does
const fromFunctions = createRequire(new URL("./functions/package.json", import.meta.url));
const adminEntry = (path) => ({ find: new RegExp(`^${path}$`), replacement: fromFunctions.resolve(path) });

// Tests that need the Firebase Emulator Suite. Run through `npm run test:emulator`,
// which starts the emulators and sets the *_EMULATOR_HOST variables.
export default defineConfig({
  resolve: {
    // Use the same Admin SDK copy as the Cloud Functions, so values such as
    // FieldValue.serverTimestamp() created by one are recognised by the other.
    alias: ["firebase-admin/app", "firebase-admin/auth", "firebase-admin/firestore"].map(adminEntry),
  },
  test: {
    include: ["tests/emulator/**/*.test.js"],
    environment: "node",
    testTimeout: 30_000,
    hookTimeout: 30_000,
    // The tests share one emulator, so run files one at a time
    fileParallelism: false,
  },
});
