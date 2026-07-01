// Front-end "soft gate" for /docs — NOT real security. The bundle ships only the
// SHA-256 hashes of the valid appkeys (hashes are one-way, so keys can't be
// recovered from them), but the PDFs under public/docs are still world-readable
// by URL. This only keeps the docs off search engines and stops casual visitors;
// anyone who reads the network tab can reach the files directly. Chosen
// deliberately for a low-sensitivity doc set with zero server changes.

// SHA-256(utf8(appkey)) for each vendor's key. Add a vendor: append its hash.
const KEY_HASHES = new Set([
  "5b459e984c89f5d2d603ebe18602ced173b02ef00ab74ab7098f47e8dfca6774", // 可豆陪陪
  "630f24c4857655e40fce1707a8543a822916ca84524f073943fe8cc1d262c235", // 二元魂
  "c3977dc1bef9d160f5ad23588bf04a629cc3b3fa238ae5012bc522d7fc75f467", // 迷你心
]);

const PASS_KEY = "docs_ok";

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// True if the typed key's hash is whitelisted. Async because crypto.subtle is.
export async function verifyKey(key: string): Promise<boolean> {
  const trimmed = key.trim();
  if (!trimmed) return false;
  return KEY_HASHES.has(await sha256Hex(trimmed));
}

// Session-scoped pass so a page reload/direct-URL hit still needs a prior verify
// this session. sessionStorage (not local) so it clears when the tab closes.
export function grantDocsPass() {
  try { sessionStorage.setItem(PASS_KEY, "1"); } catch {}
}

export function hasDocsPass(): boolean {
  try { return sessionStorage.getItem(PASS_KEY) === "1"; } catch { return false; }
}
