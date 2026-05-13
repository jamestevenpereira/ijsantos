import type { Service } from "@/data/services";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Hammer, Wrench, PaintBucket, SprayCan, Home, Construction } from "lucide-react";
import { useTranslation } from "react-i18next";

const iconMap = {
  hammer: Hammer,
  trowel: Wrench,
  paint: PaintBucket,
  spray: SprayCan,
  roof: Home,
  road: Construction,
} as const;

export function ServiceCard({ service }: { service: Service }) {
  const { t } = useTranslation();
  const Icon = iconMap[service.icon];
  const title = t(service.title);

  return (
    <Link
      to="/servicos/$slug"
      params={{ slug: service.slug }}
      aria-label={`${t("servicecard.learn_more")} sobre ${title}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card hover:border-brand/40 transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={service.hero}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
        <div className="absolute top-4 left-4 h-10 w-10 rounded-md border border-brand/35 bg-brand/20 text-brand grid place-items-center backdrop-blur-sm transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col text-center md:text-left">
        <h3 className="font-display text-xl font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{t(service.short)}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand justify-center md:justify-start">
          {t("servicecard.learn_more")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
