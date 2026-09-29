import type { ReactNode } from "react";
import type { CommunityPalette } from "@/lib/sns-starter-kit/content";
import { toneVars } from "./tone";
import s from "./lp.module.css";

// ============================================================
// 端末フレームと、コミュニティのフィード画面（すべて架空のデータ）。
// 実在のSNS画面のコピーではなく、「どんな構成の場所になるか」を伝える表現。
// 画像を使わずHTML/CSSだけで描画する（LCP・転送量のため）。
// ============================================================

export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={[s.phone, className].filter(Boolean).join(" ")} aria-hidden="true">
      <div className={s.phoneScreen}>
        <div className={s.phoneNotch} />
        {children}
      </div>
    </div>
  );
}

interface FeedPost {
  initial: string;
  color: string;
  name: string;
  /** 投稿カテゴリ（branded のときはカテゴリごとの色タグになる） */
  category: string;
  meta: string;
  body: string;
  image?: boolean;
}

/**
 * brand を渡すと「そのコミュニティ専用」に染まった画面になる（Signature Scroll の完成形）。
 * 渡さなければ、特定の色を持たない汎用の土台（Hero）。
 */
export function FeedScreen({
  appName,
  tabs,
  posts,
  brand,
  categoryPalettes,
}: {
  appName: string;
  tabs: string[];
  posts: FeedPost[];
  brand?: CommunityPalette;
  categoryPalettes?: Record<string, CommunityPalette>;
}) {
  return (
    <div className={s.feedRoot} data-branded={brand ? "" : undefined} style={brand ? toneVars(brand) : undefined}>
      <div className={s.appBar}>
        <span className={s.appName}>{appName}</span>
        <span className={`${s.chip} ${s.postBtn}`}>投稿する</span>
      </div>
      <div className={s.tabs}>
        {tabs.map((t, i) => {
          const pal = categoryPalettes?.[t];
          return (
            <span
              key={t}
              className={[s.chip, i === 0 ? s.chipActive : "", pal ? s.chipTone : ""].join(" ")}
              style={pal ? toneVars(pal) : undefined}
            >
              {t}
            </span>
          );
        })}
      </div>
      <div className={s.feed}>
        {posts.map((p) => (
          <div key={p.name + p.meta} className={s.post}>
            <div className={s.postHead}>
              <span className={s.avatar} style={{ background: p.color }}>
                {p.initial}
              </span>
              <div>
                <div className={s.postName}>{p.name}</div>
                <div className={s.postMeta}>
                  {categoryPalettes?.[p.category] ? (
                    <span className={s.catTag} style={toneVars(categoryPalettes[p.category])}>
                      {p.category}
                    </span>
                  ) : (
                    p.category
                  )}
                  {" ・ "}
                  {p.meta}
                </div>
              </div>
            </div>
            <p className={s.postBody}>{p.body}</p>
            {p.image && <div className={s.postImage} />}
            <div className={s.postActions}>
              <span>返信 3</span>
              <span>いいね 12</span>
            </div>
          </div>
        ))}
      </div>
      <div className={s.bottomNav}>
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export const CAR_FEED_POSTS: FeedPost[] = [
  {
    initial: "T",
    color: "#e0533d",
    name: "たくみ",
    category: "愛車紹介",
    meta: "神奈川",
    body: "週末に洗車してきました。夕方の光がいちばん好きな時間です。",
    image: true,
  },
  {
    initial: "M",
    color: "#3b6fd4",
    name: "みお",
    category: "整備記録",
    meta: "愛知",
    body: "オイル交換、今回は少し粘度を上げてみました。",
  },
  {
    initial: "K",
    color: "#1f9d55",
    name: "けんじ",
    category: "ツーリング",
    meta: "長野",
    body: "来月の早朝ツーリング、参加者募集します。",
  },
];

/** Hero 用: まだ何のコミュニティにもなっていない「土台」の状態。 */
export function HeroPhone() {
  return (
    <PhoneFrame>
      <FeedScreen
        appName="Your Community"
        tabs={["すべて", "カテゴリA", "カテゴリB"]}
        posts={[
          {
            initial: "A",
            color: "#6f86b8",
            name: "メンバーA",
            category: "カテゴリA",
            meta: "2分前",
            body: "はじめまして。この場所の最初の投稿です。",
            image: true,
          },
          {
            initial: "B",
            color: "#b89a6a",
            name: "メンバーB",
            category: "カテゴリB",
            meta: "15分前",
            body: "プロフィール項目も投稿カテゴリも、コミュニティに合わせて変えられる土台です。",
          },
          {
            initial: "C",
            color: "#7fa58c",
            name: "メンバーC",
            category: "カテゴリA",
            meta: "1時間前",
            body: "返信・通報・ブロックの基本的な流れを備える予定です。",
          },
        ]}
      />
    </PhoneFrame>
  );
}
