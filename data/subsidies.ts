// ============================================================
// 補助金・助成金データ
// 将来的に外部API/CMS取得に切り替えやすい構造
// ============================================================

// ─── UI表示用（日本語）型 ───────────────────────────────────
export type BusinessType = "法人" | "個人事業主" | "創業予定" | "個人・家庭";
export type Industry =
  | "飲食" | "美容" | "小売" | "建設" | "IT"
  | "士業" | "医療・介護" | "教育" | "製造" | "その他";
export type EmployeeCount = "0人" | "1〜5人" | "6〜20人" | "21〜50人" | "51人以上";
export type Purpose =
  | "ホームページ制作" | "広告・販路開拓" | "店舗改装" | "設備投資"
  | "IT導入" | "AI導入" | "省力化" | "採用" | "賃上げ" | "研修"
  | "事業承継" | "新規事業" | "海外展開" | "研究開発";
export type InvestmentAmount =
  | "〜10万円" | "10〜50万円" | "50〜100万円" | "100〜500万円" | "500万円以上";
export type HiringPlan = "あり" | "なし" | "未定";
export type WageIncreasePlan = "あり" | "なし" | "未定";
export type RecommendLevel = "高" | "中" | "条件次第";
export type SubsidyStatus = "受付中" | "準備中" | "終了" | "随時受付" | "不明";
export type Difficulty = "易" | "中" | "難";

// ─── プログラム用（英語）型 ─────────────────────────────────
export type SubsidyType = "subsidy" | "grant" | "loan" | "tax";
export type Provider =
  | "中小企業庁" | "厚生労働省" | "経済産業省"
  | "自治体" | "中小機構" | "その他";
export type StatusCode = "open" | "scheduled" | "closed" | "unknown";
export type TargetBusinessTypeCode = "corporation" | "sole_proprietor" | "startup" | "individual";

// ─── 拡張SubsidyData型 ──────────────────────────────────────
export interface SubsidyData {
  // 基本
  id: string;
  name: string;
  shortName: string;
  emoji: string;

  // 分類
  category: "補助金" | "助成金";
  type: SubsidyType;
  provider: Provider;

  // 参照元
  sourceLabel: string;
  sourceUrl: string;
  officialUrl: string;

  // 公募状況
  status: SubsidyStatus;
  statusCode: StatusCode;
  applicationStartDate?: string; // "2025-04-01"
  applicationEndDate?: string;   // "2025-09-30"
  deadlineDate?: string;         // ソート用
  deadline: string;              // 表示用テキスト
  deadlineNote?: string;

  // 更新管理
  updatedAt: string;
  lastCheckedAt: string;

  // マッチング条件（UI用）
  targetBusinessTypes: BusinessType[];
  targetIndustries: Industry[] | "all";
  targetEmployeeCounts: EmployeeCount[];
  targetPurposes: Purpose[];
  targetAreas: string[] | "all";
  requiresHiring?: boolean;
  requiresWageIncrease?: boolean;

  // マッチング条件（プログラム用）
  targetBusinessTypeCodes: TargetBusinessTypeCode[];
  targetRegions: string[] | "all";

  // 補助内容
  maxSubsidy: string;            // 表示用テキスト（断定しない表現）
  maxAmount?: number;            // 数値（円）※参考値
  subsidyRate: string;           // 表示用テキスト
  eligibleExpenses: string[];    // 補助対象経費
  usagePurposes: string[];       // 活用用途

  // 難易度
  difficulty: Difficulty;
  adoptionRateNote: string;
  preparationWeeks: string;

  // 申請要件・書類
  requiredDocuments: string[];

  // 診断表示
  description: string;
  matchReasons: string[];
  unmatchReasons: string[];
  recommendedFor: string[];
  notRecommendedFor: string[];
  cautionPoints: string[];
  nextActions: string[];
  notes: string[];

  // SEO・検索
  keywords: string[];

  // スコアリング
  weight: number;

  // 後方互換（旧フィールド）
  nextSteps: string[];
}

// ─── 補助金・助成金データ本体（コア + 拡張 + 個人・家庭向け）──
import { SUBSIDIES_EXTENDED } from "./subsidies-extended";
import { SUBSIDIES_INDIVIDUAL } from "./subsidies-individual";

