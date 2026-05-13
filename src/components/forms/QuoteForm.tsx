import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { ArrowRight, Check, ChevronLeft } from "lucide-react";
import { services } from "@/data/services";
import { company } from "@/data/company";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export function QuoteForm({ compact = false, defaultService = "" }: { compact?: boolean; defaultService?: string }) {
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2 | 3>(defaultService ? 2 : 1);
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState(defaultService);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

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

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: "", service, name, phone, email, message }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(out?.error ?? t("form.toast_error_default"));
      setService(defaultService);
      setName(""); setPhone(""); setEmail(""); setMessage("");
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
      <div className="flex items-center gap-2">
        {([1, 2, 3] as const).map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
            <button
              type="button"
              onClick={() => { if (s < step) setStep(s); }}
              disabled={s >= step}
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
              <div className={`flex-1 h-px transition-all duration-500 ${step > s ? "bg-brand" : "bg-border"}`} />
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
                onClick={() => { setService(s.slug); setStep(2); }}
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
            <Field label={t("form.name")} value={name} onChange={setName} required />
            <Field label={t("form.phone")} type="tel" value={phone} onChange={setPhone} required />
          </div>
          <div className="flex items-center gap-3 mt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              <ChevronLeft className="h-4 w-4" /> {t("form.back")}
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
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

          <Field label={t("form.email")} type="email" value={email} onChange={setEmail} required />
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              {t("form.message_label")}{" "}
              <span className="text-muted-foreground font-normal">{t("form.message_optional")}</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder={t("form.message_placeholder")}
              className="rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="flex items-center gap-3 mt-1">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              <ChevronLeft className="h-4 w-4" /> {t("form.back")}
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={loading || !email.trim()}
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
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring [&:user-invalid]:border-destructive"
      />
    </div>
  );
}
