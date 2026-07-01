import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

const post = getBlogPost("mercari-fees-guide")!;

export const metadata: Metadata = generateMeta({
  title: "メルカリ手数料の計算方法【2026年最新】送料込みの手取り早見表と損しない価格設定",
  description: "メルカリ手数料は販売価格の10%。計算式：1,000円×10%=100円。ネコポス175円込みで手取り725円。配送方法別の手取り早見表・値下げ交渉文例・他プラットフォームとの手数料比較付き。",
  path: `/blog/${post.slug}`,
  keywords: ["メルカリ 手数料 計算", "メルカリ 手数料 いくら", "メルカリ 手取り 計算", "メルカリ 送料 いくら", "メルカリ 手数料 10パーセント 計算方法", "メルカリ ネコポス 手取り 早見表"],
  type: "article",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "メルカリの手数料は何パーセントですか？",
      acceptedAnswer: { "@type": "Answer", text: "メルカリの販売手数料は一律10%です。例えば1,000円で売れた場合、100円が手数料として自動的に差し引かれ、手元に残る前の金額は900円になります。そこからさらに送料が引かれます。" },
    },
    {
      "@type": "Question",
      name: "メルカリで1,000円で売ったら手元にいくら残りますか？",
      acceptedAnswer: { "@type": "Answer", text: "送料込み（ネコポス175円）の場合、1,000円 - 手数料100円 - 送料175円 = 725円が手取りになります。着払いの場合は1,000円 - 手数料100円 = 900円です。" },
    },
    {
      "@type": "Question",
      name: "メルカリのネコポスとゆうパケットはどちらが安いですか？",
      acceptedAnswer: { "@type": "Answer", text: "ネコポスは175円、ゆうパケット（ゆうゆうメルカリ便）は230円で、ネコポスのほうが55円安いです。どちらもA4サイズ・厚さ3cm・1kgまで対応しており、ネコポスを優先するのがおすすめです。" },
    },
    {
      "@type": "Question",
      name: "メルカリで赤字にならない最低価格の計算方法は？",
      acceptedAnswer: { "@type": "Answer", text: "最低価格 = (送料 + 梱包材費) ÷ 0.9 で計算できます。ネコポス175円・梱包材20円の場合、195÷0.9 ≒ 217円が赤字にならない最低価格です。値下げ交渉に備えてさらに1〜2割上乗せした価格設定が安全です。" },
    },
    {
      "@type": "Question",
      name: "メルカリの売上に確定申告は必要ですか？",
      acceptedAnswer: { "@type": "Answer", text: "自宅の不用品（衣類・家電・本など）を売る場合は原則非課税で確定申告は不要です。転売目的で仕入れた商品や手作り品を継続的に販売する場合は、給与所得者なら年間20万円超で確定申告が必要です。" },
    },
  ],
};

