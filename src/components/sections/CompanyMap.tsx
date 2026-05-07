import { company } from "@/data/company";

type CompanyMapProps = {
  className?: string;
};

export function CompanyMap({ className = "" }: CompanyMapProps) {
  return (
    <div className={`overflow-hidden border border-border bg-card ${className}`}>
      <iframe
        src={company.mapEmbedUrl}
        title={`Mapa - ${company.name}`}
        className="h-full w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
