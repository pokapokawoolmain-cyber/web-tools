// ========================================
// ツールアイコンマッピング
// 絵文字 → ガラスタイル + ネオンカラー lucide アイコン
// ネオンカラーはカテゴリ単位で統一
// ========================================
import type { LucideIcon } from "lucide-react";
import {
  // お金・投資
  Flame,
  TrendingUp,
  Home,
  Wallet,
  RefreshCcw,
  Coins,
  Fence,
  Gift,
  HandCoins,
  // 計算ツール
  ShoppingBag,
  Fuel,
  Clock,
  CreditCard,
  // 画像系
  ImageDown,
  Shrink,
  Video,
  Crop,
  Proportions,
  Camera,
  Globe,
  Images,
  // PDF系
  Files,
  Scissors,
  FileArchive,
  FileImage,
  FileOutput,
  RotateCw,
  Droplets,
  FileX,
  ArrowUpDown,
  FileLock,
  Eraser,
  FileType,
  FileSpreadsheet,
  Sheet,
  // 生活・副業
  Gauge,
  Keyboard,
  Mouse,
  Mic,
  Volume2,
  Grid2x2,
  Monitor,
  MonitorPlay,
  Scale,
  Briefcase,
  Clapperboard,
  Link2,
  // テキスト・Web
  Type,
  FileCode,
  KeyRound,
  QrCode,
  Wifi,
  Link,
  // 学生向け
  GraduationCap,
  // 仕事・副業
  FileUser,
  // ビジネス・契約書
  FilePen,
  Handshake,
  FileText,
  ClipboardList,
  Mail,
  MailCheck,
  Stamp,
  Signature,
  Receipt,
  // AI文章ツール
  Sparkles,
  Bot,
  MessageSquare,
  NotebookPen,
  MessagesSquare,
  HeartHandshake,
  Ban,
  HelpCircle,
  TerminalSquare,
  // 冠婚葬祭・文書
  Ribbon,
  PenLine,
  PartyPopper,
  Flower,
  ScrollText,
  Printer,
  // カラーツール
  Palette,
  Paintbrush,
  Blend,
  Eye,
  Grid3x3,
  Glasses,
  SwatchBook,
  // 開発者ツール
  Braces,
  Binary,
  Fingerprint,
  Clock3,
  Hash,
  // 建設・リフォーム
  HardHat,
  Percent,
  Cake,
  CalendarDays,
  CalendarRange,
  PaintRoller,
  DoorOpen,
  ClipboardCheck,
  FileCheck,
  // 飲食店
  UtensilsCrossed,
  Calculator,
  BookOpen,
  Star,
  Megaphone,
  // Revenue Experiment
  Package,
} from "lucide-react";

export type ToolIconDef = {
  icon: LucideIcon;
  /** ネオンカラー（HEX） */
  color: string;
};

// カテゴリ別ネオンカラー
const PDF = "#38bdf8"; // スカイ
const IMAGE = "#a78bfa"; // バイオレット
const MONEY = "#34d399"; // エメラルド
const CALC = "#fbbf24"; // アンバー
const BUSINESS = "#818cf8"; // インディゴ
const TEXT_WEB = "#f472b6"; // ピンク
const CEREMONY = "#e2c08d"; // シャンパンゴールド
const CONSTRUCTION = "#fb923c"; // オレンジ
const RESTAURANT = "#f87171"; // レッド
const AI = "#22d3ee"; // シアン
const DEVICE = "#2dd4bf"; // ティール（デバイス診断・テスト系）
const COLOR = "#c084fc"; // パープル
const DEV = "#38bdf8"; // スカイ（開発者ツール）
const STUDENT = "#4ade80"; // グリーン

