# Language Switcher — Segmented Pill Redesign

**Data:** 2026-05-27
**Âmbito:** `LanguageSwitcher` component em `src/components/layout/Header.tsx`

---

## Contexto

O language switcher actual (EN / PT separados por "/") não comunica claramente qual o idioma activo. A distinção entre activo (`text-foreground`) e inactivo (`text-muted-foreground`) é demasiado subtil, especialmente no header translúcido.

---

## Solução

Substituir o par de botões de texto simples por um **segmented pill**: um container com fundo subtil que envolve ambos os idiomas, com o idioma activo a ter um fundo sólido branco e texto escuro.

---

## Especificação visual

### Container

```
bg-white/10  rounded-md  p-0.5  gap-0.5  flex
```

### Botão activo

```
bg-white  text-[#0F0F0F]  font-semibold  rounded-sm  px-2.5  py-1  text-xs
```

### Botão inactivo

```
text-white/50  hover:text-white/80  transition-colors  rounded-sm  px-2.5  py-1  text-xs
```

### Separador

Removido — o pill já separa visualmente os dois botões.

---

## Acessibilidade

- Cada botão mantém o `aria-label` existente (`"Switch to English"`, `"Mudar para Português"`).
- Adicionar `aria-pressed={current === lang}` a cada botão para indicar estado activo a leitores de ecrã.
- Focus ring existente (`focus-visible:ring-2 focus-visible:ring-brand`) mantém-se inalterado.

---

## Ficheiro afectado

| Ficheiro | Alteração |
|----------|-----------|
| `src/components/layout/Header.tsx` | Reescrever JSX e classes do `LanguageSwitcher` |

Nenhum outro ficheiro muda. A lógica (`changeLanguage`, `localStorage`, `i18n`) não é tocada. O componente é reutilizado no menu mobile (linha 182) e herda o novo estilo automaticamente via o mesmo código.

---

## O que não muda

- Lógica de detecção e persistência de idioma
- Posicionamento do componente no header desktop e mobile
- Comportamento de teclado e focus
