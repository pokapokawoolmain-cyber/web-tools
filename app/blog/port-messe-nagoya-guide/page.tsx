import Link from "next/link";
import { getBlogPost } from "@/data/blog-posts";
import { mochicoArticleMeta } from "../_components/mochico/meta";
import {
  ArticleAd,
  Bubble,
  Card,
  FanVoices,
  Figure,
  H2,
  MochicoNudge,
  OfficialLinks,
  OshiArticleLayout,
  Sources,
  Stats,
  Tldr,
  Toc,
  oshiStyles as s,
  type TocItem,
} from "../_components/oshi/OshiArticle";

const post = getBlogPost("port-messe-nagoya-guide")!;

export const metadata = mochicoArticleMeta(post, [
  "ポートメッセなごや",
  "ポートメッセなごや ライブ",
  "ポートメッセなごや 帰り",
  "ポートメッセなごや あおなみ線 混雑",
  "ポートメッセなごや 第1展示館",
  "ポートメッセなごや ロッカー",
  "金城ふ頭 ライブ",
]);

const TOC: TocItem[] = [
  { id: "data", label: "まずは基本データ（展示場でのライブ）" },
  { id: "access", label: "行き：あおなみ線で金城ふ頭駅へ" },
  { id: "exit", label: "帰り：なぜあおなみ線はあんなに混むのか" },
  { id: "inside", label: "館内：ロッカー・Wi-Fi・飲食・喫煙所" },
  { id: "goods", label: "物販の日の動き方（米津玄師 GHOSTの例）" },
  { id: "links", label: "公式情報へのリンク" },
];

/** 自作の図：終演後の人数と、電車1本で運べる人数のイメージ */
function TrainMath() {
  const cols = 10;
  const total = 25;
  return (
    <svg viewBox="0 0 360 250" role="img" aria-labelledby="pm-title pm-desc">
      <title id="pm-title">終演後の観客を電車だけで運ぶと何本分になるか（イメージ）</title>
      <desc id="pm-desc">
        あおなみ線の4両1編成の定員は600人弱と言われている。約15,000人がすべて電車で帰ると、約25本分になる。普段は10〜15分に1本で、増発されても車両は8編成しかない。
      </desc>
      <text x="12" y="22" fontSize="12.5" fontWeight="900" fill="#1b1430">
        観客 約15,000人 ÷ 1本 約600人 ＝
      </text>
      <text x="348" y="22" fontSize="16" fontWeight="900" fill="#be185d" textAnchor="end">
        約25本分
      </text>
      {Array.from({ length: total }).map((_, i) => {
        const x = 12 + (i % cols) * 34;
        const y = 40 + Math.floor(i / cols) * 40;
        return (
          <g key={i}>
            <rect x={x} y={y} width="30" height="26" rx="6" fill={i < 8 ? "#7c4dff" : "#ddd2ff"} />
            <rect x={x + 5} y={y + 5} width="8" height="7" rx="1.5" fill="#fff" opacity="0.9" />
            <rect x={x + 17} y={y + 5} width="8" height="7" rx="1.5" fill="#fff" opacity="0.9" />
          </g>
        );
      })}
      <rect x="12" y="170" width="14" height="12" rx="3" fill="#7c4dff" />
      <text x="32" y="180" fontSize="11" fill="#3e3756">
        あおなみ線の車両は全部で8編成
      </text>
      <rect x="12" y="192" width="14" height="12" rx="3" fill="#ddd2ff" />
      <text x="32" y="202" fontSize="11" fill="#3e3756">
        残りは同じ車両が折り返してくるのを待つ
      </text>
      <text x="12" y="232" fontSize="10.5" fill="#625b7c">
        ※ 目安の数字から編集部が計算したイメージ
      </text>
    </svg>
  );
}

