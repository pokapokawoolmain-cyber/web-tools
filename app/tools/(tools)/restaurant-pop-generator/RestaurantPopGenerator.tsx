"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Printer, Copy, Check, ChevronDown } from "lucide-react";

type PopType =
  | "today_recommend"
  | "limited"
  | "takeout"
  | "hours_change"
  | "temporary_close"
  | "reservation"
  | "payment"
  | "new_menu"
  | "event"
  | "sns";

type PopTheme = "warm" | "cool" | "elegant" | "bold";

interface PopData {
  storeName: string;
  title: string;
  subtitle: string;
  body: string;
  note: string;
  price: string;
  period: string;
  theme: PopTheme;
}

type AllPopData = Record<PopType, PopData>;

const POP_TYPES: { type: PopType; label: string; emoji: string; description: string }[] = [
  { type: "today_recommend", label: "本日のおすすめ", emoji: "⭐", description: "おすすめメニューのPOP" },
  { type: "new_menu", label: "新メニュー登場", emoji: "🆕", description: "新商品・新メニューのお知らせ" },
  { type: "limited", label: "期間限定", emoji: "🎯", description: "期間限定メニューや特典のPOP" },
  { type: "takeout", label: "テイクアウト", emoji: "🥡", description: "テイクアウト対応のご案内" },
  { type: "hours_change", label: "営業時間変更", emoji: "🕐", description: "営業時間変更のお知らせ" },
  { type: "temporary_close", label: "臨時休業", emoji: "🔒", description: "臨時休業・定休日変更のお知らせ" },
  { type: "reservation", label: "予約受付中", emoji: "📅", description: "予約・貸切のご案内" },
  { type: "payment", label: "お支払い方法", emoji: "💳", description: "対応決済方法のご案内" },
  { type: "event", label: "イベント", emoji: "🎉", description: "イベント・キャンペーンのご案内" },
  { type: "sns", label: "SNSフォロー", emoji: "📱", description: "InstagramなどSNSへの誘導" },
];

const THEMES: { theme: PopTheme; label: string }[] = [
  { theme: "warm", label: "ウォーム（オレンジ系）" },
  { theme: "cool", label: "クール（ブルー系）" },
  { theme: "elegant", label: "エレガント（ダーク系）" },
  { theme: "bold", label: "ボールド（赤系）" },
];

const DEFAULT_DATA: Record<PopType, Omit<PopData, "storeName" | "theme">> = {
  today_recommend: {
    title: "本日のおすすめ",
    subtitle: "シェフ厳選の一皿",
    body: "旬の食材を使った特製料理をご用意しました。数量限定のため、お早めにどうぞ。",
    note: "※ 売り切れ次第終了となります",
    price: "¥1,200",
    period: "",
  },
  new_menu: {
    title: "新メニュー登場！",
    subtitle: "NEW ARRIVAL",
    body: "お客様のご要望にお応えして、新しいメニューが誕生しました。ぜひお試しください。",
    note: "※ レギュラーメニューに追加しました",
    price: "",
    period: "",
  },
  limited: {
    title: "期間限定",
    subtitle: "SPECIAL MENU",
    body: "この季節だけの特別メニューをご用意しました。期間中は数量に限りがありますので、お早めにご来店ください。",
    note: "※ なくなり次第終了",
    price: "",
    period: "〜 月 日（ ）まで",
  },
  takeout: {
    title: "テイクアウト\nはじめました",
    subtitle: "TAKE OUT",
    body: "ご注文はカウンターまたはお電話にて承ります。お電話でのご予約も歓迎です。",
    note: "※ 一部メニューはテイクアウト不可の場合があります",
    price: "",
    period: "",
  },
  hours_change: {
    title: "営業時間\n変更のお知らせ",
    subtitle: "NOTICE",
    body: "誠に勝手ながら、下記の通り営業時間を変更させていただきます。",
    note: "ご不便をおかけしますが、よろしくお願いいたします。",
    price: "",
    period: "【変更後】 ○○:○○ 〜 ○○:○○",
  },
  temporary_close: {
    title: "臨時休業のお知らせ",
    subtitle: "CLOSED",
    body: "誠に勝手ながら、下記の日程を臨時休業とさせていただきます。",
    note: "ご迷惑をおかけして申し訳ございません。",
    price: "",
    period: "休業日：　月　日（　）",
  },
  reservation: {
    title: "ご予約受付中",
    subtitle: "RESERVATION",
    body: "忘年会・新年会・各種宴会のご予約を承っております。2名様〜貸切も対応可能です。",
    note: "お気軽にお問い合わせください",
    price: "",
    period: "※ お電話またはカウンターにて",
  },
  payment: {
    title: "ご利用いただける\nお支払い方法",
    subtitle: "PAYMENT",
    body: "現金・クレジットカード・各種電子マネー・QRコード決済に対応しております。",
    note: "※ 一部サービスは対象外の場合があります",
    price: "",
    period: "",
  },
  event: {
    title: "イベント開催！",
    subtitle: "EVENT",
    body: "特別なイベントを開催します。皆様のご来店をスタッフ一同お待ちしております。",
    note: "※ 詳細はスタッフにお尋ねください",
    price: "",
    period: "開催日：　月　日（　）",
  },
  sns: {
    title: "フォローして\nください！",
    subtitle: "FOLLOW US",
    body: "最新情報やお得なクーポンをSNSで配信中！フォローしてお見逃しなく。",
    note: "プロフィールのリンクからどうぞ",
    price: "",
    period: "@ アカウント名",
  },
};

