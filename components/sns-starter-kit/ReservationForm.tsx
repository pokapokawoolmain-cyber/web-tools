"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import {
  COMMUNITY_DESCRIPTION_MAX,
  EXPERIENCE_OPTIONS,
  USE_WITHIN_30_DAYS_OPTIONS,
  validateReservationInput,
  type FieldErrors,
  type ReservationApiResponse,
  type ReservationField,
} from "@/lib/sns-starter-kit/reservation";
import { getSnsKitAttribution } from "@/lib/sns-starter-kit/attribution";
import { deviceCategory, trackSnsKit } from "@/lib/analytics/sns-starter-kit";
import s from "./lp.module.css";

type Phase = "idle" | "submitting" | "reserved";

const FIELD_ORDER: ReservationField[] = [
  "email",
  "experienceType",
  "communityDescription",
  "useWithin30Days",
  "purchaseNotificationConsent",
];

const MESSAGES = {
  network: "通信に失敗しました。接続を確認して、もう一度お試しください。入力内容はそのまま残っています。",
  error: "登録を保存できませんでした。時間をおいて、もう一度お試しください。入力内容はそのまま残っています。",
  rate: "短時間に送信が続いたため、受付を一時的に止めています。少し時間をおいてお試しください。",
  unavailable: "現在、先行予約の受付を準備中です。時間をおいて、もう一度お試しください。",
} as const;

function analyticsProps() {
  const a = getSnsKitAttribution();
  return {
    source: a.source,
    utm_source: a.utmSource,
    utm_medium: a.utmMedium,
    utm_campaign: a.utmCampaign,
    device_category: deviceCategory(),
  };
}

