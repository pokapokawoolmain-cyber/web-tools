// ============================================================
// Mochico アプリ内部（個人データを扱う非公開ページ）のパス判定
//   公開LP（/mochico）や LP 用の画像・アイコンは含めない。
//   middleware の matcher・vercel.json の noindex ヘッダーと同じ範囲。
// ============================================================
export const MOCHICO_PRIVATE_PATH_RE = /^\/mochico\/(app|events|settings|login|auth|s|account|internal)(\/|$)/;

export const isMochicoPrivatePath = (pathname: string) => MOCHICO_PRIVATE_PATH_RE.test(pathname);
