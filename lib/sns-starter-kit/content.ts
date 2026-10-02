// ============================================================
// SNS Starter Kit — LP 表示データの単一の置き場所
//
// ★このファイルだけで「何をどの確度で言ってよいか」を管理する。
//   ページ側のコンポーネントは表示の仕方だけを持ち、断定の可否を判断しない。
//
// status の意味:
//   verified : Development の検証で実装・動作が確認済み。「搭載」と表示してよい。
//   planned  : 商品に含める予定だが未検証。「予定」としてのみ表示する。
//   concept  : 体験の構想・画面イメージ。実在する成果物として扱わない。
//   excluded : 初期版に含めない。
//
// 2026-09-29 時点: 商品本体は開発前（Development Operation 01 監査のみ完了）。
// したがって verified は1件も存在しない。検証が完了した項目から順に
// status を "verified" に切り替える（ページ側の修正は不要）。
// ============================================================

export type ClaimStatus = "verified" | "planned" | "concept" | "excluded";

export interface StatusItem {
  id: string;
  label: string;
  note?: string;
  status: ClaimStatus;
}

// ── 商品の基本情報 ─────────────────────────────────────────
export const PRODUCT = {
  name: "SNS Starter Kit",
  edition: "Standard",
  path: "/sns-starter-kit",
  canonical: "https://www.toolboxjp.com/sns-starter-kit",
  priceYen: 49800,
  priceLabel: "49,800円",
  taxLabel: "税込",
  saleState: "販売準備中",
  /** 販売開始済みか。true にするまで購入導線・Product構造化データは出さない。 */
  purchasable: false,
} as const;

// ── Section 03: Starter Kit の土台（Developmentの検証結果で切り替える） ──
export const FOUNDATION_FEATURES: StatusItem[] = [
  { id: "auth", label: "メール認証・パスワード再設定", status: "planned" },
  { id: "account-deletion", label: "アカウント削除", status: "planned" },
  { id: "profile", label: "プロフィール", status: "planned" },
  { id: "post", label: "投稿・返信", status: "planned" },
  { id: "image", label: "画像アップロード", status: "planned" },
  { id: "access-control", label: "データベース・ストレージのアクセス制御", status: "planned" },
  { id: "report-block", label: "通報・ブロック", status: "planned" },
  { id: "admin", label: "管理画面（通報対応・投稿の非表示）", status: "planned" },
];

// ── Section 04: 同梱ファイル（構想。商品完成まで concept のまま） ──
export const KIT_FILES: StatusItem[] = [
  { id: "start-here", label: "START_HERE.md", note: "最初に読む手順", status: "concept" },
  { id: "claude-md", label: "CLAUDE.md", note: "AI向けの開発ルール", status: "concept" },
  { id: "agents-md", label: "AGENTS.md", note: "AI向けの開発ルール", status: "concept" },
  { id: "safe-change", label: "SAFE_CHANGE_GUIDE.md", note: "安全に変更できる範囲", status: "concept" },
];

// ── 強い販売コピーの切り替え ────────────────────────────────
// 「ファイルを渡して、作りたいSNSを話す。」は実商品のQAで実証されるまで使わない。
// 文字列中の "|" は文節の区切り、"\n" は改行（components/sns-starter-kit/Phrase.tsx）。
export const CLAIMS = {
  signatureHeading: {
    status: "concept" as ClaimStatus,
    verified: "ファイルを|渡して、\n作りたい|SNSを|話す。",
    concept: "AI開発環境で|開いて、\n作りたい|コミュニティを|伝える。",
  },
} as const;

export function signatureHeading(): string {
  const c = CLAIMS.signatureHeading;
  return c.status === "verified" ? c.verified : c.concept;
}

// ── Section 05: 変更範囲の区分 ──────────────────────────────
export const SAFE_CHANGES: string[] = [
  "サービス名",
  "テーマカラー",
  "静的なコピー",
  "投稿カテゴリ",
  "確認済みのプロフィール項目",
];

export const SENSITIVE_AREAS: string[] = [
  "認証（Auth）",
  "認可（Authorization）",
  "RLS",
  "データベース構造",
  "Storage Policy",
  "管理者権限",
  "Secrets",
];

// ── Section 06: パッケージ内容（販売時に verified のものだけ確定表示） ──
export const PACKAGE_ITEMS: StatusItem[] = [
  { id: "app", label: "SNS本体（ソースコード）", status: "planned" },
  { id: "setup-guide", label: "日本語セットアップガイド", status: "planned" },
  { id: "dev-rules", label: "AI向け開発ルール", status: "planned" },
  { id: "safe-change-guide", label: "Safe Change Guide", status: "planned" },
  { id: "initial-prompt", label: "最初に使うプロンプト", status: "planned" },
  { id: "verification-guide", label: "動作確認ガイド", status: "planned" },
  { id: "setup-support", label: "限定導入サポート", status: "planned" },
];

// ── Section 07: 初期版に含めないもの ───────────────────────
export const NOT_INCLUDED: string[] = [
  "DM",
  "グループチャット",
  "動画投稿",
  "ライブ配信",
  "プッシュ通知",
  "ネイティブアプリ",
  "レコメンド",
  "ランキング",
  "SNS内決済",
  "代理店ライセンス",
  "無制限のプロジェクト利用",
  "個別開発",
  "運営代行",
];

