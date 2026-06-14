export type SourceType = "rss" | "html" | "api" | "manual";

export interface SubsidySource {
  id: string;
  label: string;
  provider: string;
  type: SourceType;
  url: string;
  feedUrl?: string;
  notes?: string;
  enabled: boolean;
}

export const SUBSIDY_SOURCES: SubsidySource[] = [
  {
    id: "chusho-meti",
    label: "中小企業庁 新着情報",
    provider: "中小企業庁",
    type: "rss",
    url: "https://www.chusho.meti.go.jp/",
    feedUrl: "https://www.chusho.meti.go.jp/rss/whatsnew.rdf",
    notes: "RSSで新着補助金公募情報を取得可能",
    enabled: true,
  },
  {
    id: "mhlw-employment",
    label: "厚生労働省 雇用・助成金",
    provider: "厚生労働省",
    type: "html",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/kyufukin/",
    notes: "HTMLスクレイピングが必要。助成金一覧ページ",
    enabled: false,
  },
  {
    id: "monodukuri-hojo",
    label: "ものづくり補助金公式",
    provider: "ものづくり補助事業公式サイト",
    type: "rss",
    url: "https://portal.monodukuri-hojo.jp/",
    feedUrl: "https://portal.monodukuri-hojo.jp/news/rss",
    notes: "公募・採択情報をRSSで配信",
    enabled: true,
  },
  {
    id: "it-hojo",
    label: "IT導入補助金事務局",
    provider: "IT導入補助金事務局",
    type: "html",
    url: "https://www.it-hojo.jp/",
    notes: "お知らせページを定期クロール",
    enabled: false,
  },
  {
    id: "jizokuka",
    label: "持続化補助金事務局",
    provider: "持続化補助金事務局",
    type: "html",
    url: "https://jizokukahojokin.info/",
    notes: "公募ページの更新を監視",
    enabled: false,
  },
  {
    id: "smrj",
    label: "中小機構 補助金情報",
    provider: "独立行政法人中小企業基盤整備機構",
    type: "rss",
    url: "https://www.smrj.go.jp/",
    feedUrl: "https://www.smrj.go.jp/rss/index.rss",
    notes: "中小機構関連制度のRSS",
    enabled: true,
  },
  {
    id: "manual",
    label: "手動入力",
    provider: "ToolBoxJP編集部",
    type: "manual",
    url: "",
    notes: "編集部が手動で確認・入力するニュース",
    enabled: true,
  },
];

export function getEnabledSources(): SubsidySource[] {
  return SUBSIDY_SOURCES.filter((s) => s.enabled);
}

export function getSourceById(id: string): SubsidySource | undefined {
  return SUBSIDY_SOURCES.find((s) => s.id === id);
}
