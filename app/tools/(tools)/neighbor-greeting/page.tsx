import type { Metadata } from "next";
import Link from "next/link";
import { generateMeta } from "@/lib/seo";
import { NeighborGreeting } from "./NeighborGreeting";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateMeta({
  title: "工事の近隣挨拶文・お知らせ掲示文メーカー【無料】解体・新築・リフォーム・外壁塗装の例文と施主向け着工案内",
  description: "工事の種類・期間・会社情報を入れるだけで、近隣挨拶状・現場掲示用の「工事のお知らせ」・施主様への着工案内の3種類を自動作成。解体・新築・リフォーム・外壁塗装・防水・店舗内装など10種類の工事に対応し、騒音・粉じん・重機・休工日も自動で記載。Word・印刷対応、登録不要",
  path: "/tools/neighbor-greeting",
  ogImage: `/api/og?${new URLSearchParams({ title: "近隣挨拶文メーカー", icon: "📝", desc: "工事名・期間・会社名を入力して近隣への挨拶文を自動生成" }).toString()}`,
  keywords: [
    "工事 近隣 挨拶文",
    "工事 挨拶状 テンプレート",
    "解体工事 挨拶文 テンプレート",
    "近隣挨拶文 例文",
    "工事のお知らせ テンプレート",
    "リフォーム 近隣 挨拶",
    "外壁塗装 近隣 挨拶",
    "近隣 挨拶 工事 無料",
    "工事 着工 挨拶文",
    "工事 着工 近隣 挨拶",
    "工事 近所 挨拶文",
    "近隣挨拶文 テンプレート",
    "工事のお知らせ 掲示 テンプレート",
    "工事 お知らせ 張り紙",
    "着工 案内 施主",
    "防水工事 近隣 挨拶",
    "店舗 内装工事 お知らせ",
  ],
});

