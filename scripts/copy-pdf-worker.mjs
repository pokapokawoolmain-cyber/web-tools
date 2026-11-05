// PDF.js の worker を node_modules から public/ にコピーする（ライブラリ本体とバージョンを一致させるため）。
// `npm run build` の前に自動で実行される（package.json の prebuild）。
import { copyFileSync, readFileSync } from "node:fs";

const src = "node_modules/pdfjs-dist/build/pdf.worker.min.mjs";
const dest = "public/pdf.worker.min.mjs";
copyFileSync(src, dest);
const { version } = JSON.parse(readFileSync("node_modules/pdfjs-dist/package.json", "utf8"));
console.log(`pdf.worker.min.mjs を更新しました（pdfjs-dist ${version}）`);
