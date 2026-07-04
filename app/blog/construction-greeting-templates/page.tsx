import type { Metadata } from "next";
import { getBlogPost } from "@/data/blog-posts";
import { BlogLayout } from "../_components/BlogLayout";
import { generateMeta } from "@/lib/seo";
import Link from "next/link";

const post = getBlogPost("construction-greeting-templates")!;

export const metadata: Metadata = generateMeta({
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  keywords: ["工事 挨拶 文 テンプレート", "工事 近隣 挨拶 例文", "近隣 挨拶 文 例文", "工事 着工 挨拶 文", "解体工事 挨拶文", "外壁塗装 挨拶文", "リフォーム 挨拶文 テンプレート"],
  type: "article",
});

// コピペ用の例文カード
function TemplateCard({ title, badge, body }: { title: string; badge: string; body: string }) {
  return (
    <div className="my-6 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800">
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">{badge}</span>
        <p className="text-[14px] font-semibold text-slate-800 dark:text-zinc-100">{title}</p>
      </div>
      <pre className="px-4 py-4 text-[13px] leading-relaxed text-slate-700 dark:text-zinc-300 whitespace-pre-wrap font-sans bg-white dark:bg-zinc-950">{body}</pre>
    </div>
  );
}

export default function Page() {
  return (
    <BlogLayout post={post}>
      <p className="text-[16px] leading-loose font-medium text-slate-800 dark:text-zinc-100">
        工事前の近隣挨拶は、騒音・振動トラブルを未然に防ぐ最も効果的な方法です。この記事では、解体・新築・リフォーム・外壁塗装の4種類の挨拶文を<strong>そのままコピペで使える例文テンプレート</strong>として掲載しています。宛名や日付を差し替えるだけで、すぐに挨拶回り・ポスト投函に使えます。
      </p>

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 入力するだけで自動作成</p>
        <Link href="/tools/neighbor-greeting" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          工事近隣挨拶文メーカー → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">工事種別を選んで情報を入れるだけ。登録不要・印刷/PDF対応。フォーム入力だけでWord形式のダウンロードも可能です。</p>
      </div>

      <h2>挨拶文に必ず書くべき5項目</h2>
      <ul className="space-y-2">
        <li><strong>① 工事名称・内容</strong>：何の工事か一目でわかる名称（例：解体工事のお知らせ）</li>
        <li><strong>② 工事期間</strong>：着工日〜完了予定日。天候による延長の可能性も一言添える</li>
        <li><strong>③ 作業時間帯</strong>：例「8:00〜17:00（日曜・祝日は休工）」</li>
        <li><strong>④ 施主名（発注者）</strong>：誰の工事かを明記すると近隣の安心感が違います</li>
        <li><strong>⑤ 施工業者名・緊急連絡先</strong>：問い合わせ・苦情の窓口。担当者名まで書くと丁寧</li>
      </ul>

      <h2>例文①：解体工事の挨拶文</h2>
      <p>騒音・振動・粉じんが最も出やすい工事です。対策内容（散水・防音シート）まで書くのがポイントです。</p>
      <TemplateCard
        badge="解体"
        title="解体工事のお知らせ（コピペ用）"
        body={`ご近隣の皆様へ

解体工事のお知らせ

拝啓　時下ますますご清栄のこととお慶び申し上げます。
このたび、下記のとおり建物の解体工事を行うこととなりました。
工事期間中は、騒音・振動・粉じん等でご迷惑をおかけすることがあるかと存じますが、防音シートの設置・散水等の対策を講じ、細心の注意を払って作業を進めてまいります。
何卒ご理解ご協力を賜りますようお願い申し上げます。

敬具

記
工事名称：木造家屋解体工事
工事場所：〇〇市〇〇町〇丁目〇番〇号
工事期間：〇年〇月〇日（〇）〜〇年〇月〇日（〇）予定
作業時間：午前8時〜午後5時（日曜・祝日は休工）
施主：〇〇 〇〇
施工業者：株式会社〇〇工務店
緊急連絡先：000-0000-0000（担当：〇〇）

以上`}
      />

      <h2>例文②：新築工事の挨拶文</h2>
      <p>工期が長いため、基礎工事・上棟など騒音の大きい時期を伝えておくとトラブルを防げます。</p>
      <TemplateCard
        badge="新築"
        title="新築工事のお知らせ（コピペ用）"
        body={`ご近隣の皆様へ

新築工事のご挨拶

拝啓　時下ますますご清栄のこととお慶び申し上げます。
このたび、下記の場所にて住宅の新築工事を行うこととなりました。
工事期間中は、工事車両の出入りや騒音等でご迷惑をおかけすることがあるかと存じますが、安全対策を徹底し、周辺環境に配慮しながら作業を進めてまいります。
完成後はこの地でお世話になります。何卒ご理解ご協力を賜りますようお願い申し上げます。

敬具

記
工事名称：〇〇様邸 新築工事
工事場所：〇〇市〇〇町〇丁目〇番〇号
工事期間：〇年〇月〇日（〇）〜〇年〇月〇日（〇）予定
作業時間：午前8時〜午後5時（日曜・祝日は休工）
※基礎工事（〇月上旬）・上棟（〇月中旬）の際は特に音が出る場合がございます
施主：〇〇 〇〇
施工業者：株式会社〇〇ホーム
緊急連絡先：000-0000-0000（担当：〇〇）

以上`}
      />

      <h2>例文③：リフォーム工事の挨拶文</h2>
      <p>居住しながらの工事が多く、工事車両の駐車位置についても触れておくと親切です。</p>
      <TemplateCard
        badge="リフォーム"
        title="リフォーム工事のお知らせ（コピペ用）"
        body={`ご近隣の皆様へ

リフォーム工事のお知らせ

拝啓　時下ますますご清栄のこととお慶び申し上げます。
このたび、自宅の改修（リフォーム）工事を下記のとおり行うこととなりました。
工事期間中は、資材の搬入出や作業音等でご迷惑をおかけすることがあるかと存じますが、できる限り騒音を抑え、短期間で完了するよう努めてまいります。
何卒ご理解ご協力を賜りますようお願い申し上げます。

敬具

記
工事名称：住宅リフォーム工事（内装・水回り改修）
工事場所：〇〇市〇〇町〇丁目〇番〇号
工事期間：〇年〇月〇日（〇）〜〇年〇月〇日（〇）予定
作業時間：午前9時〜午後5時（土日祝は休工）
※工事車両は〇〇に駐車いたします
施主：〇〇 〇〇
施工業者：株式会社〇〇リフォーム
緊急連絡先：000-0000-0000（担当：〇〇）

以上`}
      />

      <h2>例文④：外壁塗装工事の挨拶文</h2>
      <p>塗料の臭い・飛散防止ネット・洗濯物への注意など、塗装特有の配慮事項を入れましょう。</p>
      <TemplateCard
        badge="外壁塗装"
        title="外壁塗装工事のお知らせ（コピペ用）"
        body={`ご近隣の皆様へ

外壁塗装工事のお知らせ

拝啓　時下ますますご清栄のこととお慶び申し上げます。
このたび、下記のとおり外壁塗装工事を行うこととなりました。
工事期間中は、足場の設置・解体時の音や、塗料の臭いなどでご迷惑をおかけすることがあるかと存じます。塗料の飛散防止ネットを設置し、細心の注意を払って作業いたしますが、期間中は洗濯物の外干しにご注意いただけますと幸いです。
何卒ご理解ご協力を賜りますようお願い申し上げます。

敬具

記
工事名称：外壁・屋根塗装工事
工事場所：〇〇市〇〇町〇丁目〇番〇号
工事期間：〇年〇月〇日（〇）〜〇年〇月〇日（〇）予定（天候により延長の場合あり）
作業時間：午前8時30分〜午後5時（日曜は休工）
施主：〇〇 〇〇
施工業者：株式会社〇〇塗装
緊急連絡先：000-0000-0000（担当：〇〇）

以上`}
      />

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 宛名・日付を入力するだけで完成</p>
        <Link href="/tools/neighbor-greeting" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          工事近隣挨拶文メーカー → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">上の例文がフォーム入力で自動生成されます。印刷・PDF保存対応。フォーム入力だけでWord形式のダウンロードも可能です。</p>
      </div>

      <h2>挨拶回りのマナー：タイミング・範囲・粗品</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">項目</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">目安</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-left">ポイント</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["タイミング", "着工の1週間〜3日前", "直前すぎると「聞いていない」という不満につながる"],
              ["訪問範囲", "向こう三軒両隣＋裏3軒", "解体・大規模工事は騒音の届く2軒隣まで広げる"],
              ["訪問時間帯", "土日の10〜17時", "平日日中は不在が多い。食事時間帯は避ける"],
              ["粗品", "500〜1,000円の実用品", "タオル・洗剤・お菓子など。のしは「御挨拶」"],
              ["不在時", "2回訪問→ポスト投函", "投函用に連絡先明記の書面を用意しておく"],
              ["誰が行くか", "施主＋施工業者が理想", "少なくとも施工業者が回るのが業界慣行"],
            ].map(([item, guide, point], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 font-medium">{item}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-blue-600 dark:text-blue-400">{guide}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-4 py-2 text-[13px]">{point}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>よくある失敗と対処法</h2>
      <ul className="space-y-2">
        <li><strong>工期が延びたのに連絡しなかった</strong>：延長が決まった時点で改めてお知らせを配布しましょう。「予定」と明記しておくことも保険になります。</li>
        <li><strong>連絡先が施主の携帯だけ</strong>：苦情の一次窓口は施工業者にするのが原則です。施主に直接クレームが行くと関係がこじれやすくなります。</li>
        <li><strong>粗品だけ渡して書面を渡さなかった</strong>：口頭だけでは工期や連絡先が伝わりません。必ず書面を添えましょう。</li>
        <li><strong>アパート・マンションの各戸を飛ばした</strong>：集合住宅は管理会社・大家に加え、影響のある階の各戸にも投函しておくと丁寧です。</li>
      </ul>

      <div className="my-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
        <p className="text-[14px] text-amber-800 dark:text-amber-300 font-medium">💡 ポイント: 解体工事では自治体によって「解体工事のお知らせ」標識の設置や事前周知が条例で義務付けられている場合があります（例：東京都の解体工事計画の事前周知制度）。着工前に自治体のルールを確認しましょう。</p>
      </div>

      <hr className="border-slate-100 dark:border-zinc-800 my-2" />
      <h2>関連ツール・記事</h2>
      <ul className="space-y-2">
        <li><Link href="/tools/neighbor-greeting">工事近隣挨拶文メーカー｜入力するだけで挨拶文を自動作成</Link></li>
        <li><Link href="/tools/exterior-paint-calculator">外壁塗装 費用計算ツール｜坪数から工事費を自動算出</Link></li>
        <li><Link href="/tools/construction-estimate">建設工事 見積書作成ツール</Link></li>
      </ul>

      <div className="my-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
        <p className="text-[13px] font-semibold text-blue-600 dark:text-blue-400 mb-1">🔧 このツールで今すぐ作成</p>
        <Link href="/tools/neighbor-greeting" className="text-[17px] font-bold text-blue-700 dark:text-blue-300 hover:opacity-80">
          工事近隣挨拶文メーカー → 無料で使う
        </Link>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">登録不要・ブラウザ完結・印刷/PDF対応</p>
      </div>
    </BlogLayout>
  );
}
