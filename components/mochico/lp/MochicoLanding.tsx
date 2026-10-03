// ============================================================
// Mochico 公開 LP（サーバーコンポーネント。主要な内容は JS なしで読める）
//   クライアント側で動くのは「デモ2つ」と「演出（LpEnhancer）」だけ。
// ============================================================
import Link from "next/link";
import { CalendarDays, Images, Share2 } from "lucide-react";
import { BRAND, FAQ } from "@/lib/mochico/content";
import { Mascot } from "../Mascot";
import { PhoneMock } from "./PhoneMock";
import { OwnedDemo } from "./OwnedDemo";
import { ShareDemo } from "./ShareDemo";
import { LpEnhancer } from "./LpEnhancer";
import s from "./lp.module.css";

const ROOT_ID = "mochico-lp";

/** アプリ本体が公開されている環境だけ「はじめる」を有効にする（未公開の本番で壊れた入口へ誘導しない） */
function PrimaryCta({ appEnabled, compact = false }: { appEnabled: boolean; compact?: boolean }) {
  if (appEnabled) {
    return (
      <Link href="/mochico/app" className={s.cta}>
        Mochicoをはじめる
      </Link>
    );
  }
  return (
    <span className={s.ctaSoon} aria-label="Mochicoアプリは近日公開予定です">
      アプリは近日公開
      {!compact && <span aria-hidden="true">・</span>}
      {!compact && <span style={{ fontWeight: 700 }}>準備中</span>}
    </span>
  );
}