const SUBSIDIES_CORE: SubsidyData[] = [

  // ① 小規模事業者持続化補助金
  {
    id: "jizokukahojokin",
    name: "小規模事業者持続化補助金",
    shortName: "持続化補助金",
    emoji: "🏪",
    category: "補助金",
    type: "subsidy",
    provider: "中小企業庁",
    sourceLabel: "中小企業庁・日本商工会議所",
    sourceUrl: "https://r3.jizokukahojokin.info/",
    officialUrl: "https://r3.jizokukahojokin.info/",
    status: "随時受付",
    statusCode: "open",
    deadline: "2026年度も公募予定。公募回ごとに締切が異なります（公式で最新を確認）",
    deadlineNote: "公募回ごとに締切が異なります。最新の公募要領を公式サイトでご確認ください",
    updatedAt: "2026-08-15",
    lastCheckedAt: "2026-08-15",
    targetBusinessTypes: ["法人", "個人事業主"],
    targetIndustries: "all",
    targetEmployeeCounts: ["0人", "1〜5人", "6〜20人"],
    targetPurposes: ["ホームページ制作", "広告・販路開拓", "店舗改装"],
    targetAreas: "all",
    requiresHiring: false,
    requiresWageIncrease: false,
    targetBusinessTypeCodes: ["corporation", "sole_proprietor"],
    targetRegions: "all",
    maxSubsidy: "通常枠で最大50万円、特例枠は公募要領による",
    maxAmount: 2000000,
    subsidyRate: "2/3（一部コースは3/4）公募回・枠により異なります",
    eligibleExpenses: ["機械装置等費", "広報費", "ウェブサイト関連費", "展示会等出展費", "旅費", "開発費", "資料購入費", "雑役務費", "借料", "設備処分費", "委託・外注費"],
    usagePurposes: ["販路開拓", "広告・宣伝", "ホームページ制作", "店舗改装", "展示会出展"],
    difficulty: "中",
    adoptionRateNote: "公募回により異なります（公式発表値を参照）",
    preparationWeeks: "3〜6週間",
    requiredDocuments: ["確定申告書", "貸借対照表・損益計算書（法人）", "経営計画書", "補助事業計画書", "商工会等の支援確認書"],
    description: "販路開拓や業務効率化に取り組む小規模事業者向け。HP制作・広告・店舗改装などの費用の一部を補助します。",
    matchReasons: [
      "小規模事業者・個人事業主が主な対象です",
      "販路開拓・HP制作・店舗改装などに広く活用できます",
      "商工会・商工会議所の支援を受けながら申請できます",
    ],
    unmatchReasons: [
      "業種ごとに従業員数の上限あり（商業・サービス業は5名以下）",
      "大企業・中企業（中小企業者でない者）は対象外",
    ],
    recommendedFor: [
      "小売店・飲食店・美容室などの個人事業主",
      "初めて補助金申請を検討している小規模事業者",
      "ホームページ制作や広告費を補助したい事業者",
    ],
    notRecommendedFor: [
      "従業員数が業種別上限を超える事業者",
      "補助対象外の経費のみを予定している事業者",
    ],
    cautionPoints: [
      "交付決定前の発注・購入は補助対象外です",
      "補助事業終了後に実績報告が必要です",
      "採択されても全額補助ではなく、補助率の範囲で支給されます",
    ],
    nextActions: [
      "地域の商工会・商工会議所に相談する",
      "経営計画書・補助事業計画書を作成する",
      "公募要領を確認し締切に余裕を持って申請する",
    ],
    notes: [
      "当サイトの情報は参考情報です。申請前に必ず公式公募要領をご確認ください",
    ],
    nextSteps: ["地域の商工会・商工会議所に相談する", "経営計画書を作成する", "公募要領の締切を確認する"],
    keywords: ["持続化補助金", "小規模事業者", "販路開拓", "HP制作", "店舗改装", "個人事業主"],
    weight: 10,
  },

  // ② IT導入補助金
  {
    id: "it-hojokin",
    name: "IT導入補助金（デジタル化基盤導入枠）",
    shortName: "IT導入補助金",
    emoji: "💻",
    category: "補助金",
    type: "subsidy",
    provider: "中小企業庁",
    sourceLabel: "中小企業庁・IT導入補助金事務局",
    sourceUrl: "https://it-shien.smrj.go.jp/",
    officialUrl: "https://it-shien.smrj.go.jp/",
    status: "随時受付",
    statusCode: "open",
    deadline: "2026年度も公募予定。締切は公式サイトで最新をご確認ください",
    deadlineNote: "ITベンダーと共同申請が必要です。余裕を持って準備してください",
    updatedAt: "2026-08-15",
    lastCheckedAt: "2026-08-15",
    targetBusinessTypes: ["法人", "個人事業主"],
    targetIndustries: "all",
    targetEmployeeCounts: ["0人", "1〜5人", "6〜20人", "21〜50人", "51人以上"],
    targetPurposes: ["IT導入", "AI導入", "省力化"],
    targetAreas: "all",
    requiresHiring: false,
    requiresWageIncrease: false,
    targetBusinessTypeCodes: ["corporation", "sole_proprietor"],
    targetRegions: "all",
    maxSubsidy: "枠により異なります。最大数百万円（公募要領をご確認ください）",
    subsidyRate: "1/2〜3/4（枠・ツールにより異なります）",
    eligibleExpenses: ["ソフトウェア費", "クラウド利用料", "導入関連費（一部）"],
    usagePurposes: ["会計・受発注・決済ソフト", "インボイス対応システム", "業務効率化ツール", "AI・自動化ツール"],
    difficulty: "中",
    adoptionRateNote: "枠により異なります（公式サイト参照）",
    preparationWeeks: "2〜4週間",
    requiredDocuments: ["gBizIDプライム", "SECURITY ACTION宣言", "ITツール見積書", "申請書類一式"],
    description: "業務効率化・DX推進を目的としたITツール導入を支援。インボイス対応や会計ソフト導入にも活用できます。",
    matchReasons: [
      "IT・AI導入を検討している事業者が対象です",
      "インボイス対応・業務効率化ツールに幅広く活用できます",
      "中小企業・小規模事業者・個人事業主が対象です",
    ],
    unmatchReasons: [
      "IT導入支援事業者登録済みのツールのみ対象です",
      "汎用品（PC・スマートフォン単体など）は対象外です",
      "大企業は対象外です",
    ],
    recommendedFor: [
      "会計・受発注・在庫管理ソフトを導入したい事業者",
      "インボイス制度対応が必要な事業者",
      "業務のデジタル化・自動化を進めたい事業者",
    ],
    notRecommendedFor: [
      "カタログ未掲載ツールの導入のみを希望する事業者",
      "汎用ハードウェアのみ購入したい事業者",
    ],
    cautionPoints: [
      "IT導入支援事業者（ベンダー）との共同申請が必須です",
      "交付決定前の発注・契約は補助対象外です",
      "gBizIDプライムの取得に1〜2週間かかる場合があります",
    ],
    nextActions: [
      "IT導入支援事業者（ベンダー）に相談する",
      "gBizIDプライムを取得する（申請に必須）",
      "SECURITY ACTION宣言を行う",
    ],
    notes: ["当サイトの情報は参考情報です。申請前に公式サイトまたは専門家へご確認ください"],
    nextSteps: ["IT導入支援事業者に相談する", "gBizIDプライムを取得する", "SECURITY ACTION宣言を行う"],
    keywords: ["IT導入補助金", "ITツール", "DX", "インボイス", "業務効率化", "AI", "ソフトウェア"],
    weight: 10,
  },

  // ③ ものづくり補助金
  {
    id: "monodukuri",
    name: "ものづくり・商業・サービス生産性向上促進補助金",
    shortName: "ものづくり補助金",
    emoji: "🏭",
    category: "補助金",
    type: "subsidy",
    provider: "中小企業庁",
    sourceLabel: "中小企業庁・全国中小企業団体中央会",
    sourceUrl: "https://portal.monodukuri-hojo.jp/",
    officialUrl: "https://portal.monodukuri-hojo.jp/",
    status: "随時受付",
    statusCode: "open",
    deadline: "2026年度も公募予定。公募回ごとに締切が異なります（公式サイト確認）",
    deadlineNote: "毎年複数回公募があります。最新の公募回を公式サイトでご確認ください",
    updatedAt: "2026-08-15",
    lastCheckedAt: "2026-08-15",
    targetBusinessTypes: ["法人", "個人事業主"],
    targetIndustries: "all",
    targetEmployeeCounts: ["0人", "1〜5人", "6〜20人", "21〜50人", "51人以上"],
    targetPurposes: ["設備投資", "IT導入", "AI導入", "省力化", "新規事業", "研究開発"],
    targetAreas: "all",
    requiresHiring: false,
    requiresWageIncrease: false,
    targetBusinessTypeCodes: ["corporation", "sole_proprietor"],
    targetRegions: "all",
    maxSubsidy: "通常枠で最大750万円〜（枠・規模・要件により異なります）",
    subsidyRate: "1/2〜2/3（枠・従業員数・条件により異なります）",
    eligibleExpenses: ["機械装置・システム構築費", "技術導入費", "専門家経費", "運搬費", "クラウドサービス利用費", "原材料費（一部）", "外注費", "知的財産権等関連経費"],
    usagePurposes: ["生産設備の導入・更新", "生産プロセスの改善", "新サービス・新商品開発", "DX推進"],
    difficulty: "難",
    adoptionRateNote: "公募回・枠により異なります（公式発表値を参照）",
    preparationWeeks: "6〜12週間",
    requiredDocuments: ["事業計画書", "賃金引上げ計画書", "決算書（直近2期分）", "見積書", "gBizIDプライム"],
    description: "中小企業・小規模事業者が生産性向上や新サービス開発のために行う設備投資・システム構築等を支援します。",
    matchReasons: [
      "製造業・サービス業の設備投資・システム導入に対応しています",
      "新商品・新サービスの開発にも活用できます",
      "比較的高額な設備投資に向いています",
    ],
    unmatchReasons: [
      "事業計画書の作成が必要で、準備に時間がかかります",
      "賃金引上げ要件があり、賃上げ計画が必要です",
      "大企業は対象外です",
    ],
    recommendedFor: [
      "製造業・加工業で設備の更新・新規導入を検討している中小企業",
      "新商品・新サービス開発に投資したい事業者",
      "生産性向上のためのシステム導入を検討している事業者",
    ],
    notRecommendedFor: [
      "小規模な販売促進費のみを検討している事業者",
      "事業計画書の作成が難しい事業者（専門家支援を検討してください）",
    ],
    cautionPoints: [
      "採択後も要件（賃金引上げ等）を満たさないと補助金返還の可能性があります",
      "交付決定前の設備発注は対象外です",
      "事業計画書の質が採択に大きく影響します",
    ],
    nextActions: [
      "認定経営革新等支援機関（認定支援機関）に相談する",
      "事業計画書を作成する",
      "公募要領で最新の申請条件を確認する",
    ],
    notes: ["当サイトの情報は参考情報です。申請前に公式公募要領または認定支援機関へご確認ください"],
    nextSteps: ["認定支援機関に相談する", "事業計画書を作成する", "最新公募要領を確認する"],
    keywords: ["ものづくり補助金", "設備投資", "生産性向上", "新商品開発", "中小企業", "DX"],
    weight: 9,
  },

  // ④ 中小企業省力化投資補助金
  {
    id: "sannyu-hojokin",
    name: "中小企業省力化投資補助金",
    shortName: "省力化補助金",
    emoji: "🤖",
    category: "補助金",
    type: "subsidy",
    provider: "中小企業庁",
    sourceLabel: "中小企業庁・中小機構",
    sourceUrl: "https://shoryokuka.smrj.go.jp/",
    officialUrl: "https://shoryokuka.smrj.go.jp/",
    status: "随時受付",
    statusCode: "open",
    deadline: "随時公募（カタログ型・予算枯渇次第終了）。最新は公式サイトで確認",
    deadlineNote: "公式カタログに掲載されている製品のみ対象です。予算上限に達すると終了します",
    updatedAt: "2026-08-15",
    lastCheckedAt: "2026-08-15",
    targetBusinessTypes: ["法人", "個人事業主"],
    targetIndustries: "all",
    targetEmployeeCounts: ["0人", "1〜5人", "6〜20人", "21〜50人", "51人以上"],
    targetPurposes: ["省力化", "設備投資", "AI導入"],
    targetAreas: "all",
    requiresHiring: false,
    requiresWageIncrease: false,
    targetBusinessTypeCodes: ["corporation", "sole_proprietor"],
    targetRegions: "all",
    maxSubsidy: "企業規模・従業員数により異なります（公募要領をご確認ください）",
    subsidyRate: "1/2（小規模事業者は2/3）",
    eligibleExpenses: ["カタログ掲載製品（省力化設備・機器）"],
    usagePurposes: ["省力化設備の導入", "自動化機器の導入", "ロボット導入", "IoT機器"],
    difficulty: "易",
    adoptionRateNote: "カタログ型のため要件充足で採択率が高い傾向",
    preparationWeeks: "1〜3週間",
    requiredDocuments: ["gBizIDプライム", "カタログ掲載製品の見積書", "申請書類"],
    description: "人手不足に悩む中小企業向け。ロボット・IoT機器などカタログ掲載製品の省力化投資を支援します。",
    matchReasons: [
      "人手不足解消・省力化投資を検討している事業者が対象です",
      "カタログから製品を選ぶだけの簡便な申請方式です",
      "小規模事業者は補助率が高くなります",
    ],
    unmatchReasons: [
      "カタログ掲載外の製品は対象外です",
      "建物・土地は対象外です",
      "大企業は対象外です",
    ],
    recommendedFor: [
      "人手不足で業務自動化を検討している中小企業",
      "特定の省力化設備（ロボット・IoT等）の導入を検討している事業者",
    ],
    notRecommendedFor: [
      "カタログ掲載外の機械・設備のみ導入したい事業者",
    ],
    cautionPoints: [
      "交付決定前の発注・購入は補助対象外です",
      "補助事業完了後に実績・効果報告が必要です",
      "予算状況により公募が終了することがあります",
    ],
    nextActions: [
      "公式カタログで対象製品を確認する",
      "gBizIDプライムを取得する",
      "販売代理店・メーカーに相談する",
    ],
    notes: ["当サイトの情報は参考情報です。公式公募要領の確認が必要です"],
    nextSteps: ["公式カタログを確認する", "gBizIDを取得する", "メーカーに相談する"],
    keywords: ["省力化補助金", "ロボット", "IoT", "人手不足", "自動化", "省人化"],
    weight: 8,
  },

  // ⑤ 新事業進出補助金
  {
    id: "shinjigyo-shinsyutsu",
    name: "新事業進出補助金（新市場開拓型）",
    shortName: "新事業進出補助金",
    emoji: "🚀",
    category: "補助金",
    type: "subsidy",
    provider: "中小企業庁",
    sourceLabel: "中小企業庁",
    sourceUrl: "https://www.chusho.meti.go.jp/",
    officialUrl: "https://www.chusho.meti.go.jp/",
    status: "不明",
    statusCode: "unknown",
    deadline: "公募時期は公式サイトをご確認ください",
    deadlineNote: "制度内容・公募スケジュールは公式サイトで最新情報をご確認ください",
    updatedAt: "2026-08-15",
    lastCheckedAt: "2026-08-15",
    targetBusinessTypes: ["法人", "個人事業主"],
    targetIndustries: "all",
    targetEmployeeCounts: ["1〜5人", "6〜20人", "21〜50人", "51人以上"],
    targetPurposes: ["新規事業", "設備投資", "海外展開"],
    targetAreas: "all",
    requiresHiring: false,
    requiresWageIncrease: false,
    targetBusinessTypeCodes: ["corporation", "sole_proprietor"],
    targetRegions: "all",
    maxSubsidy: "公募要領による（公式サイトをご確認ください）",
    subsidyRate: "公募要領による",
    eligibleExpenses: ["設備投資費", "外注費", "専門家費", "市場調査費"],
    usagePurposes: ["新市場への進出", "新事業立ち上げ", "設備投資"],
    difficulty: "難",
    adoptionRateNote: "公式発表値をご確認ください",
    preparationWeeks: "6〜10週間",
    requiredDocuments: ["事業計画書", "財務諸表", "認定支援機関の確認書"],
    description: "中小企業が新市場・新分野への進出を図るための投資を支援する補助金です（制度詳細は公式で確認）。",
    matchReasons: [
      "新規事業・新市場への進出を検討している中小企業が対象の可能性があります",
    ],
    unmatchReasons: [
      "既存事業の継続的改善のみでは対象外の可能性があります",
      "大企業は対象外です",
    ],
    recommendedFor: [
      "既存事業から新分野への展開を検討している中小企業",
      "新市場開拓に向けた設備投資を検討している事業者",
    ],
    notRecommendedFor: [
      "既存事業の維持・継続のみを目的とする投資を検討している事業者",
    ],
    cautionPoints: [
      "公募時期・要件は年度により変更される場合があります",
      "必ず最新の公募要領を確認してから申請準備を始めてください",
    ],
    nextActions: [
      "中小企業庁の公式サイトで最新公募情報を確認する",
      "認定支援機関に相談する",
    ],
    notes: ["当サイトの情報は参考情報です。必ず公式公募要領をご確認ください"],
    nextSteps: ["中小企業庁の公式サイトを確認する", "認定支援機関に相談する"],
    keywords: ["新事業", "新市場", "新分野", "中小企業", "事業拡大"],
    weight: 5,
  },

  // ⑥ 事業承継・引継ぎ補助金
  {
    id: "jigyoshokeisokusen",
    name: "事業承継・引継ぎ補助金",
    shortName: "事業承継補助金",
    emoji: "🤝",
    category: "補助金",
    type: "subsidy",
    provider: "中小企業庁",
    sourceLabel: "中小企業庁・事業承継引継ぎ支援センター",
    sourceUrl: "https://jigyo-shoukei.jp/",
    officialUrl: "https://jigyo-shoukei.jp/",
    status: "随時受付",
    statusCode: "open",
    deadline: "2026年度も公募予定。公募スケジュールは公式サイトを参照",
    deadlineNote: "年複数回の公募が予定されています。最新の公募回を公式サイトでご確認ください",
    updatedAt: "2026-08-15",
    lastCheckedAt: "2026-08-15",
    targetBusinessTypes: ["法人", "個人事業主"],
    targetIndustries: "all",
    targetEmployeeCounts: ["0人", "1〜5人", "6〜20人", "21〜50人", "51人以上"],
    targetPurposes: ["事業承継"],
    targetAreas: "all",
    requiresHiring: false,
    requiresWageIncrease: false,
    targetBusinessTypeCodes: ["corporation", "sole_proprietor"],
    targetRegions: "all",
    maxSubsidy: "枠・条件により異なります（公募要領をご確認ください）",
    subsidyRate: "2/3（枠により異なる場合があります）",
    eligibleExpenses: ["M&A費用", "専門家活用費（FA・デューデリジェンス等）", "廃業費用", "設備投資"],
    usagePurposes: ["M&A費用", "専門家活用", "廃業費用", "後継者への事業引継ぎ"],
    difficulty: "難",
    adoptionRateNote: "枠・審査内容により変動（公式サイト参照）",
    preparationWeeks: "4〜8週間",
    requiredDocuments: ["事業承継計画書", "財務諸表", "M&A支援機関の関与証明（専門家活用型）"],
    description: "後継者不在の中小企業が承継・M&Aを行う際の費用を補助。専門家費用・廃業費用なども対象です。",
    matchReasons: [
      "事業承継・M&Aを検討している中小企業が対象です",
      "M&A仲介・アドバイザリー費用に活用できます",
    ],
    unmatchReasons: [
      "大企業・上場企業は対象外です",
      "後継者が決定し既に承継完了している場合は対象外の可能性があります",
    ],
    recommendedFor: [
      "後継者不在で事業承継を検討している中小企業",
      "M&Aによる第三者承継を検討している事業者",
    ],
    notRecommendedFor: [
      "事業承継を全く予定していない事業者",
    ],
    cautionPoints: [
      "補助対象経費は枠により異なります",
      "承継の計画書作成が必要です",
    ],
    nextActions: [
      "事業引継ぎ支援センターに相談する（無料）",
      "M&A支援機関登録業者に相談する",
      "公募要領で枠を確認する",
    ],
    notes: ["当サイトの情報は参考情報です。申請可否は公式公募要領をご確認ください"],
    nextSteps: ["事業引継ぎ支援センターに相談する", "M&A支援機関に相談する", "公募要領を確認する"],
    keywords: ["事業承継補助金", "M&A", "後継者", "第三者承継", "廃業"],
    weight: 6,
  },

  // ⑦ 成長型中小企業等研究開発支援事業
  {
    id: "kenkyukaihatsu",
    name: "成長型中小企業等研究開発支援事業（Go-Tech事業）",
    shortName: "Go-Tech事業",
    emoji: "🔬",
    category: "補助金",
    type: "subsidy",
    provider: "中小企業庁",
    sourceLabel: "中小企業庁・NEDO",
    sourceUrl: "https://www.chusho.meti.go.jp/",
    officialUrl: "https://www.chusho.meti.go.jp/",
    status: "不明",
    statusCode: "unknown",
    deadline: "公募時期は公式サイトをご確認ください",
    deadlineNote: "年1〜2回程度の公募が行われています",
    updatedAt: "2026-08-15",
    lastCheckedAt: "2026-08-15",
    targetBusinessTypes: ["法人"],
    targetIndustries: ["IT", "製造", "医療・介護", "その他"],
    targetEmployeeCounts: ["1〜5人", "6〜20人", "21〜50人", "51人以上"],
    targetPurposes: ["研究開発", "新規事業"],
    targetAreas: "all",
    requiresHiring: false,
    requiresWageIncrease: false,
    targetBusinessTypeCodes: ["corporation"],
    targetRegions: "all",
    maxSubsidy: "単独型と連携型で異なります（公募要領をご確認ください）",
    subsidyRate: "2/3（条件により異なります）",
    eligibleExpenses: ["研究開発費（人件費・外注費・設備費等）"],
    usagePurposes: ["技術開発", "新商品・新サービスの研究開発"],
    difficulty: "難",
    adoptionRateNote: "公募回・連携形態により異なります",
    preparationWeeks: "8〜16週間",
    requiredDocuments: ["研究開発計画書", "財務諸表", "大学等の連携機関との協定書（連携型）"],
    description: "大学・研究機関等と連携して革新的な研究開発を行う中小企業を支援します。",
    matchReasons: [
      "大学・研究機関と連携した研究開発を検討している企業が対象です",
      "新技術・新製品開発への大規模な投資に活用できます",
    ],
    unmatchReasons: [
      "個人事業主・創業予定は対象外の場合があります",
      "既存技術の単純な導入は対象外になる可能性があります",
    ],
    recommendedFor: [
      "大学・研究機関と連携した革新的な技術開発を行う中小企業",
    ],
    notRecommendedFor: [
      "研究開発を伴わない事業者",
      "個人事業主（要件を公式で確認）",
    ],
    cautionPoints: [
      "審査が非常に厳しく、高度な研究開発計画が必要です",
      "連携機関との調整に時間がかかります",
    ],
    nextActions: [
      "中小企業庁の公式サイトで最新公募情報を確認する",
      "連携する大学・研究機関に相談する",
      "認定支援機関に相談する",
    ],
    notes: ["当サイトの情報は参考情報です。申請前に必ず公式公募要領をご確認ください"],
    nextSteps: ["公式サイトで公募情報を確認する", "大学等の連携機関に相談する"],
    keywords: ["研究開発", "Go-Tech", "大学連携", "技術開発", "中小企業"],
    weight: 4,
  },

  // ⑧ 地域雇用開発助成金
  {
    id: "chiiki-koyo",
    name: "地域雇用開発助成金",
    shortName: "地域雇用開発助成金",
    emoji: "🏘️",
    category: "助成金",
    type: "grant",
    provider: "厚生労働省",
    sourceLabel: "厚生労働省・ハローワーク",
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/chiikikoyo.html",
    officialUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/chiikikoyo.html",
    status: "随時受付",
    statusCode: "open",
    deadline: "随時受付（ハローワークへ申請）",
    deadlineNote: "雇入れ前にハローワークへ計画書の提出が必要です",
    updatedAt: "2026-08-15",
    lastCheckedAt: "2026-08-15",
    targetBusinessTypes: ["法人", "個人事業主"],
    targetIndustries: "all",
    targetEmployeeCounts: ["1〜5人", "6〜20人", "21〜50人", "51人以上"],
    targetPurposes: ["採用"],
    targetAreas: "all",
    requiresHiring: true,
    requiresWageIncrease: false,
    targetBusinessTypeCodes: ["corporation", "sole_proprietor"],
    targetRegions: "all",
    maxSubsidy: "雇入れ人数・地域・条件により異なります（公式を確認）",
    subsidyRate: "定額支給（条件により異なります）",
    eligibleExpenses: ["雇用保険適用労働者の雇入れに係る経費（設備投資等）"],
    usagePurposes: ["雇用機会が少ない地域での採用・設備投資"],
    difficulty: "中",
    adoptionRateNote: "要件充足で原則支給（助成金のため競争なし）",
    preparationWeeks: "2〜4週間",
    requiredDocuments: ["雇用計画書", "設備投資計画書", "雇用保険被保険者資格取得等確認通知書"],
    description: "雇用機会が少ない地域で事業所設置・整備を行い、地域求職者を雇用した事業主を支援します。",
    matchReasons: [
      "雇用機会の少ない地域で採用予定がある事業者が対象の可能性があります",
      "設備投資と組み合わせて活用できます",
    ],
    unmatchReasons: [
      "対象地域（同意雇用開発促進地域等）に該当しない場合は対象外です",
      "採用予定がない場合は対象外です",
    ],
    recommendedFor: [
      "地方・過疎地域での採用・設備投資を検討している事業者",
    ],
    notRecommendedFor: [
      "都市部（対象外地域）での採用のみを検討している事業者",
    ],
    cautionPoints: [
      "対象地域の指定があります（ハローワークへ確認）",
      "雇入れ前の計画書提出が必要です",
    ],
    nextActions: [
      "ハローワークで対象地域か確認する",
      "雇用計画書を作成しハローワークに相談する",
    ],
    notes: ["当サイトの情報は参考情報です。申請前にハローワークへご確認ください"],
    nextSteps: ["ハローワークで対象地域を確認する", "雇用計画書を作成する"],
    keywords: ["地域雇用", "助成金", "採用", "地方", "ハローワーク"],
    weight: 5,
  },

  // ⑨ 業務改善助成金
  {
    id: "gyomukaizen",
    name: "業務改善助成金",
    shortName: "業務改善助成金",
    emoji: "📈",
    category: "助成金",
    type: "grant",
    provider: "厚生労働省",
    sourceLabel: "厚生労働省",
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/zigyonushi/shienjigyou/02.html",
    officialUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/zigyonushi/shienjigyou/02.html",
    status: "随時受付",
    statusCode: "open",
    deadline: "随時受付（予算終了次第締切）",
    deadlineNote: "都道府県の労働局へ申請。予算状況を事前に確認してください",
    updatedAt: "2026-08-15",
    lastCheckedAt: "2026-08-15",
    targetBusinessTypes: ["法人", "個人事業主"],
    targetIndustries: "all",
    targetEmployeeCounts: ["1〜5人", "6〜20人", "21〜50人", "51人以上"],
    targetPurposes: ["賃上げ", "省力化", "設備投資"],
    targetAreas: "all",
    requiresHiring: false,
    requiresWageIncrease: true,
    targetBusinessTypeCodes: ["corporation", "sole_proprietor"],
    targetRegions: "all",
    maxSubsidy: "賃上げ額・コースにより異なります（公募要領をご確認ください）",
    subsidyRate: "4/5〜9/10（地域・規模・コースにより異なります）",
    eligibleExpenses: ["生産性向上設備", "業務改善に伴う機器・ツール導入", "コンサルティング（一部）"],
    usagePurposes: ["生産性向上設備導入", "業務改善機器の導入"],
    difficulty: "中",
    adoptionRateNote: "要件充足で原則支給（助成金のため競争なし）",
    preparationWeeks: "2〜4週間",
    requiredDocuments: ["交付申請書", "賃金引上げ計画書", "設備等の見積書", "賃金台帳（直近3ヶ月）"],
    description: "中小企業が最低賃金を引き上げ、生産性向上の設備投資等を行う場合に費用の一部を助成します。",
    matchReasons: [
      "賃上げを予定している事業者が対象です",
      "設備投資しながら最低賃金を引き上げる事業者向けです",
      "補助率が最大9/10と非常に高いコースがあります",
    ],
    unmatchReasons: [
      "賃上げを行わない場合は対象外です",
      "従業員を雇用していない場合は対象外です",
    ],
    recommendedFor: [
      "最低賃金引上げと合わせて設備投資を検討している事業者",
    ],
    notRecommendedFor: [
      "賃上げ予定がない事業者",
      "従業員を雇用していない個人事業主",
    ],
    cautionPoints: [
      "設備・機器の発注前に交付申請が必要です",
      "賃金台帳等の書類整備が必要です",
    ],
    nextActions: [
      "都道府県の労働局・ハローワークに相談する",
      "賃上げ計画と設備投資計画を策定する",
      "設備発注前に申請する",
    ],
    notes: ["当サイトの情報は参考情報です。申請前に労働局または社労士へご確認ください"],
    nextSteps: ["労働局・ハローワークに相談する", "賃上げ・設備計画を策定する", "発注前に申請する"],
    keywords: ["業務改善助成金", "賃上げ", "最低賃金", "設備投資", "厚生労働省"],
    weight: 8,
  },

  // ⑩ キャリアアップ助成金
  {
    id: "career-up",
    name: "キャリアアップ助成金",
    shortName: "キャリアアップ助成金",
    emoji: "👥",
    category: "助成金",
    type: "grant",
    provider: "厚生労働省",
    sourceLabel: "厚生労働省",
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/part_haken/jigyounushi/career.html",
    officialUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/part_haken/jigyounushi/career.html",
    status: "随時受付",
    statusCode: "open",
    deadline: "随時受付",
    deadlineNote: "コースごとに申請タイミングが異なります。計画届の提出が先に必要です",
    updatedAt: "2026-08-15",
    lastCheckedAt: "2026-08-15",
    targetBusinessTypes: ["法人", "個人事業主"],
    targetIndustries: "all",
    targetEmployeeCounts: ["1〜5人", "6〜20人", "21〜50人", "51人以上"],
    targetPurposes: ["採用", "賃上げ"],
    targetAreas: "all",
    requiresHiring: true,
    requiresWageIncrease: false,
    targetBusinessTypeCodes: ["corporation", "sole_proprietor"],
    targetRegions: "all",
    maxSubsidy: "コース・雇入れ人数により異なります（公式を確認）",
    subsidyRate: "定額支給（コースにより異なります）",
    eligibleExpenses: ["該当なし（定額支給）"],
    usagePurposes: ["非正規→正社員化", "賞与・退職金制度の導入", "短時間正社員制度"],
    difficulty: "中",
    adoptionRateNote: "要件充足で原則支給（助成金のため競争なし）",
    preparationWeeks: "2〜6週間",
    requiredDocuments: ["キャリアアップ計画書", "就業規則", "雇用契約書", "賃金台帳"],
    description: "非正規雇用労働者の正社員化・待遇改善を行った事業主に定額の助成金を支給します。",
    matchReasons: [
      "非正規労働者を雇用している事業主が対象です",
      "正社員化・待遇改善で定額の助成金を受け取れます",
      "中小企業は助成額が上乗せされます",
    ],
    unmatchReasons: [
      "実施前にキャリアアップ計画の届出が必要です",
      "雇用保険適用事業主であることが必要です",
    ],
    recommendedFor: [
      "パート・アルバイトの正社員化を検討している事業者",
      "処遇改善・待遇見直しを検討している事業者",
    ],
    notRecommendedFor: [
      "正規雇用のみで非正規労働者がいない事業者",
    ],
    cautionPoints: [
      "実施前にキャリアアップ計画の届出が必須です",
      "申請は実施後6ヶ月以内が目安です",
    ],
    nextActions: [
      "ハローワークに「キャリアアップ計画書」を提出する（実施前）",
      "対象コースを選ぶ",
      "正社員化・処遇改善を実施してから申請する",
    ],
    notes: ["当サイトの情報は参考情報です。申請前にハローワークまたは社労士へご確認ください"],
    nextSteps: ["ハローワークにキャリアアップ計画書を提出する", "正社員化を実施する", "申請する"],
    keywords: ["キャリアアップ助成金", "正社員化", "非正規", "処遇改善", "厚生労働省"],
    weight: 8,
  },

  // ⑪ 人材開発支援助成金
  {
    id: "jinzai-kaihatsu",
    name: "人材開発支援助成金",
    shortName: "人材開発支援助成金",
    emoji: "📚",
    category: "助成金",
    type: "grant",
    provider: "厚生労働省",
    sourceLabel: "厚生労働省",
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/d01-1.html",
    officialUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/d01-1.html",
    status: "随時受付",
    statusCode: "open",
    deadline: "随時受付（訓練開始日の前日までに申請）",
    deadlineNote: "訓練開始日の前日までに申請が必要です（遡って申請不可）",
    updatedAt: "2026-08-15",
    lastCheckedAt: "2026-08-15",
    targetBusinessTypes: ["法人", "個人事業主"],
    targetIndustries: "all",
    targetEmployeeCounts: ["1〜5人", "6〜20人", "21〜50人", "51人以上"],
    targetPurposes: ["研修", "採用"],
    targetAreas: "all",
    requiresHiring: true,
    requiresWageIncrease: false,
    targetBusinessTypeCodes: ["corporation", "sole_proprietor"],
    targetRegions: "all",
    maxSubsidy: "訓練経費・賃金助成あり（コース・規模により異なります）",
    subsidyRate: "45〜75%（中小企業・コースによる）＋賃金助成",
    eligibleExpenses: ["訓練経費（受講料等）"],
    usagePurposes: ["OJT訓練", "外部研修（OFF-JT）", "資格取得支援", "デジタル人材育成"],
    difficulty: "中",
    adoptionRateNote: "要件充足で原則支給（助成金のため競争なし）",
    preparationWeeks: "1〜3週間",
    requiredDocuments: ["訓練計画書", "出席簿", "賃金台帳", "受講証明書（訓練後）"],
    description: "従業員の職業訓練・スキルアップを支援する事業主に、訓練経費や賃金の一部を助成します。",
    matchReasons: [
      "従業員の研修・スキルアップを行う事業主が対象です",
      "外部研修費用の45〜75%が助成されます",
      "訓練中の賃金も一部助成されます",
    ],
    unmatchReasons: [
      "訓練開始前の申請が必須です（遡って申請不可）",
      "役員・事業主本人は対象外です",
    ],
    recommendedFor: [
      "従業員に外部研修を受けさせたい事業者",
      "デジタル人材育成・資格取得を支援したい事業者",
    ],
    notRecommendedFor: [
      "自社の役員・事業主本人のみのスキルアップを検討している方",
    ],
    cautionPoints: [
      "訓練開始前の申請が必須です",
      "訓練記録・出席簿の整備が必要です",
    ],
    nextActions: [
      "ハローワークへ「訓練計画届」を提出する（訓練前）",
      "訓練を実施する",
      "訓練終了後に支給申請を行う",
    ],
    notes: ["当サイトの情報は参考情報です。申請前にハローワークまたは社労士へご確認ください"],
    nextSteps: ["ハローワークへ訓練計画届を提出する", "訓練を実施する", "訓練後に申請する"],
    keywords: ["人材開発", "研修助成金", "OJT", "スキルアップ", "資格取得", "厚生労働省"],
    weight: 7,
  },

  // ⑫ 雇用調整助成金
  {
    id: "koyo-chosei",
    name: "雇用調整助成金",
    shortName: "雇調金",
    emoji: "🛡️",
    category: "助成金",
    type: "grant",
    provider: "厚生労働省",
    sourceLabel: "厚生労働省",
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/pageL07.html",
    officialUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/pageL07.html",
    status: "随時受付",
    statusCode: "open",
    deadline: "随時受付",
    deadlineNote: "経済状況により助成内容が変更される場合があります。最新情報を確認してください",
    updatedAt: "2026-08-15",
    lastCheckedAt: "2026-08-15",
    targetBusinessTypes: ["法人", "個人事業主"],
    targetIndustries: "all",
    targetEmployeeCounts: ["1〜5人", "6〜20人", "21〜50人", "51人以上"],
    targetPurposes: ["採用"],
    targetAreas: "all",
    requiresHiring: true,
    requiresWageIncrease: false,
    targetBusinessTypeCodes: ["corporation", "sole_proprietor"],
    targetRegions: "all",
    maxSubsidy: "休業等の状況・雇用保険料率等により異なります（公式を確認）",
    subsidyRate: "休業手当等の一部（条件・時期により異なります）",
    eligibleExpenses: ["休業手当・賃金（一部）"],
    usagePurposes: ["一時的な業績悪化時の雇用維持"],
    difficulty: "中",
    adoptionRateNote: "要件充足で原則支給",
    preparationWeeks: "1〜3週間",
    requiredDocuments: ["休業等実施計画書", "賃金台帳", "出勤簿・タイムカード", "雇用保険適用事業所設置届"],
    description: "経済的な理由で事業活動の縮小を余儀なくされた事業主が、雇用維持のために行う休業等に助成します。",
    matchReasons: [
      "経済的理由による一時的な業績悪化で休業を検討している事業者が対象の可能性があります",
      "雇用維持を目的とした休業手当の一部が助成されます",
    ],
    unmatchReasons: [
      "雇用保険適用事業所でない場合は対象外です",
      "通常通りの事業活動が継続できている場合は対象外です",
    ],
    recommendedFor: [
      "一時的な業績悪化で従業員を休業させることを検討している事業者",
    ],
    notRecommendedFor: [
      "業績が安定しており雇用調整の必要がない事業者",
    ],
    cautionPoints: [
      "経済情勢により助成内容・特例が変わることがあります",
      "不正受給は返還・加算金の対象です",
    ],
    nextActions: [
      "都道府県の労働局・ハローワークに相談する",
      "休業等実施計画書を提出する",
    ],
    notes: ["当サイトの情報は参考情報です。申請前に労働局へご確認ください"],
    nextSteps: ["労働局・ハローワークに相談する", "休業計画書を提出する"],
    keywords: ["雇用調整助成金", "雇調金", "休業", "雇用維持", "厚生労働省"],
    weight: 4,
  },

  // ⑬ トライアル雇用助成金
  {
    id: "trial-koyo",
    name: "トライアル雇用助成金（一般トライアルコース）",
    shortName: "トライアル雇用助成金",
    emoji: "🎯",
    category: "助成金",
    type: "grant",
    provider: "厚生労働省",
    sourceLabel: "厚生労働省・ハローワーク",
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/trial_koyo.html",
    officialUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/trial_koyo.html",
    status: "随時受付",
    statusCode: "open",
    deadline: "随時受付",
    deadlineNote: "ハローワーク経由で採用した場合のみ対象です",
    updatedAt: "2026-08-15",
    lastCheckedAt: "2026-08-15",
    targetBusinessTypes: ["法人", "個人事業主"],
    targetIndustries: "all",
    targetEmployeeCounts: ["0人", "1〜5人", "6〜20人", "21〜50人", "51人以上"],
    targetPurposes: ["採用"],
    targetAreas: "all",
    requiresHiring: true,
    requiresWageIncrease: false,
    targetBusinessTypeCodes: ["corporation", "sole_proprietor"],
    targetRegions: "all",
    maxSubsidy: "月額・雇入れ人数により異なります（公式を確認）",
    subsidyRate: "定額支給（条件により異なります）",
    eligibleExpenses: ["該当なし（定額支給）"],
    usagePurposes: ["就職困難者のトライアル雇用"],
    difficulty: "易",
    adoptionRateNote: "要件充足で原則支給",
    preparationWeeks: "1〜2週間",
    requiredDocuments: ["トライアル雇用実施計画書", "雇用契約書", "賃金台帳（支給申請時）"],
    description: "就職困難者をハローワーク経由でトライアル雇用した事業主に、期間中の賃金の一部を助成します。",
    matchReasons: [
      "ハローワーク経由で採用を検討している事業者が対象の可能性があります",
      "採用のミスマッチを防ぎながら助成金を受け取れます",
    ],
    unmatchReasons: [
      "ハローワーク経由以外の採用は対象外です",
      "対象外の求職者（条件に合わない方）は対象外です",
    ],
    recommendedFor: [
      "ハローワーク経由での採用を検討している事業者",
      "就職困難者の採用を検討している事業者",
    ],
    notRecommendedFor: [
      "ハローワーク経由以外の採用のみを検討している事業者",
    ],
    cautionPoints: [
      "ハローワークへの求人申込みが必要です",
      "トライアル期間中の実施計画書の提出が必要です",
    ],
    nextActions: [
      "ハローワークで求人を申し込む",
      "対象求職者を採用し、計画書を提出する",
    ],
    notes: ["当サイトの情報は参考情報です。申請前にハローワークへご確認ください"],
    nextSteps: ["ハローワークで求人を申し込む", "採用後に計画書を提出する"],
    keywords: ["トライアル雇用", "就職困難者", "採用", "ハローワーク", "厚生労働省"],
    weight: 5,
  },

  // ⑭ 特定求職者雇用開発助成金
  {
    id: "tokutei-kyushoku",
    name: "特定求職者雇用開発助成金（特定就職困難者コース）",
    shortName: "特定求職者雇用開発助成金",
    emoji: "🤲",
    category: "助成金",
    type: "grant",
    provider: "厚生労働省",
    sourceLabel: "厚生労働省・ハローワーク",
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/tokutei_k.html",
    officialUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/tokutei_k.html",
    status: "随時受付",
    statusCode: "open",
    deadline: "随時受付",
    deadlineNote: "ハローワーク経由で対象者を雇用した場合のみ対象です",
    updatedAt: "2026-08-15",
    lastCheckedAt: "2026-08-15",
    targetBusinessTypes: ["法人", "個人事業主"],
    targetIndustries: "all",
    targetEmployeeCounts: ["0人", "1〜5人", "6〜20人", "21〜50人", "51人以上"],
    targetPurposes: ["採用"],
    targetAreas: "all",
    requiresHiring: true,
    requiresWageIncrease: false,
    targetBusinessTypeCodes: ["corporation", "sole_proprietor"],
    targetRegions: "all",
    maxSubsidy: "対象者の属性・雇用形態により異なります（公式を確認）",
    subsidyRate: "定額支給（分割）",
    eligibleExpenses: ["該当なし（定額支給）"],
    usagePurposes: ["高齢者・障害者・母子家庭の母等の雇用"],
    difficulty: "易",
    adoptionRateNote: "要件充足で原則支給",
    preparationWeeks: "1〜2週間",
    requiredDocuments: ["支給申請書", "雇用契約書", "賃金台帳", "出勤簿"],
    description: "高齢者・障害者・母子家庭の母等、就職困難な方をハローワーク経由で雇用した事業主を支援します。",
    matchReasons: [
      "高齢者・障害者・母子家庭の母等の採用を検討している事業者が対象です",
    ],
    unmatchReasons: [
      "ハローワーク経由以外の採用は対象外です",
      "対象外の求職者を雇用した場合は対象外です",
    ],
    recommendedFor: [
      "高齢者・障害者等の雇用を積極的に推進したい事業者",
    ],
    notRecommendedFor: [
      "ハローワーク経由以外の採用のみを検討している事業者",
    ],
    cautionPoints: [
      "ハローワーク経由の採用が必須です",
      "対象者の属性（高齢者・障害者等）の確認が必要です",
    ],
    nextActions: [
      "ハローワークで求人を申し込む",
      "対象者を採用し、支給申請を行う",
    ],
    notes: ["当サイトの情報は参考情報です。申請前にハローワークへご確認ください"],
    nextSteps: ["ハローワークで求人を申し込む", "対象者採用後に申請する"],
    keywords: ["特定求職者雇用開発助成金", "高齢者採用", "障害者雇用", "母子家庭", "ハローワーク"],
    weight: 5,
  },

  // ⑮ 早期再就職支援等助成金
  {
    id: "souki-saishushoku",
    name: "早期再就職支援等助成金（雇入れ支援コース）",
    shortName: "早期再就職支援等助成金",
    emoji: "⚡",
    category: "助成金",
    type: "grant",
    provider: "厚生労働省",
    sourceLabel: "厚生労働省",
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/souki.html",
    officialUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/souki.html",
    status: "随時受付",
    statusCode: "open",
    deadline: "随時受付",
    deadlineNote: "制度内容が変更される場合があります。最新情報は公式サイトでご確認ください",
    updatedAt: "2026-08-15",
    lastCheckedAt: "2026-08-15",
    targetBusinessTypes: ["法人", "個人事業主"],
    targetIndustries: "all",
    targetEmployeeCounts: ["0人", "1〜5人", "6〜20人", "21〜50人", "51人以上"],
    targetPurposes: ["採用"],
    targetAreas: "all",
    requiresHiring: true,
    requiresWageIncrease: false,
    targetBusinessTypeCodes: ["corporation", "sole_proprietor"],
    targetRegions: "all",
    maxSubsidy: "条件により異なります（公式を確認）",
    subsidyRate: "定額支給（条件により異なります）",
    eligibleExpenses: ["該当なし（定額支給）"],
    usagePurposes: ["早期再就職者の雇用促進"],
    difficulty: "中",
    adoptionRateNote: "要件充足で原則支給",
    preparationWeeks: "1〜3週間",
    requiredDocuments: ["支給申請書", "雇用契約書", "賃金台帳"],
    description: "離職者を早期に雇い入れた事業主を支援する助成金です（詳細は公式で最新情報を確認）。",
    matchReasons: [
      "早期再就職が必要な求職者を採用した場合に対象になる可能性があります",
    ],
    unmatchReasons: [
      "対象外の採用条件の場合は対象外です",
    ],
    recommendedFor: [
      "採用を積極的に行っている事業者",
    ],
    notRecommendedFor: [
      "採用予定がない事業者",
    ],
    cautionPoints: [
      "制度内容は変更される場合があります",
      "必ず最新の公式情報を確認してから申請してください",
    ],
    nextActions: [
      "ハローワークで最新情報を確認する",
      "対象者を採用し、申請する",
    ],
    notes: ["当サイトの情報は参考情報です。申請前にハローワークへご確認ください"],
    nextSteps: ["ハローワークで最新情報を確認する", "採用後に申請する"],
    keywords: ["早期再就職", "雇入れ", "採用助成金", "厚生労働省"],
    weight: 4,
  },

  // ⑯ 両立支援等助成金
  {
    id: "ryoritsu-shien",
    name: "両立支援等助成金（出生時両立支援コース）",
    shortName: "両立支援等助成金",
    emoji: "👶",
    category: "助成金",
    type: "grant",
    provider: "厚生労働省",
    sourceLabel: "厚生労働省",
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/ryouritsu01.html",
    officialUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/ryouritsu01.html",
    status: "随時受付",
    statusCode: "open",
    deadline: "随時受付",
    deadlineNote: "コースにより申請タイミングが異なります",
    updatedAt: "2026-08-15",
    lastCheckedAt: "2026-08-15",
    targetBusinessTypes: ["法人", "個人事業主"],
    targetIndustries: "all",
    targetEmployeeCounts: ["1〜5人", "6〜20人", "21〜50人", "51人以上"],
    targetPurposes: ["採用", "研修"],
    targetAreas: "all",
    requiresHiring: true,
    requiresWageIncrease: false,
    targetBusinessTypeCodes: ["corporation", "sole_proprietor"],
    targetRegions: "all",
    maxSubsidy: "コース・条件により異なります（公式を確認）",
    subsidyRate: "定額支給（コースにより異なります）",
    eligibleExpenses: ["該当なし（定額支給）"],
    usagePurposes: ["育児休業取得促進", "仕事と育児の両立支援"],
    difficulty: "中",
    adoptionRateNote: "要件充足で原則支給",
    preparationWeeks: "2〜4週間",
    requiredDocuments: ["支給申請書", "育児休業取得確認書類", "就業規則"],
    description: "男性の育児休業取得等、仕事と家庭の両立を支援する取組を行った事業主を助成します。",
    matchReasons: [
      "従業員の育児休業取得を支援している事業者が対象の可能性があります",
    ],
    unmatchReasons: [
      "育児休業取得者がいない場合は対象外です",
    ],
    recommendedFor: [
      "男性育児休業の取得促進に取り組む事業者",
      "仕事と育児の両立支援制度を整備したい事業者",
    ],
    notRecommendedFor: [
      "従業員を雇用していない事業者",
    ],
    cautionPoints: [
      "就業規則等の整備が必要です",
      "コースごとに要件が異なります",
    ],
    nextActions: [
      "ハローワークまたは労働局に相談する",
      "就業規則・育児休業規程を整備する",
    ],
    notes: ["当サイトの情報は参考情報です。申請前に労働局または社労士へご確認ください"],
    nextSteps: ["労働局に相談する", "就業規則を整備する", "育休取得後に申請する"],
    keywords: ["両立支援", "育児休業", "男性育休", "仕事と育児", "厚生労働省"],
    weight: 5,
  },

  // ⑰ 働き方改革推進支援助成金
  {
    id: "hatarakikata-kaikaku",
    name: "働き方改革推進支援助成金",
    shortName: "働き方改革助成金",
    emoji: "⏰",
    category: "助成金",
    type: "grant",
    provider: "厚生労働省",
    sourceLabel: "厚生労働省",
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000148322.html",
    officialUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000148322.html",
    status: "受付中",
    statusCode: "open",
    deadline: "年度内（予算終了次第締切）",
    deadlineNote: "年度予算の範囲内での助成です。早めに申請してください",
    updatedAt: "2026-08-15",
    lastCheckedAt: "2026-08-15",
    targetBusinessTypes: ["法人", "個人事業主"],
    targetIndustries: "all",
    targetEmployeeCounts: ["1〜5人", "6〜20人", "21〜50人", "51人以上"],
    targetPurposes: ["省力化", "設備投資", "IT導入"],
    targetAreas: "all",
    requiresHiring: true,
    requiresWageIncrease: false,
    targetBusinessTypeCodes: ["corporation", "sole_proprietor"],
    targetRegions: "all",
    maxSubsidy: "コース・条件により異なります（公式を確認）",
    subsidyRate: "対象経費の一部（コースにより異なります）",
    eligibleExpenses: ["労務管理用ソフト", "タイムレコーダー", "就業規則作成費（一部）"],
    usagePurposes: ["時間外労働削減", "勤怠管理システム導入", "休暇取得促進"],
    difficulty: "中",
    adoptionRateNote: "コース・申請時期により異なります",
    preparationWeeks: "2〜5週間",
    requiredDocuments: ["交付申請書", "労働時間削減計画書", "就業規則", "見積書"],
    description: "長時間労働の削減・年次有給休暇の取得促進等の働き方改革に取り組む中小企業事業主を助成します。",
    matchReasons: [
      "長時間労働の削減・働き方改革に取り組む事業者が対象です",
      "勤怠管理システム等の導入費用に活用できます",
    ],
    unmatchReasons: [
      "働き方改革に関連しない取組は対象外です",
      "従業員を雇用していない事業者は対象外です",
    ],
    recommendedFor: [
      "勤怠管理システムの導入を検討している事業者",
      "長時間労働の削減・年休取得促進に取り組む事業者",
    ],
    notRecommendedFor: [
      "働き方改革に関連しない設備投資のみを検討している事業者",
    ],
    cautionPoints: [
      "コースごとに要件・対象経費が異なります",
      "年度内予算の範囲での助成です",
    ],
    nextActions: [
      "都道府県の労働局に相談する",
      "対象コースと要件を確認する",
      "交付申請書を提出する",
    ],
    notes: ["当サイトの情報は参考情報です。申請前に労働局または社労士へご確認ください"],
    nextSteps: ["労働局に相談する", "対象コースを確認する", "申請書を提出する"],
    keywords: ["働き方改革", "長時間労働削減", "勤怠管理", "有給休暇", "厚生労働省"],
    weight: 6,
  },
];

