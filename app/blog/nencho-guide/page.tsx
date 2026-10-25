import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("nencho-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["年末調整 書き方 2026 わかりやすく", "扶養控除申告書 書き方 記入例", "基礎控除申告書 書き方 独身", "年末調整 生命保険 記入方法", "年末調整 いつ 提出 期限"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        毎年10〜12月に会社から配られる年末調整の書類。「何を書けばいい？」「変更がなければ昨年と同じ？」——全3種類の書類の書き方を記入例付きで解説します。
      </p>

      <div className="my-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[14px] text-amber-900 dark:text-amber-200">
        <strong className="block mb-2">2026年（令和8年分）の年末調整で変わること</strong>
        <ul className="space-y-1.5">
          <li>・<strong>基礎控除</strong>：合計所得489万円以下は104万円、489万〜655万円は67万円、655万〜2,350万円は62万円に引き上げ（2025年分は最大95万円）</li>
          <li>・<strong>給与所得控除の最低保障額</strong>：65万円から74万円に引き上げ。所得税がかかり始める年収は178万円に</li>
          <li>・<strong>配偶者・扶養親族の所得要件</strong>：合計所得58万円以下から62万円以下に（給与収入のみなら136万円以下）</li>
          <li>・<strong>生命保険料控除</strong>：23歳未満の扶養親族がいる場合、一般生命保険料控除（新契約）の上限が4万円から6万円に</li>
        </ul>
        <p className="mt-2 text-[13px]">改正は2026年12月1日施行のため、毎月の源泉徴収ではなく年末調整でまとめて精算されます。（出典：国税庁タックスアンサー No.1199・1410・1191・1180・1140）</p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">手取り額・還付金を正確に把握する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">年収・扶養・保険料を入力して年間の手取り額をシミュレーションできます。</p>
        <Link href="/tools/net-income" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          手取り計算ツールを使う（無料）→
        </Link>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年末調整とは？3分でわかる仕組み</h2>

      <p>
        会社員は毎月の給与から所得税が「概算」で天引きされています。年末調整はこの概算と「実際に納めるべき税額」の差を精算する手続きです。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">項目</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">内容</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["対象者", "給与所得者（会社員・アルバイト）"],
              ["実施時期", "毎年10〜12月（書類提出）・12月給与で精算"],
              ["書類提出先", "勤務先の給与担当・総務部"],
              ["還付 or 追加徴収", "払いすぎ → 12月または1月の給与で還付。不足 → 追加徴収"],
              ["確定申告との違い", "会社が代行してくれる。副業・医療費控除は確定申告が別途必要"],
            ].map(([item, content], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium w-2/5">{item}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>提出が必要な書類一覧（2026年版）</h2>

      <div className="space-y-4 my-6">
        {[
          {
            num: "①",
            title: "給与所得者の扶養控除等申告書",
            required: "全員必須",
            color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
            desc: "配偶者・子・親などの扶養状況を申告する書類。変更がなくても毎年提出が必要です。",
          },
          {
            num: "②",
            title: "給与所得者の基礎控除申告書 兼 配偶者控除等申告書",
            required: "全員提出推奨",
            color: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
            desc: "基礎控除（2026年分は最大104万円）と配偶者控除（最大38万円）を申請する書類。独身でも基礎控除欄の記入が必要です。",
          },
          {
            num: "③",
            title: "給与所得者の保険料控除申告書",
            required: "生命保険・個人年金加入者",
            color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
            desc: "生命保険料・医療保険料・個人年金保険料・地震保険料などの控除を申請。証明書の添付が必要です。",
          },
        ].map(({ num, title, required, color, desc }) => (
          <div key={num} className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-700 p-4">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-[13px] text-slate-600 dark:text-zinc-300">{num}</span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="font-semibold text-slate-800 dark:text-zinc-100 text-[14px]">{title}</p>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${color}`}>{required}</span>
                </div>
                <p className="text-[13px] text-slate-600 dark:text-zinc-400">{desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>①扶養控除等申告書の書き方</h2>

      <h3>独身（扶養なし）の場合</h3>
      <p>
        自分の氏名・住所・マイナンバー（個人番号）・世帯主氏名・続柄を記入します。扶養親族がいない場合は「A欄〜D欄」は空白のままで問題ありません。
      </p>

      <h3>配偶者がいる場合</h3>
      <p>
        配偶者の給与収入が<strong>136万円以下</strong>（2026年分。合計所得62万円以下）の場合は配偶者控除の対象です。氏名・マイナンバー・生年月日・年間収入見積額を記入します。
      </p>

      <h3>子どもがいる場合</h3>
      <p>
        16歳以上の子は扶養控除（38万円〜63万円）の対象です（子の合計所得62万円以下・給与収入のみなら136万円以下）。16歳未満の子は「住民税に関する事項」欄に記入します（所得税の控除対象外）。19〜22歳の子の所得がこの上限を超えても、合計所得123万円以下なら特定親族特別控除を受けられる場合があります。
      </p>

      <div className="my-5 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-[13px] text-slate-600 dark:text-zinc-400">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">💡 扶養控除の金額まとめ</strong>
        <ul className="space-y-1 mt-2">
          <li>・一般の扶養親族（16〜18歳・23〜69歳）：<strong>38万円</strong>控除</li>
          <li>・特定扶養親族（19〜22歳・大学生等）：<strong>63万円</strong>控除（最も有利）</li>
          <li>・老人扶養親族（70歳以上・同居）：<strong>58万円</strong>控除</li>
          <li>・老人扶養親族（70歳以上・別居）：<strong>48万円</strong>控除</li>
        </ul>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>②基礎控除申告書の書き方</h2>

      <p>
        2026年分は基礎控除が引き上げられ、合計所得金額に応じて控除額が変わります。「本人の合計所得金額の見積額」欄に所得の見積額（給与のみなら給与収入から給与所得控除を引いた額）を記入し、該当する区分の基礎控除額を記入します。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">合計所得金額</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">基礎控除額</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["489万円以下", "104万円"],
              ["489万円超〜655万円以下", "67万円"],
              ["655万円超〜2,350万円以下", "62万円"],
              ["2,350万円超〜2,400万円以下", "48万円"],
              ["2,400万円超〜2,450万円以下", "32万円"],
              ["2,450万円超〜2,500万円以下", "16万円"],
              ["2,500万円超", "0円（適用なし）"],
            ].map(([income, deduction], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{income}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{deduction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>配偶者控除・配偶者特別控除</h3>
      <p>
        自分の合計所得が900万円以下の場合、配偶者の合計所得が<strong>62万円以下</strong>（給与収入136万円以下）なら配偶者控除（38万円）、62万円超133万円以下なら配偶者特別控除（38万〜3万円）が受けられます。配偶者特別控除は、配偶者の合計所得95万円以下までは満額の38万円です。自分の合計所得が900万円を超えると控除額は段階的に減り、1,000万円を超えると受けられません。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>③保険料控除申告書の書き方</h2>

      <p>
        生命保険・医療保険・個人年金保険・地震保険に加入している場合に記入します。保険会社から10〜11月頃に送られる「控除証明書」を用意してから記入してください。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">保険の種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">控除上限額</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">節税効果（税率20%の場合）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["一般生命保険料控除", "4万円（23歳未満の扶養親族がいれば6万円）", "約1.2万円（6万円なら約1.8万円）"],
              ["介護医療保険料控除", "4万円", "約1.2万円"],
              ["個人年金保険料控除", "4万円", "約1.2万円"],
              ["地震保険料控除", "5万円", "約1.5万円"],
              ["合計（生命保険3区分）", "最大12万円", "約3.6万円"],
            ].map(([type, limit, effect], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : i === 4 ? "font-medium" : ""}>
                <td className={`border border-slate-200 dark:border-zinc-700 px-4 py-2 ${i === 4 ? "font-medium" : ""}`}>{type}</td>
                <td className={`border border-slate-200 dark:border-zinc-700 px-4 py-2 ${i === 4 ? "font-medium" : ""}`}>{limit}</td>
                <td className={`border border-slate-200 dark:border-zinc-700 px-4 py-2 text-green-600 dark:text-green-400 ${i === 4 ? "font-medium" : ""}`}>{effect}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年末調整でよくある間違い・注意点</h2>

      <ul className="space-y-2">
        <li><strong>マイナンバーの記入漏れ</strong>：扶養家族のマイナンバーを忘れがちです。事前に確認しておきましょう。</li>
        <li><strong>書き間違えた場合</strong>：修正液（ホワイト）は使用不可です。二重線で訂正し、訂正印（認印可）を押してください。</li>
        <li><strong>証明書の添付漏れ</strong>：保険料控除証明書・住宅ローン残高証明書などの添付が必要です。</li>
        <li><strong>年末調整でできない控除</strong>：医療費控除・雑損控除・寄附金控除（ふるさと納税でワンストップ特例を使わない場合）は確定申告が必要です。</li>
      </ul>

      <div className="my-5 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-[13px] text-slate-600 dark:text-zinc-400">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">💡 提出し忘れた場合の対処法</strong>
        <p>年末調整で申告し忘れた控除（iDeCoの掛金証明・保険料控除等）は、翌年3月15日までの確定申告で申請できます。還付申告は5年間さかのぼって申請可能です。</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/shakai-hoken-guide">社会保険料の計算方法【年収別早見表・2026年版】</Link></li>
        <li><Link href="/blog/furusato-limit-by-income">年収別ふるさと納税の上限額早見表</Link></li>
        <li><Link href="/blog/salary-takehome-table">手取り早見表2026年版（年収300〜1000万円一覧）</Link></li>
        <li><Link href="/blog/takehome-1000">年収1000万円の手取りは月60.6万円</Link></li>
      </ul>

    </BlogLayout>
  );
}
