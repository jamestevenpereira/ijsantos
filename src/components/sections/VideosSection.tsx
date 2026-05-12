import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { videos } from "@/data/portfolio";
import { Play, X } from "lucide-react";
import { useInView, fadeUp } from "@/hooks/useInView";

export function VideosSection() {
  const { t } = useTranslation();
  const [active, setActive] = useState<number | null>(null);
  const { ref: headingRef, inView: headingInView } = useInView();
  const { ref: gridRef, inView: gridInView } = useInView();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      triggerRefs.current[active]?.focus();
    };
  }, [active]);

  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const focusable = [closeButtonRef.current, videoRef.current].filter(Boolean) as HTMLElement[];
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="mx-auto max-w-7xl container-px">
        <div ref={headingRef} className={`max-w-2xl mx-auto md:mx-0 text-center md:text-left ${fadeUp(headingInView)}`}>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            {t("videos.label")}
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
            {t("videos.title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            {t("videos.body")}
          </p>
        </div>

        <div ref={gridRef} className="mt-12 grid gap-6 md:grid-cols-2">
          {videos.map((v, i) => (
            <button
              key={v.src}
              ref={(el) => { triggerRefs.current[i] = el; }}
              onClick={() => setActive(i)}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card aspect-video text-left ${fadeUp(gridInView)}`}
              style={{ transitionDelay: `${i * 150}ms` }}
              aria-label={`${t("videos.play")} ${v.title}`}
            >
              {v.poster ? (
                <img
                  src={v.poster}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-primary/60" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent" />
              <div className="absolute inset-0 grid place-items-center">
                <span className="grid place-items-center h-16 w-16 rounded-full bg-brand text-brand-foreground shadow-lg transition-transform group-hover:scale-110">
                  <Play className="h-7 w-7 ml-1" fill="currentColor" />
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-primary-foreground">
                <p className="font-semibold text-lg">{v.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm grid place-items-center p-4"
          onClick={() => setActive(null)}
          onKeyDown={handleModalKeyDown}
        >
          <button
            ref={closeButtonRef}
            className="absolute top-4 right-4 h-11 w-11 rounded-full bg-white/10 text-white grid place-items-center hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => setActive(null)}
            aria-label={t("videos.close")}
          >
            <X className="h-5 w-5" />
          </button>
          <video
            ref={videoRef}
            src={videos[active].src}
            poster={videos[active].poster}
            controls
            autoPlay
            playsInline
            className="max-h-[88vh] max-w-[96vw] w-auto rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
