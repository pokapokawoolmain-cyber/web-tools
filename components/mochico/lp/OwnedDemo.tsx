"use client";
// 「持ってる」をタップするだけ — LP 専用デモ（実データは使わない・保存もしない）
import { useState } from "react";
import { Hand } from "lucide-react";
import { DEMO_GOODS, DEMO_OWNED_HIDDEN, DEMO_OWNED_INITIAL, DEMO_TOTAL } from "@/lib/mochico/content";
import { Mascot } from "../Mascot";
import { CardInner, yen } from "./DemoCard";
import s from "./lp.module.css";

export function OwnedDemo() {
  const [owned, setOwned] = useState<Set<string>>(() => new Set(DEMO_OWNED_INITIAL));
  const [cheer, setCheer] = useState(0);
  const count = owned.size + DEMO_OWNED_HIDDEN;
  const pct = Math.round((count / DEMO_TOTAL) * 100);

  function toggle(id: string) {
    setOwned((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        next.add(id);
        setCheer((c) => c + 1);
        window.dispatchEvent(new CustomEvent("mochico:cheer"));
      }
      return next;
    });
  }

  return (
    <div className={s.demoPanel}>
      <span className={s.demoMascot}>
        <Mascot key={cheer} size={54} state={cheer > 0 ? "happy" : "idle"} />
      </span>
      <div className={s.progressCard} style={{ marginTop: 0 }}>
        <div className={s.progressRow}>
          <span className={s.progressNum} aria-live="polite">
            {count} <span>/ {DEMO_TOTAL} 取得</span>
          </span>
          <span className={s.progressPct}>{pct}%</span>
        </div>
        <div className={s.bar} role="progressbar" aria-valuemin={0} aria-valuemax={DEMO_TOTAL} aria-valuenow={count} aria-label={`デモの取得状況 ${count} / ${DEMO_TOTAL}`}>
          <div className={s.barFill} style={{ transform: `scaleX(${count / DEMO_TOTAL})` }} />
        </div>
      </div>
      <div className={s.demoGrid}>
        {DEMO_GOODS.map((g) => {
          const on = owned.has(g.id);
          return (
            <button
              key={g.id}
              type="button"
              className={s.card}
              data-owned={on}
              aria-pressed={on}
              aria-label={`${g.name}、${yen(g.price)}、${on ? "取得済み" : "未取得"}。タップで切り替え`}
              onClick={() => toggle(g.id)}
            >
              <CardInner item={g} owned={on} />
            </button>
          );
        })}
      </div>
      <p className={s.demoHint}>
        <Hand size={16} aria-hidden="true" />
        グッズをタップしてみてください（このデモは保存されません）
      </p>
    </div>
  );
}
