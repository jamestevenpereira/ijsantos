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

// Photos are served from /public/portfolio (originally sourced from the
// client's existing site, ijsantos.com, and migrated to local hosting for
// performance and resilience).
const full = (file: string) => `/portfolio/${file}`;
const thumb = (file: string) => `/portfolio/thumbs/${file.replace(/\.jpg$/, "-400x400.jpg")}`;

export type PortfolioItem = {
  src: string;
  thumb: string;
  category: PortfolioCategory;
  alt: string;
};

const item = (
  category: PortfolioCategory,
  alt: string,
  file: string,
): PortfolioItem => ({ category, alt, src: full(file), thumb: thumb(file) });

export const portfolio: PortfolioItem[] = [
  // — Pavilhões Industriais —
  item("pavilhoes", "Pavilhão industrial — IJ Santos", "PAVILHOES-1.jpg"),
  item("pavilhoes", "Pavilhão industrial — estrutura em construção", "IMG_20230418_142421.jpg"),
  item("pavilhoes", "Pavilhão industrial — vista exterior", "IMG_20230418_154053.jpg"),
  item("pavilhoes", "Pavilhão industrial — cobertura metálica", "IMG_20230711_161758.jpg"),
  item("pavilhoes", "Pavilhão industrial em obra", "IMG_5350.jpg"),
  item("pavilhoes", "Estrutura metálica de pavilhão", "IMG_5194.jpg"),

  // — Lojas Comerciais —
  item("lojas", "Loja comercial — IJ Santos", "LOJAS-1.jpg"),
  item("lojas", "Espaço comercial — fachada", "IMG_3975.jpg"),
  item("lojas", "Espaço comercial — interior", "IMG_3985.jpg"),
  item("lojas", "Acabamentos em espaço comercial", "IMG_1313.jpg"),
  item("lojas", "Remodelação de loja comercial", "IMG_1356.jpg"),

  // — Infraestruturas —
  item("infraestruturas", "Infraestruturas — obra em execução", "IMG_20220323_141321.jpg"),
  item("infraestruturas", "Infraestruturas — terraplanagem", "IMG_20220328_090354.jpg"),
  item("infraestruturas", "Infraestruturas — fase de execução", "IMG_20220328_093630.jpg"),
  item("infraestruturas", "Infraestruturas — fundações", "IMG_20220401_112018.jpg"),
  item("infraestruturas", "Infraestruturas — estrutura", "IMG_20220421_103632.jpg"),
  item("infraestruturas", "Infraestruturas — execução", "IMG_20220901_150948.jpg"),
  item("infraestruturas", "Infraestruturas — fase final", "IMG_20230412_114409.jpg"),
  item("infraestruturas", "Infraestruturas — execução", "IMG_20230414_112140.jpg"),
  item("infraestruturas", "Infraestruturas", "IMG_20230418_115516.jpg"),

  // — Obras Públicas —
  item("obras-publicas", "Obra pública — IJ Santos", "OBRAS-P-1.jpg"),
  item("obras-publicas", "Obra pública", "OBRAS-P-2.jpg"),
  item("obras-publicas", "Obra pública — execução", "IMG_0069.jpg"),
  item("obras-publicas", "Obra pública — execução", "IMG_0072.jpg"),
  item("obras-publicas", "Obra pública — exterior", "IMG_0075.jpg"),
  item("obras-publicas", "Obra pública — execução", "IMG_0422.jpg"),
  item("obras-publicas", "Obra pública", "IMG_20240103_135543.jpg"),

  // — Construção Habitacional —
  item("habitacional", "Construção habitacional — IJ Santos", "CONSTRUCAO-3.jpg"),
  item("habitacional", "Moradia — execução", "IMG_1557.jpg"),
  item("habitacional", "Moradia — fachada", "IMG_1559.jpg"),
  item("habitacional", "Moradia — interior", "2bd2140e-c205-4df6-8d41-a213ebff7c07.jpg"),
  item("habitacional", "Moradia", "4087401a-f326-42e6-afb3-15bcc23d038a.jpg"),
  item("habitacional", "Moradia — exterior", "679b1669-986f-4011-8f51-8ca340e5c861.jpg"),
  item("habitacional", "Moradia — pormenor", "8a46e699-81cd-4528-a16a-904c17c01ace.jpg"),
  item("habitacional", "Moradia — execução", "8b22d7fd-192e-4ed9-b761-68e757e6263b.jpg"),
  item("habitacional", "Moradia — exterior", "f732e2c3-d963-4719-b3f3-40cbb58ec20f.jpg"),
  item("habitacional", "Moradia — pormenor", "58402403772__384D73FC-9850-419D-8992-E0347E484578.jpg"),
];

export const videos: { src: string; poster?: string; title: string }[] = [
  {
    src: "/videos/obras-1.mp4",
    poster: full("PAVILHOES-1.jpg"),
    title: "Trabalhos em obra — IJ Santos",
  },
  {
    src: "/videos/obras-2.mp4",
    poster: full("CONSTRUCAO-3.jpg"),
    title: "Construção e execução",
  },
];
