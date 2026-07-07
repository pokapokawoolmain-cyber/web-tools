import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { SideJobCalculator } from "./SideJobCalculator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "副業の手取り・税金計算【無料】収入から経費と税金を引いた実質利益を試算",
  description: "副業収入・経費・本業の年収を入力して、所得税・住民税を差し引いた実質の手取りを計算。確定申告が必要になる20万円ラインの判定つき。会社員の副業・フリーランスの掛け持ちに。無料・登録不要。",
  path: "/tools/side-job-profit",
  keywords: ["副業 税金 計算","副業 手取り シミュレーション","副業 20万円 税金","副業 確定申告 いくらから","副業 住民税 計算"],
  ogImage: `/api/og?${new URLSearchParams({ title: "副業の手取り・税金計算", icon: "💼", desc: "副業の実質手取りと税金を試算" }).toString()}`,
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
  {
    "@type": "Question",
    "name": "副業の確定申告はいくらから必要ですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "会社員の場合、副業の所得（収入−経費）が年間20万円を超えると所得税の確定申告が必要です。20万円以下でも住民税の申告は必要な点に注意してください。"
    }
  },
  {
    "@type": "Question",
    "name": "経費にできるものは何ですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "副業に直接必要な支出（機材・通信費・交通費・仕入れなど）が対象です。自宅作業なら家賃や電気代の一部を按分計上できる場合があります。レシートや領収書は保管しておきましょう。"
    }
  },
  {
    "@type": "Question",
    "name": "会社に副業がバレる原因は何ですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "最も多いのは住民税の増額通知です。確定申告時に住民税を「自分で納付（普通徴収）」にすると、会社経由の特別徴収に上乗せされにくくなります。"
    }
  },
  {
    "@type": "Question",
    "name": "計算結果は正確ですか？",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "所得税率・住民税10%を用いた概算です。所得控除の状況や自治体により実額は変わるため、正式な申告時は国税庁の確定申告書等作成コーナー等でご確認ください。"
    }
  }
],
};


const seoContent = (
  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-4">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      副業と確定申告について
    </h2>
    <p>
      副業による所得（収入−経費）が年間20万円を超えると確定申告が必要です。経費を正しく計上することで税金を合法的に減らせます。
    </p>
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
      経費になるものの例
    </h3>
    <p>
      副業に使ったPC・スマホ・通信費・書籍代・交通費・セミナー費用などが経費として認められる場合があります。領収書やレシートを保管しましょう。
    </p>
  
    {/* よくある質問（FAQ構造化データと対応） */}
    <section className="mt-10">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">よくある質問</h2>
      <div className="space-y-3">
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 副業の確定申告はいくらから必要ですか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 会社員の場合、副業の所得（収入−経費）が年間20万円を超えると所得税の確定申告が必要です。20万円以下でも住民税の申告は必要な点に注意してください。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 経費にできるものは何ですか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 副業に直接必要な支出（機材・通信費・交通費・仕入れなど）が対象です。自宅作業なら家賃や電気代の一部を按分計上できる場合があります。レシートや領収書は保管しておきましょう。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 会社に副業がバレる原因は何ですか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 最も多いのは住民税の増額通知です。確定申告時に住民税を「自分で納付（普通徴収）」にすると、会社経由の特別徴収に上乗せされにくくなります。</p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. 計算結果は正確ですか？</p>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">A. 所得税率・住民税10%を用いた概算です。所得控除の状況や自治体により実額は変わるため、正式な申告時は国税庁の確定申告書等作成コーナー等でご確認ください。</p>
        </div>
      </div>
    </section>
  </div>
);

export default function SideJobProfitPage() {
  return (
    <>
    <JsonLd data={faqSchema} />
    <ToolLayout
      title="副業利益・税金計算"
      description="副業収入から経費・税金を差し引いた実質手取りを計算。確定申告の目安も確認できます。"
      icon="💼"
      slug="side-job-profit"
      seoContent={seoContent}
    >
      <SideJobCalculator />
    </ToolLayout>
    </>
  );
}
