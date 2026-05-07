import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { company } from "@/data/company";
import { services } from "@/data/services";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-24">
      <div className="mx-auto max-w-7xl container-px py-16">
        <div className="grid gap-12 md:grid-cols-4 text-center md:text-left">
          <div className="md:col-span-1">
            <img
              src="/logo-light.png"
              alt="IJ Santos"
              className="h-14 w-auto mb-5 mx-auto md:mx-0"
            />
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              {company.legalName} — Construção civil e limpezas exteriores com rigor,
              há mais de 15 anos a servir clientes na região centro de Portugal.
            </p>
            <p className="mt-3 text-xs text-primary-foreground/50">
              NIPC {company.nipc}
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
              {company.phones.map((p) => (
                <li key={p.href} className="flex items-start gap-2 justify-center md:justify-start">
                  <Phone className="h-4 w-4 mt-0.5 text-brand shrink-0" />
                  <a href={p.href} className="hover:text-brand">{p.value}</a>
                </li>
              ))}
              <li className="flex items-start gap-2 justify-center md:justify-start">
                <Mail className="h-4 w-4 mt-0.5 text-brand shrink-0" />
                <a href={company.emailHref} className="hover:text-brand">{company.email}</a>
              </li>
              {company.addresses.map((a) => (
                <li key={a.value} className="flex items-start gap-2 justify-center md:justify-start">
                  <MapPin className="h-4 w-4 mt-0.5 text-brand shrink-0" />
                  <span>{a.value}</span>
                </li>
              ))}
              <li className="flex items-start gap-2 justify-center md:justify-start">
                <Clock className="h-4 w-4 mt-0.5 text-brand shrink-0" />
                <span>{company.hours}</span>
              </li>
            </ul>
            <p className="mt-3 text-xs text-primary-foreground/50">{company.phoneNote}</p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4">Área de atuação</h4>
            <ul className="flex flex-wrap gap-2 text-xs justify-center md:justify-start">
              {company.areas.map((a) => (
                <li key={a} className="rounded-full border border-primary-foreground/20 px-3 py-1 text-primary-foreground/80">
                  {a}
                </li>
              ))}
            </ul>
            <Link
              to="/contacto"
              className="hidden"
            >
              Pedir Orçamento
            </Link>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-primary-foreground/10 flex flex-col gap-4 text-xs text-primary-foreground/60">
          <ul className="flex flex-wrap items-center content-center justify-center gap-x-5 gap-y-2 text-center">
            <li>
              <Link to="/privacidade" className="hover:text-brand">Política de Privacidade & Cookies</Link>
            </li>
            <li>
              <Link to="/resolucao-litigios" className="hover:text-brand">Resolução de Litígios</Link>
            </li>
            <li>
              <a
                href={company.livroReclamacoes}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-brand"
              >
                Livro de Reclamações <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("open-cookie-preferences"))}
                className="hover:text-brand"
              >
                Preferências de Cookies
              </button>
            </li>
          </ul>
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <div>© {new Date().getFullYear()} {company.legalName}. Todos os direitos reservados.</div>
            <div>Construção · Remodelações · Limpezas Exteriores</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