// ── Section 08: 進め方 ─────────────────────────────────────
export const STEPS: { title: string; body: string }[] = [
  { title: "Starter Kitを受け取る", body: "ソースコード一式とガイドを受け取ります。" },
  { title: "Supabase / Vercelを準備", body: "ご自身のアカウントで、データベースと公開先を用意します。" },
  { title: "AI開発環境でプロジェクトを開く", body: "Claude Code 等の対応予定のAI開発環境で開きます。" },
  { title: "作りたいコミュニティを伝える", body: "誰のための場所か、どんな投稿が集まるかを伝えます。" },
  { title: "確認済みの範囲から変更", body: "同梱ルールで安全とされた範囲から変えていきます。" },
  { title: "動作確認", body: "ガイドに沿って、ログインから投稿までを確かめます。" },
  { title: "公開", body: "ご自身の環境で、ご自身の責任で公開します。" },
];

// ── Section 09: 前提条件 ───────────────────────────────────
export const REQUIREMENTS: { label: string; body: string }[] = [
  { label: "PC", body: "開発・設定作業はPCで行います。" },
  { label: "セルフホスティング", body: "サービスはご自身の環境で運用します。" },
  { label: "外部サービスのアカウント", body: "Supabase・Vercel 等のアカウントと、その利用料が必要です。" },
  { label: "技術的な責任", body: "公開後の運用・データ管理はご自身（または技術協力者）が担います。" },
];

/** 初期の対応候補（確定ではない）。 */
export const SUPPORTED_CANDIDATES: string[] = ["Supabase", "Vercel"];

/**
 * 検証完了後に確定する動作環境（OS / ブラウザ / AIツール / バージョン / 制限）。
 * 空のあいだは「検証後に掲載」とだけ表示する。
 */
export const CONFIRMED_ENVIRONMENT: { label: string; value: string }[] = [];

// ── Section 10: 価格の補足 ─────────────────────────────────
export const PRICE_TERMS: StatusItem[] = [
  { id: "license", label: "1サービス・非独占ライセンス", status: "planned" },
  { id: "external", label: "外部サービス費用は別途", status: "verified" },
  { id: "support", label: "限定導入サポート", status: "planned" },
];

// ── Section 02: コミュニティ例（すべて架空の例） ──────────────
export interface CommunityExample {
  id: string;
  name: string;
  profileFields: string[];
  categories: string[];
  /** コミュニティ固有の色。ベタ塗りにはせず、border・dot・タグ・ごく薄い面だけに使う。 */
  palette: CommunityPalette;
}

// ── 色の原則: Neutral 80% / Color 20% ──────────────────────────
// 色は「自分専用に変わった」ことを示すためにだけ使う（Color = Customization）。
//   tone : dot・border・塗りのアクセント
//   ink  : 薄い面の上に置く文字色（WCAG AA 4.5:1 以上を確保した濃い色）
//   soft : ごく薄い面（タグ・ヘッダーの下地）
export interface CommunityPalette {
  tone: string;
  ink: string;
  soft: string;
}

export const PALETTES = {
  car: { tone: "#e0533d", ink: "#a2301d", soft: "#fdf0ed" },
  photo: { tone: "#d4880f", ink: "#8a5300", soft: "#fdf5e6" },
  game: { tone: "#7c4ddb", ink: "#5a2fb5", soft: "#f3effc" },
  sports: { tone: "#1f9d55", ink: "#166b3c", soft: "#ebf7f0" },
  fan: { tone: "#e0679a", ink: "#a62a5d", soft: "#fdf0f5" },
} satisfies Record<string, CommunityPalette>;

/** 車コミュニティ内の投稿カテゴリの色（Scene 5 以降で「色の差」を見せる）。 */
export const CAR_CATEGORY_PALETTES: Record<string, CommunityPalette> = {
  愛車紹介: PALETTES.car,
  整備記録: { tone: "#3b6fd4", ink: "#23509f", soft: "#edf2fc" },
  ツーリング: PALETTES.sports,
};

export const COMMUNITY_EXAMPLES: CommunityExample[] = [
  {
    id: "car",
    name: "車",
    profileFields: ["愛車", "型式", "年式", "地域"],
    categories: ["愛車紹介", "整備記録", "ツーリング"],
    palette: PALETTES.car,
  },
  {
    id: "photo",
    name: "写真",
    profileFields: ["カメラ", "よく使うレンズ", "撮るジャンル"],
    categories: ["作品", "撮影地", "機材"],
    palette: PALETTES.photo,
  },
  {
    id: "game",
    name: "ゲーム",
    profileFields: ["メインタイトル", "プラットフォーム", "プレイ時間帯"],
    categories: ["募集", "攻略", "雑談"],
    palette: PALETTES.game,
  },
  {
    id: "sports",
    name: "スポーツ",
    profileFields: ["競技", "ポジション", "所属チーム"],
    categories: ["練習記録", "試合結果", "メンバー募集"],
    palette: PALETTES.sports,
  },
  {
    id: "fan",
    name: "ファンコミュニティ",
    profileFields: ["推し", "好きになった時期", "参加予定"],
    categories: ["感想", "イベント", "グッズ"],
    palette: PALETTES.fan,
  },
];

export function statusLabel(status: ClaimStatus): string {
  switch (status) {
    case "verified":
      return "確認済み";
    case "planned":
      return "予定";
    case "concept":
      return "構成案";
    case "excluded":
      return "対象外";
  }
}
