import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("takehome-1000")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["年収1000万 手取り", "年収1000万 月収", "年収1000万 税金", "1000万 手取り 独身", "年収1000万 節税"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        年収1000万円の手取りは<strong>約722万円（月60.2万円）</strong>が目安です。控除278万円の内訳と、1000万円プレーヤーが実践すべき節税戦略を具体的に解説します。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">自分の正確な手取りを計算する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">年収・家族構成・ボーナス割合を入力して正確な手取り額を計算できます。</p>
        <Link href="/tools/net-income" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          手取り計算ツールを使う（無料）→
        </Link>
      </div>

      <h2>年収1000万円の手取り早見表</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {[
              ["額面年収", "1,000万円"],
              ["手取り年収（概算）", "約722万円"],
              ["月額手取り（概算）", "約60.2万円"],
              ["控除合計", "約278万円"],
              ["手取り率", "約72.2%"],
            ].map(([label, value], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-3 font-medium text-slate-700 dark:text-zinc-300 w-1/2">{label}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-3 text-blue-600 dark:text-blue-400 font-medium">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※独身・会社員・東京都在住・ボーナス2ヶ月分想定の概算値です。加入する健康保険組合・家族構成により異なります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>控除の内訳（年収1000万円・独身の場合）</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">控除の種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年間額（概算）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月額換算</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["健康保険料（本人負担分）", "約47万円", "約3.9万円"],
              ["厚生年金保険料", "約65万円", "約5.4万円"],
              ["雇用保険料", "約6万円", "約0.5万円"],
              ["社会保険料 合計", "約118万円", "約9.8万円"],
              ["所得税", "約103万円", "約8.6万円"],
              ["住民税", "約57万円", "約4.8万円"],
              ["控除 合計", "約278万円", "約23.2万円"],
            ].map(([type, annual, monthly], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className={`border border-slate-200 dark:border-zinc-700 px-4 py-2 ${type.includes("合計") ? "font-medium" : ""}`}>{type}</td>
                <td className={`border border-slate-200 dark:border-zinc-700 px-4 py-2 ${type.includes("合計") ? "font-medium text-rose-600 dark:text-rose-400" : ""}`}>{annual}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500 dark:text-zinc-500">{monthly}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        年収1000万円では<strong>所得税が103万円</strong>に達します。月収ベースで見ると毎月8.6万円が所得税として天引きされる計算です。収入が増えるほど節税効果が高まるため、対策は早いほど有効です。
      </p>

      <div className="my-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-[13px] text-amber-800 dark:text-amber-300">
        <strong className="block mb-1">⚠️ 年収1000万円のワナ：手取りが思ったより少ない理由</strong>
        <p>額面1000万円に対して手取りは約722万円。「1000万円もらえる」と思っていたのに「手元に来るのは720万円ちょっと」という現実があります。特に所得税103万円は年収800万時の65万から38万円も跳ね上がります。</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>家族構成による手取りの変化</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">家族構成</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手取り年収（概算）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">独身との差</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["独身", "約722万円", "基準"],
              ["配偶者あり（専業主婦/夫）", "約739万円", "+約17万円"],
              ["配偶者あり＋子1人（16歳未満）", "約739万円", "+約17万円"],
              ["配偶者あり＋子1人（16〜18歳）", "約752万円", "+約30万円"],
              ["配偶者あり＋子2人（扶養）", "約764万円", "+約42万円"],
            ].map(([family, takehome, diff], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{family}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-blue-600 dark:text-blue-400">{takehome}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-green-600 dark:text-green-400">{diff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収500万〜1000万円の手取り比較</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">額面年収</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手取り年収</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月手取り</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手取り率</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["500万円", "約393万円", "約32.8万円", "約78.6%"],
              ["600万円", "約462万円", "約38.5万円", "約77%"],
              ["700万円", "約528万円", "約44万円", "約75.4%"],
              ["800万円", "約589万円", "約49.1万円", "約73.6%"],
              ["900万円", "約653万円", "約54.4万円", "約72.6%"],
              ["1000万円", "約722万円", "約60.2万円", "約72.2%", true],
            ].map(([income, takehome, monthly, rate, isCurrent], i) => (
              <tr key={i} className={isCurrent ? "bg-blue-50 dark:bg-blue-950/30" : i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className={`border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium ${isCurrent ? "text-blue-700 dark:text-blue-300" : ""}`}>{income}{isCurrent ? " ◀ この記事" : ""}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{takehome}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{monthly}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収1000万円でやるべき節税対策TOP5</h2>

      <div className="space-y-4 my-6">
        {[
          { rank: "1", title: "iDeCo（月2.3万円・年27.6万円）", desc: "所得税率20%・住民税10%の合計30%が節税できます。年間の節税額は約8.3万円。60歳まで引き出せない制約はありますが、確実に節税できる最強手段。" },
          { rank: "2", title: "ふるさと納税（上限約21〜22万円）", desc: "自己負担2,000円で21〜22万円分の寄付が実質無料になります。返礼品（食品・日用品）を受け取ることで生活費節約効果も。" },
          { rank: "3", title: "生命保険料控除の最大化（年12万円まで）", desc: "生命・医療・個人年金の3区分で各4万円、合計12万円まで控除。節税額は約3.6万円。まだ活用していない方は見直しを。" },
          { rank: "4", title: "住宅ローン控除（持ち家の場合）", desc: "新築・中古の住宅購入者は最大13年間、年最大35万円の所得税控除（住宅ローン残高の0.7%）が受けられます。" },
          { rank: "5", title: "医療費控除（年10万円超の医療費）", desc: "年間医療費が10万円を超えた場合、超過分を確定申告で控除できます。家族全員分を合算して申告可能。" },
        ].map(({ rank, title, desc }) => (
          <div key={rank} className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">{rank}</span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-zinc-100 mb-1">{title}</p>
              <p className="text-[14px] text-slate-600 dark:text-zinc-400">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="my-5 p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40 text-[13px] text-green-800 dark:text-green-300">
        <strong className="block mb-1">💰 節税合計シミュレーション（年収1000万・独身・iDeCoなし→ありの差）</strong>
        <ul className="space-y-1 mt-2">
          <li>iDeCo：年約8.3万円節税</li>
          <li>ふるさと納税上限22万円活用：返礼品22万円分（自己負担2千円）</li>
          <li>生命保険料控除：年約3.6万円節税</li>
          <li className="font-semibold border-t border-green-300 dark:border-green-700 pt-1 mt-1">合計：現金節税11.9万円＋返礼品22万円分</li>
        </ul>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/takehome-900">年収900万円の手取りは月54.4万円</Link></li>
        <li><Link href="/blog/salary-takehome-table">手取り早見表2026年版（年収300〜1000万円一覧）</Link></li>
        <li><Link href="/blog/furusato-limit-by-income">年収別ふるさと納税の上限額早見表</Link></li>
        <li><Link href="/blog/nencho-guide">年末調整の書き方2026年完全ガイド</Link></li>
        <li><Link href="/blog/shakai-hoken-guide">社会保険料の計算方法【年収別早見表・2026年版】</Link></li>
      </ul>

    </BlogLayout>
  );
}
