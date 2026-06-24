"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Printer, Copy, Check, ChevronDown, Upload, X } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type PopType =
  | "today_recommend" | "limited" | "takeout" | "hours_change"
  | "temporary_close" | "reservation" | "payment" | "new_menu"
  | "event" | "sns";

type PopTheme =
  | "warm" | "cool" | "elegant" | "bold"
  | "natural" | "japanese" | "luxury" | "pop_color"
  | "minimal" | "green" | "sweets" | "monochrome"
  | "neon" | "family";

type PopShape = "square" | "portrait" | "landscape" | "a4" | "a5" | "receipt";

interface PopData {
  storeName: string;
  title: string;
  subtitle: string;
  body: string;
  note: string;
  price: string;
  period: string;
  theme: PopTheme;
  qrCaption: string;
  qrUrl: string;
}

type AllPopData = Record<PopType, PopData>;

// ─── POP Types ────────────────────────────────────────────────────────────────
const POP_TYPES: { type: PopType; label: string; emoji: string }[] = [
  { type: "today_recommend", label: "本日のおすすめ", emoji: "⭐" },
  { type: "new_menu",        label: "新メニュー登場",  emoji: "✨" },
  { type: "limited",         label: "期間限定",        emoji: "🎯" },
  { type: "takeout",         label: "テイクアウト",    emoji: "🥡" },
  { type: "hours_change",    label: "営業時間変更",    emoji: "🕐" },
  { type: "temporary_close", label: "臨時休業",        emoji: "🔒" },
  { type: "reservation",     label: "予約受付中",      emoji: "📅" },
  { type: "payment",         label: "お支払い方法",    emoji: "💳" },
  { type: "event",           label: "イベント",        emoji: "🎉" },
  { type: "sns",             label: "SNSフォロー",     emoji: "📱" },
];

// ─── Themes ───────────────────────────────────────────────────────────────────
interface ThemeStyle {
  bg: string; accent: string; text: string; sub: string; border: string; titleColor?: string;
}

const THEME_STYLES: Record<PopTheme, ThemeStyle> = {
  warm:       { bg: "linear-gradient(135deg,#ff6b35 0%,#f7c948 100%)", accent: "#ff6b35", text: "#fff", sub: "rgba(255,255,255,0.85)", border: "rgba(255,255,255,0.4)" },
  cool:       { bg: "linear-gradient(135deg,#1a73e8 0%,#00b0ff 100%)", accent: "#1a73e8", text: "#fff", sub: "rgba(255,255,255,0.85)", border: "rgba(255,255,255,0.4)" },
  elegant:    { bg: "linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)", accent: "#c9a84c", text: "#fff", sub: "rgba(201,168,76,0.9)", border: "rgba(201,168,76,0.4)" },
  bold:       { bg: "linear-gradient(135deg,#c0392b 0%,#e74c3c 100%)", accent: "#c0392b", text: "#fff", sub: "rgba(255,255,255,0.85)", border: "rgba(255,255,255,0.4)" },
  natural:    { bg: "linear-gradient(135deg,#7B5E37 0%,#C8A97E 100%)", accent: "#7B5E37", text: "#fff", sub: "rgba(255,255,255,0.88)", border: "rgba(255,255,255,0.35)" },
  japanese:   { bg: "linear-gradient(135deg,#3D0C02 0%,#8B0000 100%)", accent: "#D4AF37", text: "#fff", sub: "rgba(212,175,55,0.9)", border: "rgba(212,175,55,0.35)" },
  luxury:     { bg: "linear-gradient(135deg,#0A0E27 0%,#1a2040 100%)", accent: "#B8860B", text: "#fff", sub: "rgba(184,134,11,0.9)", border: "rgba(184,134,11,0.4)" },
  pop_color:  { bg: "linear-gradient(135deg,#FF1493 0%,#FF8C00 100%)", accent: "#FF1493", text: "#fff", sub: "rgba(255,255,255,0.9)", border: "rgba(255,255,255,0.45)" },
  minimal:    { bg: "#FAFAFA", accent: "#333", text: "#111", sub: "#666", border: "#DDD" },
  green:      { bg: "linear-gradient(135deg,#1B5E20 0%,#4CAF50 100%)", accent: "#1B5E20", text: "#fff", sub: "rgba(255,255,255,0.88)", border: "rgba(255,255,255,0.35)" },
  sweets:     { bg: "linear-gradient(135deg,#FF89B5 0%,#FFD6E7 100%)", accent: "#D63384", text: "#4A0028", sub: "rgba(74,0,40,0.75)", border: "rgba(74,0,40,0.2)" },
  monochrome: { bg: "#1A1A1A", accent: "#fff", text: "#fff", sub: "rgba(255,255,255,0.7)", border: "rgba(255,255,255,0.25)" },
  neon:       { bg: "linear-gradient(135deg,#0A0A0A 0%,#1A0A1A 100%)", accent: "#00FF88", text: "#fff", sub: "#00FF88", border: "rgba(0,255,136,0.4)", titleColor: "#00FF88" },
  family:     { bg: "linear-gradient(135deg,#FF8C00 0%,#FFD700 100%)", accent: "#FF8C00", text: "#fff", sub: "rgba(255,255,255,0.9)", border: "rgba(255,255,255,0.4)" },
};

