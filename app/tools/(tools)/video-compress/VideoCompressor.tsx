"use client";
import { useState, useRef, useCallback } from "react";
import { Upload, Download, AlertTriangle, Loader2, RotateCcw } from "lucide-react";
import { SliderInput } from "@/components/ui/SliderInput";

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

const RESOLUTIONS = [
  { label: "オリジナル", value: "original" },
  { label: "1080p", value: "1080" },
  { label: "720p", value: "720" },
  { label: "480p", value: "480" },
  { label: "360p", value: "360" },
];

type Status = "idle" | "loading_wasm" | "processing" | "done" | "error";

export function VideoCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [crf, setCrf] = useState(28);
  const [resolution, setResolution] = useState("original");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [isDrag, setIsDrag] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ffmpegRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback((f: File) => {
    if (!f.type.startsWith("video/")) return;
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(f);
    setResultUrl(null);
    setStatus("idle");
    setProgress(0);
  }, [resultUrl]);

  const compress = async () => {
    if (!file) return;
    setErrorMsg("");

    try {
      if (!ffmpegRef.current) {
        setStatus("loading_wasm");
        const { FFmpeg } = await import("@ffmpeg/ffmpeg");
        const { toBlobURL } = await import("@ffmpeg/util");
        const ffmpeg = new FFmpeg();
        ffmpeg.on("progress", ({ progress: p }: { progress: number }) => {
          setProgress(Math.round(p * 100));
        });
        const base = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
        await ffmpeg.load({
          coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, "text/javascript"),
          wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm"),
        });
        ffmpegRef.current = ffmpeg;
      }

      setStatus("processing");
      setProgress(0);

      const ffmpeg = ffmpegRef.current;
      const { fetchFile } = await import("@ffmpeg/util");
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "mp4";
      const inputName = `input.${ext}`;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const args = [
        "-i", inputName,
        "-c:v", "libx264",
        "-crf", String(crf),
        "-preset", "fast",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
      ];

      if (resolution !== "original") {
        args.push("-vf", `scale=-2:${resolution}`);
      }

      args.push("output.mp4");
      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile("output.mp4");
      const blob = new Blob([data as BlobPart], { type: "video/mp4" });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
      setStatus("done");

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile("output.mp4");
    } catch (e) {
      console.error(e);
      setErrorMsg(e instanceof Error ? e.message : "圧縮に失敗しました");
      setStatus("error");
    }
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const base = file.name.replace(/\.[^.]+$/, "");
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `${base}_compressed.mp4`;
    a.click();
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setResultUrl(null);
    setStatus("idle");
    setProgress(0);
    setErrorMsg("");
  };

  const isProcessing = status === "loading_wasm" || status === "processing";
  const compressionRate = file && resultSize ? ((file.size - resultSize) / file.size) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 注意書き */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-3">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div className="text-xs text-amber-800 dark:text-amber-300 space-y-1">
          <p className="font-medium text-sm">処理時間について</p>
          <p>動画圧縮はすべてブラウザ内で処理されます。初回起動時にWebAssembly（約32MB）を読み込みます。</p>
          <p>処理時間の目安：30分動画 → 約5〜20分、2時間動画 → 約20〜60分。タブを閉じると中断されます。</p>
        </div>
      </div>

      {/* ファイル選択 */}
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            isDrag
              ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20"
              : "border-slate-200 dark:border-zinc-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/10"
          }`}
          onDrop={(e) => { e.preventDefault(); setIsDrag(false); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
          onDragOver={(e) => { e.preventDefault(); setIsDrag(true); }}
          onDragLeave={() => setIsDrag(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <p className="font-medium text-slate-700 dark:text-slate-300">動画をドロップ、またはクリックして選択</p>
          <p className="text-xs text-slate-400 mt-1">MP4・MOV・AVI・MKV・WebM 対応</p>
          <input ref={fileInputRef} type="file" accept="video/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-4 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-xs">{file.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{formatSize(file.size)}</p>
          </div>
          <button onClick={reset}
            className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors">
            <RotateCcw className="w-3.5 h-3.5" />別の動画を選ぶ
          </button>
        </div>
      )}

      {/* 設定 */}
      {file && status !== "done" && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-5">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm">⚙️ 圧縮設定</h2>

          <SliderInput
            id="crf"
            label="映像品質（低い値ほど高品質・ファイル大）"
            value={crf}
            onChange={setCrf}
            min={18}
            max={40}
            step={1}
            unit=""
            formatValue={(v) => v <= 22 ? `${v}（高品質）` : v >= 34 ? `${v}（高圧縮）` : `${v}（標準）`}
          />
          <p className="text-xs text-slate-400 -mt-2">推奨：23〜28（標準）/ SNS用：30〜35</p>

          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">解像度</p>
            <div className="flex flex-wrap gap-2">
              {RESOLUTIONS.map((r) => (
                <button key={r.value} onClick={() => setResolution(r.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                    resolution === r.value
                      ? "bg-blue-50 dark:bg-blue-950/30 border-blue-400 text-blue-600 dark:text-blue-400"
                      : "border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                  }`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={compress} disabled={isProcessing}
            className="w-full btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed">
            {isProcessing
              ? <><Loader2 className="w-4 h-4 animate-spin" />処理中...</>
              : <><Download className="w-4 h-4" />圧縮を開始</>
            }
          </button>
        </div>
      )}

      {/* 進捗 */}
      {isProcessing && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-3">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {status === "loading_wasm"
              ? "⏳ WebAssembly を読み込み中（約32MB）..."
              : `🎬 圧縮中... ${progress}%`}
          </p>
          <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2.5">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: status === "loading_wasm" ? "100%" : `${progress}%` }}
            />
          </div>
          {status === "processing" && (
            <p className="text-xs text-slate-400">タブを閉じると処理が中断されます。このままお待ちください。</p>
          )}
        </div>
      )}

      {/* エラー */}
      {status === "error" && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-700 dark:text-red-400">
          <p className="font-medium">❌ 圧縮に失敗しました</p>
          {errorMsg && <p className="text-xs mt-1 opacity-80">{errorMsg}</p>}
          <p className="text-xs mt-2 opacity-80">別の形式のファイルや、より小さいファイルでお試しください。</p>
        </div>
      )}

      {/* 結果 */}
      {status === "done" && resultUrl && file && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-700 p-5 space-y-4">
          <h2 className="font-bold text-slate-900 dark:text-white text-sm">✅ 圧縮完了</h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">元のサイズ</p>
              <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">{formatSize(file.size)}</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-3">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">圧縮後</p>
              <p className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">{formatSize(resultSize)}</p>
            </div>
            <div className={`rounded-xl p-3 ${compressionRate >= 0 ? "bg-blue-50 dark:bg-blue-950/30" : "bg-amber-50 dark:bg-amber-950/30"}`}>
              <p className={`text-xs mb-1 ${compressionRate >= 0 ? "text-blue-600 dark:text-blue-400" : "text-amber-600 dark:text-amber-400"}`}>削減率</p>
              <p className={`font-bold text-sm ${compressionRate >= 0 ? "text-blue-700 dark:text-blue-400" : "text-amber-700 dark:text-amber-400"}`}>
                {compressionRate >= 0 ? `−${compressionRate.toFixed(0)}%` : `+${Math.abs(compressionRate).toFixed(0)}%`}
              </p>
            </div>
          </div>

          {compressionRate < 0 && (
            <p className="text-xs text-amber-600 dark:text-amber-400 text-center bg-amber-50 dark:bg-amber-950/20 rounded-lg p-2">
              ⚠️ 元の動画がすでに高効率で圧縮されているため、ファイルサイズが増加しました。品質値を上げるか、解像度を下げると改善する場合があります。
            </p>
          )}

          <div className="flex gap-3">
            <button onClick={reset}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-sm">
              <RotateCcw className="w-4 h-4" />別の動画を圧縮
            </button>
            <button onClick={download} className="flex-1 btn-primary justify-center">
              <Download className="w-4 h-4" />ダウンロード
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
        ✅ 動画はサーバーに送信されません。すべてブラウザ内で処理されます。
      </p>
    </div>
  );
}
