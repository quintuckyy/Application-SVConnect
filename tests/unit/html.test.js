import { describe, it, expect } from "vitest";
import { escapeHtml } from "../../www/js/lib/html.js";

describe("escapeHtml", () => {
  it("neutralises markup", () => {
    expect(escapeHtml('<img src=x onerror="alert(1)">')).toBe("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
  });

  it("escapes quotes so values are safe inside attributes", () => {
    expect(escapeHtml(`a'b"c`)).toBe("a&#39;b&quot;c");
  });

  it("escapes ampersands first, without double-escaping", () => {
    expect(escapeHtml("Tom & Jerry &lt;")).toBe("Tom &amp; Jerry &amp;lt;");
  });

  it("leaves normal text alone, including the peso sign and emoji", () => {
    expect(escapeHtml("₱4,666.67 ⚠️ overdue")).toBe("₱4,666.67 ⚠️ overdue");
  });

  it("turns null and undefined into an empty string", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });

  it("converts numbers to text", () => {
    expect(escapeHtml(93.33)).toBe("93.33");
  });
});
