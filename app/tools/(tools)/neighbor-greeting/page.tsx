import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { NeighborGreeting } from "./NeighborGreeting";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "工事近隣挨拶文メーカー｜建設・リフォーム向け状況別テンプレート【無料】",
  description: "工事の種類・期間・会社名を入力して近隣への挨拶文を自動生成。新築・リフォーム・外壁塗装・解体工事など状況別に対応。騒音・重機・駐車などの注意事項も自動挿入。コピー・印刷対応。",
  path: "/tools/neighbor-greeting",
  keywords: ["工事 近隣 挨拶文", "工事 挨拶状 テンプレート", "近隣 挨拶 工事 無料", "リフォーム 近隣 挨拶", "建設工事 挨拶文 作成", "工事挨拶状 作成"],
});

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">工事近隣挨拶文メーカーの使い方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        工事の種類・住所・期間・作業時間・施工会社情報を入力するだけで、プロらしい近隣挨拶文が自動生成されます。騒音レベル・重機使用・車両駐車などのチェック項目に応じて、適切な説明文が自動挿入されます。生成された文章はコピーまたは印刷して使用できます。
      </p>
      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900/50">
        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">推奨する挨拶のタイミング</p>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>・工事開始の3〜7日前（遅くとも前日まで）</li>
          <li>・対象範囲：工事現場から半径50m〜100m（通常10〜20軒）</li>
          <li>・挨拶品：500〜1,000円程度の粗品（タオル・洗剤など）を持参すると丁寧</li>
        </ul>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">工事種別ごとのポイント</h2>
      <div className="space-y-3 text-sm">
        {[
          { type: "解体工事", note: "騒音・振動・粉塵が最も大きい工種です。近隣の窓・車への粉塵付着について事前に説明し、防塵シートの設置状況も伝えると安心感が高まります。" },
          { type: "新築工事", note: "基礎工事・鉄骨建方で大きな騒音が発生します。クレーン車の使用日は特に丁寧に案内を。工期が長い場合は中間でも挨拶を検討してください。" },
          { type: "外壁塗装工事", note: "足場の組立・解体時の騒音と、塗料の臭気・飛散への配慮を明記してください。洗濯物への塗料飛散は特にクレームになりやすいです。" },
          { type: "リフォーム工事", note: "工事内容によって騒音レベルが大きく変わります。内装のみであれば低め、スケルトンリフォームでは高めに設定してください。" },
        ].map(({ type, note }) => (
          <div key={type} className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">【{type}】</p>
            <p className="text-slate-500 dark:text-zinc-400">{note}</p>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3 text-sm">
        {[
          { q: "近隣挨拶は法律で義務付けられていますか？", a: "法的な義務ではありませんが、建設業界の慣習として広く行われています。近隣トラブルを未然に防ぐためにも強く推奨されます。特に解体・新築・外壁塗装工事では必須と考えてください。" },
          { q: "留守の場合はどうすればいい？", a: "ポストに挨拶状（文書）と名刺・粗品を置いていく方法が一般的です。訪問した旨のメモも添えると丁寧です。" },
          { q: "マンションの工事の場合は？", a: "管理組合・管理会社への事前届出が必要な場合が多いです。各戸への配布は管理会社経由で行うケースもあります。" },
          { q: "生成した文章をそのまま使えますか？", a: "そのまま使えるよう設計しています。ただし、実際の工事内容・状況に合わせて適宜修正してください。「追加で伝えたいこと」欄で個別事情を追記することをお勧めします。" },
        ].map(({ q, a }) => (
          <div key={q} className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">Q. {q}</p>
            <p className="text-slate-500 dark:text-zinc-400">A. {a}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default function Page() {
  return (
    <ToolLayout
      title="工事近隣挨拶文メーカー"
      description="工事の種類・期間・会社情報を入力して近隣挨拶文を自動生成。状況別の注意事項も自動挿入。コピー・印刷対応。"
      icon="📝"
      slug="neighbor-greeting"
      seoContent={seoContent}
    >
      <NeighborGreeting />
    </ToolLayout>
  );
}
