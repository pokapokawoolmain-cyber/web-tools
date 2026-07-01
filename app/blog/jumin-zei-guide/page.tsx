import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

const post = getBlogPost("jumin-zei-guide")!;

export const metadata: Metadata = generateMeta({
  title: "住民税の計算方法【2026年版・年収別早見表】いつから引かれる？控除の仕組みを解説",
  description: "2026年6月通知書対応。年収400万の住民税は約16万円（月1.3万円）。年収別の住民税額早見表、新卒2年目から急に手取りが減る理由、所得割・均等割・ふるさと納税の節税をわかりやすく解説。",
  path: `/blog/${post.slug}`,
  keywords: ["住民税 計算方法", "住民税 年収別", "住民税 いつから", "新卒 住民税 2年目", "住民税 控除 仕組み", "住民税 2026", "住民税 いくら 2026", "住民税 通知書 いつ"],
  type: "article",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: post.faqs?.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function Page() {
  return (
    <>
    <JsonLd data={faqSchema} />
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        住民税は年収400万円で約<strong>16万円（月1.3万円）</strong>が目安。新卒2年目の6月から突然引かれ始めるため、手取りが急減したように感じる原因の一つです。計算方法・年収別早見表・控除の仕組みを解説します。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">住民税込みで正確な手取りを計算する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">年収・家族構成を入力して所得税・住民税・社会保険料を含めた手取り額を計算できます。</p>
        <Link href="/tools/net-income" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          手取り計算ツールを使う（無料）→
        </Link>
      </div>

      <h2>住民税の計算式</h2>
      <div className="bg-slate-100 dark:bg-zinc-800 rounded-lg p-4 my-4 text-sm font-mono">
        住民税 ＝ 所得割（課税所得 × 10%）＋ 均等割（約5,000円）
      </div>
      <ul className="space-y-2">
        <li><strong>所得割</strong>：（給与収入 – 給与所得控除 – 所得控除）× 10%。都道府県税4%＋市区町村税6%</li>
        <li><strong>均等割</strong>：所得に関係なく定額で課税される部分。標準は年5,000円（自治体により異なる）</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収別・住民税額早見表（独身・会社員）</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年収</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">住民税（年間概算）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月換算</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手取りへの影響</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["200万円", "約4万円", "約3,300円", "新卒2年目から開始"],
              ["300万円", "約10万円", "約8,300円", "約0.8万円/月の天引き"],
              ["400万円", "約16万円", "約1.3万円", "約1.3万円/月の天引き"],
              ["500万円", "約20万円", "約1.7万円", "約1.7万円/月の天引き"],
              ["600万円", "約27万円", "約2.3万円", "約2.3万円/月の天引き"],
              ["700万円", "約33万円", "約2.8万円", "約2.8万円/月の天引き"],
              ["800万円", "約39万円", "約3.3万円", "約3.3万円/月の天引き"],
              ["1000万円", "約53万円", "約4.4万円", "約4.4万円/月の天引き"],
            ].map(([income, tax, monthly, note], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{income}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400 font-medium">{tax}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{monthly}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500 dark:text-zinc-500 text-xs">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※独身・東京都在住・基礎控除のみ適用の概算です。社会保険料控除・生命保険料控除などにより実際の住民税は変わります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>新卒2年目に住民税が始まる理由</h2>
      <p>
        住民税は「前年1月〜12月の所得」に対して課税され、翌年の6月から翌々年の5月まで分割して天引きされます。
      </p>
      <ul className="space-y-2">
        <li><strong>新卒1年目（4月入社）</strong>：前年（学生時代）の所得がほぼゼロ → 住民税の天引きなし</li>
        <li><strong>新卒2年目の6月</strong>：1年目の給与が課税対象になる → 突然住民税が天引きされ始める</li>
        <li>手取りが<strong>月1〜1.5万円減る</strong>ことが多く、昇給があっても手取りが増えないと感じる原因になる</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>住民税の控除・引き方</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">控除の種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">住民税の控除額</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">税額軽減効果（目安）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["基礎控除", "43万円", "課税所得が43万円減る"],
              ["社会保険料控除", "支払った全額", "年収の約15%分が控除対象"],
              ["配偶者控除（専業主婦）", "33万円", "年間約3.3万円の節税"],
              ["生命保険料控除", "最大7万円", "年間約0.7万円の節税"],
              ["ふるさと納税", "寄付額－2,000円", "翌年の住民税から直接控除"],
              ["iDeCo（個人型確定拠出年金）", "掛金全額", "年収500万で年間約2万円の節税"],
            ].map(([type, amount, effect], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{type}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{amount}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{effect}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>住民税を合法的に減らす方法</h2>
      <ul className="space-y-2">
        <li>
          <strong>ふるさと納税</strong>：寄付額から2,000円を除いた全額が翌年の住民税から控除されます。<Link href="/tools/furusato-simulator">ふるさと納税シミュレーター</Link>で上限額を確認しましょう。
        </li>
        <li>
          <strong>iDeCo</strong>：掛金が全額所得控除になり、住民税も軽減されます。年収400万で月2万円拠出すると年間約2.4万円の節税効果があります。
        </li>
        <li>
          <strong>医療費控除</strong>：年間の医療費が10万円を超えた場合、確定申告で控除申請できます（住民税にも適用）。
        </li>
        <li>
          <strong>住宅ローン控除</strong>：年末ローン残高の0.7%が所得税・住民税から控除されます。
        </li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>2026年6月：住民税通知書が届く時期</h2>
      <p>
        毎年<strong>6月</strong>に「住民税（特別徴収税額）の通知書」が会社経由で届きます。これは前年（2025年1月〜12月）の所得に基づいて計算された住民税が、2026年6月から2027年5月の12回に分けて給与から天引きされることを示すものです。
      </p>
      <ul className="space-y-2 text-[14px]">
        <li>2026年6月通知書 → <strong>2025年の所得</strong>に対する住民税（2026年6月〜2027年5月に天引き）</li>
        <li>通知書で「月いくら引かれるか」を事前に確認できる</li>
        <li>副業・投資収益がある場合は、ここで追加徴収の金額がわかる</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>よくある質問</h2>
      <dl className="space-y-4">
        {post.faqs?.map(({ q, a }) => (
          <div key={q} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-4">
            <dt className="font-semibold text-slate-800 dark:text-zinc-200 mb-1 flex items-start gap-2">
              <span className="text-blue-500 font-bold flex-shrink-0">Q.</span>{q}
            </dt>
            <dd className="text-slate-600 dark:text-slate-400 text-[14px] flex items-start gap-2">
              <span className="text-blue-500 font-bold flex-shrink-0">A.</span>{a}
            </dd>
          </div>
        ))}
      </dl>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/shakai-hoken-guide">社会保険料の計算方法【年収別早見表】</Link></li>
        <li><Link href="/blog/salary-takehome-table">手取り早見表【年収300〜1500万円】</Link></li>
        <li><Link href="/blog/furusato-nozei-guide">ふるさと納税の控除上限額早見表</Link></li>
        <li><Link href="/blog/takehome-400">年収400万円の手取り詳細</Link></li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事の数値は2026年現行の税率・控除額に基づく概算です。居住する自治体・家族構成・各種控除の状況により実際の住民税額は異なります。正確な金額は市区町村の税務窓口または確定申告書で確認してください。
      </div>
    </BlogLayout>
    </>
  );
}
