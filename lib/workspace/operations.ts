// ============================================================
// ワークスペースの操作台帳
//
// 各操作が「受け取る形式」「出す形式」「設定項目」を宣言する。
// 画面はこの台帳を見て操作を並べ、将来の API・MCP はこの宣言から
// エンドポイントやツール定義を作る（処理本体は image-core.ts の純粋な関数）。
// ============================================================
import type { FileKind } from "./sniff";
import { INPUT_KINDS, LIMITS } from "./image-plan";

export interface OperationParam {
  key: string;
  label: string;
  type: "enum" | "number" | "color";
  values?: string[];
  min?: number;
  max?: number;
}

export interface OperationSpec {
  id: string;
  label: string;
  accepts: FileKind[];
  produces: ("jpeg" | "png" | "webp" | "avif" | "zip" | "pdf")[];
  params: OperationParam[];
  /** 処理場所。"browser" はファイルを端末の外へ送らない */
  runtime: "browser";
  limits: { maxFiles: number; maxBytes: number; maxPixels: number };
}

const IMAGE_OUT = ["jpeg", "png", "webp", "avif"] as const;
const limits = { maxFiles: LIMITS.maxFiles, maxBytes: LIMITS.maxBytes, maxPixels: LIMITS.maxPixels };

export const IMAGE_OPERATIONS: OperationSpec[] = [
  {
    id: "image.resize",
    label: "大きさを変える",
    accepts: INPUT_KINDS,
    produces: [...IMAGE_OUT],
    params: [
      { key: "resize.mode", label: "基準", type: "enum", values: ["none", "long", "width", "height", "percent"] },
      { key: "resize.value", label: "値（px または %）", type: "number", min: 1, max: LIMITS.maxOutputEdge },
    ],
    runtime: "browser",
    limits,
  },
  {
    id: "image.aspect",
    label: "縦横比を合わせる",
    accepts: INPUT_KINDS,
    produces: [...IMAGE_OUT],
    params: [
      { key: "aspect.ratio", label: "縦横比", type: "enum", values: ["none", "1:1", "4:3", "3:4", "16:9", "9:16"] },
      { key: "aspect.fit", label: "合わせ方", type: "enum", values: ["pad", "crop"] },
      { key: "background", label: "余白の色", type: "color" },
    ],
    runtime: "browser",
    limits,
  },
  {
    id: "image.convert",
    label: "形式を変える",
    accepts: INPUT_KINDS,
    produces: [...IMAGE_OUT],
    params: [{ key: "format", label: "形式", type: "enum", values: ["keep", ...IMAGE_OUT] }],
    runtime: "browser",
    limits,
  },
  {
    id: "image.compress",
    label: "軽くする",
    accepts: INPUT_KINDS,
    produces: [...IMAGE_OUT],
    params: [
      { key: "quality", label: "画質", type: "number", min: 1, max: 100 },
      { key: "targetBytes", label: "目標ファイルサイズ（バイト）", type: "number", min: 0 },
    ],
    runtime: "browser",
    limits,
  },
  {
    id: "image.bundle-pdf",
    label: "1つのPDFにまとめる",
    accepts: INPUT_KINDS,
    produces: ["pdf"],
    params: [],
    runtime: "browser",
    limits,
  },
];
