import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function BlogCTA({ serviceSlug }: { serviceSlug?: string }) {
  const search = serviceSlug ? { servico: serviceSlug } : {};
  return (
    <div className="my-8 rounded-xl border border-brand/30 bg-brand/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <p className="font-display font-semibold text-foreground text-lg">
          Precisa de um orçamento?
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          A IJ Santos responde em menos de 24 horas — sem compromisso.
        </p>
      </div>
      <Link
        to="/contacto"
        search={search}
        className="inline-flex shrink-0 items-center gap-2 rounded-md bg-brand text-brand-foreground px-5 py-2.5 text-sm font-semibold hover:brightness-95 transition"
      >
        Pedir orçamento gratuito <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
