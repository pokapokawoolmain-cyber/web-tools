import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

const post = getBlogPost("resume-photo-size")!;

export const metadata: Metadata = generateMeta({
  title: "証明写真のサイズ一覧【2026年版】履歴書は縦40×横30mm・パスポートとの違い・書類別早見表",
  description: "履歴書の証明写真は縦40mm×横30mm、パスポートは縦45×横35mm。マイナンバー・運転免許証・資格試験など書類別サイズ早見表。スマホで無料作成してコンビニ印刷する方法も解説。",
  path: `/blog/${post.slug}`,
  keywords: [
    "証明写真 サイズ 一覧",
    "履歴書 証明写真 サイズ mm",
    "証明写真 縦40 横30 履歴書",
    "パスポート 証明写真 サイズ 違い",
    "証明写真 スマホ 無料",
    "履歴書 写真 何センチ 2026",
    "証明写真 規格 書類別",
  ],
  type: "article",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "履歴書の証明写真のサイズは何mmですか？",
      acceptedAnswer: { "@type": "Answer", text: "一般的な履歴書の証明写真サイズは縦40mm×横30mmです。就活・転職のエントリーシートもほぼ同じサイズです。ただし企業によって異なる場合があるため、応募先の書類フォーマットを必ず確認してください。" },
    },
    {
      "@type": "Question",
      name: "パスポートと履歴書の証明写真サイズは同じですか？",
      acceptedAnswer: { "@type": "Answer", text: "異なります。パスポートは縦45mm×横35mm、履歴書は縦40mm×横30mmです。5mm違うだけですが、逆に使うと枠に収まらないことがあります。また、パスポートは背景が白・6ヶ月以内など厳格な規定があるため、専用に用意するほうが安全です。" },
    },
    {
      "@type": "Question",
      name: "証明写真は何ヶ月以内に撮ったものを使えばいいですか？",
      acceptedAnswer: { "@type": "Answer", text: "一般的な就職・転職の履歴書では「3ヶ月以内」が目安です。パスポートや運転免許証などの公的書類は「6ヶ月以内」と規定されている場合が多いです。転職活動を始めたタイミングで新しく撮影するのがおすすめです。" },
    },
    {
      "@type": "Question",
      name: "スマホで撮った写真を履歴書に使っていいですか？",
      acceptedAnswer: { "@type": "Answer", text: "使えます。ただし白い背景の前で正面から撮影した上半身写真であることが条件です。自撮りだと顔が斜めになりがちなので、壁に立てかけたスマホを使うかセルフタイマーを活用してください。撮影後はToolBoxの証明写真作成ツールで適切なサイズに加工してコンビニで印刷できます。" },
    },
    {
      "@type": "Question",
      name: "履歴書の写真の貼り方で注意することは何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "写真専用のりまたはスティックのりを使い、四隅をしっかり貼り付けます。テープは厚みが出るためNGです。貼った後は写真の裏面に鉛筆で氏名を記入しておくと、はがれた場合に誰のものかわかります。郵送する場合は写真が折れないよう当て紙を入れてください。" },
    },
  ],
};

