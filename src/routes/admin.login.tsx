import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Search = { redirect?: string };

export const Route = createFileRoute("/admin/login")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  beforeLoad: async ({ search }) => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      throw redirect({ to: search.redirect ?? "/admin/portfolio" });
    }
  },
  head: () => ({
    meta: [
      { title: "Admin · IJ Santos" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const { error: signErr } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (signErr) {
      setError("Credenciais inválidas. Tente novamente.");
      return;
    }
    navigate({ to: search.redirect ?? "/admin/portfolio" });
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-[#1A1A1A] border border-white/5 shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            IJ Santos — Admin
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Inicie sessão para gerir o portefólio.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80">
              Email
            </Label>
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
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/80">
              Palavra-passe
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
