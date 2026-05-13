import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  portfolio,
  categoryOrder,
  type PortfolioCategory,
} from "@/data/portfolio";
import { slugToCategoryName } from "@/data/portfolio-categories";
import { listPortfolioItems } from "@/lib/portfolio-db";
import { CTABand } from "@/components/sections/CTABand";

export const Route = createFileRoute("/portefolio")({
  head: () => ({
    meta: [
      { title: "Portefólio · IJ Santos" },
      {
        name: "description",
        content:
          "Portefólio de obras de construção civil, remodelação e limpezas exteriores executadas pela IJ Santos em Nelas, Viseu, Mangualde e região centro. +500 projetos concluídos com garantia.",
      },
      { property: "og:title", content: "Portefólio de obras · IJ Santos" },
      {
        property: "og:description",
        content: "Galeria de obras executadas pela IJ Santos em construção civil e obras públicas.",
      },
      { property: "og:url", content: "https://ijsantos.pt/portefolio" },
    ],
  }),
  component: PortfolioPage,
});

type Filter = "todos" | PortfolioCategory;

const PAGE_SIZE = 12;

function PortfolioPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>("todos");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const { data: dbItems = [] } = useQuery({
    queryKey: ["portfolio_items"],
    queryFn: listPortfolioItems,
    staleTime: 60_000,
  });

  // Merge DB items (preferred, newest first) with static fallback. DB items
  // map their full category name back to the legacy slug used by the UI.
  const allItems = useMemo(() => {
    const nameToSlug = Object.fromEntries(
      Object.entries(slugToCategoryName).map(([slug, name]) => [name, slug as PortfolioCategory]),
    );
    const dbMapped = dbItems
      .map((d) => {
        const slug = nameToSlug[d.category];
        if (!slug) return null;
        return {
          src: d.public_url,
          thumb: d.thumb_url ?? d.public_url,
          category: slug,
          alt: d.title ?? d.category,
        };
      })
      .filter(Boolean) as typeof portfolio;
    return dbMapped.length > 0 ? [...dbMapped, ...portfolio] : portfolio;
  }, [dbItems]);

  const items = useMemo(
    () => (filter === "todos" ? allItems : allItems.filter((p) => p.category === filter)),
    [filter, allItems],
  );

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageItems = items.slice(pageStart, pageStart + PAGE_SIZE);

  useEffect(() => {
    setLightbox(null);
    setPage(1);
  }, [filter]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight")
        setLightbox((i) => (i === null ? null : (i + 1) % items.length));
      if (e.key === "ArrowLeft")
        setLightbox((i) => (i === null ? null : (i - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, items.length]);

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "todos", label: t("portfolio.filter_all"), count: allItems.length },
    ...categoryOrder.map((c) => ({
      key: c,
      label: t(`portfolio.cat.${c}`),
      count: allItems.filter((p) => p.category === c).length,
    })),
  ];

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl container-px py-20 md:py-28 text-center md:text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            {t("portfolio.label")}
          </span>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold tracking-tight text-balance max-w-3xl mx-auto md:mx-0">
            {t("portfolio.title")}
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/75 max-w-2xl mx-auto md:mx-0">
            {t("portfolio.body")}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl container-px">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {filters.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                    active
                      ? "bg-brand text-brand-foreground border-brand"
                      : "bg-card text-foreground border-border hover:border-brand/40"
                  }`}
                >
                  {f.label}
                  <span className={`ml-2 text-xs ${active ? "opacity-80" : "text-muted-foreground"}`}>
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {pageItems.map((p, i) => {
              const globalIndex = pageStart + i;
              return (
                <button
                  key={p.src}
                  onClick={() => setLightbox(globalIndex)}
                  className="group relative overflow-hidden rounded-lg border border-border bg-muted aspect-square"
                  aria-label={`${t("portfolio.open_photo")} ${p.alt}`}
                >
                  <img
                    src={p.thumb}
                    alt={p.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute bottom-2 left-2 right-2 text-left text-xs font-semibold uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {t(`portfolio.cat.${p.category}`)}
                  </span>
                </button>
              );
            })}
          </div>

          {items.length === 0 && (
            <p className="text-center text-muted-foreground py-20">{t("portfolio.empty")}</p>
          )}

          {totalPages > 1 && (
            <nav
              className="mt-10 flex items-center justify-center gap-2"
              aria-label={t("portfolio.pagination")}
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-10 px-4 rounded-md border border-border bg-card text-sm font-medium hover:border-brand/40 disabled:opacity-40 disabled:pointer-events-none inline-flex items-center gap-1"
                aria-label={t("portfolio.prev")}
              >
                <ChevronLeft className="h-4 w-4" /> {t("portfolio.prev")}
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
                const active = n === currentPage;
                return (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    aria-current={active ? "page" : undefined}
                    className={`h-10 w-10 rounded-md text-sm font-medium border transition-colors ${
                      active
                        ? "bg-brand text-brand-foreground border-brand"
                        : "bg-card text-foreground border-border hover:border-brand/40"
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-10 px-4 rounded-md border border-border bg-card text-sm font-medium hover:border-brand/40 disabled:opacity-40 disabled:pointer-events-none inline-flex items-center gap-1"
                aria-label={t("portfolio.next")}
              >
                {t("portfolio.next")} <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          )}
        </div>
      </section>

      <CTABand />

      {lightbox !== null && items[lightbox] && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm grid place-items-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 h-11 w-11 rounded-full bg-white/10 text-white grid place-items-center hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 text-white grid place-items-center hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i === null ? 0 : (i - 1 + items.length) % items.length));
            }}
            aria-label="Foto anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 text-white grid place-items-center hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i === null ? 0 : (i + 1) % items.length));
            }}
            aria-label="Próxima foto"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <figure className="max-h-[88vh] max-w-[96vw]" onClick={(e) => e.stopPropagation()}>
            <img
              src={items[lightbox].src}
              alt={items[lightbox].alt}
              className="max-h-[80vh] max-w-[96vw] object-contain rounded-lg shadow-2xl"
            />
            <figcaption className="mt-3 text-center text-white/80 text-sm">
              {t(`portfolio.cat.${items[lightbox].category}`)} — {lightbox + 1} / {items.length}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
