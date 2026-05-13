import "@/i18n";
import i18n from "@/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { MobileCTA } from "@/components/layout/MobileCTA";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { Toaster } from "@/components/ui/sonner";
import { company } from "@/data/company";

import appCss from "../styles.css?url";

const SITE_URL = company.siteUrl;
const DEFAULT_TITLE = "IJ Santos · Construção Civil e Limpezas Exteriores em Nelas e Viseu";
const DEFAULT_DESC =
  "Construção civil, remodelações, pinturas e limpezas exteriores (fachadas, telhados, pavimentos) em Nelas, Viseu, Mangualde e região centro. Orçamento gratuito em 24 horas.";
const OG_IMAGE = `${SITE_URL}/og-default.jpg`;

const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "@id": `${SITE_URL}/#organization`,
  name: company.name,
  legalName: company.legalName,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/logo.png`,
  telephone: company.phone,
  email: company.email,
  vatID: `PT${company.nipc.replace(/\s/g, "")}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua da Shell, nº 13",
    postalCode: "3520-074",
    addressLocality: "Nelas",
    addressRegion: "Viseu",
    addressCountry: "PT",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: company.geo.lat,
    longitude: company.geo.lng,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "19:00",
    },
  ],
  areaServed: company.areas.map((name) => ({ "@type": "City", name })),
  contactPoint: company.phones.map((p) => ({
    "@type": "ContactPoint",
    telephone: p.value,
    contactType: "customer service",
    areaServed: "PT",
    availableLanguage: ["Portuguese"],
  })),
  sameAs: [],
};

const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: company.name,
  inLanguage: "pt-PT",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

function NotFoundComponent() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t("notfound.title")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("notfound.body")}</p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-brand text-brand-foreground px-5 py-2.5 text-sm font-semibold"
          >
            {t("notfound.back")}
          </a>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{t("error.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("error.body")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-md bg-brand text-brand-foreground px-4 py-2 text-sm font-semibold"
          >
            {t("error.retry")}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium"
          >
            {t("error.home")}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: DEFAULT_TITLE },
      { name: "description", content: DEFAULT_DESC },
      { name: "author", content: company.name },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { name: "geo.region", content: "PT-VIS" },
      { name: "geo.placename", content: "Nelas, Viseu" },
      { name: "geo.position", content: `${company.geo.lat};${company.geo.lng}` },
      { name: "ICBM", content: `${company.geo.lat}, ${company.geo.lng}` },
      { property: "og:site_name", content: company.name },
      { property: "og:locale", content: "pt_PT" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: DEFAULT_TITLE },
      { property: "og:description", content: DEFAULT_DESC },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: DEFAULT_TITLE },
      { name: "twitter:description", content: DEFAULT_DESC },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "theme-color", content: "#0a0a0a" },
      { title: "Lovable App" },
      { property: "og:title", content: "Lovable App" },
      { name: "twitter:title", content: "Lovable App" },
      { name: "description", content: "- A modern website prototype for IJ Santos, showcasing construction, remodeling, painting, and exterior cleaning services." },
      { property: "og:description", content: "- A modern website prototype for IJ Santos, showcasing construction, remodeling, painting, and exterior cleaning services." },
      { name: "twitter:description", content: "- A modern website prototype for IJ Santos, showcasing construction, remodeling, painting, and exterior cleaning services." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5c282a3d-a861-4306-9c46-9bbcd77f251c/id-preview-bae9affe--e7cc4bdd-cf0f-48f6-9beb-4e41d7dd375a.lovable.app-1778668867916.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5c282a3d-a861-4306-9c46-9bbcd77f251c/id-preview-bae9affe--e7cc4bdd-cf0f-48f6-9beb-4e41d7dd375a.lovable.app-1778668867916.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(ORGANIZATION_LD),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(WEBSITE_LD),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function CanonicalLink() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const cleanPath = pathname === "/" ? "" : pathname.replace(/\/$/, "");
  const href = `${SITE_URL}${cleanPath}`;
  return (
    <>
      <link rel="canonical" href={href} />
      <link rel="alternate" hrefLang="pt-PT" href={href} />
      <link rel="alternate" hrefLang="x-default" href={href} />
    </>
  );
}

function RootShell({ children }: { children: React.ReactNode }) {
  const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}var d=document.documentElement;if(t==='dark'){d.classList.add('dark');}d.style.colorScheme=t;}catch(e){}})();`;
  return (
    <html lang="pt-PT">
      <head>
        <HeadContent />
        <CanonicalLink />
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function PageTransition() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div key={pathname} className="page-transition">
      <Outlet />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ijs.lang");
      if (saved === "en" || saved === "pt") {
        i18n.changeLanguage(saved);
      }
    } catch { /* noop */ }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 pb-[72px] md:pb-0">
          <PageTransition />
        </main>
        <Footer />
      </div>
      <WhatsAppFAB />
      <MobileCTA />
      <CookieConsent />
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
