// カテゴリ別ツール画面モックアップ（実際のUIに忠実なSVG/JSX）
// 架空イラストではなく、実際のツールの操作イメージを再現

export function PdfPreview() {
  return (
    <div className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm select-none" aria-hidden="true">
      {/* ウィンドウバー */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 text-[11px] text-slate-400">PDF結合ツール — ToolBox</span>
      </div>
      {/* ファイルドロップゾーン */}
      <div className="p-4 space-y-3">
        <div className="border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-lg p-3 text-center bg-blue-50/50 dark:bg-blue-950/20">
          <div className="text-blue-400 text-2xl mb-1">📎</div>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">PDFをドロップ、またはクリック</p>
        </div>
        {/* ファイルリスト */}
        <div className="space-y-1.5">
          {[
            { name: "契約書_2026.pdf", size: "1.2 MB" },
            { name: "見積書.pdf", size: "840 KB" },
            { name: "請求書_6月.pdf", size: "560 KB" },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-zinc-800 rounded-lg border border-slate-100 dark:border-zinc-700">
              <span className="text-rose-500 text-sm">📄</span>
              <span className="flex-1 text-[12px] text-slate-700 dark:text-zinc-300 truncate">{f.name}</span>
              <span className="text-[10px] text-slate-400">{f.size}</span>
            </div>
          ))}
        </div>
        {/* 結合ボタン */}
        <button className="w-full py-2 rounded-lg bg-blue-500 text-white text-[13px] font-semibold" tabIndex={-1}>
          3ファイルを結合する
        </button>
      </div>
    </div>
  );
}

