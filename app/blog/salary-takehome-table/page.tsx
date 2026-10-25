import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

const post = getBlogPost("salary-takehome-table")!;

export const metadata: Metadata = generateMeta({
  title: "手取り早見表【2026年最新】年収300〜1500万円の月収換算・税金内訳を一覧確認",
  description: "年収300万→月20万、400万→月26.5万、500万→月32.8万、600万→月38.9万、700万→月44.3万。年収別の手取りを一覧表でサッと確認。所得税・住民税・社会保険料の内訳と節税方法付き。",
  path: `/blog/${post.slug}`,
  keywords: ["手取り早見表 2026", "年収別 手取り 一覧", "年収500万 手取り いくら", "年収600万 手取り 月収", "手取り計算 会社員 独身", "年収1000万 手取り"],
  type: "article",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "年収500万円の手取りは月いくらですか？",
      acceptedAnswer: { "@type": "Answer", text: "年収500万円（独身・会社員）の手取りは年間約394万円・月平均約32.8万円です。控除内訳は社会保険料約73万円、所得税約9万円、住民税約24万円で、合計約106万円が引かれます。" },
    },
    {
      "@type": "Question",
      name: "年収600万円の手取りは月いくらですか？",
      acceptedAnswer: { "@type": "Answer", text: "年収600万円（独身・会社員）の手取りは年間約467万円・月平均約38.9万円です。控除内訳は社会保険料約88万円、所得税約15万円、住民税約31万円で、合計約133万円が引かれます。" },
    },
    {
      "@type": "Question",
      name: "年収1000万円の手取りは月いくらですか？",
      acceptedAnswer: { "@type": "Answer", text: "年収1000万円（独身・会社員）の手取りは年間約728万円・月平均約60.6万円です。控除内訳は社会保険料約126万円、所得税約82万円、住民税約64万円で、合計約272万円が引かれます。" },
    },
    {
      "@type": "Question",
      name: "手取りを増やす方法はありますか？",
      acceptedAnswer: { "@type": "Answer", text: "主な方法は①iDeCo（個人型確定拠出年金）で所得控除を活用、②ふるさと納税で住民税・所得税を軽減、③各種所得控除（医療費控除・生命保険料控除）を確実に申告することです。iDeCoの掛金を月2.3万円にした場合、年収500万円なら年約4万円の節税効果が目安です。" },
    },
    {
      "@type": "Question",
      name: "手取り率（手取り÷年収）の平均は何%ですか？",
      acceptedAnswer: { "@type": "Answer", text: "会社員・独身の場合、年収300〜500万円は手取り率79〜81%程度、600〜800万円は74〜78%、1000万円以上は70%前後です（2026年分の税制で計算）。年収が上がるほど累進課税の影響で手取り率が下がる傾向があります。" },
    },
  ],
};

