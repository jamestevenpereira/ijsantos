import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { company } from "@/data/company";
import { useInView, fadeUp } from "@/hooks/useInView";

function CountUp({ raw, inView }: { raw: string; inView: boolean }) {
  const { prefix, end, suffix, decimal } = useMemo(() => {
    const m = raw.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
    if (!m) return { prefix: "", end: 0, suffix: raw, decimal: false };
    return { prefix: m[1], end: parseFloat(m[2]), suffix: m[3], decimal: m[2].includes(".") };
  }, [raw]);

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(end);
      return;
    }
    const duration = 1800;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      setCount(end * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setCount(end);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end]);

  const display = decimal ? count.toFixed(1) : Math.floor(count).toString();
  return <>{prefix}{display}{suffix}</>;
}

export function Stats() {
  const { t } = useTranslation();
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="border-y border-border bg-surface" aria-label="Estatísticas da empresa">
      <div className="mx-auto max-w-7xl container-px py-12 md:py-14">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
          {company.stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-center ${fadeUp(inView)}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <dt className="sr-only">{t(s.label)}</dt>
              <dd className="font-display text-4xl md:text-5xl font-bold text-brand tracking-tight">
                <CountUp raw={s.value} inView={inView} />
              </dd>
              <p className="mt-2 text-sm md:text-base text-muted-foreground font-medium">
                {t(s.label)}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