export function ImagePreview() {
  return (
    <div className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm select-none" aria-hidden="true">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 text-[11px] text-slate-400">画像圧縮ツール — ToolBox</span>
      </div>
      <div className="p-4 space-y-3">
        {/* ビフォーアフター */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-slate-100 dark:bg-zinc-800 p-2">
            <div className="aspect-video bg-gradient-to-br from-sky-200 to-blue-300 dark:from-sky-800 dark:to-blue-900 rounded mb-1.5 flex items-center justify-center">
              <span className="text-2xl">🖼️</span>
            </div>
            <p className="text-[10px] text-slate-500 text-center">元ファイル</p>
            <p className="text-[12px] font-bold text-slate-700 dark:text-zinc-300 text-center">4.2 MB</p>
          </div>
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-2">
            <div className="aspect-video bg-gradient-to-br from-sky-200 to-blue-300 dark:from-sky-800 dark:to-blue-900 rounded mb-1.5 flex items-center justify-center">
              <span className="text-2xl">🖼️</span>
            </div>
            <p className="text-[10px] text-emerald-600 text-center">圧縮後</p>
            <p className="text-[12px] font-bold text-emerald-600 text-center">612 KB</p>
          </div>
        </div>
        {/* 圧縮率 */}
        <div className="rounded-lg bg-emerald-500 px-3 py-2 text-center">
          <p className="text-white text-[13px] font-bold">85.4% 削減</p>
          <p className="text-emerald-100 text-[10px]">画質を保ちながら軽量化</p>
        </div>
        {/* スライダー模擬 */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
            <span>品質</span><span>85%</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-zinc-700 rounded-full">
            <div className="h-2 bg-blue-500 rounded-full w-[85%]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MoneyPreview() {
  return (
    <div className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm select-none" aria-hidden="true">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 text-[11px] text-slate-400">FIREシミュレーター — ToolBox</span>
      </div>
      <div className="p-4 space-y-3">
        {/* 入力エリア */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "現在の資産", value: "500万円" },
            { label: "毎月積立", value: "5万円" },
            { label: "年利", value: "5%" },
            { label: "生活費/月", value: "20万円" },
          ].map((item) => (
            <div key={item.label} className="bg-slate-50 dark:bg-zinc-800 rounded-lg px-2.5 py-2">
              <p className="text-[9px] text-slate-400 mb-0.5">{item.label}</p>
              <p className="text-[13px] font-bold text-slate-800 dark:text-zinc-200">{item.value}</p>
            </div>
          ))}
        </div>
        {/* 結果 */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg px-4 py-3">
          <p className="text-blue-100 text-[10px] mb-1">FIRE達成まで</p>
          <p className="text-white text-2xl font-bold">約18年</p>
          <p className="text-blue-200 text-[10px] mt-0.5">必要資産額：6,000万円</p>
        </div>
        {/* チャート模擬 */}
        <div className="flex items-end gap-1 h-10">
          {[20, 35, 50, 62, 72, 80, 88, 93, 97, 100].map((h, i) => (
            <div key={i} className="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded-t" style={{ height: `${h}%` }}>
              <div className="w-full bg-blue-400 dark:bg-blue-500 rounded-t" style={{ height: `${Math.min(h, 60)}%` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BusinessPreview() {
  return (
    <div className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm select-none" aria-hidden="true">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 text-[11px] text-slate-400">請求書作成ツール — ToolBox</span>
      </div>
      <div className="p-4 space-y-2">
        {/* 請求書プレビュー模擬 */}
        <div className="border border-slate-200 dark:border-zinc-700 rounded-lg p-3 bg-white dark:bg-zinc-800 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[14px] font-bold text-slate-800 dark:text-zinc-200">請求書</p>
              <p className="text-[9px] text-slate-400">No. 2026-0031</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-slate-400">発行日：2026/06/30</p>
              <p className="text-[9px] text-slate-400">支払期限：2026/07/31</p>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-zinc-700 pt-2">
            <div className="flex justify-between text-[9px] text-slate-400 mb-1">
              <span>品目</span><span>金額</span>
            </div>
            {[
              { item: "Webデザイン（LP）", price: "¥150,000" },
              { item: "コーディング", price: "¥80,000" },
            ].map((r) => (
              <div key={r.item} className="flex justify-between text-[11px] py-0.5">
                <span className="text-slate-700 dark:text-zinc-300">{r.item}</span>
                <span className="text-slate-700 dark:text-zinc-300">{r.price}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 dark:border-zinc-700 pt-1.5 flex justify-between">
            <span className="text-[11px] font-bold text-slate-800 dark:text-zinc-200">合計（税込）</span>
            <span className="text-[13px] font-bold text-blue-600">¥253,000</span>
          </div>
        </div>
        <button className="w-full py-1.5 rounded-lg bg-blue-500 text-white text-[12px] font-semibold" tabIndex={-1}>
          PDFで保存する
        </button>
      </div>
    </div>
  );
}

export function LifePreview() {
  return (
    <div className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm select-none" aria-hidden="true">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 text-[11px] text-slate-400">Wi-Fi QRコード生成 — ToolBox</span>
      </div>
      <div className="p-4 space-y-3">
        {/* 入力 */}
        <div className="space-y-2">
          <div className="bg-slate-50 dark:bg-zinc-800 rounded-lg px-3 py-2">
            <p className="text-[9px] text-slate-400 mb-0.5">ネットワーク名（SSID）</p>
            <p className="text-[13px] text-slate-700 dark:text-zinc-300">MyHomeWifi_5G</p>
          </div>
          <div className="bg-slate-50 dark:bg-zinc-800 rounded-lg px-3 py-2">
            <p className="text-[9px] text-slate-400 mb-0.5">パスワード</p>
            <p className="text-[13px] text-slate-700 dark:text-zinc-300 tracking-wider">••••••••••</p>
          </div>
        </div>
        {/* QRコード模擬 */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-600 rounded-lg p-1.5">
            <div className="w-full h-full">
              <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-slate-900 dark:text-white" fill="currentColor">
                <rect x="0" y="0" width="7" height="7" rx="1" />
                <rect x="2" y="2" width="3" height="3" fill="white" className="fill-white dark:fill-zinc-900" rx="0.5" />
                <rect x="14" y="0" width="7" height="7" rx="1" />
                <rect x="16" y="2" width="3" height="3" fill="white" className="fill-white dark:fill-zinc-900" rx="0.5" />
                <rect x="0" y="14" width="7" height="7" rx="1" />
                <rect x="2" y="16" width="3" height="3" fill="white" className="fill-white dark:fill-zinc-900" rx="0.5" />
                {[9,11,13,9,11,13,9,11,13].map((x, i) => (
                  <rect key={i} x={x} y={Math.floor(i/3)*4+1} width="1.5" height="1.5" rx="0.3" />
                ))}
                {[0,2,4,6,9,11,13,16,18,20].map((x, i) => (
                  <rect key={`b${i}`} x={x} y={9} width="1.5" height="1.5" rx="0.3" />
                ))}
                {[9,11,13,15,18,9,12,15,18].map((x, i) => (
                  <rect key={`c${i}`} x={x} y={Math.floor(i/3)*2+14} width="1.5" height="1.5" rx="0.3" />
                ))}
              </svg>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-center text-slate-500 dark:text-zinc-400">スキャンするだけでWi-Fiに接続</p>
      </div>
    </div>
  );
}

export function TextPreview() {
  return (
    <div className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm select-none" aria-hidden="true">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 text-[11px] text-slate-400">文字数カウント — ToolBox</span>
      </div>
      <div className="p-4 space-y-3">
        <textarea
          readOnly
          value={"登録不要・ブラウザ完結のWebツール集です。PDFや画像の処理もサーバーに送信されません。"}
          className="w-full h-20 resize-none rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-[12px] text-slate-700 dark:text-zinc-300 p-2 focus:outline-none"
          tabIndex={-1}
        />
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "文字数", value: "42" },
            { label: "行数", value: "1" },
            { label: "単語数", value: "7" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-50 dark:bg-zinc-800 rounded-lg p-2 text-center">
              <p className="text-[18px] font-bold text-blue-600 dark:text-blue-400">{s.value}</p>
              <p className="text-[9px] text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
        {/* X/Twitter 残り文字 */}
        <div className="flex items-center gap-2 px-3 py-2 bg-sky-50 dark:bg-sky-950/20 rounded-lg border border-sky-100 dark:border-sky-900/30">
          <span className="text-sky-500 text-sm">𝕏</span>
          <p className="text-[11px] text-sky-700 dark:text-sky-400">X投稿：残り <strong>238</strong> 文字</p>
        </div>
      </div>
    </div>
  );
}
