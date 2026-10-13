// MPIN hashing. Pure functions with no Firebase dependency, so they can be unit tested.
// Uses the Web Crypto API, available in browsers, the Android WebView and Node 20+.

const toHex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

// Random 16-byte salt as a 32-character hex string
export function generateSalt() {
  return toHex(crypto.getRandomValues(new Uint8Array(16)));
}

// SHA-256 of MPIN + salt, as a 64-character hex string
export async function hashMPIN(mpin, salt) {
  const data = new TextEncoder().encode(mpin + salt);
  return toHex(new Uint8Array(await crypto.subtle.digest("SHA-256", data)));
}

export async function mpinMatches(inputMPIN, storedHash, storedSalt) {
  if (!storedHash || !storedSalt) return false;
  return (await hashMPIN(inputMPIN, storedSalt)) === storedHash;
}
