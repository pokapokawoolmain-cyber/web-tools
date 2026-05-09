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
