import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("furusato-nozei-howto")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["ふるさと納税 やり方", "ふるさと納税 手順", "ワンストップ特例 申請方法", "ふるさと納税 いつまで", "ふるさと納税 確定申告 不要"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        ふるさと納税は<strong>実質2,000円</strong>の負担で返礼品がもらえ、残りは税金から控除される制度です。手順は5ステップ。会社員なら確定申告なしで完結できます。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">まず自分の控除上限額を確認する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">年収・家族構成を入力して、お得に寄付できる上限額を計算できます。</p>
        <Link href="/tools/furusato-simulator" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          ふるさと納税シミュレーターを使う（無料）→
        </Link>
      </div>

      <h2>ふるさと納税の仕組み（3分で理解）</h2>
      <p>
        好きな自治体に「寄付」すると、寄付額から<strong>自己負担2,000円</strong>を除いた金額が所得税の還付＋翌年の住民税の控除という形で返ってきます。さらに寄付した自治体から<strong>返礼品</strong>（食品・家電・旅行券など）がもらえます。
      </p>
      <div className="bg-slate-100 dark:bg-zinc-800 rounded-lg p-4 my-4 text-sm">
        例：年収500万（独身）で5万円寄付した場合<br />
        → 自己負担：2,000円<br />
        → 税金控除：48,000円（所得税還付＋住民税軽減）<br />
        → 返礼品：約1.5万円相当の食品・日用品など
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>ふるさと納税の手順（5ステップ）</h2>
      <ol className="list-decimal list-outside ml-6 space-y-3 my-4">
        <li>
          <strong>控除上限額を確認する</strong><br />
          <span className="text-sm text-slate-600 dark:text-zinc-400">年収・家族構成で上限額が変わります。<Link href="/tools/furusato-simulator">ふるさと納税シミュレーター</Link>や各ポータルサイトの計算ツールで目安を把握しましょう。上限を超えた分は自己負担になります。</span>
        </li>
        <li>
          <strong>寄付先と返礼品を選ぶ</strong><br />
          <span className="text-sm text-slate-600 dark:text-zinc-400">さとふる・ふるなび・楽天ふるさと納税などのポータルサイトから好きな自治体・返礼品を選びます。複数の自治体に分けて寄付してもOKです（ワンストップ特例は5自治体まで）。</span>
        </li>
        <li>
          <strong>寄付する（12月31日までに完了）</strong><br />
          <span className="text-sm text-slate-600 dark:text-zinc-400">その年の税金控除を受けるには12月31日までに寄付を完了する必要があります。クレジットカード払い・コンビニ払い・銀行振込などが選べます。</span>
        </li>
        <li>
          <strong>ワンストップ特例申請書を送る（会社員向け・確定申告不要）</strong><br />
          <span className="text-sm text-slate-600 dark:text-zinc-400">寄付後に自治体から申請書が届きます。必要事項を記入してマイナンバー書類のコピーと一緒に<strong>翌年1月10日まで</strong>に郵送します。5自治体以内なら確定申告なしで完結します。</span>
        </li>
        <li>
          <strong>翌年6月以降に住民税が安くなる</strong><br />
          <span className="text-sm text-slate-600 dark:text-zinc-400">翌年6月から翌々年5月の住民税天引き額が減ります。給与明細や住民税決定通知書で控除されていることを確認できます。</span>
        </li>
      </ol>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>ワンストップ特例 vs 確定申告</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">項目</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">ワンストップ特例</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">確定申告</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["対象者", "給与収入のみの会社員", "個人事業主・医療費控除なども申告する人・寄付先6自治体以上"],
              ["手続き", "各自治体に申請書を郵送", "税務署またはe-Taxで申告"],
              ["締切", "翌年1月10日（必着）", "翌年2月16日〜3月15日"],
              ["控除の反映", "住民税のみから全額控除", "所得税還付＋住民税から控除"],
              ["手間", "少ない（自治体数×1枚の書類）", "多い（寄附金受領証明書をまとめて申告）"],
            ].map(([item, one, kakutei], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-xs">{item}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-xs">{one}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-xs">{kakutei}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収別・控除上限額の目安</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年収</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">独身・共働き</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">配偶者あり（専業主婦）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">配偶者＋子1人</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["300万円", "約28,000円", "約19,000円", "約11,000円"],
              ["400万円", "約42,000円", "約33,000円", "約25,000円"],
              ["500万円", "約61,000円", "約49,000円", "約40,000円"],
              ["600万円", "約77,000円", "約69,000円", "約60,000円"],
              ["700万円", "約108,000円", "約86,000円", "約78,000円"],
              ["800万円", "約129,000円", "約120,000円", "約110,000円"],
              ["1000万円", "約176,000円", "約166,000円", "約157,000円"],
            ].map(([income, single, spouse, spouseChild], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{income}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400 font-medium">{single}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{spouse}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{spouseChild}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※2026年現行税率による概算。ふるさと納税以外の控除（住宅ローン控除・医療費控除など）がある場合は上限額が変わります。<Link href="/tools/furusato-simulator">シミュレーターで正確に確認</Link>してください。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>よくある失敗と注意点</h2>
      <ul className="space-y-2">
        <li><strong>12月31日を過ぎてしまった</strong>：その年の控除対象にならない。年末は決済確認まで余裕をもって行う</li>
        <li><strong>ワンストップ特例を5自治体超で申請した</strong>：6自治体以上では確定申告が必要。申請書を送っただけでは控除されない</li>
        <li><strong>上限を超えて寄付した</strong>：超過分は全額自己負担。シミュレーターで事前確認が重要</li>
        <li><strong>申請書を1月10日までに送り忘れた</strong>：確定申告で申告すれば還付を受けられる（2月〜3月に申告）</li>
        <li><strong>引っ越しして住民税の納付先が変わった</strong>：ワンストップ特例の場合、住所変更届が必要な場合がある</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/furusato-nozei-guide">ふるさと納税の控除上限額早見表（年収別）</Link></li>
        <li><Link href="/blog/jumin-zei-guide">住民税の計算方法と控除の仕組み</Link></li>
        <li><Link href="/blog/salary-takehome-table">手取り早見表【年収300〜1500万円】</Link></li>
        <li><Link href="/blog/nisa-ideco-compare">新NISAとiDeCoの違い・使い分け方</Link></li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事の控除上限額は現行の税率・保険料率に基づく概算です。医療費控除・住宅ローン控除など他の控除がある場合、実際の上限額は異なります。正確な上限額はシミュレーターまたは税理士にご確認ください。
      </div>
    </BlogLayout>
  );
}
