"use client";
// ============================================================
// モーダル（<dialog>）表示中に、背景のページが指で動かないようにする
//   * CSS（goods.css: html:has(dialog[open]) { overflow: hidden }）だけでは、
//     スマホで暗い背景をなぞるとページがスクロールしてしまう
//   * 開いているモーダルがある間だけ、モーダルの中身（スクロールできる部分）以外から始まる
//     タッチ・ホイールのスクロールを止める。中身のスクロールは overscroll-behavior: contain で背景へ伝わらない
//   * body を position: fixed にする方式は使わない（固定ヘッダーが動いたり、スクロール位置がずれたりするため）
// ============================================================
import { useEffect } from "react";

function insideOpenDialogContent(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  const dialog = target.closest("dialog[open]");
  // dialog 要素そのもの（= 背景の暗い部分）をなぞった場合は中身ではない
  return !!dialog && target !== dialog;
}

export function ModalScrollLock() {
  useEffect(() => {
    // タッチ（スマホ）とホイール・トラックパッド（PC）の両方
    const block = (e: TouchEvent | WheelEvent) => {
      if (!insideOpenDialogContent(e.target) && e.cancelable) e.preventDefault();
    };
    // 止めるためのリスナー（passive: false）はスクロールの反応を遅らせるので、モーダルが開いている間だけ登録する
    let attached = false;
    const sync = () => {
      const open = !!document.querySelector("dialog[open]");
      if (open && !attached) {
        document.addEventListener("touchmove", block, { passive: false });
        document.addEventListener("wheel", block, { passive: false });
        attached = true;
      } else if (!open && attached) {
        document.removeEventListener("touchmove", block);
        document.removeEventListener("wheel", block);
        attached = false;
      }
    };
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["open"] });
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("touchmove", block);
      document.removeEventListener("wheel", block);
    };
  }, []);
  return null;
}
