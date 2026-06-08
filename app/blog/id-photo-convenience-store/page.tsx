import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

const post = getBlogPost("id-photo-convenience-store")!;

export const metadata: Metadata = generateMeta({
  title: "証明写真をコンビニで印刷する方法【ローソン・セブン・ファミマ】スマホで30円",
  description: "スマホで証明写真を作ってローソン・セブン・ファミマで30〜40円で印刷する手順を解説。ネットプリントの使い方・光沢紙の選び方・失敗しない設定まで。履歴書・パスポート対応。",
  path: `/blog/${post.slug}`,
  keywords: ["証明写真 コンビニ 印刷 方法", "証明写真 ローソン 印刷 手順", "証明写真 セブン 印刷 やり方", "スマホ 証明写真 コンビニ 安い", "ネットプリント 証明写真 使い方"],
  type: "article",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "コンビニで証明写真を印刷するにはどうすればいいですか？",
      acceptedAnswer: { "@type": "Answer", text: "スマホで証明写真画像を作成し、ネットプリント（ローソン・ファミマはnetprint.jp、セブンはかんたんnetprint）に画像をアップロードして予約番号を取得します。その番号をコンビニのマルチコピー機に入力し、光沢紙・Lサイズ・カラーを選んで印刷すれば完了です。" },
    },
    {
      "@type": "Question",
      name: "ローソンとセブンイレブンどちらが安いですか？",
      acceptedAnswer: { "@type": "Answer", text: "セブンイレブンは富士フイルム製コピー機で20〜40円/枚、ローソン・ファミリーマートはシャープ製で30〜40円/枚が目安です。セブンのほうがわずかに安い場合がありますが、利用するサービス（かんたんnetprintとnetprint.jp）が異なるため、近くのコンビニを選ぶのが現実的です。" },
    },
    {
      "@type": "Question",
      name: "証明写真は光沢紙と普通紙どちらで印刷すればいいですか？",
      acceptedAnswer: { "@type": "Answer", text: "必ず光沢紙を選んでください。普通紙で印刷すると表面がざらざらして写真品質にならず、証明写真として使えないことがあります。コンビニのマルチコピー機では「光沢紙」または「写真用紙」と表示される選択肢を選んでください。" },
    },
    {
      "@type": "Question",
      name: "ネットプリントの有効期限はどのくらいですか？",
      acceptedAnswer: { "@type": "Answer", text: "ネットプリント（netprint.jp）の有効期限は登録から8日間（会員登録なしの場合は1日）です。かんたんnetprint（セブン用）は登録後24時間以内に印刷が必要です。登録したらなるべく早くコンビニで印刷することをおすすめします。" },
    },
    {
      "@type": "Question",
      name: "スマホで自撮りした写真を証明写真に使えますか？",
      acceptedAnswer: { "@type": "Answer", text: "白い壁の前で正面から撮影した写真であれば使えます。ポイントは①背景が白または薄いグレー②正面向き③上半身が写っている④顔に影がかかっていない の4点です。逆光・暗い場所・自撮りアームのない状態だと顔が斜めになりやすいので注意してください。" },
    },
  ],
};

