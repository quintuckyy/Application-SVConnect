/** @type {import('tailwindcss').Config} */
export default {
  // Screens build their markup as template strings in JS, so scan those too.
  content: ["./www/*.html", "./www/js/**/*.js"],
  // app.html toggles a `dark` class on <html> (see window.toggleDarkMode).
  darkMode: "class",
  theme: { extend: {} },
  plugins: [],
};
