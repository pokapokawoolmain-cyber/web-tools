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
    ];
    return toolIds.map((id) => ({
      source: `/${id}`,
      destination: `/tools/${id}`,
      permanent: true,
    }));
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
