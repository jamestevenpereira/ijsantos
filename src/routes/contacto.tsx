import { createFileRoute } from "@tanstack/react-router";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { CompanyMap } from "@/components/sections/CompanyMap";
import { company } from "@/data/company";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export const Route = createFileRoute("/contacto")({
  validateSearch: (search: Record<string, unknown>): { servico?: string } => {
    const s = typeof search.servico === "string" ? search.servico : undefined;
    return s ? { servico: s } : {};
  },
  head: () => {
    const title = "Contacto · Pedido de Orçamento — IJ Santos (Nelas)";
    const description =
      "Peça orçamento gratuito de construção civil, remodelações ou limpezas exteriores em Nelas, Viseu e região centro. Resposta em menos de 24 horas.";
    const contactLd = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: title,
      description,
      url: `${company.siteUrl}/contacto`,
      mainEntity: { "@id": `${company.siteUrl}/#organization` },
    };
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `${company.siteUrl}/contacto` },
      ],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(contactLd) },
      ],
    };
  },
  component: ContactoPage,
});

function ContactoPage() {
  const { t } = useTranslation();
  const { servico } = Route.useSearch();

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl container-px py-20 md:py-28 text-center md:text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{t("contact.label")}</span>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto md:mx-0 text-balance">
            {t("contact.title")}
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/75 max-w-2xl mx-auto md:mx-0">
            {t("contact.body")}
          </p>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl container-px grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-7 md:p-10 shadow-sm">
            <h2 className="font-display text-2xl md:text-3xl font-bold">{t("contact.quote_title")}</h2>
            <p className="mt-2 text-muted-foreground">{t("contact.quote_subtitle")}</p>
            <div className="mt-8">
              <QuoteForm defaultService={servico ?? ""} />
            </div>
          </div>

          <aside className="lg:col-span-2 flex flex-col gap-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-lg bg-brand/10 text-brand grid place-items-center">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("contact.phones")}</div>
              </div>
              <ul className="mt-4 space-y-2.5">
                {company.phones.map((p) => (
                  <li key={p.href} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">{p.label}</span>
                    <a href={p.href} className="font-display font-semibold text-foreground hover:text-brand">{p.value}</a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-muted-foreground">{company.phoneNote}</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-lg bg-brand/10 text-brand grid place-items-center">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("contact.emails")}</div>
              </div>
              <ul className="mt-4 space-y-2.5">
                {company.emails.map((e) => (
                  <li key={e.href} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">{e.label}</span>
                    <a href={e.href} className="font-display font-semibold text-foreground hover:text-brand truncate">{e.value}</a>
                  </li>
                ))}
              </ul>
            </div>

            <InfoCard icon={WhatsAppIcon} title="WhatsApp" value={t("contact.whatsapp_value")} href={company.whatsapp} external />

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-lg bg-brand/10 text-brand grid place-items-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("contact.addresses")}</div>
              </div>
              <ul className="mt-4 space-y-3">
                {company.addresses.map((a) => (
                  <li key={a.value} className="text-sm">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{a.label}</div>
                    <div className="font-display font-semibold text-foreground">{a.value}</div>
                  </li>
                ))}
              </ul>
            </div>

            <InfoCard icon={Clock} title={t("contact.hours")} value={company.hours} />
          </aside>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl container-px">
          <CompanyMap className="rounded-2xl aspect-[16/7]" />
        </div>
      </section>
    </>
  );
}

function InfoCard({
  icon: Icon, title, value, href, external,
}: { icon: ComponentType<{ className?: string }>; title: string; value: string; href?: string; external?: boolean }) {
  const content = (
    <div className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 hover:border-brand/40 transition">
      <div className="h-11 w-11 rounded-lg bg-brand/10 text-brand grid place-items-center group-hover:bg-brand group-hover:text-brand-foreground transition">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
        <div className="mt-0.5 font-display font-semibold text-foreground">{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{content}</a>
  ) : content;
}