const THEMES: { theme: PopTheme; label: string; desc: string; swatch: string }[] = [
  { theme: "warm",       label: "ウォーム",       desc: "居酒屋・カジュアル",      swatch: "linear-gradient(135deg,#ff6b35,#f7c948)" },
  { theme: "cool",       label: "クール",         desc: "カフェ・バー",            swatch: "linear-gradient(135deg,#1a73e8,#00b0ff)" },
  { theme: "elegant",    label: "エレガント",     desc: "高級レストラン",          swatch: "linear-gradient(135deg,#1a1a2e,#c9a84c)" },
  { theme: "bold",       label: "ボールド",       desc: "ラーメン・中華",          swatch: "linear-gradient(135deg,#c0392b,#e74c3c)" },
  { theme: "natural",    label: "ナチュラル",     desc: "カフェ・ベーカリー",      swatch: "linear-gradient(135deg,#7B5E37,#C8A97E)" },
  { theme: "japanese",   label: "和風",           desc: "和食・定食屋・居酒屋",   swatch: "linear-gradient(135deg,#3D0C02,#8B0000)" },
  { theme: "luxury",     label: "ラグジュアリー", desc: "バー・特別ディナー",      swatch: "linear-gradient(135deg,#0A0E27,#B8860B)" },
  { theme: "pop_color",  label: "ポップ",         desc: "イベント・限定メニュー",  swatch: "linear-gradient(135deg,#FF1493,#FF8C00)" },
  { theme: "minimal",    label: "ミニマル",       desc: "白基調・清潔感",          swatch: "linear-gradient(135deg,#f5f5f5,#e0e0e0)" },
  { theme: "green",      label: "グリーン",       desc: "健康食・オーガニック",    swatch: "linear-gradient(135deg,#1B5E20,#4CAF50)" },
  { theme: "sweets",     label: "スイーツ",       desc: "カフェ・デザート",        swatch: "linear-gradient(135deg,#FF89B5,#FFD6E7)" },
  { theme: "monochrome", label: "モノクロ",       desc: "印刷コスト重視",          swatch: "linear-gradient(135deg,#1A1A1A,#555)" },
  { theme: "neon",       label: "ネオン",         desc: "バー・夜営業",            swatch: "linear-gradient(135deg,#0A0A0A,#00FF88)" },
  { theme: "family",     label: "ファミリー",     desc: "ファミレス・親子向け",    swatch: "linear-gradient(135deg,#FF8C00,#FFD700)" },
];

// ─── Shapes ───────────────────────────────────────────────────────────────────
const SHAPES: { shape: PopShape; label: string; desc: string; ratio: string }[] = [
  { shape: "square",   label: "正方形",   desc: "SNS・卓上",      ratio: "1/1" },
  { shape: "portrait", label: "縦長",     desc: "店頭・入口",     ratio: "2/3" },
  { shape: "landscape",label: "横長",     desc: "レジ横",         ratio: "4/3" },
  { shape: "a4",       label: "A4縦",     desc: "店頭掲示",       ratio: "210/297" },
  { shape: "a5",       label: "A5縦",     desc: "卓上POP",        ratio: "148/210" },
  { shape: "receipt",  label: "細長",     desc: "注意書き",       ratio: "3/8" },
];