/** 自作の図：GHOST の日の動線（物販とライブで建物が違う） */
function HallFlow() {
  return (
    <svg viewBox="0 0 360 214" role="img" aria-labelledby="pf-title pf-desc">
      <title id="pf-title">米津玄師 GHOSTの日の動き方（物販とライブで建物が違う）</title>
      <desc id="pf-desc">
        あおなみ線の金城ふ頭駅に着いたら、物販は第3展示館、ライブは第1展示館。建物が違うので移動時間を見込む。
      </desc>
      <rect x="8" y="80" width="96" height="56" rx="14" fill="#e0f0ff" />
      <text x="56" y="104" fontSize="12" fontWeight="900" fill="#1b1430" textAnchor="middle">
        金城ふ頭駅
      </text>
      <text x="56" y="122" fontSize="10.5" fill="#1d5fae" fontWeight="700" textAnchor="middle">
        あおなみ線の終点
      </text>
      <path d="M104 100 L 140 54" stroke="#be185d" strokeWidth="4" strokeDasharray="2 7" strokeLinecap="round" />
      <path d="M104 118 L 140 164" stroke="#5a2fd2" strokeWidth="4" strokeDasharray="2 7" strokeLinecap="round" />
      <rect x="140" y="20" width="212" height="64" rx="14" fill="#ffe4f0" />
      <text x="154" y="44" fontSize="12.5" fontWeight="900" fill="#1b1430">
        ① 物販：第3展示館
      </text>
      <text x="154" y="66" fontSize="10.5" fill="#3e3756">
        12/8 12:00〜 ／ 12/9 13:00〜
      </text>
      <rect x="140" y="130" width="212" height="64" rx="14" fill="#efe9ff" />
      <text x="154" y="154" fontSize="12.5" fontWeight="900" fill="#1b1430">
        ② ライブ：第1展示館
      </text>
      <text x="154" y="176" fontSize="10.5" fill="#3e3756">
        開場 17:00 ／ 開演 18:30
      </text>
      <path d="M246 84 L 246 130" stroke="#625b7c" strokeWidth="2.5" markerEnd="url(#pfArrow)" />
      <defs>
        <marker id="pfArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0 0 L 8 4 L 0 8 z" fill="#625b7c" />
        </marker>
      </defs>
      <text x="254" y="112" fontSize="10.5" fill="#625b7c" fontWeight="700">
        建物が別
      </text>
    </svg>
  );
}

