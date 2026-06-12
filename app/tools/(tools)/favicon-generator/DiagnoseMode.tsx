"use client";
import { useState } from "react";

interface FaviconInfo {
  url: string;
  status: number;
  contentType?: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
}

interface LinkTag {
  rel: string;
  href: string;
  sizes?: string;
  type?: string;
  status?: number;
  contentType?: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
}

interface ManifestIcon {
  src: string;
  sizes?: string;
  purpose?: string;
  status?: number;
}

interface DiagIssue {
  severity: "error" | "warn" | "info";
  title: string;
  detail: string;
}

interface DiagResult {
  url: string;
  faviconIco?: FaviconInfo;
  linkTags: LinkTag[];
  manifest?: {
    url: string;
    valid: boolean;
    themeColor?: string;
    icons: ManifestIcon[];
  };
  issues: DiagIssue[];
  error?: string;
}

export function DiagnoseMode() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const diagnose = async () => {
    const inputUrl = url.trim();
    if (!inputUrl) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const params = new URLSearchParams({ url: inputUrl });
      const res = await fetch(`/api/favicon-probe?${params}`);
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || `HTTP ${res.status}`);
      }
      const data: DiagResult = await res.json();
      setResult(data);
    } catch (e) {
      setError((e as Error).message || "診断中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const severityStyle = (s: "error" | "warn" | "info") =>
    s === "error"
      ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
      : s === "warn"
      ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300"
      : "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300";

  const severityIcon = (s: "error" | "warn" | "info") =>
    s === "error" ? "❌" : s === "warn" ? "⚠️" : "ℹ️";

  const httpBadge = (status?: number) => {
    if (!status) return null;
    const ok = status >= 200 && status < 300;
    return (
      <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${ok ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* URL Input */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">公開済みサイトのファビコン診断</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">
            URLを入力すると、現在のファビコン設定・マニフェスト・HTMLタグを調査します。
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && diagnose()}
            placeholder="https://example.com"
            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
          />
          <button
            onClick={diagnose}
            disabled={loading || !url.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                診断中
              </>
            ) : "診断"}
          </button>
        </div>

        <p className="text-xs text-slate-400 dark:text-zinc-500">
          ※ サーバー側でURLにアクセスして情報を取得します。内部ネットワークのURLはアクセスできません。
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-700 dark:text-red-300">
          <p className="font-medium">診断エラー</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {/* Issues summary */}
          {result.issues.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-2">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                診断結果 — {result.issues.filter(i => i.severity === "error").length > 0 ? "❌ 問題あり" : result.issues.filter(i => i.severity === "warn").length > 0 ? "⚠️ 改善推奨" : "✅ 良好"}
              </h3>
              <div className="space-y-2">
                {result.issues.map((issue, i) => (
                  <div key={i} className={`rounded-lg p-3 text-xs border ${severityStyle(issue.severity)}`}>
                    <span className="mr-1">{severityIcon(issue.severity)}</span>
                    <span className="font-medium">{issue.title}</span>
                    <p className="mt-1 opacity-80">{issue.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* favicon.ico */}
          {result.faviconIco && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
              <h3 className="text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-3">favicon.ico</h3>
              <div className="flex items-start gap-3">
                {result.faviconIco.status >= 200 && result.faviconIco.status < 300 && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={result.faviconIco.url} alt="favicon" className="w-10 h-10 rounded border border-slate-200 dark:border-zinc-700" />
                )}
                <div className="space-y-1 text-xs text-slate-600 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 truncate max-w-48">{result.faviconIco.url}</span>
                    {httpBadge(result.faviconIco.status)}
                  </div>
                  {result.faviconIco.contentType && <p>Type: {result.faviconIco.contentType}</p>}
                  {result.faviconIco.sizeBytes && <p>Size: {(result.faviconIco.sizeBytes / 1024).toFixed(1)}KB</p>}
                  {result.faviconIco.width && <p>Image: {result.faviconIco.width}×{result.faviconIco.height}px</p>}
                </div>
              </div>
            </div>
          )}

          {/* Link tags */}
          {result.linkTags.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
              <h3 className="text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-3">HTMLリンクタグ（{result.linkTags.length}件）</h3>
              <div className="space-y-2">
                {result.linkTags.map((tag, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800 pb-2 last:border-0">
                    <span className={`font-medium mt-0.5 ${tag.status && tag.status >= 200 && tag.status < 300 ? "text-emerald-600" : tag.status ? "text-red-600" : "text-slate-400"}`}>
                      {tag.status ? (tag.status >= 200 && tag.status < 300 ? "✅" : "❌") : "—"}
                    </span>
                    <div>
                      <p><span className="text-blue-600 dark:text-blue-400">rel=&quot;{tag.rel}&quot;</span>{tag.sizes ? ` sizes="${tag.sizes}"` : ""}{tag.type ? ` type="${tag.type}"` : ""}</p>
                      <p className="font-mono text-slate-400 truncate max-w-64">{tag.href}</p>
                      {tag.width && <p className="text-slate-400">{tag.width}×{tag.height}px · {tag.contentType}</p>}
                    </div>
                    {httpBadge(tag.status)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manifest */}
          {result.manifest && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
              <h3 className="text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-3">
                Web App Manifest {result.manifest.valid ? "✅" : "❌"}
              </h3>
              <div className="text-xs text-slate-600 dark:text-zinc-400 space-y-1">
                <p className="font-mono text-slate-400 truncate">{result.manifest.url}</p>
                {result.manifest.themeColor && <p>theme_color: <span className="font-mono">{result.manifest.themeColor}</span></p>}
                {result.manifest.icons.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium text-slate-500 mb-1">アイコン ({result.manifest.icons.length}件)</p>
                    {result.manifest.icons.map((icon, i) => (
                      <div key={i} className="flex items-center gap-2 py-0.5">
                        <span>{icon.status && icon.status >= 200 && icon.status < 300 ? "✅" : icon.status ? "❌" : "—"}</span>
                        <span>{icon.sizes}</span>
                        {icon.purpose && <span className="bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-slate-500">{icon.purpose}</span>}
                        {httpBadge(icon.status)}
                      </div>
                    ))}
                    {!result.manifest.icons.some(i => i.purpose?.includes("maskable")) && (
                      <p className="text-amber-600 dark:text-amber-400 mt-1">⚠️ maskable アイコンが見つかりません</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
