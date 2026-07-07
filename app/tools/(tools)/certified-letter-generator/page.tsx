import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { CertifiedLetterGenerator } from "./CertifiedLetterGenerator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "内容証明郵便の書き方・文面作成【無料】1行26文字×20行の書式ルールに自動対応",
  description:
    "内容証明郵便の文面テンプレートを無料で作成。日本郵便の書式ルール（1行26文字・1枚20行）に対応した文字数ガイド付きで、未払い請求・クーリングオフなどの通知文書を作成できます。登録不要。",
  path: "/tools/certified-letter-generator",
  keywords: [
    "内容証明 書き方",
    "内容証明郵便 文例",
    "内容証明 テンプレート 無料",
    "内容証明 文字数 ルール",
    "内容証明 雛形",
    "内容証明 自分で書く",
    "未払い 請求 内容証明",
  ],
  ogImage: `/api/og?${new URLSearchParams({ title: "内容証明テンプレ作成ツール", icon: "📮", desc: "1行26文字×20行の書式ルールに対応した文字数ガイド付き" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "内容証明郵便に法的効力はありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "内容証明郵便自体に相手を強制する法的効力はありませんが、「いつ・誰が・どんな内容を送ったか」を日本郵便が公的に証明するため、裁判での証拠や時効の完成猶予（催告）に使えます。クーリングオフや未払い金請求など「通知した事実」が重要な場面で効果を発揮します。",
      },
    },
    {
      "@type": "Question",
      name: "内容証明の文字数・行数の制限はありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "横書きの場合「1行26文字以内・1枚20行以内」、縦書きの場合「1行20文字以内・1枚26行以内」という決まりがあります。使用できるのは、ひらがな・カタカナ・漢字・数字・英字（氏名や地名等の固有名詞に限る）・一般的な記号です。本ツールはこの書式ルールに合わせた文字数ガイドを表示します。",
      },
    },
    {
      "@type": "Question",
      name: "内容証明郵便の出し方と費用を教えてください",
      acceptedAnswer: {
        "@type": "Answer",
        text: "同じ内容の文書を3通（送付用・郵便局保管用・自分の控え用）用意し、集配郵便局など内容証明を取り扱う郵便局の窓口に差出人・受取人の住所氏名を記した封筒とともに提出します。料金は基本の郵便料金に加えて内容証明料（1枚目480円、2枚目以降は増額）＋一般書留料が必要で、配達証明（+350円程度）を付けるのが一般的です。e内容証明（電子内容証明）ならオンラインで24時間差し出せます。",
      },
    },
    {
      "@type": "Question",
      name: "弁護士に頼まず自分で内容証明を書いても大丈夫ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "自分で作成して差し出すことは全く問題ありません。貸金の返還請求やクーリングオフ通知など定型的な内容であれば、本ツールのテンプレートをもとに十分作成できます。ただし、相手との係争が深刻な場合や高額な請求の場合は、弁護士名で送ることで心理的効果が高まるため、専門家への相談も検討してください。",
      },
    },
  ],
};

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">内容証明郵便とは</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        内容証明郵便は、いつ・誰が・誰に対して・どのような内容の文書を送ったかを日本郵便が証明する制度です。書式は「1行26文字以内、1枚20行以内」「縦書きの場合は20文字×26行」など決まりがあります。
      </p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-4">
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200">Q. 内容証明郵便に法的効力はありますか？</p><p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A. 内容証明郵便自体に相手を強制する法的効力はありませんが、「いつ・誰が・どんな内容を送ったか」を日本郵便が公的に証明するため、裁判での証拠や時効の完成猶予（催告）に使えます。クーリングオフや未払い金請求など「通知した事実」が重要な場面で効果を発揮します。</p></div>
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200">Q. 内容証明の文字数・行数の制限はありますか？</p><p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A. 横書きの場合「1行26文字以内・1枚20行以内」、縦書きの場合「1行20文字以内・1枚26行以内」という決まりがあります。使用できるのは、ひらがな・カタカナ・漢字・数字・英字（氏名や地名等の固有名詞に限る）・一般的な記号です。本ツールはこの書式ルールに合わせた文字数ガイドを表示します。</p></div>
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200">Q. 内容証明郵便の出し方と費用を教えてください</p><p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A. 同じ内容の文書を3通（送付用・郵便局保管用・自分の控え用）用意し、集配郵便局など内容証明を取り扱う郵便局の窓口に差出人・受取人の住所氏名を記した封筒とともに提出します。料金は基本の郵便料金に加えて内容証明料（1枚目480円、2枚目以降は増額）＋一般書留料が必要で、配達証明（+350円程度）を付けるのが一般的です。e内容証明（電子内容証明）ならオンラインで24時間差し出せます。</p></div>
        <div><p className="font-semibold text-sm text-slate-800 dark:text-zinc-200">Q. 弁護士に頼まず自分で内容証明を書いても大丈夫ですか？</p><p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A. 自分で作成して差し出すことは全く問題ありません。貸金の返還請求やクーリングオフ通知など定型的な内容であれば、本ツールのテンプレートをもとに十分作成できます。ただし、相手との係争が深刻な場合や高額な請求の場合は、弁護士名で送ることで心理的効果が高まるため、専門家への相談も検討してください。</p></div>
      </div>
    </section>
    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4">
      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">⚠️ 免責事項</p>
      <p className="text-sm text-amber-700 dark:text-amber-400">本ツールはテンプレート作成補助です。法的トラブル対応の重要文書については弁護士・行政書士にご相談ください。</p>
    </div>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="内容証明テンプレ作成ツール"
        description="内容証明郵便のテンプレートを無料で作成。1行26文字・1枚20行の書式ルールに対応した文字数ガイド付き。"
        icon="📮"
        slug="certified-letter-generator"
        seoContent={seoContent}
      >
        <CertifiedLetterGenerator />
      </ToolLayout>
    </>
  );
}
