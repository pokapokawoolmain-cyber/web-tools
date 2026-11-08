// ============================================================
// CSV の文字コード判定（UTF-8 / Shift_JIS）
//
// xlsx に CSV をバイト列のまま渡すと日本語が文字化けするため、
// 先に文字列へ直してから渡す。Excel で保存した日本語 CSV は Shift_JIS のことが多い。
// ============================================================

export function decodeCsvBytes(bytes: Uint8Array): string {
  try {
    // fatal: UTF-8 として正しくない並びがあれば例外にして Shift_JIS を試す
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes).replace(/^﻿/, "");
  } catch {
    return new TextDecoder("shift_jis").decode(bytes);
  }
}
