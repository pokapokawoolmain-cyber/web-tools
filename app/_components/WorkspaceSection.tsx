import Link from "next/link";
import { ArrowRight, FileStack, Images } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

// ホームの「まとめて片付ける」入口。ファイルを入れるだけで、目的のおすすめから保存まで1画面で終わる
const WORKSPACES = [
  {
    href: "/workspace/pdf",
    Icon: FileStack,
    title: "PDFワークスペース",
    lead: "PDFを入れるだけ。ページを見ながら整えて保存。",
    steps: ["まとめる", "並べ替え", "回転・削除", "分ける", "画像にする"],
    accent: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40",
  },
  {
    href: "/workspace/image",
    Icon: Images,
    title: "画像ワークスペース",
    lead: "画像を入れるだけ。仕上げ方をおすすめして一括処理。",
    steps: ["軽くする", "サイズをそろえる", "JPG・WebPに", "iPhone写真", "PDFにまとめる"],
    accent: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40",
  },
];

export function WorkspaceSection() {
  return (
    <section className="py-14 sm:py-20 bg-white dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-800">
      <div className="container-base">
        <ScrollReveal className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1.5">WORKSPACE</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">ファイルを入れて、まとめて片付ける</h2>
          <p className="text-[14px] text-slate-500 dark:text-zinc-400 mt-2 max-w-2xl">
            ツールを選ばなくても大丈夫。ファイルを入れると、よく使う作業を自動でおすすめします。複数のファイルも一度に終わり、ファイルは端末の外へ送信しません。
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WORKSPACES.map(({ href, Icon, title, lead, steps, accent }, i) => (
            <ScrollReveal key={href} delay={i * 80}>
              <Link
                href={href}
                className="group flex h-full flex-col gap-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900 p-5 sm:p-6 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <div className="flex items-start gap-3">
                  <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
                    <Icon className="w-5 h-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-[17px] font-bold text-slate-900 dark:text-white">
                      {title}
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">NEW</span>
                    </p>
                    <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-0.5">{lead}</p>
                  </div>
                </div>
                <ul className="flex flex-wrap gap-1.5" aria-label="できること">
                  {steps.map((s) => (
                    <li key={s} className="px-2.5 py-1 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-[12px] text-slate-600 dark:text-zinc-300">
                      {s}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center gap-1.5 text-[14px] font-semibold text-blue-600 dark:text-blue-400">
                  ファイルを入れて始める
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
