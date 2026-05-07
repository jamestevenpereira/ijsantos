import { Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";
import { company } from "@/data/company";

export function CTABand({
  title = "Peça o seu orçamento gratuito",
  subtitle = "Resposta em menos de 24 horas. Sem compromisso.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl container-px py-16 md:py-20">
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight text-balance">
              {title}
            </h2>
            <p className="mt-3 text-primary-foreground/75 text-lg">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 rounded-md bg-brand text-brand-foreground px-6 py-3.5 text-sm font-semibold hover:brightness-95 transition"
            >
              Pedir Orçamento <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={company.phoneHref}
              className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 px-6 py-3.5 text-sm font-semibold hover:bg-primary-foreground/10 transition"
            >
              <Phone className="h-4 w-4" /> {company.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
