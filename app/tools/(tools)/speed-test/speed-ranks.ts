// ========================================
// スピードテスト: 20段階評価データ
// ダウンロード速度(Mbps)を生活に直結する言葉で評価する。
// min: この段階の下限Mbps（この値以上・次の段階の min 未満）
// ========================================

export type SpeedRank = {
  /** 1〜20 */
  level: number;
  /** 下限 Mbps */
  min: number;
  /** ランク名 */
  name: string;
  /** Mbps範囲の表示用ラベル */
  range: string;
  /** 一言評価 */
  tagline: string;
  /** 具体的にできること */
  can: string[];
  /** 厳しいこと */
  hard: string[];
  /** 改善アドバイス */
  advice: string;
  /** テーマカラー（HEX） */
  color: string;
};

export const SPEED_RANKS: SpeedRank[] = [
  {
    level: 1, min: 0, range: "〜0.2Mbps", name: "圏外寸前", color: "#ef4444",
    tagline: "ほぼ通信困難。テキストの送受信すら待たされるレベルです。",
    can: ["LINEのテキスト送信（時間がかかる）", "メールの受信（本文のみ）"],
    hard: ["Webページの表示", "画像の読み込み", "動画視聴全般", "アプリの更新"],
    advice: "電波の弱い場所・通信制限中の可能性が高い状態です。Wi-Fiの接続先を変える、速度制限を確認する、場所を移動するなど根本的な見直しが必要です。",
  },
  {
    level: 2, min: 0.2, range: "0.2〜0.5Mbps", name: "制限速度", color: "#ef4444",
    tagline: "スマホの「速度制限後」とほぼ同じ。文字中心の利用が限界です。",
    can: ["LINE・メールのテキスト", "軽いWebページ（時間をかければ）"],
    hard: ["SNSの画像・動画", "YouTube（最低画質でも途切れがち）", "ビデオ通話"],
    advice: "モバイル回線ならギガ切れ（速度制限）の典型値です。Wi-Fiに切り替えるか、追加データの購入・プラン見直しを検討しましょう。",
  },
  {
    level: 3, min: 0.5, range: "0.5〜1Mbps", name: "我慢の通信", color: "#f87171",
    tagline: "テキスト中心なら使えますが、画像や動画は待ち時間が目立ちます。",
    can: ["LINE・メール", "テキスト中心のWeb閲覧", "音楽ストリーミング（低音質）"],
    hard: ["YouTube標準画質", "ビデオ会議", "アプリのダウンロード"],
    advice: "常時この速度ならルーターの再起動・設置場所の見直しを。モバイルなら電波状況の良い場所への移動が効果的です。",
  },
  {
    level: 4, min: 1, range: "1〜3Mbps", name: "最低ライン", color: "#fb923c",
    tagline: "SNSと標準画質動画がなんとか見られる、日常利用の最低ラインです。",
    can: ["SNSの画像表示", "YouTube 360〜480p", "音楽ストリーミング", "音声通話"],
    hard: ["HD動画（720p以上）", "ビデオ会議の映像", "オンラインゲームのダウンロード"],
    advice: "1人でスマホを使う分には最低限動きますが、快適とは言えません。Wi-Fi環境なら5GHz帯への切り替え、ルーターの位置調整を試しましょう。",
  },
  {
    level: 5, min: 3, range: "3〜5Mbps", name: "スマホ単独級", color: "#fb923c",
    tagline: "スマホ1台でSNS・標準画質動画を見る程度なら実用になります。",
    can: ["YouTube 480p安定・720pも可", "SNS全般", "Zoomの音声＋簡易映像", "Web閲覧"],
    hard: ["フルHD動画の安定視聴", "複数人での同時利用", "大容量ダウンロード"],
    advice: "1台なら使えますが、家族と同時に使うと詰まります。固定回線がこの速度なら、ルーターの規格（Wi-Fi 5以上か）を確認しましょう。",
  },
  {
    level: 6, min: 5, range: "5〜10Mbps", name: "日常入門", color: "#facc15",
    tagline: "1人での日常利用はほぼ可能。高画質動画と複数人利用が壁になります。",
    can: ["YouTube 720p", "Netflix HD（ぎりぎり）", "Zoom会議", "オンライン授業", "SNS・Web快適"],
    hard: ["4K動画", "2〜3人での同時動画視聴", "ゲームの大型アップデート"],
    advice: "モバイル回線なら十分な水準ですが、固定回線でこの速度なら契約プランと配線方式（VDSL等）の確認をおすすめします。",
  },
  {
    level: 7, min: 10, range: "10〜20Mbps", name: "標準画質卒業", color: "#facc15",
    tagline: "フルHD動画が安定。1〜2人の一般的な利用なら大きな不満は出ません。",
    can: ["YouTube 1080p安定", "Netflix HD", "Zoom/Meetの通常会議", "軽めのオンラインゲーム"],
    hard: ["4K動画の安定視聴", "家族全員での同時利用", "クラウドへの大容量バックアップ"],
    advice: "日常利用の合格ラインです。オンラインゲームをするならPing値（応答速度）もあわせて確認しましょう。",
  },
  {
    level: 8, min: 20, range: "20〜30Mbps", name: "一人暮らし快適", color: "#a3e635",
    tagline: "1人暮らしなら動画もゲームも会議もほぼ快適にこなせる速度です。",
    can: ["フルHD動画の複数タブ", "4K動画（25Mbps推奨をほぼ満たす）", "オンラインゲーム", "ビデオ会議＋画面共有"],
    hard: ["4K複数同時視聴", "数十GB級ゲームの高速ダウンロード"],
    advice: "1人利用なら十分です。夜間だけ遅くなる場合は回線の混雑が原因なので、IPv6（IPoE）対応の確認が効果的です。",
  },
  {
    level: 9, min: 30, range: "30〜50Mbps", name: "家庭の合格点", color: "#a3e635",
    tagline: "一般家庭の普段使いならかなり快適。4K動画も安定して見られます。",
    can: ["4K動画の安定視聴", "家族2〜3人の同時利用", "オンライン授業＋在宅会議の同時進行", "ゲームプレイ"],
    hard: ["4Kを2画面以上同時", "100GB級データの短時間ダウンロード"],
    advice: "多くの用途で不満のない水準です。これで体感が遅い場合は、回線ではなくWi-FiルーターやLANケーブルの規格を疑いましょう。",
  },
  {
    level: 10, min: 50, range: "50〜75Mbps", name: "ファミリー標準", color: "#4ade80",
    tagline: "家族での同時利用に耐える、現代の標準的な快適ラインです。",
    can: ["4K＋フルHDの同時視聴", "家族3〜4人の同時利用", "クラウドゲーム（推奨値クリア）", "在宅ワーク全般"],
    hard: ["8K動画", "全員が同時に大容量ダウンロード"],
    advice: "この水準で遅く感じるなら、原因はほぼ宅内（ルーターの位置・古い中継器・2.4GHz帯への接続）です。",
  },
  {
    level: 11, min: 75, range: "75〜100Mbps", name: "快適圏", color: "#4ade80",
    tagline: "ほとんどの家庭用途で待ち時間を意識しなくなる速度です。",
    can: ["4K複数視聴", "大型アプリの更新も現実的な時間", "NAS・クラウド同期", "スマートホーム機器の常時接続"],
    hard: ["8K動画の安定視聴", "プロ用途の巨大ファイル転送"],
    advice: "光回線の実測としては標準的な良好値です。さらに上を目指すならLANケーブルをCat6A以上に統一しましょう。",
  },
  {
    level: 12, min: 100, range: "100〜150Mbps", name: "光回線実測級", color: "#2dd4bf",
    tagline: "4K・ゲーム・複数人利用・クラウド作業まで、多くの家庭では十分高速です。",
    can: ["4K動画×2〜3画面", "50GB級ゲームも1時間前後でDL", "動画素材のクラウドアップロード", "家族全員の同時利用"],
    hard: ["8K×複数画面", "10分で100GB級のような業務転送"],
    advice: "一般利用ではボトルネックになりません。体感が遅いときはDNSの変更やブラウザ拡張の見直しなど端末側を確認しましょう。",
  },
  {
    level: 13, min: 150, range: "150〜200Mbps", name: "高速家庭", color: "#2dd4bf",
    tagline: "混雑時間帯でも余裕を残せる、家庭用としては上位の実測値です。",
    can: ["8K動画（80〜100Mbps推奨）の視聴", "複数台での4K同時視聴", "大容量バックアップの日常運用"],
    hard: ["8K複数同時", "秒単位の巨大ファイル転送"],
    advice: "十分に高速です。夜間の落ち込みが小さければ回線品質も良好と判断できます。",
  },
  {
    level: 14, min: 200, range: "200〜300Mbps", name: "重量級ユーザー", color: "#22d3ee",
    tagline: "大容量ダウンロードを日常的に行うヘビーユーザーでも満足できる帯域です。",
    can: ["100GB級ゲームを1時間以内", "8K動画＋4K動画の同時視聴", "動画編集素材のクラウド運用", "在宅ワーク＋家族利用の完全並行"],
    hard: ["LAN内機器が1Gbps未満だと宝の持ち腐れに"],
    advice: "回線は十分。Wi-Fi 6以上のルーター・1Gbps対応スイッチなど宅内機器を揃えると実力を出し切れます。",
  },
  {
    level: 15, min: 300, range: "300〜500Mbps", name: "実測エリート", color: "#22d3ee",
    tagline: "1Gbps契約の実測として優秀。ほぼすべての用途で速度を意識しません。",
    can: ["4K複数視聴＋ゲームDL＋会議の同時進行", "クラウドへの数十GBバックアップ", "スマートTV・カメラ等多数台の常時接続"],
    hard: ["この帯域を使い切る家庭用途はほぼ存在しない"],
    advice: "現状の家庭用途では最高クラスです。これ以上は速度よりPing・ジッターの安定性に注目しましょう。",
  },
  {
    level: 16, min: 500, range: "500〜700Mbps", name: "ギガ級実測", color: "#38bdf8",
    tagline: "4K複数視聴も大型アップデートもクラウドバックアップも「待たない」領域です。",
    can: ["50GBのゲーム更新を15分前後", "8K複数視聴", "制作データのクラウド往復", "10台以上の同時接続"],
    hard: ["古いWi-Fi機器・Cat5eケーブルでは頭打ちに"],
    advice: "宅内LANが追いつかないケースが増える帯域です。有線接続と2.5GbE対応機器の導入で真価を発揮します。",
  },
  {
    level: 17, min: 700, range: "700Mbps〜1Gbps", name: "フルギガ", color: "#38bdf8",
    tagline: "1Gbps契約の理論値に迫る実測。家庭用として非常に高速です。",
    can: ["8K動画・大容量制作データ・複数人同時利用すべてに余裕", "100GBを15分前後でダウンロード"],
    hard: ["1GbEの有線LANがボトルネックになり始める"],
    advice: "回線起因の不満はまず出ません。測定値を維持できているか、時間帯を変えて確認しておくと安心です。",
  },
  {
    level: 18, min: 1000, range: "1〜2.5Gbps", name: "マルチギガ", color: "#a78bfa",
    tagline: "家庭用の枠を超え始めるマルチギガ帯。宅内設備の総点検が前提の速度です。",
    can: ["100GB級を10分未満", "映像制作の素材転送", "多拠点バックアップ", "家庭内サーバー運用"],
    hard: ["Wi-Fi 6E/7・2.5GbE以上のLANがないと計測すら難しい"],
    advice: "10G系プランの実測としては現実的な値です。ルーター・スイッチ・LANケーブル（Cat6A以上）をマルチギガ対応で統一しましょう。",
  },
  {
    level: 19, min: 2500, range: "2.5〜10Gbps", name: "規格外", color: "#c084fc",
    tagline: "一般用途では持て余すほどの規格外速度。制作・研究・特殊用途の領域です。",
    can: ["4K/8K RAW素材の転送", "複数端末での同時大容量転送", "NASのフルバックアップを短時間で"],
    hard: ["対応機器・対応サーバーが限られ、実測できる相手側が少ない"],
    advice: "ブラウザ測定では実力を出し切れないことがあります。有線10GbE環境での専用ツール測定も併用しましょう。",
  },
  {
    level: 20, min: 10000, range: "10Gbps〜", name: "異次元", color: "#e879f9",
    tagline: "10Gbps超の異次元領域。回線ではなく測定側・機材側が限界になる速度です。",
    can: ["データセンター級の転送", "非圧縮映像のリアルタイム転送", "あらゆる家庭用途を同時に実行しても誤差"],
    hard: ["この速度を活かせる一般向けサービスはまだほぼ存在しない"],
    advice: "ここまで来ると測定値はブラウザ・CPU・NICの性能に依存します。数値そのものより「常に安定して速い」ことに価値があります。",
  },
];