const seoContent = (
  <div className="space-y-8">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">工事近隣挨拶文メーカーの使い方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        工事の種類・住所・期間・作業時間・施工会社情報を入力するだけで、そのまま使えるプロらしい近隣挨拶文が自動生成されます。騒音レベル・重機使用・車両駐車などのチェック項目に応じて適切な説明文が自動挿入されます。ダウンロード不要・登録不要で、生成後すぐコピーまたは印刷できます。
      </p>
      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900/50">
        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">挨拶のタイミングと範囲の目安</p>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>・<strong>時期：</strong>工事開始の3〜7日前（遅くとも前日まで）</li>
          <li>・<strong>範囲：</strong>工事現場から半径50〜100m（通常10〜20軒が目安）</li>
          <li>・<strong>粗品：</strong>500〜1,000円程度のタオル・洗剤などを持参すると丁寧</li>
          <li>・<strong>留守時：</strong>挨拶文と名刺をポストに投函し、後日再訪または電話</li>
        </ul>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">工事種別の挨拶文例文（書き出し）</h2>
      <p className="text-sm text-slate-500 dark:text-zinc-400 mb-3">各工種に応じた挨拶文の書き出し例です。上のツールで詳細を入力すると、完全な文章を自動生成できます。</p>
      <div className="space-y-3 text-sm">
        {[
          {
            type: "解体工事",
            badge: "騒音・粉塵に注意",
            example: "拝啓　時下ますますご清栄のこととお慶び申し上げます。このたび、下記の場所におきまして解体工事を行うことになりました。工事期間中は騒音・振動・粉塵が発生し、近隣の皆様には多大なご迷惑をおかけすることと存じます。…",
            note: "防塵シートの設置状況、粉塵の車・洗濯物への飛散リスクを明記すると安心感が高まります。",
          },
          {
            type: "新築工事",
            badge: "重機・長工期に注意",
            example: "拝啓　時下ますますご清栄のこととお慶び申し上げます。このたび、下記住所に新築工事を施工させていただく運びとなりました。工事期間が長期にわたることから、基礎工事・鉄骨建方など各工程において騒音・振動が生じます。…",
            note: "クレーン車の使用日は特に案内を徹底。工期が3か月を超える場合は中間挨拶も検討してください。",
          },
          {
            type: "外壁塗装工事",
            badge: "塗料の臭気・飛散に注意",
            example: "拝啓　時下ますますご清栄のこととお慶び申し上げます。このたび、下記の建物にて外壁塗装工事を実施いたします。足場の組立・解体時の騒音および塗料の臭気・飛散について、近隣の皆様には格別のご理解をお願い申し上げます。…",
            note: "洗濯物への塗料飛散はクレームになりやすい点です。養生範囲・施工時間帯を挨拶文に明記してください。",
          },
          {
            type: "リフォーム工事",
            badge: "内容により騒音差あり",
            example: "拝啓　時下ますますご清栄のこととお慶び申し上げます。このたび、下記の建物にてリフォーム工事を実施いたします。工事期間中は資材の搬入・搬出や工事音により、皆様にご不便をおかけすることをお詫び申し上げます。…",
            note: "スケルトンリフォームは騒音が大きく、解体工事に準じた内容を記載することをお勧めします。",
          },
        ].map(({ type, badge, example, note }) => (
          <div key={type} className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <p className="font-semibold text-slate-800 dark:text-zinc-200">【{type}】</p>
              <span className="text-[11px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">{badge}</span>
            </div>
            <p className="text-slate-500 dark:text-zinc-500 text-[12px] italic leading-relaxed mb-2 bg-slate-50 dark:bg-zinc-800 rounded p-3">{example}</p>
            <p className="text-slate-500 dark:text-zinc-400 text-[12px]">💡 {note}</p>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3種類の文面の使い分け</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { title: "近隣挨拶状", body: "着工の3〜7日前に、工事現場の周辺のお宅へ手渡しまたはポストに投函する文面です。工事の内容・期間・作業時間・休工日と、騒音や粉じんへの配慮、連絡先を伝えます。" },
          { title: "掲示用お知らせ", body: "仮囲いや出入口、マンションの掲示板に貼る文面です。通りがかる方が立ち止まらずに読めるよう、工事名・期間・作業時間・連絡先を短くまとめます。" },
          { title: "施主様への着工案内", body: "工事を依頼したお客様に渡す文面です。工程に加えて、近隣挨拶の予定や、家具の移動・駐車スペースなど施主様にお願いしたいことを工事の種類に合わせて記載します。" },
        ].map((c) => (
          <div key={c.title} className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
            <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 mb-1.5">{c.title}</p>
            <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-relaxed">{c.body}</p>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">掲示用「工事のお知らせ」の書き方</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">掲示用のお知らせは、挨拶状よりも短く、遠くからでも要点が分かることが大切です。次の項目を上から順に並べると読みやすくなります。</p>
      <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-1.5 list-decimal list-inside mb-3">
        <li>見出し「工事のお知らせ」と、ご迷惑をおかけすることへのお詫び</li>
        <li>工事名称・工事場所</li>
        <li>工事期間・作業時間・休工日</li>
        <li>騒音・粉じん・車両の出入りなど、通行する方へのお願い</li>
        <li>施工会社名・担当者・電話番号（受付時間）</li>
      </ol>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">A4またはA3で印刷し、雨に濡れる場所ではクリアファイルやラミネートで保護します。工期や作業時間が変わったときは、掲示も忘れずに差し替えましょう。</p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">施主様への着工案内に入れておきたいこと</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">着工前に施主様と確認しておくと、工事中の行き違いやご近隣とのトラブルを防げます。ツールでは工事の種類に合わせて、次のようなお願いを自動で入れます。</p>
      <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1.5 mb-3">
        <li>・<strong className="text-slate-700 dark:text-zinc-300">解体工事</strong>：残置物の確認、電気・ガス・電話などの停止手続き（散水に使う水道は時期を相談）</li>
        <li>・<strong className="text-slate-700 dark:text-zinc-300">リフォーム・増築</strong>：工事箇所の周りの家具・貴重品の移動、電気・水道を借りる場合の確認</li>
        <li>・<strong className="text-slate-700 dark:text-zinc-300">外壁・屋根塗装、防水</strong>：窓の開閉や洗濯物を控える日、屋上・バルコニーに立ち入れない期間</li>
        <li>・<strong className="text-slate-700 dark:text-zinc-300">外構・設備</strong>：駐車場や出入口が使えない日、断水・停電の日時</li>
        <li>・<strong className="text-slate-700 dark:text-zinc-300">共通</strong>：近隣挨拶の範囲と同行の有無、工事車両の駐車スペース</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">着工前の近隣挨拶はいつ・どこまで回る？</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        「工事着工挨拶」は、実際に重機やトラックが入る<strong className="text-slate-800 dark:text-zinc-200">着工日の3〜7日前</strong>までに済ませるのが基本です。着工当日にいきなり工事音が聞こえて驚かせてしまうと、その後の関係が悪化しやすいため、余裕を持った日程で回りましょう。
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 mb-1.5">戸建てが多い近所の場合</p>
          <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-relaxed">向こう三軒両隣に加え、道を挟んだ向かいの家、工事車両が通る経路沿いの家も対象に含めます。裏の家（背面）も騒音の影響を受けやすいため忘れずに。</p>
        </div>
        <div className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
          <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 mb-1.5">マンション・アパートが近い場合</p>
          <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-relaxed">全戸訪問が難しい場合は、管理会社・管理組合を通じて掲示板への掲示を依頼し、あわせて工事現場に最も近い低層階・隣接する棟には個別に挨拶するのが丁寧です。</p>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        なお「着工挨拶」と「近隣挨拶」はほぼ同じ意味で使われますが、工期が3ヶ月を超える大規模な新築・改修工事では、<strong className="text-slate-800 dark:text-zinc-200">着工時の挨拶</strong>に加えて、大きな騒音を伴う工程（基礎工事・解体・足場架設など）に入る前に<strong className="text-slate-800 dark:text-zinc-200">中間の再挨拶</strong>を行うと、近所からの印象がより良くなります。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">近隣挨拶文に必ず記載する項目</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-zinc-800">
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">記載項目</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">記載例</th>
              <th className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-left">必要度</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["工事場所", "○○市△△町1-2-3", "必須"],
              ["工事の種類", "外壁塗装工事 / 解体工事 など", "必須"],
              ["工事期間", "2026年8月1日〜8月31日（予定）", "必須"],
              ["作業時間", "平日 8:00〜17:00", "必須"],
              ["施工会社名・担当者", "株式会社〇〇建設　担当：山田", "必須"],
              ["緊急連絡先", "090-XXXX-XXXX（現場担当）", "必須"],
              ["騒音・粉塵の有無", "コンプレッサー使用あり、粉塵対策として防塵シート設置", "推奨"],
              ["重機・クレーン使用予定", "クレーン車使用日：8月5日・8月10日", "推奨"],
              ["駐車場所", "近隣駐車場を使用します", "推奨"],
            ].map(([item, example, level], i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-slate-50 dark:bg-zinc-900" : ""}>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 font-medium">{item}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2 text-slate-500 dark:text-zinc-500 text-[12px]">{example}</td>
                <td className="border border-slate-200 dark:border-zinc-700 px-3 py-2">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${level === "必須" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" : "bg-slate-100 dark:bg-zinc-700 text-slate-500 dark:text-zinc-400"}`}>{level}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3 text-sm">
        {[
          { q: "近隣挨拶は法律で義務付けられていますか？", a: "法的な義務ではありませんが、建設業界の慣習として広く行われています。近隣トラブルを未然に防ぐためにも強く推奨されます。特に解体・新築・外壁塗装工事では必須と考えてください。" },
          { q: "留守の場合はどうすればいい？", a: "ポストに挨拶状（文書）と名刺・粗品を置いていく方法が一般的です。訪問した旨のメモも添えると丁寧です。後日電話で一声かけるとなお好印象です。" },
          { q: "マンションの工事の場合は？", a: "掲示板への掲示と管理会社経由の周知が基本です。管理組合・管理会社への事前届出が必要な場合も多いです。本ツールの「マンション大規模修繕」プリセットを選ぶと、掲示用の文面を作成できます。" },
          { q: "現場に貼る「工事のお知らせ」も作れますか？", a: "作れます。上部で「掲示用お知らせ」を選ぶと、工事名・期間・作業時間・休工日・連絡先を短くまとめた掲示用の文面になります。A4・A3で印刷して仮囲いや掲示板に貼ってください。" },
          { q: "施主様に渡す着工案内も作れますか？", a: "作れます。「施主様への着工案内」を選ぶと、工程と近隣挨拶の予定に加えて、工事の種類に合わせたお願い（家具の移動、駐車スペース、停止手続きなど）を入れた文面になります。" },
          { q: "生成した文章をそのまま使えますか？", a: "そのまま使えるよう設計しています。実際の工事内容・状況に合わせて必要に応じて修正してください。「追加で伝えたいこと」欄で個別の事情を追記することをお勧めします。" },
          { q: "Word形式でダウンロードできますか？", a: "できます。「Word形式でダウンロード」ボタンから.docファイルとして保存でき、Wordで開いてそのまま編集・印刷できます。無料・登録不要です。コピー・印刷ボタンも利用できます。" },
        ].map(({ q, a }) => (
          <div key={q} className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4">
            <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">Q. {q}</p>
            <p className="text-slate-500 dark:text-zinc-400">A. {a}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
        そのままコピペで使える例文集は<Link href="/blog/construction-greeting-templates" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">工事の近隣挨拶文 例文テンプレート集</Link>へ。解体・新築・リフォーム・外壁塗装の完成例文を掲載しています。
        訪問の順番や話す内容で迷ったら<Link href="/blog/construction-kicko-aisatsu-guide" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">着工前の挨拶回り、失敗しない手順ガイド</Link>もあわせてご覧ください。
      </p>
    </section>
  </div>
);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "工事前の近隣挨拶は法律で義務付けられていますか？",
      acceptedAnswer: { "@type": "Answer", text: "法的な義務ではありませんが、建設業界の慣習として広く行われています。近隣トラブルを未然に防ぐためにも強く推奨されます。特に解体・新築・外壁塗装工事では必須と考えてください。" },
    },
    {
      "@type": "Question",
      name: "工事前の近隣挨拶はいつまでに行えばいいですか？",
      acceptedAnswer: { "@type": "Answer", text: "工事開始の3〜7日前が目安です。遅くとも前日までに済ませてください。対象範囲は工事現場から半径50〜100m（通常10〜20軒）です。" },
    },
    {
      "@type": "Question",
      name: "着工挨拶と近隣挨拶は同じものですか？",
      acceptedAnswer: { "@type": "Answer", text: "同じ意味で使われることがほとんどです。実際に工事車両や重機が入る着工日の3〜7日前までに近所へ挨拶を済ませておくのが基本です。工期が3ヶ月を超える大規模工事では、着工時の挨拶に加えて騒音の大きい工程（解体・基礎工事など）の前に中間の再挨拶を行うと印象が良くなります。" },
    },
    {
      "@type": "Question",
      name: "解体工事の近隣挨拶文に必要な内容は何ですか？",
      acceptedAnswer: { "@type": "Answer", text: "工事場所・工事種別・工事期間・作業時間・施工会社名・担当者・緊急連絡先が必須項目です。解体工事では騒音・振動・粉塵の発生と防塵シートの設置も明記すると安心感が高まります。" },
    },
    {
      "@type": "Question",
      name: "近隣に留守の方がいた場合はどうすればいいですか？",
      acceptedAnswer: { "@type": "Answer", text: "ポストに挨拶状（文書）と名刺・粗品を置いていく方法が一般的です。訪問した旨のメモも添えると丁寧です。後日電話で一声かけるとなお好印象です。" },
    },
    {
      "@type": "Question",
      name: "マンションの工事の場合は？",
      acceptedAnswer: { "@type": "Answer", text: "掲示板への掲示と管理会社経由の周知が基本です。本ツールのマンション大規模修繕プリセットを選ぶと、掲示用の文面を作成できます。" },
    },
    {
      "@type": "Question",
      name: "現場に貼る「工事のお知らせ」も作れますか？",
      acceptedAnswer: { "@type": "Answer", text: "作れます。上部で「掲示用お知らせ」を選ぶと、工事名・期間・作業時間・休工日・連絡先を短くまとめた掲示用の文面になります。A4・A3で印刷して仮囲いや掲示板に貼ってください。" },
    },
    {
      "@type": "Question",
      name: "施主様に渡す着工案内も作れますか？",
      acceptedAnswer: { "@type": "Answer", text: "作れます。「施主様への着工案内」を選ぶと、工程と近隣挨拶の予定に加えて、工事の種類に合わせたお願い（家具の移動、駐車スペース、停止手続きなど）を入れた文面になります。" },
    },
    {
      "@type": "Question",
      name: "Word形式でダウンロードできますか？",
      acceptedAnswer: { "@type": "Answer", text: "できます。「Word形式でダウンロード」ボタンから.docファイルとして保存でき、Wordでそのまま編集・印刷できます。無料・登録不要です。" },
    },
  ],
};

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="工事近隣挨拶文メーカー"
        description="工事の種類・期間・会社情報を入れるだけで、近隣挨拶状・掲示用の工事のお知らせ・施主様への着工案内を自動作成。10種類の工事に対応し、コピー・Word・印刷ができます。"
        icon="📝"
        slug="neighbor-greeting"
        seoContent={seoContent}
      >
        <NeighborGreeting />
      </ToolLayout>
    </>
  );
}
