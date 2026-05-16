import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { company } from "@/data/company";
import { ThemeToggle } from "./ThemeToggle";
import i18n from "@/i18n";
import { ArrowRight } from "lucide-react";

function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { i18n: i18nInstance } = useTranslation();
  const current = i18nInstance.language;

  const switchTo = (lang: string) => {
    i18n.changeLanguage(lang);
    try { localStorage.setItem("ijs.lang", lang); } catch { /* noop */ }
  };

  return (
    <div className={`flex items-center gap-1 text-sm font-medium ${className}`}>
      <button
        onClick={() => switchTo("en")}
        className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:rounded-sm ${current === "en" ? "text-foreground" : "text-muted-foreground hover:text-foreground transition-colors"}`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="text-border select-none">/</span>
      <button
        onClick={() => switchTo("pt")}
        className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:rounded-sm ${current === "pt" ? "text-foreground" : "text-muted-foreground hover:text-foreground transition-colors"}`}
        aria-label="Mudar para Português"
      >
        PT
      </button>
    </div>
  );
}

export function Header() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  const nav = [
    { to: "/", label: t("header.home") },
    { to: "/servicos", label: t("header.services") },
    { to: "/portefolio", label: t("header.portfolio") },
    { to: "/sobre", label: t("header.about") },
    { to: "/contacto", label: t("header.contact") },
  ] as const;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      setPastHero(y > 450);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-background/60 backdrop-blur"
      }`}
    >
      <div className="mx-auto max-w-7xl container-px">
        <div className="flex h-20 md:h-24 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group" aria-label="IJ Santos — Início">
            <img
              src="/logo.png"
              alt="IJ Santos"
              className="h-12 md:h-14 w-auto dark:hidden"
            />
            <img
              src="/logo-light.png"
              alt="IJ Santos"
              className="hidden h-12 md:h-14 w-auto dark:block"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                activeProps={{ className: "text-foreground" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                className="px-4 py-2 text-sm font-medium hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:rounded-sm data-[status=active]:after:opacity-100 relative after:opacity-0 after:absolute after:left-4 after:right-4 after:-bottom-0.5 after:h-px after:bg-brand"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href={company.phoneHref}
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-brand transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:rounded-sm"
            >
              <Phone className="h-4 w-4" />
              {company.phone}
            </a>
            <LanguageSwitcher />
            <ThemeToggle />
            <span
              className={`flex items-center gap-1.5 overflow-hidden whitespace-nowrap transition-all duration-500 ${
                pastHero ? "max-w-[160px] opacity-100" : "max-w-0 opacity-0 pointer-events-none"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{t("header.urgency")}</span>
            </span>
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center rounded-md bg-brand text-brand-foreground px-4 py-2.5 text-sm font-semibold hover:brightness-95 transition shadow-sm"
            >
              {t("header.cta")}
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <span
              className={`overflow-hidden transition-all duration-300 ${
                pastHero ? "max-w-[120px] opacity-100" : "max-w-0 opacity-0 pointer-events-none"
              }`}
            >
              <Link
                to="/contacto"
                className="inline-flex items-center gap-1 rounded-md bg-brand text-brand-foreground px-3 py-1.5 text-xs font-semibold whitespace-nowrap"
              >
                {t("header.cta_short")} <ArrowRight className="h-3 w-3" />
              </Link>
            </span>
            <button
              className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-border"
              aria-label="Menu"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="md:hidden border-t border-border bg-background">
          <div className="mx-auto max-w-7xl container-px py-4 flex flex-col gap-1 items-center">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="w-full text-center px-3 py-3 rounded-md text-base font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand"
              >
                {n.label}
              </Link>
            ))}
            <a
              href={company.phoneHref}
              className="w-full justify-center px-3 py-3 rounded-md text-base font-medium text-foreground hover:bg-muted flex items-center gap-2"
            >
              <Phone className="h-4 w-4" /> {company.phone}
            </a>
            <Link
              to="/contacto"
              onClick={() => setOpen(false)}
              className="mt-2 w-full inline-flex items-center justify-center rounded-md bg-brand text-brand-foreground px-4 py-3 text-sm font-semibold"
            >
              {t("header.cta")}
            </Link>
            <LanguageSwitcher className="mt-2 px-3 py-2 justify-center" />
          </div>
        </div>
      )}
    </header>
  );
}
