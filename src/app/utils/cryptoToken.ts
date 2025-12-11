// utils/cryptoToken.ts
import { createHash, randomBytes } from "crypto";

/**
 * Generate a secure cryptographic token.
 *
 * token = SHA256(ticketId + timestamp + random32bytes)
 * Output: Base64URL string (no + / =)
 */
export function generateCryptoToken(ticketId: string): string {
    const timestamp = Date.now().toString();
    const random32 = randomBytes(32).toString("hex"); // 32 bytes = 64 hex chars

    const input = ticketId + timestamp + random32;

    // Hash using SHA-256
    const hash = createHash("sha256").update(input).digest("base64");

    //   Convert to base64url (RFC 4648)
    // Short tokens, URLs, QR codes, mobile scanning
    const base64url = hash
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    return base64url;
    // return hash;
}
