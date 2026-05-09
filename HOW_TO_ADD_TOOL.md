# 新しいツールを追加する手順

## 3ステップで追加できます

### Step 1: ツールデータを登録
`lib/tools-data.ts` の `tools` 配列に追加：

```ts
{
  id: "your-tool-id",
  title: "ツール名",
  description: "説明文",
  href: "/your-tool-id",
  icon: "🔧",
  category: "calc",
  keywords: ["キーワード1", "キーワード2"],
},
```

### Step 2: ディレクトリ作成
```
app/(tools)/your-tool-id/
  ├── page.tsx        ← SEOメタデータ + レイアウト
  └── YourTool.tsx    ← 計算ロジック + UI（"use client"）
```

### Step 3: ファイルを記述

**page.tsx（コピペしてtitleとdescriptionを変えるだけ）:**
```tsx
import { generateToolMeta } from "@/lib/seo";
import { YourTool } from "./YourTool";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata = generateToolMeta(
  "ツール名",
  "説明文",
  "your-tool-id",
  ["キーワード1"]
);

export default function Page() {
  return (
    <ToolLayout title="ツール名" description="説明文" icon="🔧">
      <YourTool />
    </ToolLayout>
  );
}
```

**YourTool.tsx（計算ロジック）:**
```tsx
"use client";
import { useState, useMemo } from "react";
import { NumberInput } from "@/components/ui/NumberInput";
import { ResultCard } from "@/components/ui/ResultCard";

export function YourTool() {
  const [value, setValue] = useState(0);
  const result = useMemo(() => value * 2, [value]);

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-6">
        <NumberInput id="value" label="入力値" value={value} onChange={setValue} />
      </div>
      <ResultCard label="結果" value={String(result)} highlight />
    </div>
  );
}
```

## カテゴリ一覧
- `finance`   → お金・投資
- `image`     → 画像変換
- `pdf`       → PDF系
- `calc`      → 計算ツール
- `text`      → テキスト系
- `lifestyle` → 生活・副業
