// ========================================
// スピードテスト: レイテンシ（RTT）測定用エンドポイント
// 最小レスポンスを即返す。クライアントは往復時間を計測する。
// ========================================

export const runtime = "edge";

export async function GET() {
  return new Response(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
}
