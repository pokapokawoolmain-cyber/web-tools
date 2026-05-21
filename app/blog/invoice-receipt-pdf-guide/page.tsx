import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("invoice-receipt-pdf-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: [
    "請求書 作成 無料",
    "領収書 作成 無料",
    "PDF 請求書",
    "インボイス 請求書 作り方",
    "インボイス 領収書",
    "請求書 テンプレ 無料",
    "フリーランス 請求書",
  ],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>

      {/* ─── リード文 ─────────────────────────────── */}
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        「フリーランスを始めたけど、請求書・領収書ってどうやって作ればいい？」「インボイス制度に対応した請求書の書き方がわからない」——そんな悩みを抱えるフリーランス・個人事業主の方に向けて、無料で請求書・領収書をPDF作成する方法を解説します。スマホ1台・ブラウザだけで完結します。
      </p>

      {/* ─── 1. 請求書と領収書の違い ─────────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>請求書と領収書の違い</h2>
      <p>
        まず基本的な違いを整理しましょう。
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">書類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">タイミング</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">意味</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">発行者</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["請求書", "代金受け取り前", "「この金額を支払ってください」という要求", "サービス提供者（受取側）"],
              ["領収書", "代金受け取り後", "「この金額を受け取りました」という確認", "サービス提供者（受取側）"],
            ].map(([doc, timing, meaning, issuer], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-semibold">{doc}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{timing}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{meaning}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{issuer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        一般的な流れは「<strong>業務完了 → 請求書発行 → 入金確認 → 領収書発行</strong>」です。クライアントから「領収書をください」と言われたら、入金後に発行するものです。
      </p>

      {/* ─── 2. インボイス制度 ─────────────────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>インボイス制度とは？フリーランスへの影響</h2>
      <p>
        2023年10月から始まった<strong>インボイス制度（適格請求書等保存方式）</strong>は、消費税の仕入税額控除に関わる制度です。フリーランス・個人事業主にとって大きな変化をもたらしました。
      </p>

      <h3>インボイス制度の基本</h3>
      <ul className="space-y-2">
        <li><strong>登録番号が必要</strong>：税務署に申請して取得した「T+13桁」の登録番号</li>
        <li><strong>適格請求書（インボイス）の記載要件</strong>：登録番号・税率・消費税額などの記載が必須</li>
        <li><strong>未登録事業者からの仕入れ</strong>：クライアント側で仕入税額控除ができない</li>
      </ul>

      <h3>インボイス対応請求書の必須記載事項</h3>
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-xl p-5 my-4">
        <ol className="space-y-1 text-[14px] text-blue-800 dark:text-blue-300">
          <li>① 発行者の氏名・名称</li>
          <li>② 適格請求書発行事業者の登録番号（T＋13桁）</li>
          <li>③ 取引年月日</li>
          <li>④ 取引内容（軽減税率対象の場合はその旨）</li>
          <li>⑤ 税率ごとに区分した合計額（税抜または税込）</li>
          <li>⑥ 税率ごとの消費税額</li>
          <li>⑦ 書類交付を受ける事業者の氏名・名称</li>
        </ol>
      </div>

      <p>
        <Link href="/tools/invoice-generator">ToolBoxJPの請求書作成ツール</Link>では、インボイス登録番号の入力欄を設けており、自動的に適格請求書フォーマットで作成できます。
      </p>

      {/* ─── 3. PDFで保存するメリット ────────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>請求書・領収書をPDFで保存するメリット</h2>
      <ul className="space-y-2">
        <li><strong>メール添付で即送信</strong>：印刷・郵送の手間が不要</li>
        <li><strong>改ざん防止</strong>：PDF形式は後から編集されにくい</li>
        <li><strong>電子帳簿保存法に対応</strong>：電子保存が義務化される流れに対応</li>
        <li><strong>検索・管理が楽</strong>：ファイル名・日付で整理・検索できる</li>
        <li><strong>印刷コスト削減</strong>：ペーパーレスで経費削減</li>
      </ul>

      {/* ─── 4. 請求書の作り方 ─────────────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>無料で請求書PDFを作成する手順</h2>
      <p>
        <Link href="/tools/invoice-generator">請求書作成ツール</Link>を使った手順を解説します。
      </p>

      <h3>① 発行者情報を入力</h3>
      <p>
        会社名または氏名・住所・電話番号・メールアドレスを入力します。インボイス対応の場合は適格請求書発行事業者登録番号も入力してください。
      </p>

      <h3>② 請求先・請求番号・日付を入力</h3>
      <p>
        宛先（会社名・担当者名）・請求番号（管理用）・発行日・支払期限を入力します。
      </p>

      <h3>③ 品目・数量・単価を入力</h3>
      <p>
        サービス内容・数量・単価を入力すると、消費税・合計金額が自動計算されます。税率（10%・軽減税率8%）も選択できます。
      </p>

      <h3>④ 銀行口座情報・備考を入力</h3>
      <p>
        振込先の銀行情報・口座番号を入力します。備考欄には支払い条件・特記事項などを入力できます。
      </p>

      <h3>⑤ 電子印鑑を押して印刷・PDF保存</h3>
      <p>
        印鑑セクションで保存済みの電子印鑑を選択すると、プレビューに反映されます。印刷ボタンから「PDFに保存」を選ぶと、印鑑入りの請求書PDFが保存されます。
      </p>

      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-xl p-5 my-6">
        <p className="text-[14px] font-semibold text-blue-700 dark:text-blue-300 mb-2">🧾 請求書を今すぐ作成</p>
        <p className="text-[13px] text-blue-600 dark:text-blue-400 mb-3">
          登録不要・無料。インボイス対応の請求書をブラウザだけで作成できます。
        </p>
        <Link
          href="/tools/invoice-generator"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[13px] font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          請求書作成ツールを開く →
        </Link>
      </div>

      {/* ─── 5. 領収書の作り方 ─────────────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>無料で領収書PDFを作成する手順</h2>
      <p>
        <Link href="/tools/receipt-generator">領収書作成ツール</Link>での作成手順です。
      </p>

      <h3>領収書の必須記載事項</h3>
      <ul className="space-y-2">
        <li><strong>宛名</strong>：支払った会社・個人の名前（「上様」でも可だが宛名入りが望ましい）</li>
        <li><strong>金額</strong>：改ざん防止のため¥〇〇〇※-の形式が一般的</li>
        <li><strong>但し書き</strong>：「○○代として」など何の支払いかを明記</li>
        <li><strong>発行日</strong>：実際に入金を受けた日付</li>
        <li><strong>発行者情報</strong>：氏名・住所・電話番号</li>
      </ul>

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 my-4">
        <p className="text-[13px] text-amber-800 dark:text-amber-300">
          <strong>💡 収入印紙について：</strong>電子PDFの領収書には収入印紙は不要です（電子文書のため）。ただし紙に印刷して手渡す場合、5万円以上は収入印紙が必要です。
        </p>
      </div>

      {/* ─── 6. 電子署名との連携 ──────────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>既存PDFへの署名・押印方法</h2>
      <p>
        取引先から送られてきたPDFの請求書・契約書に署名・印鑑を追加したい場合は、<Link href="/tools/pdf-signature">PDF電子署名ツール</Link>を使います。
      </p>
      <ul className="space-y-2">
        <li><strong>手書き署名</strong>：署名カードに指またはマウスで署名を書いて配置</li>
        <li><strong>テキスト署名</strong>：名前・日付などをテキストで追加</li>
        <li><strong>印鑑押印</strong>：電子印鑑メーカーで作成した印鑑を配置</li>
      </ul>
      <p>
        すべての操作がブラウザ内で完結するため、機密PDFも安全に処理できます。
      </p>

      {/* ─── 7. スマホ対応 ──────────────────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>スマホだけで請求書・領収書を作成する</h2>
      <p>
        ToolBoxJPの請求書・領収書作成ツールはスマホ（iPhone・Android）のブラウザからも使えます。外出先や移動中でも請求書を作成して即メール送信できます。
      </p>
      <ul className="space-y-2">
        <li>iPhone Safari・Android Chromeで動作確認済み</li>
        <li>アプリのインストール不要</li>
        <li>作成データはブラウザのLocalStorageに保存</li>
        <li>PDFは端末に直接保存されてメール添付がスムーズ</li>
      </ul>

      {/* ─── 関連ツール ─────────────────────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連ツール</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {[
          { href: "/tools/invoice-generator", emoji: "🧾", title: "請求書作成ツール", desc: "インボイス対応・電子印鑑押印付き・無料" },
          { href: "/tools/receipt-generator", emoji: "🗂", title: "領収書作成ツール", desc: "宛名・但し書き・印鑑対応・PDF保存" },
          { href: "/tools/hanko-generator", emoji: "🔴", title: "電子印鑑メーカー", desc: "透過PNG・PDF直接押印対応" },
          { href: "/tools/pdf-signature", emoji: "✍️", title: "PDF電子署名ツール", desc: "既存PDFに署名・印鑑を追加" },
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
        <li><Link href="/blog/electronic-stamp-guide">電子印鑑とは？無料で作成してPDFに押印する方法【2026年版】</Link></li>
        <li><Link href="/blog/business-contract-nda-guide">業務委託契約書・NDAを無料テンプレートで作成する方法</Link></li>
        <li><Link href="/blog/pdf-compress-guide">PDFを無料で圧縮する方法</Link></li>
        <li><Link href="/blog/pdf-merge-guide">PDFをスマホで無料結合する方法</Link></li>
      </ul>

      {/* ─── まとめCTA ──────────────────────────── */}
      <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[14px] font-semibold text-blue-700 dark:text-blue-400 mb-1">🧾 請求書・領収書を今すぐ作成</p>
        <p className="text-[13px] text-slate-600 dark:text-zinc-400 mb-3">
          インボイス対応・電子印鑑付き・PDF保存。無料・登録不要でブラウザ完結。
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/tools/invoice-generator"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[13px] font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            請求書を作成 →
          </Link>
          <Link
            href="/tools/receipt-generator"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white text-[13px] font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            領収書を作成 →
          </Link>
        </div>
      </div>

    </BlogLayout>
  );
}
