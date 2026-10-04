"use client";
// /goods の全ページで1回だけ: インストール確認イベントの捕捉と、オフライン案内用 Service Worker の登録
import { useEffect } from "react";
import { registerGoodsServiceWorker, startInstallPromptCapture } from "@/lib/goods/pwa";

export function PwaBootstrap() {
  useEffect(() => {
    startInstallPromptCapture();
    registerGoodsServiceWorker();
  }, []);
  return null;
}
