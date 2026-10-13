// Runs the Firebase CLI with a longer Cloud Functions load timeout.
//
// On the first start after `npm install`, loading the functions can take longer than the
// emulator's default 10 seconds, and every function call then fails with "not-found".
// Setting the variable here works the same on Windows, macOS and Linux, which an inline
// `VAR=value command` in package.json would not.
//
// Usage: node scripts/firebase-emulators.mjs <firebase CLI arguments>
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

process.env.FUNCTIONS_DISCOVERY_TIMEOUT ??= "60";

// Run the CLI's own entry file with Node, so arguments are passed through unchanged
const firebaseCli = createRequire(import.meta.url).resolve("firebase-tools/lib/bin/firebase.js");
const result = spawnSync(process.execPath, [firebaseCli, ...process.argv.slice(2)], { stdio: "inherit" });
process.exit(result.status ?? 1);