export default function Page() {
  return (
    <>
    <JsonLd data={faqSchema} />
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        転職活動の準備で証明写真を用意しようとしたとき、写真館は1,000円以上かかるし証明写真機も800円前後。「もう少し安く済ませたい」と思って調べたら、スマホで作成してコンビニで印刷すれば1枚30〜40円で済むことがわかりました。実際にやってみたら10分かからず完成。この記事ではその手順を具体的にまとめています。
      </p>

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 このツールで今すぐ解決</p>
        <Link href="/tools/id-photo" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          証明写真作成ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>

      <h2>必要なもの</h2>
      <ul className="space-y-2">
        <li><strong>スマホ（またはPC）</strong>：iPhoneでもAndroidでも対応しています。</li>
        <li><strong>ブラウザ</strong>：Safari・Chrome等の標準ブラウザのみ。アプリは不要です。</li>
        <li><strong>証明写真用の写真</strong>：正面・白背景で撮影した写真（詳しくは後述）。</li>
        <li><strong>コンビニへのアクセス</strong>：ローソン・ファミリーマート・セブンイレブンのいずれかが近くにあること。</li>
        <li><strong>印刷代</strong>：ローソン・ファミマなら約30〜40円、セブンなら約20〜40円が目安です。</li>
      </ul>

      <h2>スマホで証明写真を作る手順</h2>
      <div className="space-y-5 my-6">
        {[
          { step: "①", title: "証明写真作成ツールを開く", body: "スマホのブラウザでToolBoxJPの証明写真作成ツールを開きます。アプリのインストールは不要です。" },
          { step: "②", title: "写真をアップロードする", body: "「ファイルを選択」をタップして、正面から撮影した写真を選択します。カメラロールから選択できます。" },
          { step: "③", title: "書類の種類を選択する", body: "履歴書用（縦40×横30mm）・パスポート用（縦45×横35mm）など、作成したい証明写真のサイズを選択します。" },
          { step: "④", title: "トリミング・背景を調整する", body: "顔が適切な位置に収まるようにトリミングを調整します。背景色（白・青・グレー）も選択できます。" },
          { step: "⑤", title: "印刷用データをダウンロードする", body: "「ダウンロード」ボタンでLサイズ印刷に最適化された画像を保存します。次のステップでコンビニに送信します。" },
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

      <h2>コンビニ別の印刷手順</h2>

      <h3>ローソン・ファミリーマート（ネットプリント使用）</h3>
      <div className="space-y-5 my-6">
        {[
          { step: "①", title: "ネットプリントのWebサービスにアクセスする", body: "スマホのブラウザで「ネットプリント」（netprint.jp）を開きます。会員登録不要の「かんたんnetprint」から利用できます。" },
          { step: "②", title: "写真ファイルをアップロードする", body: "「ファイルを登録する」から証明写真の画像ファイルをアップロードします。8桁の予約番号が発行されます。" },
          { step: "③", title: "コンビニのマルチコピー機へ", body: "ローソン・ファミリーマートのシャープ製マルチコピー機で「ネットプリント」を選択し、発行された予約番号を入力します。" },
          { step: "④", title: "印刷設定を選択する", body: "用紙サイズは「Lサイズ（89×127mm）」、用紙タイプは「光沢紙」を必ず選択してください。カラーで印刷します。" },
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

      <h3>セブンイレブン（セブン-イレブンのマルチコピー使用）</h3>
      <div className="space-y-5 my-6">
        {[
          { step: "①", title: "「かんたんnetprint」アプリまたはWebを使う", body: "セブンイレブンは富士フイルムのコピー機を使用しています。スマホのブラウザで「かんたんnetprint」（スマホ用サービス）にアクセスします。" },
          { step: "②", title: "写真をアップロードして番号を取得", body: "写真をアップロードすると8桁の予約番号が表示されます（有効期限あり）。" },
          { step: "③", title: "セブンのコピー機で「ネットプリント」を選択", body: "セブンイレブンのマルチコピー機のトップ画面で「ネットプリント」を選択し、番号を入力します。" },
          { step: "④", title: "光沢紙・Lサイズで印刷する", body: "用紙はLサイズ・光沢紙を選択し、カラー印刷で完了です。" },
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

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 このツールで今すぐ解決</p>
        <Link href="/tools/id-photo" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          証明写真作成ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・スマホ対応</p>
      </div>

      <h2>コンビニ印刷時の設定</h2>
      <p>
        コンビニのコピー機で証明写真を印刷する際は、必ず以下の設定を選択してください。
      </p>
      <ul className="space-y-2">
        <li><strong>用紙サイズ</strong>：Lサイズ（89×127mm）を選択します。A4などの大きいサイズには不向きです。</li>
        <li><strong>用紙タイプ</strong>：「光沢紙」を必ず選択します。普通紙では写真品質になりません。</li>
        <li><strong>カラー設定</strong>：「カラー」を選択します（白黒指定がある場合を除く）。</li>
        <li><strong>フチなし印刷</strong>：可能であれば「フチなし」を選択します。</li>
      </ul>

      <h2>コンビニ別料金・対応コピー機比較</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">コンビニ</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">対応コピー機</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">光沢紙Lサイズ料金</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">利用サービス</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["ローソン", "シャープ製マルチコピー機", "約30〜40円/枚", "ネットプリント（netprint.jp）"],
              ["ファミリーマート", "シャープ製マルチコピー機", "約30〜40円/枚", "ネットプリント（netprint.jp）"],
              ["セブンイレブン", "富士フイルム製コピー機", "約20〜40円/枚", "かんたんnetprint"],
            ].map(([store, machine, price, service], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{store}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{machine}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{price}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{service}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>証明写真を撮る際のポイント</h2>
      <ul className="space-y-2">
        <li><strong>背景</strong>：白・薄いグレー・青が一般的です。壁の前やカーテン前での撮影が向いています。ツールで背景色を変更できます。</li>
        <li><strong>服装</strong>：スーツが最もフォーマル。採用書類はスーツ着用が推奨です。パスポートや免許証は服装の規定はありません。</li>
        <li><strong>表情</strong>：口を閉じた自然な表情が標準です。口を開けた笑顔はパスポートや免許証では規定外になる場合があります。</li>
        <li><strong>照明</strong>：顔全体に均一に光が当たるよう、窓際や明るい場所で撮影しましょう。影が顔にかからないように注意。</li>
        <li><strong>解像度</strong>：スマホのカメラ設定を最高画質にして撮影すると、印刷時に綺麗に仕上がります。</li>
      </ul>

      <h2>注意点・失敗しやすいポイント</h2>
      <div className="my-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
        <p className="text-[14px] text-amber-800 dark:text-amber-300 font-medium">⚠️ 注意: パスポートは規格が特に厳しく（縦45×横35mm、背景白、正面、6ヶ月以内など）、発行機関での審査があります。パスポート申請には最終的な確認が必要です。</p>
      </div>
      <ul className="space-y-2">
        <li><strong>「普通紙」で印刷してしまう</strong>：普通紙では証明写真として使用できません。必ず光沢紙を選択してください。</li>
        <li><strong>サイズを間違える</strong>：Lサイズ以外（A4など）を選択すると証明写真サイズに合わなくなります。</li>
        <li><strong>ネットプリントの有効期限切れ</strong>：登録した画像には有効期限（数日〜1週間）があります。期限内に印刷してください。</li>
        <li><strong>画像の解像度が低い</strong>：低解像度の写真を使うとぼやけた仕上がりになります。スマホの最高画質で撮影した写真を使いましょう。</li>
      </ul>

      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-5 my-6 text-[14px] border border-amber-200 dark:border-amber-800">
        <strong className="text-amber-800 dark:text-amber-300 block mb-2">📝 実際にやってみた感想</strong>
        <p className="text-amber-700 dark:text-amber-400 leading-relaxed">
          ローソンのネットプリントを使いましたが、スマホからアップロードして予約番号を取得するまで3分。コンビニで番号を入力して光沢紙・Lサイズを選んで印刷、合計38円でした。写真館の1/30以下の値段で仕上がりも十分きれいでした。唯一の注意点は「光沢紙を選び忘れると普通紙になってしまう」こと——最初にそれをやらかして38円を無駄にしました。
        </p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/resume-photo-size">履歴書の証明写真サイズ一覧｜正しいサイズと貼り付け方を徹底解説</Link></li>
        <li><Link href="/blog/id-photo-convenience">証明写真をコンビニで印刷する方法</Link></li>
        <li><Link href="/blog/id-photo-smartphone">スマホで証明写真を作る方法</Link></li>
        <li><Link href="/blog/resume-writing-guide">履歴書の書き方ガイド</Link></li>
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
