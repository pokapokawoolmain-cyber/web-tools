import { Fragment } from "react";

// ============================================================
// 日本語見出しの改行制御。
//   "\n" = 必ず改行 / "|" = 文節の区切り（文節の途中では改行しない）
// Safari は word-break: auto-phrase に未対応のため、文節を inline-block で包んで
// 「コミ / ュニティ」のような語の途中の改行を防ぐ。
// ============================================================

export function Phrase({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line.split("|").map((chunk, ci) => (
            <span key={ci} style={{ display: "inline-block" }}>
              {chunk}
            </span>
          ))}
        </Fragment>
      ))}
    </>
  );
}

/** "|" を取り除いた平文（aria-label や metadata 用）。 */
export function plain(text: string): string {
  return text.replace(/\|/g, "").replace(/\n/g, "");
}
