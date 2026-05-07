import { useState } from "react";
import { toast } from "sonner";
import { services } from "@/data/services";

export function QuoteForm({ compact = false }: { compact?: boolean }) {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Pedido enviado!", {
        description: "Entraremos em contacto em menos de 24 horas.",
      });
    }, 700);
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
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
          defaultValue=""
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
        <label className="text-sm font-medium text-foreground">Mensagem</label>
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
