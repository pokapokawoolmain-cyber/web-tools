import { ArrowDown, Check, Lock, PenLine, X } from "lucide-react";
import {
  BLANK_PROJECT_ITEMS,
  COMMUNITY_EXAMPLES,
  CONFIRMED_ENVIRONMENT,
  FOUNDATION_FEATURES,
  NOT_INCLUDED,
  PACKAGE_ITEMS,
  PRICE_TERMS,
  PRODUCT,
  REQUIREMENTS,
  SAFE_CHANGES,
  SENSITIVE_AREAS,
  STEPS,
  SUPPORTED_CANDIDATES,
  statusLabel,
  type ClaimStatus,
} from "@/lib/sns-starter-kit/content";
import { HeroPhone } from "./PhoneMock";
import { Phrase } from "./Phrase";
import { toneVars } from "./tone";
import s from "./lp.module.css";

// ============================================================
// SNS Starter Kit LP — サーバーコンポーネントのセクション群。
// 表示内容の確度（確認済み/予定/構成案）は lib/sns-starter-kit/content.ts が決める。
// ============================================================

export function StatusBadge({ status }: { status: ClaimStatus }) {
  return <span className={`${s.badge} ${s[`badge_${status}`]}`}>{statusLabel(status)}</span>;
}

function SectionHead({ eyebrow, title, lead, id }: { eyebrow: string; title: string; lead?: string; id: string }) {
  return (
    <header data-reveal="">
      <p className={s.eyebrow}>{eyebrow}</p>
      <h2 id={id} className={s.h2}>
        <Phrase text={title} />
      </h2>
      {lead && <p className={s.lead}>{lead}</p>}
    </header>
  );
}

// ── 01 HERO ─────────────────────────────────────────────────
export function Hero() {
  return (
    <section className={s.hero} aria-labelledby="hero-title" data-hero="">
      <div className={`${s.container} ${s.heroGrid}`}>
        <div>
          <p className={s.heroStatus}>{PRODUCT.saleState}</p>
          <h1 id="hero-title" className={s.heroTitle}>
            <Phrase text={"自分の|コミュニティに|合う|SNSを、\n自分の|環境で。"} />
          </h1>
          <p className={s.heroSub}>
            SNSの土台から始めて、AIと一緒に育てる。
            <br />
            AIでWebアプリ開発を試したことがある方向けの、買い切りSNS Starter Kit。
          </p>
          <div className={s.heroPriceRow}>
            <p className={s.heroPrice}>
              {PRODUCT.priceLabel.replace("円", "")}
              <small>円（{PRODUCT.taxLabel}）</small>
            </p>
            <p className={s.heroNote}>サーバー・AIツール等の外部費用は別途必要です</p>
          </div>
          <div className={s.heroCtas}>
            <a href="#reserve" className={`${s.btn} ${s.btnPrimary}`} data-cta="hero">
              先行予約する
            </a>
            <a href="#experience" className={`${s.btn} ${s.btnGhost}`}>
              どんなものか見る
              <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div>
          <div className={s.heroVisual}>
            <HeroPhone />
            <div className={s.floatCard} aria-hidden="true">
              <span className={`${s.badge} ${s.badge_concept}`}>項目は変更できる設計</span>
              <dl>
                <dt>名前</dt>
                <dd>メンバーA</dd>
                <dt>項目 1</dt>
                <dd>コミュニティごと</dd>
                <dt>項目 2</dt>
                <dd>コミュニティごと</dd>
              </dl>
            </div>
          </div>
          <p className={s.heroCaption}>画面は開発中の商品のイメージです</p>
        </div>
      </div>
    </section>
  );
}

