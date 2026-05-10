import aboutTeam from "@/assets/about-team.jpg";
import heroConstruction from "@/assets/hero-construction.jpg";
import servicesHero from "@/assets/services-hero.jpg";

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

const localImages = [heroConstruction, servicesHero, aboutTeam];

const img = (id: string, _w = 1400) => {
  const index = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % localImages.length;
  return localImages[index];
};

export const services: Service[] = [
  {
    slug: "construcao-civil",
    group: "construcao",
    title: "Construção Civil",
    short: "Obras novas executadas com rigor, prazo e qualidade.",
    description:
      "Projetos de construção residencial e comercial, do alicerce ao acabamento, com equipas experientes e materiais de confiança.",
    hero: img("photo-1503387762-592deb58ef4e"),
    icon: "hammer",
    benefits: [
      { title: "Equipa especializada", desc: "Profissionais com formação contínua e experiência comprovada." },
      { title: "Cumprimento de prazos", desc: "Planeamento detalhado e gestão de obra eficiente." },
      { title: "Materiais certificados", desc: "Trabalhamos apenas com fornecedores de confiança." },
      { title: "Acompanhamento dedicado", desc: "Um responsável de obra sempre disponível para si." },
    ],
    process: [
      { title: "Visita técnica", desc: "Avaliação local e levantamento de necessidades." },
      { title: "Orçamento detalhado", desc: "Proposta clara, sem custos ocultos." },
      { title: "Execução da obra", desc: "Equipa própria e calendarização rigorosa." },
      { title: "Entrega e garantia", desc: "Vistoria final e garantia escrita do trabalho realizado." },
    ],
    useCases: ["Moradias unifamiliares", "Edifícios habitacionais", "Espaços comerciais", "Ampliações"],
    gallery: [
      img("photo-1581094794329-c8112a89af12"),
      img("photo-1503387762-592deb58ef4e"),
      img("photo-1504307651254-35680f356dfd"),
      img("photo-1541888946425-d81bb19240f5"),
    ],
    faq: [
      { q: "Tratam de licenciamentos?", a: "Sim, acompanhamos todo o processo junto da câmara municipal e demais entidades." },
      { q: "Em quanto tempo recebo o orçamento?", a: "Após visita técnica, entregamos a proposta em 3 a 5 dias úteis." },
      { q: "Que garantia oferecem?", a: "Todas as obras têm garantia escrita de acordo com a legislação em vigor." },
    ],
  },
  {
    slug: "remodelacoes",
    group: "construcao",
    title: "Remodelações & Reabilitação",
    short: "Renove o seu espaço com soluções modernas e duradouras.",
    description:
      "Especialistas em remodelações totais ou parciais — cozinhas, casas de banho, interiores e reabilitação de edifícios antigos.",
    hero: img("photo-1556909114-f6e7ad7d3136"),
    icon: "trowel",
    benefits: [
      { title: "Soluções chave-na-mão", desc: "Da demolição à decoração final, tratamos de tudo." },
      { title: "Design funcional", desc: "Propostas adaptadas ao seu estilo e orçamento." },
      { title: "Mínima perturbação", desc: "Trabalho organizado e limpeza diária da obra." },
      { title: "Valorização do imóvel", desc: "Acabamentos modernos que aumentam o valor da sua casa." },
    ],
    process: [
      { title: "Reunião inicial", desc: "Compreendemos a sua visão e necessidades." },
      { title: "Proposta e moodboard", desc: "Apresentamos materiais, soluções e custos." },
      { title: "Execução faseada", desc: "Calendarizamos por divisões para reduzir o impacto." },
      { title: "Entrega e limpeza final", desc: "Casa pronta a usar, sem detalhes por terminar." },
    ],
    useCases: ["Cozinhas e casas de banho", "Apartamentos completos", "Reabilitação de prédios antigos", "Lojas e escritórios"],
    gallery: [
      img("photo-1600585154340-be6161a56a0c"),
      img("photo-1567016432779-094069958ea5"),
      img("photo-1556909114-f6e7ad7d3136"),
      img("photo-1600566753190-17f0baa2a6c3"),
    ],
    faq: [
      { q: "Posso continuar a viver na casa?", a: "Sempre que possível organizamos a obra por fases para minimizar a perturbação." },
      { q: "Tratam do projeto de design?", a: "Sim, trabalhamos com arquitetos parceiros para um resultado coerente." },
    ],
  },
  {
    slug: "pinturas",
    group: "construcao",
    title: "Pinturas Interiores e Exteriores",
    short: "Acabamentos perfeitos, com tintas de alta durabilidade.",
    description:
      "Pintura de interiores, fachadas, varandas e estruturas metálicas com preparação cuidada das superfícies.",
    hero: img("photo-1562259949-e8e7689d7828"),
    icon: "paint",
    benefits: [
      { title: "Preparação cuidada", desc: "Lixagem, betumagem e primário para um resultado duradouro." },
      { title: "Tintas premium", desc: "Marcas reconhecidas e cores à sua escolha." },
      { title: "Proteção do espaço", desc: "Cobrimos mobília e pavimentos com rigor." },
      { title: "Acabamento impecável", desc: "Linhas direitas e cantos perfeitos." },
    ],
    process: [
      { title: "Avaliação de superfícies", desc: "Identificamos humidades, fissuras e defeitos." },
      { title: "Preparação", desc: "Reparação, lixagem e aplicação de primário." },
      { title: "Aplicação da tinta", desc: "Demãos uniformes com técnica adequada." },
      { title: "Limpeza final", desc: "Entregamos o espaço pronto a habitar." },
    ],
    useCases: ["Apartamentos e moradias", "Fachadas de edifícios", "Espaços comerciais", "Estruturas metálicas"],
    gallery: [
      img("photo-1562259949-e8e7689d7828"),
      img("photo-1589939705384-5185137a7f0f"),
      img("photo-1572177812156-58036aae439c"),
      img("photo-1595909079737-194b4b58e88e"),
    ],
    faq: [
      { q: "Que tipo de tintas usam?", a: "Trabalhamos com tintas aquosas de alta cobertura, ecológicas e laváveis." },
      { q: "Fazem amostras de cor?", a: "Sim, aplicamos amostras na parede para validar a cor com luz natural." },
    ],
  },
  {
    slug: "limpeza-fachadas",
    group: "limpeza",
    title: "Limpeza de Fachadas",
    short: "Devolva a sua fachada ao estado original.",
    description:
      "Limpeza profissional de fachadas com equipamento de alta pressão e produtos específicos que removem sujidade, fungos e poluição sem agredir os materiais.",
    hero: img("photo-1503594384566-461fe158e797"),
    icon: "spray",
    benefits: [
      { title: "Resultado imediato", desc: "Diferença visível desde o primeiro metro tratado." },
      { title: "Sem danificar materiais", desc: "Pressão calibrada para cada tipo de superfície." },
      { title: "Tratamento antifungos", desc: "Aplicação opcional para prolongar o efeito." },
      { title: "Equipa segura e certificada", desc: "Trabalhos em altura com todas as normas cumpridas." },
    ],
    process: [
      { title: "Análise da fachada", desc: "Identificamos o tipo de sujidade e materiais." },
      { title: "Montagem de meios", desc: "Andaimes, plataformas elevatórias ou trabalhos verticais." },
      { title: "Limpeza profissional", desc: "Hidrolimpeza e produtos específicos." },
      { title: "Tratamento e proteção", desc: "Aplicação opcional de hidrofugante ou antifungos." },
    ],
    useCases: ["Edifícios residenciais", "Condomínios", "Hotéis e restaurantes", "Espaços comerciais"],
    gallery: [
      img("photo-1503594384566-461fe158e797"),
      img("photo-1486325212027-8081e485255e"),
      img("photo-1597047084897-51e81819a499"),
      img("photo-1517089596392-fb9a9033e05b"),
    ],
    faq: [
      { q: "Trabalham em prédios altos?", a: "Sim, dispomos de equipa certificada para trabalhos em altura." },
      { q: "É necessário desocupar o edifício?", a: "Não, o trabalho é feito pelo exterior sem incomodar os ocupantes." },
      { q: "Quanto tempo demora?", a: "Depende da área e do estado da fachada — em média 2 a 5 dias." },
    ],
  },
  {
    slug: "limpeza-telhados",
    group: "limpeza",
    title: "Limpeza e Tratamento de Telhados",
    short: "Telhados limpos, impermeabilizados e protegidos.",
    description:
      "Remoção de musgo, líquenes e sujidade acumulada, seguida de aplicação de tratamento antifungos e impermeabilizante para prolongar a vida útil do telhado.",
    hero: img("photo-1605276374104-dee2a0ed3cd6"),
    icon: "roof",
    benefits: [
      { title: "Mais durabilidade", desc: "Evita infiltrações e degradação das telhas." },
      { title: "Eficiência térmica", desc: "Telhado limpo reflete melhor a luz solar." },
      { title: "Valorização do imóvel", desc: "Aspeto cuidado e preservado." },
      { title: "Garantia de tratamento", desc: "Produtos com efeito comprovado a longo prazo." },
    ],
    process: [
      { title: "Inspeção do telhado", desc: "Avaliamos estado, inclinação e materiais." },
      { title: "Limpeza inicial", desc: "Remoção mecânica e hidrolimpeza." },
      { title: "Tratamento antifungos", desc: "Aplicação de biocida específico." },
      { title: "Impermeabilização", desc: "Aplicação opcional de hidrofugante incolor." },
    ],
    useCases: ["Moradias", "Armazéns industriais", "Condomínios", "Edifícios públicos"],
    gallery: [
      img("photo-1605276374104-dee2a0ed3cd6"),
      img("photo-1632759145355-8b8b1a1c6f7c"),
      img("photo-1518780664697-55e3ad937233"),
      img("photo-1416331108676-a22ccb276e35"),
    ],
    faq: [
      { q: "Com que frequência se deve limpar?", a: "Recomendamos a cada 5 a 7 anos, dependendo da exposição." },
      { q: "Substituem telhas partidas?", a: "Sim, identificamos e substituímos telhas durante a intervenção." },
    ],
  },
  {
    slug: "limpeza-pavimentos",
    group: "limpeza",
    title: "Limpeza de Pavimentos Exteriores",
    short: "Pátios, passeios e estacionamentos como novos.",
    description:
      "Hidrolimpeza profissional de pavimentos em pedra, betão, calçada portuguesa, deck e outros materiais exteriores.",
    hero: img("photo-1558618666-fcd25c85cd64"),
    icon: "road",
    benefits: [
      { title: "Remove sujidade incrustada", desc: "Óleos, musgo, manchas e sujidade urbana." },
      { title: "Maior segurança", desc: "Reduz o risco de quedas em superfícies escorregadias." },
      { title: "Acabamento uniforme", desc: "Cor e textura recuperadas." },
      { title: "Tratamentos opcionais", desc: "Selante e proteção anti-manchas." },
    ],
    process: [
      { title: "Identificação do material", desc: "Cada pavimento exige uma técnica específica." },
      { title: "Pré-tratamento", desc: "Aplicação de produtos para soltar sujidade." },
      { title: "Hidrolimpeza", desc: "Pressão calibrada e bicos rotativos." },
      { title: "Selagem opcional", desc: "Proteção para prolongar o efeito." },
    ],
    useCases: ["Pátios e jardins", "Estacionamentos", "Calçadas e passeios", "Decks e varandas"],
    gallery: [
      img("photo-1558618666-fcd25c85cd64"),
      img("photo-1572025442646-866d16c84a54"),
      img("photo-1604014237800-1c9102c219da"),
      img("photo-1592595896616-c37162298647"),
    ],
    faq: [
      { q: "É seguro para pavimentos delicados?", a: "Sim, ajustamos a pressão e produtos ao tipo de material." },
      { q: "Trabalham em condomínios?", a: "Sim, fazemos contratos de manutenção periódica." },
    ],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
