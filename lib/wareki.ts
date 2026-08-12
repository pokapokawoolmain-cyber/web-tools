// ============================================================
// 和暦（元号）変換の共通ロジック
// 年齢計算ツールと西暦・和暦変換ツールで共用する。
// ============================================================

export interface EraDef {
  name: string;
  /** ローマ字表記（略記M/T/S/H/R） */
  initial: string;
  startY: number;
  startM: number;
  startD: number;
}

// 新しい順（判定は上から）
export const ERAS: EraDef[] = [
  { name: "令和", initial: "R", startY: 2019, startM: 5, startD: 1 },
  { name: "平成", initial: "H", startY: 1989, startM: 1, startD: 8 },
  { name: "昭和", initial: "S", startY: 1926, startM: 12, startD: 25 },
  { name: "大正", initial: "T", startY: 1912, startM: 7, startD: 30 },
  { name: "明治", initial: "M", startY: 1868, startM: 1, startD: 25 },
];

export interface WarekiResult {
  era: string;
  initial: string;
  /** 元号内の年（1年＝元年） */
  yearInEra: number;
  /** 例: 令和6年 / 平成元年 */
  text: string;
}

/** 西暦（年月日）→ 和暦。明治より前は null。 */
export function toWareki(year: number, month: number, day: number): WarekiResult | null {
  for (const e of ERAS) {
    const afterStart =
      year > e.startY ||
      (year === e.startY && (month > e.startM || (month === e.startM && day >= e.startD)));
    if (afterStart) {
      const yearInEra = year - e.startY + 1;
      return {
        era: e.name,
        initial: e.initial,
        yearInEra,
        text: `${e.name}${yearInEra === 1 ? "元" : yearInEra}年`,
      };
    }
  }
  return null;
}

/** 元号内の年だけをシンプルに（月日を使わない・年単位の目安）。境界年は開始側の元号で表示。 */
export function yearToWarekiText(year: number): string {
  // その年の途中で改元した年も、元号の開始年で表記する簡易版
  for (const e of ERAS) {
    if (year >= e.startY) {
      const n = year - e.startY + 1;
      return `${e.name}${n === 1 ? "元" : n}年`;
    }
  }
  return "";
}

/** 和暦（元号名＋元号内の年）→ 西暦。存在しない場合は null。 */
export function fromWareki(eraName: string, yearInEra: number): number | null {
  const e = ERAS.find((x) => x.name === eraName || x.initial === eraName.toUpperCase());
  if (!e || yearInEra < 1) return null;
  return e.startY + yearInEra - 1;
}

const ETO = ["申", "酉", "戌", "亥", "子", "丑", "寅", "卯", "辰", "巳", "午", "未"];
const ETO_ANIMAL: Record<string, string> = {
  子: "ねずみ", 丑: "うし", 寅: "とら", 卯: "うさぎ", 辰: "たつ", 巳: "へび",
  午: "うま", 未: "ひつじ", 申: "さる", 酉: "とり", 戌: "いぬ", 亥: "いのしし",
};

/** 干支（十二支）。例: { sign: "辰", animal: "たつ" } */
export function getEto(year: number): { sign: string; animal: string } {
  const sign = ETO[((year % 12) + 12) % 12];
  return { sign, animal: ETO_ANIMAL[sign] };
}

/** 星座（西洋占星術） */
export function getZodiac(month: number, day: number): string {
  const z: [number, number, string][] = [
    [1, 20, "山羊座"], [2, 19, "水瓶座"], [3, 21, "魚座"], [4, 20, "牡羊座"],
    [5, 21, "牡牛座"], [6, 22, "双子座"], [7, 23, "蟹座"], [8, 23, "獅子座"],
    [9, 23, "乙女座"], [10, 24, "天秤座"], [11, 23, "蠍座"], [12, 22, "射手座"],
  ];
  // month の境界日未満なら前の星座
  const [, boundary, sign] = z[month - 1];
  if (day < boundary) {
    return month === 1 ? "山羊座" : z[month - 2][2];
  }
  return sign;
}
