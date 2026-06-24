"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Plus, Trash2, Printer } from "lucide-react";

type Theme =
  | "simple"
  | "modern_cafe"
  | "natural_cafe"
  | "retro_kissa"
  | "izakaya"
  | "washoku"
  | "bar"
  | "family"
  | "chuka"
  | "minimal";
type LayoutDirection = "horizontal" | "vertical";
type PriceInputMode = "taxIncluded" | "taxExcluded";
type PriceDisplayMode =
  | "taxIncludedOnly"
  | "taxExcludedWithIncluded"
  | "taxIncludedWithExcluded";
type RoundingMode = "round" | "floor" | "ceil";

interface PriceSettings {
  inputMode: PriceInputMode;
  taxRate: number;
  displayMode: PriceDisplayMode;
  roundingMode: RoundingMode;
}

interface MenuItem {
  id: string;
  name: string;
  price: string;
  description: string;
  allergens: string;
  isTakeout: boolean;
  isRecommended: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

type CategoryStyle = "filled" | "underline" | "bordered" | "double" | "side-bar";
type BadgeStyle = "outline" | "filled" | "tag";

interface ThemeConfig {
  label: string;
  description: string;
  recommendedFor: string;
  defaultDirection: LayoutDirection;
  bg: string;
  headerBg: string;
  headerText: string;
  categoryBg: string;
  categoryText: string;
  categoryBorder: string;
  itemBorder: string;
  textColor: string;
  mutedColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  categoryStyle: CategoryStyle;
  badgeStyle: BadgeStyle;
}

// ── Price functions ──────────────────────────────────────────────────────────

function applyRounding(value: number, mode: RoundingMode): number {
  if (mode === "floor") return Math.floor(value);
  if (mode === "ceil") return Math.ceil(value);
  return Math.round(value);
}

function getTaxIncludedPrice(base: number, s: PriceSettings): number {
  if (s.inputMode === "taxIncluded") return base;
  return applyRounding(base * (1 + s.taxRate), s.roundingMode);
}

function getTaxExcludedPrice(base: number, s: PriceSettings): number {
  if (s.inputMode === "taxExcluded") return base;
  return applyRounding(base / (1 + s.taxRate), s.roundingMode);
}

function formatPrice(rawPrice: string, s: PriceSettings): string {
  const base = parseInt(rawPrice, 10);
  if (isNaN(base) || base <= 0) return "";
  const inc = getTaxIncludedPrice(base, s);
  const exc = getTaxExcludedPrice(base, s);
  if (s.displayMode === "taxIncludedOnly") return `¥${inc.toLocaleString()}`;
  if (s.displayMode === "taxExcludedWithIncluded")
    return `¥${exc.toLocaleString()}（税込¥${inc.toLocaleString()}）`;
  return `¥${inc.toLocaleString()}（税抜¥${exc.toLocaleString()}）`;
}

function getAutoNote(s: PriceSettings): string {
  if (s.displayMode === "taxIncludedOnly") return "表示価格はすべて税込です。";
  if (s.displayMode === "taxExcludedWithIncluded")
    return "表示価格は税抜価格です。括弧内に税込価格を記載しています。";
  return "表示価格は税込価格です。括弧内に税抜価格を記載しています。";
}

// ── Theme configs ────────────────────────────────────────────────────────────

const GOTHIC = '"Hiragino Kaku Gothic ProN","Noto Sans JP",sans-serif';
const ROUND_GOTHIC = '"Hiragino Maru Gothic ProN","Noto Sans JP",sans-serif';
const MINCHO = '"Hiragino Mincho ProN","Yu Mincho","YuMincho",serif';

const THEME_CONFIGS: Record<Theme, ThemeConfig> = {
  simple: {
    label: "シンプル",
    description: "白背景・細い罫線・読みやすい基本レイアウト",
    recommendedFor: "幅広い飲食店・印刷用途全般",
    defaultDirection: "horizontal",
    bg: "#ffffff",
    headerBg: "#1e293b",
    headerText: "#ffffff",
    categoryBg: "#f1f5f9",
    categoryText: "#334155",
    categoryBorder: "#cbd5e1",
    itemBorder: "#e2e8f0",
    textColor: "#1e293b",
    mutedColor: "#64748b",
    accentColor: "#e11d48",
    headingFont: GOTHIC,
    bodyFont: GOTHIC,
    categoryStyle: "filled",
    badgeStyle: "outline",
  },
  modern_cafe: {
    label: "モダンカフェ",
    description: "ベージュ・ブラウン系・英字サブタイトル付き",
    recommendedFor: "カフェ・コーヒースタンド・ランチ店",
    defaultDirection: "horizontal",
    bg: "#fdf8f0",
    headerBg: "#7c5c3e",
    headerText: "#fdf8f0",
    categoryBg: "#f5ede0",
    categoryText: "#7c5c3e",
    categoryBorder: "#c8a97e",
    itemBorder: "#e8d9c8",
    textColor: "#3d2b1f",
    mutedColor: "#9e8070",
    accentColor: "#c8956c",
    headingFont: MINCHO,
    bodyFont: GOTHIC,
    categoryStyle: "underline",
    badgeStyle: "filled",
  },
  natural_cafe: {
    label: "ナチュラルカフェ",
    description: "生成り背景・グリーン系・やさしい余白",
    recommendedFor: "オーガニック・ベーカリー・スイーツ店",
    defaultDirection: "horizontal",
    bg: "#f5f0e8",
    headerBg: "#5c7a4e",
    headerText: "#f5f0e8",
    categoryBg: "#e8f0e4",
    categoryText: "#3d5c35",
    categoryBorder: "#6b9e5e",
    itemBorder: "#c8d9c0",
    textColor: "#2d3d28",
    mutedColor: "#6b7f62",
    accentColor: "#6b9e5e",
    headingFont: ROUND_GOTHIC,
    bodyFont: ROUND_GOTHIC,
    categoryStyle: "side-bar",
    badgeStyle: "outline",
  },
  retro_kissa: {
    label: "喫茶店レトロ",
    description: "クリーム色・二重線・昭和クラシックな雰囲気",
    recommendedFor: "純喫茶・レトロ喫茶・昔ながらの喫茶店",
    defaultDirection: "horizontal",
    bg: "#fef9e7",
    headerBg: "#6b3a2a",
    headerText: "#fef9e7",
    categoryBg: "#fef9e7",
    categoryText: "#5d3a2a",
    categoryBorder: "#8b5a3a",
    itemBorder: "#d4a88a",
    textColor: "#3d2510",
    mutedColor: "#8b6a50",
    accentColor: "#c0392b",
    headingFont: MINCHO,
    bodyFont: MINCHO,
    categoryStyle: "double",
    badgeStyle: "tag",
  },
  izakaya: {
    label: "居酒屋",
    description: "和紙風・赤と黒・短冊スタイル",
    recommendedFor: "居酒屋・焼き鳥・海鮮・串揚げ",
    defaultDirection: "vertical",
    bg: "#f5f0e6",
    headerBg: "#1a0a00",
    headerText: "#f5e6c8",
    categoryBg: "#f5f0e6",
    categoryText: "#1a0a00",
    categoryBorder: "#c0392b",
    itemBorder: "#d4c4a8",
    textColor: "#1a0a00",
    mutedColor: "#8b7355",
    accentColor: "#c0392b",
    headingFont: GOTHIC,
    bodyFont: GOTHIC,
    categoryStyle: "side-bar",
    badgeStyle: "tag",
  },
  washoku: {
    label: "和食・割烹",
    description: "余白広め・明朝体・縦書き対応",
    recommendedFor: "和食・寿司・蕎麦・懐石・割烹",
    defaultDirection: "vertical",
    bg: "#f9f7f3",
    headerBg: "#3d3228",
    headerText: "#f9f7f3",
    categoryBg: "#f9f7f3",
    categoryText: "#3d3228",
    categoryBorder: "#8b7355",
    itemBorder: "#d4cdc0",
    textColor: "#2d2820",
    mutedColor: "#8b7a6a",
    accentColor: "#8b6f5e",
    headingFont: MINCHO,
    bodyFont: MINCHO,
    categoryStyle: "underline",
    badgeStyle: "outline",
  },
  bar: {
    label: "バー・ビストロ",
    description: "黒背景・ゴールド・上品な夜のメニュー",
    recommendedFor: "バー・ワインバー・ビストロ・夜営業",
    defaultDirection: "horizontal",
    bg: "#1a1a2e",
    headerBg: "#0d0d1a",
    headerText: "#c9a84c",
    categoryBg: "#1a1a2e",
    categoryText: "#c9a84c",
    categoryBorder: "#c9a84c",
    itemBorder: "#2d2d4a",
    textColor: "#e8e4d8",
    mutedColor: "#8a8a9a",
    accentColor: "#c9a84c",
    headingFont: MINCHO,
    bodyFont: GOTHIC,
    categoryStyle: "underline",
    badgeStyle: "filled",
  },
  family: {
    label: "ファミリーレストラン",
    description: "明るい配色・大きめ価格・見やすさ重視",
    recommendedFor: "ファミレス・定食屋・地域飲食店",
    defaultDirection: "horizontal",
    bg: "#fff9f0",
    headerBg: "#e65100",
    headerText: "#ffffff",
    categoryBg: "#fff3e0",
    categoryText: "#bf360c",
    categoryBorder: "#ff8a50",
    itemBorder: "#ffe0b2",
    textColor: "#1a1a1a",
    mutedColor: "#6b5a4a",
    accentColor: "#e65100",
    headingFont: GOTHIC,
    bodyFont: GOTHIC,
    categoryStyle: "filled",
    badgeStyle: "filled",
  },
  chuka: {
    label: "町中華・定食屋",
    description: "白赤黄・力強い文字・情報量が多くても読める",
    recommendedFor: "町中華・ラーメン・定食・食堂",
    defaultDirection: "horizontal",
    bg: "#ffffff",
    headerBg: "#c0392b",
    headerText: "#ffffff",
    categoryBg: "#ffffff",
    categoryText: "#c0392b",
    categoryBorder: "#c0392b",
    itemBorder: "#f0d0cc",
    textColor: "#1a1a1a",
    mutedColor: "#6b6b6b",
    accentColor: "#f0c030",
    headingFont: GOTHIC,
    bodyFont: GOTHIC,
    categoryStyle: "bordered",
    badgeStyle: "filled",
  },
  minimal: {
    label: "ミニマル高級店",
    description: "極限まで余白を取り装飾を抑えた上質感",
    recommendedFor: "レストラン・コース料理・ホテル・予約制店舗",
    defaultDirection: "horizontal",
    bg: "#ffffff",
    headerBg: "#ffffff",
    headerText: "#1a1a1a",
    categoryBg: "#ffffff",
    categoryText: "#333333",
    categoryBorder: "#cccccc",
    itemBorder: "#eeeeee",
    textColor: "#1a1a1a",
    mutedColor: "#888888",
    accentColor: "#333333",
    headingFont: MINCHO,
    bodyFont: MINCHO,
    categoryStyle: "underline",
    badgeStyle: "outline",
  },
};

// ── Sample data ──────────────────────────────────────────────────────────────

function mkItem(
  name: string,
  price: string,
  description: string,
  allergens = "",
  isTakeout = false,
  isRecommended = false
): MenuItem {
  return {
    id: crypto.randomUUID(),
    name,
    price,
    description,
    allergens,
    isTakeout,
    isRecommended,
  };
}
function mkCat(name: string, items: MenuItem[]): MenuCategory {
  return { id: crypto.randomUUID(), name, items };
}

const SAMPLE_DATA: Record<Theme, MenuCategory[]> = {
  simple: [
    mkCat("フード", [
      mkItem("本日の定食", "850", "日替わりメインに小鉢・味噌汁・ご飯付き", "小麦・卵", false, true),
      mkItem("唐揚げ定食", "780", "国産鶏もも肉のジューシーな唐揚げ", "小麦・大豆", true),
    ]),
    mkCat("ドリンク", [
      mkItem("コーヒー", "350", "自家焙煎ブレンド", "", true),
      mkItem("生ビール", "480", "サッポロ黒ラベル", "小麦", false, true),
    ]),
  ],
  modern_cafe: [
    mkCat("Coffee & Tea", [
      mkItem("ハンドドリップコーヒー", "650", "その日おすすめの産地豆を丁寧に抽出", "", true, true),
      mkItem("カフェラテ", "700", "エスプレッソと滑らかなスチームミルク", "乳", true),
      mkItem("季節のハーブティー", "600", "産地直送のオーガニックハーブ", "", true),
    ]),
    mkCat("Food", [
      mkItem("クロックムッシュ", "850", "カリカリのトーストにハムとチーズを重ねて", "小麦・乳・卵", false, true),
      mkItem("本日のキッシュ", "900", "シェフ手作り、素材は季節により変わります", "小麦・卵・乳"),
      mkItem("チーズケーキ", "680", "ニューヨークスタイルのしっかりとした味わい", "小麦・卵・乳"),
    ]),
  ],
  natural_cafe: [
    mkCat("ドリンク", [
      mkItem("オーガニックコーヒー", "600", "農薬不使用の豆を使用した自家焙煎", "", true, true),
      mkItem("豆乳ラテ", "680", "国産大豆の豆乳とエスプレッソ", "大豆", true),
      mkItem("野菜スムージー", "750", "旬の野菜と果物をミックス", "", true),
    ]),
    mkCat("フード", [
      mkItem("雑穀ごはんプレート", "980", "十六穀米と季節の惣菜3種", "大豆", false, true),
      mkItem("豆腐のサラダ", "680", "有機野菜と手作り豆腐のさっぱりサラダ", "大豆"),
      mkItem("焼きたてスコーン", "420", "全粒粉使用、バターとジャム添え", "小麦・乳"),
    ]),
  ],
  retro_kissa: [
    mkCat("コーヒー", [
      mkItem("ブレンドコーヒー", "400", "こだわりのオリジナルブレンド", "", true),
      mkItem("アイスコーヒー", "450", "じっくり水出しした深い味わい", "", true),
      mkItem("カフェオレ", "480", "ホットもアイスも選べます", "乳", true),
    ]),
    mkCat("フード", [
      mkItem("ナポリタン", "750", "昔ながらの喫茶店スパゲッティ", "小麦・卵", false, true),
      mkItem("トースト", "300", "バタートースト、ジャム付き", "小麦・乳"),
      mkItem("プリン", "350", "固めのカラメルプリン", "卵・乳", false, true),
    ]),
  ],
  izakaya: [
    mkCat("一品料理", [
      mkItem("炭火焼き鳥盛り合わせ", "980", "もも・つくね・ねぎまの三本盛り", "", false, true),
      mkItem("だし巻き玉子", "480", "出汁をたっぷり含んだふわとろ玉子", "卵"),
      mkItem("冷やっこ", "380", "国産大豆の豆腐、薬味添え", "大豆"),
    ]),
    mkCat("お刺身", [
      mkItem("本日の刺身三点盛り", "1200", "その日の仕入れによります", "えび・いか", false, true),
      mkItem("まぐろ赤身", "680", "境港産 本まぐろ"),
    ]),
    mkCat("飲み物", [
      mkItem("生ビール", "600", "サッポロ生ビール黒ラベル", "小麦", false, true),
      mkItem("日本酒（一合）", "580", "本日のおすすめ地酒をお聞きください"),
      mkItem("ハイボール", "480", "ウイスキーハイボール", "小麦"),
    ]),
  ],
  washoku: [
    mkCat("定食", [
      mkItem("焼き魚定食", "1200", "旬の魚の塩焼き・ご飯・味噌汁・小鉢", "えび・かに・大豆", false, true),
      mkItem("天ぷら定食", "1400", "海老・野菜の天ぷら盛り合わせ", "小麦・えび"),
      mkItem("煮魚定食", "1100", "本日の魚のじっくり煮付け", "えび・かに・大豆"),
    ]),
    mkCat("一品", [
      mkItem("茶碗蒸し", "480", "なめらかな出汁仕立て", "卵・えび", false, true),
      mkItem("季節の炊き込みご飯", "380", "旬の食材を使った土鍋炊き"),
      mkItem("抹茶わらび餅", "520", "国産抹茶と本わらび粉使用", "小麦"),
    ]),
  ],
  bar: [
    mkCat("Wine", [
      mkItem("グラスワイン（赤）", "800", "本日のおすすめを黒板でご確認ください", "", false, true),
      mkItem("グラスワイン（白）", "800", "季節によってセレクトが変わります"),
      mkItem("スパークリング", "900", "グラスシャンパーニュ"),
    ]),
    mkCat("Spirits", [
      mkItem("クラフトジン", "900", "国内クラフトディスティラリーより厳選", "", false, true),
      mkItem("バーボン", "850", "ケンタッキー産シングルバレル"),
    ]),
    mkCat("Food", [
      mkItem("チーズ盛り合わせ", "1200", "3種のチーズとクラッカー", "乳・小麦", false, true),
      mkItem("本日のパスタ", "1400", "黒板メニューをご確認ください", "小麦・卵"),
    ]),
  ],
  family: [
    mkCat("定食・セット", [
      mkItem("日替わり定食", "850", "ご飯・みそ汁・小鉢付き", "小麦・大豆", false, true),
      mkItem("ハンバーグセット", "980", "手ごねハンバーグ 和風ソース", "小麦・卵", true, true),
      mkItem("チキン南蛮定食", "920", "ふっくらチキンにタルタルソース", "小麦・卵・乳", true),
    ]),
    mkCat("ドリンク", [
      mkItem("コーヒー", "280", "ホット・アイス選べます", "", true),
      mkItem("オレンジジュース", "300", "100%果汁", "", true),
    ]),
  ],
  chuka: [
    mkCat("麺類", [
      mkItem("ラーメン", "750", "豚骨醤油スープ、国産チャーシュー2枚", "小麦・大豆・卵", false, true),
      mkItem("担々麺", "900", "自家製芝麻醤、花椒仕立て", "小麦・大豆・ごま"),
      mkItem("野菜炒め麺", "800", "たっぷり野菜の塩あんかけ", "小麦・大豆"),
    ]),
    mkCat("定食", [
      mkItem("回鍋肉定食", "880", "豚肉とキャベツの甜麺醤炒め、ご飯・スープ付き", "小麦・大豆", false, true),
      mkItem("麻婆豆腐定食", "850", "ピリ辛本格四川風、ご飯・スープ付き", "小麦・大豆"),
    ]),
    mkCat("単品", [
      mkItem("餃子", "380", "手包み焼き餃子6個", "小麦・大豆", true, true),
      mkItem("半チャーハン", "350", "パラパラ炒飯", "卵・大豆", true),
    ]),
  ],
  minimal: [
    mkCat("Amuse-bouche", [mkItem("本日のアミューズ", "", "シェフのご挨拶をひと品に", "要アレルギー確認")]),
    mkCat("Entrée", [
      mkItem("前菜プレート", "", "旬の食材を3種盛り合わせ"),
      mkItem("スープ・ド・ポワソン", "", ""),
    ]),
    mkCat("Plat", [
      mkItem("本日のポワソン", "", "本日入荷の魚介料理"),
      mkItem("本日のヴィアンド", "", "熟成肉のポワレ", ""),
    ]),
    mkCat("Dessert", [
      mkItem("デセール", "", "パティシエ手作り、季節の素材を使って"),
      mkItem("ミニャルディーズ", "", "小菓子の盛り合わせ"),
    ]),
  ],
};

// ── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "restaurant-menu-maker-v2";

function newItem(): MenuItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    price: "",
    description: "",
    allergens: "",
    isTakeout: false,
    isRecommended: false,
  };
}

