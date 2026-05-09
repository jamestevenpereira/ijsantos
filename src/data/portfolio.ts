export type PortfolioCategory =
  | "pavilhoes"
  | "lojas"
  | "infraestruturas"
  | "obras-publicas"
  | "habitacional";

export const categoryLabels: Record<PortfolioCategory, string> = {
  pavilhoes: "Pavilhões Industriais",
  lojas: "Lojas Comerciais",
  infraestruturas: "Infraestruturas",
  "obras-publicas": "Obras Públicas",
  habitacional: "Construção Habitacional",
};

export const categoryOrder: PortfolioCategory[] = [
  "pavilhoes",
  "lojas",
  "infraestruturas",
  "obras-publicas",
  "habitacional",
];

const wp = (path: string) => `https://ijsantos.com/wp-content/uploads/${path}`;

export type PortfolioItem = {
  src: string;
  thumb: string;
  category: PortfolioCategory;
  alt: string;
};

// All photos sourced from the client's existing site (ijsantos.com).
// Filenames prefixed with PAVILHOES/LOJAS/OBRAS-P/CONSTRUCAO are explicitly
// labelled by the client; the remaining IMG_* files are real jobs distributed
// across categories.
export const portfolio: PortfolioItem[] = [
  // — Pavilhões Industriais —
  { category: "pavilhoes", alt: "Pavilhão industrial", src: wp("2025/03/PAVILHOES-1.jpg"), thumb: wp("2025/03/PAVILHOES-1-400x400.jpg") },
  { category: "pavilhoes", alt: "Pavilhão — estrutura", src: wp("2025/03/IMG_20230418_142421.jpg"), thumb: wp("2025/03/IMG_20230418_142421-400x400.jpg") },
  { category: "pavilhoes", alt: "Pavilhão — exterior", src: wp("2025/03/IMG_20230418_154053.jpg"), thumb: wp("2025/03/IMG_20230418_154053-400x400.jpg") },
  { category: "pavilhoes", alt: "Pavilhão — cobertura", src: wp("2025/03/IMG_20230711_161758.jpg"), thumb: wp("2025/03/IMG_20230711_161758-400x400.jpg") },
  { category: "pavilhoes", alt: "Pavilhão industrial em obra", src: wp("2025/03/IMG_5350.jpg"), thumb: wp("2025/03/IMG_5350-400x400.jpg") },
  { category: "pavilhoes", alt: "Estrutura metálica", src: wp("2025/03/IMG_5194.jpg"), thumb: wp("2025/03/IMG_5194-400x400.jpg") },

  // — Lojas Comerciais —
  { category: "lojas", alt: "Loja comercial", src: wp("2025/03/LOJAS-1.jpg"), thumb: wp("2025/03/LOJAS-1-400x400.jpg") },
  { category: "lojas", alt: "Espaço comercial", src: wp("2025/03/IMG_3975.jpg"), thumb: wp("2025/03/IMG_3975-400x400.jpg") },
  { category: "lojas", alt: "Espaço comercial — interior", src: wp("2025/03/IMG_3985.jpg"), thumb: wp("2025/03/IMG_3985-400x400.jpg") },
  { category: "lojas", alt: "Acabamentos comerciais", src: wp("2025/03/IMG_1313.jpg"), thumb: wp("2025/03/IMG_1313-400x400.jpg") },
  { category: "lojas", alt: "Remodelação comercial", src: wp("2025/03/IMG_1356.jpg"), thumb: wp("2025/03/IMG_1356-400x400.jpg") },

  // — Infraestruturas —
  { category: "infraestruturas", alt: "Infraestruturas — obra", src: wp("2025/03/IMG_20220323_141321.jpg"), thumb: wp("2025/03/IMG_20220323_141321-400x400.jpg") },
  { category: "infraestruturas", alt: "Infraestruturas — terraplanagem", src: wp("2025/03/IMG_20220328_090354.jpg"), thumb: wp("2025/03/IMG_20220328_090354-400x400.jpg") },
  { category: "infraestruturas", alt: "Infraestruturas — execução", src: wp("2025/03/IMG_20220328_093630.jpg"), thumb: wp("2025/03/IMG_20220328_093630-400x400.jpg") },
  { category: "infraestruturas", alt: "Infraestruturas — fundações", src: wp("2025/03/IMG_20220401_112018.jpg"), thumb: wp("2025/03/IMG_20220401_112018-400x400.jpg") },
  { category: "infraestruturas", alt: "Infraestruturas — estrutura", src: wp("2025/03/IMG_20220421_103632.jpg"), thumb: wp("2025/03/IMG_20220421_103632-400x400.jpg") },
  { category: "infraestruturas", alt: "Infraestruturas — execução", src: wp("2025/03/IMG_20220901_150948.jpg"), thumb: wp("2025/03/IMG_20220901_150948-400x400.jpg") },
  { category: "infraestruturas", alt: "Infraestruturas — fase final", src: wp("2025/03/IMG_20230412_114409.jpg"), thumb: wp("2025/03/IMG_20230412_114409-400x400.jpg") },
  { category: "infraestruturas", alt: "Infraestruturas — execução", src: wp("2025/03/IMG_20230414_112140.jpg"), thumb: wp("2025/03/IMG_20230414_112140-400x400.jpg") },
  { category: "infraestruturas", alt: "Infraestruturas", src: wp("2025/03/IMG_20230418_115516.jpg"), thumb: wp("2025/03/IMG_20230418_115516-400x400.jpg") },

  // — Obras Públicas —
  { category: "obras-publicas", alt: "Obra pública", src: wp("2025/03/OBRAS-P-1.jpg"), thumb: wp("2025/03/OBRAS-P-1-400x400.jpg") },
  { category: "obras-publicas", alt: "Obra pública", src: wp("2025/03/OBRAS-P-2.jpg"), thumb: wp("2025/03/OBRAS-P-2-400x400.jpg") },
  { category: "obras-publicas", alt: "Obra pública — execução", src: wp("2025/03/IMG_0069.jpg"), thumb: wp("2025/03/IMG_0069-400x400.jpg") },
  { category: "obras-publicas", alt: "Obra pública — execução", src: wp("2025/03/IMG_0072.jpg"), thumb: wp("2025/03/IMG_0072-400x400.jpg") },
  { category: "obras-publicas", alt: "Obra pública — exterior", src: wp("2025/03/IMG_0075.jpg"), thumb: wp("2025/03/IMG_0075-400x400.jpg") },
  { category: "obras-publicas", alt: "Obra pública — execução", src: wp("2025/03/IMG_0422.jpg"), thumb: wp("2025/03/IMG_0422-400x400.jpg") },
  { category: "obras-publicas", alt: "Obra pública", src: wp("2025/03/IMG_20240103_135543.jpg"), thumb: wp("2025/03/IMG_20240103_135543-400x400.jpg") },

  // — Construção Habitacional —
  { category: "habitacional", alt: "Construção habitacional", src: wp("2025/03/CONSTRUCAO-3.jpg"), thumb: wp("2025/03/CONSTRUCAO-3-400x400.jpg") },
  { category: "habitacional", alt: "Moradia — execução", src: wp("2025/03/IMG_1557.jpg"), thumb: wp("2025/03/IMG_1557-400x400.jpg") },
  { category: "habitacional", alt: "Moradia — fachada", src: wp("2025/03/IMG_1559.jpg"), thumb: wp("2025/03/IMG_1559-400x400.jpg") },
  { category: "habitacional", alt: "Moradia — interior", src: wp("2025/03/2bd2140e-c205-4df6-8d41-a213ebff7c07.jpg"), thumb: wp("2025/03/2bd2140e-c205-4df6-8d41-a213ebff7c07-400x400.jpg") },
  { category: "habitacional", alt: "Moradia", src: wp("2025/03/4087401a-f326-42e6-afb3-15bcc23d038a.jpg"), thumb: wp("2025/03/4087401a-f326-42e6-afb3-15bcc23d038a-400x400.jpg") },
  { category: "habitacional", alt: "Moradia — exterior", src: wp("2025/03/679b1669-986f-4011-8f51-8ca340e5c861.jpg"), thumb: wp("2025/03/679b1669-986f-4011-8f51-8ca340e5c861-400x400.jpg") },
  { category: "habitacional", alt: "Moradia — pormenor", src: wp("2025/03/8a46e699-81cd-4528-a16a-904c17c01ace.jpg"), thumb: wp("2025/03/8a46e699-81cd-4528-a16a-904c17c01ace-400x400.jpg") },
  { category: "habitacional", alt: "Moradia — execução", src: wp("2025/03/8b22d7fd-192e-4ed9-b761-68e757e6263b.jpg"), thumb: wp("2025/03/8b22d7fd-192e-4ed9-b761-68e757e6263b-400x400.jpg") },
  { category: "habitacional", alt: "Moradia — exterior", src: wp("2025/03/f732e2c3-d963-4719-b3f3-40cbb58ec20f.jpg"), thumb: wp("2025/03/f732e2c3-d963-4719-b3f3-40cbb58ec20f-400x400.jpg") },
  { category: "habitacional", alt: "Moradia — pormenor", src: wp("2025/03/58402403772__384D73FC-9850-419D-8992-E0347E484578.jpg"), thumb: wp("2025/03/58402403772__384D73FC-9850-419D-8992-E0347E484578-400x400.jpg") },
];

export const videos: { src: string; poster?: string; title: string }[] = [
  {
    src: wp("2025/03/WhatsApp-Video-2025-03-04-at-19.20.26.mp4"),
    poster: wp("2025/03/PAVILHOES-1.jpg"),
    title: "Trabalhos em obra — IJ Santos",
  },
  {
    src: wp("2025/03/WhatsApp-Video-2025-03-05-at-11.09.25.mp4"),
    poster: wp("2025/03/CONSTRUCAO-3.jpg"),
    title: "Construção e execução",
  },
];