/** ダウンロード速度(Mbps)から該当ランクを返す */
export function getSpeedRank(mbps: number): SpeedRank {
  for (let i = SPEED_RANKS.length - 1; i >= 0; i--) {
    if (mbps >= SPEED_RANKS[i].min) return SPEED_RANKS[i];
  }
  return SPEED_RANKS[0];
}

// ─── 用途別快適度 ─────────────────────────────
export type ComfortLevel = "余裕" | "快適" | "普通" | "やや厳しい" | "厳しい";

export type UseCaseComfort = {
  label: string;
  level: ComfortLevel;
};

/** 快適度のしきい値: [余裕, 快適, 普通, やや厳しい] を上回るか順に判定 */
function judge(mbps: number, t: [number, number, number, number]): ComfortLevel {
  if (mbps >= t[0]) return "余裕";
  if (mbps >= t[1]) return "快適";
  if (mbps >= t[2]) return "普通";
  if (mbps >= t[3]) return "やや厳しい";
  return "厳しい";
}

/** ダウンロード速度(Mbps)とPing(ms)から用途別快適度を返す */
export function getUseCaseComforts(mbps: number, pingMs: number | null): UseCaseComfort[] {
  const comforts: UseCaseComfort[] = [
    { label: "Web閲覧", level: judge(mbps, [30, 10, 3, 1]) },
    { label: "SNS（X・Instagram）", level: judge(mbps, [30, 10, 4, 1.5]) },
    { label: "動画視聴（HD）", level: judge(mbps, [50, 15, 7, 3]) },
    { label: "4K動画", level: judge(mbps, [100, 40, 25, 15]) },
    { label: "8K動画", level: judge(mbps, [300, 150, 90, 50]) },
    { label: "ビデオ会議（Zoom等）", level: judge(mbps, [30, 15, 5, 2]) },
    { label: "クラウドゲーム", level: judge(mbps, [100, 50, 25, 10]) },
    { label: "大容量ダウンロード", level: judge(mbps, [300, 100, 40, 10]) },
    { label: "家族4人での同時利用", level: judge(mbps, [200, 80, 40, 15]) },
  ];

  // オンラインゲームは速度よりPingが支配的
  let game: ComfortLevel;
  if (pingMs == null) {
    game = judge(mbps, [50, 25, 10, 5]);
  } else if (pingMs <= 15 && mbps >= 25) game = "余裕";
  else if (pingMs <= 30 && mbps >= 10) game = "快適";
  else if (pingMs <= 60 && mbps >= 5) game = "普通";
  else if (pingMs <= 100) game = "やや厳しい";
  else game = "厳しい";
  comforts.splice(6, 0, { label: "オンラインゲーム（FPS等）", level: game });

  return comforts;
}

export const COMFORT_STYLE: Record<ComfortLevel, string> = {
  "余裕": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30",
  "快適": "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/30",
  "普通": "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30",
  "やや厳しい": "bg-orange-500/15 text-orange-600 dark:text-orange-300 border-orange-500/30",
  "厳しい": "bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30",
};
