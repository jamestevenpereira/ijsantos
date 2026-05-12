import { ArrowRight, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { blogPosts } from "@/data/blog";
import { useInView, fadeUp } from "@/hooks/useInView";

export function BlogPreview() {
  const { t, i18n } = useTranslation();
  const { ref: headingRef, inView: headingInView } = useInView();
  const { ref: gridRef, inView: gridInView } = useInView();
  const isPt = i18n.language === "pt";

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl container-px">
        <div
          ref={headingRef}
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 text-center md:text-left ${fadeUp(headingInView)}`}
        >
          <div className="max-w-2xl mx-auto md:mx-0">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              {t("blog.label")}
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              {t("blog.title")}
            </h2>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand justify-center md:justify-start">
            {t("blog.all_link")} <ArrowRight className="h-4 w-4" />
          </span>
        </div>

        <div ref={gridRef} className="mt-14 grid gap-6 md:grid-cols-3">
          {blogPosts.map((post, i) => {
            const title = isPt ? post.titlePt : post.titleEn;
            const excerpt = isPt ? post.excerptPt : post.excerptEn;
            const date = new Date(post.date).toLocaleDateString(
              isPt ? "pt-PT" : "en-GB",
              { day: "numeric", month: "long", year: "numeric" }
            );
            return (
              <article
                key={post.slug}
                className={`group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-brand/40 transition-all hover:-translate-y-1 hover:shadow-lg ${fadeUp(gridInView)}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={post.image}
                    alt={title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-brand text-brand-foreground text-xs font-semibold px-3 py-1">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <time dateTime={post.date}>{date}</time>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime} {t("blog.min_read")}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground leading-snug flex-1">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand group-hover:gap-2.5 transition-all">
                    {t("blog.read_more")} <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