export const TOOL_ICONS: Record<string, ToolIconDef> = {
  // お金・投資
  "fire-simulator": { icon: Flame, color: MONEY },
  "nisa-calculator": { icon: TrendingUp, color: MONEY },
  "mortgage-calculator": { icon: Home, color: MONEY },
  "net-income": { icon: Wallet, color: MONEY },
  "resident-tax": { icon: Receipt, color: MONEY },
  "takehome-reverse": { icon: RefreshCcw, color: MONEY },
  "bonus-takehome": { icon: Coins, color: MONEY },
  "nenshu-kabe": { icon: Fence, color: MONEY },
  "furusato-simulator": { icon: Gift, color: MONEY },
  "furusato": { icon: HandCoins, color: MONEY },

  // 計算ツール
  "mercari-profit": { icon: ShoppingBag, color: CALC },
  "gas-calculator": { icon: Fuel, color: CALC },
  "warikan-calculator": { icon: HandCoins, color: CALC },
  "bmi-calculator": { icon: Scale, color: CALC },
  "percentage-calculator": { icon: Percent, color: CALC },
  "shift-salary": { icon: Clock, color: CALC },
  "point-simulator": { icon: CreditCard, color: CALC },
  "age-calculator": { icon: Cake, color: CALC },
  "date-calculator": { icon: CalendarDays, color: CALC },
  "tax-calculator": { icon: Calculator, color: CALC },
  "wareki-converter": { icon: CalendarRange, color: CALC },

  // 画像系
  "heic-to-jpg": { icon: ImageDown, color: IMAGE },
  "image-converter": { icon: Images, color: IMAGE },
  "image-compress": { icon: Shrink, color: IMAGE },
  "video-compress": { icon: Video, color: IMAGE },
  "image-resize": { icon: Crop, color: IMAGE },
  "aspect-ratio": { icon: Proportions, color: IMAGE },
  "id-photo": { icon: Camera, color: IMAGE },
  "favicon-generator": { icon: Globe, color: IMAGE },

  // PDF系
  "pdf-merge": { icon: Files, color: PDF },
  "pdf-split": { icon: Scissors, color: PDF },
  "pdf-compress": { icon: FileArchive, color: PDF },
  "jpg-to-pdf": { icon: FileImage, color: PDF },
  "pdf-to-jpg": { icon: FileOutput, color: PDF },
  "pdf-rotate": { icon: RotateCw, color: PDF },
  "pdf-watermark": { icon: Droplets, color: PDF },
  "pdf-delete-pages": { icon: FileX, color: PDF },
  "pdf-reorder": { icon: ArrowUpDown, color: PDF },
  "pdf-password": { icon: FileLock, color: PDF },
  "pdf-metadata-remover": { icon: Eraser, color: PDF },
  "word-to-pdf": { icon: FileType, color: PDF },
  "excel-to-pdf": { icon: FileSpreadsheet, color: PDF },
  "pdf-to-excel": { icon: Sheet, color: PDF },
  "pdf-to-word": { icon: FileText, color: PDF },

  // 生活・副業
  "speed-test": { icon: Gauge, color: AI },
  "keyboard-test": { icon: Keyboard, color: DEVICE },
  "mouse-test": { icon: Mouse, color: DEVICE },
  "mic-test": { icon: Mic, color: DEVICE },
  "webcam-test": { icon: Camera, color: DEVICE },
  "speaker-test": { icon: Volume2, color: DEVICE },
  "dead-pixel-test": { icon: Grid2x2, color: DEVICE },
  "screen-resolution": { icon: Monitor, color: DEVICE },
  "refresh-rate": { icon: MonitorPlay, color: DEVICE },
  "side-job-profit": { icon: Briefcase, color: TEXT_WEB },
  "youtube-tools": { icon: Clapperboard, color: TEXT_WEB },
  "sns-links": { icon: Link2, color: TEXT_WEB },

  // テキスト・Web
  "word-counter": { icon: Type, color: TEXT_WEB },
  "markdown-editor": { icon: FileCode, color: TEXT_WEB },
  "password-generator": { icon: KeyRound, color: TEXT_WEB },
  "qr-generator": { icon: QrCode, color: TEXT_WEB },
  "wifi-qr": { icon: Wifi, color: TEXT_WEB },
  "short-link": { icon: Link, color: TEXT_WEB },

  // 学生向け
  "gpa": { icon: GraduationCap, color: STUDENT },

  // 仕事・副業
  "resume-builder": { icon: FileUser, color: BUSINESS },

  // ビジネス・契約書
  "business-contract-generator": { icon: FilePen, color: BUSINESS },
  "nda-generator": { icon: Handshake, color: BUSINESS },
  "invoice-generator": { icon: FileText, color: BUSINESS },
  "estimate-generator": { icon: ClipboardList, color: BUSINESS },
  "resignation-letter-generator": { icon: Mail, color: BUSINESS },
  "certified-letter-generator": { icon: MailCheck, color: BUSINESS },
  "hanko-generator": { icon: Stamp, color: BUSINESS },
  "pdf-signature": { icon: Signature, color: BUSINESS },
  "receipt-generator": { icon: Receipt, color: BUSINESS },

  // AI文章ツール
  "ai-email": { icon: Mail, color: AI },
  "ai-keigo": { icon: MessagesSquare, color: AI },
  "ai-apology": { icon: HeartHandshake, color: AI },
  "ai-decline": { icon: Ban, color: AI },
  "ai-inquiry": { icon: HelpCircle, color: AI },
  "prompt-builder": { icon: TerminalSquare, color: AI },
  "chatgpt-format": { icon: Sparkles, color: AI },
  "ai-humanize": { icon: Bot, color: AI },
  "x-post-preview": { icon: MessageSquare, color: AI },
  "note-format": { icon: NotebookPen, color: AI },

  // 冠婚葬祭・文書
  "noshi-maker": { icon: Ribbon, color: CEREMONY },
  "koden-maker": { icon: PenLine, color: CEREMONY },
  "shugi-maker": { icon: PartyPopper, color: CEREMONY },
  "houyou-calculator": { icon: Flower, color: CEREMONY },
  "resignation-letter": { icon: ScrollText, color: CEREMONY },
  "fax-cover": { icon: Printer, color: CEREMONY },

  // カラーツール
  "hex-rgb-converter": { icon: Palette, color: COLOR },
  "color-palette": { icon: Paintbrush, color: COLOR },
  "gradient-generator": { icon: Blend, color: COLOR },
  "contrast-checker": { icon: Eye, color: COLOR },
  "brand-color-text": { icon: Type, color: COLOR },

  // 開発者ツール
  "json-formatter": { icon: Braces, color: DEV },
  "base64": { icon: Binary, color: DEV },
  "url-encode": { icon: Link2, color: DEV },
  "uuid": { icon: Fingerprint, color: DEV },
  "unix-time": { icon: Clock3, color: DEV },
  "hash": { icon: Hash, color: DEV },
  "palette-accessibility": { icon: Grid3x3, color: COLOR },
  "color-blind-simulator": { icon: Glasses, color: COLOR },
  "color-codes": { icon: SwatchBook, color: COLOR },

  // 建設・リフォーム
  "construction-estimate": { icon: HardHat, color: CONSTRUCTION },
  "gross-profit-calculator": { icon: Percent, color: CONSTRUCTION },
  "exterior-paint-calculator": { icon: PaintRoller, color: CONSTRUCTION },
  "neighbor-greeting": { icon: DoorOpen, color: CONSTRUCTION },
  "construction-photo-pdf": { icon: Images, color: CONSTRUCTION },
  "construction-report": { icon: ClipboardCheck, color: CONSTRUCTION },
  "construction-contract": { icon: FileCheck, color: CONSTRUCTION },

  // 飲食店
  "food-cost-calculator": { icon: UtensilsCrossed, color: RESTAURANT },
  "menu-price-calculator": { icon: Calculator, color: RESTAURANT },
  "restaurant-menu-maker": { icon: BookOpen, color: RESTAURANT },
  "review-reply-generator": { icon: Star, color: RESTAURANT },
  "restaurant-pop-generator": { icon: Megaphone, color: RESTAURANT },

  // Revenue Experiment（ツール本体ではないが、同じアイコンデザインシステムで統一する）
  "image_pro": { icon: Images, color: IMAGE },
  "seller": { icon: Package, color: BUSINESS },
};
