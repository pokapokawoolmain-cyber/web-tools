// ========================================
// ツールアイコン（デザインシステム）
// ガラス風タイル + 輪郭のみのネオンカラー lucide アイコン
// マッピングが無い toolId は絵文字フォールバック
// ========================================
import { TOOL_ICONS } from "@/data/tool-icons";
import { getToolById } from "@/data/tools";

type ToolIconSize = "sm" | "md" | "lg";

type ToolIconProps = {
  toolId: string;
  size?: ToolIconSize;
  className?: string;
  /** マッピングが無い場合に表示する絵文字（省略時は data/tools.ts の emoji） */
  fallbackEmoji?: string;
  /** アクセシビリティ用ラベル（省略時は装飾扱い） */
  label?: string;
};

// タイルサイズ: sm=32px / md=44px / lg=64px
const TILE_CLASS: Record<ToolIconSize, string> = {
  sm: "w-8 h-8 rounded-[10px]",
  md: "w-11 h-11 rounded-xl",
  lg: "w-16 h-16 rounded-2xl",
};

// アイコンサイズ: sm=16px / md=22px / lg=32px
const ICON_SIZE: Record<ToolIconSize, number> = {
  sm: 16,
  md: 22,
  lg: 32,
};

// 絵文字フォールバック時の文字サイズ
const EMOJI_CLASS: Record<ToolIconSize, string> = {
  sm: "text-base",
  md: "text-2xl",
  lg: "text-4xl",
};

export function ToolIcon({
  toolId,
  size = "md",
  className,
  fallbackEmoji,
  label,
}: ToolIconProps) {
  const def = TOOL_ICONS[toolId];

  // マッピングが無い場合: 従来の絵文字表示を維持
  if (!def) {
    const emoji = fallbackEmoji ?? getToolById(toolId)?.emoji ?? "🔧";
    return (
      <span
        role="img"
        aria-label={label}
        aria-hidden={label ? undefined : true}
        className={`inline-flex items-center justify-center ${EMOJI_CLASS[size]}${className ? ` ${className}` : ""}`}
      >
        {emoji}
      </span>
    );
  }

  const { icon: Icon, color } = def;
  const iconSize = ICON_SIZE[size];

  return (
    <span
      role="img"
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`inline-flex items-center justify-center flex-shrink-0 ${TILE_CLASS[size]} bg-white/60 dark:bg-white/5 backdrop-blur border border-slate-200/60 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]${className ? ` ${className}` : ""}`}
    >
      {/* ライトモード: 弱い発光 */}
      <Icon
        aria-hidden="true"
        size={iconSize}
        strokeWidth={1.75}
        fill="none"
        className="dark:hidden"
        style={{
          color,
          filter: `drop-shadow(0 0 2px ${color}33)`,
        }}
      />
      {/* ダークモード: ネオン発光 */}
      <Icon
        aria-hidden="true"
        size={iconSize}
        strokeWidth={1.5}
        fill="none"
        className="hidden dark:block"
        style={{
          color,
          filter: `drop-shadow(0 0 6px ${color}66)`,
        }}
      />
    </span>
  );
}
