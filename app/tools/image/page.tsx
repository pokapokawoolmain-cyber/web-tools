import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { TOOLS } from "@/data/tools";
import { CategoryPage } from "../_components/CategoryPage";

const CATEGORY = "画像・PDF";
const SLUG = "image";
const tools = TOOLS.filter((t) => t.category === CATEGORY);

export const metadata: Metadata = generateMeta({
  title: "画像・PDF変換ツール一覧｜HEIC・圧縮・証明写真・PDF結合・分割【無料】",
  description: "HEIC→JPG変換・画像圧縮・動画圧縮・証明写真・PDFの結合・分割・圧縮・回転など、画像とPDFに関するツールが無料で使えます。登録不要・ブラウザ完結。",
  path: `/tools/${SLUG}`,
  keywords: ["HEIC JPG 変換", "画像圧縮 無料", "証明写真 作成 無料", "PDF 結合 無料", "PDF 分割 ブラウザ"],
});

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">主なツールと用途</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { name: "HEIC→JPG変換", use: "iPhoneで撮影したHEICファイルをJPGに変換。Windowsや古い機器で開けない問題を解決。ファイルはサーバーに送信されない。" },
          { name: "画像圧縮", use: "JPG・PNG・WebPを高品質のまま軽量化。SNS投稿やWebサイトの表示速度改善に。最大で元のサイズの数分の一まで圧縮可能。" },
          { name: "動画圧縮", use: "MP4・MOV・AVI動画をブラウザで圧縮。品質と解像度を自由に設定して、SNS投稿やメール添付に適したファイルサイズに。" },
          { name: "証明写真作成", use: "写真をアップロードするだけで、履歴書・マイナンバー・パスポート対応の証明写真を自動作成。L判4枚配置でコンビニ印刷にも対応。" },
          { name: "PDF結合", use: "複数のPDFファイルをドラッグ操作で順番を決めてまとめる。資料の製本・見積書+仕様書のまとめ送付などに。" },
          { name: "PDF圧縮", use: "PDFのファイルサイズを軽量化。メール添付のサイズ制限を超える場合や、クラウドストレージの節約に。" },
        ].map(({ name, use }) => (
          <div key={name} className="rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 p-3.5">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">{name}</p>
            <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">{use}</p>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">全ツールがブラウザ完結の理由</h2>
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>画像やPDFには個人情報や機密情報が含まれることがあります。ToolBoxのツールはすべてブラウザ内でファイルを処理するため、サーバーにアップロードされることはありません。証明写真・履歴書PDF・給与明細などの書類も安心して処理できます。</p>
        <p>インターネット接続が不安定な環境でも、一度ページを読み込んでしまえば処理が完結する設計になっています（キャッシュ動作による）。</p>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">用途別おすすめツール</h2>
      <div className="space-y-2 text-sm">
        {[
          { scene: "iPhoneの写真をWindowsで開きたい", tool: "HEIC→JPG変換" },
          { scene: "メール添付のPDFが容量オーバーになった", tool: "PDF圧縮" },
          { scene: "複数の見積書・仕様書をまとめて送りたい", tool: "PDF結合" },
          { scene: "証明写真をコンビニで印刷したい", tool: "証明写真作成" },
          { scene: "SNSに投稿する画像を軽くしたい", tool: "画像圧縮" },
          { scene: "社内資料のPDFを特定ページだけ抽出したい", tool: "PDF分割" },
        ].map(({ scene, tool }) => (
          <div key={scene} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
            <span className="text-blue-500 mt-0.5">→</span>
            <span><span className="text-slate-800 dark:text-zinc-200">{scene}：</span>{tool}</span>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3">
        {[
          { q: "ファイルがサーバーに送信されないのは本当ですか？", a: "はい。このカテゴリのツールはすべてJavaScript（WebAssembly含む）でブラウザ内の処理を完結しています。ファイルが外部のサーバーに送られることはありません。ネットワーク通信を監視ツールで確認いただくことも可能です。" },
          { q: "PDFのパスワードを解除するツールはありますか？", a: "現在のところ、パスワード付きPDFの解除ツールは提供していません。PDFへのパスワード追加（AES-256暗号化）には「PDFパスワード設定」ツールをご利用ください。" },
          { q: "HEICファイルの変換に対応していないiPhoneがありますか？", a: "iOS 11以降のiPhoneで撮影したHEICファイルに対応しています。ほとんどの現行機種でご利用いただけます。" },
        ].map((faq) => (
          <div key={faq.q} className="rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 p-4">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. {faq.q}</p>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">A. {faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default function Page() {
  return (
    <CategoryPage
      category={CATEGORY}
      slug={SLUG}
      description="HEIC変換・画像圧縮・動画圧縮・リサイズ・証明写真など、画像とPDFの変換ツール。"
      tools={tools}
      seoContent={seoContent}
    />
  );
}
