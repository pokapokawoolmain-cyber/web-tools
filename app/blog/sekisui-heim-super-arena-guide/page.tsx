import Link from "next/link";
import { getBlogPost } from "@/data/blog-posts";
import { mochicoArticleMeta } from "../_components/mochico/meta";
import {
  ArticleAd,
  Bubble,
  Card,
  Checklist,
  FanVoices,
  Figure,
  H2,
  MochicoNudge,
  OshiArticleLayout,
  Sources,
  Stats,
  Tldr,
  Toc,
  oshiStyles as s,
  type TocItem,
} from "../_components/oshi/OshiArticle";

const post = getBlogPost("sekisui-heim-super-arena-guide")!;

export const metadata = mochicoArticleMeta(post, [
  "セキスイハイムスーパーアリーナ",
  "セキスイハイムスーパーアリーナ アクセス",
  "セキスイハイムスーパーアリーナ シャトルバス",
  "セキスイハイムスーパーアリーナ 帰り",
  "セキスイハイムスーパーアリーナ 座席",
  "グランディ21 ライブ",
  "利府 ライブ 行き方",
]);

const TOC: TocItem[] = [
  { id: "data", label: "まずは基本データ（仙台市ではなく利府町）" },
  { id: "access", label: "行き方は4通り。基本はシャトルバス" },
  { id: "exit", label: "帰り：新幹線に間に合わせるための逆算" },
  { id: "seat", label: "座席：スタンドは東西の2面だけ" },
  { id: "inside", label: "会場まわり：食べ物・トイレ・寒さ" },
  { id: "check", label: "セキスイハイムの日の持ち物" },
  { id: "goods", label: "物販の日の動き方（米津玄師 GHOSTの例）" },
];

/** 自作の図：仙台駅・利府駅からの行き方 */
function AccessFlow() {
  const rows = [
    { from: "仙台駅 東口", how: "シャトルバス（主催者が運行・前売りが基本）", time: "約40〜50分", fill: "#ffe4f0", ink: "#be185d", best: true },
    { from: "利府駅（JR）", how: "路線バス（ミヤコーバス）で約10分", time: "＋徒歩", fill: "#dcf7ec", ink: "#047857" },
    { from: "利府駅（JR）", how: "歩く（約3km・坂あり）", time: "約45分", fill: "#fff6cc", ink: "#8a5a00" },
    { from: "車・タクシー", how: "仙台北部道路 利府しらかし台ICから約3分", time: "仙台駅から約40分", fill: "#efe9ff", ink: "#5a2fd2" },
  ];
  return (
    <svg viewBox="0 0 360 330" role="img" aria-labelledby="sh-title sh-desc">
      <title id="sh-title">セキスイハイムスーパーアリーナへの4つの行き方</title>
      <desc id="sh-desc">
        仙台駅東口から主催者のシャトルバスで約40〜50分。JR利府駅から路線バスで約10分、または徒歩約45分。車なら仙台北部道路の利府しらかし台ICから約3分。
      </desc>
      {rows.map((r, i) => {
        const y = 10 + i * 72;
        return (
          <g key={i}>
            <rect x="8" y={y} width="344" height="62" rx="14" fill={r.fill} stroke={r.best ? r.ink : "none"} strokeWidth="2" />
            <text x="22" y={y + 24} fontSize="13" fontWeight="900" fill="#1b1430">
              {r.from}
            </text>
            <text x="338" y={y + 24} fontSize="12" fontWeight="900" fill={r.ink} textAnchor="end">
              {r.time}
            </text>
            <text x="22" y={y + 46} fontSize="11" fill="#3e3756">
              {r.how}
            </text>
            {r.best && (
              <text x="338" y={y + 46} fontSize="10.5" fontWeight="900" fill={r.ink} textAnchor="end">
                おすすめ
              </text>
            )}
          </g>
        );
      })}
      <text x="14" y="314" fontSize="10.5" fill="#625b7c">
        ※ 時間は体験談・ガイド記事での目安。渋滞や待ち時間は含みません
      </text>
    </svg>
  );
}

