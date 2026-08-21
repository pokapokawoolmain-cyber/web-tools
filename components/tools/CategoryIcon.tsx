// ========================================
// カテゴリアイコン（デザインシステム）
// ToolIcon と同じガラス風タイル＋ネオンカラーで
// カテゴリの絵文字タイルを置き換える。
// ========================================
import type { LucideIcon } from "lucide-react";
import {
  FileText,
  Image as ImageIcon,
  Wallet,
  Briefcase,
  Bot,
  Ribbon,
  Palette,
  Code2,
  HardHat,
  UtensilsCrossed,
  LayoutGrid,
  Calculator,
  MonitorSmartphone,
} from "lucide-react";

type CategoryIconDef = { icon: LucideIcon; color: string };

// slug は categories.ts の CategoryConfig.slug に対応
const CATEGORY_ICONS: Record<string, CategoryIconDef> = {
  pdf: { icon: FileText, color: "#38bdf8" },
  image: { icon: ImageIcon, color: "#a78bfa" },
  money: { icon: Wallet, color: "#34d399" },
  business: { icon: Briefcase, color: "#818cf8" },
  ai: { icon: Bot, color: "#22d3ee" },
  ceremony: { icon: Ribbon, color: "#e2c08d" },
  color: { icon: Palette, color: "#c084fc" },
  dev: { icon: Code2, color: "#38bdf8" },
  "industry/construction": { icon: HardHat, color: "#fb923c" },
  "industry/restaurant": { icon: UtensilsCrossed, color: "#f87171" },
  calc: { icon: Calculator, color: "#fbbf24" },
  life: { icon: MonitorSmartphone, color: "#2dd4bf" },
};

type Size = "xs" | "sm" | "md" | "lg";

const TILE: Record<Size, string> = {
  xs: "w-5 h-5 rounded-[6px]",
  sm: "w-8 h-8 rounded-lg",
  md: "w-11 h-11 rounded-xl",
  lg: "w-12 h-12 rounded-xl",
};
const ICON: Record<Size, number> = { xs: 12, sm: 16, md: 22, lg: 24 };

export function CategoryIcon({
  slug,
  size = "sm",
  className,
  fallbackEmoji,
}: {
  slug: string;
  size?: Size;
  className?: string;
  /** マッピングが無い場合の絵文字フォールバック */
  fallbackEmoji?: string;
}) {
  const def = CATEGORY_ICONS[slug] ?? (slug === "tools" ? { icon: LayoutGrid, color: "#94a3b8" } : null);

  if (!def) {
    return (
      <span aria-hidden="true" className={`inline-flex items-center justify-center ${className ?? ""}`}>
        {fallbackEmoji ?? "🔧"}
      </span>
    );
  }

  const { icon: Icon, color } = def;
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center flex-shrink-0 ${TILE[size]} bg-white/60 dark:bg-white/5 backdrop-blur border border-slate-200/60 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]${className ? ` ${className}` : ""}`}
    >
      <Icon
        size={ICON[size]}
        strokeWidth={1.6}
        fill="none"
        style={{ color, filter: `drop-shadow(0 0 5px ${color}55)` }}
      />
    </span>
  );
}
