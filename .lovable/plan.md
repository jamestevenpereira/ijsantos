## Backoffice IJ Santos — Plano

Construir um backoffice protegido para gerir o portefólio, integrado com o site público.

### 1. Backend (Lovable Cloud)

Ativar Lovable Cloud (Supabase). Criar:

- **Tabela `portfolio_items`**: `id uuid pk`, `storage_path text`, `public_url text`, `category text`, `title text null`, `created_at timestamptz default now()`.
- **Bucket `portfolio`** (público, para leitura direta de URLs).
- **RLS**:
  - `select` público (anon + authenticated)
  - `insert` / `delete` apenas authenticated
- **Storage policies**: leitura pública; upload/delete apenas authenticated.
- Conta admin: criada manualmente mais tarde no painel Cloud (decisão do utilizador).

### 2. Rotas novas

```
src/routes/admin.login.tsx          → /admin/login (pública)
src/routes/_admin.tsx               → layout protegido (beforeLoad redirect)
src/routes/_admin/admin.tsx         → /admin (dashboard, redirect → /admin/portfolio)
src/routes/_admin/admin.portfolio.tsx → /admin/portfolio
```

Layout `_admin` com sidebar escura (#1A1A1A), link "Portefólio", botão Logout. `beforeLoad` chama `supabase.auth.getSession()`; se não houver sessão → `redirect /admin/login`. `/admin/login` redireciona para `/admin/portfolio` se já autenticado.

### 3. Componentes

- `src/components/admin/AdminSidebar.tsx` — nav + logout
- `src/components/admin/PhotoUploader.tsx` — dropzone (input file), seletor de categoria, título opcional, barra de progresso, upload para Storage + insert na tabela
- `src/components/admin/PhotoGrid.tsx` — grid 3-4 col, filtros pill por categoria, card com imagem, badge, título, botão delete
- `src/components/admin/DeleteConfirmDialog.tsx` — shadcn AlertDialog "Tem a certeza que quer remover esta foto?"
- `src/components/admin/LoginForm.tsx` — card centrado, fundo #111, botão vermelho #DC2626, mensagens em pt-PT

Toda a comunicação com Supabase via `@/integrations/supabase/client` (browser). Estado com TanStack Query (`portfolio_items` queryKey) + invalidação após mutations. Toasts via `sonner`.

### 4. Categorias (constante)

```ts
export const PORTFOLIO_CATEGORIES = [
  "Pavilhões Industriais",
  "Lojas Comerciais",
  "Infraestruturas",
  "Obras Públicas",
  "Construção Habitacional",
] as const;
```

Em `src/data/portfolio-categories.ts`, partilhado entre admin e público.

### 5. Integração com /portefolio público

Atualizar `src/routes/portefolio.tsx` para:
- Ler de `portfolio_items` via Supabase client (TanStack Query, `staleTime: 60s`).
- Se a query devolver array vazio → fallback para as imagens estáticas atuais em `src/data/portfolio.ts` (mantém o site funcional enquanto o cliente não carrega nada).
- Filtros por categoria reutilizam `PORTFOLIO_CATEGORIES`.
- Mantém SSR/prerender — o fetch corre no cliente; durante prerender mostra o fallback estático.

### 6. UX / detalhes

- pt-PT em todos os labels ("Entrar", "Carregar foto", "Categoria", "Título (opcional)", "Remover", "Sair").
- Mensagem erro login: "Credenciais inválidas. Tente novamente."
- Loading states em botões (Loader2 spinner) e skeletons no grid.
- Responsive (sidebar colapsa em tablet via shadcn Sheet ou breakpoint).
- Sem registo, sem reset de password, sem gestão de utilizadores.

### 7. Ficheiros novos / alterados

**Novos**
- `src/routes/admin.login.tsx`
- `src/routes/_admin.tsx`
- `src/routes/_admin/admin.tsx`
- `src/routes/_admin/admin.portfolio.tsx`
- `src/components/admin/AdminSidebar.tsx`
- `src/components/admin/LoginForm.tsx`
- `src/components/admin/PhotoUploader.tsx`
- `src/components/admin/PhotoGrid.tsx`
- `src/components/admin/DeleteConfirmDialog.tsx`
- `src/data/portfolio-categories.ts`
- `src/lib/portfolio-db.ts` (helpers: `listItems`, `uploadItem`, `deleteItem`)
- migração SQL (tabela + RLS + bucket + policies)

**Alterados**
- `src/routes/portefolio.tsx` — passa a ler da BD com fallback estático
- `src/routes/__root.tsx` — exclui rotas `/admin` de elementos públicos (header/footer/CTA mobile/WhatsApp FAB) condicional ao pathname
- `public/robots.txt` — `Disallow: /admin`
- `public/sitemap.xml` — garantir que /admin não aparece

### 8. Segurança

- RLS estrita (insert/delete só authenticated).
- Validação Zod no formulário (file size ≤ 10 MB, mime image/*, título ≤ 120 chars, categoria do enum).
- `beforeLoad` do layout `_admin` + listener `onAuthStateChange` para logout automático em todas as tabs.
- Nada de roles custom (single-user invite-only conforme briefing).

### 9. Pós-implementação (passos manuais do utilizador)

1. Criar utilizador admin no painel Lovable Cloud → Auth → Users → Add user.
2. Definir email/password.
3. Iniciar sessão em `/admin/login` e começar a carregar fotos.
