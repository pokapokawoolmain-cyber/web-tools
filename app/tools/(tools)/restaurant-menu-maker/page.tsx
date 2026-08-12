import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { RestaurantMenuMaker } from "./RestaurantMenuMaker";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generateMeta({
  title: "メニュー表作成ツール｜飲食店・カフェ・居酒屋向け無料テンプレート",
  description:
    "飲食店向けのメニュー表を無料で作成できます。カフェ、居酒屋、和食、バー、定食屋などのデザインテーマに対応。横書き・縦書き、税込・税抜入力、A4印刷・PDF保存にも対応したブラウザ完結型のメニュー表作成ツールです。",
  path: "/tools/restaurant-menu-maker",
  ogImage: `/api/og?${new URLSearchParams({ title: "メニュー表作成ツール", icon: "📋", desc: "カテゴリ・メニュー名・価格・説明・アレルギー情報を入力し" }).toString()}`,
  keywords: [
    "メニュー表 作成 無料",
    "飲食店 メニュー表",
    "カフェ メニュー 作成",
    "居酒屋 メニュー表",
    "縦書き メニュー表",
    "税込 税抜 自動計算",
    "A4 メニュー表 印刷",
    "メニュー表 テンプレート",
  ],
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "縦書きのメニュー表は作れますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい。レイアウト方向で「縦書き」を選ぶと、居酒屋・和食・割烹向けの縦組みメニュー表が作れます。価格は読みやすい形で縦書きに配置されます。",
      },
    },
    {
      "@type": "Question",
      name: "横書きと縦書きはどちらがおすすめですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "カフェ・バー・ファミレス・町中華には横書きが読みやすく向いています。居酒屋・和食・割烹・蕎麦屋には縦書きが雰囲気に合います。テーマを選ぶとレイアウト方向が自動的に切り替わります。",
      },
    },
    {
      "@type": "Question",
      name: "税込価格と税抜価格は選べますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい。価格の表示形式で「税込価格のみ」「税抜 + 税込を併記」「税込 + 税抜を小さく」の3パターンから選べます。",
      },
    },
    {
      "@type": "Question",
      name: "税抜で入力して税込価格を自動計算できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい。価格入力の基準で「税抜で入力」を選ぶと、10%・8%・任意税率で税込価格を自動計算してプレビューと印刷に反映します。端数処理も四捨五入・切り捨て・切り上げから選べます。",
      },
    },
    {
      "@type": "Question",
      name: "A4で印刷できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい。A4縦を基本に最適化しています。印刷時は入力フォームや広告が自動的に非表示になり、メニュー表のみが出力されます。ブラウザの印刷ダイアログで「背景のグラフィック」をオンにすると色も正確に印刷されます。",
      },
    },
    {
      "@type": "Question",
      name: "カフェ風や居酒屋風のデザインにできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい。モダンカフェ・ナチュラルカフェ・居酒屋・和食・バー・喫茶店レトロ・町中華・ファミリーレストランなど10種類のテーマから選べます。テーマごとに背景・フォント・余白・カテゴリ見出しのスタイルが変わります。",
      },
    },
    {
      "@type": "Question",
      name: "作ったメニュー表は商用利用できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい。実店舗での商用利用を前提として提供しているツールです。印刷・PDF保存・店頭掲示に制限はありません。",
      },
    },
    {
      "@type": "Question",
      name: "入力内容はサーバーに送信されますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "送信されません。入力内容はブラウザのローカルストレージのみに保存されます。外部サーバーへのデータ送信は一切行いません。",
      },
    },
    {
      "@type": "Question",
      name: "スマホだけでメニュー表を作れますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい。スマートフォンのブラウザから操作できます。アプリや会員登録は不要です。ただし、印刷・PDF保存はスマホからでも可能ですが、PC・Macからの操作がより快適です。",
      },
    },
    {
      "@type": "Question",
      name: "テイクアウト価格にも対応できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "メニュー項目ごとに「テイクアウト可」チェックが付けられます。店内と持ち帰りで税率が異なる場合は注記欄に記載することをおすすめします。税率の違いによる価格計算は現在未対応です（任意の税率を設定することは可能です）。",
      },
    },
    {
      "@type": "Question",
      name: "アレルギー情報は表示できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい。メニュー項目ごとにアレルギー情報を入力でき、プレビューと印刷時に小さく表示されます。7大アレルゲン（小麦・そば・卵・乳・落花生・えび・かに）を中心に記載することを推奨します。",
      },
    },
  ],
};

