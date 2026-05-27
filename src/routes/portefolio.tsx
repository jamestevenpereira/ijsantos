import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Images } from "lucide-react";
import { useTranslation } from "react-i18next";
import { categoryOrder, type PortfolioCategory } from "@/data/portfolio";
import { slugToCategoryName, type PortfolioCategoryName } from "@/data/portfolio-categories";
import { listPortfolioAlbums, type PortfolioAlbum } from "@/lib/portfolio-db";
import { CTABand } from "@/components/sections/CTABand";

const searchSchema = z.object({
  album: z.string().optional(),
});

export const Route = createFileRoute("/portefolio")({
  validateSearch: searchSchema,
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
        content:
          "Galeria de obras executadas pela IJ Santos em construção civil e obras públicas.",
      },
      { property: "og:url", content: "https://ijsantos.pt/portefolio" },
    ],
  }),
  component: PortfolioPage,
});

type Filter = "todos" | PortfolioCategory;

function PortfolioPage() {
  const { t } = useTranslation();
  const { album: albumParam } = Route.useSearch();
  const [filter, setFilter] = useState<Filter>("todos");
  const [openAlbum, setOpenAlbum] = useState<PortfolioAlbum | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const albumParamHandled = useRef(false);

  const { data: albums = [] } = useQuery({
    queryKey: ["portfolio_albums"],
    queryFn: listPortfolioAlbums,
    staleTime: 60_000,
  });

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

  const filteredAlbums = useMemo(() => {
    if (filter === "todos") return albums;
    const filterName = slugToCategoryName[filter];
    return albums.filter((a) => a.obra.categoria === filterName);
  }, [albums, filter, nameToSlug]);

  const albumsPerCategory = useMemo(() => {
    const counts: Partial<Record<PortfolioCategory, number>> = {};
    for (const album of albums) {
      const slug = nameToSlug[album.obra.categoria as PortfolioCategoryName];
      if (slug) counts[slug] = (counts[slug] ?? 0) + 1;
    }
    return counts;
  }, [albums, nameToSlug]);

  // Auto-open album from URL param (only on first load).
  useEffect(() => {
    if (!albumParam || albums.length === 0 || albumParamHandled.current) return;
    const target = albums.find((a) => a.obra.id === albumParam);
    if (target) {
      albumParamHandled.current = true;
      setOpenAlbum(target);
      const slug = nameToSlug[target.obra.categoria as PortfolioCategoryName];
      if (slug) setFilter(slug);
    }
  }, [albumParam, albums]);

  // Close lightbox when album changes.
  useEffect(() => {
    setLightboxIndex(null);
  }, [openAlbum]);

  // Keyboard navigation for lightbox.
  useEffect(() => {
    if (!openAlbum || lightboxIndex === null) return;
    const photos = openAlbum.photos;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i === null ? 0 : (i + 1) % photos.length));
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) =>
          i === null ? 0 : (i - 1 + photos.length) % photos.length,
        );
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, openAlbum]);

  // Lock scroll when album overlay is open.
  useEffect(() => {
    if (openAlbum && lightboxIndex === null) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [openAlbum, lightboxIndex]);

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "todos", label: t("portfolio.filter_all"), count: albums.length },
    ...categoryOrder.map((c) => ({
      key: c as Filter,
      label: t(`portfolio.cat.${c}`),
      count: albumsPerCategory[c] ?? 0,
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
          {/* Category filter tabs */}
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
                  <span
                    className={`ml-2 text-xs ${active ? "opacity-80" : "text-muted-foreground"}`}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Albums grid */}
          {filteredAlbums.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">
              {t("portfolio.empty")}
            </p>
          ) : (
            <div className="mt-10 grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAlbums.map((album) => (
                <AlbumCard
                  key={album.obra.id}
                  album={album}
                  onClick={() => setOpenAlbum(album)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABand />

      {/* Album photo grid overlay */}
      {openAlbum && lightboxIndex === null && (
        <div className="fixed inset-0 z-[60] bg-black/95 overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-4 bg-black/80 backdrop-blur-sm border-b border-white/10">
            <div>
              <h2 className="font-semibold text-white text-lg leading-tight">
                {openAlbum.obra.nome}
              </h2>
              <p className="text-sm text-white/60 flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {openAlbum.obra.local}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {openAlbum.obra.ano}
                </span>
              </p>
            </div>
            <button
              onClick={() => setOpenAlbum(null)}
              className="h-10 w-10 rounded-full bg-white/10 text-white grid place-items-center hover:bg-white/20 shrink-0"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {openAlbum.photos.map((photo, i) => (
                <button
                  key={photo.id}
                  onClick={() => setLightboxIndex(i)}
                  className="group relative overflow-hidden rounded-lg border border-white/10 aspect-square"
                  aria-label={`Ver foto ${i + 1}`}
                >
                  <img
                    src={photo.thumb_url ?? photo.public_url}
                    alt={photo.title ?? openAlbum.obra.nome}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Photo lightbox */}
      {openAlbum && lightboxIndex !== null && openAlbum.photos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-sm grid place-items-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-4 right-4 h-11 w-11 rounded-full bg-white/10 text-white grid place-items-center hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(null);
            }}
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 text-white grid place-items-center hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) =>
                i === null ? 0 : (i - 1 + openAlbum.photos.length) % openAlbum.photos.length,
              );
            }}
            aria-label="Foto anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 text-white grid place-items-center hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) =>
                i === null ? 0 : (i + 1) % openAlbum.photos.length,
              );
            }}
            aria-label="Próxima foto"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <figure
            className="max-h-[88vh] max-w-[96vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={openAlbum.photos[lightboxIndex].public_url}
              alt={openAlbum.photos[lightboxIndex].title ?? openAlbum.obra.nome}
              className="max-h-[80vh] max-w-[96vw] object-contain rounded-lg shadow-2xl"
            />
            <figcaption className="mt-3 text-center text-white/80 text-sm">
              {openAlbum.obra.nome} — {lightboxIndex + 1} / {openAlbum.photos.length}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}

function AlbumCard({
  album,
  onClick,
}: {
  album: PortfolioAlbum;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl border border-border bg-muted aspect-[4/3] text-left w-full"
      aria-label={`Ver álbum: ${album.obra.nome}`}
    >
      <img
        src={album.cover_thumb_url}
        alt={album.obra.nome}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Photo count badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white">
        <Images className="h-3 w-3" />
        {album.photos.length}
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-semibold text-white text-base leading-snug group-hover:text-brand transition-colors">
          {album.obra.nome}
        </h3>
        <p className="mt-1 text-sm text-white/70 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {album.obra.local}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            {album.obra.ano}
          </span>
        </p>
      </div>
    </button>
  );
}
