// LP のデモ用グッズカード（Mochico 本体のカードと同じ情報構造: 画像・カテゴリ・名前・価格・状態）
import { BookOpen, Camera, Check, Flashlight, Gift, KeyRound, Layers, Medal, Shirt, ShoppingBag, Sparkles, UserRound } from "lucide-react";
import type { DemoGoods, DemoIcon } from "@/lib/mochico/content";
import s from "./lp.module.css";

const ICONS: Record<DemoIcon, typeof Shirt> = {
  shirt: Shirt,
  hoodie: Shirt,
  light: Flashlight,
  towel: Layers,
  stand: UserRound,
  badge: Medal,
  bag: ShoppingBag,
  key: KeyRound,
  book: BookOpen,
  sticker: Sparkles,
  camera: Camera,
  gift: Gift,
};

export const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

export function CardInner({ item, owned }: { item: DemoGoods; owned: boolean }) {
  const Icon = ICONS[item.icon];
  return (
    <>
      <span className={`${s.thumb} ${s[`tone-${item.tone}`]}`}>
        <Icon aria-hidden="true" />
        <span className={s.badge}>
          {owned ? <Check size={10} strokeWidth={3.5} aria-hidden="true" /> : <i aria-hidden="true" />}
          {owned ? "取得済み" : "未取得"}
        </span>
      </span>
      <span className={s.meta}>
        {item.category && <span className={s.cat}>{item.category}</span>}
        <span className={s.name} style={{ display: "block" }}>
          {item.name}
        </span>
        <span className={s.price} style={{ display: "block" }}>
          {yen(item.price)}
        </span>
      </span>
    </>
  );
}

/** 静的表示用（クリックできない） */
export function StaticCard({ item, owned }: { item: DemoGoods; owned: boolean }) {
  return (
    <div className={s.card} data-owned={owned}>
      <CardInner item={item} owned={owned} />
    </div>
  );
}
