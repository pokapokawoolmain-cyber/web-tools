import type { Metadata } from "next";
import { generateMeta } from "@/lib/seo";
import { MenuPriceCalculator } from "./MenuPriceCalculator";
import { ToolLayout } from "@/components/layout/ToolLayout";

export const metadata: Metadata = generateMeta({
  title: "メニュー価格シミュレーター｜飲食店向け原価から販売価格を逆算【無料】",
  description:
    "食材費と目標原価率からメニューの適正販売価格を逆算。税込・税抜・端数調整に対応。ランチ/ディナー/テイクアウト別シミュレーション。値上げ前後の比較も。",
  path: "/tools/menu-price-calculator",
  keywords: [
    "メニュー価格 計算 無料",
    "飲食店 販売価格 逆算",
    "原価 適正価格 シミュレーター",
    "値上げ 飲食店 計算",
  ],
});

const seoContent = (
  <div className="space-y-6">
    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
        メニュー価格シミュレーターの使い方
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        食材費の合計と目標原価率を入力するだけで、適正な販売価格を逆算します。
        端数調整オプションを選ぶと、10円・50円・100円単位や飲食店でよく使われる価格帯への自動丸めも可能です。
        値上げ前後比較機能では、現在の価格と新価格の原価率・粗利の違いを一目で確認できます。
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
        価格の端数について（心理的価格設定）
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
        飲食店でよく見られる価格設定には、顧客心理を考慮した「端数価格」の戦略があります。
      </p>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <li>
          <span className="font-semibold text-slate-700 dark:text-slate-300">末尾8（980円・1,280円）：</span>
          「1,000円を切る」「安く感じる」効果があり、ランチや気軽な料理に向いています。
        </li>
        <li>
          <span className="font-semibold text-slate-700 dark:text-slate-300">末尾9（979円・1,199円）：</span>
          欧米でよく使われる端数価格。日本では末尾8の方が一般的です。
        </li>
        <li>
          <span className="font-semibold text-slate-700 dark:text-slate-300">キリ番（500円・1,000円）：</span>
          計算しやすく、高品質・プレミアム感を演出したい場合に有効です。コース料理や特別メニューに向いています。
        </li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
        ランチとディナーで価格を変える意味
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
        同じ食材・同じ料理でも、ランチとディナーで価格帯を変えることは飲食業界では一般的な戦略です。
      </p>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <li>
          <span className="font-semibold text-slate-700 dark:text-slate-300">ランチ：</span>
          回転率が高く、周辺のオフィスワーカーや主婦層がターゲット。価格感度が高いため、低価格（原価率35〜40%）でも回転数でカバーする戦略が取れます。
        </li>
        <li>
          <span className="font-semibold text-slate-700 dark:text-slate-300">ディナー：</span>
          滞在時間が長く、アルコールや追加注文で客単価が上がりやすいため、料理自体の原価率は低めに設定（25〜30%）し利益を確保します。
        </li>
        <li>
          <span className="font-semibold text-slate-700 dark:text-slate-300">テイクアウト：</span>
          包材費・容器代がかかる分、原価率を5〜8%程度低く設定するか、価格を若干高く設定するのが基本です。
        </li>
      </ul>
    </section>
  </div>
);

export default function MenuPriceCalculatorPage() {
  return (
    <ToolLayout
      title="メニュー価格シミュレーター"
      description="食材費と目標原価率から適正販売価格を逆算。端数調整・値上げ前後比較に対応。"
      icon="💴"
      slug="menu-price-calculator"
      seoContent={seoContent}
    >
      <MenuPriceCalculator />
    </ToolLayout>
  );
}
