export type LocalArea = {
  slug: "viseu" | "nelas" | "mangualde";
  name: string;
  district: string;
  intro: string;
  body: string[];
  highlights: { title: string; desc: string }[];
  distanceNote: string;
  heroAlt: string;
};

export const localAreas: LocalArea[] = [
  {
    slug: "viseu",
    name: "Viseu",
    district: "Distrito de Viseu",
    intro:
      "Construção civil, remodelações e limpezas exteriores em Viseu — equipa local da IJ Santos, com mais de 15 anos a servir clientes na cidade e arredores.",
    body: [
      "Viseu é um dos principais centros urbanos da região centro e uma das áreas onde executamos mais obra. Trabalhamos regularmente em moradias unifamiliares, apartamentos no centro histórico e espaços comerciais nas zonas comerciais da cidade.",
      "A nossa proximidade à cidade permite uma resposta rápida a pedidos de orçamento, visitas técnicas em 48 horas e gestão de obra sem deslocações dispendiosas. Para clientes em Viseu, mantemos equipa móvel preparada para limpezas de fachadas, telhados e pavimentos durante todo o ano.",
    ],
    highlights: [
      { title: "Visita técnica em 48h", desc: "Sem custos e sem compromisso para clientes em Viseu cidade." },
      { title: "Reabilitação no centro histórico", desc: "Experiência em prédios antigos com requisitos camarários." },
      { title: "Limpezas a condomínios", desc: "Contratos de manutenção exterior periódica em prédios da cidade." },
    ],
    distanceNote: "Sede em Nelas, a ~25 minutos de Viseu pela A25.",
    heroAlt: "Obra IJ Santos em Viseu",
  },
  {
    slug: "nelas",
    name: "Nelas",
    district: "Distrito de Viseu",
    intro:
      "Empresa de construção civil sediada em Nelas. Servimos toda a vila e freguesias envolventes com obra nova, remodelações e limpezas exteriores.",
    body: [
      "Nelas é a nossa casa. A IJ Santos tem sede e armazém na vila e é aqui que se concentra grande parte da nossa estrutura — o que nos permite responder com rapidez e custos reduzidos a clientes locais.",
      "Trabalhamos em estreita colaboração com particulares, empresas locais, condomínios e instituições, em projetos que vão desde pequenas reparações a construções de raiz e infraestruturas de maior dimensão.",
    ],
    highlights: [
      { title: "Empresa local desde sempre", desc: "Sede na Rua da Shell, nº 13 — 3520-074 Nelas." },
      { title: "Resposta no próprio dia", desc: "Para urgências em Nelas, deslocamos equipa no mesmo dia útil." },
      { title: "Parcerias com câmara e juntas", desc: "Experiência consolidada em obra pública na região." },
    ],
    distanceNote: "Sede e armazém em Nelas — equipa permanente disponível.",
    heroAlt: "Sede da IJ Santos em Nelas",
  },
  {
    slug: "mangualde",
    name: "Mangualde",
    district: "Distrito de Viseu",
    intro:
      "Construção e limpezas exteriores em Mangualde. Equipa profissional, materiais certificados e orçamentos transparentes para obras de qualquer dimensão.",
    body: [
      "Mangualde é uma das principais áreas de atuação da IJ Santos, fruto da proximidade geográfica e da forte ligação industrial e comercial da região. Acompanhamos clientes desde o primeiro contacto até à entrega final da obra.",
      "Executamos pavilhões industriais, lojas comerciais, moradias e intervenções de manutenção exterior em toda a área do concelho, com rigor técnico e cumprimento integral de prazos.",
    ],
    highlights: [
      { title: "Pavilhões industriais", desc: "Construção e ampliação de espaços para empresas locais." },
      { title: "Moradias chave-na-mão", desc: "Desde o projeto à entrega — gestão integrada da obra." },
      { title: "Manutenção a empresas", desc: "Limpezas exteriores periódicas em fachadas e telhados industriais." },
    ],
    distanceNote: "Sede em Nelas, a ~15 minutos de Mangualde pela N231.",
    heroAlt: "Obra IJ Santos em Mangualde",
  },
];

export const getLocalArea = (slug: string) =>
  localAreas.find((a) => a.slug === slug);
