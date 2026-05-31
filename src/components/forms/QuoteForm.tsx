import { useState, type InputHTMLAttributes } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { ArrowRight, Check, ChevronLeft } from "lucide-react";
import { services } from "@/data/services";
import { company } from "@/data/company";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { trackGaEvent } from "@/lib/analytics";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_ALLOWED_RE = /^[0-9+\s().-]+$/;
const MIN_PHONE_DIGITS = 6;

type FieldErrors = Partial<Record<"name" | "phone" | "email" | "consent", string>>;

export function QuoteForm({
  compact = false,
  defaultService = "",
}: {
  compact?: boolean;
  defaultService?: string;
}) {
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2 | 3>(defaultService ? 2 : 1);
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState(defaultService);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const selectedService = services.find((s) => s.slug === service);
  const serviceLabel = selectedService
    ? t(selectedService.title)
    : service === "outro"
      ? t("form.service_other")
      : "";

  const waMessage = encodeURIComponent(
    selectedService
      ? t("form.wa_with_service", { title: t(selectedService.title) })
      : t("form.wa_without_service"),
  );
  const waHref = `${company.whatsapp}?text=${waMessage}`;

  const setStepTracked = (nextStep: 1 | 2 | 3) => {
    setStep(nextStep);
    trackGaEvent("quote_form_step", {
      step: nextStep,
      service: service || "not_selected",
    });
  };

  const validateContact = () => {
    const nextErrors: FieldErrors = {};
    const phoneDigits = phone.replace(/\D/g, "");

    if (!name.trim()) nextErrors.name = t("form.name_error");
    if (!phone.trim()) nextErrors.phone = t("form.phone_error_required");
    else if (!PHONE_ALLOWED_RE.test(phone.trim()) || phoneDigits.length < MIN_PHONE_DIGITS) {
      nextErrors.phone = t("form.phone_error_invalid");
    }

    setErrors((current) => ({ ...current, ...nextErrors, email: undefined, consent: undefined }));
    return Object.keys(nextErrors).length === 0;
  };

  const validateFinal = () => {
    const nextErrors: FieldErrors = {};
    if (!EMAIL_RE.test(email.trim())) {
      nextErrors.email = email.trim()
        ? t("form.email_error_invalid")
        : t("form.email_error_required");
    }
    if (!consent) nextErrors.consent = t("form.consent_error");

    setErrors((current) => ({ ...current, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async () => {
    if (!validateContact() || !validateFinal()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: "", service, name, phone, email, message }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(out?.error ?? t("form.toast_error_default"));

      trackGaEvent("generate_lead", {
        method: "form",
        service: service || "not_selected",
      });
      setService(defaultService);
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
      setConsent(false);
      setErrors({});
      setStep(defaultService ? 2 : 1);
      toast.success(t("form.toast_success"), { description: t("form.toast_success_desc") });
    } catch (err) {
      toast.error(t("form.toast_error"), {
        description: err instanceof Error ? err.message : t("form.toast_error_default"),
      });
    } finally {
      setLoading(false);
    }
  };

  const allServices = [
    ...services.map((s) => ({ slug: s.slug, label: t(s.title) })),
    { slug: "outro", label: t("form.service_other") },
  ];

  return (
    <div className="grid gap-6">
      {/* Progress */}
      <div className="flex items-center gap-2" aria-label={t("form.progress_label")}>
        {([1, 2, 3] as const).map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
            <button
              type="button"
              onClick={() => {
                if (s < step) setStepTracked(s);
              }}
              disabled={s >= step}
              aria-label={t("form.progress_step", { step: s })}
              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                step > s
                  ? "bg-brand text-brand-foreground cursor-pointer hover:brightness-95"
                  : step === s
                    ? "bg-brand text-brand-foreground"
                    : "bg-muted text-muted-foreground border border-border"
              }`}
            >
              {step > s ? <Check className="h-3.5 w-3.5" /> : s}
            </button>
            {s < 3 && (
              <div
                className={`flex-1 h-px transition-all duration-500 ${step > s ? "bg-brand" : "bg-border"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Service selection */}
      {step === 1 && (
        <div className="grid gap-4">
          <p className="text-sm font-semibold text-foreground">{t("form.step1_title")}</p>
          <div className="grid grid-cols-2 gap-2.5">
            {allServices.map((s) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => {
                  setService(s.slug);
                  setErrors({});
                  trackGaEvent("quote_service_selected", { service: s.slug });
                  setStep(2);
                  trackGaEvent("quote_form_step", { step: 2, service: s.slug });
                }}
                className={`rounded-lg border p-3.5 text-left text-sm font-medium transition-all hover:border-brand/50 hover:bg-brand/5 ${
                  service === s.slug
                    ? "border-brand bg-brand/5 text-foreground"
                    : "border-border bg-background text-muted-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Name + Phone */}
      {step === 2 && (
        <div className="grid gap-4">
          <p className="text-sm font-semibold text-foreground">{t("form.step2_title")}</p>
          {serviceLabel && (
            <div className="flex items-center gap-2.5 rounded-lg bg-brand/5 border border-brand/20 px-3.5 py-2.5 text-sm">
              <span className="h-5 w-5 rounded-full bg-brand flex items-center justify-center shrink-0">
                <Check className="h-3 w-3 text-brand-foreground" />
              </span>
              <span className="font-medium text-foreground">{serviceLabel}</span>
            </div>
          )}
          <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
            <Field
              id="quote-name"
              label={t("form.name")}
              value={name}
              onChange={(value) => {
                setName(value);
                if (errors.name) setErrors((current) => ({ ...current, name: undefined }));
              }}
              autoComplete="name"
              error={errors.name}
              required
            />
            <Field
              id="quote-phone"
              label={t("form.phone")}
              type="tel"
              value={phone}
              onChange={(value) => {
                setPhone(value);
                if (errors.phone) setErrors((current) => ({ ...current, phone: undefined }));
              }}
              autoComplete="tel"
              inputMode="tel"
              error={errors.phone}
              required
            />
          </div>
          <div className="flex items-center gap-3 mt-1">
            {!defaultService && (
              <button
                type="button"
                onClick={() => setStepTracked(1)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition"
              >
                <ChevronLeft className="h-4 w-4" /> {t("form.back")}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (validateContact()) setStepTracked(3);
              }}
              disabled={!name.trim() || !phone.trim()}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-brand text-brand-foreground px-4 py-3 text-sm font-semibold hover:brightness-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("form.next")} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Email + Message + Submit */}
      {step === 3 && (
        <div className="grid gap-4">
          <p className="text-sm font-semibold text-foreground">{t("form.step3_title")}</p>

          {/* Summary */}
          <div className="rounded-lg bg-surface border border-border p-4 grid gap-1.5 text-sm">
            {serviceLabel && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">{t("form.service_label")}</span>
                <span className="font-medium text-right">{serviceLabel}</span>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">{t("form.name")}</span>
              <span className="font-medium">{name}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">{t("form.phone")}</span>
              <span className="font-medium">{phone}</span>
            </div>
          </div>

          <Field
            id="quote-email"
            label={t("form.email")}
            type="email"
            value={email}
            onChange={(value) => {
              setEmail(value);
              if (errors.email) setErrors((current) => ({ ...current, email: undefined }));
            }}
            autoComplete="email"
            inputMode="email"
            error={errors.email}
            required
          />
          <div className="grid gap-2">
            <label htmlFor="quote-message" className="text-sm font-medium text-foreground">
              {t("form.message_label")}{" "}
              <span className="text-muted-foreground font-normal">
                {t("form.message_optional")}
              </span>
            </label>
            <textarea
              id="quote-message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder={t("form.message_placeholder")}
              className="rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <label className="flex items-start gap-3 rounded-lg border border-border bg-surface px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                if (errors.consent) setErrors((current) => ({ ...current, consent: undefined }));
              }}
              className="mt-0.5 h-4 w-4 rounded border-input accent-brand"
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? "quote-consent-error" : undefined}
            />
            <span>
              {t("form.consent_label")}{" "}
              <a href="/privacidade" className="font-semibold text-brand hover:underline">
                {t("form.consent_link")}
              </a>
              .
              {errors.consent && (
                <span id="quote-consent-error" className="mt-1 block text-destructive">
                  {errors.consent}
                </span>
              )}
            </span>
          </label>

          <div className="rounded-lg bg-brand/5 border border-brand/15 px-3.5 py-3 text-xs font-medium text-foreground">
            {t("form.trust_line")}
          </div>

          <div className="flex items-center gap-3 mt-1">
            <button
              type="button"
              onClick={() => setStepTracked(2)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              <ChevronLeft className="h-4 w-4" /> {t("form.back")}
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={loading || !email.trim() || !consent}
              className="flex-1 inline-flex items-center justify-center rounded-md bg-brand text-brand-foreground px-6 py-3.5 text-sm font-semibold hover:brightness-95 transition disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:brightness-100"
            >
              {loading ? t("form.submitting") : t("form.submit")}
            </button>
          </div>

          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-xs uppercase tracking-wider text-muted-foreground">
                {t("form.or")}
              </span>
            </div>
          </div>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackGaEvent("lead_intent", {
                method: "whatsapp",
                location: "quote_form",
                service: service || "not_selected",
              })
            }
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold hover:bg-accent transition"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
            {t("form.whatsapp")}
          </a>
          <p className="text-xs text-muted-foreground text-center">{t("form.note")}</p>
        </div>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
  error,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  error?: string;
  required?: boolean;
}) {
  const errorId = `${id}-error`;

  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        name={id.replace("quote-", "")}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring aria-invalid:border-destructive"
      />
      {error && (
        <p id={errorId} className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