interface PrintConfig { page: string; w: string; h: string | undefined; }
const PRINT_CONFIG: Record<PopShape, PrintConfig> = {
  square:   { page: "@page{size:A4;margin:25mm;}",                 w: "160mm", h: "160mm"  },
  portrait: { page: "@page{size:A4;margin:12mm;}",                 w: "148mm", h: "220mm"  },
  landscape:{ page: "@page{size:A4 landscape;margin:10mm;}",       w: "257mm", h: "168mm"  },
  a4:       { page: "@page{size:A4;margin:10mm;}",                 w: "190mm", h: undefined },
  a5:       { page: "@page{size:A5;margin:8mm;}",                  w: "130mm", h: undefined },
  receipt:  { page: "@page{size:A4;margin:20mm 50mm;}",            w: "110mm", h: undefined },
};

// ─── Default Content ──────────────────────────────────────────────────────────
const DEFAULT_DATA: Record<PopType, Omit<PopData, "storeName" | "theme" | "qrCaption" | "qrUrl">> = {
  today_recommend: {
    title: "本日のおすすめ",
    subtitle: "数量限定・本日のみ",
    body: "旬の食材を使ったシェフ特製の一皿です。毎日内容が変わりますので、ぜひ今日しか食べられない味をお楽しみください。",
    note: "※ 売り切れ次第終了となります",
    price: "¥1,200（税込）",
    period: "",
  },
  new_menu: {
    title: "新メニュー登場",
    subtitle: "NEW ARRIVAL",
    body: "お客様からのご要望にお応えして、待望の新メニューが仲間入りしました。ぜひ一度お試しください。",
    note: "※ レギュラーメニューに追加しました",
    price: "",
    period: "",
  },
  limited: {
    title: "期間限定メニュー",
    subtitle: "この季節だけの特別な一品",
    body: "旬の素材を活かした季節限定のメニューです。期間中のみのご提供ですので、お見逃しなく。",
    note: "※ 数量に限りがございます",
    price: "",
    period: "〜 ○月○日（○）まで",
  },
  takeout: {
    title: "テイクアウト承ります",
    subtitle: "TAKE OUT OK",
    body: "ご注文はカウンターまたはお電話にてどうぞ。専用容器でお渡しいたします。",
    note: "※ メニューによりテイクアウト不可の場合があります",
    price: "",
    period: "",
  },
  hours_change: {
    title: "営業時間変更のお知らせ",
    subtitle: "NOTICE",
    body: "誠に勝手ながら、下記の通り営業時間を変更させていただきます。ご不便をおかけして申し訳ございません。",
    note: "引き続きよろしくお願いいたします",
    price: "",
    period: "新営業時間：○○:○○ ～ ○○:○○",
  },
  temporary_close: {
    title: "臨時休業のお知らせ",
    subtitle: "CLOSED",
    body: "誠に勝手ながら、下記の日程を臨時休業とさせていただきます。ご迷惑をおかけして申し訳ございません。",
    note: "次回の営業は○月○日（○）を予定しております",
    price: "",
    period: "休業日：○月○日（○）",
  },
  reservation: {
    title: "ご予約受付中",
    subtitle: "RESERVATION",
    body: "忘年会・新年会・各種宴会のご予約を承っております。2名様から貸切まで対応可能です。お気軽にご相談ください。",
    note: "カウンターまたはお電話にてお問い合わせください",
    price: "",
    period: "",
  },
  payment: {
    title: "ご利用いただける\nお支払い方法",
    subtitle: "PAYMENT METHOD",
    body: "現金・クレジットカード・交通系IC・各種QRコード決済に対応しております。",
    note: "※ 一部サービスは対象外の場合があります",
    price: "",
    period: "",
  },
  event: {
    title: "イベント開催のお知らせ",
    subtitle: "EVENT",
    body: "特別なイベントを開催します。ご家族・お友達をお誘い合わせの上、ぜひお越しください。",
    note: "※ 詳細はスタッフまでお気軽にお尋ねください",
    price: "",
    period: "開催日：○月○日（○）○○時～",
  },
  sns: {
    title: "SNSで最新情報を配信中",
    subtitle: "FOLLOW US",
    body: "新メニュー・臨時休業・混雑状況など、旬の情報をSNSでお知らせしています。ぜひフォローしてご確認ください。",
    note: "フォローしてくれたお客様に特典あり",
    price: "",
    period: "@アカウント名",
  },
};