const seoContent = (
  <div className="space-y-10">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
        メニュー表で伝えるべき情報
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        お客様がメニューを見て注文を決めるまでに、必要な情報が揃っているかどうかが売上に直結します。最低限以下の要素を含めることを推奨します。
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          {
            icon: "📝",
            title: "商品名",
            body: "正式名称だけでなく、素材や産地を短く添えると注文率が上がります。「国産豚の生姜焼き」のように。",
          },
          {
            icon: "💴",
            title: "税込価格",
            body: "消費者向けメニューでは税込の総額表示が原則です。税抜表示のみは避け、税込価格を必ず明示してください。",
          },
          {
            icon: "📖",
            title: "説明文",
            body: "1〜2行に収める。長すぎる説明文は読まれません。調理法・素材・特徴だけを端的に。",
          },
          {
            icon: "⚠️",
            title: "アレルギー情報",
            body: "7大アレルゲン（小麦・そば・卵・乳・落花生・えび・かに）を中心に記載。「含む設備で製造」も明記を。",
          },
          {
            icon: "⭐",
            title: "おすすめマーク",
            body: "推し商品を目立たせると視線が集まります。全メニューにつけると効果が薄れるため、2〜3品に絞るのが基本。",
          },
          {
            icon: "🥡",
            title: "テイクアウト可否",
            body: "飲食とテイクアウトで税率が異なる場合は、注記で明示するか、テイクアウト価格を別欄に記載してください。",
          },
        ].map(({ icon, title, body }) => (
          <div
            key={title}
            className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-3.5 flex gap-3"
          >
            <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-zinc-200 text-xs mb-0.5">
                {title}
              </p>
              <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
        業態別おすすめデザインテーマ
      </h2>
      <div className="space-y-2">
        {[
          {
            biz: "カフェ・コーヒースタンド",
            theme: "モダンカフェ",
            why: "ベージュとブラウンの落ち着いた色調に英字カテゴリが映えます。余白多めで写真なしでも雰囲気が出るデザインです。",
          },
          {
            biz: "オーガニック・ベーカリー・スイーツ",
            theme: "ナチュラルカフェ",
            why: "生成り背景にグリーンアクセント。手作り感、自然素材を大切にするお店の空気感を表現します。",
          },
          {
            biz: "純喫茶・昭和レトロ喫茶",
            theme: "喫茶店レトロ",
            why: "クリーム色背景に二重罫線。ナポリタン・プリン・コーヒーが絵になる昭和クラシックなデザインです。",
          },
          {
            biz: "居酒屋・焼き鳥・海鮮",
            theme: "居酒屋",
            why: "和紙風背景に赤いアクセントバー。縦書きデフォルトで、短冊スタイルのメニューがそのまま使えます。",
          },
          {
            biz: "和食・寿司・蕎麦・割烹",
            theme: "和食・割烹",
            why: "余白を広く取った明朝体レイアウト。縦書きで品格が出るため、懐石や蕎麦屋の格調ある一枚になります。",
          },
          {
            biz: "バー・ワインバー・ビストロ",
            theme: "バー・ビストロ",
            why: "黒背景にゴールドの文字。夜の営業にふさわしい上品さで、グラスワインや季節のパスタを引き立てます。",
          },
          {
            biz: "定食屋・ファミレス",
            theme: "ファミリーレストラン",
            why: "明るいオレンジ系で見やすさ重視。大きめの価格表示でシニア層にも読みやすいデザインです。",
          },
          {
            biz: "町中華・ラーメン・食堂",
            theme: "町中華・定食屋",
            why: "赤と白で力強く。情報量が多くても読みやすいカテゴリ分けができます。",
          },
          {
            biz: "レストラン・ホテル・予約制",
            theme: "ミニマル高級店",
            why: "極限まで余白を広げ、装飾を排したコース仕様。コースメニューやアラカルトに品格を添えます。",
          },
        ].map(({ biz, theme, why }) => (
          <div
            key={biz}
            className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-3.5"
          >
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">{biz}</span>
              <span className="text-[10px] bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full">
                {theme}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{why}</p>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
        横書きと縦書きの使い分け
      </h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 p-4">
          <p className="font-bold text-blue-800 dark:text-blue-300 text-sm mb-2">
            横書きが向いている業態
          </p>
          <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
            <li>・カフェ、コーヒースタンド</li>
            <li>・バー、ビストロ</li>
            <li>・ファミリーレストラン</li>
            <li>・町中華、定食屋</li>
            <li>・ベーカリー、スイーツ店</li>
          </ul>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 leading-relaxed">
            英語メニュー名や価格の表示が自然で、左から右の視線誘導がしやすい。
          </p>
        </div>
        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 p-4">
          <p className="font-bold text-amber-800 dark:text-amber-300 text-sm mb-2">
            縦書きが向いている業態
          </p>
          <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
            <li>・居酒屋、焼き鳥、海鮮居酒屋</li>
            <li>・和食、割烹、寿司</li>
            <li>・蕎麦屋、懐石料理</li>
            <li>・純喫茶、昭和レトロ喫茶</li>
          </ul>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 leading-relaxed">
            日本語の商品名が映えて、和の雰囲気を自然に演出できます。
          </p>
        </div>
      </div>
      <div className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4 text-sm">
        <p className="font-semibold text-slate-700 dark:text-zinc-300 mb-1">
          縦書き時の価格・英数字に注意
        </p>
        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
          縦書きでは「¥」「1,100」などの英数字が縦に並びやすく、読みにくくなる場合があります。このツールでは価格を縦組みで配置しており、なるべく読みやすくなるよう設計していますが、英字が多いメニュー名を縦書きで使う場合は短めの名称に調整することをおすすめします。
        </p>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
        税込・税抜表示の注意点
      </h2>
      <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-4 mb-4">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
          消費者向けメニューでは税込の総額表示が基本です
        </p>
        <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
          消費税転嫁対策特別措置法の経過措置期間終了後、消費者が最終的に支払う税込価格をわかりやすく表示することが求められています。実際の運用・法的確認は必ず店舗側で行ってください。
        </p>
      </div>
      <div className="space-y-2 text-sm">
        {[
          {
            title: "税込価格のみ表示（推奨）",
            body: "「¥1,100」のようにシンプルに税込価格だけを表示します。お客様が追加計算不要で、最も混乱が少ない表示方法です。",
          },
          {
            title: "税抜 + 税込を併記",
            body: "「¥1,000（税込¥1,100）」と表示します。仕入れ価格との比較や業者向け帳票を兼ねる場合に使われることがあります。",
          },
          {
            title: "テイクアウトと店内飲食の税率が異なる場合",
            body: "店内飲食は10%、持ち帰りは8%です。本ツールでは税率を手動設定できます。価格が異なる場合は注記欄に「テイクアウト価格は別途お問い合わせください」などと記載することを推奨します。",
          },
        ].map(({ title, body }) => (
          <div
            key={title}
            className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-3.5"
          >
            <p className="font-semibold text-slate-800 dark:text-zinc-200 text-xs mb-0.5">
              {title}
            </p>
            <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
        読まれやすいメニュー表を作るコツ
      </h2>
      <div className="space-y-3">
        {[
          {
            no: "1",
            tip: "カテゴリは3〜5個が目安",
            body: "多すぎるカテゴリはお客様が迷います。「フード・ドリンク・デザート」など3〜5分類に整理すると見通しが良くなります。",
          },
          {
            no: "2",
            tip: "説明文は1〜2行に収める",
            body: "長い説明文は読まれません。「国産豚・生姜醤油・野菜添え」のように素材と特徴を端的に。詳しくはスタッフが説明する形が理想です。",
          },
          {
            no: "3",
            tip: "価格を探しやすくする",
            body: "横書きでは右揃えで統一、縦書きでは各品目の下に配置します。価格のフォントサイズを商品名より少し小さくすると見やすくなります。",
          },
          {
            no: "4",
            tip: "おすすめは絞る",
            body: "全商品を「おすすめ」にしても何も目立ちません。お店の看板商品・季節の推し・利益率の高いものを2〜3品に絞ってください。",
          },
          {
            no: "5",
            tip: "印刷前にスマホと紙でダブルチェック",
            body: "画面上では読めても、印刷すると文字が小さすぎる場合があります。必ず実際に印刷して、A4を手に持ったときの読みやすさを確認してください。",
          },
          {
            no: "6",
            tip: "ラミネートで長持ち",
            body: "テーブルメニューは汚れやすいため、ラミネート加工すると清潔感が保てます。100円ショップのラミネートフィルムでも十分です。",
          },
        ].map(({ no, tip, body }) => (
          <div
            key={no}
            className="flex gap-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4"
          >
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-xs font-bold flex items-center justify-center">
              {no}
            </span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-0.5 text-sm">
                {tip}
              </p>
              <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
        よくある失敗例と対策
      </h2>
      <div className="space-y-2">
        {[
          {
            fail: "色だけ派手で読みにくい",
            fix: "テーマを選んだあと、実際に印刷して文字が読めるか確認してください。バー・居酒屋などダーク系テーマは「背景のグラフィック」をオンにしないと印刷で色が出ません。",
          },
          {
            fail: "価格が見つけにくい",
            fix: "横書きでは価格を右端に揃え、縦書きでは品目の下に配置します。価格フォントは商品名と明確に区別されていると探しやすくなります。",
          },
          {
            fail: "説明文が長すぎて詰まる",
            fix: "説明文は一言が理想です。素材・産地・調理法のいずれか一点に絞りましょう。縦書きでは特に詰まりやすいため、短くまとめることが重要です。",
          },
          {
            fail: "税込か税抜か曖昧",
            fix: "注記欄に「表示価格はすべて税込です」と明記してください。このツールは価格表示形式に応じた注記を自動で提案します。",
          },
          {
            fail: "縦書きで英数字が横倒しになる",
            fix: "縦書き時に英字メニュー名があると読みにくくなります。英語メニュー名は短くするか、カタカナ表記に変えることで改善できます。",
          },
        ].map(({ fail, fix }) => (
          <div
            key={fail}
            className="rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-3.5"
          >
            <p className="text-xs text-red-500 dark:text-red-400 font-semibold mb-0.5">
              ✗ {fail}
            </p>
            <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">→ {fix}</p>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">よくある質問</h2>
      <div className="space-y-3">
        {[
          {
            q: "縦書きのメニュー表は作れますか？",
            a: "はい。レイアウト方向で「縦書き」を選ぶと居酒屋・和食・割烹向けの縦組みレイアウトになります。テーマを「居酒屋」か「和食・割烹」に変えると自動で縦書きになります。",
          },
          {
            q: "税抜入力で税込を自動計算できますか？",
            a: "はい。価格設定で「税抜で入力」を選ぶと、10%・8%・任意税率で税込を自動計算します。端数は四捨五入・切り捨て・切り上げから選べます。",
          },
          {
            q: "カフェ風や居酒屋風のデザインにできますか？",
            a: "はい。モダンカフェ・ナチュラルカフェ・居酒屋・和食・バーなど10テーマを用意しています。テーマごとにフォント・余白・カテゴリ見出しのスタイルが変わります。",
          },
          {
            q: "入力内容はサーバーに送信されますか？",
            a: "送信されません。すべてブラウザのローカルストレージにのみ保存されます。機密性の高い価格情報も外部に出ません。",
          },
          {
            q: "アレルギー情報は表示できますか？",
            a: "はい。メニュー項目ごとに入力できます。プレビューと印刷時に小さく注意表示されます。",
          },
          {
            q: "作ったメニュー表は商用利用できますか？",
            a: "はい。実店舗での使用を前提に提供しています。印刷・PDF保存・店頭掲示に制限はありません。",
          },
          {
            q: "スマホだけで作れますか？",
            a: "はい。スマートフォンのブラウザで入力・プレビュー・印刷（PDF保存）まで操作できます。アプリや会員登録は不要です。",
          },
        ].map(({ q, a }) => (
          <div
            key={q}
            className="rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-4"
          >
            <p className="font-semibold text-slate-800 dark:text-zinc-200 text-sm mb-1">
              Q. {q}
            </p>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">A. {a}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default function Page() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <ToolLayout
        title="メニュー表作成ツール"
        description="カフェ・居酒屋・和食・バーなど10テーマ対応。縦書き・横書き切り替え、税込・税抜自動計算、A4印刷・PDF保存対応のブラウザ完結型メニュー表メーカー。"
        icon="📋"
        slug="restaurant-menu-maker"
        seoContent={seoContent}
      >
        <RestaurantMenuMaker />
      </ToolLayout>
    </>
  );
}
