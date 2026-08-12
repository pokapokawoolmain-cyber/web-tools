import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { AspectRatio } from "./AspectRatio";

export const metadata: Metadata = generateMeta({
  title: "アスペクト比計算機【無料】16:9・4:3の幅と高さを自動計算｜画像の比率変換・確認",
  description:
    "アスペクト比（16:9・4:3・1:1・21:9など）から幅・高さを自動計算。逆に幅と高さを入力すれば最も簡単な整数比に約分します。動画・SNS・スライド・Web制作のサイズ決めに。FHD/4K/OGPなどの解像度プリセット付き。無料・登録不要・ブラウザ完結。",
  path: "/tools/aspect-ratio",
  keywords: [
    "アスペクト比 変換",
    "アスペクト比 計算",
    "アスペクト比 変更",
    "画像 アスペクト比 変更",
    "16 9 サイズ 計算",
    "比率 計算 幅 高さ",
    "縦横比 計算",
    "解像度 アスペクト比",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "アスペクト比計算機", icon: "📐", desc: "16:9・4:3の幅と高さを自動計算" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "アスペクト比とは何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "アスペクト比は画像や画面の「幅：高さ」の比率です。例えば16:9は幅16に対して高さ9の横長で、YouTubeやテレビの標準です。1:1は正方形、9:16は縦動画に使われます。" },
    },
    {
      "@type": "Question",
      name: "16:9で幅1920pxのときの高さは？",
      acceptedAnswer: { "@type": "Answer", text: "1080pxです。高さ = 幅 × 9 ÷ 16 = 1920 × 9 ÷ 16 = 1080 で計算できます。このツールで比率16:9を選び幅に1920を入れると自動で1080が表示されます。" },
    },
    {
      "@type": "Question",
      name: "幅と高さから比率を求められますか？",
      acceptedAnswer: { "@type": "Answer", text: "はい。「寸法から比率を計算」に幅と高さを入力すると、最大公約数で約分した最も簡単な整数比（例：1920×1080 → 16:9）と小数比を表示します。" },
    },
    {
      "@type": "Question",
      name: "画像そのもののアスペクト比を変えたい（切り抜き・リサイズ）場合は？",
      acceptedAnswer: { "@type": "Answer", text: "このツールは寸法・比率の計算専用です。実際の画像ファイルを指定比率に切り抜き・変換したい場合は、画像リサイズ・アスペクト比変換ツールをご利用ください。中央切り抜きやSNSサイズのプリセットに対応しています。" },
    },
    {
      "@type": "Question",
      name: "縦動画やSNS投稿の推奨サイズは？",
      acceptedAnswer: { "@type": "Answer", text: "縦動画（TikTok・Reels・ストーリー）は9:16で1080×1920px、Instagramの正方形投稿は1:1で1080×1080px、OGP画像は約1.91:1で1200×630pxが目安です。解像度プリセットからワンタップで入力できます。" },
    },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">アスペクト比計算機の使い方</h2>
      <p className="mb-3">
        アスペクト比計算機は、<strong>「比率から寸法を求める」</strong>と<strong>「寸法から比率を求める」</strong>の両方に対応した無料ツールです。
        動画・SNS投稿・プレゼン資料・Webサイトの画像サイズを決めるときに、幅と高さの計算を一瞬で行えます。
      </p>
      <ul className="space-y-1.5">
        <li>・<strong>比率→寸法：</strong>16:9などの比率を選び、幅か高さを入れると、もう一方が自動計算されます。</li>
        <li>・<strong>寸法→比率：</strong>幅と高さを入れると、1920×1080＝16:9のように最も簡単な整数比へ約分します。</li>
        <li>・FHD・HD・4K・OGP・縦動画などの解像度プリセットもワンタップで入力できます。</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">主要アスペクト比の早見表</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">比率</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">代表的な解像度</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">主な用途</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["16:9", "1920×1080 / 1280×720 / 3840×2160", "YouTube・テレビ・ワイド画面・スライド"],
              ["4:3", "1024×768 / 1600×1200", "旧テレビ・古いスライド・資料"],
              ["1:1", "1080×1080", "Instagram正方形投稿・アイコン"],
              ["9:16", "1080×1920", "TikTok・Reels・ストーリー・縦動画"],
              ["3:2", "3000×2000 / L判写真", "一眼レフ・デジカメ写真"],
              ["21:9", "2560×1080 / 3440×1440", "ウルトラワイド・シネマスコープ"],
              ["1.91:1", "1200×630", "OGP・SNSシェア画像"],
            ].map(([ratio, res, use], i) => (
              <tr key={ratio} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-mono font-semibold text-violet-600 dark:text-violet-300">{ratio}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-mono text-[12px]">{res}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">計算の考え方</h2>
      <p>
        アスペクト比が W:H のとき、幅から高さは <strong>高さ = 幅 × H ÷ W</strong>、高さから幅は <strong>幅 = 高さ × W ÷ H</strong> で求められます。
        逆に寸法から比率を出すときは、幅と高さの<strong>最大公約数（GCD）</strong>で両方を割ると、最も簡単な整数比になります（例：1920 と 1080 の最大公約数は 120 なので、16:9）。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・画像そのものを指定比率に切り抜き・変換する <Link href="/tools/image-resize" className="text-violet-600 dark:text-violet-400 hover:underline">画像リサイズ・アスペクト比変換</Link></li>
        <li>・画像を軽くする <Link href="/tools/image-compress" className="text-violet-600 dark:text-violet-400 hover:underline">画像圧縮</Link></li>
        <li>・SNSシェア用の <Link href="/tools/color-codes" className="text-violet-600 dark:text-violet-400 hover:underline">SNSカラーコード一覧</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="アスペクト比計算機"
        description="16:9・4:3などの比率から幅・高さを自動計算。幅と高さから比率も算出。動画・SNS・Web制作のサイズ決めに。解像度プリセット付き・無料・登録不要。"
        icon="📐"
        slug="aspect-ratio"
        seoContent={seoContent}
      >
        <AspectRatio />
      </ToolLayout>
    </>
  );
}
