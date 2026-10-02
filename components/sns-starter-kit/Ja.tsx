// ============================================================
// 日本語本文の改行制御（サーバーコンポーネント専用）
//
// iPhone Safari は word-break: auto-phrase に未対応のため、本文が「開発ルー / ル」のように
// 語の途中で折れる。Intl.Segmenter（Node の ICU 辞書）で語に分け、
// 「内容語 + 後ろに続くひらがな・句読点」をひとまとまりにして、その途中では改行しない。
//
// ・サーバーで描画するだけなので、クライアントとの差異（ハイドレーションのずれ）は起きない。
// ・Segmenter が無い環境では元の文字列をそのまま返す（表示は壊れない）。
// ============================================================
import { Fragment } from "react";

const segmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter("ja", { granularity: "word" })
    : null;

// 新しいまとまりを始めてよい語（漢字・カタカナ・英数字・開き括弧、接頭の「ご」「お」）
const CONTENT_START = /^(?:[\p{Script=Han}\p{Script=Katakana}A-Za-z0-9「（(『【]|[ごお]$)/u;
// まとまりの「終わり」になり得る語（ひらがな・句読点・閉じ括弧で終わる）
const TAIL_END = /[\p{Script=Hiragana}、。，．・！？!?）」』】]$/u;

export function toPhrases(text: string): string[] {
  if (!segmenter) return [text];
  const out: string[] = [];
  let cur = "";
  let closable = false;
  for (const { segment } of segmenter.segment(text)) {
    if (cur && closable && CONTENT_START.test(segment)) {
      out.push(cur);
      cur = "";
      closable = false;
    }
    cur += segment;
    // 空白（"Starter Kit" の間など）では区切らない
    if (!/^\s+$/.test(segment) && TAIL_END.test(segment)) closable = true;
  }
  if (cur) out.push(cur);
  return out;
}

/** 文節のまとまりごとに改行位置を制御した日本語テキスト。"\n" は改行。 */
export function Ja({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {toPhrases(line).map((p, i) => (
            <span key={i} style={{ display: "inline-block", maxWidth: "100%", overflowWrap: "anywhere" }}>
              {p}
            </span>
          ))}
        </Fragment>
      ))}
    </>
  );
}