// ─── 締切日からステータスを毎回再計算（日本時間基準）─────────
// 手入力の status は古くなるため、受付開始日・締切日から
// 現在の状態を導出して上書きする。これにより締切超過の制度が
// 「受付中」のまま表示される事故を防ぐ（鮮度の自動担保）。
import { computeSubsidyStatus, mapToStatusCode } from "../lib/subsidy/status";

const SUBSIDIES_RAW: SubsidyData[] = [...SUBSIDIES_CORE, ...SUBSIDIES_EXTENDED, ...SUBSIDIES_INDIVIDUAL];

export const SUBSIDIES: SubsidyData[] = SUBSIDIES_RAW.map((s) => {
  const liveStatus = computeSubsidyStatus({
    storedStatus: s.status,
    applicationStartDate: s.applicationStartDate,
    applicationEndDate: s.applicationEndDate,
    rolling: s.status === "随時受付",
  });
  return { ...s, status: liveStatus, statusCode: mapToStatusCode(liveStatus) };
});

/** 派生ステータス適用前の生データ（履歴・検証用） */
export const SUBSIDIES_SOURCE: SubsidyData[] = SUBSIDIES_RAW;

// ─── 診断入力 ────────────────────────────────────────────
export interface DiagnosisInput {
  businessType: BusinessType;
  prefecture: string;
  city?: string;
  industry: Industry;
  employeeCount: EmployeeCount;
  purposes: Purpose[];
  investmentAmount: InvestmentAmount;
  hiringPlan: HiringPlan;
  wageIncreasePlan: WageIncreasePlan;
}

