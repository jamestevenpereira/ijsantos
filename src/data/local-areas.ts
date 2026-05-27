export type LocalArea = {
  slug: string;
  name: string;
  district: string;
  intro: string;
  body: string[];
  highlights: { title: string; desc: string }[];
  faq: { q: string; a: string }[];
  distanceNote: string;
  heroAlt: string;
};

export const localAreas: LocalArea[] = [
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
      { title: "Empresa local desde sempre", desc: "Sede na Zona Industrial de Nelas." },
      { title: "Resposta no próprio dia", desc: "Para urgências em Nelas, deslocamos equipa no mesmo dia útil." },
      { title: "Parcerias com câmara e juntas", desc: "Experiência consolidada em obra pública na região." },
    ],
    faq: [
      { q: "Trabalham em obras particulares em Nelas?", a: "Sim — moradias, remodelações de cozinhas e casas de banho, anexos e manutenção exterior em toda a vila e freguesias." },
      { q: "Quanto tempo demora a marcação de uma visita técnica em Nelas?", a: "Para clientes em Nelas, conseguimos visita técnica gratuita em 24 a 48 horas." },
      { q: "Onde fica a sede?", a: "Na Zona Industrial de Nelas." },
    ],
    distanceNote: "Sede e armazém em Nelas — equipa permanente disponível.",
    heroAlt: "Sede da IJ Santos em Nelas",
  },
  {
    slug: "viseu",
    name: "Viseu",
    district: "Distrito de Viseu",
    intro:
      "Construção civil, remodelações e limpezas exteriores em Viseu — equipa local da IJ Santos, com mais de 30 anos a servir clientes na cidade e arredores.",
    body: [
      "Viseu é um dos principais centros urbanos da região centro e uma das áreas onde executamos mais obra. Trabalhamos regularmente em moradias unifamiliares, apartamentos no centro histórico e espaços comerciais nas zonas comerciais da cidade.",
      "A nossa proximidade à cidade permite uma resposta rápida a pedidos de orçamento, visitas técnicas em 48 horas e gestão de obra sem deslocações dispendiosas. Para clientes em Viseu, mantemos equipa móvel preparada para limpezas de fachadas, telhados e pavimentos durante todo o ano.",
    ],
    highlights: [
      { title: "Visita técnica em 48h", desc: "Sem custos e sem compromisso para clientes em Viseu cidade." },
      { title: "Reabilitação no centro histórico", desc: "Experiência em prédios antigos com requisitos camarários." },
      { title: "Limpezas a condomínios", desc: "Contratos de manutenção exterior periódica em prédios da cidade." },
    ],
    faq: [
      { q: "Fazem reabilitação no centro histórico de Viseu?", a: "Sim, temos experiência em prédios antigos com requisitos da Câmara Municipal de Viseu, incluindo coordenação de licenciamentos." },
      { q: "Trabalham em condomínios em Viseu?", a: "Sim — limpezas de fachadas, telhados e zonas comuns, com contratos pontuais ou de manutenção periódica." },
      { q: "Há custos de deslocação para Viseu?", a: "Não. Estamos a 25 minutos pela A25 e não cobramos deslocação para clientes em Viseu cidade." },
    ],
    distanceNote: "Sede em Nelas, a ~25 minutos de Viseu pela A25.",
    heroAlt: "Obra IJ Santos em Viseu",
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
    faq: [
      { q: "Trabalham em pavilhões industriais em Mangualde?", a: "Sim, fazemos construção, ampliação e manutenção de fachadas e coberturas em parques industriais da zona." },
      { q: "Que tipo de obras particulares fazem em Mangualde?", a: "Moradias chave-na-mão, remodelações totais ou parciais, pinturas e limpezas exteriores." },
      { q: "Conseguem orçamento rápido?", a: "Sim — visita técnica em 48 horas e proposta detalhada em 3 a 5 dias úteis." },
    ],
    distanceNote: "Sede em Nelas, a ~15 minutos de Mangualde pela N231.",
    heroAlt: "Obra IJ Santos em Mangualde",
  },
  {
    slug: "tondela",
    name: "Tondela",
    district: "Distrito de Viseu",
    intro:
      "Serviços de construção civil, remodelações e limpezas exteriores em Tondela. Equipa local da IJ Santos, com mais de 30 anos de obra na região centro.",
    body: [
      "Tondela é uma área onde acompanhamos com regularidade clientes particulares e empresas. A proximidade à nossa sede em Nelas permite preços competitivos e resposta rápida a pedidos urgentes, sem custos extra de deslocação.",
      "Em Tondela executamos remodelações de habitação, manutenção de fachadas e telhados em edifícios antigos da vila e ainda obra nova em zonas residenciais novas do concelho.",
    ],
    highlights: [
      { title: "Sem custos de deslocação", desc: "A 30 minutos da nossa sede pelo IP3." },
      { title: "Reabilitação de edifícios antigos", desc: "Recuperação de fachadas, telhados e interiores no centro de Tondela." },
      { title: "Pequenas reparações urgentes", desc: "Equipa disponível para intervenções rápidas em casa ou no comércio." },
    ],
    faq: [
      { q: "Fazem manutenção de telhados em moradias em Tondela?", a: "Sim — limpeza de musgo, tratamento antifungos, substituição de telhas e impermeabilização." },
      { q: "Quanto custa um orçamento em Tondela?", a: "O orçamento é sempre gratuito e sem compromisso, mesmo que a obra não avance." },
      { q: "Trabalham em zonas rurais do concelho?", a: "Sim, deslocamo-nos a todas as freguesias do concelho de Tondela." },
    ],
    distanceNote: "Sede em Nelas, a ~30 minutos de Tondela pelo IP3.",
    heroAlt: "Obra IJ Santos em Tondela",
  },
  {
    slug: "carregal-do-sal",
    name: "Carregal do Sal",
    district: "Distrito de Viseu",
    intro:
      "Construção civil e limpezas exteriores em Carregal do Sal. Empresa local de Nelas com equipa fixa para obras particulares e empresariais no concelho.",
    body: [
      "Carregal do Sal é uma das nossas zonas de atuação naturais — fica praticamente a meio caminho entre Nelas e o sul do distrito. Mantemos uma forte presença em obras de habitação, pequenas remodelações e limpezas exteriores em vivendas e comércio local.",
      "A IJ Santos é uma escolha próxima e de confiança em Carregal do Sal: somos uma empresa familiar, com nome a defender e décadas de obra na região.",
    ],
    highlights: [
      { title: "Empresa familiar e próxima", desc: "Trato direto com os responsáveis da empresa." },
      { title: "Obras de habitação", desc: "Construção, ampliação e remodelação de moradias em todo o concelho." },
      { title: "Limpezas a vivendas", desc: "Fachadas, telhados, muros e pavimentos exteriores." },
    ],
    faq: [
      { q: "Trabalham em vivendas em Carregal do Sal?", a: "Sim — fazemos obra nova, remodelações totais e parciais e manutenção exterior periódica." },
      { q: "Têm equipa disponível na zona?", a: "Sim, a partir de Nelas conseguimos chegar a Carregal do Sal em ~20 minutos." },
      { q: "Fazem orçamentos para empresas locais?", a: "Sim — comércio, restauração e pavilhões industriais. Apresentamos proposta detalhada e calendarizada." },
    ],
    distanceNote: "Sede em Nelas, a ~20 minutos de Carregal do Sal.",
    heroAlt: "Obra IJ Santos em Carregal do Sal",
  },
  {
    slug: "seia",
    name: "Seia",
    district: "Distrito da Guarda",
    intro:
      "Construção e limpezas exteriores em Seia. A IJ Santos desloca equipa regularmente ao concelho para obras de habitação e manutenção exterior.",
    body: [
      "Seia, na vertente da Serra da Estrela, exige obra preparada para condições climáticas exigentes. Trabalhamos com materiais e técnicas adequados ao clima da serra, especialmente em telhados, fachadas e impermeabilizações.",
      "Acompanhamos clientes particulares e empresas locais em Seia com a mesma proximidade que oferecemos em Nelas — sem deslocações dispendiosas e com profissionais experientes em construção em zonas serranas.",
    ],
    highlights: [
      { title: "Experiência em zonas serranas", desc: "Telhados e fachadas preparados para o clima da Serra da Estrela." },
      { title: "Impermeabilizações", desc: "Soluções específicas para humidades de inverno e neve." },
      { title: "Manutenção periódica", desc: "Contratos anuais para condomínios e turismo rural." },
    ],
    faq: [
      { q: "Trabalham em casas de turismo rural em Seia?", a: "Sim, fazemos manutenção de fachadas, telhados, decks e pavimentos exteriores em alojamentos locais e turismo rural." },
      { q: "Como funciona o serviço em Seia?", a: "Visita técnica gratuita, orçamento em 3 a 5 dias e execução com equipa própria deslocada de Nelas." },
      { q: "Aplicam impermeabilizações de telhados?", a: "Sim — tratamento antifungos e hidrofugante incolor para suportar o clima de altitude." },
    ],
    distanceNote: "Sede em Nelas, a ~50 minutos de Seia pela A25/IC6.",
    heroAlt: "Obra IJ Santos em Seia",
  },
  {
    slug: "gouveia",
    name: "Gouveia",
    district: "Distrito da Guarda",
    intro:
      "Construção civil, remodelações e limpezas exteriores em Gouveia. Empresa próxima, com obra feita em toda a região da Serra da Estrela.",
    body: [
      "Gouveia é mais um dos concelhos onde a IJ Santos é chamada com frequência para obras particulares e manutenção exterior. Trabalhamos em granito, fachadas com isolamento térmico (ETICS) e telhados de telha cerâmica e chapa.",
      "Combinamos a experiência de uma empresa familiar consolidada com a logística necessária para servir clientes em Gouveia sem custos adicionais.",
    ],
    highlights: [
      { title: "Trabalho em granito", desc: "Reabilitação de paredes e elementos em pedra típicos da região." },
      { title: "ETICS e isolamento térmico", desc: "Aplicação certificada de sistemas de isolamento exterior." },
      { title: "Coberturas", desc: "Limpeza, tratamento e substituição parcial de telhados." },
    ],
    faq: [
      { q: "Aplicam ETICS em moradias em Gouveia?", a: "Sim — sistema completo com aplicação certificada e garantia escrita." },
      { q: "Fazem obra em construções em pedra?", a: "Sim, temos experiência em reabilitação de paredes em granito típicas do concelho." },
      { q: "Quanto demora um orçamento?", a: "Visita técnica em 48 a 72 horas e proposta em 3 a 5 dias úteis." },
    ],
    distanceNote: "Sede em Nelas, a ~55 minutos de Gouveia.",
    heroAlt: "Obra IJ Santos em Gouveia",
  },
  {
    slug: "coimbra",
    name: "Coimbra",
    district: "Distrito de Coimbra",
    intro:
      "Construção, remodelações e limpezas exteriores em Coimbra. A IJ Santos aceita projetos em Coimbra cidade e concelhos limítrofes, com proposta detalhada e equipa própria.",
    body: [
      "Coimbra é a maior cidade da região centro e uma área onde aceitamos projetos de média e grande dimensão — remodelações de apartamentos, intervenções em prédios urbanos e limpezas exteriores em condomínios.",
      "Para projetos em Coimbra, organizamos a logística com antecedência para garantir que a equipa permanece em obra durante a duração da intervenção, com o mesmo rigor que aplicamos no nosso concelho de origem.",
    ],
    highlights: [
      { title: "Projetos médios e grandes", desc: "Remodelações completas e intervenções em prédios urbanos." },
      { title: "Limpezas em condomínios", desc: "Fachadas, telhados e zonas comuns de prédios em Coimbra." },
      { title: "Logística planeada", desc: "Equipa fixa em obra durante toda a intervenção." },
    ],
    faq: [
      { q: "Aceitam obras em Coimbra cidade?", a: "Sim, aceitamos projetos com dimensão suficiente para justificar a deslocação da equipa." },
      { q: "Que tipo de obras fazem em Coimbra?", a: "Remodelações totais de apartamentos, limpezas exteriores em condomínios e reabilitação de pequenos prédios." },
      { q: "Como funciona a deslocação?", a: "Para projetos em Coimbra, a equipa permanece em obra com horários planeados; deslocação incluída em proposta." },
    ],
    distanceNote: "Sede em Nelas, a ~1h15 de Coimbra pela A25/A1.",
    heroAlt: "Obra IJ Santos em Coimbra",
  },
];

export const getLocalArea = (slug: string) =>
  localAreas.find((a) => a.slug === slug);
