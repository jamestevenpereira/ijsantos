import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie, X } from "lucide-react";

type Prefs = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  performance: boolean;
  advertising: boolean;
};

const KEY = "ijs.cookie-consent.v1";

const DEFAULT: Prefs = {
  necessary: true,
  functional: false,
  analytics: false,
  performance: false,
  advertising: false,
};

const ALL_ON: Prefs = {
  necessary: true,
  functional: true,
  analytics: true,
  performance: true,
  advertising: true,
};

function load(): Prefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Prefs) : null;
  } catch {
    return null;
  }
}

function save(p: Prefs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* noop */
  }
}

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT);

  useEffect(() => {
    setMounted(true);
    const existing = load();
    if (existing) {
      setPrefs(existing);
    } else {
      setShowBanner(true);
    }
    const open = () => {
      const cur = load() ?? DEFAULT;
      setPrefs(cur);
      setShowModal(true);
    };
    window.addEventListener("open-cookie-preferences", open);
    return () => window.removeEventListener("open-cookie-preferences", open);
  }, []);

  if (!mounted) return null;

  const acceptAll = () => {
    save(ALL_ON);
    setPrefs(ALL_ON);
    setShowBanner(false);
    setShowModal(false);
  };
  const rejectAll = () => {
    save(DEFAULT);
    setPrefs(DEFAULT);
    setShowBanner(false);
    setShowModal(false);
  };
  const savePrefs = () => {
    save(prefs);
    setShowBanner(false);
    setShowModal(false);
  };

  return (
    <>
      {showBanner && !showModal && (
        <div className="fixed inset-x-3 bottom-3 md:inset-x-auto md:bottom-5 md:left-5 md:right-auto z-[60] max-w-md rounded-2xl border border-border bg-card text-card-foreground shadow-2xl p-5 md:p-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-brand/10 text-brand grid place-items-center">
              <Cookie className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display font-bold text-base">Utilizamos cookies</div>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Usamos cookies para melhorar a sua experiência. Pode aceitar todos, rejeitar
                ou personalizar as suas preferências. Saiba mais na{" "}
                <Link to="/privacidade" className="text-brand hover:underline">
                  Política de Privacidade
                </Link>
                .
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={acceptAll}
              className="flex-1 min-w-[110px] inline-flex items-center justify-center rounded-md bg-brand text-brand-foreground px-4 py-2.5 text-sm font-semibold"
            >
              Aceitar tudo
            </button>
            <button
              onClick={rejectAll}
              className="flex-1 min-w-[110px] inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium"
            >
              Rejeitar tudo
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="w-full inline-flex items-center justify-center rounded-md px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Personalizar preferências
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-black/60 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-prefs-title"
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card text-card-foreground shadow-2xl">
            <div className="sticky top-0 bg-card border-b border-border flex items-start justify-between gap-4 p-6">
              <div>
                <h2 id="cookie-prefs-title" className="font-display text-xl md:text-2xl font-bold">
                  Personalize as preferências de consentimento
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Encontre informações detalhadas sobre cada categoria de consentimento.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Fechar"
                className="h-9 w-9 rounded-md border border-border grid place-items-center hover:bg-muted shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-3 text-sm text-muted-foreground">
              <p>
                Os cookies categorizados como «Necessários» são armazenados no seu navegador,
                pois são essenciais para ativar as funcionalidades básicas do site.
              </p>
              <p>
                Também utilizamos cookies de terceiros que ajudam a analisar como utiliza este
                site, armazenam as suas preferências e fornecem conteúdo relevante. Estes
                cookies só serão armazenados com o seu consentimento prévio.
              </p>
            </div>

            <div className="px-6 pb-6 space-y-3">
              <Category
                title="Necessários"
                description="Necessários para ativar as funcionalidades básicas deste site, como fornecer login seguro ou ajustar as preferências de consentimento. Não armazenam dados de identificação pessoal."
                checked
                disabled
                badge="Sempre ativo"
              />
              <Category
                title="Funcionais"
                description="Ajudam a executar funcionalidades como partilhar conteúdo em redes sociais, recolher feedback e outros recursos de terceiros."
                checked={prefs.functional}
                onChange={(v) => setPrefs((p) => ({ ...p, functional: v }))}
              />
              <Category
                title="Analíticos"
                description="Utilizados para compreender como os visitantes interagem com o site (número de visitantes, taxa de rejeição, origem do tráfego, etc.)."
                checked={prefs.analytics}
                onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
              />
              <Category
                title="Desempenho"
                description="Usados para compreender e analisar os principais índices de desempenho do site, oferecendo uma melhor experiência de utilizador."
                checked={prefs.performance}
                onChange={(v) => setPrefs((p) => ({ ...p, performance: v }))}
              />
              <Category
                title="Publicidade"
                description="Utilizados para fornecer aos visitantes anúncios personalizados com base nas páginas visitadas anteriormente e analisar a eficácia das campanhas."
                checked={prefs.advertising}
                onChange={(v) => setPrefs((p) => ({ ...p, advertising: v }))}
              />
            </div>

            <div className="sticky bottom-0 bg-card border-t border-border p-5 flex flex-wrap gap-2 justify-end">
              <button
                onClick={rejectAll}
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium"
              >
                Rejeitar tudo
              </button>
              <button
                onClick={savePrefs}
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium"
              >
                Guardar preferências
              </button>
              <button
                onClick={acceptAll}
                className="inline-flex items-center justify-center rounded-md bg-brand text-brand-foreground px-4 py-2.5 text-sm font-semibold"
              >
                Aceitar tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Category({
  title, description, checked, onChange, disabled, badge,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
  badge?: string;
}) {
  return (
    <div className="rounded-xl border border-border p-4 bg-background">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-display font-semibold text-foreground">{title}</div>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
        {badge ? (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand bg-brand/10 px-2 py-1 rounded-md shrink-0">
            {badge}
          </span>
        ) : (
          <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange?.(!checked)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
              checked ? "bg-brand" : "bg-muted-foreground/30"
            } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                checked ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );
}
