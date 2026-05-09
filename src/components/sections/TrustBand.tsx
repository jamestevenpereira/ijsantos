import { ShieldCheck, FileCheck2, Clock4, Award } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "Empresa registada", desc: "Irmãos J. Santos, Lda. — NIPC 503 534 633" },
  { icon: FileCheck2, title: "Garantia escrita", desc: "Todas as obras com garantia segundo a lei em vigor" },
  { icon: Clock4, title: "Resposta em 24h", desc: "Orçamento sem compromisso após visita técnica" },
  { icon: Award, title: "+15 anos de experiência", desc: "Centenas de obras concluídas na região centro" },
];

export function TrustBand() {
  return (
    <section className="py-16 md:py-20" aria-label="Garantias e confiança">
      <div className="mx-auto max-w-7xl container-px">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-6 flex flex-col gap-3"
            >
              <span className="inline-grid place-items-center h-10 w-10 rounded-lg bg-brand/10 text-brand">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
