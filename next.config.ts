import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 画像最適化の許可ドメイン
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  // 圧縮有効化（Core Web Vitals改善）
  compress: true,
  // 本番ビルドでは console.log / info / debug を削除する。
  // console.error / warn は残す（予約保存・Product #01 などのAPI障害をサーバーログで調査できるように）。
  // ※ログには HTTP ステータス・エラー種別・リクエストIDだけを出し、入力値・PII・秘密情報は出さないこと。
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  // 旧URLから新URLへの301リダイレクト
  async redirects() {
    const toolIds = [
      "fire-simulator", "nisa-calculator", "mortgage-calculator", "net-income",
      "furusato-simulator", "mercari-profit", "gas-calculator",
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
    // 旧カテゴリ一覧（/tools/〇〇・/pdf-tools）を現行のカテゴリページへ統合（2026-10 インデックス整理）
    const hubRedirects = [
      ["/furusato", "/tools/furusato-simulator"],
      ["/tools/furusato", "/tools/furusato-simulator"],
      ["/tools/calculator", "/calc"],
      ["/tools/finance", "/money"],
      ["/tools/image", "/image"],
      ["/tools/lifestyle", "/life"],
      ["/tools/text", "/dev"],
      ["/tools/student", "/calc"],
      ["/tools/work", "/business"],
      ["/tools/restaurant", "/industry/restaurant"],
      ["/pdf-tools", "/pdf"],
      // 年収別の手取り記事・早見表は /salary、ふるさと納税の記事はシミュレーターに統合
      ["/blog/takehome-300", "/salary#nenshu-300"],
      ["/blog/takehome-400", "/salary#nenshu-400"],
      ["/blog/takehome-500", "/salary#nenshu-500"],
      ["/blog/takehome-600", "/salary#nenshu-600"],
      ["/blog/takehome-700", "/salary#nenshu-700"],
      ["/blog/takehome-800", "/salary#nenshu-800"],
      ["/blog/takehome-900", "/salary#nenshu-900"],
      ["/blog/takehome-1000", "/salary#nenshu-1000"],
      ["/blog/takehome-2026", "/salary"],
      ["/blog/salary-takehome-table", "/salary"],
      ["/blog/furusato-nozei-guide", "/tools/furusato-simulator"],
      ["/blog/furusato-nozei-howto", "/tools/furusato-simulator"],
      ["/blog/furusato-limit-by-income", "/tools/furusato-simulator"],
    ].map(([source, destination]) => ({ source, destination, permanent: true }));
    // non-www → www への正規化（AdSense登録URLとの一致 / canonical統一）
    const wwwRedirects = [
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: "toolboxjp.com" }],
        destination: "https://www.toolboxjp.com/:path*",
        permanent: true,
      },
    ];
    return [...wwwRedirects, ...toolRedirects, ...blogRedirects, ...hubRedirects];
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
