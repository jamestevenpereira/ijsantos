## Objetivo

Melhorar o admin do portefólio (`/admin/portfolio`) com três funcionalidades:

1. **Upload em lote** — várias imagens de uma vez, mesma categoria.
2. **Ordenação manual** — definir a ordem de exibição no site público.
3. **Lightbox** — pré-visualização grande ao clicar numa foto.

---

## 1. Base de dados

Adicionar coluna `sort_order` à tabela `portfolio_items` para controlar a ordem.

```sql
ALTER TABLE public.portfolio_items
  ADD COLUMN sort_order integer NOT NULL DEFAULT 0;

CREATE INDEX idx_portfolio_items_sort
  ON public.portfolio_items (category, sort_order, created_at DESC);
```

Nova policy `UPDATE` (apenas autenticados) para permitir reordenar:

```sql
CREATE POLICY "Authenticated can update portfolio items"
  ON public.portfolio_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
```

Backfill: `sort_order` inicial = posição por `created_at DESC` dentro da categoria.

---

## 2. Upload em lote

Alterar `PhotoUploader` (em `_admin/admin.portfolio.tsx`):

- Input `<input type="file" multiple accept="image/*">`.
- Lista visível dos ficheiros selecionados (nome + tamanho + remover).
- Um único campo de **categoria** aplicado a todos.
- Campo de título opcional **partilhado** (pode ficar em branco; aplicado a todos os ficheiros do lote, ou ignorado se vazio).
- Barra de progresso global: `X de N carregadas`, com `<Progress />` (já existe em `components/ui/progress.tsx`).
- Upload **sequencial** (1 a 1) para evitar saturar a ligação e dar feedback fiável; toast por sucesso/erro agregado no fim (`"5 fotos carregadas, 1 falhou"`).
- Validações por ficheiro: ≤10 MB, `image/*`. Ficheiros inválidos são saltados com aviso, não abortam o lote.
- Novos itens recebem `sort_order = max(sort_order da categoria) + 1` (ou 0 se vazio) — calculado no `uploadPortfolioItem`.

`src/lib/portfolio-db.ts`: ajustar `uploadPortfolioItem` para calcular `sort_order` automaticamente, e expor `reorderPortfolioItems(updates: { id, sort_order }[])` (faz `update` em batch, um por item).

---

## 3. Ordenação (drag-and-drop)

Biblioteca: **`@dnd-kit/core` + `@dnd-kit/sortable`** (leve, acessível, padrão React 19/TS).

Comportamento:

- Reordenação **dentro do filtro ativo** (categoria selecionada ou "Todas").
  - Se filtro = "Todas": ordena globalmente; `sort_order` é único entre todas as fotos.
  - Se filtro = categoria: ordena só dentro dessa categoria.
- Sortable grid com handle visível ao hover (ícone `GripVertical` no canto superior esquerdo do card, espelhando o botão de delete à direita).
- Ao largar:
  1. Atualização otimista no React Query cache.
  2. `reorderPortfolioItems()` envia novos `sort_order` para os itens afetados.
  3. Toast `"Ordem guardada"` ou rollback + toast de erro.
- Ordenação default na query: `ORDER BY sort_order ASC, created_at DESC`.

Componentes novos:

- `SortablePhotoCard.tsx` — wrapper `useSortable` à volta do `<article>` existente.
- Container `<DndContext><SortableContext items={...}>` no grid.

---

## 4. Lightbox

Usar o `Dialog` do shadcn (`components/ui/dialog.tsx`) — sem nova dependência.

- Clique na imagem (não no botão delete, não no handle de drag) abre o modal.
- Conteúdo: imagem grande (max `90vh`, `object-contain`, fundo `#0F0F0F`), título, categoria, data de criação formatada (pt-PT), botão "Remover" (abre o `AlertDialog` existente) e botão "Fechar".
- Acessibilidade: `Esc` fecha (Dialog já trata), `aria-label` na imagem.
- Sem navegação prev/next nesta iteração (mantém o scope simples; pode ser extra mais tarde se for útil).

---

## Ficheiros a alterar / criar

**Migração**
- `supabase/migrations/<timestamp>_portfolio_sort_order.sql`

**Novos**
- `src/components/admin/SortablePhotoCard.tsx`
- `src/components/admin/PhotoLightbox.tsx`
- `src/components/admin/BatchUploader.tsx` (extrair o formulário do ficheiro de rota para legibilidade)

**Editados**
- `src/lib/portfolio-db.ts` — `sort_order` no insert; `reorderPortfolioItems()`; `listPortfolioItems()` ordena por `sort_order`.
- `src/routes/_admin/admin.portfolio.tsx` — integra os 3 componentes acima, DnD context, estado do lightbox.
- `src/routes/portefolio.tsx` — usar `sort_order` na ordenação pública.
- `package.json` — adicionar `@dnd-kit/core` e `@dnd-kit/sortable`.

---

## Notas de UX (pt-PT)

- Botão de upload muda para `"Carregar N fotos"` quando há lote.
- Mensagem de progresso: `"A carregar 3 de 7…"`.
- Tooltip no handle de drag: `"Arrastar para reordenar"`.
- Toast final do lote: `"5 fotos carregadas com sucesso."` ou `"4 carregadas, 1 falhou."`.

---

## Fora deste plano

- Edição de título/categoria de fotos existentes.
- Reordenação por botões (substituída pelo drag-and-drop, que cobre mesma necessidade com melhor UX).
- Navegação prev/next no lightbox.
- Paginação (continua sem ser necessária <100 fotos).
