import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { TOOLS } from "@/data/tools";
import { CategoryPage } from "../_components/CategoryPage";

const CATEGORY = "テキスト・Web";
const SLUG = "text";
const tools = TOOLS.filter((t) => t.category === CATEGORY);

export const metadata: Metadata = generateMeta({
  title: "テキスト・Webの無料ツール｜文字数カウント・QRコード・パスワード生成",
  description: "文字数カウント・Markdownエディタ・パスワード生成・QRコード・Wi-Fi QR・URL短縮など、テキストとWebに関する無料ツール集。",
  path: `/tools/${SLUG}`,
  keywords: ["文字数カウント 無料", "QRコード 作成 無料", "パスワード 生成 ランダム", "Markdown エディタ", "Wi-Fi QR"],
});

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">用途別おすすめツール</h2>
      <div className="space-y-2 text-sm">
        {[
          { scene: "X（Twitter）の投稿前に文字数を確認したい", tool: "文字数カウント" },
          { scene: "GitHubのREADMEやドキュメントを書きたい", tool: "Markdownエディタ" },
          { scene: "新しいサービスのパスワードを安全に作りたい", tool: "パスワード生成" },
          { scene: "チラシやPOPにQRコードを載せたい", tool: "QRコード生成" },
          { scene: "来客用Wi-Fiに簡単に接続させたい", tool: "Wi-Fi QRコード生成" },
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
          { q: "QRコードはどんな情報でも変換できますか？", a: "URLだけでなく、テキスト・メールアドレス・電話番号・Wi-Fi認証情報など様々なデータをQRコード化できます。ただしデータ量が多いと読み取りにくくなるため、URLのような短い情報が最適です。" },
          { q: "Markdownエディタで書いた内容を保存できますか？", a: "ブラウザのlocalStorageに自動保存するため、ページを再読み込みしても内容が残ります。また「ダウンロード」ボタンで.mdファイルとして保存し、GitHubなどに貼り付けることもできます。" },
          { q: "生成したパスワードはどこかに送信されますか？", a: "送信されません。パスワードはブラウザ内でランダム生成されるため、外部サーバーに送られることはありません。" },
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
      description="文字数カウント・Markdownエディタ・パスワード生成・QRコード・Wi-Fi QRなど。"
      tools={tools}
      seoContent={seoContent}
    />
  );
}