export function MochicoLanding({ appEnabled }: { appEnabled: boolean }) {
  return (
    <div id={ROOT_ID} className={s.lp}>
      {/* ---------- 01 Hero ---------- */}
      <section className={s.hero} aria-labelledby="mochico-hero-title" data-companion="hide">
        <div className={`${s.container} ${s.heroGrid}`}>
          <div>
            <p className={s.wordmark}>
              <Mascot size={36} float={false} />
              Mochico <small>モチコ</small>
            </p>
            <h1 id="mochico-hero-title" className={s.h1}>
              推しグッズ、
              <br />
              <em>ぜんぶここに。</em>
            </h1>
            <p className={s.heroTag}>推しグッズを見やすく管理・共有できるアプリ</p>
            <p className={s.heroLead}>
              ライブやイベントのグッズを見やすくまとめて、持っているものをタップするだけ。
              <br />
              <strong>リストはみんなで共有。「持ってる」は、あなただけ。</strong>
            </p>
            <div className={s.heroCtas}>
              <PrimaryCta appEnabled={appEnabled} />
              <a href="#how" className={s.ghost}>
                使い方を見る
              </a>
            </div>
            {!appEnabled && <p className={s.ctaNote}>Mochicoアプリは現在公開準備中です。公開までもう少しお待ちください。</p>}
          </div>
          <div className={s.heroVisual}>
            <span className={s.heroMascot}>
              <Mascot size={72} />
            </span>
            <PhoneMock />
          </div>
        </div>
      </section>

      {/* ---------- 02 Mochicoとは ---------- */}
      <section className={s.section} aria-labelledby="about-title" data-companion="idle">
        <div className={s.container}>
          <header data-reveal="">
            <p className={s.eyebrow}>Mochicoとは</p>
            <h2 id="about-title" className={s.h2}>
              ライブ・イベントのグッズ管理を、
              <br />
              写真つきの一覧でひと目で。
            </h2>
            <p className={s.lead}>
              Mochicoは、推し活のグッズ管理のためのアプリです。イベントごとにグッズをまとめ、写真・名前・価格・概要を一覧で表示。どれを持っていて、どれがまだなのかがすぐ分かります。
            </p>
          </header>
          <div className={s.points}>
            <article className={s.point} data-reveal="">
              <span className={s.pointIcon}>
                <CalendarDays size={20} aria-hidden="true" />
              </span>
              <h3>イベントごとに整理</h3>
              <p>ツアーや公演ごとにリストを作成。会場限定やランダムグッズも、カテゴリをつけて見やすく並べられます。</p>
            </article>
            <article className={s.point} data-reveal="">
              <span className={s.pointIcon}>
                <Images size={20} aria-hidden="true" />
              </span>
              <h3>写真つきで、ひと目で分かる</h3>
              <p>グッズの写真をそのまま一覧に。スマートフォンで撮った写真は自動で縮小され、位置情報は保存されません。</p>
            </article>
            <article className={s.point} data-reveal="">
              <span className={s.pointIcon}>
                <Share2 size={20} aria-hidden="true" />
              </span>
              <h3>リストは仲間と共有</h3>
              <p>作ったリストはURLで共有できます。受け取った人は、自分の管理に追加してそのまま使えます。</p>
            </article>
          </div>
        </div>
      </section>

      {/* ---------- 03 持ってるをタップ（体験デモ） ---------- */}
      <section className={s.section} style={{ paddingTop: 0 }} aria-labelledby="demo-title" data-companion="peek">
        <div className={`${s.container} ${s.demoWrap}`}>
          <header data-reveal="">
            <p className={s.eyebrow}>持ってるグッズ管理</p>
            <h2 id="demo-title" className={s.h2}>
              「持ってる」は、
              <br />
              タップするだけ。
            </h2>
            <p className={s.lead}>確認ダイアログは出しません。タップした瞬間に印がつき、取得数とパーセントもすぐ更新。間違えても「元に戻す」で戻せます。</p>
            <ul className={s.stepList}>
              <li>
                <span className={s.check} aria-hidden="true">✓</span>
                <span>
                  <b>色だけに頼らない表示。</b>取得済みはチェック・文字・枠の3つで分かります。
                </span>
              </li>
              <li>
                <span className={s.check} aria-hidden="true">✓</span>
                <span>
                  <b>すべて / 未取得 / 取得済み</b>で絞り込んで、まだ手に入れていないものだけを確認できます。
                </span>
              </li>
            </ul>
          </header>
          <div data-reveal="">
            <OwnedDemo />
          </div>
        </div>
      </section>

      {/* ---------- 04 共有 ---------- */}
      <section className={`${s.section} ${s.shareBg}`} aria-labelledby="share-title" data-companion="share">
        <div className={s.container}>
          <header className={s.center} data-reveal="">
            <p className={s.eyebrow}>推しグッズを共有</p>
            <h2 id="share-title" className={s.h2}>
              リストはみんなで。
              <span className={s.catchLine}>持ってるものは、自分だけ。</span>
            </h2>
            <p className={s.lead}>
              誰かが作ったグッズリストを、仲間と同じように使えます。グッズの一覧は1つを共有し、人数分コピーはしません。だから作った人がグッズを追加・修正すると、みんなのリストにもそのまま反映されます。
            </p>
          </header>
          <div data-reveal="">
            <ShareDemo />
          </div>
        </div>
      </section>

      {/* ---------- 05 重複購入を防ぐ / 利用シーン ---------- */}
      <section className={s.section} aria-labelledby="cases-title" data-companion="idle">
        <div className={s.container}>
          <header data-reveal="">
            <p className={s.eyebrow}>使い方のイメージ</p>
            <h2 id="cases-title" className={s.h2}>
              買い忘れも、
              <br />
              グッズの重複購入も防ぐ。
            </h2>
          </header>
          <div className={s.cases}>
            <article className={s.case} data-reveal="">
              <span className={s.caseTag}>物販の列で</span>
              <h3>買ったその場で「取得済み」に</h3>
              <p>長い物販の列でも片手で操作できます。並んでいる間に一覧を見て、まだ持っていないグッズだけを確認。</p>
            </article>
            <article className={s.case} data-reveal="">
              <span className={s.caseTag}>通販と会場で</span>
              <h3>同じものを二度買わない</h3>
              <p>通販で買ったものも会場で買ったものも、同じリストで管理。注文の前に写真で確認できるから、うっかり重複を防げます。</p>
            </article>
            <article className={s.case} data-reveal="">
              <span className={s.caseTag}>コレクションに</span>
              <h3>ランダムグッズの集まり具合も</h3>
              <p>缶バッジやトレカなどの種類を1つずつ登録しておけば、どれが揃っていてどれがまだかがすぐ分かります。</p>
            </article>
          </div>
        </div>
      </section>

      {/* ---------- 06 実画面 ---------- */}
      <section className={s.section} style={{ paddingTop: 0 }} aria-labelledby="shots-title" data-companion="idle">
        <div className={s.container}>
          <header className={s.center} data-reveal="">
            <p className={s.eyebrow}>Mochicoの実画面</p>
            <h2 id="shots-title" className={s.h2}>スマートフォンで、気持ちよく。</h2>
          </header>
          <div className={s.shots}>
            <figure className={s.shot}>
              {/* eslint-disable-next-line @next/next/no-img-element -- 静的な小さい WebP（遅延読込） */}
              <img src="/mochico/shots/event.webp" alt="イベント画面。グッズが写真つきで2列に並び、取得数とパーセントが表示されている" width={390} height={780} loading="lazy" decoding="async" />
              <figcaption>イベントのグッズ一覧</figcaption>
            </figure>
            <figure className={s.shot}>
              {/* eslint-disable-next-line @next/next/no-img-element -- 静的な小さい WebP（遅延読込） */}
              <img src="/mochico/shots/share.webp" alt="共有シート。共有URLのコピーと、共有の停止ができる" width={390} height={780} loading="lazy" decoding="async" />
              <figcaption>リストの共有</figcaption>
            </figure>
            <figure className={s.shot}>
              {/* eslint-disable-next-line @next/next/no-img-element -- 静的な小さい WebP（遅延読込） */}
              <img src="/mochico/shots/events.webp" alt="マイイベント画面。イベントごとに取得数と進み具合が表示されている" width={390} height={780} loading="lazy" decoding="async" />
              <figcaption>マイイベント</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ---------- 07 使い方 ---------- */}
      <section id="how" className={s.section} style={{ paddingTop: 0, scrollMarginTop: 64 }} aria-labelledby="how-title" data-companion="idle">
        <div className={s.container}>
          <header className={s.center} data-reveal="">
            <p className={s.eyebrow}>使い方</p>
            <h2 id="how-title" className={s.h2}>はじめ方は、3ステップ。</h2>
          </header>
          <ol className={s.steps}>
            <li data-reveal="">
              <h3>イベントをつくる</h3>
              <p>ライブやイベントの名前と日付を入れるだけ。共有されたリストがあれば、「自分の管理に追加」でもOK。</p>
            </li>
            <li data-reveal="">
              <h3>グッズを登録する</h3>
              <p>写真・名前・価格を入れて登録。「保存して続けて追加」で、物販のラインナップをどんどん入力できます。</p>
            </li>
            <li data-reveal="">
              <h3>持ってるをタップ</h3>
              <p>手に入れたらタップ。取得数とパーセントで、コンプリートまでの距離がひと目で分かります。</p>
            </li>
          </ol>
        </div>
      </section>

      {/* ---------- 08 FAQ ---------- */}
      <section className={`${s.section} ${s.shareBg}`} aria-labelledby="faq-title" data-companion="idle">
        <div className={s.container}>
          <header className={s.center} data-reveal="">
            <p className={s.eyebrow}>よくある質問</p>
            <h2 id="faq-title" className={s.h2}>Mochicoについての質問</h2>
          </header>
          <div className={s.faq}>
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 09 Final CTA ---------- */}
      <section className={s.final} aria-labelledby="final-title" data-companion="hide">
        <div className={s.container}>
          <div className={s.finalMascot}>
            <Mascot size={90} />
          </div>
          <h2 id="final-title" className={s.h2}>
            推しグッズ、
            <br />
            見やすく管理しよう。
          </h2>
          <p className={s.lead}>{BRAND.catch}</p>
          <div style={{ marginTop: 28, display: "flex", justifyContent: "center" }}>
            <PrimaryCta appEnabled={appEnabled} />
          </div>
          {!appEnabled && <p className={s.ctaNote}>公開の準備ができしだい、このページからご利用いただけます。</p>}
          <p className={s.legal}>Mochicoは ToolBoxJP が提供するサービスです。</p>
        </div>
      </section>

      <LpEnhancer rootId={ROOT_ID} />
    </div>
  );
}
