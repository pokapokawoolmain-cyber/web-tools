"use client";
// リストは共有、取得状況は自分だけ — 1つのカタログを3人が使う説明用デモ
import { useState } from "react";
import { Lock } from "lucide-react";
import { DEMO_GOODS, DEMO_TOTAL, SHARE_USERS } from "@/lib/mochico/content";
import type { MascotColor } from "../palette";
import { Mascot } from "../Mascot";
import { StaticCard } from "./DemoCard";
import s from "./lp.module.css";

export function ShareDemo() {
  const [active, setActive] = useState<(typeof SHARE_USERS)[number]["id"]>("a");
  const user = SHARE_USERS.find((u) => u.id === active)!;
  const owned = new Set<string>(user.owned);

  return (
    <div className={s.shareStage}>
      <div className={s.catalog}>
        <div className={s.catalogHead}>
          <div>
            Mochico Live 2026 <span>· 共有リスト（{DEMO_TOTAL}点）</span>
          </div>
          <span aria-live="polite">{user.label}の表示</span>
        </div>
        <div className={s.demoGrid} style={{ marginTop: 12 }}>
          {DEMO_GOODS.map((g) => (
            <StaticCard key={g.id} item={g} owned={owned.has(g.id)} />
          ))}
        </div>
      </div>
      <div>
        <div className={s.users} role="group" aria-label="表示する人を選ぶ">
          {SHARE_USERS.map((u) => (
            <button key={u.id} type="button" className={s.user} aria-pressed={active === u.id} onClick={() => setActive(u.id)}>
              <Mascot size={40} color={u.color as MascotColor} float={active === u.id} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className={s.userName} style={{ display: "block" }}>
                  {u.label}
                </span>
                <span className={`${s.bar} ${s.userBar}`} style={{ display: "block" }}>
                  <span className={s.barFill} style={{ display: "block", transform: `scaleX(${u.count / DEMO_TOTAL})` }} />
                </span>
              </span>
              <span className={s.userCount}>
                {u.count} / {DEMO_TOTAL}
              </span>
            </button>
          ))}
        </div>
        <p className={s.privacyNote}>
          <Lock size={16} style={{ flex: "none", marginTop: 3 }} aria-hidden="true" />
          <span>
            同じリストを使っても、「持ってる」は一人ひとり別々。
            <br />
            ※ 説明のため3人を並べています。実際のMochicoでは、自分以外の人の取得状況は表示されません。リストを作った人にも見えません。
          </span>
        </p>
      </div>
    </div>
  );
}
