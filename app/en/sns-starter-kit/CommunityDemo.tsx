"use client";

import { useState, type CSSProperties } from "react";
import { DEMO_COMMUNITIES, type DemoCommunity } from "./content";
import s from "./en.module.css";

// Interactive "one config, any community" demo. All data is fictional and rendered with
// HTML/CSS only (no screenshots of real products).

export function PhoneFeed({ c, compact = false }: { c: DemoCommunity; compact?: boolean }) {
  const vars = { "--c-accent": c.accent, "--c-soft": c.accentSoft } as CSSProperties;
  return (
    <div className={s.phone} style={vars} aria-hidden="true">
      <div className={s.phoneScreen}>
        <div className={s.phoneStatus}>
          <span>9:41</span>
          <span className={s.phoneIsland} />
          <span className={s.phoneBars} />
        </div>
        <div className={s.appBar}>
          <span className={s.appLogo}>{c.name.charAt(0)}</span>
          <span className={s.appName}>{c.name}</span>
          <span className={s.appAction}>{c.postButton}</span>
        </div>
        <div className={s.chips}>
          <span className={`${s.chip} ${s.chipOn}`}>All</span>
          {c.categories.slice(0, 3).map((x) => (
            <span key={x} className={s.chip}>{x}</span>
          ))}
        </div>
        <div className={s.feed}>
          {c.posts.slice(0, compact ? 2 : 3).map((p) => (
            <div key={p.author} className={s.post}>
              <div className={s.postHead}>
                <span className={s.avatar} style={{ background: p.color }}>{p.initial}</span>
                <span className={s.postWho}>
                  <b>{p.author}</b>
                  <small>{p.category} · {p.time}</small>
                </span>
              </div>
              <p className={s.postBody}>{p.body}</p>
              {p.image && <div className={s.postImage} style={{ background: p.image }} />}
              <div className={s.postMeta}>
                <span>{p.replies} replies</span>
                <span>Report</span>
              </div>
            </div>
          ))}
        </div>
        <div className={s.tabBar}>
          <i className={s.tabOn} />
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  );
}

function ConfigCard({ c }: { c: DemoCommunity }) {
  return (
    <figure className={s.codeCard}>
      <figcaption className={s.codeTitle}>
        <span className={s.dots}><i /><i /><i /></span>
        src/config/community.config.ts
      </figcaption>
      <pre className={s.code}>
        <code>
          <span className={s.tk}>const</span> config = {"{\n"}
          {"  "}name: <span className={s.ts}>&quot;{c.name}&quot;</span>,{"\n"}
          {"  "}tagline: <span className={s.ts}>&quot;{c.tagline}&quot;</span>,{"\n"}
          {"  "}theme: {"{ "}accent: <span className={s.ts}>&quot;{c.accent}&quot;</span>, radius: <span className={s.ts}>&quot;round&quot;</span> {"},\n"}
          {"  "}terms: {"{ "}member: <span className={s.ts}>&quot;{c.member}&quot;</span>, post: <span className={s.ts}>&quot;{c.post}&quot;</span>, postButton: <span className={s.ts}>&quot;{c.postButton}&quot;</span> {"},\n"}
          {"  "}categories: [{"\n"}
          {c.categories.map((x) => (
            <span key={x}>
              {"    { "}id: <span className={s.ts}>&quot;{x.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "")}&quot;</span>, label: <span className={s.ts}>&quot;{x}&quot;</span>{" },\n"}
            </span>
          ))}
          {"  ],\n"}
          {"  "}profileFields: [{"\n"}
          {c.configFields.map((f) => (
            <span key={f}>{"    "}{f},{"\n"}</span>
          ))}
          {"  ],\n"}
          {"};"}
        </code>
      </pre>
    </figure>
  );
}

export function CommunityDemo() {
  const [i, setI] = useState(0);
  const c = DEMO_COMMUNITIES[i]!;
  return (
    <div className={s.demo}>
      <div role="tablist" aria-label="Example communities" className={s.demoTabs}>
        {DEMO_COMMUNITIES.map((d, k) => (
          <button
            key={d.id}
            role="tab"
            type="button"
            aria-selected={k === i}
            aria-controls="demo-panel"
            className={k === i ? `${s.demoTab} ${s.demoTabOn}` : s.demoTab}
            onClick={() => setI(k)}
          >
            {d.tab}
          </button>
        ))}
      </div>
      <div id="demo-panel" role="tabpanel" className={s.demoBody}>
        <ConfigCard c={c} />
        <div className={s.demoArrow} aria-hidden="true">→</div>
        <div className={s.demoPhoneWrap}>
          <PhoneFeed key={c.id} c={c} />
          <div className={s.profileCard} aria-hidden="true" style={{ "--c-accent": c.accent } as CSSProperties}>
            <p className={s.profileLabel}>Profile fields</p>
            {c.profileFields.map((f) => (
              <p key={f.label} className={s.profileRow}>
                <span>{f.label}</span>
                <b>{f.value}</b>
              </p>
            ))}
          </div>
        </div>
      </div>
      <p className={s.demoNote}>
        Real config shape, fictional communities. Change the file, run one command to sync, and every screen follows — no
        component code touched.
      </p>
    </div>
  );
}