const STORAGE_KEY = "restaurant-pop-generator-v1";

const THEME_STYLES: Record<PopTheme, { bg: string; accent: string; text: string; sub: string; border: string }> = {
  warm: {
    bg: "linear-gradient(135deg, #ff6b35 0%, #f7c948 100%)",
    accent: "#ff6b35",
    text: "#fff",
    sub: "rgba(255,255,255,0.85)",
    border: "rgba(255,255,255,0.4)",
  },
  cool: {
    bg: "linear-gradient(135deg, #1a73e8 0%, #00b0ff 100%)",
    accent: "#1a73e8",
    text: "#fff",
    sub: "rgba(255,255,255,0.85)",
    border: "rgba(255,255,255,0.4)",
  },
  elegant: {
    bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    accent: "#c9a84c",
    text: "#fff",
    sub: "rgba(201,168,76,0.9)",
    border: "rgba(201,168,76,0.4)",
  },
  bold: {
    bg: "linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)",
    accent: "#c0392b",
    text: "#fff",
    sub: "rgba(255,255,255,0.85)",
    border: "rgba(255,255,255,0.4)",
  },
};

function PopPreview({ data, storeName, popType }: { data: PopData; storeName: string; popType: PopType }) {
  const s = THEME_STYLES[data.theme];
  const typeInfo = POP_TYPES.find((p) => p.type === popType)!;

  return (
    <div
      className="pop-preview-card"
      style={{
        background: s.bg,
        color: s.text,
        borderRadius: "16px",
        padding: "36px 32px",
        minHeight: "340px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
        }}
      />
      <div>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.15em",
            opacity: 0.75,
            marginBottom: 8,
            textTransform: "uppercase",
            borderBottom: `1px solid ${s.border}`,
            paddingBottom: 8,
          }}
        >
          {storeName || "店名"}　{typeInfo.emoji} {typeInfo.label}
        </div>
        <h2
          style={{
            fontSize: data.title.includes("\n") ? 26 : 30,
            fontWeight: 900,
            lineHeight: 1.3,
            margin: "12px 0 6px",
            whiteSpace: "pre-line",
          }}
        >
          {data.title || "タイトル"}
        </h2>
        {data.subtitle && (
          <p style={{ fontSize: 13, color: s.sub, letterSpacing: "0.1em", marginBottom: 4 }}>
            {data.subtitle}
          </p>
        )}
        {(data.price || data.period) && (
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: 8,
              padding: "6px 14px",
              display: "inline-block",
              marginTop: 8,
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            {data.price && <span>{data.price}</span>}
            {data.price && data.period && <span style={{ margin: "0 8px", opacity: 0.6 }}>｜</span>}
            {data.period && <span style={{ fontSize: 14 }}>{data.period}</span>}
          </div>
        )}
      </div>
      <div>
        {data.body && (
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.75,
              margin: "16px 0 8px",
              opacity: 0.95,
              whiteSpace: "pre-wrap",
            }}
          >
            {data.body}
          </p>
        )}
        {data.note && (
          <p style={{ fontSize: 11, opacity: 0.7, borderTop: `1px solid ${s.border}`, paddingTop: 8, marginTop: 8 }}>
            {data.note}
          </p>
        )}
      </div>
    </div>
  );
}

