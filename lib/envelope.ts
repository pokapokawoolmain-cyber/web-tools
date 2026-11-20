// ============================================================
// 香典袋・祝儀袋の共通処理（純関数）
//
// 中袋の金額は正式な大字で「金壱萬円也」のように書く。
//   数字: 壱 弐 参 肆 伍 六 七 八 九（4は使わないのが一般的なため、入力されたときは注意を出す）
//   位　: 拾 百 仟 萬。0 の位は書かずに飛ばし、最後は「円也」
//   例　: 5,000→金伍仟円也 / 10,000→金壱萬円也 / 15,000→金壱萬伍仟円也 / 100,000→金壱拾萬円也
// ============================================================

const DIGIT = ["", "壱", "弐", "参", "肆", "伍", "六", "七", "八", "九"];
const UNIT = ["", "拾", "百", "仟"];

/** 0〜9999 を大字に（0 の位は飛ばす） */
function chunk(n: number): string {
  let out = "";
  const s = String(n).padStart(4, "0");
  for (let i = 0; i < 4; i++) {
    const d = Number(s[i]);
    if (d === 0) continue;
    out += DIGIT[d] + UNIT[3 - i];
  }
  return out;
}

/** 入力（全角・カンマ混じりも可）から金額を読む。読めない・0以下・1億円以上は null */
export function parseYen(input: string): number | null {
  const digits = input.normalize("NFKC").replace(/[^0-9]/g, "");
  if (!digits) return null;
  const n = Number(digits);
  if (!Number.isSafeInteger(n) || n <= 0 || n >= 100_000_000) return null;
  return n;
}

/** 金額を「金壱萬円也」の形に。読めないときは空文字 */
export function toDaijiAmount(input: string): string {
  const n = parseYen(input);
  if (n === null) return "";
  const man = Math.floor(n / 10000);
  const rest = n % 10000;
  return `金${man ? chunk(man) + "萬" : ""}${chunk(rest)}円也`;
}

/** 4（死）・9（苦）を含む金額か。香典・祝儀では避けるのが一般的 */
export function hasAvoidedDigits(input: string): boolean {
  const n = parseYen(input);
  if (n === null) return false;
  return /[49]/.test(String(n).replace(/0+$/, ""));
}

/** 連名の入力（「・」「、」「,」区切り）を名前の並びに */
export function splitNames(input: string): string[] {
  return input
    .split(/[・、,，\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// 会社名・部署名（阿部・服部のような名字に反応しないよう、「部」「課」は3文字以上で終わるものだけ）
const ORG_RE = /(株式会社|有限会社|合同会社|社団法人|財団法人|事務所|^.{2,}[部課]$)/;

/** 連名・会社名の欄を、会社名（右に小さく書く）と連名に分ける */
export function splitSubName(input: string): { org: string; names: string[] } {
  const parts = splitNames(input);
  const org = parts.filter((p) => ORG_RE.test(p)).join("　");
  return { org, names: parts.filter((p) => !ORG_RE.test(p)) };
}
