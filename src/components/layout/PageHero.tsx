interface PageHeroProps {
  image: string;
  label: string;
  title: string;
  subtitle?: string;
  height?: "default" | "tall";
}

export function PageHero({
  image,
  label,
  title,
  subtitle,
  height = "default",
}: PageHeroProps) {
  return (
    <section
      className="relative isolate overflow-hidden flex flex-col justify-end"
      style={{ minHeight: height === "tall" ? "420px" : "320px" }}
    >
      {/* Full-bleed photo */}
      <div className="absolute inset-0 -z-10">
        <img
          src={image}
          alt=""
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 [background:repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,0,0,0.012)_3px,rgba(0,0,0,0.012)_4px)]" />
      </div>

      {/* Solid block */}
      <div className="w-full md:w-3/5 bg-primary border-t-[3px] border-brand px-5 py-8 md:px-10 md:py-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-px bg-brand shrink-0" />
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand">
            {label}
          </span>
        </div>
        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-black text-primary-foreground leading-tight tracking-tight text-balance"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-sm text-primary-foreground/50 leading-relaxed max-w-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
