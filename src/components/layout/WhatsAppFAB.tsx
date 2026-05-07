import { company } from "@/data/company";

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M19.11 17.2c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.18-1.35-.81-.72-1.35-1.61-1.51-1.88-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.26s.97 2.62 1.1 2.8c.14.18 1.9 2.9 4.6 4.07.64.28 1.15.45 1.54.57.65.2 1.24.17 1.71.1.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.16.16-1.28-.07-.12-.25-.2-.52-.34Z" />
      <path d="M16 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.24.58 4.43 1.69 6.36L3.2 28.8l6.59-1.66c1.86 1.01 3.96 1.54 6.11 1.54 7.06 0 12.8-5.74 12.8-12.8S23.06 3.2 16 3.2Zm0 23.13c-1.95 0-3.86-.53-5.51-1.54l-.39-.24-3.91.98.99-3.81-.26-.39a10.35 10.35 0 0 1-1.64-5.56c0-5.72 4.65-10.37 10.37-10.37S26.02 10.05 26.02 15.77 21.37 26.33 16 26.33Z" />
    </svg>
  );
}

export function WhatsAppFAB() {
  return (
    <a
      href={company.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar via WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[oklch(0.65_0.17_150)] text-white pl-4 pr-5 py-3 shadow-lg hover:scale-105 transition-transform"
    >
      <WhatsAppIcon className="h-5 w-5" />
      <span className="text-sm font-semibold hidden sm:inline">WhatsApp</span>
    </a>
  );
}