export interface DiagnosisResult {
  subsidy: SubsidyData;
  recommendLevel: RecommendLevel;
  score: number;
  matchedReasons: string[];
  unmatchReasons: string[];
}

// ─── 診断ロジック ─────────────────────────────────────────
export function diagnose(input: DiagnosisInput): DiagnosisResult[] {
  const results: DiagnosisResult[] = [];

  for (const subsidy of SUBSIDIES) {
    // 締切超過・公募終了の制度は診断結果に出さない（鮮度の自動担保）。
    // status は締切日から毎回再計算された派生値（lib/subsidy/status）。
    if (subsidy.status === "終了") continue;

    let score = 0;
    const matchedReasons: string[] = [];
    const unmatchReasons: string[] = [];

    // 個人・家庭向けの制度は、事業者向けの「業種・従業員数・事業目的」の質問で
    // 不利に採点しない（診断フローは事業者向けのため）。
    const isIndividualUser = input.businessType === "個人・家庭";

    if (subsidy.targetBusinessTypes.includes(input.businessType)) {
      score += 20;
    } else {
      unmatchReasons.push(`事業形態「${input.businessType}」は対象外の可能性があります`);
      score -= 30;
    }

    if (subsidy.targetEmployeeCounts.includes(input.employeeCount)) {
      score += 15;
      matchedReasons.push("従業員規模が対象範囲内の可能性があります");
    } else if (!isIndividualUser) {
      unmatchReasons.push(`従業員数「${input.employeeCount}」は対象外の可能性があります`);
      score -= 20;
    }

    const matchedPurposes = input.purposes.filter((p) => subsidy.targetPurposes.includes(p));
    if (matchedPurposes.length > 0) {
      score += matchedPurposes.length * 15;
      matchedReasons.push(`「${matchedPurposes.join("・")}」の目的に合致する可能性があります`);
    } else if (!isIndividualUser) {
      unmatchReasons.push("選択した目的が補助対象に合わない可能性があります");
      score -= 10;
    }

    if (subsidy.targetIndustries === "all" || subsidy.targetIndustries.includes(input.industry)) {
      score += 10;
    }

    if (subsidy.requiresHiring && input.hiringPlan === "なし") {
      unmatchReasons.push("雇用予定がないと対象外の可能性があります");
      score -= 15;
    }
    if (subsidy.requiresWageIncrease && input.wageIncreasePlan === "なし") {
      unmatchReasons.push("賃上げ予定がないと対象外の可能性があります");
      score -= 15;
    }
    if (subsidy.requiresHiring && input.hiringPlan === "あり") {
      score += 10;
      matchedReasons.push("雇用予定があり対象条件に合う可能性があります");
    }
    if (subsidy.requiresWageIncrease && input.wageIncreasePlan === "あり") {
      score += 10;
      matchedReasons.push("賃上げ予定があり対象条件に合う可能性があります");
    }

    if (subsidy.targetAreas !== "all" && !subsidy.targetAreas.includes(input.prefecture)) {
      unmatchReasons.push(`${input.prefecture}は対象地域外の可能性があります`);
      score -= 20;
    }

    if (matchedPurposes.length > 0) {
      matchedReasons.push(...subsidy.matchReasons.slice(0, 2));
    }
    if (unmatchReasons.length === 0) {
      matchedReasons.push(...subsidy.matchReasons);
    }

    score += subsidy.weight;

    let recommendLevel: RecommendLevel;
    if (score >= 50) recommendLevel = "高";
    else if (score >= 25) recommendLevel = "中";
    else recommendLevel = "条件次第";

    results.push({
      subsidy,
      recommendLevel,
      score,
      matchedReasons: [...new Set(matchedReasons)],
      unmatchReasons: [...new Set(unmatchReasons)],
    });
  }

  return results.filter((r) => r.score >= 0).sort((a, b) => b.score - a.score);
}

