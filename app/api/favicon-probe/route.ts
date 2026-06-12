import { NextRequest, NextResponse } from "next/server";
import dns from "dns";
import net from "net";

// ── SSRF Protection ────────────────────────────────────────────────────
const PRIVATE_RANGES = [
  /^127\./,
  /^0\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^::1$/,
  /^fc00:/i,
  /^fd/i,
  /^fe80:/i,
  /^100\.64\./,
  /^198\.18\./,
  /^169\.254\.169\.254$/,  // AWS metadata
  /^metadata\.google\.internal$/,
];

function isPrivateIP(addr: string): boolean {
  const clean = addr.trim().toLowerCase();
  return PRIVATE_RANGES.some(r => r.test(clean));
}

async function validateUrl(rawUrl: string): Promise<{ safe: boolean; url: URL; error?: string }> {
  let url: URL;
  try {
    url = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
  } catch {
    return { safe: false, url: new URL("http://invalid"), error: "URLの形式が正しくありません。" };
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    return { safe: false, url, error: "http / https のみ対応しています。" };
  }

  const hostname = url.hostname.toLowerCase();

  // Reject localhost by name
  if (hostname === "localhost" || hostname.endsWith(".local") || hostname === "0.0.0.0") {
    return { safe: false, url, error: "内部アドレスへのアクセスはできません。" };
  }

  // Check if it's an IP literal
  if (net.isIP(hostname)) {
    if (isPrivateIP(hostname)) {
      return { safe: false, url, error: "プライベートIPアドレスへのアクセスはできません。" };
    }
    return { safe: true, url };
  }

  // DNS resolution check
  try {
    const addrs = await dns.promises.lookup(hostname, { all: true }).catch(async () => {
      // Fallback for environments without all option
      const single = await dns.promises.lookup(hostname);
      return [single];
    });
    for (const addr of addrs) {
      const ip = "address" in addr ? (addr as { address: string }).address : String(addr);
      if (isPrivateIP(ip)) {
        return { safe: false, url, error: "内部ネットワークのアドレスへのアクセスはできません。" };
      }
    }
  } catch {
    // DNS resolution failure is OK — let fetch handle it
  }

  return { safe: true, url };
}

// ── Fetch with safety ──────────────────────────────────────────────────
async function safeFetch(url: string): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: { "User-Agent": "ToolBox/1.0 FaviconChecker (+https://toolboxjp.com)" },
    });
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

async function checkUrl(url: string): Promise<{
  status: number;
  contentType?: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
}> {
  try {
    const { safe } = await validateUrl(url);
    if (!safe) return { status: 0 };

    const res = await safeFetch(url);
    const contentType = res.headers.get("content-type") ?? undefined;
    const buf = await res.arrayBuffer();
    const sizeBytes = buf.byteLength;

    // Get image dimensions for PNG/ICO
    let width: number | undefined;
    let height: number | undefined;
    if (contentType?.includes("png") || contentType?.includes("icon") || contentType?.includes("x-icon")) {
      const view = new DataView(buf);
      // PNG signature check
      if (buf.byteLength > 24 && view.getUint32(0) === 0x89504e47) {
        width = view.getUint32(16);
        height = view.getUint32(20);
      }
    }

    return { status: res.status, contentType, sizeBytes, width, height };
  } catch {
    return { status: 0 };
  }
}

// ── HTML parser (simple regex-based) ──────────────────────────────────
interface LinkTagInfo {
  rel: string;
  href: string;
  sizes?: string;
  type?: string;
}

function parseHtmlLinkTags(html: string, baseUrl: string): LinkTagInfo[] {
  const tags: LinkTagInfo[] = [];
  const linkRe = /<link([^>]+)>/gi;
  let match;
  while ((match = linkRe.exec(html)) !== null) {
    const attrs = match[1];
    const rel = (attrs.match(/rel=["']([^"']*)["']/i)?.[1] ?? "").toLowerCase();
    if (!["icon", "shortcut icon", "apple-touch-icon", "mask-icon", "manifest"].includes(rel)) continue;
    const href = attrs.match(/href=["']([^"']*)["']/i)?.[1] ?? "";
    const sizes = attrs.match(/sizes=["']([^"']*)["']/i)?.[1];
    const type = attrs.match(/type=["']([^"']*)["']/i)?.[1];
    if (!href) continue;
    // Resolve relative URLs
    let resolved = href;
    try {
      resolved = new URL(href, baseUrl).toString();
    } catch { /* keep as-is */ }
    tags.push({ rel, href: resolved, sizes, type });
  }
  return tags;
}

