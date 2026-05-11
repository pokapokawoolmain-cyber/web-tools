import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ページが見つかりません | ToolBox",
  robots: "noindex",
};

const popularTools = [
  { href: "/tools/fire-simulator", label: "FIREシミュレーター", emoji: "🔥" },
  { href: "/tools/nisa-calculator", label: "新NISA計算", emoji: "📈" },
  { href: "/tools/word-counter", label: "文字数カウント", emoji: "✍️" },
  { href: "/tools/qr-generator", label: "QRコード生成", emoji: "📱" },
  { href: "/tools/pdf-merge", label: "PDF結合", emoji: "📎" },
  { href: "/tools/image-compress", label: "画像圧縮", emoji: "🗜️" },
];

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg w-full">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          ページが見つかりません
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          お探しのページは存在しないか、移動した可能性があります。
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {popularTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 text-[13px] font-medium hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span>{tool.emoji}</span>
              <span>{tool.label}</span>
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[15px] transition-colors"
          >
            トップページへ戻る
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 font-medium text-[15px] hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
          >
            全ツール一覧
          </Link>
        </div>
      </div>
    </div>
  );
}
