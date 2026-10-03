#!/usr/bin/env bash
# ============================================================
# Phase 1 User Acceptance Preview（ローカル専用・本番インフラには接続しない）
#
#   npm run goods:acceptance          PCで確認   → http://localhost:3300/mochico/app
#   npm run goods:acceptance -- --lan 同じWi-Fiのスマホでも確認 → http://<このMacのIP>:3300/mochico/app
#
# * 本番ビルド（next build → next start）で動かす。開発モードより実際の体感に近い
# * 接続先 Supabase はローカル（supabase-goods）のみ。127.0.0.1 / LAN IP 以外は拒否
# * --lan は信頼できる自宅・社内 Wi-Fi でのみ使うこと（同じネットワークの端末から見える）
# ============================================================
set -euo pipefail
cd "$(dirname "$0")/.."
PORT=3300
HOST_BIND=127.0.0.1
SUPA_HOST=127.0.0.1

if [[ "${1:-}" == "--lan" ]]; then
  LAN_IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true)"
  if [[ -z "$LAN_IP" ]]; then
    echo "Wi-Fi の IP アドレスを取得できませんでした。PCモードで起動してください。" >&2
    exit 1
  fi
  case "$LAN_IP" in
    10.*|192.168.*|172.1[6-9].*|172.2[0-9].*|172.3[0-1].*) ;;
    *) echo "プライベートIPではありません（$LAN_IP）。公開ネットワークでは起動しません。" >&2; exit 1 ;;
  esac
  HOST_BIND=0.0.0.0
  SUPA_HOST="$LAN_IP"
fi

# ローカル Supabase が動いているか
if ! curl -s -o /dev/null "http://127.0.0.1:55321/rest/v1/"; then
  echo "ローカル Supabase が起動していません。先に次を実行してください:" >&2
  echo '  PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH" supabase start --workdir supabase-goods' >&2
  exit 1
fi

export NEXT_PUBLIC_GOODS_SUPABASE_URL="http://${SUPA_HOST}:55321"
echo "▶ ビルド中（接続先 Supabase: ${NEXT_PUBLIC_GOODS_SUPABASE_URL}）..."
npx next build > /tmp/mochico-acceptance-build.log 2>&1 || { echo "ビルド失敗: /tmp/mochico-acceptance-build.log" >&2; exit 1; }

echo ""
echo "========================================================"
echo " Acceptance Preview 起動"
echo "   PC     : http://localhost:${PORT}/mochico/app"
[[ "$HOST_BIND" == "0.0.0.0" ]] && echo "   スマホ : http://${SUPA_HOST}:${PORT}/mochico/app （同じWi-Fiで）"
echo "   ログインコード確認（Mailpit）: http://127.0.0.1:55324"
echo "   テストアカウント: ceo-acceptance@example.test"
echo "   終了: Ctrl+C"
echo "========================================================"
exec npx next start -H "$HOST_BIND" -p "$PORT"