function parseManifestLink(html: string, baseUrl: string): string | null {
  const m = html.match(/<link[^>]+rel=["']manifest["'][^>]+href=["']([^"']*)["']/i)
    || html.match(/<link[^>]+href=["']([^"']*manifest[^"']*)["'][^>]+rel=["']manifest["']/i);
  if (!m) return null;
  try { return new URL(m[1], baseUrl).toString(); } catch { return null; }
}

// ── Main handler ───────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url") ?? "";

  if (!rawUrl) {
    return NextResponse.json({ error: "URLパラメータが必要です。" }, { status: 400 });
  }

  const { safe, url, error: urlError } = await validateUrl(rawUrl);
  if (!safe) {
    return NextResponse.json({ error: urlError ?? "URLが安全でないため診断できません。" }, { status: 400 });
  }

  try {
    // Fetch page HTML
    const htmlRes = await safeFetch(url.toString());
    if (!htmlRes.ok) {
      return NextResponse.json({ error: `サイトの取得に失敗しました (HTTP ${htmlRes.status})。` }, { status: 502 });
    }
    const contentType = htmlRes.headers.get("content-type") ?? "";
    if (!contentType.includes("html")) {
      return NextResponse.json({ error: "HTMLページが返されませんでした。URLを確認してください。" }, { status: 422 });
    }

    const htmlText = await htmlRes.text().catch(() => "");
    const pageUrl = htmlRes.url; // after redirect

    // favicon.ico
    const faviconIcoUrl = new URL("/favicon.ico", pageUrl).toString();
    const faviconIcoInfo = await checkUrl(faviconIcoUrl);

    // Link tags
    const rawTags = parseHtmlLinkTags(htmlText, pageUrl);
    const linkTagsWithStatus = await Promise.all(
      rawTags.slice(0, 12).map(async tag => {
        const info = await checkUrl(tag.href);
        return { ...tag, status: info.status, contentType: info.contentType, sizeBytes: info.sizeBytes, width: info.width, height: info.height };
      })
    );

    // Manifest
    const manifestUrl = parseManifestLink(htmlText, pageUrl);
    let manifest: {
      url: string;
      valid: boolean;
      themeColor?: string;
      icons: Array<{ src: string; sizes?: string; purpose?: string; status?: number }>;
    } | undefined;

    if (manifestUrl) {
      try {
        const manifestRes = await safeFetch(manifestUrl);
        const manifestText = await manifestRes.text();
        const manifestJson = JSON.parse(manifestText);
        const icons = (manifestJson.icons ?? []).slice(0, 12).map(async (icon: { src?: string; sizes?: string; purpose?: string }) => {
          const src = icon.src ?? "";
          let resolvedSrc = src;
          try { resolvedSrc = new URL(src, manifestUrl).toString(); } catch { /* keep */ }
          const info = await checkUrl(resolvedSrc);
          return { src: resolvedSrc, sizes: icon.sizes, purpose: icon.purpose, status: info.status };
        });
        manifest = {
          url: manifestUrl,
          valid: true,
          themeColor: manifestJson.theme_color,
          icons: await Promise.all(icons),
        };
      } catch {
        manifest = { url: manifestUrl, valid: false, icons: [] };
      }
    }

    // Generate issues
    const issues: Array<{ severity: "error" | "warn" | "info"; title: string; detail: string }> = [];

    if (!faviconIcoInfo.status || faviconIcoInfo.status < 200 || faviconIcoInfo.status >= 300) {
      issues.push({
        severity: "warn",
        title: "favicon.ico が見つかりません",
        detail: "/favicon.ico が取得できませんでした。古いブラウザや一部の環境でアイコンが表示されない場合があります。",
      });
    }

    const hasAppleTouch = linkTagsWithStatus.some(t => t.rel === "apple-touch-icon");
    if (!hasAppleTouch) {
      issues.push({
        severity: "warn",
        title: "Apple Touch Icon が設定されていません",
        detail: "iPhoneのホーム画面に追加する際のアイコンがありません。<link rel=\"apple-touch-icon\" href=\"...\"> を追加してください。",
      });
    }

    if (!manifestUrl) {
      issues.push({
        severity: "info",
        title: "Web App Manifest が設定されていません",
        detail: "PWAとして動作させたい場合、site.webmanifest と <link rel=\"manifest\"> が必要です。",
      });
    }

    if (manifest && manifest.valid) {
      const hasMaskable = manifest.icons.some(i => i.purpose?.includes("maskable"));
      if (!hasMaskable) {
        issues.push({
          severity: "warn",
          title: "Maskable Icon が設定されていません",
          detail: "Manifestのiconsにpurpose: \"maskable\"のアイコンがありません。AndroidのPWAアイコンが崩れる場合があります。",
        });
      }
      const has512 = manifest.icons.some(i => i.sizes?.includes("512"));
      if (!has512) {
        issues.push({
          severity: "info",
          title: "512×512px アイコンが Manifest にありません",
          detail: "Googleが推奨する512pxアイコンが見つかりません。",
        });
      }
    }

    const brokenLinks = linkTagsWithStatus.filter(t =>
      t.rel !== "manifest" && t.status && (t.status < 200 || t.status >= 300)
    );
    if (brokenLinks.length > 0) {
      issues.push({
        severity: "error",
        title: `ファビコンリンクが${brokenLinks.length}件アクセスできません`,
        detail: brokenLinks.map(l => l.href).join(", "),
      });
    }

    if (issues.length === 0) {
      issues.push({
        severity: "info",
        title: "✅ 基本的なファビコン設定が確認できました",
        detail: "重大な問題は見つかりませんでした。より詳細な診断は手動でご確認ください。",
      });
    }

    return NextResponse.json({
      url: pageUrl,
      faviconIco: { url: faviconIcoUrl, ...faviconIcoInfo },
      linkTags: linkTagsWithStatus,
      manifest,
      issues,
    });
  } catch (e) {
    const msg = (e as Error).message ?? "不明なエラー";
    // Don't leak internal details
    if (msg.includes("ECONNREFUSED") || msg.includes("ENOTFOUND")) {
      return NextResponse.json({ error: "サイトに接続できませんでした。URLを確認してください。" }, { status: 502 });
    }
    if (msg.includes("abort")) {
      return NextResponse.json({ error: "タイムアウトしました（12秒）。サイトの応答が遅い可能性があります。" }, { status: 504 });
    }
    return NextResponse.json({ error: "診断中にエラーが発生しました。" }, { status: 500 });
  }
}
