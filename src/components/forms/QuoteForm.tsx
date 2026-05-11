import { useState } from "react";
import { toast } from "sonner";
import { services } from "@/data/services";
import { company } from "@/data/company";

export function QuoteForm({ compact = false }: { compact?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [serviceSlug, setServiceSlug] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setLoading(true);
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(out?.error ?? "Erro a enviar pedido.");
      form.reset();
      setServiceSlug("");
      toast.success("Pedido enviado!", {
        description: "Entraremos em contacto em menos de 24 horas.",
      });
    } catch (err) {
      toast.error("Não foi possível enviar", {
        description: err instanceof Error ? err.message : "Tente por telefone ou WhatsApp.",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find((s) => s.slug === serviceSlug);
  const waMessage = encodeURIComponent(
    selectedService
      ? `Olá, gostaria de um orçamento para: ${selectedService.title}.`
      : "Olá, gostaria de pedir um orçamento.",
  );
  const waHref = `${company.whatsapp}?text=${waMessage}`;

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
        <Field label="Nome" name="name" required />
        <Field label="Telefone" name="phone" type="tel" required />
      </div>
      <Field label="Email" name="email" type="email" required />
      <div className="grid gap-2">
        <label className="text-sm font-medium text-foreground">Tipo de serviço</label>
        <select
          name="service"
          required
          value={serviceSlug}
          onChange={(e) => setServiceSlug(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="" disabled>Selecione um serviço</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>{s.title}</option>
          ))}
          <option value="outro">Outro</option>
        </select>
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-foreground">
          Mensagem <span className="text-muted-foreground font-normal">(opcional)</span>
        </label>
        <textarea
          name="message"
          rows={4}
          placeholder="Descreva brevemente o que precisa..."
          className="rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex items-center justify-center rounded-md bg-brand text-brand-foreground px-6 py-3.5 text-sm font-semibold hover:brightness-95 transition disabled:opacity-60"
      >
        {loading ? "A enviar..." : "Pedir Orçamento Gratuito"}
      </button>

      <div className="relative my-1">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-3 text-xs uppercase tracking-wider text-muted-foreground">
            ou
          </span>
        </div>
      </div>

      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold hover:bg-accent transition"
      >
        Falar agora pelo WhatsApp
      </a>

      <p className="text-xs text-muted-foreground text-center">
        Resposta em menos de 24 horas · Sem compromisso
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
