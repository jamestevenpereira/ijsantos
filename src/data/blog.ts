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
};

export const blogPosts: BlogPost[] = [
  {
    slug: "como-limpar-fachadas-granito",
    titlePt: "Como limpar fachadas de granito sem danificar a pedra",
    titleEn: "How to clean granite facades without damaging the stone",
    excerptPt: "O granito é um dos materiais mais comuns nas fachadas da região centro. Descubra os métodos de limpeza profissional que preservam a pedra e garantem resultados duradouros.",
    excerptEn: "Granite is one of the most common facade materials in central Portugal. Discover professional cleaning methods that preserve the stone and ensure long-lasting results.",
    category: "Limpezas",
    readTime: 4,
    date: "2025-03-15",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80&auto=format&fit=crop",
  },
  {
    slug: "guia-precos-remodelacao-viseu",
    titlePt: "Guia de preços para remodelação de casa em Viseu (2025)",
    titleEn: "Price guide for home renovation in Viseu (2025)",
    excerptPt: "Quanto custa remodelar uma casa em Viseu? Uma referência de preços por tipo de obra, com base em projetos reais executados pela nossa equipa na região centro.",
    excerptEn: "How much does it cost to renovate a house in Viseu? A price reference by project type, based on real projects carried out by our team in the central region.",
    category: "Construção",
    readTime: 6,
    date: "2025-02-28",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80&auto=format&fit=crop",
  },
  {
    slug: "sinais-telhado-precisa-manutencao",
    titlePt: "5 sinais de que o seu telhado precisa de manutenção urgente",
    titleEn: "5 signs your roof needs urgent maintenance",
    excerptPt: "Manchas de humidade, telhas partidas ou musgo acumulado são avisos que não deve ignorar. Saiba identificar quando é necessário agir antes que os problemas se agravem.",
    excerptEn: "Damp stains, broken tiles or accumulated moss are warnings you shouldn't ignore. Learn to identify when you need to act before problems worsen.",
    category: "Telhados",
    readTime: 3,
    date: "2025-01-20",
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80&auto=format&fit=crop",
  },
];
