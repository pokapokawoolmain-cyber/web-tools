import type { Metadata } from "next";
import { generateToolMeta } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { NoshiMaker } from "./NoshiMaker";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateToolMeta(
  "のし紙作成ツール",
  "御祝・内祝・御歳暮など用途別のし紙を無料で作成。水引・名入れ対応。A4印刷・コンビニ印刷対応。登録不要。",
  "noshi-maker",
  ["のし紙 作成 無料", "のし テンプレート 印刷", "無料 のし 印刷", "のし紙 御祝 印刷", "内祝い のし 無料"]
);

const faqs = [
  {
    q: "蝶結びと結び切りはどう使い分けますか？",
    a: "蝶結び（花結び）は何度あってもよいお祝いごとに使います。出産祝い・入学祝い・御歳暮・御中元などが該当します。結び切りは「一度きりで繰り返してほしくない」ことに使い、婚礼・快気祝・御見舞いなどに用います。結婚祝いに蝶結びを使うのはマナー違反になるため注意してください。",
  },
  {
    q: "内祝いの表書きは何を選べばいいですか？",
    a: "内祝い（いただいたお祝いへのお返し）の場合は「内祝」と書きます。出産内祝いも同じ「内祝」ですが、赤ちゃんの名前を連名にするケースが多いです。快気祝いのお返しは「快気祝」、引越しのお返しは「粗品」や「御挨拶」を使います。",
  },
  {
    q: "のし紙とかけ紙の違いは何ですか？",
    a: "のし紙は水引と熨斗（のし飾り）の両方が印刷された紙で、お祝いの贈り物に使います。かけ紙は水引のみが印刷されており、弔事（香典返し・粗供養など）に使います。弔事用はのし飾りがない点が重要な違いです。本ツールでは慶事用（お祝い）と弔事用（御仏前・香典返しなど）の両方に対応しています。",
  },
  {
    q: "コンビニで印刷できますか？",
    a: "はい、本ツールで作成したのし紙はPDF形式で保存でき、セブン-イレブン・ローソン・ファミリーマートなどのコンビニのマルチコピー機でA4印刷が可能です。自宅プリンターがない場合でもコンビニで手軽に印刷できます。印刷後はハサミで切り取ってご使用ください。",
  },
];

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">のし紙の種類と選び方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        のし紙は水引のデザインと表書きの組み合わせで種類が決まります。主な種類は「紅白蝶結び（花結び）」「紅白結び切り」「黒白結び切り（弔事用）」「黄白結び切り（関西の弔事用）」などです。
        慶事（お祝い）には紅白の水引を、弔事（お悔やみ・法事）には黒白または黄白の水引を選びます。まずお祝いか弔事かを判断し、次に用途（出産・婚礼・法事など）に合った表書きを選びましょう。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">表書きの書き方（御祝・内祝など）</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        表書きは水引の上に書く言葉で、贈り物の目的を示します。よく使われる表書きの例：
        御祝（一般的なお祝い）・出産御祝・入学御祝・御結婚御祝・内祝（お返し）・御歳暮・御中元・御礼・粗品・寸志・御見舞など。
        弔事では御霊前・御仏前・御香典・御供物料・御花料・粗供養・御仏前などを使います。
        本ツールでは用途を選ぶと適切な表書きが自動で選択されます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">名前の書き方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        のし紙の名前欄（水引の下）には贈り主の名前を書きます。個人の場合はフルネーム、夫婦連名の場合は「田中太郎・花子」のように書きます。3名以上の場合は代表者名の左に「外一同」または「他一同」と添えます。
        会社名義の場合は会社名を大きめに、担当者名を右下に小さく書くのが一般的です。本ツールでは連名や会社名にも対応しています。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">水引の選び方（蝶結びvs結び切り）</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        水引の選び方は贈り物のシーンで決まります。
        蝶結び（花結び）は何度でも結び直せることから、繰り返しあってよいお祝いに使います。出産祝い・入学祝い・就職祝い・お中元・お歳暮などが該当します。
        結び切りは一度結んだらほどけにくい結び方で、「繰り返してほしくない」ことに使います。婚礼・快気祝・弔事がこれにあたります。結婚祝いに蝶結びを使うと「何度でも離婚・再婚してほしい」という意味になるため絶対に避けてください。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <div
            key={faq.q}
            className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4"
          >
            <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">Q. {faq.q}</p>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">A. {faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default function NoshiMakerPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }}
      />
      <ToolLayout
        title="のし紙作成ツール"
        description="御祝・内祝・御歳暮・御中元など用途別ののし紙を無料作成。水引・名入れ対応。A4印刷・コンビニ印刷対応。"
        icon="🎀"
        slug="noshi-maker"
        seoContent={seoContent}
      >
        <NoshiMaker />
      </ToolLayout>
    </>
  );
}
