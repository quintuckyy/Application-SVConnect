import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const projectDir = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(projectDir, "www");

export default defineConfig({
  root,
  // .env lives in the repo root, not in www/
  envDir: projectDir,
  build: {
    outDir: resolve(projectDir, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      // Three separate pages: login, registration, and the logged-in app shell
      input: {
        index: resolve(root, "index.html"),
        register: resolve(root, "register.html"),
        app: resolve(root, "app.html"),
      },
    },
  },
  server: { port: 5503 },
  test: {
    root: projectDir,
    include: ["tests/unit/**/*.test.js"],
    environment: "node",
  },
});
