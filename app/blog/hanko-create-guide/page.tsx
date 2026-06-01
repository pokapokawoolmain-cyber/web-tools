import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("hanko-create-guide")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["電子はんこ 無料 作成", "デジタル印鑑 作り方", "電子印鑑 Word 貼り付け", "電子はんこ 透過PNG", "デジタル印鑑 無料 スマホ"],
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout post={post}>

      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        「書類にはんこを押したいけど印鑑が手元にない」「WordやPDFにデジタル印鑑を貼り付けたい」——アプリ不要・登録不要で電子はんこをブラウザから無料作成して、透過PNG画像をダウンロードする方法を解説します。
      </p>

      {/* 結論 CTA */}
      <div className="my-6 p-5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50">
        <p className="text-[13px] font-semibold text-red-600 dark:text-red-400 mb-1">🔴 今すぐ電子はんこを作成する</p>
        <Link href="/tools/hanko-generator" className="text-[17px] font-bold text-red-700 dark:text-red-300 hover:opacity-80">
          電子はんこ作成ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・透過PNG出力・Word/Excel/PDF対応</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>電子はんこが役立つ場面</h2>
      <ul className="space-y-1">
        <li>WordやExcelで作った書類（見積書・請求書・報告書）にはんこを押したい</li>
        <li>テレワーク中で印鑑が手元にないが書類に捺印したい</li>
        <li>PDF書類を印刷せずにデジタル捺印して返送したい</li>
        <li>角印（社印）の入った請求書・見積書をデジタルで作りたい</li>
        <li>シャチハタ代わりに社内書類の承認印を電子化したい</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>【手順】電子はんこを作成してダウンロードする</h2>

      <div className="space-y-4 my-6">
        {[
          {
            step: "①",
            title: "電子はんこ作成ツールにアクセス",
            body: "ToolBoxJPの電子はんこ作成ツール（/tools/hanko-generator）をブラウザで開きます。スマホ・PCどちらでも使えます。",
          },
          {
            step: "②",
            title: "はんこの種類を選ぶ（丸印・角印）",
            body: "個人名や名字を押す認印・実印イメージなら「丸印」、会社名を入れる社判なら「角印」を選びます。",
          },
          {
            step: "③",
            title: "テキストを入力する",
            body: "押印したい名前・会社名・役職などを入力します。丸印は1〜4文字程度、角印は会社名全体を入れることが多いです。",
          },
          {
            step: "④",
            title: "色・フォント・サイズを調整",
            body: "朱肉らしい赤色が標準ですが、黒・青などに変更も可能です。書体は楷書・明朝・角ゴシックなどから選べます。",
          },
          {
            step: "⑤",
            title: "透過PNGをダウンロード",
            body: "「ダウンロード」ボタンを押すと背景が透明なPNG画像が保存されます。白背景のPNGと異なり、書類の上に重ねても背景が白くなりません。",
          },
        ].map(({ step, title, body }) => (
          <div key={step} className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-sm">{step}</span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-zinc-100 mb-1">{title}</p>
              <p className="text-[14px] text-slate-600 dark:text-zinc-400">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>各書類への貼り付け方</h2>

      <div className="space-y-3 my-4">
        {[
          {
            app: "Word・Excel",
            method: "「挿入」→「画像」→ダウンロードしたPNGを選択 →「文字列の折り返し」を「前面」に変更 → 捺印欄に重ねてサイズ調整",
          },
          {
            app: "Google ドキュメント",
            method: "「挿入」→「画像」→「パソコンからアップロード」→ 画像を選択 → ドラッグして位置を調整",
          },
          {
            app: "PDF（Adobe Acrobat）",
            method: "「ツール」→「注釈」→「スタンプ」→「カスタムスタンプを作成」→ PNGを追加 → 任意の位置にスタンプ",
          },
          {
            app: "PDF（ToolBoxJP PDF編集）",
            method: "PDF上に画像として電子はんこPNGを直接貼り付けて保存できます",
          },
        ].map(({ app, method }) => (
          <div key={app} className="bg-slate-50 dark:bg-zinc-900 rounded-xl px-4 py-3 border border-slate-200 dark:border-zinc-700">
            <p className="text-[13px] font-bold text-slate-700 dark:text-zinc-200 mb-1">{app}</p>
            <p className="text-[13px] text-slate-600 dark:text-zinc-400">{method}</p>
          </div>
        ))}
      </div>

      {/* MIDDLE CTA */}
      <div className="my-6 p-5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50">
        <p className="text-[13px] font-semibold text-red-600 dark:text-red-400 mb-1">🔴 透過PNG印鑑を今すぐ作成</p>
        <Link href="/tools/hanko-generator" className="text-[17px] font-bold text-red-700 dark:text-red-300 hover:opacity-80">
          電子はんこ作成ツール → 無料で試す
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">丸印・角印対応・フォント選択・色変更可</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>丸印・角印・認印の使い分け</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">種類</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">形状・内容</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">使う場面</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["丸印（認印・実印）", "円形・名字または氏名", "個人の書類・社内承認印・宅配受取など"],
              ["角印（社印）", "四角形・会社名", "請求書・見積書・領収書・名刺など"],
              ["代表者印（実印）", "円形・会社名＋代表者", "契約書・登記書類（電子署名サービスを推奨）"],
              ["認め印", "小さめ丸印・名字のみ", "日常書類の承認・確認の捺印"],
            ].map(([type, shape, use], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{type}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">{shape}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>注意点</h2>

      <ul className="space-y-2">
        <li>
          <strong>電子はんこに法的効力はない</strong>：電子はんこは画像データであり、法的な押印の代替とは認められません。契約書など法的拘束力が必要な場合は<strong>電子署名サービス（DocuSign・クラウドサインなど）</strong>をご利用ください。
        </li>
        <li>
          <strong>透過PNGが白くなる場合</strong>：ソフトによっては透過PNGを読み込んだとき背景が白くなることがあります。その場合は「前面配置」や「重ね順」の設定を確認してください。
        </li>
        <li>
          <strong>印鑑のサイズ</strong>：実際の認印は直径15mm程度が一般的です。Wordに貼り付ける際は縦横15〜18mm程度にリサイズすると自然に見えます。
        </li>
        <li>
          <strong>作成した電子はんこの管理</strong>：ダウンロードしたPNG画像は他人に使用されないよう管理してください。重要な書類に使う場合はパスワード付きフォルダへの保存をおすすめします。
        </li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連ツール</h2>
      <ul className="space-y-2">
        <li><Link href="/tools/hanko-generator">電子はんこ作成ツール</Link>：丸印・角印を透過PNGで作成。</li>
        <li><Link href="/tools/estimate-generator">見積書作成ツール</Link>：電子はんこと組み合わせて見積書を作成。</li>
        <li><Link href="/tools/jpg-to-pdf">画像→PDFツール</Link>：作成した書類を画像からPDFに変換。</li>
        <li><Link href="/tools/pdf-compress">PDF圧縮ツール</Link>：捺印済みPDFをメール送信用に軽量化。</li>
      </ul>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連記事</h2>
      <ul className="space-y-2">
        <li><Link href="/blog/estimate-guide">見積書を無料で作成・PDF出力する方法【テンプレート不要】</Link></li>
        <li><Link href="/blog/android-pdf-guide">Androidスマホで写真・書類を複数まとめてPDFにする方法</Link></li>
        <li><Link href="/blog/pdf-merge-guide">PDFをスマホで結合・まとめる方法</Link></li>
        <li><Link href="/blog/iphone-pdf-guide">iPhoneでPDFを編集・加工する方法まとめ</Link></li>
      </ul>

      {/* BOTTOM CTA */}
      <div className="my-6 p-5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50">
        <p className="text-[13px] font-semibold text-red-600 dark:text-red-400 mb-1">🔴 無料で今すぐ電子はんこを作成</p>
        <Link href="/tools/hanko-generator" className="text-[17px] font-bold text-red-700 dark:text-red-300 hover:opacity-80">
          電子はんこ作成ツール → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・透過PNG・スマホ対応</p>
      </div>

    </BlogLayout>
  );
}