const STORAGE_KEY = "restaurant-pop-generator-v2";

// ─── PopCard: shared between preview & print ──────────────────────────────────
function PopCard({
  data,
  storeName,
  popType,
  qrDataUrl,
  shape,
  forPrint = false,
}: {
  data: PopData;
  storeName: string;
  popType: PopType;
  qrDataUrl: string;
  shape: PopShape;
  forPrint?: boolean;
}) {
  const s = THEME_STYLES[data.theme];
  const isSns = popType === "sns";
  const isNarrow = shape === "receipt";
  const isLarge = shape === "a4";

  const titleSize = forPrint
    ? (isNarrow ? 15 : isLarge ? 30 : 24)
    : (isNarrow ? 18 : 28);
  const bodySize = forPrint
    ? (isNarrow ? 8 : isLarge ? 13 : 11)
    : 14;
  const noteSize = forPrint ? (isNarrow ? 6.5 : 9) : 11;
  const subSize  = forPrint ? (isNarrow ? 7.5 : 10) : 12;
  const pad      = forPrint ? (isNarrow ? "14px 12px" : "22px 20px") : (isNarrow ? "20px 16px" : "28px 24px");
  const qrSize   = forPrint ? (isNarrow ? "50mm" : "55mm") : (isNarrow ? "90px" : "110px");

  const style: React.CSSProperties = {
    background: s.bg,
    color: s.text,
    borderRadius: forPrint ? "10px" : "14px",
    padding: pad,
    fontFamily: "'Hiragino Sans','Noto Sans JP',sans-serif",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: forPrint ? "relative" : "absolute",
    inset: forPrint ? undefined : 0,
    width: forPrint ? PRINT_CONFIG[shape].w : undefined,
    height: forPrint ? (PRINT_CONFIG[shape].h ?? undefined) : undefined,
    minHeight: forPrint && !PRINT_CONFIG[shape].h ? "100%" : undefined,
    overflow: "hidden",
    boxSizing: "border-box",
  };

  return (
    <div style={style}>
      {/* Decorative circle */}
      <div style={{
        position: "absolute",
        top: -30, right: -30,
        width: forPrint ? 90 : 130,
        height: forPrint ? 90 : 130,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.07)",
        pointerEvents: "none",
      }} />

      {/* Upper section: title / subtitle / price */}
      <div>
        <h2 style={{
          fontSize: titleSize,
          fontWeight: 900,
          lineHeight: 1.25,
          margin: `0 0 ${forPrint ? 4 : 6}px`,
          whiteSpace: "pre-line",
          color: s.titleColor ?? s.text,
        }}>
          {data.title || "タイトル"}
        </h2>

        {data.subtitle && (
          <p style={{
            fontSize: subSize,
            color: s.sub,
            letterSpacing: "0.08em",
            margin: `0 0 ${forPrint ? 4 : 6}px`,
            textTransform: "uppercase" as const,
          }}>
            {data.subtitle}
          </p>
        )}

        {(data.price || data.period) && (
          <div style={{
            background: "rgba(255,255,255,0.15)",
            borderRadius: 6,
            padding: forPrint ? "2px 9px" : "4px 12px",
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            marginTop: forPrint ? 4 : 6,
            fontSize: forPrint ? (isNarrow ? 10 : 14) : 16,
            fontWeight: 700,
            flexWrap: "wrap" as const,
          }}>
            {data.price && <span>{data.price}</span>}
            {data.price && data.period && <span style={{ opacity: 0.5, fontSize: "0.75em" }}>｜</span>}
            {data.period && <span style={{ fontSize: "0.8em", fontWeight: 500 }}>{data.period}</span>}
          </div>
        )}
      </div>

      {/* Lower section: QR / body / note / footer */}
      <div>
        {/* QR code (SNS type only) */}
        {isSns && qrDataUrl && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: forPrint ? 4 : 6,
            marginBottom: forPrint ? 8 : 12,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt="QRコード"
              style={{
                width: qrSize,
                height: "auto",
                borderRadius: 6,
                background: "#fff",
                padding: forPrint ? "3mm" : 5,
                display: "block",
              }}
            />
            {data.qrCaption && (
              <p style={{
                fontSize: forPrint ? (isNarrow ? 7 : 9) : 10,
                color: s.sub,
                textAlign: "center",
                margin: 0,
              }}>
                {data.qrCaption}
              </p>
            )}
          </div>
        )}

        {data.body && (
          <p style={{
            fontSize: bodySize,
            lineHeight: 1.7,
            margin: `0 0 ${forPrint ? 5 : 8}px`,
            opacity: 0.95,
            whiteSpace: "pre-wrap",
          }}>
            {data.body}
          </p>
        )}

        {data.note && (
          <p style={{
            fontSize: noteSize,
            opacity: 0.7,
            borderTop: `1px solid ${s.border}`,
            paddingTop: forPrint ? 4 : 7,
            marginTop: forPrint ? 4 : 7,
          }}>
            {data.note}
          </p>
        )}

        {/* Store name footer (small, unobtrusive) */}
        {storeName && (
          <p style={{
            fontSize: forPrint ? 7 : 9,
            opacity: 0.45,
            textAlign: "right",
            margin: `${forPrint ? 5 : 8}px 0 0`,
          }}>
            {storeName}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── PrintPortal ──────────────────────────────────────────────────────────────
function PrintPortal({
  data, storeName, popType, qrDataUrl, shape,
}: {
  data: PopData; storeName: string; popType: PopType; qrDataUrl: string; shape: PopShape;
}) {
  const pc = PRINT_CONFIG[shape];
  return (
    <>
      <style>{`
        @media print {
          body > *:not(#pop-print-root) { display: none !important; }
          #pop-print-root { display: flex !important; justify-content: center; align-items: flex-start; padding: 0; }
          ${pc.page}
        }
      `}</style>
      <PopCard data={data} storeName={storeName} popType={popType} qrDataUrl={qrDataUrl} shape={shape} forPrint />
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const buildDefaultAllData = (): AllPopData =>
  Object.fromEntries(
    Object.entries(DEFAULT_DATA).map(([key, val]) => [
      key,
      { ...val, storeName: "", theme: "warm" as PopTheme, qrCaption: "QRコードを読み取ってフォロー", qrUrl: "" },
    ])
  ) as AllPopData;

// ─── Main Component ───────────────────────────────────────────────────────────
export function RestaurantPopGenerator() {
  const [mounted, setMounted]           = useState(false);
  const [storeName, setStoreName]       = useState("");
  const [selectedType, setSelectedType] = useState<PopType>("today_recommend");
  const [selectedShape, setSelectedShape] = useState<PopShape>("square");
  const [allData, setAllData]           = useState<AllPopData>(buildDefaultAllData);
  const [copied, setCopied]             = useState(false);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  // QR state (not persisted: image data is too large)
  const [generatedQr, setGeneratedQr]  = useState("");  // auto-generated from URL
  const [uploadedQr, setUploadedQr]    = useState("");  // user-uploaded image
  const fileInputRef = useRef<HTMLInputElement>(null);

  const effectiveQrDataUrl = uploadedQr || generatedQr;

  // ── Load saved data ──
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.storeName !== undefined) setStoreName(saved.storeName);
      if (saved.allData)    setAllData(saved.allData);
      if (saved.selectedShape) setSelectedShape(saved.selectedShape);
    } catch { /* ignore */ }
  }, []);

  // ── Auto-generate QR from qrUrl ──
  useEffect(() => {
    if (selectedType !== "sns") return;
    const url = allData.sns?.qrUrl ?? "";
    if (!url.trim()) { setGeneratedQr(""); return; }
    let cancelled = false;
    (async () => {
      try {
        const QRCode = (await import("qrcode")).default;
        const canvas = document.createElement("canvas");
        await QRCode.toCanvas(canvas, url, { width: 256, margin: 2, color: { dark: "#000000", light: "#ffffff" } });
        if (!cancelled) setGeneratedQr(canvas.toDataURL("image/png"));
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [selectedType, allData.sns?.qrUrl]);

  // ── Save ──
  const save = useCallback((sn: string, data: AllPopData, shape: PopShape) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ storeName: sn, allData: data, selectedShape: shape }));
    } catch { /* ignore */ }
  }, []);

  const updateField = (field: keyof PopData, value: string) => {
    setAllData((prev) => {
      const next = { ...prev, [selectedType]: { ...prev[selectedType], [field]: value } };
      save(storeName, next, selectedShape);
      return next;
    });
  };

  const updateStoreName = (value: string) => {
    setStoreName(value);
    save(value, allData, selectedShape);
  };

  const updateShape = (shape: PopShape) => {
    setSelectedShape(shape);
    save(storeName, allData, shape);
  };

  // ── QR upload ──
  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      if (url) setUploadedQr(url);
    };
    reader.readAsDataURL(file);
  };

  const clearQr = () => {
    setUploadedQr("");
    setGeneratedQr("");
    updateField("qrUrl", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Print / Copy ──
  const handlePrint = () => window.print();

  const handleCopyText = async () => {
    const d = allData[selectedType];
    const lines = [
      d.title, d.subtitle,
      d.price  && `価格: ${d.price}`,
      d.period && `期間: ${d.period}`,
      "",
      d.body,
      selectedType === "sns" && d.qrUrl ? `URL: ${d.qrUrl}` : "",
      selectedType === "sns" && d.qrCaption ? d.qrCaption : "",
      d.note,
    ].filter(Boolean).join("\n");
    await navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentData  = allData[selectedType];
  const shapeConfig  = SHAPES.find((s) => s.shape === selectedShape)!;

  // Input fields (type-aware)
  const baseFields: { key: keyof PopData; label: string; placeholder: string; multiline?: boolean }[] = [
    { key: "title",    label: "タイトル",           placeholder: "例: 本日のおすすめ",       multiline: true },
    { key: "subtitle", label: "サブタイトル",       placeholder: "例: 数量限定・本日のみ" },
    { key: "price",    label: "価格（任意）",       placeholder: "例: ¥1,200 税込" },
    { key: "period",   label: "期間・時間（任意）", placeholder: "例: 〜6月30日まで" },
    { key: "body",     label: "本文",               placeholder: "POPの説明文を入力", multiline: true },
    { key: "note",     label: "注記（小文字）",     placeholder: "例: ※ 売り切れ次第終了" },
  ];

  return (
    <div className="space-y-6">

      {/* ── Store name ── */}
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

      {/* ── POP type selector ── */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5">
        <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3">POPの種類</p>
        {/* Mobile dropdown */}
        <div className="sm:hidden relative">
          <button
            onClick={() => setTypeMenuOpen((v) => !v)}
            className="w-full flex items-center justify-between rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-4 py-2.5 text-sm text-slate-800 dark:text-zinc-200"
          >
            <span>{POP_TYPES.find((p) => p.type === selectedType)?.emoji} {POP_TYPES.find((p) => p.type === selectedType)?.label}</span>
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
                  <span>{p.emoji}</span><span>{p.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Desktop grid */}
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
              <span className="text-base">{p.emoji}</span>
              <span className="leading-tight text-center">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Shape selector ── */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5">
        <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3">サイズ・形</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {SHAPES.map((sh) => (
            <button
              key={sh.shape}
              onClick={() => updateShape(sh.shape)}
              className={`rounded-xl border px-2 py-2 text-xs font-medium transition-all flex flex-col items-center gap-0.5 ${
                selectedShape === sh.shape
                  ? "border-orange-400 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400"
                  : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-orange-950/20"
              }`}
            >
              <span className="font-semibold">{sh.label}</span>
              <span className="text-[10px] opacity-70">{sh.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main editor area ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input side */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 space-y-4">
            <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">内容を入力</p>

            {baseFields.map(({ key, label, placeholder, multiline }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">{label}</label>
                {multiline ? (
                  <textarea
                    value={currentData[key] as string}
                    onChange={(e) => updateField(key, e.target.value)}
                    placeholder={placeholder}
                    rows={key === "body" ? 3 : 2}
                    className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3 py-2 text-sm text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={currentData[key] as string}
                    onChange={(e) => updateField(key, e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 px-3 py-2 text-sm text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                )}
              </div>
            ))}

            {/* SNS: QR code section */}
            {selectedType === "sns" && (
              <div className="rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 p-4 space-y-3">
                <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">QRコード</p>

                {/* URL auto-generate */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
                    URLを入力してQRを自動生成
                  </label>
                  <input
                    type="url"
                    value={currentData.qrUrl}
                    onChange={(e) => updateField("qrUrl", e.target.value)}
                    placeholder="https://instagram.com/your_account"
                    className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                {/* Image upload */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
                    または画像をアップロード
                    <span className="ml-1 text-slate-400 dark:text-zinc-500">（PNG / JPG / WebP / SVG）</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Upload size={13} />
                      ファイルを選択
                    </button>
                    {(uploadedQr || generatedQr) && (
                      <button
                        onClick={clearQr}
                        className="flex items-center gap-1 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-2.5 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
                      >
                        <X size={12} />削除
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleQrUpload}
                    className="hidden"
                  />
                  {uploadedQr && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
                      ※ アップロード画像はページ再読み込み後に再選択が必要です
                    </p>
                  )}
                </div>

                {/* QR caption */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">QRコード補足テキスト</label>
                  <input
                    type="text"
                    value={currentData.qrCaption}
                    onChange={(e) => updateField("qrCaption", e.target.value)}
                    placeholder="例: QRコードを読み取ってフォロー"
                    className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                {/* QR preview thumbnail */}
                {effectiveQrDataUrl && (
                  <div className="flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={effectiveQrDataUrl} alt="QRプレビュー" className="w-24 h-24 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white p-1" />
                  </div>
                )}
              </div>
            )}

            {/* Theme selector */}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-2">テーマカラー</label>
              <div className="grid grid-cols-2 gap-1.5">
                {THEMES.map(({ theme, label, desc, swatch }) => (
                  <button
                    key={theme}
                    onClick={() => updateField("theme", theme)}
                    className={`rounded-lg border px-2.5 py-2 text-left transition-all flex items-center gap-2 ${
                      currentData.theme === theme
                        ? "border-orange-400 bg-orange-50 dark:bg-orange-950/40"
                        : "border-slate-200 dark:border-zinc-700 hover:border-orange-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full"
                      style={{ background: swatch }}
                    />
                    <span className="min-w-0">
                      <span className={`block text-xs font-semibold leading-tight ${currentData.theme === theme ? "text-orange-700 dark:text-orange-400" : "text-slate-700 dark:text-zinc-300"}`}>{label}</span>
                      <span className="block text-[10px] text-slate-400 dark:text-zinc-500 truncate">{desc}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCopyText}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
              {copied ? "コピーしました" : "テキストをコピー"}
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition-colors"
            >
              <Printer size={15} />
              印刷・PDF保存
            </button>
          </div>
        </div>

        {/* Preview side */}
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3">
            プレビュー
            <span className="ml-2 text-xs font-normal text-slate-400 dark:text-zinc-500">
              {shapeConfig.label}（{shapeConfig.desc}）
            </span>
          </p>

          {/* Aspect-ratio container */}
          <div
            className="overflow-x-auto"
            style={{ maxWidth: selectedShape === "receipt" ? "220px" : "100%", margin: "0 auto" }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: shapeConfig.ratio,
                position: "relative",
                borderRadius: "14px",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              }}
            >
              <PopCard
                data={currentData}
                storeName={storeName}
                popType={selectedType}
                qrDataUrl={effectiveQrDataUrl}
                shape={selectedShape}
              />
            </div>
          </div>

          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2 text-center">
            印刷設定で「背景のグラフィック」をオンにすると色が正しく出力されます
          </p>
        </div>
      </div>

      {/* Print portal */}
      {mounted &&
        createPortal(
          <div id="pop-print-root" style={{ display: "none" }}>
            <PrintPortal
              data={currentData}
              storeName={storeName}
              popType={selectedType}
              qrDataUrl={effectiveQrDataUrl}
              shape={selectedShape}
            />
          </div>,
          document.body
        )}
    </div>
  );
}
