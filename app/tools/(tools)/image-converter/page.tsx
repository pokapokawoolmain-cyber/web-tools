import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { ImageConverter } from "./ImageConverter";

export const metadata: Metadata = generateMeta({
  title: "画像一括変換｜JPG・PNG・WebP・AVIFをまとめて変換【無料・ブラウザ完結】",
  description:
    "JPG・PNG・WebP・AVIFなどの画像をブラウザ内で安全に一括変換。20枚以上にも対応し、変換前後のサイズ比較、用途別プリセット、ZIP一括ダウンロードまで無料で使えます。ファイルはサーバーに送信されません。スマホ対応・登録不要。",
  path: "/tools/image-converter",
  keywords: [
    "画像変換", "画像 一括変換", "jpg png 変換", "png jpg 変換", "webp jpg 変換",
    "jpg webp 変換", "avif jpg 変換", "画像 webp 変換", "画像 まとめて変換",
    "画像 軽量化", "登録不要 画像変換", "無料 画像変換", "スマホ 画像変換",
    "ブラウザ 画像変換", "サーバーにアップロードしない 画像変換",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "画像一括変換", icon: "🖼️", desc: "JPG・PNG・WebP・AVIFをまとめて変換" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "画像はサーバーにアップロードされますか？", acceptedAnswer: { "@type": "Answer", text: "いいえ。変換はすべてお使いのブラウザ内（端末上）で行われ、画像ファイルが外部サーバーに送信されることは一切ありません。ページを閉じるとデータは破棄されます。社外に出せない資料や個人の写真も安心して変換できます。" } },
    { "@type": "Question", name: "スマホでも画像変換できますか？", acceptedAnswer: { "@type": "Answer", text: "はい。iPhone・Androidのブラウザからカメラロールの写真を選んで変換できます。スマホは端末性能に合わせて同時処理数を抑えて動作します。多数の画像を扱うときは20〜30枚ずつを目安にすると安定します。" } },
    { "@type": "Question", name: "20枚以上まとめて変換できますか？", acceptedAnswer: { "@type": "Answer", text: "できます。本ツールは順番待ちのキュー方式で、同時に2〜3枚ずつ処理するため、20枚以上でも画面が固まりません。全体の進捗と1枚ごとの状態が表示され、一時停止・再開・失敗分のみ再試行もできます。変換後はZIPでまとめてダウンロードできます。" } },
    { "@type": "Question", name: "JPGとPNGはどちらが軽いですか？", acceptedAnswer: { "@type": "Answer", text: "写真のような色数の多い画像はJPGの方が大幅に軽くなります。PNGはロゴ・アイコン・スクリーンショットなど色数が少なく、背景の透過が必要な画像に向いています。写真をPNGにするとかえってファイルが重くなることが多い点に注意してください。" } },
    { "@type": "Question", name: "WebPとは何ですか？", acceptedAnswer: { "@type": "Answer", text: "Googleが開発した画像形式で、JPGやPNGより同じ画質で2〜3割ほど軽くできるのが特徴です。透過にも対応し、Webサイトの表示速度改善に広く使われています。主要な最新ブラウザで表示できます。" } },
    { "@type": "Question", name: "AVIFとは何ですか？", acceptedAnswer: { "@type": "Answer", text: "WebPよりさらに高い圧縮率を持つ新しい画像形式です。同じ画質でより軽くできますが、対応環境がWebPよりやや限られます。お使いのブラウザがAVIF出力に対応していない場合、本ツールでは選択できないようになっています。" } },
    { "@type": "Question", name: "背景透過を残すにはどの形式がいいですか？", acceptedAnswer: { "@type": "Answer", text: "PNG・WebP・AVIFのいずれかを選び、詳細設定で「透過を保持する」を有効にしてください。JPGは透過に対応していないため、透過部分は背景色（初期は白）で塗りつぶされます。ロゴやアイコンはPNGまたはWebPがおすすめです。" } },
    { "@type": "Question", name: "画質を落とさずに変換できますか？", acceptedAnswer: { "@type": "Answer", text: "はい。PNGは可逆（画質劣化なし）で変換できます。JPG・WebP・AVIFは品質を高め（90以上）に設定すれば見た目の劣化をほぼ抑えられます。「高画質優先」プリセットも用意しています。ただしファイルサイズは大きくなります。" } },
    { "@type": "Question", name: "変換後に画像がぼやけるのはなぜですか？", acceptedAnswer: { "@type": "Answer", text: "リサイズで元より小さくした場合や、品質を低く設定した場合に起こります。ぼやける場合は、リサイズの幅・高さを大きく（または0で無制限）にし、品質を上げてお試しください。元画像より拡大すると必ず画質が落ちます。" } },
    { "@type": "Question", name: "WebPやAVIFが開けない時はどうすればいいですか？", acceptedAnswer: { "@type": "Answer", text: "古いブラウザやソフトはWebP・AVIFに対応していないことがあります。その場合は出力形式を「JPG」または「PNG」にして変換し直すと、ほとんどの環境で開けます。互換性を優先したいときは「互換性優先」プリセットが便利です。" } },
    { "@type": "Question", name: "一括変換した画像をまとめて保存できますか？", acceptedAnswer: { "@type": "Answer", text: "はい。変換が完了すると「ZIPでまとめてダウンロード」ボタンが表示され、変換したすべての画像を1つのZIPファイルで保存できます。1枚ずつ個別にダウンロードすることもできます。" } },
    { "@type": "Question", name: "HEIC画像は変換できますか？", acceptedAnswer: { "@type": "Answer", text: "このツールではHEIC/HEIF形式は扱えません。iPhoneのHEIC写真は、専用の「HEIC→JPG変換」ツールをご利用ください。HEICファイルを追加すると、その旨とリンクを表示します。" } },
    { "@type": "Question", name: "画像圧縮と画像変換は何が違いますか？", acceptedAnswer: { "@type": "Answer", text: "画像変換は形式（JPG↔PNG↔WebPなど）を変えることが主目的で、あわせてサイズも調整できます。画像圧縮は形式は変えずにファイルを軽くすることが目的です。とにかく軽くしたいだけなら圧縮ツール、形式もそろえたいなら本ツールが向いています。" } },
  ],
};

