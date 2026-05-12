export type Service = {
  slug: string;
  group: "construcao" | "limpeza";
  title: string;
  short: string;
  description: string;
  hero: string;
  icon: "hammer" | "trowel" | "paint" | "spray" | "roof" | "road";
  benefits: { title: string; desc: string }[];
  process: { title: string; desc: string }[];
  useCases: string[];
  gallery: string[];
  faq: { q: string; a: string }[];
};

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

export const services: Service[] = [
  {
    slug: "construcao-civil",
    group: "construcao",
    title: "services.construcao-civil.title",
    short: "services.construcao-civil.short",
    description: "services.construcao-civil.description",
    hero: img("photo-1503387762-592deb58ef4e"),
    icon: "hammer",
    benefits: [
      { title: "services.construcao-civil.benefits.0.title", desc: "services.construcao-civil.benefits.0.desc" },
      { title: "services.construcao-civil.benefits.1.title", desc: "services.construcao-civil.benefits.1.desc" },
      { title: "services.construcao-civil.benefits.2.title", desc: "services.construcao-civil.benefits.2.desc" },
      { title: "services.construcao-civil.benefits.3.title", desc: "services.construcao-civil.benefits.3.desc" },
    ],
    process: [
      { title: "services.construcao-civil.process.0.title", desc: "services.construcao-civil.process.0.desc" },
      { title: "services.construcao-civil.process.1.title", desc: "services.construcao-civil.process.1.desc" },
      { title: "services.construcao-civil.process.2.title", desc: "services.construcao-civil.process.2.desc" },
      { title: "services.construcao-civil.process.3.title", desc: "services.construcao-civil.process.3.desc" },
    ],
    useCases: [
      "services.construcao-civil.useCases.0",
      "services.construcao-civil.useCases.1",
      "services.construcao-civil.useCases.2",
      "services.construcao-civil.useCases.3",
    ],
    gallery: [
      img("photo-1581094794329-c8112a89af12"),
      img("photo-1503387762-592deb58ef4e"),
      img("photo-1504307651254-35680f356dfd"),
      img("photo-1541888946425-d81bb19240f5"),
    ],
    faq: [
      { q: "services.construcao-civil.faq.0.q", a: "services.construcao-civil.faq.0.a" },
      { q: "services.construcao-civil.faq.1.q", a: "services.construcao-civil.faq.1.a" },
      { q: "services.construcao-civil.faq.2.q", a: "services.construcao-civil.faq.2.a" },
    ],
  },
  {
    slug: "remodelacoes-reabilitacao",
    group: "construcao",
    title: "services.remodelacoes-reabilitacao.title",
    short: "services.remodelacoes-reabilitacao.short",
    description: "services.remodelacoes-reabilitacao.description",
    hero: img("photo-1556909114-f6e7ad7d3136"),
    icon: "trowel",
    benefits: [
      { title: "services.remodelacoes-reabilitacao.benefits.0.title", desc: "services.remodelacoes-reabilitacao.benefits.0.desc" },
      { title: "services.remodelacoes-reabilitacao.benefits.1.title", desc: "services.remodelacoes-reabilitacao.benefits.1.desc" },
      { title: "services.remodelacoes-reabilitacao.benefits.2.title", desc: "services.remodelacoes-reabilitacao.benefits.2.desc" },
      { title: "services.remodelacoes-reabilitacao.benefits.3.title", desc: "services.remodelacoes-reabilitacao.benefits.3.desc" },
    ],
    process: [
      { title: "services.remodelacoes-reabilitacao.process.0.title", desc: "services.remodelacoes-reabilitacao.process.0.desc" },
      { title: "services.remodelacoes-reabilitacao.process.1.title", desc: "services.remodelacoes-reabilitacao.process.1.desc" },
      { title: "services.remodelacoes-reabilitacao.process.2.title", desc: "services.remodelacoes-reabilitacao.process.2.desc" },
      { title: "services.remodelacoes-reabilitacao.process.3.title", desc: "services.remodelacoes-reabilitacao.process.3.desc" },
    ],
    useCases: [
      "services.remodelacoes-reabilitacao.useCases.0",
      "services.remodelacoes-reabilitacao.useCases.1",
      "services.remodelacoes-reabilitacao.useCases.2",
      "services.remodelacoes-reabilitacao.useCases.3",
    ],
    gallery: [
      img("photo-1600585154340-be6161a56a0c"),
      img("photo-1567016432779-094069958ea5"),
      img("photo-1556909114-f6e7ad7d3136"),
      img("photo-1600566753190-17f0baa2a6c3"),
    ],
    faq: [
      { q: "services.remodelacoes-reabilitacao.faq.0.q", a: "services.remodelacoes-reabilitacao.faq.0.a" },
      { q: "services.remodelacoes-reabilitacao.faq.1.q", a: "services.remodelacoes-reabilitacao.faq.1.a" },
    ],
  },
  {
    slug: "pinturas-interiores-exteriores",
    group: "construcao",
    title: "services.pinturas-interiores-exteriores.title",
    short: "services.pinturas-interiores-exteriores.short",
    description: "services.pinturas-interiores-exteriores.description",
    hero: img("photo-1562259949-e8e7689d7828"),
    icon: "paint",
    benefits: [
      { title: "services.pinturas-interiores-exteriores.benefits.0.title", desc: "services.pinturas-interiores-exteriores.benefits.0.desc" },
      { title: "services.pinturas-interiores-exteriores.benefits.1.title", desc: "services.pinturas-interiores-exteriores.benefits.1.desc" },
      { title: "services.pinturas-interiores-exteriores.benefits.2.title", desc: "services.pinturas-interiores-exteriores.benefits.2.desc" },
      { title: "services.pinturas-interiores-exteriores.benefits.3.title", desc: "services.pinturas-interiores-exteriores.benefits.3.desc" },
    ],
    process: [
      { title: "services.pinturas-interiores-exteriores.process.0.title", desc: "services.pinturas-interiores-exteriores.process.0.desc" },
      { title: "services.pinturas-interiores-exteriores.process.1.title", desc: "services.pinturas-interiores-exteriores.process.1.desc" },
      { title: "services.pinturas-interiores-exteriores.process.2.title", desc: "services.pinturas-interiores-exteriores.process.2.desc" },
      { title: "services.pinturas-interiores-exteriores.process.3.title", desc: "services.pinturas-interiores-exteriores.process.3.desc" },
    ],
    useCases: [
      "services.pinturas-interiores-exteriores.useCases.0",
      "services.pinturas-interiores-exteriores.useCases.1",
      "services.pinturas-interiores-exteriores.useCases.2",
      "services.pinturas-interiores-exteriores.useCases.3",
    ],
    gallery: [
      img("photo-1562259949-e8e7689d7828"),
      img("photo-1589939705384-5185137a7f0f"),
      img("photo-1572177812156-58036aae439c"),
      img("photo-1595909079737-194b4b58e88e"),
    ],
    faq: [
      { q: "services.pinturas-interiores-exteriores.faq.0.q", a: "services.pinturas-interiores-exteriores.faq.0.a" },
      { q: "services.pinturas-interiores-exteriores.faq.1.q", a: "services.pinturas-interiores-exteriores.faq.1.a" },
    ],
  },
  {
    slug: "limpeza-fachadas",
    group: "limpeza",
    title: "services.limpeza-fachadas.title",
    short: "services.limpeza-fachadas.short",
    description: "services.limpeza-fachadas.description",
    hero: img("photo-1503594384566-461fe158e797"),
    icon: "spray",
    benefits: [
      { title: "services.limpeza-fachadas.benefits.0.title", desc: "services.limpeza-fachadas.benefits.0.desc" },
      { title: "services.limpeza-fachadas.benefits.1.title", desc: "services.limpeza-fachadas.benefits.1.desc" },
      { title: "services.limpeza-fachadas.benefits.2.title", desc: "services.limpeza-fachadas.benefits.2.desc" },
      { title: "services.limpeza-fachadas.benefits.3.title", desc: "services.limpeza-fachadas.benefits.3.desc" },
    ],
    process: [
      { title: "services.limpeza-fachadas.process.0.title", desc: "services.limpeza-fachadas.process.0.desc" },
      { title: "services.limpeza-fachadas.process.1.title", desc: "services.limpeza-fachadas.process.1.desc" },
      { title: "services.limpeza-fachadas.process.2.title", desc: "services.limpeza-fachadas.process.2.desc" },
      { title: "services.limpeza-fachadas.process.3.title", desc: "services.limpeza-fachadas.process.3.desc" },
    ],
    useCases: [
      "services.limpeza-fachadas.useCases.0",
      "services.limpeza-fachadas.useCases.1",
      "services.limpeza-fachadas.useCases.2",
      "services.limpeza-fachadas.useCases.3",
    ],
    gallery: [
      img("photo-1503594384566-461fe158e797"),
      img("photo-1486325212027-8081e485255e"),
      img("photo-1597047084897-51e81819a499"),
      img("photo-1517089596392-fb9a9033e05b"),
    ],
    faq: [
      { q: "services.limpeza-fachadas.faq.0.q", a: "services.limpeza-fachadas.faq.0.a" },
      { q: "services.limpeza-fachadas.faq.1.q", a: "services.limpeza-fachadas.faq.1.a" },
      { q: "services.limpeza-fachadas.faq.2.q", a: "services.limpeza-fachadas.faq.2.a" },
    ],
  },
  {
    slug: "limpeza-telhados",
    group: "limpeza",
    title: "services.limpeza-telhados.title",
    short: "services.limpeza-telhados.short",
    description: "services.limpeza-telhados.description",
    hero: img("photo-1605276374104-dee2a0ed3cd6"),
    icon: "roof",
    benefits: [
      { title: "services.limpeza-telhados.benefits.0.title", desc: "services.limpeza-telhados.benefits.0.desc" },
      { title: "services.limpeza-telhados.benefits.1.title", desc: "services.limpeza-telhados.benefits.1.desc" },
      { title: "services.limpeza-telhados.benefits.2.title", desc: "services.limpeza-telhados.benefits.2.desc" },
      { title: "services.limpeza-telhados.benefits.3.title", desc: "services.limpeza-telhados.benefits.3.desc" },
    ],
    process: [
      { title: "services.limpeza-telhados.process.0.title", desc: "services.limpeza-telhados.process.0.desc" },
      { title: "services.limpeza-telhados.process.1.title", desc: "services.limpeza-telhados.process.1.desc" },
      { title: "services.limpeza-telhados.process.2.title", desc: "services.limpeza-telhados.process.2.desc" },
      { title: "services.limpeza-telhados.process.3.title", desc: "services.limpeza-telhados.process.3.desc" },
    ],
    useCases: [
      "services.limpeza-telhados.useCases.0",
      "services.limpeza-telhados.useCases.1",
      "services.limpeza-telhados.useCases.2",
      "services.limpeza-telhados.useCases.3",
    ],
    gallery: [
      img("photo-1605276374104-dee2a0ed3cd6"),
      img("photo-1632759145355-8b8b1a1c6f7c"),
      img("photo-1518780664697-55e3ad937233"),
      img("photo-1416331108676-a22ccb276e35"),
    ],
    faq: [
      { q: "services.limpeza-telhados.faq.0.q", a: "services.limpeza-telhados.faq.0.a" },
      { q: "services.limpeza-telhados.faq.1.q", a: "services.limpeza-telhados.faq.1.a" },
    ],
  },
  {
    slug: "limpeza-pavimentos-exteriores",
    group: "limpeza",
    title: "services.limpeza-pavimentos-exteriores.title",
    short: "services.limpeza-pavimentos-exteriores.short",
    description: "services.limpeza-pavimentos-exteriores.description",
    hero: img("photo-1558618666-fcd25c85cd64"),
    icon: "road",
    benefits: [
      { title: "services.limpeza-pavimentos-exteriores.benefits.0.title", desc: "services.limpeza-pavimentos-exteriores.benefits.0.desc" },
      { title: "services.limpeza-pavimentos-exteriores.benefits.1.title", desc: "services.limpeza-pavimentos-exteriores.benefits.1.desc" },
      { title: "services.limpeza-pavimentos-exteriores.benefits.2.title", desc: "services.limpeza-pavimentos-exteriores.benefits.2.desc" },
      { title: "services.limpeza-pavimentos-exteriores.benefits.3.title", desc: "services.limpeza-pavimentos-exteriores.benefits.3.desc" },
    ],
    process: [
      { title: "services.limpeza-pavimentos-exteriores.process.0.title", desc: "services.limpeza-pavimentos-exteriores.process.0.desc" },
      { title: "services.limpeza-pavimentos-exteriores.process.1.title", desc: "services.limpeza-pavimentos-exteriores.process.1.desc" },
      { title: "services.limpeza-pavimentos-exteriores.process.2.title", desc: "services.limpeza-pavimentos-exteriores.process.2.desc" },
      { title: "services.limpeza-pavimentos-exteriores.process.3.title", desc: "services.limpeza-pavimentos-exteriores.process.3.desc" },
    ],
    useCases: [
      "services.limpeza-pavimentos-exteriores.useCases.0",
      "services.limpeza-pavimentos-exteriores.useCases.1",
      "services.limpeza-pavimentos-exteriores.useCases.2",
      "services.limpeza-pavimentos-exteriores.useCases.3",
    ],
    gallery: [
      img("photo-1558618666-fcd25c85cd64"),
      img("photo-1572025442646-866d16c84a54"),
      img("photo-1604014237800-1c9102c219da"),
      img("photo-1592595896616-c37162298647"),
    ],
    faq: [
      { q: "services.limpeza-pavimentos-exteriores.faq.0.q", a: "services.limpeza-pavimentos-exteriores.faq.0.a" },
      { q: "services.limpeza-pavimentos-exteriores.faq.1.q", a: "services.limpeza-pavimentos-exteriores.faq.1.a" },
    ],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
