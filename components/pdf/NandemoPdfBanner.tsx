// ========================================
// 「なんでもPDF」iOSアプリ App Store 導線バナー
// PDFカテゴリTOP・PDF関連ツールページから表示
// ========================================
const APP_STORE_URL =
  "https://apps.apple.com/jp/app/%E3%81%AA%E3%82%93%E3%81%A7%E3%82%82pdf-%E5%86%99%E7%9C%9F-%E3%82%B9%E3%82%AD%E3%83%A3%E3%83%B3-%E3%83%A1%E3%83%A2%E5%A4%89%E6%8F%9B/id6754219792";

export function NandemoPdfBanner() {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-4 sm:p-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-2xl text-white transition-all group shadow-md hover:shadow-lg"
    >
      {/* アイコン */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-105 transition-transform">
        📄
      </div>

      {/* テキスト */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium opacity-75 mb-0.5">📱 iPhoneアプリ</p>
        <p className="font-bold text-base sm:text-lg leading-tight">なんでもPDF</p>
        <p className="text-xs opacity-75 mt-0.5 truncate">
          写真・スキャン・メモをかんたんPDF変換
        </p>
      </div>

      {/* App Store バッジ */}
      <div className="flex-shrink-0 text-center">
        <div className="bg-white text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap group-hover:bg-blue-50 transition-colors">
          App Store →
        </div>
        <p className="text-xs opacity-60 mt-1.5">無料</p>
      </div>
    </a>
  );
}
