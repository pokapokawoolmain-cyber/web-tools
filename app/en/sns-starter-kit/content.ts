// ============================================================
// SNS Starter Kit — English landing page content (single source).
//
// Written natively in English for the US / English-speaking market (not a translation of the
// Japanese LP). Every product claim here must match what ships in the kit:
//   - features, checks and counts are taken from the 1.0.0 source (tests/db, scripts/verify.mjs)
//   - nothing about Windows support, guaranteed AI refusals, or "drop in the files and it's done"
// The English edition (English UI, docs and command output) is a launch prerequisite: until it
// ships, this page stays unlisted (noindex) and the waitlist stays closed.
// ============================================================

/** The early-access form opens only after the English privacy notice is published (Legal gate). */
export const EN_WAITLIST_OPEN = false;

export const EN = {
  name: "SNS Starter Kit",
  edition: "English Edition",
  path: "/en/sns-starter-kit",
  canonical: "https://www.toolboxjp.com/en/sns-starter-kit",
  jaPath: "/sns-starter-kit",
} as const;

export interface DemoCommunity {
  id: string;
  tab: string;
  name: string;
  tagline: string;
  accent: string;
  accentSoft: string;
  member: string;
  post: string;
  postButton: string;
  categories: string[];
  profileFields: { label: string; value: string }[];
  /** profileFields as they appear in community.config.ts */
  configFields: string[];
  posts: { author: string; initial: string; color: string; category: string; time: string; body: string; replies: number; image?: string }[];
}

// All communities, people and posts below are fictional.
export const DEMO_COMMUNITIES: DemoCommunity[] = [
  {
    id: "runners",
    tab: "Running club",
    name: "Northside Runners",
    tagline: "Early miles, good company.",
    accent: "#e4572e",
    accentSoft: "#fdebe5",
    member: "Runner",
    post: "Log",
    postButton: "Log it",
    categories: ["Race reports", "Training", "Gear", "Questions"],
    profileFields: [
      { label: "Home course", value: "Lakefront loop" },
      { label: "Weekly miles", value: "24 mi" },
      { label: "Next race", value: "City Half" },
    ],
    configFields: [
      `{ type: "text", key: "course", label: "Home course", maxLength: 40 }`,
      `{ type: "number", key: "miles", label: "Weekly miles", min: 0, max: 200, unit: "mi" }`,
      `{ type: "text", key: "race", label: "Next race", maxLength: 40 }`,
    ],
    posts: [
      { author: "Maya R.", initial: "M", color: "#e4572e", category: "Race reports", time: "12m", body: "Negative split at the 10K this morning. The hill at mile 4 is no joke — thanks for the pacing tips, everyone.", replies: 8 },
      { author: "Dev P.", initial: "D", color: "#2f6fdf", category: "Gear", time: "1h", body: "Anyone tried the new trail shoes on wet pavement? Looking for honest reviews before Saturday.", replies: 5 },
      { author: "Sam K.", initial: "S", color: "#2b9a66", category: "Training", time: "3h", body: "Tuesday tempo group: 6:15am at the boathouse. All paces welcome.", replies: 12 },
    ],
  },
  {
    id: "photo",
    tab: "Photography",
    name: "Golden Hour Collective",
    tagline: "Share the shot. Learn the light.",
    accent: "#b7791f",
    accentSoft: "#fbf1dc",
    member: "Member",
    post: "Shot",
    postButton: "Share",
    categories: ["Showcase", "Critique", "Gear talk", "Locations"],
    profileFields: [
      { label: "Camera", value: "Mirrorless" },
      { label: "Favorite genre", value: "Street" },
    ],
    configFields: [
      `{ type: "select", key: "camera", label: "Camera", options: ["DSLR", "Mirrorless", "Film", "Phone"] }`,
      `{ type: "select", key: "genre", label: "Favorite genre", options: ["Street", "Portrait", "Landscape"] }`,
    ],
    posts: [
      { author: "Lena O.", initial: "L", color: "#b7791f", category: "Showcase", time: "8m", body: "Fog rolled in right at sunset. 35mm, f/2.8, handheld.", replies: 14, image: "linear-gradient(135deg,#f6d38a 0%,#e58f65 45%,#6b5b95 100%)" },
      { author: "Theo W.", initial: "T", color: "#6b5b95", category: "Critique", time: "2h", body: "First attempt at night street. Is the grain too much? Be brutal.", replies: 9 },
    ],
  },
  {
    id: "cars",
    tab: "Car club",
    name: "Weekend Drivers Club",
    tagline: "Builds, drives, and the people behind them.",
    accent: "#c2410c",
    accentSoft: "#fdeadf",
    member: "Driver",
    post: "Post",
    postButton: "Post",
    categories: ["My ride", "Builds & mods", "Drives", "Questions"],
    profileFields: [
      { label: "Make", value: "Mazda" },
      { label: "Model", value: "MX-5" },
      { label: "Year", value: "1991" },
    ],
    configFields: [
      `{ type: "select", key: "make", label: "Make", options: ["Mazda", "Toyota", "Honda", "Other"] }`,
      `{ type: "text", key: "model", label: "Model", maxLength: 40 }`,
      `{ type: "number", key: "year", label: "Year", min: 1950, max: 2030 }`,
    ],
    posts: [
      { author: "Chris A.", initial: "C", color: "#c2410c", category: "Drives", time: "25m", body: "Coast road run on Sunday — meeting at the overlook, 7am. Bring coffee.", replies: 21, image: "linear-gradient(135deg,#9bd3f3 0%,#5f9fd6 40%,#2f3e56 100%)" },
      { author: "Priya N.", initial: "P", color: "#0f766e", category: "Builds & mods", time: "4h", body: "Finally swapped the bushings. Steering feels brand new.", replies: 6 },
    ],
  },
];

