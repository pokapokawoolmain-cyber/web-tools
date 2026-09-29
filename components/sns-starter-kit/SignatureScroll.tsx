"use client";

import { useEffect, useRef } from "react";
import { CAR_CATEGORY_PALETTES, KIT_FILES, PALETTES, statusLabel } from "@/lib/sns-starter-kit/content";
import { toneVars } from "./tone";
import { CAR_FEED_POSTS, FeedScreen, PhoneFrame } from "./PhoneMock";
import s from "./lp.module.css";

// ============================================================
// Signature Scroll: スクロール位置に応じて6つのシーンを切り替える。
//
// 性能方針:
//   - scroll ハンドラは rAF で間引き、読むのは section の rect 1回だけ。
//   - React の再レンダリングは起こさない（data-scene 属性と --p を直接書く）。
//   - 見た目の変化はすべて CSS（transform / opacity）で行う。
//   - prefers-reduced-motion では CSS 側で遷移を止め、シーンの切替だけ残す。
//   - 低性能端末（CPU/メモリが少ない・データセーバー）は data-lite で軽量化。
// 画面は開発中の商品のイメージであり、実在のツールのUIではない。
// ============================================================

const SCENES: { step: string; text: string; note: string }[] = [
  {
    step: "01",
    text: "Starter Kitのフォルダを開く",
    note: "SNS本体に加えて、最初に読む手順とAI向けの開発ルールを同梱する構成を予定しています。",
  },
  {
    step: "02",
    text: "作りたいコミュニティを伝える",
    note: "「このSNSを、車好きのコミュニティ向けに変えたい。」",
  },
  {
    step: "03",
    text: "AIが開発ルールを確認する",
    note: "同梱ルールを起点に、安全に変更できる範囲から始めます。",
  },
  {
    step: "04",
    text: "プロフィール項目が変わる",
    note: "名前・自己紹介に、愛車・型式・地域が加わります。",
  },
  {
    step: "05",
    text: "投稿カテゴリが変わる",
    note: "「投稿」だけだった入口が、愛車紹介・整備記録・ツーリングに。",
  },
  {
    step: "06",
    text: "同じ土台から、\nあなたのコミュニティへ。",
    note: "写真、ゲーム、スポーツ。土台は同じまま、場所の形を変えていきます。",
  },
];

const PROFILE_BEFORE = ["名前", "自己紹介"];
const PROFILE_ADDED = [
  { label: "愛車", value: "ロードスター" },
  { label: "型式", value: "ND5RC" },
  { label: "地域", value: "神奈川" },
];