// ─── ユーティリティ ───────────────────────────────────────
export function serializeInput(input: DiagnosisInput): string {
  return btoa(encodeURIComponent(JSON.stringify(input)));
}
export function deserializeInput(encoded: string): DiagnosisInput | null {
  try { return JSON.parse(decodeURIComponent(atob(encoded))); } catch { return null; }
}

export function getDaysUntilDeadline(deadlineDate?: string): number | null {
  if (!deadlineDate) return null;
  return Math.ceil((new Date(deadlineDate).getTime() - Date.now()) / 86400000);
}
export function getDeadlineColor(days: number | null): string {
  if (days === null) return "text-slate-500 bg-slate-100";
  if (days <= 14) return "text-red-600 bg-red-50";
  if (days <= 30) return "text-amber-600 bg-amber-50";
  return "text-emerald-600 bg-emerald-50";
}

export const STATUS_CONFIG: Record<SubsidyStatus, { label: string; color: string; dot: string }> = {
  受付中: { label: "受付中", color: "text-emerald-700 bg-emerald-50 border-emerald-200", dot: "bg-emerald-400" },
  随時受付: { label: "随時受付", color: "text-blue-700 bg-blue-50 border-blue-200", dot: "bg-blue-400" },
  準備中: { label: "公募準備中", color: "text-amber-700 bg-amber-50 border-amber-200", dot: "bg-amber-400" },
  終了: { label: "公募終了", color: "text-slate-500 bg-slate-100 border-slate-200", dot: "bg-slate-400" },
  不明: { label: "時期未定", color: "text-slate-500 bg-slate-100 border-slate-200", dot: "bg-slate-300" },
};