export const FEATURES: { title: string; body: string }[] = [
  { title: "Email sign-up & password reset", body: "Confirmation links that survive corporate email scanners — members click a button, not a prefetched link." },
  { title: "Profiles, your way", body: "Up to eight custom profile fields — text, number or select — defined in one config file." },
  { title: "Posts, replies & images", body: "Categories, image uploads and reply threads, with length limits and per-member rate limits enforced in the database." },
  { title: "Block that actually blocks", body: "Blocked members can't see each other's posts, profiles or replies — and can't reply. Enforced by policy, not by hiding UI." },
  { title: "Reports & auto-hide", body: "Members report posts, replies or people. Content reported by enough different members hides itself until you review it." },
  { title: "Admin console", body: "Review reports, hide or restore content, suspend or ban members — every moderator action lands in an audit log." },
  { title: "Private image storage", body: "Uploads live in a private bucket. Blocks, deletions and bans apply to images too." },
  { title: "Self-serve account deletion", body: "Members can delete their own account. Moderation records stay — with personal details stripped out." },
];

export const PROTECTED_CORE = [
  "Authentication & sessions",
  "Row-level security policies",
  "Core database tables",
  "Storage policies",
  "Admin roles & permissions",
  "Secrets & environment",
  "The checks themselves",
];

export const STANDARD_PATH = [
  "Name, logo, colors, fonts",
  "Words: “post”, “member”, buttons",
  "Categories & profile fields",
  "Feature switches & limits",
  "Rules, terms, privacy pages",
  "New features as Extensions",
];

export const STEPS: { n: string; title: string; body: string; time: string }[] = [
  { n: "01", title: "Set up your accounts", body: "Create a Supabase project and a Vercel account. Write your keys to a local .env file with one command — never paste them into a chat.", time: "~1 hour" },
  { n: "02", title: "Run it locally", body: "Install, start the app, create your first admin. Guided scripts check each step and tell you what's missing.", time: "~30 min" },
  { n: "03", title: "Connect email & verify", body: "Plug in an SMTP provider on your own domain, then run the full check — including the database security suite.", time: "1–2 hours, incl. DNS" },
  { n: "04", title: "Go live, then make it yours", body: "Deploy to Vercel. From here, describe what you want to Claude Code and review each change it makes.", time: "~45 min" },
];

export const FIT = {
  for: [
    "You run a club, fan community or hobby group that has outgrown a group chat",
    "You've built something with AI tools and are comfortable pasting commands into a terminal",
    "You want your members' data in accounts you own",
    "You want to shape the product by describing changes — and still review them",
  ],
  notFor: [
    "You need a hosted, ready-to-use platform with no setup",
    "You need direct messages or push notifications on day one",
    "You're building a large public network for millions of users",
    "You're on Windows or Linux (we only verify on macOS with Apple silicon)",
  ],
};

export const RUNNING_COSTS: { item: string; note: string }[] = [
  { item: "Supabase", note: "Free plan to start; a paid plan is often needed once real members join." },
  { item: "Vercel", note: "Free hobby plan for testing; commercial use generally needs a paid plan." },
  { item: "Email (SMTP)", note: "Many providers have a free tier. Requires a domain you own." },
  { item: "Your domain", note: "Required for sending sign-up and password-reset email." },
  { item: "Claude Code", note: "Optional, billed by Anthropic. The rules for AI live in AGENTS.md, so other coding agents can follow them too." },
];

export const PRICE_INCLUDES = [
  "Full source code (Next.js + Supabase)",
  "License for 1 production project",
  "Unlimited private dev, staging & test environments",
  "Setup guide, safe-change guide, troubleshooting",
  "Database security test suite (verify:full)",
  "30 days of email support after purchase",
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Do I need to be a developer?",
    a: "You don't need to write code, but you will paste commands into a terminal and click through the Supabase and Vercel dashboards, following a step-by-step guide. If you've built anything with an AI coding tool before, you're the person this was made for.",
  },
  {
    q: "Does it work on Windows?",
    a: "We only verify the kit on macOS (Apple silicon) with Node.js 22.18 or later and Google Chrome. It may run elsewhere, but we can't support it.",
  },
  {
    q: "Is this a hosted service?",
    a: "No. It's source code you deploy to your own Supabase and Vercel accounts. You own the code, the data and the bills — there's no monthly fee to us.",
  },
  {
    q: "Will the AI always refuse unsafe changes?",
    a: "No tool can promise that, and we don't. What the kit does is make unsafe changes visible: protected files are fingerprinted, hooks stop commits and AI edits that touch them, and the checks fail until you either revert or record why you changed them.",
  },
  {
    q: "What does the license allow?",
    a: "One purchase covers one production project. Private development, staging and test environments don't count. You can't use it to build sites for clients or resell the code.",
  },
  {
    q: "Do you offer updates?",
    a: "You receive the version current at purchase. Future updates aren't guaranteed.",
  },
  {
    q: "What's your refund policy?",
    a: "Our English terms and refund policy will be published before the English Edition goes on sale. You'll be able to read them in full before you pay.",
  },
];
