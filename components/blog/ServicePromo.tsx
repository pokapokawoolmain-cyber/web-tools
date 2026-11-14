// ============================================================
// ブログ記事の自社サービス枠（記事の要所に出す、広告のような案内）
//
// - 記事のカテゴリ・関連ツールから、読者の目的に合うサービスを1つ選ぶ
// - 自社の案内であることを「ToolBoxJPのサービス」と明記する（他社広告と混同させない）
// - 紹介するのは実際にある機能だけ（Mochico は公開LPの featureList と同じ範囲）
// - 押下は ArticleLinkTracker が計測する（data-promo で表示位置を区別）
// ============================================================
import Link from "next/link";
import { ArrowRight, FileStack, Images, Search, Sparkles } from "lucide-react";
import { MascotSvg } from "@/lib/mochico/icon-render";
import { TOOLS } from "@/data/tools";
import type { BlogPost } from "@/data/blog-posts";

export type PromoPlacement = "top" | "bottom";

interface Promo {
  href: string;
  name: string;
  /** 上部の短い案内 */
  short: string;
  /** 下部のカードの説明 */
  lead: string;
  points: string[];
  cta: string;
  icon: "mochico" | "pdf" | "image" | "tool" | "search";
}

const MOCHICO: Promo = {
  href: "/mochico",
  name: "Mochico（モチコ）",
  short: "ライブ・イベントのグッズを、写真つきの一覧で管理",
  lead: "イベントごとにグッズを写真・名前・価格つきで一覧にして、持っているものをタップで記録できる推しグッズ管理アプリです。",
  points: ["ランダムグッズは絵柄ごとに所持数を記録", "予約開始・締切を登録すると残りの日数を表示", "リストはリンクで友達と共有（取得状況は本人だけに表示）"],
  cta: "Mochicoを見てみる（無料）",
  icon: "mochico",
};

const PDF_WS: Promo = {
  href: "/workspace/pdf",
  name: "PDFワークスペース",
  short: "PDFを入れるだけで、まとめる・並べ替え・分割・画像化まで一度に",
  lead: "PDFを入れると、よく使う作業を自動でおすすめ。ページを見ながら並べ替え・回転・削除して、1つのPDFや画像で保存できます。",
  points: ["文字や画像は作り直さないので画質が落ちない", "ファイルは端末の外へ送信しない", "登録不要・無料"],
  cta: "PDFワークスペースを開く",
  icon: "pdf",
};

const IMAGE_WS: Promo = {
  href: "/workspace/image",
  name: "画像ワークスペース",
  short: "画像を入れるだけで、軽くする・サイズをそろえる・変換するを一度に",
  lead: "画像を入れると、仕上げ方を自動でおすすめ。iPhoneのHEIC写真の変換、まとめて軽くする、1つのPDFにまとめるまで一度に終わります。",
  points: ["位置情報などの撮影データは書き出し時に取り除く", "ファイルは端末の外へ送信しない", "登録不要・無料"],
  cta: "画像ワークスペースを開く",
  icon: "image",
};

const FINDER: Promo = {
  href: "/",
  name: "ToolBoxJP",
  short: "PDF・画像・お金・書類の作業を、ブラウザだけで",
  lead: "「何をしたいですか？」に入力するだけで、目的のツールがすぐ見つかります。100種類以上の無料ツールを、登録なしで使えます。",
  points: ["スマホでもパソコンでも使える", "ファイルを扱うツールは端末の中で処理", "登録不要・無料"],
  cta: "ツールを探す",
  icon: "search",
};

const SNS_KIT: Promo = {
  href: "/sns-starter-kit",
  name: "SNS Starter Kit",
  short: "AIと一緒に、自分たちのコミュニティSNSを作る土台",
  lead: "SNSの土台から始めて、AIと一緒に自分のコミュニティへ。AIでWebアプリ開発を試したことがある方向けの買い切りSNSキットです。",
  points: ["買い切りのキット", "AIでの開発を前提にした作り", "販売ページで内容と価格を確認できる"],
  cta: "SNS Starter Kit を見る",
  icon: "tool",
};

