// Screens build markup with template strings. Any value that comes from the database or the
// user must go through escapeHtml before it's placed in that markup, so text such as
// `<img src=x onerror=...>` is shown as text instead of being run as HTML.

const ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[&<>"']/g, (ch) => ENTITIES[ch]);
}
