import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("estimate-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["見積書 無料 作成", "見積書 テンプレート 無料", "見積書 作り方 個人", "フリーランス 見積書 書き方", "見積書 PDF 出力"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>

      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        「見積書を作りたいけどExcelがない」「フリーランスで初めて見積書を作る」——ブラウザだけで無料作成してそのままPDF出力できる方法を手順通りに解説します。インストール不要・登録不要でスマホでも使えます。
      </p>

      {/* 結論 CTA */}
      <div className="my-6 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
        <p className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400 mb-1">📄 今すぐ見積書を作成する</p>
        <Link href="/tools/estimate-generator" className="text-[17px] font-bold text-emerald-700 dark:text-emerald-300 hover:opacity-80">
          見積書作成ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・PDF出力対応</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>見積書が必要になる場面</h2>
      <ul className="space-y-1">
        <li>フリーランスとして初めてクライアントに仕事の料金を提示する</li>
        <li>個人事業主・副業で作業内容と金額を書面で伝えたい</li>
        <li>会社の購買担当として業者から見積書をもらう前に自社フォーマットを用意する</li>
        <li>リフォームや工事依頼で複数業者の見積書を統一フォーマットで比較したい</li>
        <li>ExcelやWordを持っていないがPDFで見積書を送りたい</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>【手順】ブラウザで見積書を作成してPDF出力する</h2>

      <div className="space-y-4 my-6">
        {[
          {
            step: "①",
            title: "見積書作成ツールにアクセス",
            body: "ToolBoxJPの見積書作成ツール（/tools/estimate-generator）をブラウザで開きます。スマホ・PC・タブレットどれでもOKです。",
          },
          {
            step: "②",
            title: "発行者情報を入力する",
            body: "自社名（または屋号）・住所・電話番号・メールアドレスを入力します。個人事業主の場合は個人名または屋号でOKです。",
          },
          {
            step: "③",
            title: "宛先・見積日・有効期限を設定",
            body: "見積先の会社名・担当者名を入力します。見積日は自動で今日の日付が入ります。有効期限は一般的に30日が目安です。",
          },
          {
            step: "④",
            title: "品目・数量・単価を入力",
            body: "作業内容・商品名を品目欄に入力し、数量と単価を設定します。消費税（10%または8%軽減税率）は自動計算されます。複数品目の追加も可能です。",
          },
          {
            step: "⑤",
            title: "PDFに出力してダウンロード",
            body: "内容を確認したら「PDF出力」ボタンを押します。A4サイズで見積書がダウンロードされます。メール添付・印刷・クラウドに保存してお使いください。",
          },
        ].map(({ step, title, body }) => (
          <div key={step} className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">{step}</span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-zinc-100 mb-1">{title}</p>
              <p className="text-[14px] text-slate-600 dark:text-zinc-400">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>見積書に記載すべき必須項目</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">項目</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">内容・記載例</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">必須度</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["見積書タイトル", "「御見積書」「見積書」", "必須"],
              ["発行日・見積日", "2026年6月2日", "必須"],
              ["有効期限", "発行日から30日間が目安", "推奨"],
              ["宛先（クライアント名）", "〇〇株式会社 御中 / 〇〇様", "必須"],
              ["発行者情報", "会社名・住所・電話・メール・担当者", "必須"],
              ["品目・数量・単価・金額", "Webサイト制作 1式 300,000円", "必須"],
              ["消費税額・税込合計", "消費税10%：30,000円 / 合計：330,000円", "必須"],
              ["備考・支払い条件", "お支払い：納品後30日以内 / 振込先：〇〇銀行", "推奨"],
              ["捺印欄", "会社印または個人印を押す欄", "任意"],
            ].map(([item, example, required], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{item}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">{example}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-center text-[12px]">
                  <span className={required === "必須" ? "text-red-500 font-bold" : required === "推奨" ? "text-amber-500 font-medium" : "text-slate-400"}>{required}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MIDDLE CTA */}
      <div className="my-6 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
        <p className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400 mb-1">📄 必須項目が自動で整った見積書を作成</p>
        <Link href="/tools/estimate-generator" className="text-[17px] font-bold text-emerald-700 dark:text-emerald-300 hover:opacity-80">
          見積書作成ツール → 無料で試す
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">消費税自動計算・A4PDF出力・テンプレート不要</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>インボイス制度と見積書の関係</h2>

      <p>
        2023年10月から始まった<strong>インボイス制度（適格請求書等保存方式）</strong>の対象は「請求書」「領収書」であり、<strong>見積書は対象外</strong>です。ただし見積書をそのまま請求書として使う場合（簡易見積請求書）は、インボイス登録番号（T+13桁）の記載が必要になります。
      </p>

      <div className="my-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-[14px] text-amber-800 dark:text-amber-300">
        <strong className="block mb-1">⚠️ 注意：インボイス登録事業者の場合</strong>
        <p>課税事業者でインボイス登録をしている場合は、見積書にも登録番号を記載しておくと取引先が喜ぶことがあります。免税事業者（年収1000万円以下）は登録不要です。</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>見積書と請求書の違い</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">書類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">タイミング</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">目的</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["見積書", "作業・購入前", "金額と作業内容の事前提示・合意確認"],
              ["発注書・注文書", "合意後", "正式な発注の記録"],
              ["請求書", "作業・納品後", "代金の支払い請求"],
              ["領収書", "入金後", "代金受領の証明"],
            ].map(([doc, timing, purpose], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{doc}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2">{timing}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">{purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>注意点</h2>

      <ul className="space-y-2">
        <li>
          <strong>見積書に法的拘束力はない</strong>：見積書は金額の目安提示であり、契約書ではありません。正式に発注・受注が確定したら発注書を取り交わすことをおすすめします。
        </li>
        <li>
          <strong>有効期限を必ず記載する</strong>：材料費や人件費の変動で金額が変わる可能性があります。「有効期限：発行日から30日間」などと明記しておくとトラブル防止になります。
        </li>
        <li>
          <strong>捺印について</strong>：電子PDF見積書への捺印は任意ですが、取引先が求める場合は<Link href="/tools/hanko-generator" className="text-emerald-600 dark:text-emerald-400 hover:underline">電子はんこ作成ツール</Link>で作成した透過PNGを貼り付けることができます。
        </li>
        <li>
          <strong>消費税の端数処理</strong>：消費税の計算で1円未満が生じる場合は切り捨て・切り上げ・四捨五入いずれも認められています。取引先との認識を合わせておくとよいです。
        </li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連ツール</h2>
      <ul className="space-y-2">
        <li><Link href="/tools/estimate-generator">見積書作成ツール</Link>：ブラウザで見積書を作成してPDF出力。</li>
        <li><Link href="/tools/hanko-generator">電子はんこ作成ツール</Link>：PDF見積書に貼り付ける透過PNG印鑑を作成。</li>
        <li><Link href="/tools/pdf-compress">PDF圧縮ツール</Link>：出力した見積書PDFをメール送信用に軽量化。</li>
        <li><Link href="/tools/jpg-to-pdf">画像→PDFツール</Link>：手書きメモや図表をPDFに変換して見積書に添付。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/hanko-create-guide">電子はんこ・デジタル印鑑を無料で作る方法【PNG透過・Word貼り付け対応】</Link></li>
        <li><Link href="/blog/tax-docs-pdf-guide">確定申告の書類をスマホでPDFにまとめる方法</Link></li>
        <li><Link href="/blog/android-pdf-guide">Androidスマホで写真・書類を複数まとめてPDFにする方法</Link></li>
        <li><Link href="/blog/pdf-merge-guide">PDFをスマホで結合・まとめる方法</Link></li>
      </ul>

      {/* BOTTOM CTA */}
      <div className="my-6 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
        <p className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400 mb-1">📄 無料で今すぐ見積書を作成</p>
        <Link href="/tools/estimate-generator" className="text-[17px] font-bold text-emerald-700 dark:text-emerald-300 hover:opacity-80">
          見積書作成ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・PDF出力・スマホ対応</p>
      </div>

    </BlogLayout>
  );
}