const seoContent = (
  <div className="space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">画像一括変換ツールとは</h2>
      <p>
        JPG・PNG・WebP・AVIFなどの画像を、<strong>ブラウザ内だけで安全に一括変換</strong>できる無料ツールです。
        ファイルはサーバーに送信されず、すべてお使いの端末上で処理されます。20枚以上の写真もキュー方式で快適に変換でき、
        用途別プリセット・変換前後のサイズ比較・ZIP一括ダウンロードまで対応。「形式をそろえたい」「Web用に軽くしたい」「SNSに合わせたい」を一度で解決します。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">JPG・PNG・WebP・AVIFの違いと選び方</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">形式</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">得意</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">透過</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">向いている用途</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["JPG", "写真の軽量化", "×", "写真・SNS・LINE・印刷。互換性が高い"],
              ["PNG", "劣化なし・透過", "○", "ロゴ・アイコン・図・スクリーンショット"],
              ["WebP", "軽さと画質の両立", "○", "Webサイト・ブログ。表示速度重視"],
              ["AVIF", "最も高い圧縮率", "○", "最新Web。より軽くしたいとき"],
            ].map(([f, good, alpha, use], i) => (
              <tr key={f as string} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-mono font-semibold text-blue-600 dark:text-blue-400">{f}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{good}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-center">{alpha}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[13px]">
        迷ったら、<strong>Web・ブログはWebP</strong>、<strong>写真・SNS・LINEはJPG</strong>、<strong>透過が必要ならPNG</strong>を選べば大きく外しません。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">用途別・おすすめの形式</h2>
      <ul className="space-y-1.5">
        <li>・<strong>Webサイト・ブログ：</strong>WebP（横幅1200〜1600px・品質80）。表示速度が上がりSEOにも有利です。</li>
        <li>・<strong>SNS投稿：</strong>JPGまたはWebP。長辺1440px程度に縮めるとアップロードが速くなります。</li>
        <li>・<strong>LINE送信：</strong>JPGで品質70前後。かなり軽くなり、送信が快適です。</li>
        <li>・<strong>EC商品画像：</strong>JPGまたはWebPで1000px前後。白背景の商品はJPGでも十分きれいです。</li>
        <li>・<strong>印刷：</strong>JPG（品質95）またはPNG。リサイズは控えめにして高画質を保ちます。</li>
        <li>・<strong>ロゴ・アイコン（透過）：</strong>PNGまたはWebPで「透過を保持」。JPGは背景が白く塗られます。</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">画質とファイルサイズの関係</h2>
      <p>
        JPG・WebP・AVIFは「品質」の数値でファイルサイズが大きく変わります。品質を下げるほど軽くなりますが、下げすぎると輪郭がぼやけたり、
        色の境目にノイズ（ブロックノイズ）が出ます。<strong>写真は品質75〜85</strong>あたりが軽さと見た目のバランスの良い目安です。
        一方PNGは「可逆圧縮」で画質は劣化しませんが、写真では非常に重くなるため、写真の軽量化にはJPGかWebPが適しています。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">20枚以上を一括変換するときの注意</h2>
      <ul className="space-y-1.5">
        <li>・本ツールは同時に2〜3枚ずつ処理するため、多数でも画面が固まりません。</li>
        <li>・スマホは端末の性能差が大きいため、まずは20〜30枚を目安にすると安定します。</li>
        <li>・1枚が非常に大きい画像（数千万画素・25MB超）は時間がかかります。リサイズで最大幅を指定すると速く・軽くなります。</li>
        <li>・処理済みの画像はメモリを圧迫しないよう自動で解放しています。うまくいかない時はページを再読み込みして枚数を分けてください。</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">大きい画像を軽くするコツ</h2>
      <p>
        「軽くならない」ときは、形式だけでなく<strong>寸法（ピクセル数）を小さく</strong>するのが最も効果的です。
        たとえばスマホの写真は4000px以上あることが多く、Web用なら1200〜1600pxで十分です。最大の横幅を指定してリサイズし、
        形式をWebP、品質を80前後にすると、多くの場合ファイルサイズが数分の一になります。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">ブラウザ内変換のメリット</h2>
      <ul className="space-y-1.5">
        <li>・<strong>安心：</strong>画像がサーバーに送られないため、個人情報や社外秘の資料も安全です。</li>
        <li>・<strong>速い：</strong>アップロード・ダウンロードの待ち時間がなく、その場で変換できます。</li>
        <li>・<strong>プライバシー：</strong>変換時に位置情報などのEXIFも自動で削除されます。</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">変換できない・開けないときは</h2>
      <ul className="space-y-1.5">
        <li>・<strong>AVIF/WebPが選べない：</strong>お使いのブラウザが出力に対応していません。JPGかPNGをお使いください。</li>
        <li>・<strong>変換した画像が開けない：</strong>相手の環境が新しい形式に非対応の可能性。JPG/PNGで変換し直すと確実です。</li>
        <li>・<strong>HEICが追加できない：</strong>iPhoneのHEICは
          <Link href="/tools/heic-to-jpg" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">HEIC→JPG変換</Link>
          をご利用ください。</li>
        <li>・<strong>読み込みに失敗する：</strong>ファイルが壊れている、または非対応形式の可能性があります。</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">画像圧縮と画像変換の違い</h2>
      <p>
        <strong>画像変換</strong>は形式（JPG↔PNG↔WebPなど）を変えるのが主目的で、あわせてサイズ調整もできます。
        <strong>画像圧縮</strong>は形式を変えずにファイルを軽くするのが目的です。とにかく軽くしたいだけなら
        <Link href="/tools/image-compress" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">画像圧縮</Link>、
        形式もそろえたいなら本ツールが向いています。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">関連ツール</h2>
      <ul className="space-y-1.5">
        <li>・ファイルを軽くする <Link href="/tools/image-compress" className="text-blue-600 dark:text-blue-400 hover:underline">画像圧縮</Link></li>
        <li>・iPhoneのHEICを変換 <Link href="/tools/heic-to-jpg" className="text-blue-600 dark:text-blue-400 hover:underline">HEIC→JPG変換</Link></li>
        <li>・サイズ・比率を変える <Link href="/tools/image-resize" className="text-blue-600 dark:text-blue-400 hover:underline">画像リサイズ</Link>／<Link href="/tools/aspect-ratio" className="text-blue-600 dark:text-blue-400 hover:underline">アスペクト比計算</Link></li>
        <li>・画像をまとめてPDFに <Link href="/tools/jpg-to-pdf" className="text-blue-600 dark:text-blue-400 hover:underline">JPG→PDF変換</Link>／PDFを画像に <Link href="/tools/pdf-to-jpg" className="text-blue-600 dark:text-blue-400 hover:underline">PDF→JPG変換</Link></li>
        <li>・アイコンを作る <Link href="/tools/favicon-generator" className="text-blue-600 dark:text-blue-400 hover:underline">ファビコン作成</Link></li>
      </ul>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="画像一括変換"
        description="JPG・PNG・WebP・AVIFをブラウザ内で一括変換。20枚以上対応・用途別プリセット・変換前後比較・ZIP一括DL。ファイルは外部に送信されません。"
        icon="🖼️"
        slug="image-converter"
        seoContent={seoContent}
      >
        <ImageConverter />
      </ToolLayout>
    </>
  );
}
