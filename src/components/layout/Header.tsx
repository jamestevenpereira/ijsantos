import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { company } from "@/data/company";
import { ThemeToggle } from "./ThemeToggle";

const nav = [
  { to: "/", label: "Início" },
  { to: "/servicos", label: "Serviços" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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
              className="h-12 md:h-14 w-auto"
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
                className="px-4 py-2 text-sm font-medium hover:text-foreground transition-colors data-[status=active]:after:opacity-100 relative after:opacity-0 after:absolute after:left-4 after:right-4 after:-bottom-0.5 after:h-px after:bg-brand"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href={company.phoneHref}
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-brand transition-colors"
            >
              <Phone className="h-4 w-4" />
              {company.phone}
            </a>
            <ThemeToggle />
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center rounded-md bg-brand text-brand-foreground px-4 py-2.5 text-sm font-semibold hover:brightness-95 transition shadow-sm"
            >
              Pedir Orçamento
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
          <button
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-border"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="mx-auto max-w-7xl container-px py-4 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-md text-base font-medium text-foreground hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
            <a
              href={company.phoneHref}
              className="px-3 py-3 rounded-md text-base font-medium text-foreground hover:bg-muted flex items-center gap-2"
            >
              <Phone className="h-4 w-4" /> {company.phone}
            </a>
            <Link
              to="/contacto"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-md bg-brand text-brand-foreground px-4 py-3 text-sm font-semibold"
            >
              Pedir Orçamento
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