export const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string }> = {
  易: { label: "申請：易しい", color: "text-emerald-600" },
  中: { label: "申請：普通", color: "text-amber-600" },
  難: { label: "申請：難しい", color: "text-red-600" },
};

export const PURPOSE_GROUPS: { label: string; purposes: Purpose[] }[] = [
  { label: "販促・集客", purposes: ["ホームページ制作", "広告・販路開拓"] },
  { label: "設備・IT", purposes: ["設備投資", "IT導入", "AI導入", "省力化", "店舗改装"] },
  { label: "人材", purposes: ["採用", "賃上げ", "研修"] },
  { label: "成長・戦略", purposes: ["新規事業", "事業承継", "海外展開", "研究開発"] },
];

export function getSubsidiesByArea(prefecture: string): SubsidyData[] {
  return SUBSIDIES.filter((s) => s.targetAreas === "all" || s.targetAreas.includes(prefecture));
}
export function getSubsidiesByPurpose(purpose: Purpose): SubsidyData[] {
  return SUBSIDIES.filter((s) => s.targetPurposes.includes(purpose));
}

export const PREFECTURES = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県",
  "岐阜県","静岡県","愛知県","三重県",
  "滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県",
  "鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県",
  "福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県",
];

export const RELATED_TOOLS = [
  { id: "finance", title: "事業計画の数値計算", href: "/tools/finance", emoji: "📊", desc: "売上・利益計画の試算に" },
  { id: "net-income", title: "手取り計算", href: "/tools/net-income", emoji: "💴", desc: "採用時の給与設計に" },
  { id: "chatgpt-format", title: "AI文章フォーマッター", href: "/tools/chatgpt-format", emoji: "✍️", desc: "申請書の文章整理に" },
  { id: "pdf-merge", title: "PDF結合", href: "/tools/pdf-merge", emoji: "📄", desc: "添付書類のまとめに" },
];
