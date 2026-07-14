"use client";

import { useEffect } from "react";

/**
 * ルート（app/layout.tsx 自体）で発生した例外を捕捉する最終防衛ライン。
 * global-error はレイアウトを置き換えるため、自前で <html>/<body> を持つ必要がある。
 * ChunkLoadError（デプロイ差し替え）の場合は1度だけ自動リロードして復旧する。
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isChunkError =
    error.name === "ChunkLoadError" ||
    /Loading chunk [\d]+ failed|Failed to fetch dynamically imported module|error loading dynamically imported module|importing a module script failed/i.test(
      error.message || ""
    );

  useEffect(() => {
    if (isChunkError) {
      const KEY = "tb-chunk-reloaded";
      if (!sessionStorage.getItem(KEY)) {
        sessionStorage.setItem(KEY, "1");
        window.location.reload();
      }
    } else {
      sessionStorage.removeItem("tb-chunk-reloaded");
    }
  }, [isChunkError]);

  return (
    <html lang="ja">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "24px",
          background: "#09090b",
          color: "#e2e8f0",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', 'Noto Sans JP', sans-serif",
        }}
      >
        {isChunkError ? (
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>
            最新版を読み込んでいます…
          </p>
        ) : (
          <div style={{ maxWidth: "28rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
            <h1
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                margin: "0 0 0.5rem",
              }}
            >
              問題が発生しました
            </h1>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#94a3b8",
                margin: "0 0 1.5rem",
                lineHeight: 1.7,
              }}
            >
              ページの表示中にエラーが発生しました。もう一度お試しいただくか、時間をおいてアクセスしてください。
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => reset()}
                style={{
                  padding: "0.625rem 1.25rem",
                  borderRadius: "0.75rem",
                  border: "none",
                  background: "#7c3aed",
                  color: "#fff",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                再読み込み
              </button>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- global-error はルートを置き換えるため、完全リロードで復帰させる */}
              <a
                href="/"
                style={{
                  padding: "0.625rem 1.25rem",
                  borderRadius: "0.75rem",
                  border: "1px solid #3f3f46",
                  color: "#e2e8f0",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                トップへ戻る
              </a>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
