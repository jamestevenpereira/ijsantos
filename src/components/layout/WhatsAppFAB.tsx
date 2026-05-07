import { company } from "@/data/company";
import { MessageCircle } from "lucide-react";

export function WhatsAppFAB() {
  return (
    <a
      href={company.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar via WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[oklch(0.65_0.17_150)] text-white pl-4 pr-5 py-3 shadow-lg hover:scale-105 transition-transform"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="text-sm font-semibold hidden sm:inline">WhatsApp</span>
    </a>
  );
}