export default function Page() {
  return (
    <>
    <JsonLd data={faqSchema} />
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        転職のとき、手元にあった証明写真をそのまま使ったら面接官に「これ、パスポートサイズですよね？」と指摘されたことがありました。縦40mm×横30mmと縦45mm×横35mm——5mmの差ですが、履歴書の枠には収まりません。書類別の正しいサイズを一覧にまとめました。スマホで無料作成できるツールも紹介します。
      </p>

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 このツールで今すぐ解決</p>
        <Link href="/tools/id-photo" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          証明写真作成ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>

      <h2>証明写真の基本サイズ一覧</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">書類の種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">縦×横（mm）</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">注意点</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["履歴書（一般的）", "縦40×横30mm", "3ヶ月以内撮影・カラーが標準"],
              ["就活エントリーシート", "縦40×横30mm", "企業により異なる場合あり"],
              ["パスポート（旅券）", "縦45×横35mm", "背景白、正面向き、6ヶ月以内"],
              ["マイナンバーカード", "縦45×横35mm", "背景白、正面向き、6ヶ月以内"],
              ["運転免許証", "縦30×横24mm", "都道府県公安委員会規定あり"],
              ["在留カード・特別永住者証明書", "縦40×横30mm", "背景白、正面向き"],
              ["国家試験・資格試験", "縦40×横30mm（多数）", "各試験要綱を確認"],
              ["学生証・社員証", "縦30×横25mm（目安）", "機関・会社の指定に従う"],
            ].map(([type, size, note], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{type}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{size}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="my-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
        <p className="text-[14px] text-amber-800 dark:text-amber-300 font-medium">⚠️ 注意: 上記はあくまで一般的な規格です。企業指定の書類や特定の公的手続きでは独自の規定がある場合があります。提出先の案内を必ず確認してください。</p>
      </div>

      <h2>履歴書の証明写真で押さえるべき7つのポイント</h2>
      <ul className="space-y-2">
        <li><strong>サイズ：縦40×横30mm</strong>：一般的な履歴書の証明写真欄のサイズです。枠にぴったり合うように準備しましょう。</li>
        <li><strong>3ヶ月以内に撮影したもの</strong>：古い写真は採用担当者に印象が良くありません。就活・転職活動の開始時に新しく撮影することをおすすめします。</li>
        <li><strong>カラー写真が基本</strong>：特に指定がない限りカラー写真を使用します。白黒を指定する企業は現在ではほぼありません。</li>
        <li><strong>正面・上半身</strong>：顔が正面を向き、胸から上が写っていることが条件です。斜めや横向きは不可です。</li>
        <li><strong>背景は白・薄いグレー・青</strong>：単色の無地背景が標準です。柄物の背景や風景写真は使用できません。</li>
        <li><strong>スーツ着用が基本</strong>：企業向け履歴書はスーツ・ビジネス服装が一般的です。カジュアルな服装は避けましょう。</li>
        <li><strong>裏面に名前を記入する</strong>：はがれた際に誰のものかわかるよう、写真の裏に氏名を鉛筆で記入しておきましょう。</li>
      </ul>

      <h2>証明写真を準備する3つの方法</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">方法</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">費用</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">品質・特徴</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["写真館・フォトスタジオ", "800〜1,200円〜", "プロの照明・レタッチで最高品質。重要な書類に最適。"],
              ["駅・コンビニの証明写真機", "700〜900円", "素早く仕上がる。画質は写真館より劣る場合あり。"],
              ["スマホ＋コンビニ印刷", "30〜40円/枚", "最安値。ToolBoxJPで作成後コンビニで印刷。普段使いに最適。"],
            ].map(([method, cost, quality], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{method}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{cost}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{quality}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 このツールで今すぐ解決</p>
        <Link href="/tools/id-photo" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          証明写真作成ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>

      <h2>スマホで証明写真を作る手順</h2>
      <div className="space-y-5 my-6">
        {[
          { step: "①", title: "証明写真作成ツールを開く", body: "スマホのブラウザでToolBoxJPの証明写真作成ツールを開きます。アプリのインストールは不要です。" },
          { step: "②", title: "写真をアップロードする", body: "「ファイルを選択」から、白背景で正面から撮影した上半身写真を選択します。" },
          { step: "③", title: "書類サイズを選択する", body: "履歴書用（縦40×横30mm）・パスポート用（縦45×横35mm）などから選択します。" },
          { step: "④", title: "トリミングと背景を調整する", body: "顔の位置と大きさが適切になるよう調整します。背景色（白・青・グレー）も選択できます。" },
          { step: "⑤", title: "ダウンロードしてコンビニで印刷する", body: "印刷用データをダウンロードし、ネットプリント等のサービスを通じてコンビニで光沢紙・Lサイズで印刷します。" },
        ].map(({ step, title, body }) => (
          <div key={step} className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">{step}</span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-zinc-100 mb-1">{title}</p>
              <p className="text-[14px] text-slate-600 dark:text-zinc-400">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>証明写真の貼り方・注意点</h2>
      <ul className="space-y-2">
        <li><strong>写真糊またはスティックのりを使用する</strong>：テープは厚みが出るためNG。写真専用糊が最適です。</li>
        <li><strong>枠内にきれいに収める</strong>：写真が傾いていたり、枠からはみ出したりしないようにしましょう。</li>
        <li><strong>はがれないように固定する</strong>：四隅しっかりと貼り、角が浮かないように指で押さえます。</li>
        <li><strong>裏面に氏名を記入する</strong>：はがれた際の識別用に写真の裏面に鉛筆で氏名を記入しましょう。</li>
        <li><strong>折れないように梱包する</strong>：郵送する際は写真に段ボールなどの当て紙を入れて折れないように保護します。</li>
      </ul>

      <h2>デジタル提出（Web応募・メール）の場合の対応</h2>
      <p>
        Web応募やメール送付では、JPG・PNG形式で指定サイズ（ピクセル）の画像ファイルを求められることがほとんどです。
      </p>
      <div className="my-5 p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-[13px] text-slate-600 dark:text-zinc-400">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">💡 デジタル提出の目安</strong>
        多くのWebシステムは200〜500KB程度のJPGを求めます。ピクセルサイズは縦600px×横450px前後が標準的です（縦4：横3の比率）。提出先の仕様を事前に確認してください。ToolBoxJPの証明写真ツールはデジタル提出用のサイズ設定にも対応しています。
      </div>

      <h2>よくある失敗例と対策</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">失敗例</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">原因</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">対策</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["サイズが大きすぎて枠からはみ出す", "縦40×横30mm以外のサイズを使用", "書類の規格を確認し正しいサイズに切り直す"],
              ["写真が白黒・色が薄い", "普通紙で印刷した", "コンビニで光沢紙・カラーで印刷し直す"],
              ["顔が枠の上端・下端に近すぎる", "トリミング位置のミス", "顔が中央より少し上に来るよう調整する"],
              ["背景に柄・人物が映り込む", "撮影環境のミス", "白い壁の前や白いシートを背景に撮り直す"],
              ["古い写真を使った", "3ヶ月以上前の写真使用", "提出前に再撮影して3ヶ月以内の写真を使う"],
            ].map(([fail, cause, solution], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{fail}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{cause}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{solution}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-5 my-6 text-[14px] border border-amber-200 dark:border-amber-800">
        <strong className="text-amber-800 dark:text-amber-300 block mb-2">📝 サイズ間違いを防ぐ一番簡単な方法</strong>
        <p className="text-amber-700 dark:text-amber-400 leading-relaxed">
          証明写真ツールでサイズを選ぶときに「履歴書用（縦40×横30mm）」「パスポート用（縦45×横35mm）」が分かれているので、提出先に合わせて選ぶだけで解決します。自分は転職活動のたびに作り直していますが、コンビニ印刷で40円以下なので使い捨て感覚で新しく作れるのが地味に便利です。3ヶ月以内という制約も気にせずに済みます。
        </p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/id-photo-convenience-store">証明写真をスマホで作ってコンビニ印刷する方法</Link></li>
        <li><Link href="/blog/id-photo-smartphone">スマホで証明写真を作る方法</Link></li>
        <li><Link href="/blog/resume-writing-guide">履歴書の書き方ガイド</Link></li>
        <li><Link href="/blog/id-photo-size-guide">証明写真のサイズ完全ガイド</Link></li>
      </ul>

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 このツールで今すぐ解決</p>
        <Link href="/tools/id-photo" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          証明写真作成ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>
    </BlogLayout>
    </>
  );
}