export function SignatureScroll({ onReached }: { onReached?: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const captionsRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const captions = captionsRef.current;
    if (!section || !stage || !captions) return;

    // 低性能端末の判定（取得できない値は判定に使わない）
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const lite =
      (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 4) ||
      (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) ||
      nav.connection?.saveData === true;
    if (lite) stage.dataset.lite = "";

    const items = Array.from(captions.children) as HTMLElement[];
    let current = -1;
    let ticking = false;
    let reached = false;

    const update = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const distance = rect.height - stage.offsetHeight;
      const progress = distance > 0 ? Math.min(1, Math.max(0, -rect.top / distance)) : 0;
      stage.style.setProperty("--p", progress.toFixed(4));
      const scene = Math.min(SCENES.length - 1, Math.floor(progress * SCENES.length));
      if (scene !== current) {
        current = scene;
        stage.dataset.scene = String(scene);
        items.forEach((el, i) => {
          if (i === scene) el.setAttribute("data-active", "");
          else el.removeAttribute("data-active");
        });
      }
      if (!reached && rect.top < window.innerHeight * 0.5 && rect.bottom > 0) {
        reached = true;
        onReached?.();
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    // 画面外では scroll を購読しない
    let listening = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !listening) {
          listening = true;
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", onScroll, { passive: true });
          update();
        } else if (!entry.isIntersecting && listening) {
          listening = false;
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onScroll);
          update();
        }
      },
      { rootMargin: "100px 0px" },
    );
    io.observe(section);
    update();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onReached]);

  return (
    <div ref={sectionRef} className={s.sig}>
      <div ref={stageRef} className={s.sigStage} data-scene="0" style={toneVars(PALETTES.car)}>
        {/* 物語はテキストとして常にDOMにある（スクリーンリーダー・動きの無効化時も読める） */}
        <ol ref={captionsRef} className={s.captions} aria-label="体験の流れ（イメージ）">
          {SCENES.map((scene, i) => (
            <li key={scene.step} className={s.caption} data-active={i === 0 ? "" : undefined}>
              <div className={s.captionStep}>STEP {scene.step}</div>
              <p className={s.captionText}>{scene.text}</p>
              <p className={s.captionNote}>{scene.note}</p>
            </li>
          ))}
        </ol>

        <div className={s.visual} aria-hidden="true">
          {/* Workspace window */}
          <div className={s.win}>
            <div className={s.winBar}>
              <span className={s.winPath}>
                <span>Projects</span>
                <span>/</span>
                <b>SNS Starter Kit</b>
              </span>
              <span className={`${s.badge} ${s.badge_concept} ${s.winTag}`}>画面イメージ</span>
            </div>
            <div className={s.winBody}>
              <div className={`${s.pane} ${s.tree}`}>
                <div className={s.treeItem}>app/</div>
                <div className={s.treeItem}>components/</div>
                <div className={s.treeItem}>supabase/</div>
                {KIT_FILES.map((f) => (
                  <div key={f.id} className={s.treeItem} data-open={f.id === "agents-md" ? "" : undefined}>
                    {f.label}
                  </div>
                ))}
              </div>

              <div className={`${s.pane} ${s.editor}`}>
                <div className={s.codeLine}><i>1</i><b># 開発ルール（構成案）</b></div>
                <div className={s.codeLine}><i>2</i></div>
                <div className={s.codeLine}><i>3</i>## 安全に変更できる範囲</div>
                <div className={s.codeLine} data-mark=""><i>4</i>- サービス名・テーマカラー</div>
                <div className={s.codeLine} data-mark=""><i>5</i>- 投稿カテゴリ・プロフィール項目</div>
                <div className={s.codeLine}><i>6</i></div>
                <div className={s.codeLine}><i>7</i>## 変更前に確認が必要な範囲</div>
                <div className={s.codeLine}><i>8</i>- 認証・権限・RLS・Storage Policy</div>
                <div className={s.codeLine}><i>9</i>- Secrets・管理者権限</div>
              </div>

              <div className={`${s.pane} ${s.chat}`}>
                <div className={s.chatHead}>AI開発環境（イメージ）</div>
                <p className={`${s.bubble} ${s.bubbleUser}`}>
                  このSNSを、車好きのコミュニティ向けに変えたい。
                </p>
                <p className={`${s.bubble} ${s.bubbleAi}`}>
                  Starter Kitの開発ルールを確認しました。まず、安全に変更できる範囲から始めます。
                </p>
                <div className={s.composer}>メッセージを入力</div>
              </div>

              {/* Scene 1: フォルダ（ウィンドウ全体を使う） */}
              <div className={s.folder}>
                {KIT_FILES.map((f) => (
                  <div key={f.id} className={s.fileTile}>
                    <span className={s.docIcon} />
                    {/* アンダースコアの後ろでだけ改行できるようにする（語の途中で折れない） */}
                    <span className={s.fileName}>{f.label.replace(/_/g, "_\u200b")}</span>
                    <span className={s.fileNote}>{f.note}</span>
                    <span className={`${s.badge} ${s.badge_concept}`}>{statusLabel(f.status)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 完成イメージの周辺（デスクトップ） */}
          <div className={s.otherCommunities}>
            {[
              { name: "写真のコミュニティ", sub: "カメラ・撮影地・作品", palette: PALETTES.photo },
              { name: "ゲームのコミュニティ", sub: "募集・攻略・雑談", palette: PALETTES.game },
              { name: "スポーツのコミュニティ", sub: "練習記録・試合結果", palette: PALETTES.sports },
            ].map((c) => (
              <div key={c.name} className={s.miniCard} style={toneVars(c.palette)}>
                <span className={`${s.dot} ${s.dotTone}`} />
                <span>
                  <strong>{c.name}</strong>
                  <span className={s.muted}>{c.sub}</span>
                </span>
              </div>
            ))}
          </div>

          {/* プレビュー端末 */}
          <div className={s.previewWrap}>
            <PhoneFrame>
              {/* Scene 4: プロフィール */}
              <div className={`${s.screen} ${s.screenProfile}`} style={toneVars(PALETTES.car)}>
                <div className={s.appBar}>
                  <span className={s.appName}>プロフィール編集</span>
                </div>
                <div className={s.beforeAfter}>
                  <span className={s.baTag} data-ba="before">Before</span>
                  <span className={s.baTag} data-ba="after">After</span>
                </div>
                <div className={s.formBody}>
                  <div className={s.formRow}>
                    <span className={s.formRowLabel}>{PROFILE_BEFORE[0]}</span>
                    <span className={s.formInput}>たくみ</span>
                  </div>
                  {PROFILE_ADDED.map((f) => (
                    <div key={f.label} className={s.formRow} data-added="">
                      <span className={s.formRowLabel}>{f.label}</span>
                      <span className={s.formInput}>{f.value}</span>
                    </div>
                  ))}
                  <div className={s.formRow}>
                    <span className={s.formRowLabel}>{PROFILE_BEFORE[1]}</span>
                    <span className={s.formInput}>週末は洗車とドライブ。</span>
                  </div>
                </div>
              </div>

              {/* Scene 5: 投稿カテゴリ */}
              <div className={`${s.screen} ${s.screenCompose}`} style={toneVars(PALETTES.car)}>
                <div className={s.appBar}>
                  <span className={s.appName}>新しい投稿</span>
                </div>
                <div className={s.beforeAfter}>
                  <span className={s.baTag} data-ba="before">Before</span>
                  <span className={s.baTag} data-ba="after">After</span>
                </div>
                <div className={s.formBody}>
                  <span className={s.formRowLabel}>カテゴリ</span>
                </div>
                <div className={s.catRow}>
                  <span className={`${s.chip} ${s.catBefore}`}>投稿</span>
                  {Object.entries(CAR_CATEGORY_PALETTES).map(([name, pal], i) => (
                    <span
                      key={name}
                      className={`${s.chip} ${s.chipTone} ${i === 0 ? s.chipActive : ""} ${s.catAfter}`}
                      style={toneVars(pal)}
                    >
                      {name}
                    </span>
                  ))}
                </div>
                <div className={s.composeBox}>本文を入力</div>
              </div>

              {/* Scene 6: 完成したコミュニティ */}
              <div className={`${s.screen} ${s.screenFeed}`}>
                <FeedScreen
                  appName="Garage Notes"
                  tabs={["愛車紹介", "整備記録", "ツーリング"]}
                  posts={CAR_FEED_POSTS}
                  brand={PALETTES.car}
                  categoryPalettes={CAR_CATEGORY_PALETTES}
                />
              </div>
            </PhoneFrame>
          </div>

        </div>

        <div className={s.sigMeta} aria-hidden="true">
          <span>画面は開発中の商品のイメージです</span>
          <span className={s.progressTrack}>
            <span className={s.progressBar} style={{ display: "block" }} />
          </span>
        </div>
      </div>
    </div>
  );
}
