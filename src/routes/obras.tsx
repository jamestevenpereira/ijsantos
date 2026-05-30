import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ChevronLeft, ChevronRight, Images, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { categoryOrder, type PortfolioCategory } from "@/data/portfolio";
import { slugToCategoryName, type PortfolioCategoryName } from "@/data/portfolio-categories";
import { listObras, type ObraDbItem } from "@/lib/obras-db";
import { listPortfolioAlbums, type PortfolioAlbum } from "@/lib/portfolio-db";
import { CTABand } from "@/components/sections/CTABand";

export const Route = createFileRoute("/obras")({
  head: () => ({
    meta: [
      { title: "Obras · IJ Santos" },
      {
        name: "description",
        content:
          "Lista completa de obras e projetos executados pela IJ Santos em construção civil, remodelação e obras públicas na região de Nelas, Viseu e Centro.",
      },
      { property: "og:title", content: "Obras e Projetos · IJ Santos" },
      { property: "og:url", content: "https://ijsantos.pt/obras" },
    ],
  }),
  component: ObrasPage,
});

type Filter = "todos" | PortfolioCategory;

const PAGE_SIZE = 12;

function ObrasPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>("todos");
  const [page, setPage] = useState(1);

  const { data: obras = [], isLoading: obrasLoading } = useQuery({
    queryKey: ["obras"],
    queryFn: listObras,
    staleTime: 60_000,
  });

  const { data: albums = [] } = useQuery({
    queryKey: ["portfolio_albums"],
    queryFn: listPortfolioAlbums,
    staleTime: 60_000,
  });

  // Map obra_id → album for fast lookup
  const albumByObraId = useMemo(() => {
    const map = new Map<string, PortfolioAlbum>();
    for (const album of albums) {
      map.set(album.obra.id, album);
    }
    return map;
  }, [albums]);

  // nameToSlug for filter matching
  const nameToSlug = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(slugToCategoryName).map(([slug, name]) => [
          name,
          slug as PortfolioCategory,
        ]),
      ) as Record<PortfolioCategoryName, PortfolioCategory>,
    [],
  );

  const filteredObras = useMemo(() => {
    if (filter === "todos") return obras;
    const filterName = slugToCategoryName[filter];
    return obras.filter((o) => o.categoria === filterName);
  }, [obras, filter]);

  const obrasPerCategory = useMemo(() => {
    const counts: Partial<Record<PortfolioCategory, number>> = {};
    for (const o of obras) {
      const slug = nameToSlug[o.categoria as PortfolioCategoryName];
      if (slug) counts[slug] = (counts[slug] ?? 0) + 1;
    }
    return counts;
  }, [obras, nameToSlug]);

  const totalPages = Math.max(1, Math.ceil(filteredObras.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageObras = filteredObras.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "todos", label: t("portfolio.filter_all"), count: obras.length },
    ...categoryOrder.map((c) => ({
      key: c as Filter,
      label: t(`portfolio.cat.${c}`),
      count: obrasPerCategory[c] ?? 0,
    })),
  ];

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl container-px py-20 md:py-28 text-center md:text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            {t("header.obras")}
          </span>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold tracking-tight text-balance max-w-3xl mx-auto md:mx-0">
            {t("obras.title")}
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/75 max-w-2xl mx-auto md:mx-0">
            {t("obras.body")}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl container-px">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-10">
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
                  <span
                    className={`ml-2 text-xs ${active ? "opacity-80" : "text-muted-foreground"}`}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Obras list */}
          {obrasLoading ? (
            <div className="flex justify-center py-20">
              <span className="h-6 w-6 rounded-full border-2 border-brand border-t-transparent animate-spin" />
            </div>
          ) : filteredObras.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">
              {t("portfolio.empty")}
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {pageObras.map((obra) => (
                  <ObraRow
                    key={obra.id}
                    obra={obra}
                    album={albumByObraId.get(obra.id) ?? null}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <nav
                  className="mt-10 flex items-center justify-center gap-2"
                  aria-label={t("obras.pagination_aria")}
                >
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-10 px-4 rounded-md border border-border bg-card text-sm font-medium hover:border-brand/40 disabled:opacity-40 disabled:pointer-events-none inline-flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" /> {t("obras.prev")}
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
                  >
                    {t("obras.next")} <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      <CTABand />
    </>
  );
}

function ObraRow({
  obra,
  album,
}: {
  obra: ObraDbItem;
  album: PortfolioAlbum | null;
}) {
  const { t } = useTranslation();
  const hasPhotos = album !== null;

  const content = (
    <div
      className={`flex items-center gap-4 rounded-xl border bg-card p-4 transition-all ${
        hasPhotos
          ? "border-border hover:border-brand/40 hover:shadow-sm cursor-pointer group"
          : "border-border/50 opacity-60"
      }`}
    >
      {/* Thumbnail */}
      <div className="shrink-0 h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden bg-muted">
        {hasPhotos ? (
          <img
            src={album.cover_thumb_url}
            alt={obra.nome}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-muted-foreground/40">
            <Images className="h-6 w-6" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h2
            className={`font-semibold text-base leading-snug truncate ${
              hasPhotos ? "text-foreground group-hover:text-brand transition-colors" : "text-foreground/60"
            }`}
          >
            {obra.nome}
          </h2>
          <span className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20">
            {obra.categoria}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {obra.local}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            {obra.ano}
          </span>
          {obra.cliente && (
            <span className="hidden sm:inline text-muted-foreground/70">{obra.cliente}</span>
          )}
        </div>
      </div>

      {/* Photo count / status */}
      <div className="shrink-0 text-right">
        {hasPhotos ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand">
            <Images className="h-4 w-4" />
            {album.photos.length} foto{album.photos.length !== 1 ? "s" : ""}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground/60">{t("obras.no_photos")}</span>
        )}
      </div>
    </div>
  );

  if (!hasPhotos) return content;

  return (
    <Link
      to="/portefolio"
      search={{ album: obra.id }}
      aria-label={t("obras.view_photos_aria", { name: obra.nome })}
    >
      {content}
    </Link>
  );
}
