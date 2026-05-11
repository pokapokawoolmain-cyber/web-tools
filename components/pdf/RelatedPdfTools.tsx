import Link from "next/link";

type PdfTool = {
  href: string;
  emoji: string;
  title: string;
  description: string;
};

const ALL_PDF_TOOLS: PdfTool[] = [
  { href: "/tools/pdf-merge",         emoji: "📎", title: "PDF結合",       description: "複数PDFを1つにまとめる" },
  { href: "/tools/pdf-split",         emoji: "✂️", title: "PDF分割",       description: "必要なページだけ抽出" },
  { href: "/tools/pdf-compress",      emoji: "🗜️", title: "PDF圧縮",       description: "ファイルサイズを軽量化" },
  { href: "/tools/jpg-to-pdf",        emoji: "🖼️", title: "JPG→PDF変換",  description: "画像をまとめてPDF化" },
  { href: "/tools/pdf-to-jpg",        emoji: "📄", title: "PDF→JPG変換",  description: "PDFページを画像に変換" },
  { href: "/tools/pdf-rotate",        emoji: "🔄", title: "PDF回転",       description: "ページの向きを変更" },
  { href: "/tools/pdf-watermark",     emoji: "🔏", title: "PDF透かし",     description: "社外秘・DRAFTを追加" },
  { href: "/tools/pdf-delete-pages",     emoji: "🗑️", title: "PDFページ削除",   description: "不要なページを削除" },
  { href: "/tools/pdf-reorder",          emoji: "↕️", title: "PDF並び替え",     description: "ページ順を自由に変更" },
  { href: "/tools/pdf-password",         emoji: "🔐", title: "PDFパスワード",   description: "AES-256暗号化で保護" },
  { href: "/tools/pdf-metadata-remover", emoji: "🧹", title: "PDFメタデータ削除", description: "作成者・日付を削除" },
];

type Props = { currentHref: string };

export function RelatedPdfTools({ currentHref }: Props) {
  const related = ALL_PDF_TOOLS.filter((t) => t.href !== currentHref);
  return (
    <div className="mt-12 pt-8 border-t border-slate-100 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[13px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
          関連PDFツール
        </h2>
        <Link href="/pdf-tools" className="text-[12px] text-blue-500 dark:text-blue-400 hover:underline">
          すべて見る →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {related.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all"
          >
            <span className="text-xl">{tool.emoji}</span>
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 text-center leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {tool.title}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 text-center leading-tight hidden sm:block">
              {tool.description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
