import { useEffect, useRef, useState } from "react";

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<Element>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px", ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView } as { ref: React.RefObject<any>; inView: boolean };
}

export function fadeUp(inView: boolean) {
  return `motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out ${
    inView ? "opacity-100 translate-y-0" : "motion-safe:opacity-0 motion-safe:translate-y-5"
  }`;
}

export function fadeIn(inView: boolean) {
  return `motion-safe:transition-opacity motion-safe:duration-700 motion-safe:ease-out ${
    inView ? "opacity-100" : "motion-safe:opacity-0"
  }`;
}
