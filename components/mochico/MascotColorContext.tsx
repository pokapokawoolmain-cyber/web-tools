"use client";
// アプリ内のキャラクターの色（ユーザー設定）。公開 LP・ロゴ・アイコンは常に purple を使う。
import { createContext, useContext, useState, type ReactNode } from "react";
import { DEFAULT_MASCOT_COLOR, type MascotColor } from "./palette";
import { Mascot, type MascotState } from "./Mascot";

const Ctx = createContext<{ color: MascotColor; setColor: (c: MascotColor) => void }>({
  color: DEFAULT_MASCOT_COLOR,
  setColor: () => undefined,
});

export function MascotColorProvider({ initial, children }: { initial: MascotColor; children: ReactNode }) {
  const [color, setColor] = useState(initial);
  return <Ctx.Provider value={{ color, setColor }}>{children}</Ctx.Provider>;
}

export const useMascotColor = () => useContext(Ctx);

/** アプリ内用：ユーザーが選んだ色で表示する（既定は控えめに浮遊なし） */
export function AppMascot({ size = 56, state = "idle", float = false, className }: { size?: number; state?: MascotState; float?: boolean; className?: string }) {
  const { color } = useMascotColor();
  return <Mascot color={color} size={size} state={state} float={float} className={className} />;
}