export default function Page() {
  return (
    <>
    <JsonLd data={faqSchema} />
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        「年収600万円って手取りいくら？」と聞かれると、意外と即答できる人が少ない。給与明細は毎月見ているはずなのに、年収ベースで自分の手取りを正確に把握している人は多くありません。
      </p>
      <p>
        この記事では年収300万円〜1,500万円の手取り早見表をまとめ、何にどれだけ引かれているのかの内訳、年収ごとの実質的な負担率、そして手取りを合法的に増やすための方法まで解説します。
      </p>

      <h2>年収別・手取り早見表（最新版）</h2>
      <p>
        以下は給与所得者（会社員・正社員）、独身、協会けんぽ加入を前提に、2026年分（令和8年分）の基礎控除・給与所得控除の引き上げを反映した概算です。扶養家族の人数・居住地・加入している健康保険組合によって数万円単位で変わります。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">額面年収</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手取り年収</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">月額手取り</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">控除合計</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手取り率</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">300万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約242万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約20.1万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約58万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約80.6%</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">350万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約280万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約23.4万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約70万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約80.1%</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">400万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約318万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約26.5万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約82万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約79.5%</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">450万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約356万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約29.7万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約94万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約79.1%</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">500万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約394万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約32.8万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約106万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約78.7%</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">550万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約431万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約35.9万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約119万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約78.3%</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">600万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約467万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約38.9万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約133万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約77.8%</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">650万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約503万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約41.9万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約147万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約77.3%</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">700万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約532万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約44.3万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約168万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約76.0%</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">800万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約596万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約49.6万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約204万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約74.5%</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">900万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約662万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約55.2万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約238万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約73.6%</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,000万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約728万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約60.6万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約272万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約72.8%</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,200万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約856万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約71.3万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約344万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約71.3%</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,500万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約1025万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約85.4万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約475万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約68.3%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        年収が上がるにつれて手取り率が下がっていくのは、累進課税と社会保険料の仕組みによるものです。年収300万円で約80%手元に残るのに対し、1,500万円では約68%まで下がります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>何にどれだけ引かれているのか</h2>
      <p>
        給与から引かれるものは「社会保険料」と「税金」の2種類に大別されます。それぞれがどれくらいの割合を占めているか、年収600万円を例に見てみましょう。
      </p>

      <h3>社会保険料の内訳（年収600万円・独身・東京都）</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年間本人負担額</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">料率（本人分）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">備考</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">健康保険</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約30万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約4.96%</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">組合健保は料率が異なる</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">厚生年金</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約55万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">9.15%</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">上限あり（標準報酬月額65万円）</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">雇用保険</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約3.3万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">0.55%</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">失業給付の財源</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">社会保険料合計</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">約88万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">約14.66%</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">会社も同額負担</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        社会保険料は会社と従業員で折半です。給与明細に書いてある金額は自分の負担分のみですが、会社も同じくらい払っています。年収600万円の社員を雇うのに、会社は社会保険料の会社負担分も含めると実質700万円以上のコストをかけています。
      </p>

      <h3>税金の内訳（年収600万円・独身）</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年間額（概算）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">徴収のタイミング</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">所得税</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約15万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">毎月源泉徴収→年末調整で精算</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">住民税</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約31万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">翌年6月〜翌々年5月に徴収</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">税金合計</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">約45万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        住民税は「前年の所得」に対してかかります。転職・退職した翌年に、前職の収入に対する住民税が来るため、タイミングによっては手元資金が想定より一時的に減ることがあります。独立やフリーランス転向時に「こんなにかかるとは思わなかった」となりやすい落とし穴です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>年収ごとの手取り詳細</h2>

      <h3>年収500万円の場合</h3>
      <p>
        日本の給与所得者の平均年収（国税庁2022年調査）は約460万円です。500万円はその少し上で、標準的なサラリーマン像のイメージに近い水準です。
      </p>
      <p>
        手取りは約394万円（月約32.8万円）。控除約106万円の内訳は、社会保険料が約73万円（うち厚生年金約46万円、健康保険約25万円）、所得税約9万円、住民税約24万円が目安です。
      </p>
      <p>
        月32.8万円から家賃・食費・光熱費・通信費などの固定費を引くと、可処分所得がどれくらい残るかがわかります。東京で一人暮らしなら家賃7〜10万円、生活費8〜10万円で手元に10〜15万円残るかどうかというイメージです。
      </p>

      <h3>年収700万円の場合</h3>
      <p>
        「高収入」と言われる水準ですが、手取りは約532万円（月約44.3万円）です。額面から約24%が控除されます。
      </p>
      <p>
        注目すべきは、年収500万円から700万円に増えると額面で200万円増えますが、手取りの増加は約138万円にとどまる点です。差額の約62万円が税・社会保険料として持っていかれます。昇給・転職で「年収が上がったのに思ったほど生活が変わらない」と感じる原因のひとつです。
      </p>

      <h3>年収1,000万円の場合</h3>
      <p>
        「年収1,000万円なのに手取りが730万円弱しかない」と感じる人は多いです。手取り率は約72.8%で、300万円台のころの約80%と比べると大きく下がっています。
      </p>
      <p>
        所得税の税率が上がることに加え、課税所得の計算時に使える「給与所得控除」が年収850万円超で上限に達することも影響します（最大195万円）。一方、厚生年金は標準報酬月額65万円が上限なので、年収1,000万円と800万円でほぼ同額の保険料です。高収入になるほど「払った保険料に対してもらえる年金の比率」が下がる構造になっています。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>配偶者・扶養家族がいる場合の変化</h2>
      <p>
        ここまでは独身前提でしたが、扶養家族がいると手取りは変わります。
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">年収600万円・家族構成</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手取り年収（概算）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">独身との差</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">独身</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約467万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">—</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">配偶者あり（専業主婦・収入なし）</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約474万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">+約7万円</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">配偶者＋子ども1人（16歳未満）</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約474万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">+約7万円</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">配偶者＋子ども1人（16〜18歳）</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">約480万円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">+約13万円</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        配偶者控除（38万円）が適用されると所得税・住民税が下がります。子どもが16歳以上になると扶養控除（38万円、高校生相当）が使えるようになります。16歳未満の子どもは扶養控除の対象外ですが、児童手当が受給できる年齢帯です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>配偶者の収入と「壁」の問題</h2>
      <p>
        共働き世帯で配偶者の収入がある場合、いくつかの「壁」を意識する必要があります。パート・アルバイトの収入を調整している方は特に関係します。
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">収入の壁</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">超えると起きること</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">136万円の壁</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">配偶者控除（38万円）の対象外になり、配偶者特別控除に切り替わる（2026年分。配偶者の合計所得62万円）</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">106万円の壁</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">賃金要件（月8.8万円）は2026年10月に撤廃。従業員51人以上の会社では週20時間以上で社会保険に加入</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">130万円の壁</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">扶養から外れ、国民健康保険・国民年金の加入義務が発生（または勤め先の社会保険加入）</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">169万円の壁</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">配偶者特別控除が満額（38万円）から段階的に減り始める（配偶者の合計所得95万円）</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">207万円の壁</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">配偶者特別控除がなくなる（配偶者の合計所得133万円）</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        2026年分は基礎控除と給与所得控除の引き上げで、配偶者本人に所得税がかかり始めるのは給与収入178万円超になりました（2024年分までは103万円）。金額は国税庁タックスアンサー（No.1191・1195）の令和8年分の基準です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>ボーナスの手取り</h2>
      <p>
        ボーナスにも社会保険料と税金がかかります。ただし計算方法が月給とは少し異なります。
      </p>
      <p>
        社会保険料は月給と同じ料率が適用されます。所得税は「賞与に対する源泉徴収税額の算出率の表」を使い、前月の月給の額をもとに税率が決まります。
      </p>
      <p>
        おおよその目安として、ボーナスから引かれる税・社会保険料の合計は支給額の約20〜25%程度です。50万円のボーナスなら手取りは約37〜40万円になる計算です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>手取りを合法的に増やす5つの方法</h2>

      <h3>① iDeCo（個人型確定拠出年金）</h3>
      <p>
        掛金が全額所得控除になります。会社員の上限は月2万3,000円（会社に企業年金がない場合）。年収600万円でこの上限まで積み立てると、年間で約8〜9万円の節税効果があります。60歳まで引き出せないデメリットはありますが、老後資金と節税を同時に進められる制度です。
      </p>

      <h3>② ふるさと納税</h3>
      <p>
        実質2,000円の自己負担で全国の特産品が受け取れ、残りは税額控除されます。年収600万円の独身なら約7〜8万円が目安の控除上限額です。食品・日用品の返礼品を選べば生活費の節約にもなります。ワンストップ特例を使えば確定申告不要。
      </p>

      <h3>③ 住宅ローン控除</h3>
      <p>
        住宅を購入している場合、最大13年間にわたって所得税（＋一部住民税）が控除されます。年収・借入額によっては年間30〜40万円規模の節税になることもあり、会社員が使える控除の中では最大級の効果があります。
      </p>

      <h3>④ 医療費控除・セルフメディケーション税制</h3>
      <p>
        年間の医療費が10万円（または所得の5%）を超えた場合、超えた部分が所得控除の対象になります。セルフメディケーション税制は、特定のOTC医薬品の購入費が年1万2,000円を超えた場合に使える別枠の控除です。確定申告が必要ですが、手間に比べて節税効果が高いケースがあります。
      </p>

      <h3>⑤ 生命保険料控除・地震保険料控除</h3>
      <p>
        生命保険・介護保険・個人年金保険の保険料は、一定額まで所得控除の対象になります。地震保険料も同様です。すでに加入している場合は、年末調整で確実に申請しましょう。うっかり忘れている人が意外と多い控除のひとつです。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>「年収を上げるより節税」は本当か</h2>
      <p>
        「節税より収入アップを目指すべき」という意見と「まず節税から」という意見があります。どちらが正しいかは状況次第ですが、節税の上限は収める税金の額に依存します。税金を払っていなければ節税のしようがありません。
      </p>
      <p>
        一方、iDeCoやふるさと納税は「やらないと純粋に損」に近い制度です。特にふるさと納税はすでに払っている住民税・所得税をポイントに変換するようなイメージで、返礼品を受け取れる分だけ実質的に手取りが増えます。収入アップを目指しながら並行して使うのが合理的です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>自分の正確な手取りを計算する</h2>
      <p>
        ここに載せた数字は概算です。扶養家族の人数・加入している健康保険組合・各種控除の状況によって実際の手取りは数万円単位で変わります。自分の年収・家族構成を入力してより正確な金額を確認できます。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-2">手取りを正確に計算する</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">年収・家族構成・各種控除を入力するだけで、あなたの手取り額を自動計算します。</p>
        <Link href="/tools/net-income" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          手取り計算ツールを使う（無料）→
        </Link>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>よくある質問</h2>
      <dl className="space-y-4">
        {[
          { q: "年収500万円の手取りは月いくらですか？", a: "独身・会社員の場合、年間約394万円・月平均約32.8万円です。社会保険料・所得税・住民税の合計で約106万円が控除されます。" },
          { q: "年収600万円の手取りは月いくらですか？", a: "独身・会社員の場合、年間約467万円・月平均約38.9万円です。約133万円が控除され、手取り率は約78%です。" },
          { q: "手取りを増やすために何ができますか？", a: "iDeCo・ふるさと納税・医療費控除・生命保険料控除などを活用することで、年10〜30万円程度の節税が可能です。" },
          { q: "手取り率（手取り÷年収）の目安は？", a: "年収300〜500万円は79〜81%程度、600〜800万円は74〜78%、1000万円以上は70%前後。年収が高いほど累進課税の影響で手取り率は下がります。" },
        ].map(({ q, a }) => (
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
      <h2>年収別の詳細解説記事</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {[
          { href: "/blog/takehome-300", text: "年収300万円の手取り", sub: "月20.1万円" },
          { href: "/blog/takehome-400", text: "年収400万円の手取り", sub: "月26.5万円" },
          { href: "/blog/takehome-500", text: "年収500万円の手取り", sub: "月32.8万円" },
          { href: "/blog/takehome-600", text: "年収600万円の手取り", sub: "月38.9万円" },
          { href: "/blog/takehome-700", text: "年収700万円の手取り", sub: "月44.3万円" },
          { href: "/blog/takehome-800", text: "年収800万円の手取り", sub: "月49.6万円" },
          { href: "/blog/takehome-900", text: "年収900万円の手取り", sub: "月55.2万円" },
          { href: "/blog/takehome-1000", text: "年収1000万円の手取り", sub: "月60.6万円" },
        ].map(({ href, text, sub }) => (
          <Link key={href} href={href} className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
            <span className="text-[14px] text-blue-600 dark:text-blue-400 font-medium">{text}</span>
            <span className="text-[13px] text-slate-500 dark:text-zinc-400">{sub}</span>
          </Link>
        ))}
      </div>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事の数値は現行の税率・社会保険料率に基づく概算です。制度改正・個人の状況により実際の手取りは異なります。正確な金額は税理士・社会保険労務士にご相談ください。
      </div>
    </BlogLayout>
    </>
  );
}
