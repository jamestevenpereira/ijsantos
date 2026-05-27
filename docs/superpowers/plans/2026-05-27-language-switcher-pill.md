# Language Switcher Segmented Pill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o language switcher actual (EN / PT com separador "/") por um segmented pill com estado activo claramente visível.

**Architecture:** Alteração puramente visual ao componente `LanguageSwitcher` em `src/components/layout/Header.tsx`. Lógica de i18n, localStorage e acessibilidade mantidas; apenas o JSX e as classes Tailwind mudam. A chamada mobile do componente recebe um ajuste de className para não conflituar com o padding interno do pill.

**Tech Stack:** React, Tailwind CSS, react-i18next

---

## Ficheiros

| Ficheiro | Operação |
|----------|----------|
| `src/components/layout/Header.tsx` | Modificar linhas 10–38 (componente `LanguageSwitcher`) e linha 182 (chamada mobile) |

---

### Task 1: Reescrever o componente `LanguageSwitcher`

**Files:**
- Modify: `src/components/layout/Header.tsx:10-38`

- [ ] **Step 1: Substituir o componente `LanguageSwitcher` (linhas 10–38)**

Substituir o bloco actual:

```tsx
function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { i18n: i18nInstance } = useTranslation();
  const current = i18nInstance.language;

  const switchTo = (lang: string) => {
    i18n.changeLanguage(lang);
    try { localStorage.setItem("ijs.lang", lang); } catch { /* noop */ }
  };

  return (
    <div className={`flex items-center gap-1 text-sm font-medium ${className}`}>
      <button
        onClick={() => switchTo("en")}
        className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:rounded-sm ${current === "en" ? "text-foreground" : "text-muted-foreground hover:text-foreground transition-colors"}`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="text-border select-none">/</span>
      <button
        onClick={() => switchTo("pt")}
        className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:rounded-sm ${current === "pt" ? "text-foreground" : "text-muted-foreground hover:text-foreground transition-colors"}`}
        aria-label="Mudar para Português"
      >
        PT
      </button>
    </div>
  );
}
```

Por este novo bloco:

```tsx
function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { i18n: i18nInstance } = useTranslation();
  const current = i18nInstance.language;

  const switchTo = (lang: string) => {
    i18n.changeLanguage(lang);
    try { localStorage.setItem("ijs.lang", lang); } catch { /* noop */ }
  };

  return (
    <div className={`flex items-center rounded-md bg-white/10 p-0.5 gap-0.5 ${className}`}>
      {(["en", "pt"] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => switchTo(lang)}
          aria-pressed={current === lang}
          aria-label={lang === "en" ? "Switch to English" : "Mudar para Português"}
          className={`rounded-sm px-2.5 py-1 text-xs font-semibold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:rounded-sm ${
            current === lang
              ? "bg-white text-[#0F0F0F]"
              : "text-white/50 hover:text-white/80"
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Corrigir className da chamada mobile (linha 182)**

A chamada mobile anterior passava `px-3 py-2` que conflituava com o `p-0.5` interno do pill. O container pai já tem `items-center` então o pill centra automaticamente.

Substituir:
```tsx
<LanguageSwitcher className="mt-2 px-3 py-2 justify-center" />
```

Por:
```tsx
<LanguageSwitcher className="mt-2" />
```

- [ ] **Step 3: Verificar visualmente no browser**

Iniciar o servidor de desenvolvimento:
```bash
npm run dev
```

Verificar:
1. **Desktop** — o pill aparece no header com fundo subtil; o idioma activo tem fundo branco e texto escuro; o inactivo está a cinzento claro.
2. **Mobile** — abrir o menu hambúrguer; o pill aparece centrado abaixo do botão CTA, com o mesmo aspecto.
3. **Troca de idioma** — clicar em EN e PT alternadamente; o estado activo muda imediatamente.
4. **Keyboard** — usar Tab para focar cada botão; deve aparecer o focus ring vermelho (`ring-brand`).

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat(header): replace language switcher with segmented pill"
```
