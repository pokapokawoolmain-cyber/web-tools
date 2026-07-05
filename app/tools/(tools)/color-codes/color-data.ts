// SNS・Web用カラーコードのデータ

export type ColorEntry = { name: string; hex: string; note?: string };
export type ColorGroup = { title: string; desc: string; colors: ColorEntry[] };

export const COLOR_GROUPS: ColorGroup[] = [
  {
    title: "SNS ブランドカラー",
    desc: "各SNSの公式に近いブランドカラー。バナーやアイコンの配色に。",
    colors: [
      { name: "X（旧Twitter）", hex: "#000000", note: "現行の黒。旧ブルーは #1D9BF0" },
      { name: "LINE", hex: "#06C755" },
      { name: "Instagram（紫）", hex: "#833AB4", note: "グラデの一色。他に #E1306C / #F77737" },
      { name: "YouTube", hex: "#FF0000" },
      { name: "Facebook", hex: "#1877F2" },
      { name: "TikTok", hex: "#000000", note: "アクセントは #25F4EE / #FE2C55" },
      { name: "LinkedIn", hex: "#0A66C2" },
      { name: "Pinterest", hex: "#E60023" },
      { name: "Threads", hex: "#000000" },
      { name: "note", hex: "#41C9B4" },
    ],
  },
  {
    title: "コミュニケーション・決済",
    desc: "アプリやサービスでよく使われるブランドカラー。",
    colors: [
      { name: "PayPay", hex: "#FF0033" },
      { name: "楽天", hex: "#BF0000" },
      { name: "Amazon（オレンジ）", hex: "#FF9900" },
      { name: "Slack", hex: "#4A154B" },
      { name: "Discord", hex: "#5865F2" },
      { name: "Zoom", hex: "#2D8CFF" },
      { name: "Google（青）", hex: "#4285F4", note: "赤 #EA4335 / 黄 #FBBC05 / 緑 #34A853" },
      { name: "Apple（黒）", hex: "#000000" },
    ],
  },
  {
    title: "Web基本カラー（安全色）",
    desc: "UIでよく使う、扱いやすい基準色。文字・背景・状態表示に。",
    colors: [
      { name: "ダークテキスト", hex: "#1A1A1A" },
      { name: "本文グレー", hex: "#4B5563" },
      { name: "ボーダー", hex: "#E5E7EB" },
      { name: "背景ライト", hex: "#F9FAFB" },
      { name: "プライマリ青", hex: "#2563EB" },
      { name: "成功グリーン", hex: "#16A34A" },
      { name: "警告アンバー", hex: "#D97706" },
      { name: "エラーレッド", hex: "#DC2626" },
    ],
  },
  {
    title: "日本の伝統色（和色）",
    desc: "和のデザインや落ち着いた配色に使える伝統色。",
    colors: [
      { name: "藍色（あいいろ）", hex: "#165E83" },
      { name: "朱色（しゅいろ）", hex: "#EB6101" },
      { name: "萌黄（もえぎ）", hex: "#AACF53" },
      { name: "桜色（さくらいろ）", hex: "#FEEEED" },
      { name: "山吹色（やまぶき）", hex: "#F8B500" },
      { name: "紺青（こんじょう）", hex: "#192F60" },
      { name: "臙脂（えんじ）", hex: "#B94047" },
      { name: "利休鼠（りきゅうねずみ）", hex: "#888E7E" },
    ],
  },
];
