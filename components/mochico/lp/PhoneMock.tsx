// ヒーローのスマートフォンモック。Mochico 本体のイベント画面（実装済みの要素だけ）を静的HTMLで再現。
// 画像ではなくHTMLなので軽く、JS を待たずに表示される。
import { DEMO_GOODS, DEMO_TOTAL } from "@/lib/mochico/content";
import { Mascot } from "../Mascot";
import { StaticCard } from "./DemoCard";
import s from "./lp.module.css";

const OWNED = new Set(["light", "stand", "towel"]);

export function PhoneMock() {
  const owned = 9;
  const pct = Math.round((owned / DEMO_TOTAL) * 100);
  return (
    <div className={s.phone} role="img" aria-label="Mochicoのイベント画面の例。グッズが写真つきで2列に並び、持っているグッズには「持ってる」の印が付いている。">
      <div className={s.screen} aria-hidden="true">
        <span className={s.notch} />
        <div className={s.appBar}>
          <span className={s.appIcon}>
            <Mascot size={16} float={false} />
          </span>
          Mochico
        </div>
        <div className={s.appBody}>
          <div className={s.mockTitle}>Mochico Live 2026</div>
          <div className={s.mockDate}>2026/12/12(土) 〜 12/13(日)</div>
          <div className={s.progressCard}>
            <div className={s.progressRow}>
              <span className={s.progressNum}>
                {owned} <span>/ {DEMO_TOTAL} 取得</span>
              </span>
              <span className={s.progressPct}>{pct}%</span>
            </div>
            <div className={s.bar}>
              <div className={s.barFill} style={{ transform: `scaleX(${owned / DEMO_TOTAL})` }} />
            </div>
          </div>
          <div className={s.tabs}>
            <span data-on="true">すべて {DEMO_TOTAL}</span>
            <span>未取得 {DEMO_TOTAL - owned}</span>
            <span>取得済み {owned}</span>
          </div>
          <div className={s.miniGrid}>
            {DEMO_GOODS.slice(0, 4).map((g) => (
              <StaticCard key={g.id} item={g} owned={OWNED.has(g.id)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