// ── 02 PROBLEM ──────────────────────────────────────────────
export function Problem() {
  return (
    <section className={s.section} aria-labelledby="problem-title" data-track="starter_problem_reached">
      <div className={s.container}>
        <SectionHead
          id="problem-title"
          eyebrow="コミュニティの形"
          title={"コミュニティごとに、\n欲しい|プロフィールも、|投稿の形も|違う。"}
        />
        <div className={s.communityRail} role="list" aria-label="コミュニティの例（架空）">
          {COMMUNITY_EXAMPLES.map((c, i) => (
            <article
              key={c.id}
              role="listitem"
              className={s.communityCard}
              data-featured={i === 0 ? "" : undefined}
              data-reveal=""
              aria-label={`${c.name}のコミュニティの例`}
              style={toneVars(c.palette)}
            >
              <div className={s.communityName}>
                <span className={`${s.dot} ${s.dotTone}`} aria-hidden="true" />
                {c.name}
              </div>
              <div>
                <p className={s.fieldLabel}>プロフィール</p>
                <ul className={s.fieldList}>
                  {c.profileFields.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className={s.fieldLabel}>投稿カテゴリ</p>
                <ul className={s.chipRow} style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {c.categories.map((cat) => (
                    <li key={cat} className={`${s.chip} ${s.chipTone}`}>
                      {cat}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
        <p className={s.bigQuote} data-reveal="">
          <em>
            <Phrase text="「SNSを|作りたい」|のではなく、" />
          </em>
          <br />
          <Phrase text="「自分たちに|合う|場所が|欲しい」。" />
        </p>
      </div>
    </section>
  );
}

// ── 03 FOUNDATION ───────────────────────────────────────────
export function Foundation() {
  const verifiedCount = FOUNDATION_FEATURES.filter((f) => f.status === "verified").length;
  return (
    <section className={s.section} aria-labelledby="foundation-title" data-track="starter_transform_reached">
      <div className={s.container}>
        <SectionHead
          id="foundation-title"
          eyebrow="土台"
          title={"ゼロから|作らない。\n土台から|始める。"}
          lead="SNSには、コミュニティの個性とは関係なく必要になる部品がたくさんあります。そこを毎回ゼロから作るのではなく、土台として受け取ってから始めます。"
        />
        <div className={s.compare}>
          <div className={`${s.comparePanel} ${s.blankPanel}`} data-reveal="">
            <h3 className={s.panelTitle}>何もない状態から</h3>
            <p className={s.panelSub}>すべてを自分で設計・実装する</p>
            <ul className={s.checkList}>
              {BLANK_PROJECT_ITEMS.map((item) => (
                <li key={item}>
                  <span className={s.blankItem}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${s.comparePanel} ${s.kitPanel}`} data-reveal="">
            <h3 className={s.panelTitle}>Starter Kitから</h3>
            <p className={s.panelSub}>土台を受け取り、コミュニティに合わせて変える</p>
            <ul className={s.checkList}>
              {FOUNDATION_FEATURES.map((f) => (
                <li key={f.id}>
                  <span className={s.kitItem} data-status={f.status}>
                    {f.label}
                  </span>
                  <StatusBadge status={f.status} />
                </li>
              ))}
            </ul>
            <p className={s.panelFoot}>
              {verifiedCount === 0
                ? "現在はすべて開発予定の項目です。開発・検証が完了したものから「確認済み」として掲載します。"
                : "「確認済み」は開発・検証が完了した項目です。「予定」は検証が完了してから確定します。"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 05 AI SAFETY BOUNDARY ───────────────────────────────────
export function SafetyBoundary() {
  return (
    <section className={s.section} aria-labelledby="safety-title">
      <div className={s.container}>
        <SectionHead
          id="safety-title"
          eyebrow="変更の範囲"
          title={"AIに|任せるためではなく、\nAIと|安全に|変更するために。"}
        />
        <div className={s.zones}>
          <div className={`${s.zone} ${s.zoneSafe}`} data-reveal="">
            <p className={s.zoneHead}>
              <PenLine size={20} aria-hidden="true" />
              変更しやすい場所
            </p>
            <p className={s.zoneSub}>コミュニティの個性に関わる部分。ここから始めます。</p>
            <ul className={s.zoneList}>
              {SAFE_CHANGES.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className={`${s.zone} ${s.zoneSensitive}`} data-reveal="">
            <p className={s.zoneHead}>
              <Lock size={20} aria-hidden="true" />
              慎重に扱う場所
            </p>
            <p className={s.zoneSub}>利用者のデータと安全に関わる部分。変更前に確認が必要です。</p>
            <ul className={s.zoneList}>
              {SENSITIVE_AREAS.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className={s.bigQuote} data-reveal="">
          <Phrase text="触っていい|場所と、|慎重に|扱う|場所を|分ける。" />
          <br />
          <em>
            <Phrase text="それも|Starter Kitの|一部です。" />
          </em>
        </p>
      </div>
    </section>
  );
}

// ── 06 PACKAGE ──────────────────────────────────────────────
export function PackageSection() {
  return (
    <section className={s.section} aria-labelledby="package-title" data-track="starter_features_reached">
      <div className={s.container}>
        <SectionHead id="package-title" eyebrow="内容" title={"SNSを|始めるための、\nひとまとまり。"} />
        <ul className={s.packageGrid} style={{ listStyle: "none", padding: 0 }}>
          {PACKAGE_ITEMS.map((item) => (
            <li key={item.id} className={s.packageItem} data-reveal="">
              <span>{item.label}</span>
              <StatusBadge status={item.status} />
            </li>
          ))}
        </ul>
        <p className={s.note}>
          内容は販売開始までに確定します。「予定」の項目は、開発・検証が完了したものだけを販売時の内容として掲載します。
        </p>
      </div>
    </section>
  );
}

// ── 07 NOT INCLUDED ─────────────────────────────────────────
export function NotIncluded() {
  return (
    <section className={s.section} aria-labelledby="exclude-title" style={{ paddingTop: 0 }}>
      <div className={s.container}>
        <SectionHead
          id="exclude-title"
          eyebrow="含まないもの"
          title="必要なものだけから|始めます。"
          lead="機能を増やすことより、土台を安心して使えることを優先しています。初期版には、次のものを含みません。"
        />
        <ul className={s.excludeList} aria-label="初期版に含まないもの" data-reveal="">
          {NOT_INCLUDED.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── 08 HOW IT WORKS ─────────────────────────────────────────
export function HowItWorks() {
  return (
    <section className={s.section} aria-labelledby="how-title" style={{ background: "var(--surface)" }}>
      <div className={s.container}>
        <SectionHead id="how-title" eyebrow="進め方" title={"受け取ってから、\n公開するまで。"} />
        <ol className={s.steps}>
          {STEPS.map((step, i) => (
            <li key={step.title} className={s.step} data-reveal="">
              <span className={s.stepNum} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className={s.stepTitle}>{step.title}</p>
                <p className={s.stepBody}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ── 09 PREREQUISITES ────────────────────────────────────────
export function Prerequisites() {
  return (
    <section className={s.section} aria-labelledby="prereq-title">
      <div className={s.container}>
        <SectionHead
          id="prereq-title"
          eyebrow="前提条件"
          title={"これは、\n完全初心者向けの|商品では|ありません。"}
          lead="ご自身の環境で動かし、公開後も運用していくための商品です。次のどちらかに当てはまる方を想定しています。"
        />
        <div className={s.targetGrid} data-reveal="">
          <p className={s.targetCard}>AIを使ったWeb開発を、実際に試したことがある方</p>
          <p className={s.targetOr}>または</p>
          <p className={s.targetCard}>導入を担当できる技術協力者がいる方</p>
        </div>
        <dl className={s.reqGrid} data-reveal="">
          {REQUIREMENTS.map((r) => (
            <div key={r.label} className={s.req}>
              <dt>{r.label}</dt>
              <dd>{r.body}</dd>
            </div>
          ))}
        </dl>
        <div className={s.envBox} data-reveal="">
          <p>
            <strong>初期の対応候補：</strong>
            {SUPPORTED_CANDIDATES.join(" / ")}
            <span className={s.muted}>（確定ではありません）</span>
          </p>
          {CONFIRMED_ENVIRONMENT.length === 0 ? (
            <p style={{ marginTop: 6 }}>
              対応するOS・ブラウザ・AI開発環境・バージョンと利用上の制限は、製品の検証が完了してから掲載します。
            </p>
          ) : (
            <dl style={{ marginTop: 6 }}>
              {CONFIRMED_ENVIRONMENT.map((e) => (
                <div key={e.label}>
                  <dt>{e.label}</dt>
                  <dd>{e.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}

// ── 10 PRICE ────────────────────────────────────────────────
export function Price() {
  return (
    <section
      id="price"
      className={`${s.section} ${s.price}`}
      aria-labelledby="price-title"
      data-track="starter_price_reached"
      data-hide-sticky=""
    >
      <div className={s.container}>
        <p className={s.eyebrow}>価格</p>
        <h2 id="price-title" className={s.srOnly}>
          価格
        </h2>
        <div className={s.priceCard} data-reveal="">
          <p className={s.priceName}>
            {PRODUCT.name} {PRODUCT.edition}
          </p>
          <p className={s.priceFigure}>
            49,800<small>円</small>
          </p>
          <p className={s.priceTax}>税込 ・ 買い切り</p>
          <ul className={s.priceTerms}>
            {PRICE_TERMS.map((t) => (
              <li key={t.id}>
                {t.status === "verified" ? <Check size={14} aria-hidden="true" /> : null}
                {t.label}
                {t.status !== "verified" && <StatusBadge status={t.status} />}
              </li>
            ))}
          </ul>
          <p className={s.priceCopy}>
            <Phrase text="ゼロから|SNSを|作るのではなく、" />
            <br />
            <Phrase text="自分の|SNSを|育て始めるための|スタート地点。" />
          </p>
          <div className={s.priceCta}>
            <a href="#reserve" className={`${s.btn} ${s.btnPrimary}`} data-cta="price">
              先行予約する
            </a>
          </div>
          <p className={s.priceNotice}>現在は販売準備中です。先行予約は購入ではありません。</p>
        </div>
      </div>
    </section>
  );
}

export function NotPurchaseList() {
  return (
    <ul className={s.notPurchase}>
      {["購入ではありません", "予約金・前金はかかりません", "購入の義務はありません"].map((x) => (
        <li key={x}>
          <X size={18} aria-hidden="true" style={{ color: "var(--ink-3)" }} />
          {x}
        </li>
      ))}
    </ul>
  );
}
