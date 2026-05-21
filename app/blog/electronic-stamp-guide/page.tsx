import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("electronic-stamp-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: [
    "電子印鑑 作成",
    "電子印鑑 無料",
    "PDF 印鑑 押印",
    "デジタル印鑑",
    "印鑑 PNG 透過",
    "電子はんこ 無料",
    "PDF 印鑑 追加",
  ],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>

      {/* ─── リード文 ─────────────────────────────── */}
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        「電子印鑑を使いたいけど、無料で安全に作る方法がわからない」「PDFに印鑑を押したいだけなのに、高額ソフトが必要なの？」——そんな疑問をお持ちの方に向けて、電子印鑑の基礎から作成・PDF押印の手順まで徹底解説します。ブラウザだけで完結し、スマホでも使えます。
      </p>

      {/* ─── 1. 電子印鑑とは ─────────────────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>電子印鑑とは？</h2>
      <p>
        電子印鑑（デジタル印鑑・電子はんこ）とは、<strong>デジタル文書に押印できる印鑑の画像データ</strong>のことです。日本の慣習上、契約書・請求書・領収書・業務委託書など多くの書類に押印が求められますが、ペーパーレス化・テレワーク普及に伴い、物理的なハンコの代わりとして電子印鑑の活用が広まっています。
      </p>
      <p>
        電子印鑑は主にPNG形式（透過背景）で作成され、PDFや画像ファイルに直接貼り付けて使います。
      </p>

      <h3>電子印鑑でできること</h3>
      <ul className="space-y-2">
        <li><strong>PDF書類への押印</strong>：請求書・契約書・領収書・見積書などにデジタルで押印</li>
        <li><strong>複数書類への使い回し</strong>：一度作れば何度でも使用可能</li>
        <li><strong>遠隔からの押印</strong>：出社せずメール添付PDFへ押印して返送</li>
        <li><strong>透過PNG保存</strong>：Wordや画像ファイルにも自然に貼り付け可能</li>
      </ul>

      {/* ─── 2. 実印・認印・電子署名との違い ───────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>実印・認印・電子署名との違い</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">法的効力</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">主な用途</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">コスト</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["実印（物理）", "高い（印鑑証明書と組み合わせ）", "不動産・会社設立・重要契約", "数千〜数万円"],
              ["認印（物理）", "慣習的な効力", "日常の受け取り・承認", "数百円〜"],
              ["認定電子署名", "電子署名法に基づく高い効力", "重要な電子契約", "サービス契約費用"],
              ["電子印鑑（画像）", "慣習的な効力（画像貼り付け）", "請求書・社内書類・見積書", "無料で作成可能"],
            ].map(([type, effect, use, cost], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{type}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{effect}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{use}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-5 my-4">
        <p className="text-[14px] text-amber-800 dark:text-amber-300 leading-relaxed">
          <strong>⚠️ 注意：</strong>電子印鑑（画像）は「認定電子署名」ではありません。法的効力が必要な重要契約（不動産取引・会社設立など）にはクラウドサインなどの認定電子署名サービスをお使いください。社内書類・見積書・請求書などの慣習的押印には電子印鑑で十分です。
        </p>
      </div>

      {/* ─── 3. 無料で作成する方法 ──────────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>電子印鑑を無料で作成する方法</h2>
      <p>
        <Link href="/tools/hanko-generator">電子印鑑メーカー</Link>を使えば、登録もアプリのインストールも不要で、ブラウザだけで電子印鑑を作成できます。
      </p>

      <h3>① 電子印鑑メーカーにアクセス</h3>
      <p>
        <Link href="/tools/hanko-generator">電子印鑑メーカー</Link>を開きます。スマホ・タブレット・PCどこからでもアクセスできます。
      </p>

      <h3>② 印鑑の種類を選択</h3>
      <p>
        以下の3種類から選べます。
      </p>
      <ul className="space-y-2">
        <li><strong>丸印（実印風）</strong>：外枠＋縦書き文字。個人の署名用に最適</li>
        <li><strong>角印（会社印風）</strong>：正方形枠＋テキスト。企業・屋号での押印に</li>
        <li><strong>縦書き丸印</strong>：縦書きで名前を入れたシンプルな丸印</li>
      </ul>

      <h3>③ テキストを入力して外観をカスタマイズ</h3>
      <p>
        名前・屋号・会社名を入力し、色（朱色・紺・黒など）・フォント・サイズをプレビューを見ながら調整します。
      </p>

      <h3>④ PNGで保存またはPDFツール用に保存</h3>
      <p>
        「PNG保存」ボタンで透過PNG画像として端末に保存できます。また「PDFツールで使うために保存」ボタンを押すと、<Link href="/tools/pdf-signature">PDF電子署名ツール</Link>の印鑑モードに自動的に読み込まれ、PDF押印がスムーズに行えます。
      </p>

      {/* ─── 4. PDFへの押印方法 ──────────────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>作成した電子印鑑をPDFに押印する方法</h2>
      <p>
        電子印鑑を作成したら、<Link href="/tools/pdf-signature">PDF電子署名ツール</Link>でPDFに直接押印できます。
      </p>

      <h3>手順1：PDFをアップロード</h3>
      <p>
        PDF電子署名ツールを開き、押印したいPDFをドラッグ＆ドロップまたはファイル選択でアップロードします。
      </p>

      <h3>手順2：「🔴 印鑑」モードを選択</h3>
      <p>
        操作パネルの「🔴 印鑑」タブをクリックすると、保存済み電子印鑑の一覧が表示されます。電子印鑑メーカーで「PDFツールで使うために保存」した印鑑はここに自動的に表示されます。
      </p>

      <h3>手順3：印鑑をクリックしてPDFに配置</h3>
      <p>
        印鑑のサムネイルをクリックすると、PDFプレビュー上の中央付近に自動配置されます。あとはドラッグで押印したい位置に移動し、コーナーのハンドルでサイズを調整します。
      </p>

      <h3>手順4：位置・サイズ・透明度を調整</h3>
      <ul className="space-y-2">
        <li><strong>位置調整</strong>：ドラッグで好きな場所へ移動</li>
        <li><strong>サイズ変更</strong>：右下のハンドルをドラッグ（アスペクト比固定）</li>
        <li><strong>回転</strong>：選択パネルのスライダーで±180°</li>
        <li><strong>透明度</strong>：「濃さ」スライダーで薄くすることも可能</li>
      </ul>

      <h3>手順5：「署名済みPDFを保存」でダウンロード</h3>
      <p>
        「✓ 署名済みPDFを保存」ボタンを押すと、印鑑が埋め込まれたPDFがダウンロードされます。すべての処理はブラウザ内で完結するため、PDFが外部サーバーに送信されることはありません。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-xl p-5 my-6">
        <p className="text-[14px] font-semibold text-blue-700 dark:text-blue-300 mb-2">📋 PDF押印ツールを試す</p>
        <p className="text-[13px] text-blue-600 dark:text-blue-400 mb-3">
          アップロードしたPDFはサーバーに一切送信されません。機密書類も安心してご利用いただけます。
        </p>
        <Link
          href="/tools/pdf-signature"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[13px] font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          PDF電子署名ツールを開く →
        </Link>
      </div>

      {/* ─── 5. PNG保存の使い方 ─────────────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>電子印鑑PNGの活用方法</h2>
      <p>
        電子印鑑メーカーから透過PNGで保存したファイルは、PDF以外にも幅広く活用できます。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">用途</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">使い方</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["WordやExcelへの貼り付け", "挿入→画像から選択。透過なので背景に自然に馴染む"],
              ["請求書・領収書ツール", "ToolBoxJPの請求書・領収書ツールから保存済み印鑑を選択"],
              ["メール内文書への押印", "PDF化した書類に押印してメール添付"],
              ["Canvaなどのデザインツール", "透過PNGをアップロードして名刺・提案書に使用"],
            ].map(([use, how], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{use}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{how}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── 6. 請求書・領収書との連携 ─────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>請求書・領収書への印鑑押印</h2>
      <p>
        ToolBoxJPでは<Link href="/tools/invoice-generator">請求書作成ツール</Link>と<Link href="/tools/receipt-generator">領収書作成ツール</Link>も提供しています。電子印鑑メーカーで「PDFツールで使うために保存」した印鑑は、これらのツールでも利用できます。
      </p>
      <ul className="space-y-2">
        <li>請求書作成ツールの「印鑑設定」から保存済み印鑑を選択</li>
        <li>プレビュー上にリアルタイムで印鑑が表示</li>
        <li>印刷・PDF保存時に印鑑も含まれた状態で出力</li>
      </ul>

      {/* ─── 7. スマホでの操作 ─────────────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>スマホ（iPhone・Android）での電子印鑑作成</h2>
      <p>
        電子印鑑メーカーはスマホのブラウザから完全に動作します。特別な操作は不要で、PCと同じように名前を入力してスタイルを選ぶだけです。
      </p>
      <ul className="space-y-2">
        <li><strong>iPhone Safari</strong>：標準ブラウザで動作確認済み</li>
        <li><strong>Android Chrome</strong>：標準ブラウザで動作確認済み</li>
        <li><strong>アプリ不要</strong>：ブラウザのみで完結</li>
        <li><strong>通信量</strong>：処理はブラウザ内完結のため最小限</li>
      </ul>

      {/* ─── 8. 安全性 ─────────────────────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>安全性・プライバシーについて</h2>
      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-4 text-[13px] text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
        <strong className="text-slate-700 dark:text-zinc-300 block mb-2">🔒 すべての処理はブラウザ内で完結</strong>
        <ul className="space-y-1">
          <li>• 印鑑データはサーバーに送信されません</li>
          <li>• 印鑑はお使いのデバイスのLocalStorageにのみ保存</li>
          <li>• PDFファイルも外部に送信されません</li>
          <li>• 会員登録・ログイン不要</li>
        </ul>
      </div>

      {/* ─── 関連ツール ─────────────────────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連ツール</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {[
          { href: "/tools/hanko-generator", emoji: "🔴", title: "電子印鑑メーカー", desc: "丸印・角印・縦書き対応。透過PNG保存" },
          { href: "/tools/pdf-signature", emoji: "✍️", title: "PDF電子署名ツール", desc: "PDFに印鑑・署名・テキストを追加して保存" },
          { href: "/tools/invoice-generator", emoji: "🧾", title: "請求書作成ツール", desc: "インボイス対応・電子印鑑押印付き" },
          { href: "/tools/pdf-compress", emoji: "📦", title: "PDF圧縮ツール", desc: "押印後のPDFを軽量化してメール送信" },
        ].map(({ href, emoji, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
          >
            <span className="text-2xl">{emoji}</span>
            <div>
              <p className="font-semibold text-[14px] text-slate-800 dark:text-zinc-200">{title}</p>
              <p className="text-[12px] text-slate-500 dark:text-zinc-400 mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ─── 関連記事 ───────────────────────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/invoice-receipt-pdf-guide">請求書・領収書を無料でPDF作成する方法｜インボイス制度にも対応</Link></li>
        <li><Link href="/blog/business-contract-nda-guide">業務委託契約書・NDAを無料テンプレートで作成する方法</Link></li>
        <li><Link href="/blog/pdf-compress-guide">PDFを無料で圧縮する方法</Link></li>
        <li><Link href="/blog/pdf-merge-guide">PDFを無料で結合する方法</Link></li>
      </ul>

      {/* ─── まとめCTA ──────────────────────────── */}
      <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20 border border-red-100 dark:border-red-900/50">
        <p className="text-[14px] font-semibold text-red-700 dark:text-red-400 mb-1">🔴 電子印鑑を今すぐ無料作成</p>
        <p className="text-[13px] text-slate-600 dark:text-zinc-400 mb-3">
          登録不要・アプリ不要。30秒で電子印鑑を作成してPDFに押印できます。
        </p>
        <Link
          href="/tools/hanko-generator"
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-[13px] font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          電子印鑑メーカーを開く →
        </Link>
      </div>

    </BlogLayout>
  );
}
