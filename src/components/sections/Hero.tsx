import { Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";
import { company } from "@/data/company";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80"
          alt="Obra de construção"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
      </div>

      <div className="mx-auto max-w-7xl container-px pt-24 pb-28 md:pt-36 md:pb-40 text-primary-foreground">
        <div className="max-w-3xl text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/5 px-3 py-1 text-xs uppercase tracking-[0.18em] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Construção · Limpezas Exteriores
          </span>
          <h1 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] text-balance">
            Construímos e cuidamos <span className="text-brand">do que é seu.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto md:mx-0 leading-relaxed">
            Há mais de 15 anos a entregar obras com rigor e a devolver fachadas, telhados e
            pavimentos ao seu melhor estado. Profissionais locais. Resultado garantido.
          </p>

          <div className="mt-10 flex flex-wrap gap-3 justify-center md:justify-start">
            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 rounded-md bg-brand text-brand-foreground px-6 py-3.5 text-sm font-semibold shadow-lg hover:brightness-95 transition"
            >
              Pedir Orçamento Gratuito <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={company.phoneHref}
              className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 bg-primary-foreground/5 px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition backdrop-blur"
            >
              <Phone className="h-4 w-4" /> {company.phone}
            </a>
          </div>

          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
            {company.stats.map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <div className="font-display text-3xl md:text-4xl font-bold text-brand">{s.value}</div>
                <div className="mt-1 text-xs md:text-sm text-primary-foreground/70 uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
