import { useRef, useState, useCallback, useEffect } from "react";
import { MoveHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import aboutTeam from "@/assets/about-team.jpg";
import heroImage from "@/assets/hero-construction.jpg";
import { useInView, fadeUp, fadeIn } from "@/hooks/useInView";

export function BeforeAfter() {
  const { t } = useTranslation();
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const { ref: headingRef, inView: headingInView } = useInView();
  const { ref: sliderRef, inView: sliderInView } = useInView();
  const beforeImageWidth = pos > 0 ? `${(100 / pos) * 100}%` : "100%";

  const updateFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      updateFromClientX(x);
    };
    const onUp = () => (dragging.current = false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [updateFromClientX]);

  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="mx-auto max-w-7xl container-px">
        <div
          ref={headingRef}
          className={`max-w-2xl mx-auto md:mx-0 text-center md:text-left ${fadeUp(headingInView)}`}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            {t("beforeafter.label")}
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
            {t("beforeafter.title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">{t("beforeafter.body")}</p>
        </div>

        <div
          ref={sliderRef}
          className={`mt-12 ${fadeIn(sliderInView)}`}
          style={{ transitionDelay: "150ms" }}
        >
          <div
            ref={ref}
            role="slider"
            aria-label={t("beforeafter.slider_label")}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            tabIndex={0}
            className="relative select-none overflow-hidden rounded-2xl border border-border aspect-[16/9] bg-muted cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-brand"
            onMouseDown={(e) => {
              dragging.current = true;
              updateFromClientX(e.clientX);
            }}
            onTouchStart={(e) => {
              dragging.current = true;
              updateFromClientX(e.touches[0].clientX);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
              else if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
            }}
          >
            <img
              src={heroImage}
              alt={t("beforeafter.after")}
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pos}%` }}>
              <img
                src={aboutTeam}
                alt={t("beforeafter.before")}
                className="absolute inset-0 h-full w-full object-cover grayscale-[0.3] brightness-90"
                style={{ width: beforeImageWidth, maxWidth: "none" }}
                draggable={false}
              />
            </div>

            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/90 text-xs font-semibold uppercase tracking-wider">
              {t("beforeafter.before")}
            </div>
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-brand text-brand-foreground text-xs font-semibold uppercase tracking-wider">
              {t("beforeafter.after")}
            </div>

            <div
              className="absolute inset-y-0 w-0.5 bg-brand pointer-events-none"
              style={{ left: `${pos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-brand text-brand-foreground grid place-items-center shadow-lg font-bold">
                <MoveHorizontal className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
