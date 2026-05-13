import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/recuperar")({
  head: () => ({
    meta: [
      { title: "Recuperar acesso · Admin · IJ Santos" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: RecoverPage,
});

function RecoverPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.body.style.background = "#111111";
    return () => {
      document.body.style.background = "";
    };
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setLoading(false);
    if (resetErr) {
      setError("Não foi possível enviar o email. Verifique o endereço e tente novamente.");
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-[#1A1A1A] border border-white/5 shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Recuperar acesso
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Indique o email da conta de administrador. Vai receber uma ligação para
            definir uma nova palavra-passe.
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <p className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-md px-3 py-3">
              Se existir uma conta com esse email, foi enviada uma ligação de
              recuperação. Verifique a caixa de entrada (e a pasta de spam).
            </p>
            <Link
              to="/admin/login"
              className="block text-center text-sm text-white/70 hover:text-white"
            >
              Voltar ao início de sessão
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#0F0F0F] border-white/10 text-white placeholder:text-white/40"
                placeholder="email@empresa.pt"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="text-sm text-[#FCA5A5] bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-md px-3 py-2"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold h-11 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Enviar ligação de recuperação
            </button>

            <Link
              to="/admin/login"
              className="block text-center text-sm text-white/60 hover:text-white"
            >
              Voltar ao início de sessão
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
