import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/reset-password")({
  head: () => ({
    meta: [
      { title: "Definir palavra-passe · Admin · IJ Santos" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.body.style.background = "#111111";
    return () => {
      document.body.style.background = "";
    };
  }, []);

  // O Supabase processa o token de recuperação no hash da URL e dispara
  // PASSWORD_RECOVERY ao detectar a sessão temporária.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
    // Caso a navegação chegue depois do evento, verificar a sessão atual.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("A palavra-passe deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As palavras-passe não coincidem.");
      return;
    }
    setLoading(true);
    const { error: updErr } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updErr) {
      setError("Não foi possível atualizar a palavra-passe. A ligação pode ter expirado.");
      return;
    }
    // A sessão fica válida — redireciona para o admin.
    navigate({ to: "/admin/portfolio" });
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-[#1A1A1A] border border-white/5 shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Definir nova palavra-passe
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Escolha uma palavra-passe com pelo menos 8 caracteres.
          </p>
        </div>

        {!ready ? (
          <p className="text-sm text-white/60 text-center">
            A validar a ligação de recuperação…
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">
                Nova palavra-passe
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#0F0F0F] border-white/10 text-white placeholder:text-white/40"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-white/80">
                Confirmar palavra-passe
              </Label>
              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="bg-[#0F0F0F] border-white/10 text-white placeholder:text-white/40"
                placeholder="••••••••"
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
              Guardar palavra-passe
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