const inputClass =
  "w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500";

const AUTO_NOTES = [
  "表示価格はすべて税込です。",
  "表示価格は税抜価格です。括弧内に税込価格を記載しています。",
  "表示価格は税込価格です。括弧内に税抜価格を記載しています。",
];

// ── MenuPreview component ────────────────────────────────────────────────────

function MenuPreview({
  categories,
  theme,
  storeName,
  storeNote,
  layoutDirection,
  priceSettings,
  forPrint = false,
}: {
  categories: MenuCategory[];
  theme: Theme;
  storeName: string;
  storeNote: string;
  layoutDirection: LayoutDirection;
  priceSettings: PriceSettings;
  forPrint?: boolean;
}) {
  const tc = THEME_CONFIGS[theme];
  const isVertical = layoutDirection === "vertical";

  // Sizing
  const headerFontSize = forPrint ? "22px" : "16px";
  const catFontSize = forPrint ? "13px" : "10px";
  const itemFontSize = forPrint ? "12px" : "9px";
  const descFontSize = forPrint ? "10px" : "8px";
  const priceFontSize = forPrint ? "13px" : "10px";
  const badgeFontSize = forPrint ? "9px" : "7px";
  const noteFontSize = forPrint ? "10px" : "8px";
  const pad = forPrint ? "16px" : "12px";
  const catPad = forPrint ? "10px 16px" : "6px 10px";
  const itemPad = forPrint ? "10px 4px" : "6px 4px";
  const catMarginBottom = forPrint ? "12px" : "8px";
  const sectionMarginBottom = forPrint ? "20px" : "12px";

  function renderCategoryHead(cat: MenuCategory) {
    const base: React.CSSProperties = {
      fontFamily: tc.headingFont,
      fontSize: catFontSize,
      fontWeight: "bold",
      color: tc.categoryText,
      marginBottom: catMarginBottom,
    };
    if (tc.categoryStyle === "filled") {
      return (
        <div style={{ ...base, backgroundColor: tc.categoryBg, padding: catPad }}>
          {cat.name}
        </div>
      );
    }
    if (tc.categoryStyle === "underline") {
      return (
        <div
          style={{
            ...base,
            borderBottom: `1.5px solid ${tc.categoryBorder}`,
            paddingBottom: "4px",
            letterSpacing: "0.05em",
          }}
        >
          {cat.name}
        </div>
      );
    }
    if (tc.categoryStyle === "bordered") {
      return (
        <div
          style={{
            ...base,
            border: `1.5px solid ${tc.categoryBorder}`,
            padding: catPad,
            textAlign: "center",
          }}
        >
          {cat.name}
        </div>
      );
    }
    if (tc.categoryStyle === "double") {
      return (
        <div
          style={{
            ...base,
            borderTop: `2px solid ${tc.categoryBorder}`,
            borderBottom: `2px solid ${tc.categoryBorder}`,
            padding: "4px 0",
            textAlign: "center",
          }}
        >
          {cat.name}
        </div>
      );
    }
    // side-bar
    return (
      <div style={{ ...base, display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: "4px",
            height: "1em",
            backgroundColor: tc.accentColor,
            flexShrink: 0,
          }}
        />
        {cat.name}
      </div>
    );
  }

  function renderBadge(label: string, color: string) {
    if (tc.badgeStyle === "filled") {
      return (
        <span
          style={{
            fontSize: badgeFontSize,
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: color,
            padding: "1px 4px",
            borderRadius: "2px",
          }}
        >
          {label}
        </span>
      );
    }
    if (tc.badgeStyle === "tag") {
      return (
        <span
          style={{
            fontSize: badgeFontSize,
            fontWeight: "bold",
            color,
            backgroundColor: `${color}18`,
            padding: "1px 4px",
            borderRadius: "2px",
            border: `1px solid ${color}`,
          }}
        >
          {label}
        </span>
      );
    }
    return (
      <span
        style={{
          fontSize: badgeFontSize,
          fontWeight: "bold",
          color,
          border: `1px solid ${color}`,
          padding: "0 4px",
          borderRadius: "2px",
        }}
      >
        {label}
      </span>
    );
  }

  function renderItemHorizontal(item: MenuItem) {
    const priceStr = formatPrice(item.price, priceSettings);
    return (
      <div
        key={item.id}
        style={{
          borderBottom: `1px solid ${tc.itemBorder}`,
          padding: itemPad,
          display: "flex",
          gap: "6px",
          fontFamily: tc.bodyFont,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              flexWrap: "wrap",
              marginBottom: "2px",
            }}
          >
            {item.isRecommended && renderBadge("おすすめ", tc.accentColor)}
            <span
              style={{ fontSize: itemFontSize, fontWeight: "600", color: tc.textColor }}
            >
              {item.name}
            </span>
            {item.isTakeout && renderBadge("テイクアウト可", "#059669")}
          </div>
          {item.description && (
            <div
              style={{
                fontSize: descFontSize,
                color: tc.mutedColor,
                lineHeight: "1.4",
                marginBottom: "1px",
              }}
            >
              {item.description}
            </div>
          )}
          {item.allergens && (
            <div style={{ fontSize: descFontSize, color: "#9f1239" }}>
              ⚠ {item.allergens}
            </div>
          )}
        </div>
        {priceStr && (
          <div
            style={{
              whiteSpace: "nowrap",
              fontWeight: "bold",
              fontSize: priceFontSize,
              color: tc.textColor,
              alignSelf: "flex-start",
              flexShrink: 0,
            }}
          >
            {priceStr}
          </div>
        )}
      </div>
    );
  }

  function renderItemVertical(item: MenuItem) {
    const priceStr = formatPrice(item.price, priceSettings);
    return (
      <div
        key={item.id}
        style={{
          borderBottom: `1px solid ${tc.itemBorder}`,
          padding: "4px 8px",
          fontFamily: tc.bodyFont,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
          minHeight: "40px",
        }}
      >
        <div
          style={{
            writingMode: "vertical-rl",
            fontSize: itemFontSize,
            fontWeight: "600",
            color: tc.textColor,
            letterSpacing: "0.1em",
          }}
        >
          {item.name}
        </div>
        {item.isRecommended && (
          <div
            style={{
              writingMode: "vertical-rl",
              fontSize: descFontSize,
              color: tc.accentColor,
              fontWeight: "bold",
            }}
          >
            ◆
          </div>
        )}
        {priceStr && (
          <div
            style={
              {
                fontSize: descFontSize,
                color: tc.textColor,
                textCombineUpright: "all",
                writingMode: "vertical-rl",
              } as React.CSSProperties
            }
          >
            {priceStr}
          </div>
        )}
      </div>
    );
  }

  const filteredCats = categories.filter((c) => c.items.some((i) => i.name));

  if (isVertical) {
    return (
      <div
        style={{
          backgroundColor: tc.bg,
          fontFamily: tc.bodyFont,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: tc.headerBg,
            color: tc.headerText,
            padding: `${pad} ${pad}`,
            textAlign: "center",
            writingMode: "horizontal-tb",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              fontSize: headerFontSize,
              fontWeight: "bold",
              fontFamily: tc.headingFont,
              letterSpacing: "0.2em",
            }}
          >
            {storeName || "メニュー"}
          </div>
        </div>
        {/* Vertical layout: categories flow right to left */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row-reverse",
            gap: forPrint ? "16px" : "8px",
            padding: `0 ${pad}`,
            overflowX: "hidden",
          }}
        >
          {filteredCats.map((cat) => (
            <div
              key={cat.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: forPrint ? "60px" : "40px",
              }}
            >
              {/* Category name vertical */}
              <div
                style={{
                  writingMode: "vertical-rl",
                  fontFamily: tc.headingFont,
                  fontSize: catFontSize,
                  fontWeight: "bold",
                  color: tc.categoryText,
                  borderLeft:
                    tc.categoryStyle === "side-bar"
                      ? `3px solid ${tc.accentColor}`
                      : undefined,
                  borderBottom:
                    tc.categoryStyle === "underline"
                      ? `1.5px solid ${tc.categoryBorder}`
                      : undefined,
                  paddingLeft: tc.categoryStyle === "side-bar" ? "4px" : "0",
                  marginBottom: catMarginBottom,
                  letterSpacing: "0.1em",
                }}
              >
                {cat.name}
              </div>
              {/* Items */}
              {cat.items.filter((i) => i.name).map(renderItemVertical)}
            </div>
          ))}
        </div>
        {/* Footer */}
        {storeNote && (
          <div
            style={{
              padding: `8px ${pad}`,
              fontSize: noteFontSize,
              color: tc.mutedColor,
              borderTop: `1px solid ${tc.itemBorder}`,
              writingMode: "horizontal-tb",
            }}
          >
            {storeNote}
          </div>
        )}
      </div>
    );
  }

  // Horizontal layout
  return (
    <div
      style={{
        backgroundColor: tc.bg,
        fontFamily: tc.bodyFont,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: tc.headerBg,
          color: tc.headerText,
          padding: `${pad} ${pad}`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: headerFontSize,
            fontWeight: "bold",
            fontFamily: tc.headingFont,
            letterSpacing: theme === "minimal" ? "0.3em" : "0.1em",
          }}
        >
          {storeName || "メニュー"}
        </div>
        {theme === "modern_cafe" && (
          <div
            style={{
              fontSize: descFontSize,
              color: `${tc.headerText}aa`,
              marginTop: "2px",
              letterSpacing: "0.2em",
              fontFamily: "Georgia, serif",
            }}
          >
            MENU
          </div>
        )}
      </div>
      {/* Categories */}
      <div style={{ flex: 1, padding: `8px ${pad}`, overflow: "hidden" }}>
        {filteredCats.map((cat) => (
          <div key={cat.id} style={{ marginBottom: sectionMarginBottom }}>
            {renderCategoryHead(cat)}
            {cat.items.filter((i) => i.name).map(renderItemHorizontal)}
          </div>
        ))}
      </div>
      {/* Footer */}
      {storeNote && (
        <div
          style={{
            padding: `8px ${pad}`,
            fontSize: noteFontSize,
            color: tc.mutedColor,
            borderTop: `1px solid ${tc.itemBorder}`,
          }}
        >
          {storeNote}
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function RestaurantMenuMaker() {
  const [categories, setCategories] = useState<MenuCategory[]>(() => SAMPLE_DATA.simple);
  const [theme, setTheme] = useState<Theme>("simple");
  const [storeName, setStoreName] = useState("");
  const [storeNote, setStoreNote] = useState("表示価格はすべて税込です。");
  const [layoutDirection, setLayoutDirection] = useState<LayoutDirection>("horizontal");
  const [priceSettings, setPriceSettings] = useState<PriceSettings>({
    inputMode: "taxIncluded",
    taxRate: 0.1,
    displayMode: "taxIncludedOnly",
    roundingMode: "round",
  });
  const [customTaxRate, setCustomTaxRate] = useState("10");
  const [showSampleConfirm, setShowSampleConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const p = JSON.parse(saved) as Record<string, unknown>;
        if (p.categories) setCategories(p.categories as MenuCategory[]);
        if (p.theme) setTheme(p.theme as Theme);
        if (p.storeName !== undefined) setStoreName(p.storeName as string);
        if (p.storeNote !== undefined) setStoreNote(p.storeNote as string);
        if (p.layoutDirection) setLayoutDirection(p.layoutDirection as LayoutDirection);
        if (p.priceSettings) setPriceSettings(p.priceSettings as PriceSettings);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ categories, theme, storeName, storeNote, layoutDirection, priceSettings })
      );
    } catch {
      /* ignore */
    }
  }, [categories, theme, storeName, storeNote, layoutDirection, priceSettings]);

  // Auto-update note when priceSettings.displayMode changes (only if note is an auto-note)
  useEffect(() => {
    setStoreNote((prev) => {
      if (AUTO_NOTES.includes(prev)) return getAutoNote(priceSettings);
      return prev;
    });
  }, [priceSettings]);

  // Category operations
  const addCategory = useCallback(() => {
    setCategories((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "新しいカテゴリ", items: [newItem()] },
    ]);
  }, []);
  const removeCategory = useCallback((catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
  }, []);
  const updateCategoryName = useCallback((catId: string, name: string) => {
    setCategories((prev) => prev.map((c) => (c.id === catId ? { ...c, name } : c)));
  }, []);

  // Item operations
  const addItem = useCallback((catId: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, items: [...c.items, newItem()] } : c))
    );
  }, []);
  const removeItem = useCallback((catId: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c
      )
    );
  }, []);
  const updateItem = useCallback(
    (catId: string, itemId: string, field: keyof MenuItem, value: string | boolean) => {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === catId
            ? { ...c, items: c.items.map((i) => (i.id === itemId ? { ...i, [field]: value } : i)) }
            : c
        )
      );
    },
    []
  );

  function handleThemeChange(newTheme: Theme) {
    setTheme(newTheme);
    setLayoutDirection(THEME_CONFIGS[newTheme].defaultDirection);
  }

  function updatePriceSettings(patch: Partial<PriceSettings>) {
    setPriceSettings((prev) => ({ ...prev, ...patch }));
  }

  // Print DOM
  const printDom = (
    <div id="menu-print-root" style={{ display: "none", width: "190mm", margin: "0 auto" }}>
      <MenuPreview
        categories={categories}
        theme={theme}
        storeName={storeName}
        storeNote={storeNote}
        layoutDirection={layoutDirection}
        priceSettings={priceSettings}
        forPrint
      />
    </div>
  );

  // Inline preview: A4 aspect ratio scaled down
  const previewScale = 0.42;
  const a4WidthPx = 794;
  const a4HeightPx = 1123;

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 12mm 10mm; }
          body > *:not(#menu-print-root) { display: none !important; }
          #menu-print-root {
            display: block !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      {mounted && createPortal(printDom, document.body)}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">
          {/* 基本設定 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <h2 className="text-sm font-bold text-slate-700 dark:text-zinc-300 mb-4">基本設定</h2>
            <div className="space-y-4">
              {/* 店舗名 */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">
                  店舗名
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="例：café yoru."
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>

              {/* テーマ選択 */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-2">
                  テーマ
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(THEME_CONFIGS) as Theme[]).map((key) => {
                    const tc = THEME_CONFIGS[key];
                    const selected = theme === key;
                    return (
                      <button
                        key={key}
                        onClick={() => handleThemeChange(key)}
                        className={`rounded-xl border-2 p-2.5 text-left transition-all ${
                          selected
                            ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                            : "border-slate-200 dark:border-zinc-700 hover:border-orange-300"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <div
                            className="w-4 h-4 rounded-full border border-slate-200 flex-shrink-0"
                            style={{ backgroundColor: tc.headerBg }}
                          />
                          <span
                            className={`text-xs font-bold truncate ${
                              selected
                                ? "text-orange-700 dark:text-orange-400"
                                : "text-slate-700 dark:text-zinc-300"
                            }`}
                          >
                            {tc.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 leading-tight">
                          {tc.recommendedFor}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* レイアウト方向 */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-2">
                  レイアウト方向
                </label>
                <div className="flex gap-2">
                  {(
                    [
                      ["horizontal", "横書き"],
                      ["vertical", "縦書き"],
                    ] as [LayoutDirection, string][]
                  ).map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setLayoutDirection(val)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        layoutDirection === val
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-600 hover:border-orange-400"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 価格設定 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <h2 className="text-sm font-bold text-slate-700 dark:text-zinc-300 mb-4">価格設定</h2>
            <div className="space-y-3">
              {/* 入力基準 */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1.5">
                  価格入力の基準
                </label>
                <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-zinc-700">
                  {(
                    [
                      ["taxIncluded", "税込で入力"],
                      ["taxExcluded", "税抜で入力"],
                    ] as [PriceInputMode, string][]
                  ).map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => updatePriceSettings({ inputMode: val })}
                      className={`flex-1 py-2 text-xs font-medium transition-colors ${
                        priceSettings.inputMode === val
                          ? "bg-orange-500 text-white"
                          : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-orange-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 税率 */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1.5">
                  税率
                </label>
                <div className="flex gap-2">
                  {(
                    [
                      ["10", 0.1],
                      ["8", 0.08],
                    ] as [string, number][]
                  ).map(([label, val]) => (
                    <button
                      key={label}
                      onClick={() => {
                        updatePriceSettings({ taxRate: val });
                        setCustomTaxRate(label);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        priceSettings.taxRate === val
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-600 text-slate-600 dark:text-zinc-400 hover:border-orange-400"
                      }`}
                    >
                      {label}%
                    </button>
                  ))}
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="99"
                      className="w-16 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="任意"
                      value={customTaxRate}
                      onChange={(e) => {
                        setCustomTaxRate(e.target.value);
                        const parsed = parseFloat(e.target.value);
                        if (!isNaN(parsed)) updatePriceSettings({ taxRate: parsed / 100 });
                      }}
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                </div>
              </div>

              {/* 表示形式 */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1.5">
                  価格の表示形式
                </label>
                <div className="space-y-1.5">
                  {(
                    [
                      ["taxIncludedOnly", "税込価格のみ（例：¥1,100）"],
                      ["taxExcludedWithIncluded", "税抜 + 税込を併記（例：¥1,000（税込¥1,100））"],
                      ["taxIncludedWithExcluded", "税込 + 税抜を小さく（例：¥1,100（税抜¥1,000））"],
                    ] as [PriceDisplayMode, string][]
                  ).map(([val, label]) => (
                    <label key={val} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="displayMode"
                        checked={priceSettings.displayMode === val}
                        onChange={() => updatePriceSettings({ displayMode: val })}
                        className="accent-orange-500"
                      />
                      <span className="text-xs text-slate-600 dark:text-zinc-400">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 端数処理 (show only when taxExcluded) */}
              {priceSettings.inputMode === "taxExcluded" && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1.5">
                    端数処理
                  </label>
                  <div className="flex gap-2">
                    {(
                      [
                        ["round", "四捨五入"],
                        ["floor", "切り捨て"],
                        ["ceil", "切り上げ"],
                      ] as [RoundingMode, string][]
                    ).map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => updatePriceSettings({ roundingMode: val })}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          priceSettings.roundingMode === val
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-600 text-slate-600 dark:text-zinc-400 hover:border-orange-400"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Live example */}
              <div className="rounded-lg bg-slate-50 dark:bg-zinc-800 px-3 py-2 text-xs text-slate-500 dark:text-zinc-400">
                例：入力値800 →{" "}
                <span className="font-bold text-slate-700 dark:text-zinc-200">
                  {formatPrice("800", priceSettings)}
                </span>
              </div>
            </div>
          </div>

          {/* Categories */}
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  className="flex-1 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3 py-2 text-sm font-bold text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="カテゴリ名"
                  value={cat.name}
                  onChange={(e) => updateCategoryName(cat.id, e.target.value)}
                />
                <button
                  onClick={() => removeCategory(cat.id)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                  title="カテゴリを削除"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="space-y-3">
                {cat.items.map((item) => (
                  <div
                    key={item.id}
                    className="border border-slate-100 dark:border-zinc-700 rounded-xl p-3 bg-slate-50 dark:bg-zinc-800/50"
                  >
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className="block text-xs text-slate-500 dark:text-zinc-400 mb-1">
                          メニュー名 <span className="text-orange-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="例：ナポリタン"
                          value={item.name}
                          onChange={(e) => updateItem(cat.id, item.id, "name", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 dark:text-zinc-400 mb-1">
                          価格（
                          {priceSettings.inputMode === "taxIncluded" ? "税込" : "税抜"}）
                        </label>
                        <input
                          type="number"
                          className={inputClass}
                          placeholder="例：800"
                          value={item.price}
                          onChange={(e) => updateItem(cat.id, item.id, "price", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="block text-xs text-slate-500 dark:text-zinc-400 mb-1">
                        説明文
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="例：国産小麦を使ったもちもちパスタ"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(cat.id, item.id, "description", e.target.value)
                        }
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-xs text-slate-500 dark:text-zinc-400 mb-1">
                        アレルギー情報
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="例：小麦・卵・乳を含む"
                        value={item.allergens}
                        onChange={(e) =>
                          updateItem(cat.id, item.id, "allergens", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 cursor-pointer">
                          <input
                            type="checkbox"
                            className="accent-orange-500"
                            checked={item.isTakeout}
                            onChange={(e) =>
                              updateItem(cat.id, item.id, "isTakeout", e.target.checked)
                            }
                          />
                          テイクアウト可
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 cursor-pointer">
                          <input
                            type="checkbox"
                            className="accent-orange-500"
                            checked={item.isRecommended}
                            onChange={(e) =>
                              updateItem(cat.id, item.id, "isRecommended", e.target.checked)
                            }
                          />
                          おすすめ
                        </label>
                      </div>
                      <button
                        onClick={() => removeItem(cat.id, item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                        title="削除"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => addItem(cat.id)}
                className="mt-3 flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                <Plus size={15} />
                メニューを追加
              </button>
            </div>
          ))}

          {/* Add category */}
          <button
            onClick={addCategory}
            className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-zinc-600 rounded-2xl text-sm text-slate-500 dark:text-zinc-400 hover:border-orange-400 hover:text-orange-500 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={16} />
            カテゴリを追加
          </button>
        </div>

        {/* Right column */}
        <div className="lg:col-span-1 space-y-4">
          {/* Preview */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4">
            <p className="text-xs font-bold text-slate-600 dark:text-zinc-400 mb-3">
              プレビュー（印刷イメージ）
            </p>
            <div
              style={{
                width: "100%",
                aspectRatio: `${a4WidthPx}/${a4HeightPx}`,
                position: "relative",
                overflow: "hidden",
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  width: `${a4WidthPx}px`,
                  height: `${a4HeightPx}px`,
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top left",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              >
                <MenuPreview
                  categories={categories}
                  theme={theme}
                  storeName={storeName}
                  storeNote={storeNote}
                  layoutDirection={layoutDirection}
                  priceSettings={priceSettings}
                />
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">
              メニュー下部の注記
            </label>
            <textarea
              className="w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              rows={3}
              placeholder="例：表示価格はすべて税込です。"
              value={storeNote}
              onChange={(e) => setStoreNote(e.target.value)}
            />
          </div>

          {/* Sample data */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <p className="text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">
              サンプルを読み込む
            </p>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3">
              現在のテーマ（{THEME_CONFIGS[theme].label}
              ）に合ったサンプルメニューを読み込みます。
            </p>
            {!showSampleConfirm ? (
              <button
                onClick={() => setShowSampleConfirm(true)}
                className="w-full py-2 border border-slate-200 dark:border-zinc-600 rounded-lg text-sm text-slate-600 dark:text-zinc-400 hover:border-orange-400 hover:text-orange-600 transition-colors"
              >
                テーマのサンプルを読み込む
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-red-600 dark:text-red-400">
                  現在の入力内容を上書きします。よろしいですか？
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCategories(SAMPLE_DATA[theme]);
                      setShowSampleConfirm(false);
                    }}
                    className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    確認して読み込む
                  </button>
                  <button
                    onClick={() => setShowSampleConfirm(false)}
                    className="flex-1 py-2 border border-slate-200 dark:border-zinc-600 rounded-lg text-xs text-slate-600 dark:text-zinc-400 hover:border-slate-400 transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Print */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5">
            <button
              onClick={() => window.print()}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-base flex items-center justify-center gap-2 transition-colors"
            >
              <Printer size={20} />
              印刷・PDF保存
            </button>
            <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400 text-center">
              印刷ダイアログで「PDFに保存」を選ぶとPDFファイルで保存できます
            </p>
          </div>

          {/* Tips */}
          <div className="bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-900/50 p-5">
            <p className="text-sm font-bold text-orange-800 dark:text-orange-300 mb-2">
              使い方のヒント
            </p>
            <ul className="text-xs text-orange-700 dark:text-orange-400 space-y-2">
              <li>・テーマを切り替えるとレイアウト方向も自動で変わります</li>
              <li>・税抜入力を選ぶと税込価格を自動計算して表示します</li>
              <li>・印刷時は「背景のグラフィック」をオンにしてください</li>
              <li>・内容はブラウザに自動保存されます</li>
              <li>・名前が空のメニューは印刷時にスキップされます</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
