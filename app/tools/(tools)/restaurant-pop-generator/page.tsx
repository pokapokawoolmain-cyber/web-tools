import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { RestaurantPopGenerator } from "./RestaurantPopGenerator";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateMeta({
  title: "POP・店内案内文メーカー｜飲食店向け無料作成・印刷対応",
  description: "飲食店向けのPOP・店内案内文を無料で作成できます。本日のおすすめ・期間限定・テイクアウト・営業時間変更・臨時休業・SNSフォロー用QRコード付きPOPに対応。A4・A5・横長・正方形など形を選んでそのまま印刷・PDF保存できます。",
  path: "/tools/restaurant-pop-generator",
  keywords: [
    "飲食店 POP 作成 無料",
    "店内案内文 テンプレート",
    "臨時休業 張り紙",
    "営業時間変更 張り紙",
    "テイクアウト POP",
    "SNSフォロー POP QRコード",
    "メニュー告知 POP",
    "店頭POP 作成",
  ],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "QRコード付きのSNSフォローPOPは作れますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、対応しています。SNSフォロー種類を選ぶと、URLを入力してQRコードを自動生成するか、手持ちのQRコード画像をアップロードしてPOPに貼り付けることができます。キャプションテキストも追加でき、そのまま印刷・PDF保存が可能です。",
      },
    },
    {
      "@type": "Question",
      name: "A4以外のサイズで印刷できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、A4縦・A5縦・横長・正方形・縦長・細長（レシート風）の6種類から選べます。選択した形でプレビューが変わり、印刷時も最適なレイアウトで出力されます。",
      },
    },
    {
      "@type": "Question",
      name: "スマホだけでPOPを作れますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、スマートフォンのブラウザからそのまま使えます。入力・プレビュー・印刷（PDF保存）まで操作でき、アプリのインストールや会員登録は不要です。",
      },
    },
    {
      "@type": "Question",
      name: "作ったPOPは商用利用できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、実店舗での商用利用が前提のツールです。印刷して店舗に掲示する、PDFでデータ保存するといった使い方に制限はありません。",
      },
    },
    {
      "@type": "Question",
      name: "入力内容やQRコード画像はサーバーに送信されますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "送信されません。入力内容はブラウザのローカルストレージにのみ保存され、QRコード画像の生成もブラウザ内で完結します。外部サーバーへのデータ送信は一切行いません。",
      },
    },
    {
      "@type": "Question",
      name: "モノクロ印刷でも使えますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "テーマに「モノクロ」を選ぶと、白黒印刷向けのデザインになります。他のカラーテーマもモノクロプリンターで出力できますが、背景のグラデーションがグレースケールになるため、モノクロテーマの使用をおすすめします。",
      },
    },
    {
      "@type": "Question",
      name: "店頭掲示とテーブルPOPでおすすめサイズは違いますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい。店頭掲示・臨時休業・営業時間変更のお知らせにはA4縦が見やすく、テーブルや卓上には手に取りやすいA5縦・正方形がおすすめです。レジ横・カウンター上には横長サイズが最適です。",
      },
    },
  ],
};