export function ReservationForm({ accepting }: { accepting: boolean }) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const inFlight = useRef(false);
  const started = useRef(false);

  const [phase, setPhase] = useState<Phase>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [descLength, setDescLength] = useState(0);

  const ids = {
    email: `${uid}-email`,
    emailErr: `${uid}-email-err`,
    exp: `${uid}-exp`,
    desc: `${uid}-desc`,
    descHint: `${uid}-desc-hint`,
    use30: `${uid}-use30`,
    consent: `${uid}-consent`,
    marketing: `${uid}-marketing`,
  };

  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    trackSnsKit("starter_reservation_started", analyticsProps());
  };

  const focusFirstError = (errs: FieldErrors) => {
    const first = FIELD_ORDER.find((f) => errs[f]);
    if (!first || !formRef.current) return;
    const el = formRef.current.querySelector<HTMLElement>(`[data-field="${first}"]`);
    el?.focus();
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inFlight.current) return; // 二重送信の防止（連打・Enter連打）
    const form = e.currentTarget;
    const fd = new FormData(form);
    const attribution = getSnsKitAttribution();

    const payload = {
      email: String(fd.get("email") ?? ""),
      experienceType: fd.get("experienceType"),
      communityDescription: String(fd.get("communityDescription") ?? ""),
      useWithin30Days: fd.get("useWithin30Days"),
      purchaseNotificationConsent: fd.get("purchaseNotificationConsent") === "on",
      marketingConsent: fd.get("marketingConsent") === "on",
      source: attribution.source,
      utmSource: attribution.utmSource,
      utmMedium: attribution.utmMedium,
      utmCampaign: attribution.utmCampaign,
      website: String(fd.get("website") ?? ""),
    };

    const check = validateReservationInput(payload);
    if (!check.ok) {
      setErrors(check.errors);
      setFormMessage(null);
      focusFirstError(check.errors);
      return;
    }

    setErrors({});
    setFormMessage(null);
    inFlight.current = true;
    setPhase("submitting");

    let res: Response;
    try {
      res = await fetch("/api/sns-starter-kit/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      inFlight.current = false;
      setPhase("idle");
      setFormMessage(MESSAGES.network);
      return;
    }

    let body: ReservationApiResponse | null = null;
    try {
      body = (await res.json()) as ReservationApiResponse;
    } catch {
      body = null;
    }

    inFlight.current = false;

    if (body?.result === "reserved") {
      // 新規・登録済みの区別は応答に含まれない（メールアドレスの登録有無を漏らさないため）。
      // よってこのイベントは「受付完了した送信」の数。予約者の実数はDBで数える。
      setPhase("reserved");
      trackSnsKit("starter_reservation_completed", analyticsProps());
      requestAnimationFrame(() => resultRef.current?.focus());
      return;
    }

    setPhase("idle");
    if (body?.result === "invalid") {
      setErrors(body.errors);
      focusFirstError(body.errors);
    } else if (body?.result === "rate_limited") {
      setFormMessage(MESSAGES.rate);
    } else if (body?.result === "unavailable") {
      setFormMessage(MESSAGES.unavailable);
    } else {
      setFormMessage(MESSAGES.error);
    }
  };

  if (!accepting) {
    return (
      <div className={s.formCard}>
        <p className={s.formInfo} role="status">
          先行予約の受付は、まもなく開始します。現在はこのページで商品の内容をご確認いただけます。
        </p>
      </div>
    );
  }

  if (phase === "reserved") {
    return (
      <div className={`${s.formCard} ${s.success}`} aria-live="polite">
        <span className={s.successMark} aria-hidden="true">
          <Check size={24} />
        </span>
        <h3 ref={resultRef} tabIndex={-1} className={s.successTitle}>
          先行予約を受け付けました。
        </h3>
        <p className={s.successBody}>
          これは購入ではありません。
          <br />
          販売開始時に、商品内容と購入方法をメールでご案内します。
        </p>
        <p className={s.successBody}>作りたいコミュニティの準備をしておいてください。</p>
        <p className={s.hint} style={{ marginTop: 14 }}>
          同じメールアドレスで既に登録済みの場合、追加の登録は行われません。
        </p>
      </div>
    );
  }

  const submitting = phase === "submitting";
  const errId = (f: ReservationField) => `${uid}-${f}-err`;
  const describedBy = (f: ReservationField, extra?: string) =>
    [extra, errors[f] ? errId(f) : null].filter(Boolean).join(" ") || undefined;

  return (
    <form
      ref={formRef}
      className={s.formCard}
      onSubmit={onSubmit}
      onFocusCapture={markStarted}
      noValidate
      aria-busy={submitting}
      aria-labelledby="reserve-form-title"
    >
      <h3 id="reserve-form-title" className={s.srOnly}>
        先行予約フォーム
      </h3>

      {formMessage && (
        <p className={s.formError} role="alert">
          {formMessage}
        </p>
      )}

      {/* Email */}
      <div className={s.field}>
        <label htmlFor={ids.email} className={s.fieldTitle}>
          メールアドレス<span className={s.req_}>必須</span>
        </label>
        <input
          id={ids.email}
          data-field="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={254}
          className={s.input}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={describedBy("email")}
          aria-required="true"
        />
        {errors.email && (
          <p id={errId("email")} className={s.error}>
            {errors.email}
          </p>
        )}
      </div>

      {/* Experience */}
      <fieldset className={s.field} aria-describedby={describedBy("experienceType")}>
        <legend className={s.fieldLegend}>
          AIを使ったWeb開発の経験<span className={s.req_}>必須</span>
        </legend>
        <div className={s.options} style={{ marginTop: 8 }}>
          {EXPERIENCE_OPTIONS.map((o, i) => (
            <label key={o.value} className={s.option}>
              <input
                type="radio"
                name="experienceType"
                value={o.value}
                data-field={i === 0 ? "experienceType" : undefined}
              />
              {o.label}
            </label>
          ))}
        </div>
        {errors.experienceType && (
          <p id={errId("experienceType")} className={s.error}>
            {errors.experienceType}
          </p>
        )}
      </fieldset>

      {/* Community description */}
      <div className={s.field}>
        <label htmlFor={ids.desc} className={s.fieldTitle}>
          作りたいコミュニティ<span className={s.req_}>必須</span>
        </label>
        <textarea
          id={ids.desc}
          data-field="communityDescription"
          name="communityDescription"
          rows={3}
          maxLength={COMMUNITY_DESCRIPTION_MAX}
          className={s.textarea}
          placeholder="例：同じ車種に乗る人が、整備記録やツーリングを共有できる場所"
          onChange={(e) => setDescLength(e.currentTarget.value.length)}
          aria-invalid={errors.communityDescription ? true : undefined}
          aria-describedby={describedBy("communityDescription", ids.descHint)}
          aria-required="true"
        />
        <p id={ids.descHint} className={s.hint}>
          短くて構いません（{descLength}/{COMMUNITY_DESCRIPTION_MAX}文字）
        </p>
        {errors.communityDescription && (
          <p id={errId("communityDescription")} className={s.error}>
            {errors.communityDescription}
          </p>
        )}
      </div>

      {/* Use within 30 days */}
      <fieldset className={s.field} aria-describedby={describedBy("useWithin30Days")}>
        <legend className={s.fieldLegend}>
          30日以内に使い始める予定<span className={s.req_}>必須</span>
        </legend>
        <div className={s.optionsInline} style={{ marginTop: 8 }}>
          {USE_WITHIN_30_DAYS_OPTIONS.map((o, i) => (
            <label key={o.value} className={s.option}>
              <input
                type="radio"
                name="useWithin30Days"
                value={o.value}
                data-field={i === 0 ? "useWithin30Days" : undefined}
              />
              {o.label}
            </label>
          ))}
        </div>
        {errors.useWithin30Days && (
          <p id={errId("useWithin30Days")} className={s.error}>
            {errors.useWithin30Days}
          </p>
        )}
      </fieldset>

      {/* Consents */}
      <div className={s.field}>
        <label className={s.consent} htmlFor={ids.consent}>
          <input
            id={ids.consent}
            data-field="purchaseNotificationConsent"
            type="checkbox"
            name="purchaseNotificationConsent"
            aria-invalid={errors.purchaseNotificationConsent ? true : undefined}
            aria-describedby={describedBy("purchaseNotificationConsent")}
          />
          <span>
            販売開始時に、商品内容と購入方法のご案内をメールで受け取ることに同意します（先行予約に必要な同意です）
            <span className={s.req_}>必須</span>
          </span>
        </label>
        {errors.purchaseNotificationConsent && (
          <p id={errId("purchaseNotificationConsent")} className={s.error}>
            {errors.purchaseNotificationConsent}
          </p>
        )}
        <label className={s.consent} htmlFor={ids.marketing} style={{ marginTop: 10 }}>
          <input id={ids.marketing} type="checkbox" name="marketingConsent" />
          <span>
            ToolBoxJPの他の商品やお知らせもメールで受け取る（チェックしなくても先行予約できます）
            <span className={s.opt_}>任意</span>
          </span>
        </label>
      </div>

      {/* Bot trap: 人には見えず、読み上げもされない */}
      <div className={s.honeypot} aria-hidden="true">
        <label>
          ウェブサイト
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <p className={s.submitNote}>
        これは購入ではなく、予約金・前金もかかりません。販売開始時に購入案内を送るための登録です。
        ご入力いただいた情報は、販売開始のご案内と商品開発の参考、および同意いただいた場合に限りその他のお知らせに使用します。
      </p>

      <button type="submit" className={`${s.btn} ${s.btnPrimary} ${s.submit}`} disabled={submitting}>
        {submitting ? (
          <>
            <span className={s.spinner} aria-hidden="true" />
            送信しています
          </>
        ) : (
          "先行予約を登録する"
        )}
      </button>
      <p className={s.srOnly} aria-live="polite">
        {submitting ? "送信しています" : ""}
      </p>
    </form>
  );
}