export default function Page() {
  return (
    <>
    <JsonLd data={faqSchema} />
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        メルカリで出品するとき「この値段で売ったら手元にいくら残るんだろう」と毎回計算するのは面倒です。手数料<strong>10%</strong>だとわかっていても、送料を加えると実際の手取りがどうなるのか、ぱっとイメージできない人も多い。
      </p>
      <p>
        この記事では、手数料と送料の仕組みを整理したうえで、売値ごとの手取り金額早見表と送料の比較をまとめました。あわせて、利益を最大化するための実践的なポイントも紹介します。
      </p>

      <h2>メルカリの手数料の仕組み</h2>
      <p>
        メルカリの手数料は販売価格の<strong>10%</strong>です。これは売れたときに自動的に差し引かれます。300円で売れたなら30円、1,000円で売れたなら100円が手数料です。
      </p>
      <p>
        送料については、「送料込み（出品者負担）」と「着払い（購入者負担）」の2種類があります。送料込みで出品すると購入者が送料を気にせず購入しやすくなりますが、送料分だけ利益が減ります。
      </p>
      <p>
        手元に残る金額の計算式は以下のとおりです。
      </p>
      <ul className="space-y-2">
        <li>送料込みの場合：手取り ＝ 販売価格 − 手数料（10%）− 送料</li>
        <li>着払いの場合：手取り ＝ 販売価格 − 手数料（10%）</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>売値別・手取り金額早見表（送料込み・ネコポス175円の場合）</h2>
      <p>
        最も利用頻度が高いネコポス（175円）で送料込み出品した場合の手取りをまとめました。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">販売価格</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">販売手数料（10%）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">送料（ネコポス）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手取り</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["300円", "30円", "175円", "95円"],
              ["500円", "50円", "175円", "275円"],
              ["800円", "80円", "175円", "545円"],
              ["1,000円", "100円", "175円", "725円"],
              ["1,500円", "150円", "175円", "1,175円"],
              ["2,000円", "200円", "175円", "1,625円"],
              ["3,000円", "300円", "175円", "2,525円"],
              ["5,000円", "500円", "175円", "4,325円"],
              ["10,000円", "1,000円", "175円", "8,825円"],
            ].map(([price, fee, shipping, takehome], i) => (
              <tr key={price} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{price}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500">{fee}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500">{shipping}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{takehome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        300円の出品は手取り95円です。梱包材（プチプチ・袋）のコストを引くとほぼ利益がありません。低価格の商品は送料負担が重く、価格設定を誤ると赤字になるケースがあります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>送料の比較：どの配送方法を使うべきか</h2>
      <p>
        メルカリには複数の配送方法があります。サイズ・重さによって最適な方法が変わります。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">配送方法</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">料金</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">サイズ上限</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">向いている商品</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">ネコポス</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">175円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">A4・厚さ3cm・1kg以内</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">薄い衣類・本・書類・小物</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">宅急便コンパクト</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">450円（＋専用BOX70円）</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">専用BOXに収まるもの</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">小型雑貨・化粧品・アクセサリー</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">宅急便（60サイズ）</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">750円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">3辺計60cm・2kg以内</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">靴・小型家電・折りたたみ傘</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">宅急便（80サイズ）</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">850円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">3辺計80cm・5kg以内</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">衣類まとめ・バッグ・中型家電</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">宅急便（100サイズ）</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">1,050円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">3辺計100cm・10kg以内</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">大型衣類・家電・おもちゃ</td>
            </tr>
            <tr className="bg-slate-50 dark:bg-zinc-900">
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">ゆうパケット（ゆうゆう）</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">230円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">A4・厚さ3cm・1kg以内</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">ネコポスと同用途・郵便局受取可</td>
            </tr>
            <tr>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">ゆうパック（60サイズ）</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">770円</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">3辺計60cm・25kg以内</td>
              <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">重い商品に向く（25kgまで同料金）</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        ネコポスとゆうパケットはサイズ上限がほぼ同じですが、ネコポスのほうが55円安い（175円 vs 230円）です。コンビニ・ヤマト営業所から発送できる手軽さもあり、薄い商品ならネコポスが第一選択肢になります。
      </p>

      <h3>同じ「3,000円」でも配送方法で手取りはこう変わる</h3>
      <p>
        販売価格3,000円（手数料300円）の商品を、配送方法だけ変えた場合の手取りを比較すると、選び方ひとつで最大675円の差が出ます。
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">配送方法</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">送料</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">手取り（3,000円の場合）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["ネコポス", "175円", "2,525円", true],
              ["ゆうパケット", "230円", "2,470円", false],
              ["宅急便コンパクト（＋BOX）", "520円", "2,180円", false],
              ["宅急便60サイズ", "750円", "1,950円", false],
              ["宅急便80サイズ", "850円", "1,850円", false],
            ].map(([method, shipping, takehome, best], i) => (
              <tr key={method as string} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">
                  {method}{best ? <span className="ml-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">最安</span> : null}
                </td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500">{shipping}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium text-blue-600 dark:text-blue-400">{takehome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] text-slate-500 dark:text-zinc-500">
        ※商品が薄くて軽いほど安い配送方法を選べます。サイズに余裕があるのに大きい配送方法を選ぶと、手取りを数百円単位で損します。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>梱包材のコストも忘れずに</h2>
      <p>
        手取り計算でよく忘れられるのが梱包材のコストです。
      </p>
      <ul className="space-y-2">
        <li>OPP袋（透明袋）：10〜20円程度</li>
        <li>プチプチ（エアキャップ）：10〜30円程度（使用量による）</li>
        <li>段ボール箱：50〜100円程度（ホームセンター調達の場合）</li>
        <li>テープ・紙など：1〜5円程度</li>
      </ul>
      <p>
        100均やスーパーの廃材を活用すればコストを抑えられますが、ある程度の量を出品するなら梱包材を原価に含めて計算する習慣をつけておくと、正確な利益を把握できます。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>利益を増やすための実践的なポイント</h2>

      <h3>① 値下げ交渉の余地を価格に含める</h3>
      <p>
        メルカリでは値下げ交渉が頻繁にあります。「この価格から10%引いても利益が出る」という価格設定をしておくと、交渉に応じながらも赤字を避けられます。
      </p>

      <h3>② まとめ売りで送料の負担を分散する</h3>
      <p>
        同じ購入者に複数の商品を同梱できれば、1回の送料で複数の商品を届けられます。「まとめ買い割引あり」と記載しておくと、同一の方に複数点購入いただける機会が増えます。
      </p>

      <h3>③ 写真・タイトルにこだわる</h3>
      <p>
        検索でヒットするかどうかはタイトルに含まれるキーワードで大きく変わります。ブランド名・型番・カラー・サイズを正確に記載することが重要です。写真は明るい場所で複数枚撮影し、状態がわかるように細部も撮っておくと購入者の安心感につながります。
      </p>

      <h3>④ 売れやすい時間帯・曜日を意識する</h3>
      <p>
        出品後すぐに新着に表示されるため、購入者が多い時間帯（夜20〜23時）に出品すると閲覧数が上がりやすい傾向があります。週末に向けて木〜金に出品するのも一つの戦略です。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>カテゴリ別：おすすめ配送方法とコツ</h2>
      <p>
        商品ジャンルによって最適な配送方法は異なります。「なんとなく宅急便」で損しないよう、カテゴリ別の目安をまとめました。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">商品カテゴリ</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">おすすめ配送</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">送料目安</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">注意点</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["文庫本・マンガ（1冊）", "ネコポス", "175円", "A4・3cm以内に収まればネコポス一択"],
              ["文庫本・マンガ（2〜5冊）", "宅急便コンパクト", "520円（BOX込）", "重さが出るため宅コンかゆうパックへ"],
              ["薄手のTシャツ・ニット", "ネコポス", "175円", "折りたためばA4・3cm以内に収まることが多い"],
              ["コート・ジャケット", "宅急便80〜100サイズ", "850〜1,050円", "商品価格に対して送料が高くなりがち、価格設定注意"],
              ["コスメ（口紅・アイシャドウ等）", "ネコポス or 宅コン", "175〜520円", "破損防止のプチプチ必須、缶・瓶は液漏れ注意"],
              ["スマホ・タブレット", "宅急便60〜80サイズ", "750〜850円", "動作確認の記載と梱包が評価に直結"],
              ["ゲームソフト（単品）", "ネコポス", "175円", "ケースごとでもA4・3cm以内が多い"],
              ["ゲーム本体（Switch等）", "宅急便60〜80サイズ", "750〜850円", "箱あり・なしで梱包サイズが大きく変わる"],
              ["スニーカー・シューズ", "宅急便60〜80サイズ", "750〜850円", "靴箱ごと送ると80サイズ超えになりやすい"],
              ["ブランドバッグ・財布", "宅急便80サイズ", "850円", "保護材で丁寧に梱包、高額品は保険付きの配送を推奨"],
            ].map(([cat, method, price, note], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{cat}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{method}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{price}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500 dark:text-zinc-500 text-xs">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>値下げ交渉への対応：受け方・断り方の実践例</h2>
      <p>
        メルカリで出品していると「〇〇円にしてもらえますか？」というコメントは日常茶飯事です。受けるか断るかを事前に決めておくと、毎回悩まずに済みます。
      </p>

      <h3>値下げを受ける基準を決めておく</h3>
      <p>
        たとえば「手取りが〇〇円を下回らなければ応じる」という基準を設けます。
        <Link href="/tools/mercari-profit" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">メルカリ利益計算ツール</Link>
        で最低許容価格を事前に確認しておけば、交渉中に慌てて計算する必要がなくなります。
      </p>

      <div className="my-6 space-y-4">
        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40">
          <p className="text-[13px] font-semibold text-green-700 dark:text-green-400 mb-1">✔ 値下げに応じるときの文例</p>
          <p className="text-[14px] text-green-800 dark:text-green-300 font-mono">「ありがとうございます。〇〇円でしたら対応可能です。よろしければ専用ページをお作りします。」</p>
        </div>
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40">
          <p className="text-[13px] font-semibold text-red-700 dark:text-red-400 mb-1">✖ 値下げを丁寧に断るときの文例</p>
          <p className="text-[14px] text-red-800 dark:text-red-300 font-mono">「コメントありがとうございます。送料と手数料を考慮した価格設定のため、現在の価格より値下げが難しい状況です。ご理解いただけますと幸いです。」</p>
        </div>
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40">
          <p className="text-[13px] font-semibold text-blue-700 dark:text-blue-400 mb-1">💡 まとめ買いに誘導するときの文例</p>
          <p className="text-[14px] text-blue-800 dark:text-blue-300 font-mono">「単品での値下げは難しいですが、他の商品と合わせてご購入いただける場合は同梱でおまとめできます。ご興味ある商品があればご連絡ください。」</p>
        </div>
      </div>

      <h3>「大幅値下げ」要求への対処</h3>
      <p>
        出品価格1,000円に対して「500円にして」など、半額以下の要求が来ることもあります。このようなケースでは、丁寧に断ったうえで「いいね！」が増えたタイミングや出品から一定期間後に自分で少額値下げする方法が有効です。いいねをしている閲覧者に値下げ通知が届くため、購入意欲が再燃することがあります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>高額商品（3万円以上）を出品するときの注意点</h2>

      <h3>他プラットフォームとの手数料比較</h3>
      <p>
        高額商品になるほど手数料の差が利益に直結します。3万円以上の商品はメルカリ以外のプラットフォームも検討する価値があります。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">プラットフォーム</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">販売手数料</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">3万円売れたときの手数料</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">特徴</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["メルカリ", "10%", "3,000円", "ユーザー数が多く売れやすい"],
              ["ラクマ（楽天）", "3.5〜6%", "1,050〜1,800円", "手数料は安いが出品者・購入者ともやや少ない"],
              ["ヤフオク", "オークション形式・落札システム利用料あり", "1,500〜2,000円前後", "ブランド品・コレクターズアイテムに強い"],
              ["PayPayフリマ", "5%", "1,500円", "Yahoo! JAPANとの連携で集客力あり"],
            ].map(([platform, fee, cost, note], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{platform}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{fee}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-600 dark:text-zinc-400">{cost}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-slate-500 dark:text-zinc-500 text-xs">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        ブランドバッグや高級時計などは「BUYMA」「ブランディア」「ヴィンテージキングオンライン」など専門買取・フリマサービスのほうが高値が付くこともあります。メルカリに出す前に複数の査定を比較するのがおすすめです。
      </p>

      <h3>高額取引における注意点</h3>
      <ul className="space-y-2">
        <li><strong>真贋保証</strong>：ブランド品は偽物の疑いをかけられないよう、購入証明書・付属品の有無を明記しましょう。</li>
        <li><strong>補償付きの配送</strong>：高額商品は宅急便の「補償なし」では紛失・破損が発生しても補填されません。宅急便のオプションで保険を付けるか、メルカリ便を利用して万一の損害に備えましょう。</li>
        <li><strong>個人情報の取り扱い</strong>：10万円を超える取引が複数回続くと、プラットフォーム側から本人確認の連絡が来ることがあります。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>確定申告が必要になるケース</h2>
      <p>
        メルカリの売上については、税法上の扱いが状況によって変わります。
      </p>
      <p>
        <strong>原則非課税のケース</strong>：生活用品（衣類・家具・家電など）を使った後に売却する場合は、原則として所得税の対象外です。「不用品の処分」として売上が出ても申告不要なことがほとんどです。
      </p>
      <p>
        <strong>課税対象になるケース</strong>：転売目的で仕入れた商品を販売する場合や、ハンドメイド品を継続的に販売する場合は、雑所得または事業所得として課税対象になります。給与所得者であれば、これらの所得が年間20万円を超えると確定申告が必要です。
      </p>
      <p>
        「不用品の処分」と「転売・副業」の境界線は曖昧な部分もありますが、仕入れを行っている、または継続的な販売活動を行っているという実態があれば、課税対象と見なされる可能性が高まります。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>正確な利益を事前に計算する</h2>
      <p>
        販売価格・送料・梱包材費を入力して手取り額と利益率を即計算できる
        <Link href="/tools/mercari-profit" className="text-blue-600 dark:text-blue-400 hover:underline">メルカリ利益計算ツール</Link>
        を使うと、出品前に採算が取れるかどうかを確認できます。赤字出品を防ぐための最低価格の把握にも役立ちます。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-5 my-6 border border-blue-200 dark:border-blue-800">
        <strong className="text-blue-800 dark:text-blue-300 block mb-1">出品前に手取りをチェック</strong>
        <p className="text-[14px] text-blue-700 dark:text-blue-400 mb-3">販売価格・仕入れ値・送料を入れるだけで、手数料10%を引いた実質手取りと利益率がすぐにわかります。</p>
        <Link href="/tools/mercari-profit" className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          メルカリ利益計算ツールを使う（無料）→
        </Link>
      </div>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事の送料・手数料は執筆時点の情報に基づきます。変更されている場合がありますので、最新情報はメルカリ公式サイトでご確認ください。税務上の取り扱いについては税理士にご相談ください。
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>よくある質問</h2>
      <dl className="space-y-4">
        {[
          { q: "メルカリの手数料は何パーセントですか？", a: "販売手数料は一律10%です。300円で売れたなら30円、1,000円なら100円が差し引かれます。最低価格は300円に設定されています。" },
          { q: "ネコポスとゆうパケット、どちらを使うべきですか？", a: "ネコポス（175円）のほうがゆうパケット（230円）より55円安く、サイズ上限もほぼ同じです。コンビニや宅急便センターからも出せるネコポスが第一選択肢です。" },
          { q: "値下げ交渉に備えた価格設定はどうすればいいですか？", a: "希望利益額を決めてから「手取り = (販売価格 × 0.9) - 送料 - 梱包材費」で逆算します。10%値下げされても利益が出るよう、希望手取りを0.8で割った価格が目安です。" },
          { q: "メルカリの売上は税金がかかりますか？", a: "自宅の不用品処分は原則非課税です。転売・ハンドメイドの継続販売は雑所得扱いで、給与所得者は年間20万円超で確定申告が必要になります。" },
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
    </BlogLayout>
    </>
  );
}
