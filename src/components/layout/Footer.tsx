import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { company } from "@/data/company";
import { services } from "@/data/services";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-24">
      <div className="mx-auto max-w-7xl container-px py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-md bg-brand text-brand-foreground grid place-items-center font-display font-bold">
                IJ
              </div>
              <div className="font-display font-bold tracking-tight text-lg">IJ SANTOS</div>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Construção civil e limpezas exteriores com rigor, há mais de 15 anos a servir
              clientes na região de Lisboa.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4">Serviços</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/75">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/servicos/$slug"
                    params={{ slug: s.slug }}
                    className="hover:text-brand transition-colors"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/75">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-brand" />
                <a href={company.phoneHref} className="hover:text-brand">{company.phone}</a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-brand" />
                <a href={company.emailHref} className="hover:text-brand">{company.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-brand" />
                <span>{company.address}</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-brand" />
                <span>{company.hours}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4">Área de atuação</h4>
            <ul className="flex flex-wrap gap-2 text-xs">
              {company.areas.map((a) => (
                <li key={a} className="rounded-full border border-primary-foreground/20 px-3 py-1 text-primary-foreground/80">
                  {a}
                </li>
              ))}
            </ul>
            <Link
              to="/contacto"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-brand text-brand-foreground px-4 py-2.5 text-sm font-semibold"
            >
              Pedir Orçamento
            </Link>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-primary-foreground/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-primary-foreground/60">
          <div>© {new Date().getFullYear()} IJ Santos. Todos os direitos reservados.</div>
          <div>Construção · Remodelações · Limpezas Exteriores</div>
        </div>
      </div>
    </footer>
  );
}
