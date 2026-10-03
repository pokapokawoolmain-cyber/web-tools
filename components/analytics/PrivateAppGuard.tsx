// ============================================================
// Mochico アプリ内部では GA4 と AdSense を動かさない（共通レイアウトの <head> 先頭で1回だけ）
//
// - 個人のグッズ・コレクション情報、イベントID等の識別子を計測・広告へ渡さない
// - GA4: 公式のオプトアウトフラグ window['ga-disable-<測定ID>'] を計測タグより前に立てる
// - AdSense: 自動広告のリクエストを pauseAdRequests で止める（ローダーより前に実行）
// - 公開LP（/mochico）・ToolBox の他ページには影響しない
// 静的なインラインスクリプトなので、各ページの静的生成を妨げない。
// ============================================================
import { GA_MEASUREMENT_ID } from "@/lib/analytics/config";
import { MOCHICO_PRIVATE_PATH_RE } from "@/lib/mochico/private-paths";

export function PrivateAppGuard() {
  const code = `(function(){try{if(${MOCHICO_PRIVATE_PATH_RE.toString()}.test(location.pathname)){window[${JSON.stringify(`ga-disable-${GA_MEASUREMENT_ID}`)}]=true;(window.adsbygoogle=window.adsbygoogle||[]).pauseAdRequests=1;}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
