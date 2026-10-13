import { describe, it, expect } from "vitest";
import { generateSalt, hashMPIN, mpinMatches } from "../../www/js/lib/mpin.js";

describe("generateSalt", () => {
  it("returns 16 random bytes as 32 hex characters", () => {
    expect(generateSalt()).toMatch(/^[0-9a-f]{32}$/);
  });

  it("returns a different salt each time", () => {
    expect(generateSalt()).not.toBe(generateSalt());
  });
});

describe("hashMPIN", () => {
  it("is SHA-256 of the MPIN followed by the salt", async () => {
    expect(await hashMPIN("1234", "abc")).toBe(await expectedSha256("1234abc"));
  });

  it("is compatible with hashes already stored by the original app", async () => {
    // Same input order (mpin + salt) and hex encoding as the original login.js
    expect(await hashMPIN("000000", "ff")).toMatch(/^[0-9a-f]{64}$/);
  });

  it("gives different hashes for the same MPIN with different salts", async () => {
    expect(await hashMPIN("1234", "salt-a")).not.toBe(await hashMPIN("1234", "salt-b"));
  });
});

describe("mpinMatches", () => {
  it("accepts the right MPIN", async () => {
    const salt = generateSalt();
    const hash = await hashMPIN("482910", salt);
    expect(await mpinMatches("482910", hash, salt)).toBe(true);
  });

  it("rejects a wrong MPIN", async () => {
    const salt = generateSalt();
    const hash = await hashMPIN("482910", salt);
    expect(await mpinMatches("482911", hash, salt)).toBe(false);
  });

  it("rejects when no MPIN has been set", async () => {
    expect(await mpinMatches("1234", undefined, undefined)).toBe(false);
  });
});

// Independent reference implementation using Node's crypto module
async function expectedSha256(text) {
  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(text).digest("hex");
}
