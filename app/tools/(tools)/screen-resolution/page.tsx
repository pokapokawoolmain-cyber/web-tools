import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { ScreenResolution } from "./ScreenResolution";

export const metadata: Metadata = generateMeta({
  title: "画面解像度チェッカー【無料】今の解像度・ウィンドウサイズをすぐ確認",
  description:
    "今お使いのモニターやスマホの画面解像度・物理解像度・ブラウザ表示領域・ピクセル比（DPR）・アスペクト比・色深度をブラウザで自動表示。ウィンドウサイズはリアルタイム更新。レスポンシブ確認や環境報告に。無料・登録不要。",
  path: "/tools/screen-resolution",
  keywords: [
    "画面解像度 確認",
    "モニターサイズ 確認",
    "解像度 調べる",
    "ウィンドウサイズ 確認",
    "screen resolution 確認",
    "ビューポート サイズ 確認",
    "画面サイズ 確認 ブラウザ",
    "dpr 確認",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "画面解像度チェッカー", icon: "🖥️", desc: "今の解像度・ウィンドウサイズをすぐ確認" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "画面解像度と物理解像度の違いは何ですか？", acceptedAnswer: { "@type": "Answer", text: "画面解像度（論理）はCSSピクセル単位で、OSの表示設定に相当します。物理解像度は論理解像度にピクセル比（DPR）を掛けた、実際のドット数の目安です。Retinaなど高精細ディスプレイではDPRが2や3になり、物理解像度が論理解像度より大きくなります。" } },
    { "@type": "Question", name: "ブラウザ表示領域とは何ですか？", acceptedAnswer: { "@type": "Answer", text: "今開いているブラウザウィンドウの内側の幅と高さ（ビューポート）です。Webサイトのレスポンシブ表示はこの値をもとに切り替わるため、ウィンドウを縮めて表示崩れを確認するときの基準になります。本ツールではリアルタイムに更新されます。" } },
    { "@type": "Question", name: "表示される値は正確ですか？", acceptedAnswer: { "@type": "Answer", text: "ブラウザが取得できる値をそのまま表示しています。物理解像度は論理解像度×ピクセル比からの推定のため、実際のパネル解像度と異なる場合があります。" } },
    { "@type": "Question", name: "スマホの解像度も確認できますか？", acceptedAnswer: { "@type": "Answer", text: "はい。iPhone・Androidのブラウザでも、画面解像度やピクセル比、表示領域を確認できます。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">画面解像度チェッカーでわかること</h2>
      <p>
        ページを開くだけで、今の画面とウィンドウの情報が自動で表示されます。モニターの解像度がわからないとき、
        Webサイトのレスポンシブ表示を確認したいとき、サポートに環境を伝えたいときなどにすぐ使えます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">表示される項目</h2>
      <ul className="space-y-1.5">
        <li>・<strong>画面解像度（論理）：</strong>OSの表示設定に相当するCSSピクセルの解像度</li>
        <li>・<strong>物理解像度（推定）：</strong>論理解像度 × ピクセル比。実際のドット数の目安</li>
        <li>・<strong>ブラウザ表示領域：</strong>ウィンドウ内寸（ビューポート）。レスポンシブの基準値</li>
        <li>・<strong>ピクセル比（DPR）：</strong>高精細ディスプレイで2・3になる拡大率</li>
        <li>・<strong>アスペクト比・画面の向き・色深度</strong></li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある用途</h2>
      <ul className="space-y-1.5">
        <li>・「あなたのモニターの解像度は？」と聞かれたときにすぐ答える</li>
        <li>・Web制作でブレークポイント（表示切替の幅）を確認する</li>
        <li>・壁紙やスクリーンショットに合うサイズを調べる</li>
        <li>・不具合報告時に、正確な画面環境を伝える</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・画面の画素不良を確認する <Link href="/tools/dead-pixel-test" className="text-violet-600 dark:text-violet-400 hover:underline">ドット抜けチェッカー</Link></li>
        <li>・モニターのリフレッシュレートを測る <Link href="/tools/refresh-rate" className="text-violet-600 dark:text-violet-400 hover:underline">リフレッシュレート測定</Link></li>
        <li>・画像の比率から寸法を計算する <Link href="/tools/aspect-ratio" className="text-violet-600 dark:text-violet-400 hover:underline">アスペクト比計算機</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="画面解像度チェッカー"
        description="今お使いの画面解像度・物理解像度・表示領域・ピクセル比・アスペクト比を自動表示。ウィンドウサイズはリアルタイム更新。"
        icon="🖥️"
        slug="screen-resolution"
        seoContent={seoContent}
      >
        <ScreenResolution />
      </ToolLayout>
    </>
  );
}
