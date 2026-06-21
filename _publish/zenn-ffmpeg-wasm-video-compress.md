---
title: "FFmpeg.wasmでブラウザだけで動画を圧縮する実装【Next.js】"
emoji: "🎬"
type: "tech"
topics: ["nextjs", "typescript", "ffmpeg", "webassembly", "react"]
published: true
---

## はじめに

動画圧縮は通常サーバーサイドの重い処理です。しかし **FFmpeg.wasm**（FFmpegをWebAssemblyにコンパイルしたもの）を使えば、**ブラウザだけで動画をH.264エンコードして圧縮**できます。

- サーバー不要・アップロードなし
- MP4・MOV・AVI・MKV・WebM 対応
- CRF（品質係数）と解像度を指定して圧縮

実際に動くツール → [動画圧縮ツール - ToolBoxJP](https://www.toolboxjp.com/tools/video-compress)

---

## 技術スタック

- **Next.js 15**（App Router）
- **TypeScript**
- **@ffmpeg/ffmpeg** — FFmpeg.wasmのReactラッパー
- **@ffmpeg/util** — ファイル変換ユーティリティ

---

## セットアップ

```bash
npm install @ffmpeg/ffmpeg @ffmpeg/util
```

---

## FFmpeg.wasmの特徴と注意点

FFmpeg.wasmはブラウザ内でWebAssembly（Wasm）として動作するFFmpegです。

**メリット：**
- サーバーに動画を送らないのでプライバシー保護
- FFmpegのほぼすべてのコーデック・フィルタが使える

**デメリット：**
- 初回起動時に約32MBのWasmファイルをダウンロード
- ネイティブFFmpegより処理が3〜5倍遅い
- `SharedArrayBuffer` が必要（後述のCORSヘッダー設定が必要）

---

## 実装

### 1. FFmpegの動的インポートと初期化

FFmpeg.wasmはクライアントサイドのみで動作します。`"use client"` コンポーネント内で動的インポートします。

```tsx
"use client";
import { useState, useRef } from "react";

// ffmpegRef で FFmpeg インスタンスをキャッシュ（再初期化を防ぐ）
const ffmpegRef = useRef<any>(null);

async function loadFFmpeg() {
  if (ffmpegRef.current) return ffmpegRef.current;

  const { FFmpeg } = await import("@ffmpeg/ffmpeg");
  const { toBlobURL } = await import("@ffmpeg/util");

  const ffmpeg = new FFmpeg();

  // 進捗コールバック
  ffmpeg.on("progress", ({ progress }: { progress: number }) => {
    setProgress(Math.round(progress * 100));
  });

  // WasmコアをCDNから読み込む（バンドルに含めるとサイズが膨大になるため）
  const base = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
  await ffmpeg.load({
    coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm"),
  });

  ffmpegRef.current = ffmpeg;
  return ffmpeg;
}
```

**`toBlobURL` を使う理由：**
CDNのURLをそのまま使うと `SharedArrayBuffer` のCORS制限に引っかかります。`toBlobURL` はリソースをfetchしてBlobURLに変換することで、この制限を回避します。

### 2. SharedArrayBuffer のCORSヘッダー

FFmpeg.wasmは `SharedArrayBuffer` を使うため、`Cross-Origin-Opener-Policy` と `Cross-Origin-Embedder-Policy` ヘッダーが必要です。

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### 3. 動画の圧縮処理

```tsx
async function compressVideo(
  file: File,
  crf: number,          // 18〜40。低いほど高品質（ファイル大）
  resolution: string,   // "original" | "1080" | "720" | "480" | "360"
  onProgress: (p: number) => void
): Promise<Blob> {
  const ffmpeg = await loadFFmpeg();
  const { fetchFile } = await import("@ffmpeg/util");

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "mp4";
  const inputName = `input.${ext}`;

  // ① ファイルをFFmpegの仮想FSに書き込む
  await ffmpeg.writeFile(inputName, await fetchFile(file));

  // ② エンコードオプションの組み立て
  const args = [
    "-i", inputName,
    "-c:v", "libx264",        // H.264エンコード
    "-crf", String(crf),      // 品質係数（23〜28が標準）
    "-preset", "fast",        // エンコード速度（ultrafast〜veryslow）
    "-c:a", "aac",            // 音声コーデック
    "-b:a", "128k",           // 音声ビットレート
    "-movflags", "+faststart", // Webストリーミング対応
  ];

  // 解像度変更オプション（-2は縦横比を維持して偶数に丸める）
  if (resolution !== "original") {
    args.push("-vf", `scale=-2:${resolution}`);
  }

  args.push("output.mp4");

  // ③ FFmpegを実行
  await ffmpeg.exec(args);

  // ④ 出力ファイルを読み込んでBlobに変換
  const data = await ffmpeg.readFile("output.mp4");
  const blob = new Blob([data as BlobPart], { type: "video/mp4" });

  // ⑤ 仮想FSのファイルを削除（メモリ解放）
  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile("output.mp4");

  return blob;
}
```

### 4. CRF（品質係数）の選び方

| CRF値 | 用途 | ファイルサイズ |
|---|---|---|
| 18〜22 | 高品質・アーカイブ | 大きい |
| 23〜28 | 標準（推奨） | 中程度 |
| 29〜35 | SNS投稿・共有用 | 小さい |
| 36〜40 | 最高圧縮 | 非常に小さい |

libx264 の CRF デフォルトは 23。品質的に許容できる範囲で最大値を使うのが鉄則です。

### 5. Reactコンポーネント全体像

```tsx
type Status = "idle" | "loading_wasm" | "processing" | "done" | "error";

export function VideoCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [crf, setCrf] = useState(28);
  const [resolution, setResolution] = useState("original");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const ffmpegRef = useRef<any>(null);

  const compress = async () => {
    if (!file) return;

    try {
      // WASMロード中は別ステータスで案内
      if (!ffmpegRef.current) {
        setStatus("loading_wasm");
      }

      setStatus("processing");
      const blob = await compressVideo(file, crf, resolution, setProgress);

      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultSize(blob.size);
      setStatus("done");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  const compressionRate = file && resultSize
    ? ((file.size - resultSize) / file.size) * 100
    : 0;

  return (
    <div>
      {/* ファイル選択 */}
      <input
        type="file"
        accept="video/*"
        onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
      />

      {file && (
        <div>
          <p>CRF: {crf}</p>
          <input type="range" min={18} max={40} value={crf}
            onChange={(e) => setCrf(Number(e.target.value))} />

          <button
            onClick={compress}
            disabled={status === "loading_wasm" || status === "processing"}
          >
            {status === "loading_wasm"
              ? "WASM読み込み中（約32MB）..."
              : status === "processing"
              ? `圧縮中... ${progress}%`
              : "圧縮を開始"}
          </button>
        </div>
      )}

      {status === "done" && resultUrl && (
        <div>
          <p>元サイズ: {(file!.size / 1024 / 1024).toFixed(1)}MB</p>
          <p>圧縮後: {(resultSize / 1024 / 1024).toFixed(1)}MB</p>
          <p>削減率: {compressionRate.toFixed(0)}%</p>
          <a href={resultUrl} download="compressed.mp4">ダウンロード</a>
        </div>
      )}
    </div>
  );
}
```

---

## パフォーマンスの考慮

### WASMの初回ロード

32MBのWasmファイルのロードは避けられません。ユーザーへの案内として：

```tsx
{status === "loading_wasm" && (
  <p>⏳ FFmpegを読み込み中（約32MB・初回のみ）...</p>
)}
```

`ffmpegRef` にインスタンスをキャッシュすることで、2回目以降の圧縮は即座に開始できます。

### 処理時間の目安

| 動画長 | 処理時間（目安） |
|---|---|
| 5分 | 1〜3分 |
| 30分 | 5〜20分 |
| 2時間 | 20〜60分 |

ネイティブFFmpegの3〜5倍の時間がかかります。処理中はタブを閉じないよう案内が必要です。

---

## セキュリティとプライバシー

ブラウザ完結処理の最大のメリットは、**動画ファイルが一切外部に送信されない**ことです。

```tsx
// ネットワークリクエストは WASMのダウンロードのみ
// 動画ファイルのアップロードは一切なし
```

社内会議録画・個人的な映像など、アップロードしたくない動画の圧縮に最適です。

---

## まとめ

| 項目 | 内容 |
|---|---|
| ライブラリ | `@ffmpeg/ffmpeg` + `@ffmpeg/util` |
| コーデック | H.264（libx264）+ AAC |
| 品質調整 | CRF（18〜40） |
| 解像度変更 | `scale=-2:${height}` |
| WASMサイズ | 約32MB（初回のみCDNからロード） |
| プライバシー | ファイルはサーバーに送信されない |

FFmpeg.wasmは「サーバーレスで本格的な動画処理」を実現できる強力なツールです。処理速度はネイティブより遅いものの、プライバシー保護・サーバーコスト削減の観点でユーザーに刺さります。

実際のデモは [ToolBoxJP の動画圧縮ツール](https://www.toolboxjp.com/tools/video-compress) で確認できます。

---

## 参考

- [@ffmpeg/ffmpeg GitHub](https://github.com/ffmpegwasm/ffmpeg.wasm)
- [FFmpeg ドキュメント - libx264](https://trac.ffmpeg.org/wiki/Encode/H.264)
- [SharedArrayBuffer - MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)
