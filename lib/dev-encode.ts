// 開発者ツールのエンコード/デコード関数（UTF-8対応）

// ─── Base64 ───────────────────────────────
export function base64Encode(text: string, variant: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  let b64 = btoa(bin);
  if (variant === "urlsafe") b64 = b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return b64;
}

export function base64Decode(text: string, variant: string): string {
  let b64 = text.trim();
  if (variant === "urlsafe") {
    b64 = b64.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
  }
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

// ─── URL ─────────────────────────────────
export function urlEncode(text: string, variant: string): string {
  return variant === "full" ? encodeURIComponent(text) : encodeURI(text);
}
export function urlDecode(text: string): string {
  return decodeURIComponent(text.replace(/\+/g, " "));
}
