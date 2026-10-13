import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["dist/", "android/", "node_modules/", "www/public/"] },
  js.configs.recommended,
  {
    files: ["www/**/*.js"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["scripts/**", "tests/**", "*.config.js"],
    languageOptions: { globals: globals.node },
  },
  {
    rules: {
      "no-unused-vars": ["warn", { args: "none", caughtErrors: "none" }],
    },
  },
];
