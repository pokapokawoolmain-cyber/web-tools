import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaxCover } from "./FaxCover";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "FAX送付状 作成ツール【無料】宛先・件名を入力するだけでA4送付状が完成｜PDF・印刷対応",
  description: "FAX送付状（送信票）を無料で自動作成。宛先・差出人・件名・送信枚数を入力するだけで、ビジネスマナーに沿ったA4書式が完成します。PDF保存・印刷対応。登録不要。",
  path: "/tools/fax-cover",
  keywords: ["FAX 送付状 無料","FAX 送信票 テンプレート","FAX 送付状 作成","送付状 書き方 FAX","FAX 表紙 ダウンロード"],
  ogImage: `/api/og?${new URLSearchParams({ title: "FAX送付状 作成ツール", icon: "📠", desc: "FAX送付状をフォーム入力で作成" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
  {
    "@type": "Question",
    "name": "FAX送付状には何を書きますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "宛先（会社名・部署・担当者）・差出人（会社名・氏名・連絡先）・送信日・件名・送信枚数（送付状含む）・簡単な挨拶文が基本です。本ツールはフォーム入力だけでこれらを配置します。"
    }
  },
  {
    "@type": "Question",
    "name": "送信枚数には送付状も含めますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "はい。「送付状を含め全◯枚」と記載するのが一般的です。相手が全ページ受信できたか確認できるようにするためです。"
    }
  },
  {
    "@type": "Question",
    "name": "宛名の敬称はどう使い分けますか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "会社・部署宛は「御中」、個人宛は「様」を使います。「◯◯株式会社 御中 △△様」のように御中と様の併用はしません。"
    }
  },
  {
    "@type": "Question",
    "name": "手書きで一言添えたほうがいいですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "ビジネスでは印字のままで問題ありません。急ぎの場合は「至急ご確認ください」等を件名や通信欄に明記するほうが伝わります。"
    }
  }
],
};


export default function FaxCoverPage() {
  return (
    <>
    <JsonLd data={faqSchema} />
    <ToolLayout
      title="送付状作成ツール"
      description="FAX送付状・書類送付状を無料で自動作成。宛先・件名・枚数を入力するだけでPDF保存・印刷できます。"
      icon="📠"
      slug="fax-cover"
      seoContent={
        <div className="space-y-4 text-[14px] text-slate-600 dark:text-zinc-400 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">送付状（FAX送付状）とは</h2>
          <p>送付状は書類をFAX・郵便・メールで送る際に先頭に添付するカバー文書です。宛先・差出人・送付内容・枚数を記載することで、受取人が内容をすぐに把握できます。</p>
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">送付状に記載する主な項目</h2>
          <ul className="space-y-1 list-disc list-inside">
            <li>宛先（会社名・部署名・担当者名）</li>
            <li>差出人（自分の会社名・氏名・連絡先）</li>
            <li>送付日</li>
            <li>件名（送付する書類の内容）</li>
            <li>送付枚数（FAXの場合は本状含む）</li>
            <li>本文（一言コメント・備考）</li>
          </ul>
        </div>
      }
    >
      <FaxCover />

    {/* よくある質問（FAQ構造化データと対応） */}
    <section className="mt-10">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">よくある質問</h2>
      <div className="space-y-3">
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. FAX送付状には何を書きますか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 宛先（会社名・部署・担当者）・差出人（会社名・氏名・連絡先）・送信日・件名・送信枚数（送付状含む）・簡単な挨拶文が基本です。本ツールはフォーム入力だけでこれらを配置します。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 送信枚数には送付状も含めますか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. はい。「送付状を含め全◯枚」と記載するのが一般的です。相手が全ページ受信できたか確認できるようにするためです。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 宛名の敬称はどう使い分けますか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 会社・部署宛は「御中」、個人宛は「様」を使います。「◯◯株式会社 御中 △△様」のように御中と様の併用はしません。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 手書きで一言添えたほうがいいですか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. ビジネスでは印字のままで問題ありません。急ぎの場合は「至急ご確認ください」等を件名や通信欄に明記するほうが伝わります。</p>
        </div>
      </div>
    </section>

    </ToolLayout>
    </>
  );
}
