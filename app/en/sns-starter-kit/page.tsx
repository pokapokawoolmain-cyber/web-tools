import type { Metadata } from "next";
import Link from "next/link";
import { CommunityDemo, PhoneFeed } from "./CommunityDemo";
import {
  DEMO_COMMUNITIES, EN, EN_WAITLIST_OPEN, FAQ, FEATURES, FIT, PRICE_INCLUDES, PROTECTED_CORE, RUNNING_COSTS,
  STANDARD_PATH, STEPS,
} from "./content";
import s from "./en.module.css";

// ============================================================
// SNS Starter Kit — English landing page (US / English-speaking markets).
// Dedicated design, written natively in English. Unlisted (noindex) and waitlist-closed until
// the English Edition and the English legal pages (terms, refunds, privacy) pass their gates.
// ============================================================

export const metadata: Metadata = {
  title: { absolute: "SNS Starter Kit — Launch a members-only community you actually own" },
  description:
    "A Next.js + Supabase foundation for members-only community networks: auth, posts, blocks, reports and an admin console — with database-enforced security and guardrails for building with AI.",
  alternates: { canonical: EN.canonical, languages: { en: EN.canonical, ja: "https://www.toolboxjp.com/sns-starter-kit" } },
  robots: { index: false, follow: false },
  openGraph: {
    title: "SNS Starter Kit — Your community. Your platform. Your rules.",
    description: "Launch a members-only community network on your own Supabase and Vercel. Shape it with AI — without letting AI touch your security.",
    url: EN.canonical,
    locale: "en_US",
    type: "website",
  },
};

const VERIFY_LINES: { mark: "pass" | "fail" | "skip"; name: string; label: string }[] = [
  { mark: "pass", name: "guard", label: "protected files · risky SQL · secrets" },
  { mark: "pass", name: "config", label: "community.config.ts & content" },
  { mark: "pass", name: "typecheck", label: "types" },
  { mark: "pass", name: "lint", label: "code style" },
  { mark: "pass", name: "unit", label: "config · theme · guard internals" },
  { mark: "pass", name: "db", label: "RLS · storage · roles · blocks · reports · limits" },
  { mark: "pass", name: "build", label: "production build" },
  { mark: "pass", name: "guard:build", label: "no secrets in shipped JS" },
  { mark: "skip", name: "smoke", label: "start the app, click through key screens" },
];

function Cta({ variant = "primary", children, href }: { variant?: "primary" | "ghost"; children: React.ReactNode; href: string }) {
  return (
    <a href={href} className={variant === "primary" ? `${s.btn} ${s.btnPrimary}` : `${s.btn} ${s.btnGhost}`}>
      {children}
    </a>
  );
}

