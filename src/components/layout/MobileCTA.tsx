import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { company } from "@/data/company";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { trackGaEvent } from "@/lib/analytics";

export function MobileCTA() {
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (pathname === "/contacto") return null;

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-md border-t border-border px-4 py-3 flex gap-3 safe-area-inset-bottom">
      <a
        href={company.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackGaEvent("lead_intent", { method: "whatsapp", location: "mobile_sticky" })
        }
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-3 text-sm font-semibold text-white hover:brightness-95 transition"
      >
        <WhatsAppIcon className="h-4 w-4" />
        WhatsApp
      </a>
      <Link
        to="/contacto"
        onClick={() => trackGaEvent("cta_click", { location: "mobile_sticky", target: "contact" })}
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-brand text-brand-foreground px-4 py-3 text-sm font-semibold hover:brightness-95 transition"
      >
        {t("mobilecta.quote")} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
