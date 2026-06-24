import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 画像最適化の許可ドメイン
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  // 圧縮有効化（Core Web Vitals改善）
  compress: true,
  // 本番ビルドでconsole.logを削除
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // 旧URLから新URLへの301リダイレクト
  async redirects() {
    const toolIds = [
      "fire-simulator", "nisa-calculator", "mortgage-calculator", "net-income",
      "furusato-simulator", "furusato", "mercari-profit", "gas-calculator",
      "shift-salary", "point-simulator", "heic-to-jpg", "image-compress",
      "video-compress", "image-resize", "id-photo", "side-job-profit",
      "youtube-tools", "sns-links", "word-counter", "markdown-editor",
      "password-generator", "qr-generator", "wifi-qr", "gpa",
      "resume-builder", "short-link",
      "pdf-merge", "pdf-split", "pdf-compress", "jpg-to-pdf", "pdf-to-jpg",
      "pdf-rotate", "pdf-watermark", "pdf-delete-pages", "pdf-reorder",
      "pdf-password", "pdf-metadata-remover",
    ];
    const toolRedirects = toolIds.map((id) => ({
      source: `/${id}`,
      destination: `/tools/${id}`,
      permanent: true,
    }));
    // 重複記事の統合（カニバリゼーション解消）
    // 旧「コンビニで証明写真」記事を、Googleが上位表示している統合版へ301
    const blogRedirects = [
      {
        source: "/blog/id-photo-convenience",
        destination: "/blog/id-photo-convenience-store",
        permanent: true,
      },
    ];
    // non-www → www への正規化（AdSense登録URLとの一致 / canonical統一）
    const wwwRedirects = [
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: "toolboxjp.com" }],
        destination: "https://www.toolboxjp.com/:path*",
        permanent: true,
      },
    ];
    return [...wwwRedirects, ...toolRedirects, ...blogRedirects];
  },

  // ヘッダー設定（SEO・セキュリティ）
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
