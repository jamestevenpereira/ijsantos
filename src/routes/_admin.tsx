import { createFileRoute, Outlet, redirect, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, Images, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

export const Route = createFileRoute("/_admin")({
  beforeLoad: async ({ location }) => {
    if (DEMO_MODE) return;
    if (typeof window === "undefined") return; // skip during SSR/prerender
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({
        to: "/admin/login",
        search: { redirect: location.pathname },
      });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate({ to: "/admin/login" });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Não foi possível terminar a sessão.");
      return;
    }
    toast.success("Sessão terminada.");
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-[#1A1A1A] border-r border-white/5">
        <SidebarContent onLogout={handleLogout} pathname={pathname} />
      </aside>

      {/* Top bar mobile */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 h-14 bg-[#1A1A1A] border-b border-white/5 flex items-center justify-between px-4">
        <span className="font-semibold tracking-tight">IJ Santos · Admin</span>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          className="h-9 w-9 grid place-items-center rounded-md hover:bg-white/10"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-30 bg-[#1A1A1A]">
          <SidebarContent onLogout={handleLogout} pathname={pathname} />
        </div>
      )}

      <main className="flex-1 min-w-0 pt-14 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}

function SidebarContent({
  onLogout,
  pathname,
}: {
  onLogout: () => void;
  pathname: string;
}) {
  const isPortfolio = pathname.startsWith("/admin/portfolio");
  return (
    <div className="flex h-full flex-col">
      <div className="hidden md:flex h-16 items-center px-6 border-b border-white/5">
        <span className="font-semibold tracking-tight">IJ Santos · Admin</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/admin/portfolio"
          className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
            isPortfolio
              ? "bg-[#DC2626] text-white"
              : "text-white/80 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Images className="h-4 w-4" />
          Portefólio
        </Link>
      </nav>
      <div className="p-4 border-t border-white/5">
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full justify-start text-white/80 hover:text-white hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}
