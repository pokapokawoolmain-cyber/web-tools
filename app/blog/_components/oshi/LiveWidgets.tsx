"use client";
// ============================================================
// ライブ記事の動く部品（クライアント側だけで動かす）
//   - LiveCountdown: 次の予定（開演・物販開始など）までの残り時間（サーバーでは描画せず、ずれによるハイドレーション差を出さない）
//   - GoodsBudget: グッズを価格帯で絞り込み、チェックした分の合計を出す（状態は保存しない）
// ============================================================
import { useEffect, useMemo, useState } from "react";
import s from "./oshi.module.css";

export type LiveShow = { label: string; start: string };

export function LiveCountdown({ shows }: { shows: LiveShow[] }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  if (now === null) return <p className={s.countdown} aria-hidden="true">&nbsp;</p>;
  const next = shows.map((sh) => ({ ...sh, t: new Date(sh.start).getTime() })).find((sh) => sh.t > now);
  if (!next) return <p className={s.countdown}>この記事の公演はすべて終了しました。ツアーおつかれさまでした！</p>;
  const sec = Math.floor((next.t - now) / 1000);
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const ss = sec % 60;
  return (
    <p className={s.countdown} role="timer" aria-live="off">
      <span>{next.label}まで</span>
      <span className={s.countdownNum}>
        {d}
        <small>日</small>
        {String(h).padStart(2, "0")}
        <small>時間</small>
        {String(m).padStart(2, "0")}
        <small>分</small>
        {String(ss).padStart(2, "0")}
        <small>秒</small>
      </span>
    </p>
  );
}

export type BudgetItem = { name: string; price: number | null; random?: boolean };
const BANDS = [
  { key: "all", label: "すべて", test: () => true },
  { key: "s", label: "〜2,000円", test: (p: number) => p <= 2000 },
  { key: "m", label: "2,001〜5,000円", test: (p: number) => p > 2000 && p <= 5000 },
  { key: "l", label: "5,001円〜", test: (p: number) => p > 5000 },
] as const;
const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

export function GoodsBudget({ items, listHref, listLabel }: { items: BudgetItem[]; listHref: string; listLabel: string }) {
  const [band, setBand] = useState<(typeof BANDS)[number]["key"]>("all");
  const [picked, setPicked] = useState<Set<number>>(() => new Set());
  const visible = useMemo(() => {
    const b = BANDS.find((x) => x.key === band)!;
    return items.map((it, i) => ({ it, i })).filter(({ it }) => it.price !== null && b.test(it.price));
  }, [band, items]);
  const total = [...picked].reduce((a, i) => a + (items[i].price ?? 0), 0);
  const toggle = (i: number) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  return (
    <div>
      <div className={s.goodsTools} role="group" aria-label="価格帯で絞り込む">
        {BANDS.map((b) => (
          <button key={b.key} type="button" className={s.goodsChip} aria-pressed={band === b.key} onClick={() => setBand(b.key)}>
            {b.label}
          </button>
        ))}
      </div>
      <ul className={s.goodsList}>
        {visible.map(({ it, i }) => (
          <li key={i}>
            <label className={s.goodsRow}>
              <input type="checkbox" checked={picked.has(i)} onChange={() => toggle(i)} />
              <span className={s.goodsName}>
                {it.name}
                {it.random && <span className={s.goodsTag}>ランダム</span>}
              </span>
              <span className={s.goodsPrice}>{yen(it.price ?? 0)}</span>
            </label>
          </li>
        ))}
      </ul>
      <div className={s.goodsSum} aria-live="polite">
        <span>
          えらんだ {picked.size} 点：<span className={s.goodsSumNum}>{yen(total)}</span>
        </span>
        <a href={listHref} rel="nofollow">
          {listLabel} →
        </a>
        <span className={s.goodsSumNote}>チェックした内容は保存されません。買うものを残しておくなら Mochico のリストへ。</span>
      </div>
    </div>
  );
}
