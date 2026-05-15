export type BlogSection =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] };

export type BlogPost = {
  slug: string;
  titlePt: string;
  titleEn: string;
  excerptPt: string;
  excerptEn: string;
  category: string;
  readTime: number;
  date: string;
  image: string;
  relatedService?: string;
  bodyPt: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "guia-precos-remodelacao-viseu",
    titlePt: "Guia de preços para remodelação de casa em Viseu (2026)",
    titleEn: "Price guide for home renovation in Viseu (2026)",
    excerptPt:
      "Quanto custa remodelar uma casa em Viseu em 2026? Uma referência de preços por tipo de obra, com base em projetos reais executados pela nossa equipa na região centro.",
    excerptEn:
      "How much does it cost to renovate a house in Viseu in 2026? A price reference by project type, based on real projects in central Portugal.",
    category: "Construção",
    readTime: 6,
    date: "2026-03-10",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80&auto=format&fit=crop",
    relatedService: "remodelacoes-reabilitacao",
    bodyPt: [
      {
        type: "paragraph",
        text: "Remodelar uma casa em Viseu em 2026 é um investimento que varia muito consoante o estado do imóvel, o tipo de obra e os acabamentos escolhidos. Com base nos projetos que a IJ Santos executou na região centro nos últimos anos, reunimos valores de referência para ajudar a planear o seu orçamento.",
      },
      {
        type: "paragraph",
        text: "Estes preços são indicativos e podem variar entre 15% a 30% dependendo de fatores como o estado das infraestruturas existentes, o acesso ao espaço e a complexidade do projeto. O único modo de obter um valor rigoroso é através de uma visita técnica — que a IJ Santos realiza gratuitamente.",
      },
      {
        type: "heading",
        text: "Remodelação de cozinha",
      },
      {
        type: "paragraph",
        text: "Uma remodelação de cozinha em Viseu custa, em média, entre 4.000€ e 14.000€. Uma intervenção básica — substituição de revestimentos, pintura e novos eletrodomésticos sem alterar a distribuição — fica entre 4.000€ e 7.000€. Uma remodelação completa com novo mobiliário, bancada em pedra e canalização reposicionada pode atingir os 12.000€ a 18.000€ em habitações de maior dimensão.",
      },
      {
        type: "heading",
        text: "Remodelação de casa de banho",
      },
      {
        type: "paragraph",
        text: "Casas de banho completas ficam entre 2.500€ e 9.000€. Uma substituição simples de sanita, lavatório e banheira por base de duche, com novos revestimentos e pintura, fica em média entre 3.000€ e 5.000€. Intervenções com mosaicos de gama alta, sistema de duche encastrado e móvel suspenso aproximam-se dos 8.000€ a 10.000€.",
      },
      {
        type: "heading",
        text: "Remodelação total de moradia",
      },
      {
        type: "paragraph",
        text: "Para obras de fundo — estrutura, distribuição interior, instalações elétricas e de água, revestimentos e acabamentos — o custo por metro quadrado em Viseu situa-se entre 600€ e 950€/m². Uma moradia de 150m² em estado de degradação média pode assim representar um investimento entre 90.000€ e 140.000€, dependendo da qualidade dos acabamentos escolhidos.",
      },
      {
        type: "heading",
        text: "Fatores que influenciam o preço final",
      },
      {
        type: "list",
        items: [
          "Estado das infraestruturas existentes (canalização e eletricidade antigas aumentam o custo)",
          "Necessidade de licenciamento camarário (obrigatório em obras estruturais ou de alteração de uso)",
          "Tipo e qualidade dos materiais de acabamento (cerâmica, pedra natural, madeira)",
          "Acesso ao espaço — obras em apartamentos em pisos elevados ou edifícios sem elevador têm custo de logística mais elevado",
          "Prazo de execução — obras urgentes com equipas em regime intensivo têm um acréscimo de custo",
        ],
      },
      {
        type: "paragraph",
        text: "Na IJ Santos, elaboramos propostas detalhadas por fases de obra, para que o cliente saiba exatamente o que está a pagar em cada etapa. Se está a planear uma remodelação em Viseu, Nelas ou na região centro, contacte-nos para marcar uma visita técnica gratuita e sem compromisso.",
      },
    ],
  },
  {
    slug: "como-limpar-fachadas-granito",
    titlePt: "Como limpar fachadas de granito sem danificar a pedra",
    titleEn: "How to clean granite facades without damaging the stone",
    excerptPt:
      "O granito é um dos materiais mais comuns nas fachadas da região centro. Descubra os métodos de limpeza profissional que preservam a pedra e garantem resultados duradouros.",
    excerptEn:
      "Granite is one of the most common facade materials in central Portugal. Discover professional cleaning methods that preserve the stone.",
    category: "Limpezas",
    readTime: 4,
    date: "2026-02-18",
    image:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80&auto=format&fit=crop",
    relatedService: "limpeza-fachadas",
    bodyPt: [
      {
        type: "paragraph",
        text: "O granito é a pedra dominante na construção tradicional da região centro de Portugal — de Viseu a Nelas, de Mangualde a Gouveia. É resistente, duradouro e esteticamente marcante. Mas, ao contrário do que muita gente pensa, o granito é uma pedra porosa: acumula humidade, algas, musgos e líquenes que, se não tratados corretamente, podem danificar a superfície de forma permanente.",
      },
      {
        type: "paragraph",
        text: "A limpeza de fachadas de granito exige técnica e produtos adequados. Uma abordagem incorreta — nomeadamente o uso de pressão excessiva ou produtos químicos agressivos — pode abrir microporos na pedra, acelerar a sua degradação e criar condições para que a sujidade volte mais rapidamente.",
      },
      {
        type: "heading",
        text: "Métodos profissionais de limpeza",
      },
      {
        type: "paragraph",
        text: "A abordagem mais eficaz e segura para fachadas de granito é a lavagem a baixa pressão (máximo 80-100 bar) combinada com produtos biocidas de pH neutro ou levemente alcalino. O produto é aplicado na fachada e deixado a atuar durante 15 a 30 minutos para eliminar algas e líquenes em profundidade. Em seguida, a fachada é lavada com água limpa a baixa pressão. Em casos de manchas de ferrugem ou carbonato de cálcio, podem ser usados produtos específicos de base ácida muito diluída, sempre controlados por um técnico.",
      },
      {
        type: "paragraph",
        text: "Após a limpeza, recomendamos a aplicação de um hidrofugante incolor de penetração profunda. Este produto cria uma barreira impermeável que repele a água e retarda significativamente o reaparecimento de musgo e algas — especialmente importante na região centro, onde a humidade e as chuvas de inverno são intensas.",
      },
      {
        type: "heading",
        text: "O que NÃO fazer numa fachada de granito",
      },
      {
        type: "list",
        items: [
          "Usar lança de alta pressão (acima de 150 bar) — abre microporos e leva a pedra ao desgaste prematuro",
          "Aplicar lixívia diretamente na pedra — mancha e destrói os biocidas naturais da pedra",
          "Usar ácidos concentrados sem diluição controlada — corroem a superfície e alteram a cor",
          "Esfregar com escovas de aço — riscam a pedra e deixam resíduos de ferrugem",
          "Limpar com água quente em dias de gelo — o choque térmico pode provocar micro-fissuras",
        ],
      },
      {
        type: "paragraph",
        text: "A IJ Santos realiza limpeza profissional de fachadas de granito em Nelas, Viseu, Mangualde e toda a região centro. A nossa equipa utiliza equipamentos calibrados e produtos certificados que garantem resultados duradouros sem danificar a pedra. Pedido de orçamento gratuito em menos de 24 horas.",
      },
    ],
  },
  {
    slug: "sinais-telhado-precisa-manutencao",
    titlePt: "5 sinais de que o seu telhado precisa de manutenção urgente",
    titleEn: "5 signs your roof needs urgent maintenance",
    excerptPt:
      "Manchas de humidade, telhas partidas ou musgo acumulado são avisos que não deve ignorar. Saiba identificar quando é necessário agir antes que os problemas se agravem.",
    excerptEn:
      "Damp stains, broken tiles or accumulated moss are warnings you shouldn't ignore.",
    category: "Telhados",
    readTime: 3,
    date: "2026-01-22",
    image:
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80&auto=format&fit=crop",
    relatedService: "limpeza-telhados",
    bodyPt: [
      {
        type: "paragraph",
        text: "O telhado é o elemento da casa mais exposto às condições climáticas e, ao mesmo tempo, o mais ignorado na manutenção regular. Na região centro de Portugal — com invernos húmidos, geadas em altitude e chuvas intensas de outubro a março — um telhado sem manutenção pode originar problemas graves em poucos anos. A boa notícia: na maioria dos casos, uma intervenção precoce é muito mais barata do que uma reparação de emergência.",
      },
      {
        type: "heading",
        text: "1. Manchas de humidade nas paredes interiores ou no teto",
      },
      {
        type: "paragraph",
        text: "Manchas escuras ou húmidas no teto de divisões superiores são o sinal mais evidente de que o telhado tem uma infiltração ativa. O problema raramente resolve sozinho — tende a agravar-se com as chuvas e pode comprometer a estrutura de madeira ou betão do telhado se não for tratado rapidamente. Se detectar estas manchas, procure assistência técnica antes do outono.",
      },
      {
        type: "heading",
        text: "2. Telhas partidas, deslocadas ou em falta",
      },
      {
        type: "paragraph",
        text: "Ventos fortes, geadas e variações térmicas extremas são as principais causas de telhas partidas ou deslocadas. Uma telha em falta é uma entrada direta de água. Inspecione o telhado visualmente após tempestades ou períodos de geada intensa — se encontrar telhas no chão ou zonas visivelmente descobertas, não adie a reparação.",
      },
      {
        type: "heading",
        text: "3. Musgo, líquenes ou algas acumulados",
      },
      {
        type: "paragraph",
        text: "A presença de musgo e líquenes não é apenas estética. Estas plantas retêm humidade na superfície da telha, aceleram a sua degradação e, com o tempo, levantam as telhas ao crescer entre elas. Um telhado com musgo significativo pesa mais, drena pior e tem uma vida útil muito reduzida. A limpeza e o tratamento com produto biocida e hidrofugante resolvem o problema e previnem o reaparecimento por vários anos.",
      },
      {
        type: "heading",
        text: "4. Calhas e algerozes entupidos ou danificados",
      },
      {
        type: "paragraph",
        text: "As calhas de escoamento são parte do sistema do telhado. Quando estão entupidas com folhas e detritos, a água transborda e escorre pelas paredes exteriores, originando humidade, manchas e degradação da fachada. Limpe as calhas pelo menos duas vezes por ano — no final do outono e no final do inverno.",
      },
      {
        type: "heading",
        text: "5. Telhado com mais de 15 anos sem qualquer intervenção",
      },
      {
        type: "paragraph",
        text: "Os telhados de telha cerâmica têm uma vida útil de 30 a 50 anos, mas requerem manutenção periódica. Um telhado com mais de 15 anos sem qualquer inspeção ou tratamento é candidato a problemas nos próximos anos. Uma inspeção técnica gratuita permite identificar os pontos críticos antes que se tornem urgências dispendiosas. Na IJ Santos, realizamos inspeções gratuitas em toda a região centro.",
      },
    ],
  },
  {
    slug: "quanto-custa-construir-moradia-nelas",
    titlePt: "Quanto custa construir uma moradia em Nelas em 2026",
    titleEn: "How much does it cost to build a house in Nelas in 2026",
    excerptPt:
      "Guia de preços para construção de moradia nova em Nelas e região de Viseu. Valores por metro quadrado, fatores de variação e o que está incluído no preço.",
    excerptEn:
      "Price guide for new house construction in Nelas and the Viseu region. Cost per square metre and key factors.",
    category: "Construção",
    readTime: 5,
    date: "2026-04-05",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&auto=format&fit=crop",
    relatedService: "construcao-civil",
    bodyPt: [
      {
        type: "paragraph",
        text: "Construir uma moradia de raiz em Nelas ou nos concelhos vizinhos de Viseu e Mangualde é um dos maiores investimentos que uma família faz. Em 2026, o custo de construção na região centro de Portugal subiu em relação a anos anteriores, fruto do aumento dos preços dos materiais e da mão de obra especializada. Neste artigo explicamos o que pode esperar pagar e o que está incluído no preço.",
      },
      {
        type: "heading",
        text: "Custo por metro quadrado em 2026",
      },
      {
        type: "paragraph",
        text: "Na região de Viseu e Nelas, o custo de construção de moradia nova situa-se entre 900€ e 1.400€ por metro quadrado de área de construção, incluindo mão de obra e materiais standard. Para acabamentos de gama alta — pedra natural, caixilharia de alumínio com corte térmico, pavimento radiante — os valores podem atingir 1.600€ a 1.900€/m². Uma moradia de 150m² em standard médio representa assim um investimento entre 135.000€ e 210.000€, antes de projeto, licenciamento e arranjos exteriores.",
      },
      {
        type: "heading",
        text: "O que está incluído no preço de construção",
      },
      {
        type: "list",
        items: [
          "Movimentação de terras e fundações",
          "Estrutura de betão armado ou alvenaria estrutural",
          "Alvenarias interiores e exteriores",
          "Cobertura (telhado ou laje de cobertura)",
          "Instalação elétrica e de telecomunicações",
          "Instalação de canalização e saneamento",
          "Revestimentos interiores (tetos falsos, pavimentos, azulejos em cozinha e casas de banho)",
          "Pintura interior e exterior",
          "Caixilharia e portas interiores",
        ],
      },
      {
        type: "heading",
        text: "O que não está incluído e pode surpreender",
      },
      {
        type: "list",
        items: [
          "Projeto de arquitetura e especialidades (5% a 10% do valor de construção)",
          "Taxas e licenças camarárias (variam por município)",
          "Ligações às redes públicas (água, saneamento, eletricidade)",
          "Arranjos exteriores: muros, portão, jardim, garagem",
          "Eletrodomésticos embutidos",
          "Sistema de aquecimento ou ar condicionado",
        ],
      },
      {
        type: "heading",
        text: "Obra nova em Nelas: o que nos pedem com frequência",
      },
      {
        type: "paragraph",
        text: "Em Nelas e arredores, os projetos mais frequentes são moradias unifamiliares de r/c com andar, entre 150m² e 220m², em terrenos próprios. Trabalhamos com os projetos dos clientes ou recomendamos gabinetes de arquitetura locais. A IJ Santos gere toda a obra — desde a preparação do terreno à entrega das chaves — com equipa própria e sem subcontratos não supervisionados. Contacte-nos para uma visita técnica gratuita e proposta detalhada.",
      },
    ],
  },
  {
    slug: "etics-isolamento-fachadas-vale-a-pena",
    titlePt: "ETICS: isolamento de fachadas — vale a pena na região centro?",
    titleEn: "ETICS facade insulation — is it worth it in central Portugal?",
    excerptPt:
      "O sistema ETICS é a solução mais eficaz para isolar termicamente a fachada de uma moradia. Explicamos como funciona, quanto custa e se compensa no clima de Viseu e arredores.",
    excerptEn:
      "ETICS is the most effective solution for thermally insulating a house facade. We explain how it works and whether it's worth it in the Viseu region.",
    category: "Construção",
    readTime: 5,
    date: "2026-04-22",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80&auto=format&fit=crop",
    relatedService: "pinturas-interiores-exteriores",
    bodyPt: [
      {
        type: "paragraph",
        text: "O ETICS (External Thermal Insulation Composite System) é um sistema de isolamento térmico pelo exterior aplicado diretamente sobre a fachada de um edifício. Consiste na fixação de painéis de poliestireno expandido (EPS) ou lã de rocha à parede, seguida de armação em rede de fibra de vidro e acabamento em reboco delgado. O resultado final é semelhante ao de uma fachada rebocada tradicional, mas com um desempenho térmico e acústico muito superior.",
      },
      {
        type: "heading",
        text: "Como funciona o ETICS",
      },
      {
        type: "paragraph",
        text: "O isolamento pelo exterior tem uma vantagem decisiva sobre o isolamento pelo interior: elimina as pontes térmicas — os pontos por onde o calor escapa através de pilares, vigas e lajes. Uma parede com pontes térmicas perde eficiência independentemente da espessura do isolamento interior. O ETICS envolve toda a fachada como um casaco, mantendo a temperatura interior estável no verão e no inverno.",
      },
      {
        type: "heading",
        text: "Benefícios para a região centro de Portugal",
      },
      {
        type: "list",
        items: [
          "Redução de 30% a 50% nas necessidades de aquecimento — especialmente relevante em Nelas, Mangualde e Gouveia, onde os invernos são frios",
          "Eliminação de condensações e bolores nas paredes — problema frequente em habitações da região com caixilharia antiga",
          "Melhoria do isolamento acústico em fachadas voltadas para ruas movimentadas",
          "Valorização do imóvel e melhoria da classe energética (certificado SCE)",
          "Proteção da estrutura existente contra a humidade e as variações térmicas",
          "Possibilidade de renovar esteticamente a fachada ao mesmo tempo",
        ],
      },
      {
        type: "heading",
        text: "Quanto custa aplicar ETICS em Viseu",
      },
      {
        type: "paragraph",
        text: "O custo de aplicação de ETICS em Viseu e região situa-se entre 55€ e 90€ por metro quadrado de fachada, dependendo da espessura do isolamento (tipicamente 6 cm a 10 cm), do sistema escolhido e do acabamento final. Uma moradia de 150m² com fachada de 200m² tem um custo indicativo entre 11.000€ e 18.000€. Este valor inclui mão de obra, materiais, andaimes e aplicação certificada.",
      },
      {
        type: "heading",
        text: "Vale a pena no clima da região centro?",
      },
      {
        type: "paragraph",
        text: "Sim — e especialmente em Nelas, Gouveia, Seia e arredores da Serra da Estrela, onde as amplitudes térmicas são maiores. O retorno do investimento em poupança energética é tipicamente atingido entre 8 e 12 anos. Para habitações com sistemas de aquecimento a gasolina ou gasóleo, a poupança anual pode ultrapassar os 800€. A IJ Santos aplica ETICS com certificação de produto e garantia escrita em toda a região centro.",
      },
    ],
  },
  {
    slug: "impermeabilizacao-telhados-guia-regiao-centro",
    titlePt:
      "Impermeabilização de telhados: guia completo para o centro de Portugal",
    titleEn: "Roof waterproofing: complete guide for central Portugal",
    excerptPt:
      "Humidade, infiltrações e musgo são os principais inimigos dos telhados na região centro. Saiba quando impermeabilizar, que técnicas usar e quanto custa.",
    excerptEn:
      "Humidity, infiltration and moss are the main enemies of roofs in central Portugal. Learn when to waterproof and how much it costs.",
    category: "Telhados",
    readTime: 4,
    date: "2026-05-08",
    image:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80&auto=format&fit=crop",
    relatedService: "limpeza-telhados",
    bodyPt: [
      {
        type: "paragraph",
        text: "A região centro de Portugal tem um clima que coloca os telhados sob pressão constante: chuvas intensas de outubro a março, geadas frequentes em altitude (especialmente em Seia, Gouveia e arredores da Serra da Estrela), humidade elevada no inverno e verões quentes e secos. Este ciclo de variações extremas degrada as telhas, as argamassas de assentamento e as membranas de impermeabilização ao longo dos anos. Uma intervenção preventiva custa uma fração do que custará reparar os danos estruturais causados pela água.",
      },
      {
        type: "heading",
        text: "Tipos de impermeabilização de telhados",
      },
      {
        type: "list",
        items: [
          "Hidrofugante de penetração (silicone ou siloxano): produto líquido aplicado por pulverização sobre a telha limpa. Penetra na telha e cria uma barreira que repele a água sem alterar o aspeto. Ideal para telhados em bom estado. Duração: 5 a 10 anos.",
          "Tratamento biocida + hidrofugante: eliminação prévia de musgo, algas e líquenes com produto biocida, seguida de aplicação de hidrofugante. A solução mais indicada para telhados com presença de vegetação.",
          "Membrana betuminosa (tela): aplicada em telhados planos ou de baixo declive. Solução robusta com duração de 15 a 25 anos. Requer preparação da superfície e aplicação por técnicos certificados.",
          "Revestimento líquido elastomérico: produto aplicado a rolo ou pistola sobre toda a superfície. Adapta-se a diferentes suportes (telha, betão, fibrocimento). Cria uma membrana flexível resistente a variações térmicas.",
        ],
      },
      {
        type: "heading",
        text: "Quando impermeabilizar — sinais a não ignorar",
      },
      {
        type: "paragraph",
        text: "O momento ideal para impermeabilizar é antes de aparecerem infiltrações — como revisão preventiva a cada 8 a 10 anos. Mas se observar manchas de humidade no teto, musgo espesso, telhas com aspeto poroso ou calcinado, ou argamassa de assentamento a desagregar, não adie a intervenção. Nestes casos, a água já está a entrar, e cada inverno que passa agrava o problema.",
      },
      {
        type: "heading",
        text: "Quanto custa impermeabilizar um telhado na região centro",
      },
      {
        type: "paragraph",
        text: "O custo de impermeabilização varia conforme o método e o estado do telhado: tratamento biocida + hidrofugante em telhado de telha cerâmica: 18€ a 35€/m²; membrana betuminosa em telhado plano: 35€ a 65€/m²; revestimento líquido elastomérico: 25€ a 50€/m². Uma moradia com 100m² de telhado tem um custo indicativo de 1.800€ a 6.500€, dependendo do sistema escolhido. A IJ Santos realiza orçamento gratuito com inspeção técnica incluída.",
      },
    ],
  },
];

export const getBlogPost = (slug: string) =>
  blogPosts.find((p) => p.slug === slug);
