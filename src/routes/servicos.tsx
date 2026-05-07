import { createFileRoute } from "@tanstack/react-router";
import { services } from "@/data/services";
import { ServiceCard } from "@/components/service/ServiceCard";
import { CTABand } from "@/components/sections/CTABand";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços · IJ Santos" },
      { name: "description", content: "Construção, remodelações, pinturas e limpezas exteriores: fachadas, telhados e pavimentos. Conheça todos os serviços." },
      { property: "og:title", content: "Serviços · IJ Santos" },
      { property: "og:description", content: "Tudo o que precisa para construir, renovar e cuidar do seu imóvel." },
    ],
  }),
  component: ServicosPage,
});

function ServicosPage() {
  const construcao = services.filter((s) => s.group === "construcao");
  const limpeza = services.filter((s) => s.group === "limpeza");

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl container-px py-20 md:py-28">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Serviços</span>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold tracking-tight text-balance max-w-3xl">
            Soluções completas para construir, renovar e cuidar.
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/75 max-w-2xl">
            Da obra nova à manutenção exterior, oferecemos um leque de serviços executados
            com rigor, materiais de qualidade e profissionais experientes.
          </p>
        </div>
      </section>

      <Group title="Construção & Remodelação" subtitle="Da estrutura aos acabamentos." items={construcao} />
      <CTABand />
      <Group title="Limpezas Exteriores" subtitle="Devolva o brilho ao seu imóvel." items={limpeza} alt />
      <CTABand title="Não encontra o serviço que procura?" subtitle="Fale connosco — fazemos propostas personalizadas." />
    </>
  );
}

function Group({
  title,
  subtitle,
  items,
  alt,
}: { title: string; subtitle: string; items: typeof services; alt?: boolean }) {
  return (
    <section className={`py-20 md:py-28 ${alt ? "bg-surface" : ""}`}>
      <div className="mx-auto max-w-7xl container-px">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{subtitle}</span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
            {title}
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
