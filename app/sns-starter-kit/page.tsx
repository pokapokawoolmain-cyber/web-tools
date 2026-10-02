import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCT, signatureHeading } from "@/lib/sns-starter-kit/content";
import { getReservationStore } from "@/lib/sns-starter-kit/reservation-store";
import {
  Foundation,
  Hero,
  HowItWorks,
  NotIncluded,
  NotPurchaseList,
  PackageSection,
  Prerequisites,
  Price,
  Problem,
  SafetyBoundary,
} from "@/components/sns-starter-kit/Sections";
import { SignatureScroll } from "@/components/sns-starter-kit/SignatureScroll";
import { ReservationForm } from "@/components/sns-starter-kit/ReservationForm";
import { LpEnhancer } from "@/components/sns-starter-kit/LpEnhancer";
import { Phrase } from "@/components/sns-starter-kit/Phrase";
import { Ja } from "@/components/sns-starter-kit/Ja";
import s from "@/components/sns-starter-kit/lp.module.css";

// ============================================================
// SNS Starter Kit — Premium Launch Page（販売準備中・先行予約のみ）
//
// ・購入/決済は実装しない。Product 構造化データも出さない（販売前のため）。
// ・何を「確認済み」と言えるかは lib/sns-starter-kit/content.ts が唯一の根拠。
// ============================================================

const TITLE = "SNS Starter Kit｜AIと育てる、自分だけのコミュニティ | ToolBoxJP";
const DESCRIPTION =
  "SNSの土台から始めて、AIと一緒に自分のコミュニティへ。SNS Starter Kitは、AIでWebアプリ開発を試したことがある方向けの買い切りSNSキットです。";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PRODUCT.canonical },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "ToolBoxJP",
    url: PRODUCT.canonical,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function SnsStarterKitPage() {
  // 保存先が設定されていない環境では、フォームの代わりに受付準備中を表示する
  const accepting = getReservationStore() !== null;

  return (
    <div id="sns-kit" className={s.lp}>
      <Hero />
      <Problem />
      <Foundation />

      {/* 04 Signature scroll */}
      <section id="experience" aria-labelledby="experience-title" style={{ scrollMarginTop: 56 }}>
        {/* container と section を同じ要素に付けると section の padding で左右の余白が消えるため分ける */}
        <div className={s.container}>
          <div className={`${s.section} ${s.sigIntro}`}>
          <header data-reveal="">
            <p className={s.eyebrow}>使い方のイメージ</p>
            <h2 id="experience-title" className={s.h2}>
              <Phrase text={signatureHeading()} />
            </h2>
            <p className={s.lead}>
              <Ja text="AI開発環境でStarter Kitを開き、同梱する開発ルールを起点に、コミュニティに合わせて変えていく。その流れを、開発中の画面イメージでご紹介します。" />
            </p>
          </header>
          </div>
        </div>
        <div data-track="starter_ai_workflow_reached" data-hide-sticky="">
          <SignatureScroll />
        </div>
      </section>

      <SafetyBoundary />
      <PackageSection />
      <NotIncluded />
      <HowItWorks />
      <Prerequisites />
      <Price />

      {/* Reservation */}
      <section
        id="reserve"
        className={s.section}
        aria-labelledby="reserve-title"
        data-hide-sticky=""
      >
        <div className={`${s.container} ${s.reserveGrid}`}>
          <div data-reveal="">
            <p className={s.eyebrow}>先行予約</p>
            <h2 id="reserve-title" className={s.h2}>
              <Phrase text={"販売開始の|ご案内を、\n最初に|受け取る。"} />
            </h2>
            <p className={s.lead}>
              <Ja text="先行予約は、販売開始時に商品内容と購入方法をメールでお送りするための登録です。" />
            </p>
            <NotPurchaseList />
            <p className={s.note}>
              ご入力いただいた情報の取り扱いは
              <Link href="/privacy" style={{ color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: 3 }}>
                プライバシーポリシー
              </Link>
              をご確認ください。
            </p>
          </div>
          <ReservationForm accepting={accepting} />
        </div>
      </section>

      <LpEnhancer rootId="sns-kit" />
    </div>
  );
}