export default function EnglishLandingPage() {
  const hero = DEMO_COMMUNITIES[0]!;
  return (
    <div lang="en" className={s.root}>
      <nav className={s.nav} aria-label="Primary">
        <div className={s.navInner}>
          <a href="#top" className={s.wordmark}>
            <span className={s.mark} aria-hidden="true" />
            SNS Starter Kit
          </a>
          <div className={s.navLinks}>
            <a href="#demo">Demo</a>
            <a href="#guardrails">Guardrails</a>
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
          <a href="#early-access" className={`${s.btn} ${s.btnPrimary} ${s.navCta}`}>Get early access</a>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <header id="top" className={s.hero}>
        <div className={s.heroGlow} aria-hidden="true" />
        <div className={`${s.wrap} ${s.heroGrid}`}>
          <div>
            <p className={s.pill}><span className={s.pillDot} /> English Edition · coming soon</p>
            <h1 className={s.h1}>
              Your community.<br />Your platform.<br /><span className={s.h1Accent}>Your rules.</span>
            </h1>
            <p className={s.lede}>
              A members-only community network you deploy to your own Supabase and Vercel — sign-up, posts, blocks,
              reports and an admin console already built, with security enforced in the database. Then shape it to your
              people by describing changes to Claude Code.
            </p>
            <div className={s.heroCtas}>
              <Cta href="#early-access">Get early access</Cta>
              <Cta href="#demo" variant="ghost">See it adapt →</Cta>
            </div>
            <ul className={s.heroMeta}>
              <li>One-time purchase</li>
              <li>You own the code &amp; data</li>
              <li>macOS · Apple silicon</li>
            </ul>
          </div>
          <div className={s.heroVisual}>
            <PhoneFeed c={hero} />
            <div className={`${s.float} ${s.floatA}`} aria-hidden="true">
              <b>RLS</b> enabled on every table
            </div>
            <div className={`${s.float} ${s.floatB}`} aria-hidden="true">
              <span className={s.okDot} /> verify:full — 9 / 9 PASS
            </div>
          </div>
        </div>
        <div className={`${s.wrap} ${s.stack}`} aria-label="Built on">
          <span>Built on</span>
          <b>Next.js</b>
          <b>Supabase Postgres</b>
          <b>Row-Level Security</b>
          <b>Vercel</b>
          <b>Claude Code–ready</b>
        </div>
      </header>

      {/* ── PROBLEM ──────────────────────────────────────── */}
      <section className={s.section} aria-labelledby="why-title">
        <div className={s.wrap}>
          <p className={s.eyebrow}>Why it exists</p>
          <h2 id="why-title" className={s.h2}>Every growing community hits the same wall.</h2>
          <div className={s.trio}>
            <article className={s.card}>
              <p className={s.cardKicker}>Group chats</p>
              <h3>Everything important scrolls away.</h3>
              <p>Announcements vanish under small talk. Nothing is organized, nothing is searchable, and new members start from zero.</p>
            </article>
            <article className={s.card}>
              <p className={s.cardKicker}>Platforms</p>
              <h3>Someone else owns your members.</h3>
              <p>Their branding, their algorithm, their moderation rules — and their export button, if there is one.</p>
            </article>
            <article className={s.card}>
              <p className={s.cardKicker}>Building from scratch</p>
              <h3>Security is where it quietly breaks.</h3>
              <p>A feed demo takes a weekend. Making sure no one can edit another member&apos;s post, or see someone who blocked them, takes far longer — and bugs here don&apos;t show up on screen.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ── DEMO ─────────────────────────────────────────── */}
      <section id="demo" className={`${s.section} ${s.sectionTint}`} aria-labelledby="demo-title">
        <div className={s.wrap}>
          <p className={s.eyebrow}>One foundation, any community</p>
          <h2 id="demo-title" className={s.h2}>Make it feel like yours in a single file.</h2>
          <p className={s.sub}>
            Name, colors, the words on every button, categories and custom profile fields all live in one typed config.
            Pick a community to see the same kit become something different.
          </p>
          <CommunityDemo />
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className={s.section} aria-labelledby="features-title">
        <div className={s.wrap}>
          <p className={s.eyebrow}>Day-one foundation</p>
          <h2 id="features-title" className={s.h2}>The parts every real community needs. Already done.</h2>
          <div className={s.featureGrid}>
            {FEATURES.map((f) => (
              <article key={f.title} className={s.feature}>
                <span className={s.check} aria-hidden="true" />
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── GUARDRAILS (signature) ───────────────────────── */}
      <section id="guardrails" className={`${s.section} ${s.dark}`} aria-labelledby="guard-title">
        <div className={s.wrap}>
          <p className={`${s.eyebrow} ${s.eyebrowDark}`}>Built for building with AI</p>
          <h2 id="guard-title" className={s.h2}>
            Let AI change your product.<br />
            <span className={s.dim}>Not your security.</span>
          </h2>
          <p className={`${s.sub} ${s.subDark}`}>
            AI coding tools are fast and confident — including when they&apos;re about to loosen a database policy. The kit
            splits every change into two lanes, and makes crossing between them impossible to miss.
          </p>
          <div className={s.lanes}>
            <div className={`${s.lane} ${s.laneOpen}`}>
              <p className={s.laneTag}>Standard path · change freely</p>
              <ul>{STANDARD_PATH.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
            <div className={`${s.lane} ${s.laneLocked}`}>
              <p className={s.laneTag}>Protected core · fingerprinted</p>
              <ul>{PROTECTED_CORE.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          </div>
          <div className={s.locks}>
            <article>
              <p className={s.lockN}>1</p>
              <h3>guard</h3>
              <p>Compares protected files to their shipped fingerprints and scans SQL for risky patterns — disabling RLS, granting the anonymous role, making storage public.</p>
            </article>
            <article>
              <p className={s.lockN}>2</p>
              <h3>Git pre-commit hook</h3>
              <p>A commit that changes protected files without a recorded reason doesn&apos;t go through.</p>
            </article>
            <article>
              <p className={s.lockN}>3</p>
              <h3>Claude Code hook</h3>
              <p>When an AI edit reaches a protected file, it stops and asks you first. Need to change the core anyway? Record why, and the change stays visible from then on.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ── VERIFY ───────────────────────────────────────── */}
      <section className={s.section} aria-labelledby="verify-title">
        <div className={`${s.wrap} ${s.verifyGrid}`}>
          <div>
            <p className={s.eyebrow}>Proof, not promises</p>
            <h2 id="verify-title" className={s.h2}>It doesn&apos;t ask “does it work?” It asks “can a stranger break it?”</h2>
            <p className={s.sub}>
              <code>verify:full</code> runs a database security suite against your real project: one member tries to edit
              another&apos;s post, reply past a block, upload into someone else&apos;s folder, post while suspended — and every
              attempt is expected to fail.
            </p>
            <dl className={s.stats}>
              <div><dt>60+</dt><dd>database security tests</dd></div>
              <div><dt>3</dt><dd>result states — PASS, FAIL, NOT RUN</dd></div>
              <div><dt>0</dt><dd>“skipped” checks reported as passing</dd></div>
            </dl>
          </div>
          <figure className={s.terminal}>
            <figcaption className={s.codeTitle}>
              <span className={s.dots}><i /><i /><i /></span>
              Terminal — npm run verify:full
            </figcaption>
            <pre className={s.termBody}>
              <code>
                {VERIFY_LINES.map((l) => (
                  <span key={l.name} className={s.termLine}>
                    <span className={l.mark === "pass" ? s.mPass : l.mark === "fail" ? s.mFail : s.mSkip}>
                      {l.mark === "pass" ? "✓ PASS   " : l.mark === "fail" ? "✗ FAIL   " : "- NOT RUN"}
                    </span>{" "}
                    {l.name.padEnd(12)}
                    <span className={s.tDim}>{l.label}</span>
                    {"\n"}
                  </span>
                ))}
                {"\n"}
                <span className={s.mSkip}>verify:full: incomplete (NOT RUN: smoke)</span>
                {"\n"}
                <span className={s.tDim}>— unchecked items are never counted as OK</span>
              </code>
            </pre>
            <p className={s.figNote}>Illustrative output. A single FAIL or NOT RUN means the run is not OK.</p>
          </figure>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section id="how" className={`${s.section} ${s.sectionTint}`} aria-labelledby="how-title">
        <div className={s.wrap}>
          <p className={s.eyebrow}>How it works</p>
          <h2 id="how-title" className={s.h2}>An afternoon from download to live.</h2>
          <p className={s.sub}>Plan on 3–4 hours end to end, most of it waiting for your domain&apos;s email records to propagate. Every step has a check that tells you it worked.</p>
          <ol className={s.steps}>
            {STEPS.map((st) => (
              <li key={st.n} className={s.step}>
                <span className={s.stepN}>{st.n}</span>
                <h3>{st.title}</h3>
                <p>{st.body}</p>
                <span className={s.stepTime}>{st.time}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── FIT & COSTS ──────────────────────────────────── */}
      <section className={s.section} aria-labelledby="fit-title">
        <div className={s.wrap}>
          <p className={s.eyebrow}>Straight answers</p>
          <h2 id="fit-title" className={s.h2}>Is it right for you?</h2>
          <div className={s.fit}>
            <div className={s.fitCol}>
              <h3 className={s.fitYes}>Made for you if…</h3>
              <ul>{FIT.for.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
            <div className={s.fitCol}>
              <h3 className={s.fitNo}>Look elsewhere if…</h3>
              <ul>{FIT.notFor.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          </div>
          <div className={s.costs}>
            <h3>What you&apos;ll pay others to run it</h3>
            <p className={s.costsLead}>The kit is a one-time purchase. Hosting and email are your own accounts, billed by those providers — we don&apos;t mark anything up.</p>
            <table className={s.costTable}>
              <tbody>
                {RUNNING_COSTS.map((r) => (
                  <tr key={r.item}><th scope="row">{r.item}</th><td>{r.note}</td></tr>
                ))}
              </tbody>
            </table>
            <p className={s.fine}>Plans and limits are set by each provider and can change. Check their pricing pages before you sign up.</p>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────── */}
      <section id="pricing" className={`${s.section} ${s.sectionTint}`} aria-labelledby="pricing-title">
        <div className={s.wrap}>
          <p className={s.eyebrow}>Pricing</p>
          <h2 id="pricing-title" className={s.h2}>Pay once. Own it.</h2>
          <div className={s.priceCard}>
            <div className={s.priceHead}>
              <p className={s.priceName}>{EN.name} · {EN.edition}</p>
              <p className={s.priceFigure}>Launch price<br /><span>announced to early access first</span></p>
              <p className={s.priceSub}>One-time purchase · no subscription · secure checkout by Stripe</p>
            </div>
            <ul className={s.priceList}>{PRICE_INCLUDES.map((x) => <li key={x}>{x}</li>)}</ul>
            <a href="#early-access" className={`${s.btn} ${s.btnPrimary} ${s.btnBlock}`}>Get early access</a>
            <p className={s.fine}>You receive the version current at purchase; future updates aren&apos;t guaranteed. Full terms, license and refund policy are published before sales open.</p>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section id="faq" className={s.section} aria-labelledby="faq-title">
        <div className={`${s.wrap} ${s.narrow}`}>
          <p className={s.eyebrow}>FAQ</p>
          <h2 id="faq-title" className={s.h2}>Questions, answered honestly.</h2>
          <div className={s.faq}>
            {FAQ.map((f) => (
              <details key={f.q} className={s.faqItem}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── EARLY ACCESS ─────────────────────────────────── */}
      <section id="early-access" className={`${s.section} ${s.finale}`} aria-labelledby="ea-title">
        <div className={`${s.wrap} ${s.narrow} ${s.center}`}>
          <h2 id="ea-title" className={s.h2}>Start where most community projects stall.</h2>
          <p className={s.sub}>
            The English Edition is being prepared now. Early access members hear about launch pricing first.
          </p>
          {EN_WAITLIST_OPEN ? null : (
            <p className={s.eaClosed}>
              Early-access sign-up opens together with our English privacy notice — we won&apos;t collect an email address before
              you can read exactly how we&apos;ll use it.
            </p>
          )}
          <p className={s.fine}>
            Reading Japanese? The Japanese edition is available now — <Link href={EN.jaPath} lang="ja">日本語版はこちら</Link>.
          </p>
        </div>
      </section>

      <footer className={s.footer}>
        <div className={`${s.wrap} ${s.footerInner}`}>
          <span>© akamaru Corp. · ToolBoxJP</span>
          <span className={s.footerLinks}>
            <Link href="/" lang="ja">ToolBoxJP</Link>
            <Link href={EN.jaPath} lang="ja">日本語</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
