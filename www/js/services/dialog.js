// A modal form for sensitive input. Replaces window.prompt(), which can't mask passwords
// or MPINs, has no labels, and can't validate.
import { escapeHtml } from "../lib/html.js";

/**
 * @typedef {object} DialogField
 * @property {string} name - key in the returned object
 * @property {string} label
 * @property {"password"|"email"|"text"} [type]
 * @property {string} [autocomplete] - e.g. "current-password", "email"
 * @property {"numeric"} [inputMode] - shows the number pad on phones
 * @property {string} [pattern] - e.g. "\\d{4}"
 * @property {number} [maxLength]
 * @property {string} [hint] - message shown when the pattern doesn't match
 */

/**
 * Ask for one or more values in a modal form.
 * @param {{ title: string, message?: string, fields: DialogField[], submitLabel?: string }} options
 * @returns {Promise<Record<string, string> | null>} the trimmed values, or null if cancelled
 */
export function askForInput({ title, message = "", fields, submitLabel = "Continue" }) {
  return new Promise((resolve) => {
    const previousFocus = document.activeElement;
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 z-[10002] flex items-center justify-center bg-black/60 p-4";
    overlay.innerHTML = `
      <form class="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="dialogTitle" novalidate>
        <h2 id="dialogTitle" class="text-lg font-bold text-gray-900">${escapeHtml(title)}</h2>
        ${message ? `<p class="text-sm text-gray-600">${escapeHtml(message)}</p>` : ""}
        ${fields
          .map(
            (f) => `
          <label class="block space-y-1">
            <span class="text-sm font-semibold text-gray-700">${escapeHtml(f.label)}</span>
            <input name="${escapeHtml(f.name)}" type="${f.type || "text"}" required
              ${f.autocomplete ? `autocomplete="${escapeHtml(f.autocomplete)}"` : ""}
              ${f.inputMode ? `inputmode="${f.inputMode}"` : ""}
              ${f.pattern ? `pattern="${escapeHtml(f.pattern)}"` : ""}
              ${f.maxLength ? `maxlength="${f.maxLength}"` : ""}
              ${f.hint ? `title="${escapeHtml(f.hint)}"` : ""}
              class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200">
          </label>`,
          )
          .join("")}
        <p data-error class="hidden text-sm font-medium text-red-600" role="alert"></p>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" data-cancel class="rounded-xl px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
          <button type="submit" class="rounded-xl bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700">${escapeHtml(submitLabel)}</button>
        </div>
      </form>`;

    const form = overlay.querySelector("form");
    const error = overlay.querySelector("[data-error]");

    const close = (result) => {
      overlay.remove();
      document.removeEventListener("keydown", onKey);
      previousFocus?.focus?.();
      resolve(result);
    };
    const onKey = (e) => {
      if (e.key === "Escape") close(null);
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const invalid = [...form.elements].find((el) => el.willValidate && !el.checkValidity());
      if (invalid) {
        const field = fields.find((f) => f.name === invalid.name);
        error.textContent = invalid.validity.valueMissing
          ? `Enter your ${field.label.toLowerCase()}.`
          : field.hint || invalid.validationMessage;
        error.classList.remove("hidden");
        invalid.focus();
        return;
      }
      close(Object.fromEntries(fields.map((f) => [f.name, form.elements[f.name].value.trim()])));
    });
    overlay.querySelector("[data-cancel]").addEventListener("click", () => close(null));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close(null);
    });
    document.addEventListener("keydown", onKey);

    document.body.appendChild(overlay);
    form.elements[fields[0].name].focus();
  });
}

export const MPIN_FIELD = {
  name: "mpin",
  label: "MPIN",
  type: "password",
  inputMode: "numeric",
  pattern: "\\d{4}",
  maxLength: 4,
  autocomplete: "off",
  hint: "Your MPIN is 4 digits.",
};
