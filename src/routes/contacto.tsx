import { createFileRoute } from "@tanstack/react-router";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { company } from "@/data/company";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto · IJ Santos" },
      { name: "description", content: "Peça o seu orçamento gratuito. Telefone, email, WhatsApp — resposta em menos de 24 horas." },
      { property: "og:title", content: "Contacto · IJ Santos" },
      { property: "og:description", content: "Fale connosco. Resposta em menos de 24 horas." },
    ],
  }),
  component: ContactoPage,
});

function ContactoPage() {
  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl container-px py-20 md:py-28">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Contacto</span>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold tracking-tight max-w-3xl text-balance">
            Vamos falar do seu projeto.
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/75 max-w-2xl">
            Preencha o formulário ou contacte-nos diretamente. Respondemos a todos os pedidos
            em menos de 24 horas, com orçamento gratuito e sem compromisso.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl container-px grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-7 md:p-10 shadow-sm">
            <h2 className="font-display text-2xl md:text-3xl font-bold">Pedido de orçamento</h2>
            <p className="mt-2 text-muted-foreground">Conte-nos o que precisa.</p>
            <div className="mt-8">
              <QuoteForm />
            </div>
          </div>

          <aside className="lg:col-span-2 flex flex-col gap-4">
            <InfoCard icon={Phone} title="Telefone" value={company.phone} href={company.phoneHref} />
            <InfoCard icon={MessageCircle} title="WhatsApp" value="Mensagem direta" href={company.whatsapp} external />
            <InfoCard icon={Mail} title="Email" value={company.email} href={company.emailHref} />
            <InfoCard icon={MapPin} title="Morada" value={company.address} />
            <InfoCard icon={Clock} title="Horário" value={company.hours} />
          </aside>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl container-px">
          <div className="relative overflow-hidden rounded-2xl border border-border aspect-[16/7] bg-surface">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,oklch(0.92_0.02_70/0.5),transparent_60%),radial-gradient(circle_at_70%_60%,oklch(0.88_0.02_250/0.5),transparent_60%)]" />
            <div className="absolute inset-0 grain opacity-40" />
            <div className="absolute inset-0 grid place-items-center text-primary">
              <div className="text-center">
                <div className="inline-flex h-12 w-12 rounded-full bg-brand text-brand-foreground items-center justify-center">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="mt-4 font-display text-2xl font-bold">{company.address}</div>
                <div className="mt-1 text-sm text-muted-foreground">Servimos toda a Grande Lisboa</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function InfoCard({
  icon: Icon, title, value, href, external,
}: { icon: typeof Phone; title: string; value: string; href?: string; external?: boolean }) {
  const content = (
    <div className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 hover:border-brand/40 transition">
      <div className="h-11 w-11 rounded-lg bg-brand/10 text-brand grid place-items-center group-hover:bg-brand group-hover:text-brand-foreground transition">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
        <div className="mt-0.5 font-display font-semibold text-foreground">{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{content}</a>
  ) : content;
}