/** 自作の図：スタンドの配置（東西の2面） */
function StandLayout() {
  return (
    <svg viewBox="0 0 360 230" role="img" aria-labelledby="st-title st-desc">
      <title id="st-title">固定スタンドは東西の長い2面だけ（簡略図）</title>
      <desc id="st-desc">
        固定のスタンド席はアリーナの長い辺の東西2面にあり、西側がA〜M、東側がN〜Zブロック。中央のアリーナの配置とステージの位置は公演ごとに変わる。
      </desc>
      <rect x="8" y="20" width="76" height="190" rx="12" fill="#ffe4f0" />
      <text x="46" y="108" fontSize="13" fontWeight="900" fill="#1b1430" textAnchor="middle">
        西
      </text>
      <text x="46" y="128" fontSize="11" fontWeight="800" fill="#be185d" textAnchor="middle">
        A〜M
      </text>
      <rect x="276" y="20" width="76" height="190" rx="12" fill="#dcf7ec" />
      <text x="314" y="108" fontSize="13" fontWeight="900" fill="#1b1430" textAnchor="middle">
        東
      </text>
      <text x="314" y="128" fontSize="11" fontWeight="800" fill="#047857" textAnchor="middle">
        N〜Z
      </text>
      <rect x="96" y="20" width="168" height="190" rx="12" fill="#fff6cc" />
      <text x="180" y="104" fontSize="13" fontWeight="900" fill="#1b1430" textAnchor="middle">
        アリーナ
      </text>
      <text x="180" y="124" fontSize="10.5" fill="#3e3756" textAnchor="middle">
        配置・ステージの位置は
      </text>
      <text x="180" y="140" fontSize="10.5" fill="#3e3756" textAnchor="middle">
        公演ごとに変わる
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
          <mark>セキスイハイムスーパーアリーナ</mark>完全ガイド：シャトルバス・帰りの逆算・座席
        </>
      }
      heroLead="仙台駅から車で約40分、最寄りの利府駅からも歩くと45分。東北最大級のアリーナは「どうやって行って、どうやって帰るか」がすべてです。シャトルバスの使い方から新幹線の逆算、寒さ対策まで、体験談をもとにまとめました。"
      stickers={["❄️ 会場ガイド", "🚌 シャトルバス", "🚄 新幹線の逆算", "🧤 寒さ対策"]}
      unofficialNote="この記事は、公開されている会場情報と、ファンのブログ・Q&Aなどの体験談をもとにToolBoxJP編集部がまとめた非公式のガイドです。会場の運営者とは関係ありません。図はすべて編集部が作った簡略図です。シャトルバスの有無・料金・乗り場は公演ごとに違うので、必ず主催者の案内を確認してください（2026年11月8日時点の情報）。"
    >
      <p>
        宮城県総合運動公園（グランディ・21）の中にある<strong>セキスイハイムスーパーアリーナ</strong>は、東北でいちばん大きなライブ会場のひとつ。米津玄師さんの「GHOST」ツアーでも、12月3日・4日の2公演が予定されています。
      </p>
      <p>
        住所は仙台市ではなく<strong>宮城県利府町</strong>。山の上の運動公園にあり、まわりにはお店もほとんどありません。<span className={s.hl}>行きと帰りの足を先に押さえること</span>が、この会場のいちばんのポイントです。
      </p>

      <Tldr
        items={[
          <>基本は仙台駅東口から主催者のシャトルバス（約40〜50分）。前売りで売り切れることもあるので早めに</>,
          <>帰りのシャトルバスは終演後1時間ほどで終わる予定のことが多い。新幹線は終演＋1時間半〜2時間で逆算</>,
          <>会場まわりにコンビニ・飲食店はほぼない。12月は冷えるので、飲み物・軽食・防寒具を持っていく</>,
        ]}
      />

      <Toc items={TOC} />

      <H2 id="data" num={1}>
        まずは基本データ（仙台市ではなく利府町）
      </H2>
      <Stats
        items={[
          { num: <>40<small>分</small></>, label: "仙台駅から車・シャトルバスでの目安" },
          { num: <>45<small>分</small></>, label: "最寄りの利府駅から徒歩（約3km）" },
          { num: <>2<small>面</small></>, label: "固定スタンドは東西の2面だけ" },
          { num: <>12/3・4</>, label: "米津玄師 GHOSTの宮城公演" },
        ]}
      />
      <Card kind="memo" label="大規模改修の予定">
        <p>ガイド記事によると、大規模改修のため令和11年度中に休館する予定です（サブアリーナを除く）。今のうちに行っておきたい会場のひとつです。</p>
      </Card>

      <H2 id="access" num={2}>
        行き方は4通り。基本はシャトルバス
      </H2>
      <Figure caption="編集部作成。所要時間は体験談・ガイド記事の目安です。">
        <AccessFlow />
      </Figure>
      <FanVoices
        title="シャトルバスについての体験談（まとめ）"
        items={[
          { text: "乗り場は仙台駅の東口側（ヨドバシカメラ側）。タクシー乗り場を過ぎた先で、プラカードの案内に従えば迷わない", from: "2025年8月の公演に行った人のレポより" },
          { text: "バス券はプレイガイドで前売り。公演の約2週間前に発売してすぐ売り切れ、数日前の追加販売で取れた", from: "2025年8月の公演に行った人のレポより" },
          { text: "片道1,500円。約2か月前にプレイガイドで販売されていた", from: "2024年11月の公演に行った人のブログより" },
          { text: "バスを降りてから会場まで、坂のある道を5〜10分歩く", from: "複数のレポより" },
        ]}
      />
      <p>
        シャトルバスを出すかどうか、料金、販売方法は<strong>公演ごとに主催者が決めます</strong>。チケットが取れたら、主催者やプレイガイドのお知らせをこまめに確認しましょう。
      </p>
      <Card kind="caution" label="路線バス・タクシーの注意">
        <ul>
          <li>利府駅からの路線バスは、午前と午後でルートが変わるという声があります。土日祝は夜の便が早く終わるので、帰りには頼れません。</li>
          <li>タクシーは終演後に長い列になりやすく、配車アプリが使えないことがあるという声も。使うなら仙台市内のタクシー会社に事前予約を。</li>
          <li>車で行く場合も、駐車場が公演によって使えないことがあるので、主催者の案内を確認しましょう。</li>
        </ul>
      </Card>

      <H2 id="exit" num={3}>
        帰り：新幹線に間に合わせるための逆算
      </H2>
      <FanVoices
        title="帰りについての体験談（まとめ）"
        items={[
          { text: "帰りのシャトルバスは乗るまで15〜20分ほど。20時ごろ乗って、仙台駅に20時40分ごろ着いた", from: "2025年8月の公演に行った人のレポより" },
          { text: "21時ごろ会場を出て、乗れたのは21時30分", from: "2024年11月の公演に行った人のブログより" },
          { text: "以前は「3時間待ってやっと乗れた」こともあったが、最近は改善されている", from: "アクセス解説記事より" },
          { text: "仙台駅での降り場から新幹線の改札までは10分ほど", from: "2025年8月の公演に行った人のレポより" },
        ]}
      />
      <div className={s.tableWrap} role="region" aria-label="帰りの逆算の目安" tabIndex={0}>
        <table className={s.table} style={{ minWidth: 520 }}>
          <caption>帰りの逆算の目安（ガイド記事より）</caption>
          <tbody>
            <tr>
              <th scope="row">終演から仙台駅の新幹線まで</th>
              <td>約90〜120分を見込む</td>
            </tr>
            <tr>
              <th scope="row">東京方面の最終に乗るには</th>
              <td>終演が19時台後半までが目安。20時を過ぎるなら泊まりを考える</td>
            </tr>
            <tr>
              <th scope="row">飛行機で帰る人</th>
              <td>仙台空港の夜の便は早く終わるので、夜公演のあとは泊まりが前提</td>
            </tr>
            <tr>
              <th scope="row">夜行バス</th>
              <td>仙台駅東口から首都圏行きが23時台に出ている（予約制）</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={s.tableNote}>時刻はガイド記事の目安です。乗る列車・便の時刻は、必ずJR・航空会社の公式で確認してください。</p>
      <Bubble>
        GHOSTの宮城公演は開演18:30。終演時間はまだ分からないから、新幹線で帰る人は泊まりも含めて早めに考えておこうね。
      </Bubble>

      <H2 id="seat" num={4}>
        座席：スタンドは東西の2面だけ
      </H2>
      <p>
        ガイド記事によると、固定のスタンド席は<strong>アリーナの長い辺の東西2面だけ</strong>。西側がA〜M、東側がN〜Zブロックです。ステージの向きやアリーナの配置は公演ごとに変わるので、スタンドでもステージの真正面とは限りません。
      </p>
      <Figure caption="編集部作成の簡略図。ブロック名はガイド記事の記載によります。実際の配置は公演ごとの座席表で確認してください。">
        <StandLayout />
      </Figure>
      <p>米津玄師さんのGHOSTツアーでも、宮城公演は立見のチケットが販売されています。立見の人はクッション性のある靴で行きましょう。</p>

      <ArticleAd />

      <H2 id="inside" num={5}>
        会場まわり：食べ物・トイレ・寒さ
      </H2>
      <FanVoices
        title="会場まわりの体験談（まとめ）"
        items={[
          { text: "会場の近くに飲食店やコンビニが見当たらなかった。飲み物と軽食は持っていくのがおすすめ", from: "2025年8月の公演に行った人のレポより" },
          { text: "プール棟のトイレの入口が分かりにくく、探すのに時間がかかった", from: "2024年11月の公演に行った人のブログより" },
          { text: "11月の昼公演と夜公演の間は、屋内で待てる場所がほとんどなく、外のベンチもすぐ埋まった。地面に座る人も", from: "2024年11月の公演に行った人のブログより" },
          { text: "車で来た人は車内で待てたが、シャトルバスの人は外で待つしかなかった", from: "2024年11月の公演に行った人のブログより" },
        ]}
      />
      <p>12月の利府は日が落ちると一気に冷えます。開場前やバス待ちで外にいる時間が長くなることを前提に準備しましょう。</p>

      <H2 id="check" num={6}>
        セキスイハイムの日の持ち物
      </H2>
      <Checklist
        title="この会場ならではの持ち物"
        icon="🧳"
        items={[
          { must: true, text: "シャトルバスの券（往復券なら帰りの紙の券もなくさない）" },
          { must: true, text: "飲み物と軽食", why: "会場まわりにお店がほとんどない" },
          { text: "カイロ・手袋・厚手の上着", why: "開場前やバス待ちは外" },
          { text: "折りたたみの座布団やレジャーシート", why: "待ち時間に座れる場所が少ない" },
          { text: "モバイルバッテリー", why: "帰りの便を調べたり、タクシーを呼んだりでスマホを使う" },
          { text: "帰りの新幹線・ホテルの予約画面", why: "終演時間によってはその日のうちに帰れない" },
        ]}
      />
      <p>
        遠征全体の持ち物は「<Link href="/blog/live-ensei-checklist">ライブ遠征の持ち物チェックリスト</Link>」にまとめています。
      </p>

      <H2 id="goods" num={7}>
        物販の日の動き方（米津玄師 GHOSTの例）
      </H2>
      <ul>
        <li>
          <strong>販売場所はサブアリーナ（屋内）。</strong>12/3(木)は12:00から（整理券の時間帯 〜15:00）、12/4(金)は13:00から（〜15:00）。外テントの会場より寒さの心配は少なめです。
        </li>
        <li>
          アプリ「米津玄師 STORE」の整理券は<strong>11/25(水) 20:00から</strong>配布されます。
        </li>
        <li>物販に間に合うシャトルバスがあるかどうかは、主催者の案内を確認しましょう。</li>
      </ul>
      <p>
        グッズの価格とこれまでの公演の様子は「
        <Link href="/blog/yonezu-ghost-tour-goods">米津玄師「GHOST」ツアーグッズ全20アイテムと物販攻略</Link>
        」にまとめています。
      </p>

      <MochicoNudge title="遠征の「買うもの」「買ったもの」を1つのリストで">
        <p>
          「Mochico（モチコ）」は、イベントごとにグッズを写真つきで一覧にして、持っているものをタップで記録できるアプリです。物販の前の買い物リストにも、終わったあとの記録にも使えます。
        </p>
      </MochicoNudge>

      <Sources
        items={[
          { href: "https://guidebridge.jp/sekisui-heim-super-arena-guide/", label: "guidebridge「セキスイハイムスーパーアリーナのアクセス完全攻略」（シャトルバス・帰りの逆算・スタンドの配置・休館予定）" },
          { href: "https://en-say-jump.com/miyagi-sekisui-arena-bus/", label: "遠征JUMP「仙台駅→セキスイハイムスーパーアリーナ シャトルバス利用レポ」（2025年8月）" },
          { href: "https://letsenjoydojin.hatenablog.com/entry/2025/01/03/163341", label: "どぐーんのブログ「セキスイハイムスーパーアリーナへのアクセスと、トイレと、待ち時間問題」（2024年11月）" },
          { href: "https://www.bushikaku.net/article/88272/", label: "バスとりっぷ「利府駅・仙台駅・岩切駅からセキスイハイムスーパーアリーナまでのアクセス方法」" },
          { href: "https://eplus.jp/sf/venue/9810020", label: "イープラス「セキスイハイムスーパーアリーナ」会場情報" },
          { href: "https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q14324195689", label: "Yahoo!知恵袋「仙台駅からのシャトルバスか、利府駅からか」" },
          { href: "https://note.com/ykt_9096/n/nf20b857300d1", label: "note「宮城・セキスイハイムスーパーアリーナへの行き方ガイド」" },
          { href: "https://reissuerecords.net/goods/", label: "REISSUE RECORDS「GOODS / GHOST」（宮城公演の物販時間・整理券）" },
          { href: "https://reissuerecords.net/2026/07/03/2026-tour-ghost/", label: "REISSUE RECORDS「米津玄師 2026 TOUR / GHOST」（公演日程・立見の販売会場）" },
        ]}
      />
    </OshiArticleLayout>
  );
}
