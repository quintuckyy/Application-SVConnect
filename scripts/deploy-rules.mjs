// Publishes Firestore Security Rules with the Admin SDK and the service account key.
//
//   npm run deploy:rules -- fallback   firestore.fallback.rules (no Cloud Functions deployed)
//   npm run deploy:rules -- strict     firestore.rules (only together with the Cloud Functions)
//
// The Firebase CLI can also deploy rules, but it needs a logged-in user or broader service
// account permissions; this needs only the key used by `npm run seed`.
import { existsSync, readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getSecurityRules } from "firebase-admin/security-rules";

const ALLOWED_PROJECT = "st-vincent-coop-connect";
const FILES = { fallback: "firestore.fallback.rules", strict: "firestore.rules" };

const which = process.argv[2];
if (!FILES[which]) {
  console.error("Choose which rules to deploy: npm run deploy:rules -- fallback | strict");
  process.exit(1);
}
if (!existsSync("serviceAccountKey.json")) {
  console.error("serviceAccountKey.json not found in the repo root (see README).");
  process.exit(1);
}

const key = JSON.parse(readFileSync("serviceAccountKey.json", "utf8"));
if (key.project_id !== ALLOWED_PROJECT) {
  console.error(`Refusing to deploy to "${key.project_id}". This script only deploys to "${ALLOWED_PROJECT}".`);
  process.exit(1);
}

initializeApp({ credential: cert(key), projectId: key.project_id });
const source = readFileSync(FILES[which], "utf8");
// Compiles the rules on Google's side first; a syntax error stops the release
const ruleset = await getSecurityRules().releaseFirestoreRulesetFromSource(source);
console.log(`Deployed ${FILES[which]} to ${key.project_id} (ruleset ${ruleset.name.split("/").pop()}).`);
