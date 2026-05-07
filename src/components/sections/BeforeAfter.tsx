import { useRef, useState, useCallback, useEffect } from "react";

export function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

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
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl container-px">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Antes & Depois</span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
            Resultados que falam por si.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Arraste para revelar a transformação de uma fachada após limpeza profissional.
          </p>
        </div>

        <div
          ref={ref}
          className="relative mt-12 select-none overflow-hidden rounded-2xl border border-border aspect-[16/9] bg-muted cursor-ew-resize"
          onMouseDown={(e) => {
            dragging.current = true;
            updateFromClientX(e.clientX);
          }}
          onTouchStart={(e) => {
            dragging.current = true;
            updateFromClientX(e.touches[0].clientX);
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1597047084897-51e81819a499?auto=format&fit=crop&w=1800&q=80"
            alt="Depois"
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          <div
            className="absolute inset-y-0 left-0 overflow-hidden"
            style={{ width: `${pos}%` }}
          >
            <img
              src="https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?auto=format&fit=crop&w=1800&q=80"
              alt="Antes"
              className="absolute inset-0 h-full w-full object-cover grayscale-[0.3] brightness-90"
              style={{ width: `${(100 / pos) * 100}%`, maxWidth: "none" }}
              draggable={false}
            />
          </div>

          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/90 text-xs font-semibold uppercase tracking-wider">
            Antes
          </div>
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-brand text-brand-foreground text-xs font-semibold uppercase tracking-wider">
            Depois
          </div>

          <div
            className="absolute inset-y-0 w-0.5 bg-brand pointer-events-none"
            style={{ left: `${pos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-brand text-brand-foreground grid place-items-center shadow-lg font-bold">
              ⇆
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
