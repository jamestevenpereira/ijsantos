import { createFileRoute } from "@tanstack/react-router";
import { CTABand } from "@/components/sections/CTABand";
import { company } from "@/data/company";
import { Award, Heart, ShieldCheck, Sparkles, Target, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import aboutTeam from "@/assets/about-team.jpg";
import heroImage from "@/assets/hero-construction.jpg";
import { media } from "@/lib/media";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre · IJ Santos" },
      {
        name: "description",
        content:
          "Conheça a IJ Santos: empresa local com mais de 30 anos de experiência em construção civil e limpezas exteriores na região de Viseu.",
      },
      { property: "og:title", content: "Sobre a IJ Santos" },
      {
        property: "og:description",
        content: "Empresa local, próxima e profissional. Conheça quem somos.",
      },
      { property: "og:url", content: `${company.siteUrl}/sobre` },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  const { t } = useTranslation();

  const values = [
    { icon: ShieldCheck, titleKey: "sobre.value1_title", descKey: "sobre.value1_desc" },
    { icon: Award, titleKey: "sobre.value2_title", descKey: "sobre.value2_desc" },
    { icon: Heart, titleKey: "sobre.value3_title", descKey: "sobre.value3_desc" },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroImage} alt="" fetchPriority="high" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/40" />
        </div>
        <div className="mx-auto max-w-7xl container-px py-20 md:py-28 text-primary-foreground text-center md:text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            {t("sobre.label")}
          </span>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto md:mx-0 text-balance">
            {t("sobre.title")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto md:mx-0">
            {t("sobre.body")}
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl container-px grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="grid grid-cols-2 gap-4">
            <img
              src={aboutTeam}
              alt="Equipa IJ Santos"
              className="rounded-xl aspect-[4/5] object-cover"
              loading="lazy"
            />
            <img
              src={media("portfolio/CONSTRUCAO-3.jpg")}
              alt="Obra IJ Santos"
              className="rounded-xl aspect-[4/5] object-cover mt-10"
              loading="lazy"
            />
          </div>
          <div className="text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              {t("sobre.story_label")}
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              {t("sobre.story_title")}
            </h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              {t("sobre.story_body1")}
            </p>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              {t("sobre.story_body2")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-surface">
        <div className="mx-auto max-w-7xl container-px">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card icon={Target} title={t("sobre.mission_title")} text={t("sobre.mission_text")} />
            <Card icon={Sparkles} title={t("sobre.vision_title")} text={t("sobre.vision_text")} />
            <Card icon={Users} title={t("sobre.values_title")} text={t("sobre.values_text")} />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl container-px">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-border py-12">
            {company.stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-bold text-foreground">
                  {s.value}
                </div>
                <div className="mt-2 text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
                  {t(s.label)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-surface">
        <div className="mx-auto max-w-7xl container-px">
          <div className="max-w-2xl mx-auto md:mx-0 text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              {t("sobre.trust_label")}
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              {t("sobre.trust_title")}
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.titleKey}
                className="rounded-xl bg-card border border-border p-7 h-full flex flex-col items-center justify-center text-center"
              >
                <div className="h-11 w-11 rounded-lg bg-brand/15 text-brand border border-brand/25 grid place-items-center">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display font-semibold text-lg">{t(v.titleKey)}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(v.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl container-px">
          <div className="max-w-2xl mx-auto md:mx-0 text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              {t("team.label")}
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              {t("team.title")}
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">{t("team.body")}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((m) => (
              <div key={m.name} className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={m.photo}
                    alt={m.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="p-6 text-center">
                  <p className="font-display font-bold text-lg text-foreground">{m.name}</p>
                  <p className="mt-1 text-sm text-brand font-semibold">{m.role}</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}

const teamMembers = [
  {
    name: "José Santos",
    role: "Co-fundador & Diretor de Obra",
    bio: "Responsável pela coordenação técnica e qualidade de execução em todas as obras. 30+ anos de experiência em construção civil.",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80&auto=format&fit=crop",
  },
  {
    name: "João Santos",
    role: "Co-fundador & Diretor Comercial",
    bio: "Responsável pelo contacto com clientes, orçamentação e acompanhamento de projetos. Garante que cada cliente recebe atenção personalizada.",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80&auto=format&fit=crop",
  },
  {
    name: "Equipa Técnica",
    role: "Especialistas de Obra",
    bio: "Uma equipa de profissionais especializados em construção civil, remodelações e limpezas exteriores. Formação contínua e rigor em cada projeto.",
    photo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80&auto=format&fit=crop",
  },
];

function Card({ icon: Icon, title, text }: { icon: typeof Target; title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-8 h-full flex flex-col items-center justify-center text-center">
      <div className="h-12 w-12 rounded-xl bg-brand text-brand-foreground grid place-items-center">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-6 font-display font-bold text-2xl">{title}</h3>
      <p className="mt-3 text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}
