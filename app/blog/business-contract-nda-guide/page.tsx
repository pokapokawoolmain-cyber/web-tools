import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("business-contract-nda-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: [
    "業務委託契約書 テンプレ 無料",
    "NDA テンプレ 無料",
    "秘密保持契約書 フリーランス",
    "フリーランス 契約書 作り方",
    "契約書 PDF 無料",
    "業務委託 個人事業主",
    "NDA 秘密保持契約 書き方",
  ],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>

      {/* ─── リード文 ─────────────────────────────── */}
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        「フリーランスとして独立したけど、契約書ってどう作ればいい？」「NDA（秘密保持契約書）を求められたけど、自分で準備できる？」——フリーランス1年目が直面しがちなこの悩み、実はブラウザだけで無料解決できます。業務委託契約書とNDAの基礎知識から、具体的な作成手順・PDF署名まで徹底解説します。
      </p>

      {/* ─── 1. 業務委託契約書とは ─────────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>業務委託契約書とは？なぜ必要なのか</h2>
      <p>
        業務委託契約書とは、<strong>特定の業務をクライアントから請け負う際に、業務内容・報酬・納期・権利帰属などを書面で取り決めた契約書</strong>です。
      </p>
      <p>
        フリーランスが業務委託で働く場合、法律上は「雇用関係」ではなく「委託関係」になります。このため労働法の保護が適用されず、口頭での約束だけではトラブル発生時に証明が困難になります。
      </p>

      <h3>業務委託契約書がないと起こりうるトラブル</h3>
      <ul className="space-y-2">
        <li>🚨 <strong>報酬の未払い・減額</strong>：「そんな金額では合意していない」と言われる</li>
        <li>🚨 <strong>仕様の無限追加</strong>：「最初の見積もりに含まれるはず」と追加作業を要求される</li>
        <li>🚨 <strong>納品後の著作権トラブル</strong>：成果物の権利がどちらにあるか明確でない</li>
        <li>🚨 <strong>キャンセル時の補償なし</strong>：突然案件キャンセルされても着手金がもらえない</li>
        <li>🚨 <strong>秘密情報の漏洩責任</strong>：情報管理の範囲が不明瞭でトラブルに</li>
      </ul>

      {/* ─── 2. 業務委託契約書の記載内容 ─────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>業務委託契約書に盛り込むべき内容</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">項目</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">内容・ポイント</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["業務内容", "具体的に何をするか明記（「Webサイト制作」ではなく「5ページ構成のWordPressサイト制作」など）"],
              ["報酬・支払い条件", "金額・支払い期日・振込手数料負担・遅延損害金"],
              ["納期・スケジュール", "最終納期だけでなく中間マイルストーンも設定"],
              ["著作権・知的財産権", "成果物の権利は誰に帰属するか（譲渡/ライセンス）"],
              ["修正・変更対応", "修正回数の上限・追加費用の発生条件"],
              ["秘密保持", "業務上知り得た情報の扱い（別途NDAを締結する場合も）"],
              ["契約解除・キャンセル", "解除条件・解除時の清算方法・着手金"],
              ["損害賠償", "損害が発生した場合の責任範囲・上限額"],
              ["準拠法・合意管轄", "トラブル時の裁判所・適用される法律"],
            ].map(([item, point], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-semibold whitespace-nowrap">{item}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{point}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── 3. NDAとは ─────────────────────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>NDA（秘密保持契約書）とは？</h2>
      <p>
        NDA（Non-Disclosure Agreement / 秘密保持契約書）は、<strong>業務を通じて知り得た機密情報を外部に漏らさないことを約束する契約書</strong>です。
      </p>

      <h3>NDAが必要な場面</h3>
      <ul className="space-y-2">
        <li>クライアントの未公開製品・サービス情報を受け取る前</li>
        <li>会社の内部データ（売上・顧客リスト・設計図など）にアクセスする業務</li>
        <li>M&A・新規事業など機密度の高い案件への参加</li>
        <li>大手企業・上場企業との取引開始時</li>
      </ul>

      <h3>NDAの主な記載内容</h3>
      <ul className="space-y-2">
        <li><strong>秘密情報の定義</strong>：何が「秘密情報」にあたるかを明確化</li>
        <li><strong>使用目的の制限</strong>：受け取った情報を業務目的以外に使用しない</li>
        <li><strong>第三者への開示禁止</strong>：他者への漏洩を禁止</li>
        <li><strong>有効期間</strong>：契約終了後も一定期間（通常2〜3年）の秘密保持義務</li>
        <li><strong>違反時の損害賠償</strong>：漏洩した場合の賠償責任</li>
      </ul>

      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-xl p-4 my-4">
        <p className="text-[13px] text-blue-700 dark:text-blue-300">
          <strong>💡 NDAはどちらから締結を求めてもOK：</strong>フリーランス側からNDA締結を求めることで、クライアントに情報管理に真剣であることを示せます。信頼性のアピールになります。
        </p>
      </div>

      {/* ─── 4. 無料テンプレートで作成 ────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>業務委託契約書・NDAを無料テンプレートで作成する手順</h2>
      <p>
        ToolBoxJPでは<Link href="/tools/business-contract-generator">業務委託契約書作成ツール</Link>と<Link href="/tools/nda-generator">NDA作成ツール</Link>を無料で提供しています。
      </p>

      <h3>① 業務委託契約書を作成する</h3>
      <p>
        <Link href="/tools/business-contract-generator">業務委託契約書作成ツール</Link>を開き、以下の情報を入力します。
      </p>
      <ul className="space-y-1">
        <li>委託者・受託者（双方の会社名・氏名・住所）</li>
        <li>業務内容の詳細</li>
        <li>報酬金額・支払い条件</li>
        <li>契約期間・納期</li>
        <li>著作権の帰属（委託者 or 受託者）</li>
        <li>秘密保持・競業避止</li>
      </ul>
      <p>
        入力内容がリアルタイムでプレビューに反映され、完成したらPDFで保存できます。
      </p>

      <h3>② NDAを作成する</h3>
      <p>
        <Link href="/tools/nda-generator">NDA（秘密保持契約書）作成ツール</Link>では、当事者情報・秘密情報の定義・有効期間・適用法律などを入力するだけで、標準的なNDAが作成できます。
      </p>

      <h3>③ PDF署名・電子印鑑を追加する</h3>
      <p>
        作成した契約書PDFに、<Link href="/tools/pdf-signature">PDF電子署名ツール</Link>で署名・印鑑を追加します。
      </p>

      <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-5 my-4 border border-slate-200 dark:border-zinc-700">
        <p className="text-[14px] font-semibold text-slate-800 dark:text-zinc-200 mb-3">署名・押印の手順</p>
        <ol className="space-y-2 text-[14px] text-slate-600 dark:text-zinc-400">
          <li>1. PDF電子署名ツールを開き、契約書PDFをアップロード</li>
          <li>2.「✍️ 手書き」モードで署名カードに署名を書いて「署名を追加」</li>
          <li>3.「🔴 印鑑」モードで電子印鑑を選択してPDFに配置</li>
          <li>4. ドラッグで位置・サイズを調整</li>
          <li>5.「署名済みPDFを保存」でダウンロード</li>
        </ol>
      </div>

      {/* ─── 5. フリーランスが知るべき法律知識 ──── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>フリーランスが知っておくべき法律・制度</h2>

      <h3>フリーランス・事業者間取引適正化等に関する法律（フリーランス法）</h3>
      <p>
        2024年11月施行の<strong>フリーランス法（特定受託事業者に係る取引の適正化等に関する法律）</strong>により、発注事業者（クライアント）に対して以下が義務化されました。
      </p>
      <ul className="space-y-2">
        <li><strong>書面・メール等での取引条件の明示</strong>：報酬・業務内容・支払い期日を明示することが義務に</li>
        <li><strong>報酬支払いの期限</strong>：業務委託日から60日以内の支払いが義務化</li>
        <li><strong>ハラスメント対策</strong>：クライアント側のハラスメント防止措置が義務化</li>
      </ul>
      <p>
        これらの権利を守るためにも、業務委託契約書でこれらの内容を明記しておくことが重要です。
      </p>

      <h3>著作権は誰のもの？</h3>
      <p>
        フリーランスが制作した成果物（デザイン・プログラム・文章等）の著作権は、<strong>契約書で別途定めがない限り制作者（受託者）に帰属</strong>します。クライアントに著作権を移転する場合は、契約書に「著作権は委託者に譲渡する」と明記が必要です。
      </p>
      <p>
        報酬額と著作権譲渡の有無は必ずセットで確認・交渉しましょう。
      </p>

      {/* ─── 6. PDF署名との連携 ──────────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>電子印鑑・PDF署名との連携フロー</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">ステップ</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">ツール</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["1. 印鑑を作成", "電子印鑑メーカー", "名前・スタイルを設定→「PDFツールで使うために保存」"],
              ["2. 契約書を作成", "業務委託契約書 or NDA作成ツール", "必要事項を入力→PDFとして保存"],
              ["3. 署名・押印", "PDF電子署名ツール", "手書き署名と印鑑を配置→署名済みPDFを保存"],
              ["4. 相手方に送付", "メール・チャット等", "署名済みPDFを添付して送信"],
              ["5. 相手方が署名して返送", "同上", "両者の署名が揃ったPDFを保管"],
            ].map(([step, tool, action], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-semibold whitespace-nowrap">{step}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{tool}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── 7. スマホでの操作 ──────────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>スマホでも契約書作成・署名が完結する</h2>
      <p>
        ToolBoxJPのすべての書類作成ツール・PDF署名ツールはスマホ（iPhone・Android）のブラウザから利用できます。
      </p>
      <ul className="space-y-2">
        <li><strong>移動中に契約書を確認・修正</strong>：いつでもどこでも編集可能</li>
        <li><strong>指で手書き署名</strong>：PDF電子署名ツールの署名カードにタッチで署名</li>
        <li><strong>印鑑をタップで配置</strong>：ドラッグで位置調整も直感的</li>
        <li><strong>PDFをメールで即送信</strong>：ダウンロード後、メールアプリから添付</li>
      </ul>

      {/* ─── 関連ツール ─────────────────────────── */}
      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連ツール</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {[
          { href: "/tools/business-contract-generator", emoji: "📋", title: "業務委託契約書作成ツール", desc: "フリーランス向け。著作権・報酬条件を設定" },
          { href: "/tools/nda-generator", emoji: "🤝", title: "NDA（秘密保持契約書）作成ツール", desc: "機密情報の保護。日本語対応" },
          { href: "/tools/pdf-signature", emoji: "✍️", title: "PDF電子署名ツール", desc: "手書き署名・印鑑をPDFに追加して保存" },
          { href: "/tools/hanko-generator", emoji: "🔴", title: "電子印鑑メーカー", desc: "法人・個人対応。透過PNG・PDF直接押印" },
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
        <li><Link href="/blog/invoice-receipt-pdf-guide">請求書・領収書を無料でPDF作成する方法｜インボイス制度にも対応</Link></li>
        <li><Link href="/blog/pdf-compress-guide">PDFを無料で圧縮する方法</Link></li>
        <li><Link href="/blog/pdf-merge-guide">PDFをスマホで無料結合する方法</Link></li>
      </ul>

      {/* ─── まとめCTA ──────────────────────────── */}
      <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-900 dark:to-blue-950/20 border border-slate-200 dark:border-zinc-700">
        <p className="text-[14px] font-semibold text-slate-800 dark:text-zinc-200 mb-1">📋 業務委託契約書・NDAを今すぐ作成</p>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mb-3">
          無料・登録不要・ブラウザ完結。電子印鑑押印・PDF保存まで一気通貫で対応。
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/tools/business-contract-generator"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-[13px] font-semibold rounded-lg hover:bg-slate-900 transition-colors"
          >
            業務委託契約書を作成 →
          </Link>
          <Link
            href="/tools/nda-generator"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[13px] font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            NDAを作成 →
          </Link>
        </div>
      </div>

    </BlogLayout>
  );
}
