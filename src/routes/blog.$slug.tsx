import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { getBlogPost, type BlogPost, type BlogSection } from "@/data/blog";
import { company } from "@/data/company";
import { BlogCTA } from "@/components/blog/BlogCTA";
import { BlogCTABand } from "@/components/sections/BlogCTABand";
import { ArrowLeft, Clock } from "lucide-react";

const SITE_URL = company.siteUrl;

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getBlogPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const { post } = loaderData;
    const title = `${post.titlePt} · IJ Santos`;
    const url = `${SITE_URL}/blog/${post.slug}`;
    const articleLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.titlePt,
      description: post.excerptPt,
      datePublished: post.date,
      dateModified: post.date,
      author: { "@type": "Organization", name: company.name },
      publisher: { "@id": `${SITE_URL}/#organization` },
      url,
      image: post.image,
    };
    return {
      meta: [
        { title },
        { name: "description", content: post.excerptPt },
        { property: "og:title", content: title },
        { property: "og:description", content: post.excerptPt },
        { property: "og:type", content: "article" },
        { property: "og:image", content: post.image },
        { property: "og:url", content: url },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: post.excerptPt },
        { name: "twitter:image", content: post.image },
      ],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(articleLd) },
      ],
    };
  },
  notFoundComponent: () => {
    const { t } = useTranslation();
    return (
      <div className="mx-auto max-w-3xl container-px py-32 text-center">
        <h1 className="font-display text-3xl font-bold">{t("blog.not_found_title")}</h1>
        <Link to="/" className="mt-8 inline-flex items-center gap-2 text-brand font-semibold">
          <ArrowLeft className="h-4 w-4" /> {t("blog.not_found_back")}
        </Link>
      </div>
    );
  },
  component: BlogPost,
});

function renderSection(section: BlogSection, index: number) {
  switch (section.type) {
    case "heading":
      return (
        <h2
          key={index}
          className="mt-10 mb-4 font-display text-2xl font-bold tracking-tight text-foreground"
        >
          {section.text}
        </h2>
      );
    case "list":
      return (
        <ul key={index} className="mt-4 mb-6 space-y-2 pl-5 list-disc marker:text-brand">
          {section.items.map((item, i) => (
            <li key={i} className="text-muted-foreground leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
    case "paragraph":
    default:
      return (
        <p key={index} className="mt-4 mb-2 text-muted-foreground leading-relaxed text-lg">
          {section.text}
        </p>
      );
  }
}

function BlogPost() {
  const { t } = useTranslation();
  const { post } = Route.useLoaderData() as { post: BlogPost };

  const date = new Date(post.date).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const beforeCta = post.bodyPt.slice(0, 2);
  const afterCta = post.bodyPt.slice(2);

  return (
    <>
      {/* Hero image */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img
          src={post.image}
          alt={post.titlePt}
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-3xl container-px pb-8">
          <span className="inline-block rounded-full bg-brand text-brand-foreground text-xs font-semibold px-3 py-1">
            {post.category}
          </span>
        </div>
      </div>

      {/* Article */}
      <article className="mx-auto max-w-3xl container-px py-12">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand transition mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> {t("blog.back")}
        </Link>

        {/* Header */}
        <header>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <time dateTime={post.date}>{date}</time>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {post.readTime} {t("blog.min_read")}
            </span>
          </div>
          <h1 className="mt-4 font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance">
            {post.titlePt}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {post.excerptPt}
          </p>
        </header>

        <hr className="my-8 border-border" />

        {/* Body — first 2 sections */}
        <div>{beforeCta.map((s: BlogSection, i: number) => renderSection(s, i))}</div>

        {/* Mid-article CTA */}
        <BlogCTA serviceSlug={post.relatedService} />

        {/* Body — remaining sections */}
        <div>{afterCta.map((s: BlogSection, i: number) => renderSection(s, i + 2))}</div>

        {/* End-of-article CTA band */}
        <BlogCTABand serviceSlug={post.relatedService} />
      </article>
    </>
  );
}
