import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";

export const metadata: Metadata = generateMeta({
  title: "利用規約",
  description: "ToolBoxの利用規約。当サイトのツール・コンテンツのご利用にあたってのルールを説明します。",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          利用規約
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">最終更新日：2026年6月1日</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">1. 適用範囲</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              本利用規約（以下「本規約」）は、ToolBox（以下「当サイト」）が提供するすべてのツール・コンテンツのご利用に適用されます。当サイトをご利用いただくことで、本規約に同意いただいたものとみなします。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">2. サービスの内容</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              当サイトは、計算ツール・画像変換・PDF処理などの無料Webツールおよびブログ記事を提供します。ツールはすべてブラウザ内で動作し、ユーザー登録は不要です。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">3. 免責事項</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              当サイトのツール・計算結果・記事の内容は参考情報の提供を目的としており、正確性・完全性・最新性を保証するものではありません。
            </p>
            <ul className="list-disc list-inside space-y-2 text-[15px] text-slate-600 dark:text-slate-400">
              <li>FIREシミュレーター・NISA計算などの金融ツールは概算であり、投資の助言ではありません</li>
              <li>税金・社会保険料の計算は参考値です。実際の計算は各機関・専門家にご確認ください</li>
              <li>当サイトの利用によって生じた損害について、当サイトは一切の責任を負いません</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">4. 禁止事項</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              以下の行為は禁止します。
            </p>
            <ul className="list-disc list-inside space-y-2 text-[15px] text-slate-600 dark:text-slate-400">
              <li>当サイトのコンテンツの無断転載・複製・販売</li>
              <li>当サイトのサーバーへの過度な負荷をかける行為</li>
              <li>当サイトを通じた違法行為または第三者への迷惑行為</li>
              <li>当サイトのシステムへの不正アクセスや改ざん</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">5. 知的財産権</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              当サイトに掲載されているコンテンツ（テキスト・画像・ソースコードなど）の著作権は当サイトに帰属します。個人的な利用の範囲を超えた複製・転用はご遠慮ください。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">6. サービスの変更・停止</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              当サイトは、事前の通知なくサービスの内容を変更・停止することがあります。これによって生じた損害について当サイトは責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">7. 外部リンク</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              当サイトからリンクされた外部サイトの内容について、当サイトは責任を負いません。外部サイトのご利用は各サイトの規約に従ってください。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">8. 準拠法・管轄</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              本規約は日本法に準拠します。当サイトに関して生じた紛争については、日本の裁判所を専属的合意管轄とします。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">9. 規約の変更</h2>
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              本規約は必要に応じて変更することがあります。変更後の規約はこのページに掲載し、掲載をもって効力が生じるものとします。
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
