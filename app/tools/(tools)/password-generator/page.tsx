import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { PasswordGenerator } from "./PasswordGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateMeta({
  title: "パスワード自動生成ツール【無料・安全】強いランダムパスワードをブラウザで即作成",
  description: "長さ・大文字小文字・数字・記号を自由に設定して強いランダムパスワードを即生成。ブラウザ完結でサーバー送信なし・完全安全。12〜20文字・全文字種対応。登録不要・無料。",
  path: "/tools/password-generator",
  keywords: [
    "パスワード 自動生成",
    "パスワード 作成 ツール",
    "ランダム パスワード 生成 無料",
    "強い パスワード 生成",
    "安全 パスワード 作り方",
    "パスワード 生成 無料 オンライン",
  ],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "生成したパスワードはサーバーに保存されますか？",
      acceptedAnswer: { "@type": "Answer", text: "いいえ。パスワードの生成はすべてブラウザ内のJavaScriptで行われます。生成されたパスワードが外部に送信されることは一切ありません。安全にご利用いただけます。" },
    },
    {
      "@type": "Question",
      name: "パスワードは何文字以上にすべきですか？",
      acceptedAnswer: { "@type": "Answer", text: "最低12文字以上を推奨します。重要なサービス（銀行・メール・SNSなど）では16文字以上、英数字・記号を含むランダムなパスワードを使うことが理想です。サービスごとに異なるパスワードを使い、パスワードマネージャーで管理することも重要です。" },
    },
    {
      "@type": "Question",
      name: "強度メーターの基準は何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "パスワードの長さ・使用する文字種（大文字/小文字/数字/記号）の組み合わせから強度を評価しています。「非常に強い」は長さ16文字以上かつ4種の文字種を含む状態が目安です。" },
    },
    {
      "@type": "Question",
      name: "記号を含むパスワードが使えないサービスがあります",
      acceptedAnswer: { "@type": "Answer", text: "サービスによって使用できる文字種に制限がある場合があります。その場合は「記号を含む」のチェックを外して、大文字・小文字・数字のみのパスワードを生成してください。文字数を多めに設定することで強度を補えます。" },
    },
  ],
};

const seoContent = (
  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-6">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      パスワード生成ツールの使い方
    </h2>
    <p>
      スライダーで文字数を設定し、含める文字種（大文字・小文字・数字・記号）を選んで「生成」ボタンを押すだけです。
      生成されたパスワードはワンクリックでクリップボードにコピーできます。
      すべての処理はブラウザ内で完結するため、生成したパスワードが外部に漏れることはありません。
    </p>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      強いパスワードを作る4つのポイント
    </h3>
    <ul className="space-y-2 text-[14px]">
      <li><strong>長さ</strong>：最低12文字、重要なサービスは16文字以上。1文字増えるごとに解読に必要な時間が指数的に増えます。</li>
      <li><strong>文字の多様性</strong>：大文字・小文字・数字・記号を組み合わせると、総当たり攻撃（ブルートフォース）への耐性が大きく向上します。</li>
      <li><strong>ランダム性</strong>：「Password123」「12345678」のような予測しやすいパターンは避けましょう。このツールは暗号論的に安全な乱数で生成しています。</li>
      <li><strong>サービスごとに異なるパスワード</strong>：同じパスワードを使い回すと、1か所で漏洩した際にすべてのサービスが危険にさらされます。</li>
    </ul>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      パスワード強度の目安
    </h3>
    <div className="text-[13px] bg-slate-50 dark:bg-zinc-900 rounded-xl p-4 border border-slate-100 dark:border-zinc-800">
      <table className="w-full">
        <thead>
          <tr className="text-left text-slate-500 dark:text-zinc-500 text-[12px]">
            <th className="pb-2 font-medium">文字数・種類</th>
            <th className="pb-2 font-medium">目安の強度</th>
            <th className="pb-2 font-medium">推奨用途</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-slate-100 dark:border-zinc-800">
            <td className="py-1.5">8文字・英数字のみ</td>
            <td className="py-1.5 text-amber-600 dark:text-amber-400">弱め</td>
            <td className="py-1.5 text-slate-500">非重要サービスのみ</td>
          </tr>
          <tr className="border-t border-slate-100 dark:border-zinc-800">
            <td className="py-1.5">12文字・英数字+記号</td>
            <td className="py-1.5 text-blue-600 dark:text-blue-400">良好</td>
            <td className="py-1.5 text-slate-500">一般的なWebサービス</td>
          </tr>
          <tr className="border-t border-slate-100 dark:border-zinc-800">
            <td className="py-1.5">16文字・全文字種</td>
            <td className="py-1.5 text-emerald-600 dark:text-emerald-400">強い</td>
            <td className="py-1.5 text-slate-500">メール・SNS・EC</td>
          </tr>
          <tr className="border-t border-slate-100 dark:border-zinc-800">
            <td className="py-1.5">20文字以上・全文字種</td>
            <td className="py-1.5 text-emerald-700 dark:text-emerald-300 font-bold">非常に強い</td>
            <td className="py-1.5 text-slate-500">銀行・証券・マスターPW</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      生成後のパスワード管理について
    </h3>
    <p>
      強いパスワードを生成しても、メモ帳やスプレッドシートに平文で保存するのは危険です。
      1Password・Bitwarden・Apple キーチェーン・Google パスワードマネージャーなどの
      パスワードマネージャーを使うことで、複雑なパスワードを安全に管理できます。
      多要素認証（2FA）も合わせて設定することで、万が一パスワードが漏洩しても不正ログインを防げます。
    </p>
    <p>
      重要なサービスは定期的なパスワード変更も効果的です。
      本ツールをブックマークして、更新のたびにご利用ください。
    </p>
  </div>
);

export default function PasswordGeneratorPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="パスワード生成"
        description="長さ・記号・数字を自由に設定。強度メーター付きのランダムパスワードをブラウザ内で安全に生成。登録不要・無料。"
        icon="🔐"
        slug="password-generator"
        seoContent={seoContent}
      >
        <PasswordGenerator />
      </ToolLayout>
    </>
  );
}
