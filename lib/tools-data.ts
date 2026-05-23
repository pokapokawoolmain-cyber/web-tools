// Backward-compatibility shim — use @/data/tools for new code
import { TOOLS as _TOOLS, getToolsByCategory as _getByCategory } from "@/data/tools";

export type Tool = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  category: string;
  isNew?: boolean;
  isPopular?: boolean;
  keywords?: string[];
};

export const tools: Tool[] = _TOOLS.map(t => ({
  id: t.id,
  title: t.title,
  description: t.description,
  href: t.href,
  icon: t.emoji,
  category: t.category,
  isNew: t.isNew,
  isPopular: t.isPopular,
  keywords: [],
}));

export function getToolById(id: string): Tool | undefined {
  return tools.find(t => t.id === id);
}

export function getToolsByCategory() {
  return _getByCategory();
}

export const categoryLabels: Record<string, string> = {
  "お金・投資": "お金・投資",
  "計算ツール": "計算ツール",
  "画像・PDF": "画像・PDF",
  "生活・副業": "生活・副業",
  "テキスト・Web": "テキスト・Web",
  "学生向け": "学生向け",
  "仕事・副業": "仕事・副業",
  "AI文章ツール": "AI文章ツール",
  finance: "お金・投資",
  image: "画像・PDF",
  pdf: "PDF",
  calc: "計算ツール",
  text: "テキスト・Web",
  lifestyle: "生活・副業",
  ai: "AI文章ツール",
  "冠婚葬祭・文書": "冠婚葬祭・文書",
  ceremony: "冠婚葬祭・文書",
};
