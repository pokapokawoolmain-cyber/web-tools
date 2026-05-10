"use client";
// ========================================
// Markdownエディタ
// npm install react-markdown remark-gfm が必要
// ========================================
import { useState, Suspense, lazy } from "react";
import { Copy, Check, Download, Eye, Edit3, Columns } from "lucide-react";

const ReactMarkdown = lazy(() => import("react-markdown"));

const INITIAL_MD = `# Markdownエディタへようこそ 👋

## 特徴

- **リアルタイムプレビュー**
- GitHub Flavored Markdown対応
- ブラウザ完結（保存不要）

## コード例

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

## テーブル

| 項目 | 内容 |
|------|------|
| 文字数 | リアルタイム計測 |
| 対応形式 | GFM |

> 💡 左のエリアを編集すると右側にプレビューが表示されます。
`;

type ViewMode = "split" | "edit" | "preview";

export function MarkdownEditor() {
  const [md, setMd]         = useState(INITIAL_MD);
  const [mode, setMode]     = useState<ViewMode>("split");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([md], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "document.md";
    a.click();
  };

  const toolbarButtons: { fmt: string; label: string; wrap?: [string, string] }[] = [
    { fmt: "**",    label: "B",   wrap: ["**", "**"] },
    { fmt: "_",     label: "I",   wrap: ["_", "_"] },
    { fmt: "`",     label: "code", wrap: ["`", "`"] },
    { fmt: "# ",    label: "H1" },
    { fmt: "## ",   label: "H2" },
    { fmt: "- ",    label: "List" },
    { fmt: "> ",    label: "Quote" },
    { fmt: "---\n", label: "HR" },
  ];

  const insertFormat = (fmt: string, wrap?: [string, string]) => {
    const ta = document.getElementById("md-editor") as HTMLTextAreaElement;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const selected = md.slice(s, e);
    let newText: string;
    let cursor: number;
    if (wrap) {
      newText = md.slice(0, s) + wrap[0] + (selected || "テキスト") + wrap[1] + md.slice(e);
      cursor = s + wrap[0].length + (selected || "テキスト").length + wrap[1].length;
    } else {
      newText = md.slice(0, s) + fmt + md.slice(e);
      cursor = s + fmt.length;
    }
    setMd(newText);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(cursor, cursor); }, 0);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* ツールバー */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-zinc-800 flex-wrap gap-2">
          {/* 書式ボタン */}
          <div className="flex gap-1 flex-wrap">
            {toolbarButtons.map((btn) => (
              <button
                key={btn.label}
                onClick={() => insertFormat(btn.fmt, btn.wrap)}
                className="px-2.5 py-1 text-xs font-mono bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* アクション */}
          <div className="flex gap-1">
            <button onClick={copy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-blue-500" /> : <Copy className="w-3.5 h-3.5" />}
              コピー
            </button>
            <button onClick={download}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              <Download className="w-3.5 h-3.5" />保存
            </button>
          </div>
        </div>

        {/* 表示モード切替 */}
        <div className="flex bg-slate-50 dark:bg-zinc-800/50 px-3 py-2 gap-1 border-b border-slate-100 dark:border-zinc-800">
          {([
            { m: "split",   icon: Columns, label: "分割" },
            { m: "edit",    icon: Edit3,   label: "編集" },
            { m: "preview", icon: Eye,     label: "プレビュー" },
          ] as const).map(({ m, icon: Icon, label }) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all ${
                mode === m
                  ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm font-medium"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />{label}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400 self-center">
            {md.length.toLocaleString()} 文字
          </span>
        </div>

        {/* エディタ + プレビュー */}
        <div className={`flex ${mode === "split" ? "flex-col sm:flex-row" : ""}`}>
          {/* エディタ */}
          {(mode === "edit" || mode === "split") && (
            <textarea
              id="md-editor"
              value={md}
              onChange={(e) => setMd(e.target.value)}
              className={`p-4 text-sm font-mono text-slate-900 dark:text-slate-100 bg-white dark:bg-zinc-900 resize-none focus:outline-none leading-relaxed ${
                mode === "split" ? "w-full sm:w-1/2 h-96 sm:border-r border-b sm:border-b-0 border-slate-100 dark:border-zinc-800" : "w-full h-[520px]"
              }`}
              spellCheck={false}
            />
          )}

          {/* プレビュー */}
          {(mode === "preview" || mode === "split") && (
            <div className={`p-5 overflow-auto bg-white dark:bg-zinc-900 ${
              mode === "split" ? "w-full sm:w-1/2 h-96" : "w-full h-[520px]"
            }`}>
              <Suspense fallback={<div className="text-slate-400 text-sm">読み込み中...</div>}>
                <div className="prose prose-sm prose-slate dark:prose-invert max-w-none
                  prose-headings:font-bold
                  prose-code:text-blue-600 dark:prose-code:text-blue-400
                  prose-code:bg-blue-50 dark:prose-code:bg-blue-950/30
                  prose-code:px-1 prose-code:rounded
                  prose-pre:bg-slate-900 dark:prose-pre:bg-zinc-800
                  prose-blockquote:border-blue-400
                  prose-a:text-blue-600">
                  <ReactMarkdown>{md}</ReactMarkdown>
                </div>
              </Suspense>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
        ✅ すべてブラウザ内で動作します。テキストはサーバーに送信されません。
      </p>
    </div>
  );
}
