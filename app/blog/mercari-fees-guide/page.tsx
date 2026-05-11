import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";

const post = getBlogPost("mercari-fees-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["メルカリ 手数料", "メルカリ 手数料 計算", "メルカリ 利益計算", "メルカリ 送料 比較", "メルカリ 手取り"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p>
        メルカリで出品するとき「この値段で売ったら手元にいくら残るんだろう」と毎回計算するのは面倒です。手数料10%だとわかっていても、送料を加えると実際の手取りがどうなるのか、ぱっとイメージできない人も多い。
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
      <ul>
        <li>送料込みの場合：手取り ＝ 販売価格 − 手数料（10%）− 送料</li>
        <li>着払いの場合：手取り ＝ 販売価格 − 手数料（10%）</li>
      </ul>

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

      <h2>梱包材のコストも忘れずに</h2>
      <p>
        手取り計算でよく忘れられるのが梱包材のコストです。
      </p>
      <ul>
        <li>OPP袋（透明袋）：10〜20円程度</li>
        <li>プチプチ（エアキャップ）：10〜30円程度（使用量による）</li>
        <li>段ボール箱：50〜100円程度（ホームセンター調達の場合）</li>
        <li>テープ・紙など：1〜5円程度</li>
      </ul>
      <p>
        100均やスーパーの廃材を活用すればコストを抑えられますが、ある程度の量を出品するなら梱包材を原価として考慮する習慣をつけておくほうが正確な利益計算ができます。
      </p>

      <h2>利益を増やすための実践的なポイント</h2>

      <h3>① 値下げ交渉の余地を価格に含める</h3>
      <p>
        メルカリでは値下げ交渉が頻繁にあります。「この価格から10%引いても利益が出る」という価格設定をしておくと、交渉に応じながらも赤字を避けられます。
      </p>

      <h3>② まとめ売りで送料の負担を分散する</h3>
      <p>
        同じ購入者に複数の商品を同梱できれば、1回の送料で複数の商品を届けられます。「まとめ買い割引あり」と記載しておくと、同じ人に複数買ってもらえることがあります。
      </p>

      <h3>③ 写真・タイトルにこだわる</h3>
      <p>
        検索でヒットするかどうかはタイトルに含まれるキーワードで大きく変わります。ブランド名・型番・カラー・サイズを正確に記載することが重要です。写真は明るい場所で複数枚撮影し、状態がわかるように細部も撮っておくと購入者の安心感につながります。
      </p>

      <h3>④ 売れやすい時間帯・曜日を意識する</h3>
      <p>
        出品後すぐに新着に表示されるため、購入者が多い時間帯（夜20〜23時）に出品すると閲覧数が上がりやすい傾向があります。週末に向けて木〜金に出品するのも一つの戦略です。
      </p>

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
        「不用品の処分」と「転売・副業」の境界線は曖昧な部分もありますが、仕入れを行っている・継続的な販売活動を行っているという実態があれば課税対象と見なされる可能性が高まります。
      </p>

      <h2>正確な利益を事前に計算する</h2>
      <p>
        販売価格・送料・梱包材費を入力して手取り額と利益率を即計算できる当サイトのメルカリ利益計算ツールを使うと、出品前に採算が取れるかどうかを確認できます。赤字出品を防ぐための最低価格の把握にも役立ちます。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">免責事項</strong>
        本記事の送料・手数料は執筆時点の情報に基づきます。変更されている場合がありますので、最新情報はメルカリ公式サイトでご確認ください。税務上の取り扱いについては税理士にご相談ください。
      </div>
    </BlogLayout>
  );
}