const seoContent = (
  <div className="space-y-10">

    {/* 使い方 */}
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">POP・案内文メーカーの使い方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        POPの種類・サイズ・テーマを選び、タイトルや本文を入力するだけでプレビューがリアルタイムに更新されます。仕上がりを確認してから印刷ボタンを押せばそのまま出力できます。
      </p>
      <div className="rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40 p-4">
        <p className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-2">印刷のコツ</p>
        <ul className="text-sm text-orange-700 dark:text-orange-400 space-y-1">
          <li>・印刷ダイアログで「背景のグラフィック」をオンにすると色が正確に出力されます</li>
          <li>・A5サイズで出したい場合は印刷設定の用紙サイズを変更してください</li>
          <li>・ラミネートフィルムをかけると屋外・厨房近くでも長持ちします</li>
          <li>・印刷後はQRコードをスマホで読み取り、リンク先が正しいか必ず確認してください</li>
        </ul>
      </div>
    </section>

    {/* POPの種類別おすすめ用途 */}
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">POP種類別のおすすめ用途</h2>
      <div className="space-y-2 text-sm">
        {[
          { type: "本日のおすすめ",   icon: "⭐", use: "日替わりランチや特製料理の告知。価格欄に税込金額を入れると注文率が上がります。カウンター・テーブル・入口など複数箇所に置くと効果的。" },
          { type: "新メニュー登場",   icon: "✨", use: "新商品投入時の告知。「NEW」をサブタイトルに使い、写真を別途添えると訴求力が増します。メニュー表の近くに置くのが定番。" },
          { type: "期間限定",         icon: "🎯", use: "終了日を期間欄に明記することが必須。「〜〇月〇日まで」のように具体的な日付を入れると来店意欲が高まります。" },
          { type: "テイクアウト",     icon: "🥡", use: "入口・レジ横に設置。電話番号やオーダー方法を本文に記載すると問い合わせが増えます。テイクアウト専用メニューがある場合は別途QRコードで案内するとスムーズ。" },
          { type: "営業時間変更",     icon: "🕐", use: "変更後の営業時間を期間欄に大きく表示。入口に貼るとクレームを防げます。SNSと合わせて告知するのが効果的。" },
          { type: "臨時休業",         icon: "🔒", use: "A4縦で大きめに印刷し、入口の目線の高さに貼ります。次回営業日を本文または注記に必ず記載してください。" },
          { type: "予約受付中",       icon: "📅", use: "忘年会・歓送迎会シーズン前の告知に。連絡先・定員・コース例を本文に入れると問い合わせにつながりやすいです。" },
          { type: "お支払い方法",     icon: "💳", use: "レジ横に常時設置する案内に最適。対応しているQRコード決済ブランドを具体的に書くと会計がスムーズになります。" },
          { type: "イベント",         icon: "🎉", use: "開催日時・内容・参加費を期間欄と本文に記載。店内掲示と合わせてSNS告知も行うと集客効果が高まります。" },
          { type: "SNSフォロー",      icon: "📱", use: "QRコードを大きめ（25mm以上）に印刷し、読み取りやすい位置に設置します。フォローのメリット（特典・クーポン情報など）を本文に書くと反応率が上がります。" },
        ].map(({ type, icon, use }) => (
          <div key={type} className="flex gap-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-3.5">
            <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-zinc-200 text-xs mb-0.5">{type}</p>
              <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">{use}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* 読まれやすいPOPを作るコツ */}
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">読まれやすいPOPを作る7つのコツ</h2>
      <div className="space-y-3 text-sm">
        {[
          { no: "1", tip: "タイトルは短く、具体的に",      body: "「本日のおすすめ」より「とろとろ煮込みハンバーグ 本日限定」のほうが目を引きます。何のPOPかを1秒で伝えることを意識してください。" },
          { no: "2", tip: "価格・期間・数量は大きく",      body: "「¥980（税込）」「〜6月30日まで」「残り10食」など数字が入ると読み手の行動を促しやすくなります。" },
          { no: "3", tip: "文字を詰め込みすぎない",        body: "一枚のPOPに盛り込む情報は3〜4項目が限界。本文が長くなるときは要点のみ書き、詳細はスタッフへ・QRコードへ誘導しましょう。" },
          { no: "4", tip: "設置場所でサイズを変える",      body: "店頭・入口にはA4縦、テーブル・卓上にはA5縦か正方形、レジ横には横長が最適です。このツールでサイズを切り替えてそれぞれ印刷できます。" },
          { no: "5", tip: "QRコードは大きく、余白を十分に", body: "印刷後のQRコードは最低25mm四方を目安に。スマホカメラで読み取れるか実際に確認してから掲示してください。" },
          { no: "6", tip: "スマホからも見やすいかを確認",  body: "お客様がスマホで遠目に見ることを想定し、タイトルと価格は特に大きく・はっきりと。縦長や正方形のPOPはSNS投稿にも流用しやすい比率です。" },
          { no: "7", tip: "古いPOPは早めに差し替える",    body: "期間が終わったPOPを貼り続けるのは信頼性低下につながります。期限つきのPOPは作成時に終了日を記入し、当日に取り外すリマインダーを設定しておきましょう。" },
        ].map(({ no, tip, body }) => (
          <div key={no} className="flex gap-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-xs font-bold flex items-center justify-center">{no}</span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-0.5">{tip}</p>
              <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* SNSフォローPOP活用ガイド */}
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">SNSフォローPOPの活用方法</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        QRコード付きのSNSフォローPOPはフォロワー増加に直結します。設置場所と文言を工夫するだけで効果が大きく変わります。
      </p>
      <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
        {[
          { platform: "Instagram",                 use: "料理・店内の写真投稿を告知。「新メニューを毎週公開中」など更新頻度を伝えるとフォロー率アップ。" },
          { platform: "LINE公式アカウント",         use: "クーポン・予約受付に最適。「友達追加で10%OFF」など特典を明示すると反応が高い。" },
          { platform: "X（旧Twitter）",            use: "本日の仕込み・混雑状況をリアルタイム投稿。「今日の特別メニューはXで先出し」と伝えると効果的。" },
          { platform: "Googleビジネスプロフィール", use: "「口コミを書いてください」と誘導。レビュー数が増えると検索表示順位に好影響。" },
        ].map(({ platform, use }) => (
          <div key={platform} className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-3.5">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 text-xs mb-1">{platform}</p>
            <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">{use}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 p-4">
        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">フォロー後のメリットを必ず明記する</p>
        <p className="text-sm text-blue-700 dark:text-blue-400">「フォローして何がもらえるのか」「どんな情報が届くのか」が伝わらないとQRを読んでもらえません。「フォロワー限定クーポン」「臨時休業を先行お知らせ」など具体的な価値を本文か注記に入れてください。</p>
      </div>
    </section>

    {/* 印刷・掲示の注意点 */}
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">印刷・掲示時の注意点</h2>
      <div className="space-y-2 text-sm">
        {[
          { title: "背景グラフィックを必ずオンに", body: "カラーテーマを使用している場合、ブラウザの印刷ダイアログで「背景のグラフィック」または「背景色と背景画像」をオンにしないと、白紙で出力されます。" },
          { title: "ラミネートで耐久性アップ",     body: "100円ショップのラミネートフィルムやセルフラミネートシートを使うと、水や油汚れに強くなり長期間使用できます。入口・レジ横など触れる機会が多い場所に特におすすめ。" },
          { title: "貼る場所と高さを意識する",     body: "目線の高さ（立っている人の視線：床から150cm前後）に設置すると読まれやすいです。テーブルPOPはA5や正方形を卓上スタンドに入れると安定します。" },
          { title: "光の反射に注意",               body: "ガラス扉や照明の真下に貼ると光が反射して読みにくくなります。特に光沢紙に印刷した場合は設置角度を工夫してください。" },
          { title: "QRコードの読み取り確認",       body: "掲示前に必ず複数のスマホで読み取りテストをしてください。印刷が小さすぎる・コントラストが低いと読めないことがあります。最低25mm四方を目安にしてください。" },
        ].map(({ title, body }) => (
          <div key={title} className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-3.5">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 text-xs mb-0.5">{title}</p>
            <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </section>

    {/* よくある失敗例 */}
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある失敗例と対策</h2>
      <div className="space-y-2 text-sm">
        {[
          { fail: "情報が多すぎて誰も読まない",         fix: "1枚のPOPに1メッセージ。詳細はスタッフへ・QRコードへ誘導する形にしましょう。" },
          { fail: "QRコードが小さすぎて読めない",       fix: "印刷後のQRは25mm以上を確保。正方形・A4縦サイズを選ぶと大きく印刷しやすいです。" },
          { fail: "色が薄くて印刷でほぼ見えない",       fix: "「背景のグラフィック」をオンにして印刷。印刷コストが気になる場合はモノクロテーマを選んでください。" },
          { fail: "期間が終わったPOPを出しっぱなし",   fix: "期間限定・臨時休業POPは作成時に終了日をカレンダーに登録し、取り外しのリマインダーをセットしておきましょう。" },
          { fail: "店名や装飾ばかり目立って肝心の内容が伝わらない", fix: "タイトルを一番大きく・太く設定し、何のPOPかを1秒で伝えることを最優先にしてください。" },
          { fail: "SNS案内があるがフォローしてもらえない", fix: "フォロー後の特典・受け取れる情報を具体的に書きましょう。「フォロワー限定10%OFFクーポン」など明確な価値提示が必要です。" },
        ].map(({ fail, fix }) => (
          <div key={fail} className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-3.5">
            <p className="text-xs text-red-500 dark:text-red-400 font-semibold mb-0.5">✗ {fail}</p>
            <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">→ {fix}</p>
          </div>
        ))}
      </div>
    </section>

    {/* FAQ */}
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3 text-sm">
        {[
          { q: "QRコード画像はアップロードできますか？", a: "はい。SNSフォロー種類を選択するとQRコード入稿欄が表示され、PNG・JPG・WebP・SVGをアップロードできます。URLを入力してQRコードを自動生成することも可能です。" },
          { q: "作ったPOPは商用利用できますか？", a: "はい。実店舗での商用利用を前提に提供しているツールです。印刷・PDF保存・店頭掲示に制限はありません。" },
          { q: "スマホだけでPOPを作れますか？", a: "はい。スマートフォンのブラウザからそのまま操作できます。アプリや会員登録は不要です。" },
          { q: "作成した内容はどこかに保存されますか？", a: "入力内容はブラウザのローカルストレージに自動保存されます。ただしQRコードのアップロード画像はページ再読み込み後に再選択が必要です。重要なPOPはPDF保存しておくことをお勧めします。" },
          { q: "横長のPOPは作れますか？", a: "はい。サイズ選択から「横長」を選ぶとA4横比率のプレビューに切り替わります。印刷時は用紙設定を横向きにしてください。" },
          { q: "モノクロ印刷でも使えますか？", a: "はい。テーマで「モノクロ」を選ぶと白黒印刷に最適化されたデザインになります。カラーテーマをモノクロプリンターで出力することも可能ですが、背景がグレーになる場合があります。" },
          { q: "複数の種類のPOPをまとめて作れますか？", a: "はい。POPの種類を切り替えるたびに内容が自動保存されます。それぞれ入力した後、種類を切り替えながら順番に印刷・PDF保存してください。" },
        ].map(({ q, a }) => (
          <div key={q} className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. {q}</p>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">A. {a}</p>
          </div>
        ))}
      </div>
    </section>

  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="POP・店内案内文メーカー"
        description="本日のおすすめ・期間限定・テイクアウト・臨時休業・SNSフォロー用QRコード付きPOPなど10種類。A4・A5・横長・正方形・縦長から形を選んで印刷・PDF保存。"
        icon="📢"
        slug="restaurant-pop-generator"
        seoContent={seoContent}
      >
        <RestaurantPopGenerator />
      </ToolLayout>
    </>
  );
}
