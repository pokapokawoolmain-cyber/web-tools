---
title: "Canvas API + BFSで証明写真の背景をブラウザだけで自動除去する実装"
emoji: "📷"
type: "tech"
topics: ["typescript", "react", "canvas", "画像処理", "アルゴリズム"]
published: true
---

## はじめに

証明写真の背景除去というと、Remove.bg のような外部APIや、AIモデルを使うことが多いです。しかし **Canvas API + BFS（幅優先探索）** を使えば、外部API不要・完全ブラウザ完結で背景を除去できます。

- サーバーへの画像送信なし
- ライブラリ不要（Canvas API のみ）
- BFSフラッドフィルで背景ピクセルを検出・透過化
- エッジをソフトにして自然な仕上がり

実際に動くツール → [証明写真作成ツール - ToolBoxJP](https://www.toolboxjp.com/tools/id-photo)

---

## アプローチ：BFSフラッドフィル

背景除去のアルゴリズムには様々なものがあります。

| 手法 | 精度 | 実装コスト |
|---|---|---|
| AIモデル（rembg等） | ★★★ | 高（重いモデル） |
| GrabCut（OpenCV.js） | ★★★ | 中 |
| **BFSフラッドフィル** | ★★ | 低（標準APIのみ） |
| 閾値による単純二値化 | ★ | 最低 |

BFSフラッドフィルは「証明写真のような均一な背景」に効果的です。AIほどの精度はありませんが、外部ライブラリ不要で軽量に動作します。

---

## アルゴリズムの概要

```
1. 画像の四辺（境界ピクセル）から背景色を推定
2. 境界ピクセルを起点にBFSを実行
3. BFSで訪問したピクセルのうち、背景色と近い色を透過化
4. エッジを距離に応じてソフトに（αを徐々に変化）
```

---

## 実装

### 1. 背景色の推定

四辺のピクセルを集めて「トリム平均」で背景色を推定します。

```ts
function estimateBackgroundColor(
  data: Uint8ClampedArray,
  width: number,
  height: number
): [number, number, number] {
  const border: [number, number, number][] = [];

  // 上辺・下辺のピクセルを収集
  for (let x = 0; x < width; x++) {
    const topIdx = x * 4;
    const bottomIdx = ((height - 1) * width + x) * 4;
    border.push([data[topIdx], data[topIdx + 1], data[topIdx + 2]]);
    border.push([data[bottomIdx], data[bottomIdx + 1], data[bottomIdx + 2]]);
  }

  // 左辺・右辺のピクセルを収集
  for (let y = 1; y < height - 1; y++) {
    const leftIdx = y * width * 4;
    const rightIdx = (y * width + width - 1) * 4;
    border.push([data[leftIdx], data[leftIdx + 1], data[leftIdx + 2]]);
    border.push([data[rightIdx], data[rightIdx + 1], data[rightIdx + 2]]);
  }

  // 輝度でソートして中間60%のトリム平均を取る
  // （髪・服の色が端にかかっていても外れ値として除外できる）
  border.sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]));

  const s0 = Math.floor(border.length * 0.2);  // 下位20%を除外
  const s1 = Math.floor(border.length * 0.8);  // 上位20%を除外

  let r = 0, g = 0, b = 0;
  for (let i = s0; i < s1; i++) {
    r += border[i][0];
    g += border[i][1];
    b += border[i][2];
  }

  const count = s1 - s0;
  return [Math.round(r / count), Math.round(g / count), Math.round(b / count)];
}
```

**トリム平均を使う理由：**
証明写真では髪や衣服が画像の端に触れることがあります。単純平均では髪の黒が背景色として混入してしまうため、外れ値を除いたトリム平均を使います。

### 2. BFSで背景ピクセルを検出・透過化

```ts
const TOLERANCE = 50;  // 背景色との許容距離（ユークリッド距離）

function removeBackground(
  imageData: ImageData,
  bgColor: [number, number, number]
): ImageData {
  const { data, width, height } = imageData;
  const [bgR, bgG, bgB] = bgColor;

  // ピクセルの色と背景色のユークリッド距離
  const colorDistance = (pixelIdx: number): number => {
    const dr = data[pixelIdx] - bgR;
    const dg = data[pixelIdx + 1] - bgG;
    const db = data[pixelIdx + 2] - bgB;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  };

  // BFS
  const visited = new Uint8Array(width * height);  // 訪問済みフラグ
  const queue: number[] = [];

  // 境界ピクセルをすべてキューに追加（BFSの開始点）
  const seed = (x: number, y: number) => {
    const idx = y * width + x;
    if (!visited[idx]) {
      visited[idx] = 1;
      queue.push(idx);
    }
  };

  for (let x = 0; x < width; x++) {
    seed(x, 0);
    seed(x, height - 1);
  }
  for (let y = 1; y < height - 1; y++) {
    seed(0, y);
    seed(width - 1, y);
  }

  // BFS実行
  let qi = 0;
  while (qi < queue.length) {
    const idx = queue[qi++];
    const pixelIdx = idx * 4;
    const dist = colorDistance(pixelIdx);

    // 背景色と差が大きい（人物部分）はスキップ
    if (dist > TOLERANCE) continue;

    // エッジをソフトに：距離が小さいほど透明に、大きいほど不透明に
    // (dist / TOLERANCE)^1.5 で滑らかなフォールオフ
    data[pixelIdx + 3] = Math.round((dist / TOLERANCE) ** 1.5 * 255);

    // 4近傍のピクセルをキューに追加
    const x = idx % width;
    const y = (idx / width) | 0;
    const neighbors: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (const [dx, dy] of neighbors) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;

      const ni = ny * width + nx;
      if (!visited[ni]) {
        visited[ni] = 1;
        queue.push(ni);
      }
    }
  }

  return imageData;
}
```

**エッジのソフト化：**
`(dist / TOLERANCE) ** 1.5` の乗数を1.5にすることで、境界に向かってαが徐々に増加します。乗数を1にすると線形、2以上にするとよりシャープなエッジになります。

### 3. メイン処理：画像をCanvasで処理

```ts
async function removeBgFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // 大きい画像はリサイズして処理（メモリ節約）
      const MAX = 1500;
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;

      // 画像をCanvasに描画
      ctx.drawImage(img, 0, 0, w, h);

      // ピクセルデータを取得
      const imageData = ctx.getImageData(0, 0, w, h);

      // 背景色の推定
      const bgColor = estimateBackgroundColor(imageData.data, w, h);

      // BFSで背景除去
      const processed = removeBackground(imageData, bgColor);

      // 処理後のピクセルデータを書き戻し
      ctx.putImageData(processed, 0, 0);

      // PNG（透過あり）としてDataURLに変換
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("画像の読み込みに失敗しました"));
    img.src = URL.createObjectURL(file);
  });
}
```

### 4. Reactコンポーネントでの使い方

```tsx
"use client";
import { useState, useCallback } from "react";

export function IdPhotoEditor() {
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [isRemoving, setIsRemoving] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    const url = URL.createObjectURL(file);
    setOriginalSrc(url);
    setProcessedSrc(null);
  }, []);

  const handleRemoveBg = async () => {
    if (!originalSrc) return;
    setIsRemoving(true);
    try {
      // FileオブジェクトからBlobURLを経由して処理
      const resp = await fetch(originalSrc);
      const blob = await resp.blob();
      const file = new File([blob], "photo.jpg");
      const result = await removeBgFromFile(file);
      setProcessedSrc(result);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={(e) => {
        const f = e.target.files?.[0];
        if (f) handleFile(f);
      }} />

      {originalSrc && (
        <button onClick={handleRemoveBg} disabled={isRemoving}>
          {isRemoving ? "処理中..." : "背景を自動除去"}
        </button>
      )}

      {processedSrc && (
        // 処理後の画像を選択した背景色の上に表示
        <div style={{ backgroundColor: bgColor, padding: 16, display: "inline-block" }}>
          <img src={processedSrc} alt="背景除去済み" style={{ width: 200 }} />
        </div>
      )}

      {/* 背景色の変更 */}
      {processedSrc && (
        <div>
          {["#ffffff", "#e8ecf0", "#a8c4e0"].map((color) => (
            <button
              key={color}
              onClick={() => setBgColor(color)}
              style={{ backgroundColor: color, width: 32, height: 32, borderRadius: "50%",
                border: bgColor === color ? "2px solid blue" : "2px solid #ddd" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## パフォーマンスの考慮

### 1500px上限のリサイズ

高解像度の画像（4000×3000px等）をそのままGetImageData/putImageDataすると処理が重くなります。証明写真の用途では1500px以下で十分な品質が出るため、リサイズしてから処理します。

```ts
const MAX = 1500;
const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
// ratioが1未満の場合のみリサイズ
```

### BFSのメモリ使用量

BFSのキューは最悪ケースで全ピクセル数（1500×1500 = 225万）分の整数を保持します。`number[]` の代わりに `Int32Array` を使うとメモリ効率が上がりますが、実用上は `number[]` で問題ないことが多いです。

---

## 精度の限界と改善案

BFSフラッドフィルの限界：

- **グラデーション背景** には対応が難しい（均一色の背景向け）
- **背景と髪が似た色** の場合に抜け残りが出やすい
- **細い毛先** の透過は難しい

精度を上げたい場合の選択肢：

```
1. MediaPipe Selfie Segmentation（軽量AIモデル、~5MB）
2. ONNX Runtime Web + Matting モデル
3. Remove.bg API（有料・高精度）
```

証明写真のような「均一な白・青背景」のケースに特化するなら、BFSで十分な実用精度が出ます。

---

## まとめ

| 項目 | 内容 |
|---|---|
| アルゴリズム | BFSフラッドフィル |
| 背景色推定 | 四辺のトリム平均 |
| エッジ処理 | αを距離に応じてソフト化 |
| 出力 | PNG（透過あり） |
| ライブラリ | 不要（Canvas API のみ） |
| プライバシー | ファイルはサーバーに送信されない |

外部APIやAIモデルなしでも、証明写真のような用途なら十分な精度で背景除去が実現できます。

実際のデモは [ToolBoxJP の証明写真作成ツール](https://www.toolboxjp.com/tools/id-photo) で確認できます。

---

## 参考

- [Canvas API - MDN](https://developer.mozilla.org/ja/docs/Web/API/Canvas_API)
- [ImageData - MDN](https://developer.mozilla.org/ja/docs/Web/API/ImageData)
- [フラッドフィル - Wikipedia](https://ja.wikipedia.org/wiki/フラッドフィル)
