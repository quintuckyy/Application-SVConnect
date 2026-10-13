import { initializeApp } from "firebase-admin/app";
import { setGlobalOptions } from "firebase-functions";

// Imported first by index.ts: ES modules run every import before the importing file's own
// code, so options set in index.ts itself would apply after the functions were defined.
initializeApp();
// Singapore is the closest region to the Philippines
setGlobalOptions({ region: "asia-southeast1", maxInstances: 10 });
