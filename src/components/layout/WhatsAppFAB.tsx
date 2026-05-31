import { company } from "@/data/company";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { trackGaEvent } from "@/lib/analytics";

export function WhatsAppFAB() {
  return (
    <a
      href={company.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar via WhatsApp"
      onClick={() =>
        trackGaEvent("lead_intent", { method: "whatsapp", location: "floating_button" })
      }
      className="fixed bottom-5 right-5 z-40 hidden md:inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white pl-4 pr-5 py-3 shadow-lg hover:scale-105 transition-transform"
    >
      <WhatsAppIcon className="h-5 w-5 shrink-0" />
      <span className="text-sm font-semibold hidden sm:inline">WhatsApp</span>
    </a>
  );
}