export default function Page() {
  return (
    <OshiArticleLayout
      post={post}
      heading={
        <>
          <mark>ポートメッセなごや</mark>ライブ完全ガイド：あおなみ線の混雑・帰り方・館内
        </>
      }
      heroLead="名古屋駅からあおなみ線で約24分。行きは楽でも、帰りは終点の金城ふ頭駅に1万人以上が集まります。なぜ混むのか、どう避けるのかを、ファンの分析と体験談をもとに図でまとめました。"
      stickers={["🚢 会場ガイド", "🚃 あおなみ線", "🚶 帰りの混雑", "🔐 ロッカー"]}
      unofficialNote="この記事は、ポートメッセなごやの公式サイトと、ファンのブログ・Q&Aなどの体験談をもとにToolBoxJP編集部がまとめた非公式のガイドです。会場の運営者とは関係ありません。図はすべて編集部が作った簡略図・イメージです。入口や動線はイベントごとに変わるので、主催者・会場の最新情報もあわせて確認してください（2026年11月8日時点の情報）。"
    >
      <p>
        名古屋港の金城ふ頭にある<strong>ポートメッセなごや</strong>（名古屋市国際展示場）は、ふだんは展示会の会場ですが、大きなライブの会場としても使われています。米津玄師さんの「GHOST」ツアーでも、12月8日・9日の2公演が<strong>第1展示館</strong>で予定されています。
      </p>
      <p>
        展示場なので、ドームやアリーナとは勝手が違います。とくに<span className={s.hl}>帰りのあおなみ線の混雑</span>は、行った人の多くが口をそろえるポイントです。
      </p>

      <Tldr
        items={[
          <>最寄りはあおなみ線の終点・金城ふ頭駅。名古屋駅から約24分。近くにバス停はない</>,
          <>終演後は駅に人が集中し、名古屋駅まで1〜2時間かかった体験談も。シャトルバス・時間ずらし・宿泊で分散を</>,
          <>ロッカーは第1展示館の2階と交流センターの1階。館内は禁煙で喫煙所は屋外</>,
        ]}
      />

      <Toc items={TOC} />

      <H2 id="data" num={1}>
        まずは基本データ（展示場でのライブ）
      </H2>
      <Stats
        items={[
          { num: <>24<small>分</small></>, label: "名古屋駅→金城ふ頭駅（あおなみ線）" },
          { num: <>20,160<small>㎡</small></>, label: "第1展示館の展示面積" },
          { num: <>5,848<small>席</small></>, label: "第1展示館の可動階段席" },
          { num: <>20<small>m</small></>, label: "天井の高さ（トラス下）" },
        ]}
      />
      <p>
        第1展示館の住所は名古屋市港区金城ふ頭三丁目2番1号。第2・第3展示館や交流センターは金城ふ頭二丁目にあり、<strong>建物が分かれています</strong>。チケットに書かれた展示館の名前を確認しておきましょう。
      </p>

      <H2 id="access" num={2}>
        行き：あおなみ線で金城ふ頭駅へ
      </H2>
      <ul>
        <li>
          <strong>電車：</strong>名古屋駅からあおなみ線で終点の金城ふ頭駅へ（各駅停車で約24分）。
        </li>
        <li>
          <strong>バス：</strong>公式サイトによると、会場の最寄りのバス停はありません。公演によってはシャトルバスが出ることがあるので、主催者に確認を。
        </li>
        <li>
          <strong>車：</strong>2022年10月から、一般の人は会場の立体駐車場を使えなくなり、<strong>金城ふ頭駐車場</strong>に集約されています。場所の予約はできません。
        </li>
      </ul>
      <Card kind="caution" label="コンサートの日は入口が変わることも">
        <p>公式サイトでは、コンサートなどの日は入口が違ったり、迂回のルートになったりする場合があるので、時間に余裕を持って来るよう案内されています。</p>
      </Card>

      <H2 id="exit" num={3}>
        帰り：なぜあおなみ線はあんなに混むのか
      </H2>
      <p>
        ファンの分析記事によると、あおなみ線は4両編成の電車が全部で8編成。ふだんは10〜15分に1本で、夜は貨物列車も同じ線路を走ります。ライブの日は臨時列車が出ますが、車両の数そのものに限りがあります。
      </p>
      <Figure caption="編集部作成のイメージ。定員・編成数はファンの分析記事、観客数はガイド記事の目安によります。実際の観客数は公演によって違います。">
        <TrainMath />
      </Figure>
      <FanVoices
        title="帰りについての体験談（まとめ）"
        items={[
          { text: "終演後のあおなみ線は激混みで、名古屋駅に着くまで2時間かかったこともある", from: "遠征ブログより" },
          { text: "ライブの日は臨時列車が6〜7本出たが、1本目が出たのは終演から30分ほどあと", from: "あおなみ線の運行を分析した note より" },
          { text: "公演によっては名古屋駅行きのシャトルバス（1,500円前後）があり、電車よりスムーズだった", from: "Yahoo!知恵袋の回答より" },
          { text: "タクシーは、金城ふ頭駅か交流センター前の乗り場に配車してもらうよう公式に書かれていた", from: "Yahoo!知恵袋の質問より" },
        ]}
      />
      <h3>おすすめの帰り方</h3>
      <ol>
        <li>
          <strong>シャトルバスがあれば使う：</strong>主催者が出すかどうかは公演ごとなので、チケットが取れたら早めに確認。
        </li>
        <li>
          <strong>時間をずらす：</strong>会場のそばの「メイカーズピア」には飲食店が多く、食事をしてから帰ると駅の混雑が落ち着いていることも。
        </li>
        <li>
          <strong>名古屋駅周辺に泊まる：</strong>あおなみ線で乗り換えなしで戻れるので、遠征組は名古屋駅泊が便利。新幹線は終演＋2時間くらいで考えておくと安心です。
        </li>
      </ol>
      <Bubble>
        改札の外で待つ時間もあるから、冬は上着をしっかり。モバイルバッテリーの残りも気にしておこう！
      </Bubble>

      <ArticleAd />

      <H2 id="inside" num={4}>
        館内：ロッカー・Wi-Fi・飲食・喫煙所
      </H2>
      <ul>
        <li>
          <strong>コインロッカー：</strong>第1展示館の2階と、交流センターの1階にあります（公式FAQより）。
        </li>
        <li>
          <strong>Wi-Fi：</strong>各施設の共有部分で無料Wi-Fiが使えます。
        </li>
        <li>
          <strong>飲食：</strong>館内にレストランと喫茶があり、周辺のメイカーズピアにも飲食店がたくさんあります。
        </li>
        <li>
          <strong>喫煙：</strong>館内は禁煙で、喫煙所は屋外です。
        </li>
        <li>
          <strong>ATM：</strong>レゴランド・ジャパンの入口に銀行のATMがあります。
        </li>
        <li>
          <strong>車いす：</strong>交流センター1階の管理事務室か、第1展示館2階の管理事務所で貸し出しています（台数に限りあり）。
        </li>
      </ul>
      <p>
        座席は公演ごとに組まれます。第1展示館には5,848席の可動階段席があり、ファンのブログでは「段差のある席は全体が見渡しやすい」「アリーナ後方や段差席では双眼鏡があると安心」という声があります。
      </p>

      <H2 id="goods" num={5}>
        物販の日の動き方（米津玄師 GHOSTの例）
      </H2>
      <Figure caption="編集部作成。建物の位置関係は実際の配置ではありません。会場内の案内表示に従ってください。">
        <HallFlow />
      </Figure>
      <ul>
        <li>
          <strong>物販は第3展示館、ライブは第1展示館。</strong>建物が違うので、物販のあとに移動する時間を見込んでおきましょう。
        </li>
        <li>12/8(火)は12:00から（整理券の時間帯 〜15:00）、12/9(水)は13:00から（〜15:00）。</li>
        <li>
          アプリ「米津玄師 STORE」の整理券は<strong>12/5(土) 20:00から</strong>配布されます。
        </li>
      </ul>
      <p>
        グッズの価格とこれまでの公演の様子は「
        <Link href="/blog/yonezu-ghost-tour-goods">米津玄師「GHOST」ツアーグッズ全20アイテムと物販攻略</Link>
        」にまとめています。
      </p>

      <MochicoNudge title="ツアーで買ったグッズを、会場ごとに残すなら">
        <p>
          「Mochico（モチコ）」は、ライブやイベントごとにグッズを写真つきで一覧にして、持っているものをタップで記録できるアプリです。複数の公演に行く人も、どこで何を買ったかすぐ見返せます。
        </p>
      </MochicoNudge>
      <p>
        遠征の持ち物は「<Link href="/blog/live-ensei-checklist">ライブ遠征の持ち物チェックリスト</Link>」も参考にしてください。
      </p>

      <H2 id="links" num={6}>
        公式情報へのリンク
      </H2>
      <OfficialLinks
        items={[
          { href: "https://portmesse.com/access/", title: "アクセス・駐車場", icon: "🚃" },
          { href: "https://portmesse.com/facility/tenjikan01", title: "第1展示館", icon: "🏢" },
          { href: "https://portmesse.com/faq", title: "よくあるご質問", icon: "❓" },
          { href: "https://kinjo-p.jp/", title: "金城ふ頭駐車場", icon: "🅿️" },
        ]}
      />

      <Sources
        items={[
          { href: "https://portmesse.com/access/", label: "ポートメッセなごや「アクセス」（住所・駐車場の集約）" },
          { href: "https://portmesse.com/access/traffic", label: "ポートメッセなごや「公共交通機関でお越しの方」（最寄りのバス停なし・シャトルバス・入口の変更）" },
          { href: "https://portmesse.com/facility/tenjikan01", label: "ポートメッセなごや「第1展示館」（面積・天井高・可動階段席・ロッカー）" },
          { href: "https://portmesse.com/faq", label: "ポートメッセなごや「よくあるご質問」（ロッカー・飲食・喫煙・Wi-Fi・ATM・車いす）" },
          { href: "https://note.com/musashinorailway/n/n7ccff3b5b126", label: "note「ポートメッセなごやの終演後ラッシュは避けられないのか？」（あおなみ線の輸送力の分析）" },
          { href: "https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q12304147542", label: "Yahoo!知恵袋「ポートメッセ名古屋第1展示館のライブ、帰りのあおなみ線」" },
          { href: "https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q11204558156", label: "Yahoo!知恵袋「ポートメッセ名古屋のライブに参加したことのある方に相談」" },
          { href: "https://live-venue-repo.hateblo.jp/entry/2026/10/28/172107", label: "ライブ会場の神席攻略ガイド「ポートメッセ名古屋のキャパ・座席の見え方・アクセス」" },
          { href: "https://btslove7.com/2024/09/08/portmessenagoya-access/", label: "ブログ「ポートメッセなごやはアクセス悪い？行き方や帰りの混雑状況」" },
          { href: "https://reissuerecords.net/goods/", label: "REISSUE RECORDS「GOODS / GHOST」（愛知公演の物販時間・場所・整理券）" },
        ]}
      />
    </OshiArticleLayout>
  );
}