const MOCHICO_CATEGORIES = ["推し活ガイド", "推し活・グッズ管理"];
const PDF_CATEGORIES = ["PDF活用"];
const IMAGE_CATEGORIES = ["画像・写真", "画像変換", "証明写真"];

function toolPromo(href: string): Promo | null {
  const tool = TOOLS.find((t) => t.href === href);
  if (!tool) return null;
  return {
    href: tool.href,
    name: tool.title,
    short: tool.description,
    lead: tool.description,
    points: ["登録不要・無料", "スマホでもパソコンでも使える"],
    cta: `${tool.title}を使う`,
    icon: "tool",
  };
}

/** 記事に合うサービスを選ぶ（カテゴリ優先、なければ関連ツール、なければツール検索） */
export function pickPromo(post: BlogPost): Promo {
  if (MOCHICO_CATEGORIES.includes(post.category)) return MOCHICO;
  if (post.category === "コミュニティSNSづくり") return SNS_KIT;
  if (PDF_CATEGORIES.includes(post.category)) return PDF_WS;
  if (IMAGE_CATEGORIES.includes(post.category)) return IMAGE_WS;
  const related = post.relatedToolHref ?? (post.relatedToolId ? `/tools/${post.relatedToolId}` : undefined);
  return (related && toolPromo(related)) || FINDER;
}

function PromoIcon({ icon, size }: { icon: Promo["icon"]; size: number }) {
  if (icon === "mochico") return <MascotSvg size={size} />;
  const cls = size > 30 ? "w-6 h-6" : "w-4 h-4";
  if (icon === "pdf") return <FileStack className={cls} aria-hidden />;
  if (icon === "image") return <Images className={cls} aria-hidden />;
  if (icon === "search") return <Search className={cls} aria-hidden />;
  return <Sparkles className={cls} aria-hidden />;
}

/** 記事の冒頭に出す1行の案内 */
export function ServicePromoTop({ post }: { post: BlogPost }) {
  const p = pickPromo(post);
  return (
    <aside data-promo="top" aria-label="ToolBoxJPのサービスの案内" className="not-prose my-5">
      <Link
        href={p.href}
        // 記事本文のリンクの下線スタイルを打ち消す（推し活ガイドなどの本文CSSが a に下線を付けるため）
        style={{ textDecoration: "none" }}
        className="flex items-center gap-3 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 px-4 py-3 min-h-[52px] text-slate-800 dark:text-zinc-100 hover:border-blue-400 transition-colors"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400">
          <PromoIcon icon={p.icon} size={26} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-semibold text-blue-700 dark:text-blue-300">ToolBoxJPのサービス</span>
          <span className="block text-[14px] font-semibold leading-snug">
            {p.name}：{p.short}
          </span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-blue-600" aria-hidden />
      </Link>
    </aside>
  );
}

/** 記事の終わりに出すカード */
export function ServicePromoBottom({ post }: { post: BlogPost }) {
  const p = pickPromo(post);
  return (
    <aside data-promo="bottom" aria-label="ToolBoxJPのサービスの紹介" className="not-prose my-10 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-sm text-slate-800 dark:text-zinc-100">
      <p className="text-[11px] font-semibold text-blue-700 dark:text-blue-300">ToolBoxJPのサービス</p>
      <div className="mt-2 flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
          <PromoIcon icon={p.icon} size={40} />
        </span>
        <div className="min-w-0">
          <p className="text-[18px] font-bold leading-snug">{p.name}</p>
          <p className="mt-1 text-[14px] leading-relaxed text-slate-600 dark:text-zinc-400">{p.lead}</p>
        </div>
      </div>
      <ul className="mt-4 grid gap-1.5 text-[13px] text-slate-700 dark:text-zinc-300">
        {p.points.map((pt) => (
          <li key={pt} className="flex gap-2">
            <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
            {pt}
          </li>
        ))}
      </ul>
      <Link
        href={p.href}
        // 記事本文のリンクの下線スタイルを打ち消す（推し活ガイドなどの本文CSSが a に下線を付けるため）
        style={{ textDecoration: "none" }}
        className="mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-[15px] font-semibold text-white hover:bg-blue-700"
      >
        {p.cta}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </aside>
  );
}
