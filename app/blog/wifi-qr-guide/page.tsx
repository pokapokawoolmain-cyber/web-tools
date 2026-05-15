import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("wifi-qr-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["WiFi QRコード 作り方", "Wi-Fi パスワード QRコード", "カフェ WiFi QR 作成", "ゲスト WiFi QR 無料", "wifi qr generator"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        来客のたびにWi-Fiパスワードを口頭で伝えたり、紙に書いたりするのは手間がかかります。QRコードを1枚作っておけば、スマホをかざすだけで接続が完了します。
      </p>

      <h2>Wi-Fi QRコードが便利な場面</h2>
      <ul className="space-y-2">
        <li><strong>カフェ・飲食店</strong>：テーブルに置くだけでゲストが自分で接続できる</li>
        <li><strong>オフィス・会議室</strong>：来客・取引先に素早く接続してもらえる</li>
        <li><strong>ゲストハウス・民泊</strong>：チェックイン時の案内資料に印刷して貼り付け</li>
        <li><strong>自宅</strong>：家族・友人が来たときにすぐ接続できる</li>
        <li><strong>イベント・展示会</strong>：参加者がスムーズにネットワークに接続できる</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>Wi-Fi QRコードの作り方</h2>

      <h3>① Wi-Fi QRコード生成ツールにアクセスする</h3>
      <p>
        <Link href="/tools/wifi-qr">Wi-Fi QRコード生成ツール</Link>をブラウザで開きます。
      </p>

      <h3>② Wi-Fi情報を入力する</h3>
      <p>
        以下の情報を入力します。
      </p>
      <ul className="space-y-2">
        <li><strong>SSID（ネットワーク名）</strong>：ルーターや接続画面に表示されているネットワーク名</li>
        <li><strong>パスワード</strong>：Wi-Fiのパスワード（セキュリティキー）</li>
        <li><strong>セキュリティの種類</strong>：WPA2/WPA3（一般家庭・ビジネスはほぼこれ）またはWEP・なし</li>
      </ul>

      <h3>③ QRコードをダウンロードして印刷する</h3>
      <p>
        QRコードが生成されたらPNGまたはSVGでダウンロードします。印刷物に使う場合はSVGが劣化しないためおすすめです。
      </p>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>セキュリティについて</h2>
      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-5 my-4 border border-amber-200 dark:border-amber-800">
        <p className="font-semibold text-amber-800 dark:text-amber-300 mb-2">パスワードの取り扱いに注意</p>
        <p className="text-[14px] text-amber-700 dark:text-amber-400">
          Wi-Fi QRコードにはパスワードが含まれます。誰でも見られる場所（店舗の外壁、SNSへの投稿など）には掲示しないようにしましょう。接続してほしいゲスト向けに限定して見せる使い方が安全です。
        </p>
      </div>

      <h3>セキュリティ種類の選び方</h3>
      <ul className="space-y-2">
        <li><strong>WPA3</strong>：最新のセキュリティ規格。対応ルーターなら最優先で選択</li>
        <li><strong>WPA2</strong>：現在最も普及している規格。ほとんどの機器が対応</li>
        <li><strong>WPA2/WPA3</strong>：どちらかわからない場合はこれを選ぶと互換性が高い</li>
        <li><strong>WEP</strong>：古い規格で脆弱。新規購入のルーターでは使われない</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>QRコードをきれいに印刷するコツ</h2>
      <p>
        読み取りやすいQRコードを印刷するには、以下の点に気をつけましょう。
      </p>
      <ul className="space-y-2">
        <li>最低3cm×3cm以上のサイズで印刷する</li>
        <li>白地に黒（または高コントラストの組み合わせ）を使う</li>
        <li>SVG形式でダウンロードして拡大印刷しても劣化しないようにする</li>
        <li>ラミネート加工で汚れ・湿気から保護する</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>QRコードが読み取れない場合</h2>
      <p>
        スキャンしてもWi-Fiに接続されない場合は以下を確認してください。
      </p>
      <ul className="space-y-2">
        <li>入力したSSID・パスワードが正確か（大文字・小文字・記号に注意）</li>
        <li>選択したセキュリティの種類がルーターの設定と一致しているか</li>
        <li>iPhoneはiOS 11以降、AndroidはAndroid 10以降からカメラアプリでのスキャンに対応している</li>
      </ul>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-6 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-1">関連ツール</strong>
        URLやテキストのQRコードを作りたい場合は<Link href="/tools/qr-generator" className="text-blue-600 dark:text-blue-400 hover:underline">QRコード生成ツール</Link>をご利用ください。
      </div>
    </BlogLayout>
  );
}