function PrintPortal({ data, storeName, popType }: { data: PopData; storeName: string; popType: PopType }) {
  const s = THEME_STYLES[data.theme];
  const typeInfo = POP_TYPES.find((p) => p.type === popType)!;

  return (
    <>
      <style>{`
        @media print {
          body > *:not(#pop-print-root) { display: none !important; }
          #pop-print-root { display: block !important; }
          @page { margin: 10mm; size: A4; }
        }
      `}</style>
      <div
        style={{
          width: "190mm",
          minHeight: "130mm",
          background: s.bg,
          color: s.text,
          borderRadius: "12px",
          padding: "28px 26px",
          fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
          }}
        />
        <div>
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.12em",
              opacity: 0.75,
              borderBottom: `1px solid ${s.border}`,
              paddingBottom: 6,
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            {storeName || "店名"}　{typeInfo.emoji} {typeInfo.label}
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.3, margin: "10px 0 4px", whiteSpace: "pre-line" }}>
            {data.title}
          </h2>
          {data.subtitle && (
            <p style={{ fontSize: 11, color: s.sub, letterSpacing: "0.1em" }}>{data.subtitle}</p>
          )}
          {(data.price || data.period) && (
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: 6,
                padding: "4px 12px",
                display: "inline-block",
                marginTop: 8,
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              {data.price && <span>{data.price}</span>}
              {data.price && data.period && <span style={{ margin: "0 6px", opacity: 0.6 }}>｜</span>}
              {data.period && <span style={{ fontSize: 12 }}>{data.period}</span>}
            </div>
          )}
        </div>
        <div>
          {data.body && (
            <p style={{ fontSize: 12, lineHeight: 1.7, margin: "12px 0 6px", whiteSpace: "pre-wrap" }}>
              {data.body}
            </p>
          )}
          {data.note && (
            <p style={{ fontSize: 9, opacity: 0.7, borderTop: `1px solid ${s.border}`, paddingTop: 6, marginTop: 6 }}>
              {data.note}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

const buildDefaultAllData = (storeName: string): AllPopData => {
  const theme: PopTheme = "warm";
  return Object.fromEntries(
    Object.entries(DEFAULT_DATA).map(([key, val]) => [key, { ...val, storeName, theme }])
  ) as AllPopData;
};

export function RestaurantPopGenerator() {
  const [mounted, setMounted] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [selectedType, setSelectedType] = useState<PopType>("today_recommend");
  const [allData, setAllData] = useState<AllPopData>(() => buildDefaultAllData(""));
  const [copied, setCopied] = useState(false);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.storeName !== undefined) setStoreName(parsed.storeName);
        if (parsed.allData) setAllData(parsed.allData);
      }
    } catch {
      // ignore
    }
  }, []);

  const save = useCallback((sn: string, data: AllPopData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ storeName: sn, allData: data }));
    } catch {
      // ignore
    }
  }, []);

  const updateField = (field: keyof PopData, value: string) => {
    setAllData((prev) => {
      const next = {
        ...prev,
        [selectedType]: { ...prev[selectedType], [field]: value },
      };
      save(storeName, next);
      return next;
    });
  };

  const updateStoreName = (value: string) => {
    setStoreName(value);
    save(value, allData);
  };

  const currentData = allData[selectedType];
  const currentTypeInfo = POP_TYPES.find((p) => p.type === selectedType)!;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = async () => {
    const lines = [
      currentData.title,
      currentData.subtitle,
      currentData.price && `価格: ${currentData.price}`,
      currentData.period && `期間: ${currentData.period}`,
      "",
      currentData.body,
      currentData.note,
    ]
      .filter(Boolean)
      .join("\n");

    await navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const FIELDS: { key: keyof PopData; label: string; placeholder: string; multiline?: boolean }[] = [
    { key: "title", label: "タイトル", placeholder: "例: 本日のおすすめ", multiline: true },
    { key: "subtitle", label: "サブタイトル", placeholder: "例: シェフ厳選の一皿" },
    { key: "price", label: "価格（任意）", placeholder: "例: ¥1,200 税込" },
    { key: "period", label: "期間・時間（任意）", placeholder: "例: 〜6月30日まで" },
    { key: "body", label: "本文", placeholder: "POPの説明文を入力してください", multiline: true },
    { key: "note", label: "注記（小文字）", placeholder: "例: ※ 売り切れ次第終了" },
  ];

  return (
    <div className="space-y-6">
      {/* Store name */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5">
        <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">
          店名（全POPに共通）
        </label>
        <input
          type="text"
          value={storeName}
          onChange={(e) => updateStoreName(e.target.value)}
          placeholder="例: カフェ○○"
          className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-4 py-2.5 text-sm text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* POP type selector */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5">
        <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3">POPの種類を選択</p>
        {/* Mobile: dropdown */}
        <div className="sm:hidden relative">
          <button
            onClick={() => setTypeMenuOpen((v) => !v)}
            className="w-full flex items-center justify-between rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-4 py-2.5 text-sm text-slate-800 dark:text-zinc-200"
          >
            <span>{currentTypeInfo.emoji} {currentTypeInfo.label}</span>
            <ChevronDown size={16} className={`transition-transform ${typeMenuOpen ? "rotate-180" : ""}`} />
          </button>
          {typeMenuOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl shadow-lg overflow-hidden">
              {POP_TYPES.map((p) => (
                <button
                  key={p.type}
                  onClick={() => { setSelectedType(p.type); setTypeMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-orange-50 dark:hover:bg-orange-950/30 ${selectedType === p.type ? "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 font-semibold" : "text-slate-700 dark:text-zinc-300"}`}
                >
                  <span>{p.emoji}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Desktop: grid */}
        <div className="hidden sm:grid grid-cols-5 gap-2">
          {POP_TYPES.map((p) => (
            <button
              key={p.type}
              onClick={() => setSelectedType(p.type)}
              className={`rounded-xl border px-2 py-2 text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                selectedType === p.type
                  ? "border-orange-400 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400"
                  : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-orange-950/20"
              }`}
            >
              <span className="text-lg">{p.emoji}</span>
              <span className="leading-tight text-center">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input fields */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 space-y-4">
            <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">内容を入力</p>

            {FIELDS.map(({ key, label, placeholder, multiline }) =>
              key === "storeName" ? null : (
                <div key={key}>
                  <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">{label}</label>
                  {multiline ? (
                    <textarea
                      value={currentData[key]}
                      onChange={(e) => updateField(key, e.target.value)}
                      placeholder={placeholder}
                      rows={key === "body" ? 4 : 2}
                      className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3 py-2 text-sm text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={currentData[key]}
                      onChange={(e) => updateField(key, e.target.value)}
                      placeholder={placeholder}
                      className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3 py-2 text-sm text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  )}
                </div>
              )
            )}

            {/* Theme */}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">テーマカラー</label>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map(({ theme, label }) => (
                  <button
                    key={theme}
                    onClick={() => updateField("theme", theme)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium text-left transition-all ${
                      currentData.theme === theme
                        ? "border-orange-400 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400"
                        : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:border-orange-300"
                    }`}
                  >
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-1.5 align-middle"
                      style={{
                        background:
                          theme === "warm"
                            ? "linear-gradient(135deg, #ff6b35, #f7c948)"
                            : theme === "cool"
                            ? "linear-gradient(135deg, #1a73e8, #00b0ff)"
                            : theme === "elegant"
                            ? "linear-gradient(135deg, #1a1a2e, #c9a84c)"
                            : "linear-gradient(135deg, #c0392b, #e74c3c)",
                      }}
                    />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleCopyText}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              {copied ? "コピーしました" : "テキストをコピー"}
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition-colors"
            >
              <Printer size={16} />
              印刷・PDF保存
            </button>
          </div>
        </div>

        {/* Preview */}
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3">プレビュー</p>
          <PopPreview data={currentData} storeName={storeName} popType={selectedType} />
          <p className="text-xs text-slate-500 dark:text-zinc-500 mt-2 text-center">
            ※ 実際の印刷はA4サイズで出力されます
          </p>
        </div>
      </div>

      {mounted &&
        createPortal(
          <div id="pop-print-root" style={{ display: "none" }}>
            <PrintPortal data={currentData} storeName={storeName} popType={selectedType} />
          </div>,
          document.body
        )}
    </div>
  );
}
