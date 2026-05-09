// ========================================
// ツールページ共通レイアウト（Route Group）
// (tools)配下の全ページに適用される
// ========================================

export default function ToolsGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 現時点ではHeader/Footerはルートlayout.tsxに任せる
  // 将来的にツールページ専用のナビやアドバンスUIを追加する場所
  return <>{children}</>;
}
