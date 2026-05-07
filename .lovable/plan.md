## Objetivo

Alinhar o design à identidade real do site atual da IJ Santos (cinza, preto, branco e vermelho) e melhorar a leitura no mobile centrando os textos das secções principais.

## 1. Nova paleta (substitui a atual ocre/slate)

Em `src/styles.css`, redefinir os tokens:

- `--background`: branco puro (`oklch(1 0 0)`)
- `--foreground` / `--ink`: preto profundo (`oklch(0.16 0 0)`)
- `--surface`: cinza muito claro (`oklch(0.96 0 0)`) para secções alternadas
- `--muted` / `--muted-foreground`: cinzas neutros (sem matiz azulado)
- `--primary`: preto/cinza-escuro (`oklch(0.2 0 0)`) para superfícies escuras (hero, footer, CTA band)
- `--primary-foreground`: branco
- `--brand`: vermelho IJ Santos (`oklch(0.55 0.22 27)` — vermelho forte, próximo de #D81E1E)
- `--brand-foreground`: branco (atualizar componentes que assumiam texto escuro sobre o ocre)
- `--accent`: cinza claro neutro
- `--border` / `--input`: cinza claro neutro (`oklch(0.9 0 0)`)
- `--ring`: vermelho da brand
- Modo `.dark`: manter coerente (preto/cinzas + vermelho)

Remover qualquer matiz quente/azul residual nos gradientes decorativos (ex.: bloco "Região Centro" em `index.tsx` usa radial-gradients com tons ocre/azul → trocar por cinzas neutros + leve toque vermelho).

## 2. Ajustes de componentes que dependem da cor

Verificar e ajustar onde o ocre era assumido como cor sobre fundo claro:

- `Header.tsx`: botão "Pedir Orçamento" passa a vermelho com texto branco; sublinhado de link ativo passa a vermelho.
- `Footer.tsx`, `CTABand.tsx`, `Hero.tsx`: garantir contraste do CTA vermelho sobre fundo escuro (preto/cinza-escuro em vez de slate-azulado).
- `ServiceCard.tsx`: ícones e hover passam a usar vermelho como acento sobre cinza/preto.
- `WhatsAppFAB.tsx`: manter verde WhatsApp (não faz parte da paleta da marca, é convenção).
- `BeforeAfter.tsx`: handle/divisória passa a branco com acento vermelho.
- `Testimonials.tsx`, `WhyUs.tsx`, `ProcessSteps.tsx`: numerais/ícones de destaque a vermelho.
- `CookieConsent.tsx`: botão primário a vermelho.
- `QuoteForm.tsx`: focus ring e botão submit a vermelho.

Não é necessário tocar em ficheiros onde já se usam tokens semânticos (`bg-brand`, `text-brand`, etc.) — a troca de variável propaga-se automaticamente. A revisão acima é só para apanhar casos com cores hardcoded ou com pressupostos de contraste (ex.: texto escuro sobre ocre que agora seria texto escuro sobre vermelho — ilegível).

## 3. Textos centrados em mobile

Aplicar `text-center md:text-left` (e equivalente para alinhamento de itens flex/grid: `items-center md:items-start`) nas secções com texto longo:

- `Hero.tsx`: título, subtítulo, par de CTAs e "trust badges".
- `index.tsx`:
  - Bloco "Sobre a IJ Santos"
  - Cabeçalho "Os nossos serviços"
  - Bloco "Área de atuação" (incluindo o wrap das tags)
- `WhyUs.tsx`, `ProcessSteps.tsx`, `Testimonials.tsx`, `CTABand.tsx`: cabeçalhos e cards.
- `servicos.tsx`, `servicos.$slug.tsx`, `sobre.tsx`, `contacto.tsx`: heros e cabeçalhos de secção.
- `Footer.tsx`: blocos da grelha do footer centrados em mobile, alinhados à esquerda em `md:`.
- `ServiceCard.tsx`: conteúdo do card centrado em mobile.

Listas com bullets/ícones (ex.: benefícios nos serviços, processo) — centrar o container, mas manter o ícone+texto alinhados de forma legível (usar `justify-center md:justify-start` no flex do item).

Botões dentro de blocos de texto: usar `mx-auto md:mx-0` para os centrar quando o texto está centrado.

## 4. Verificação

Após as alterações, rever no preview mobile (390px) os ecrãs principais (Início, Serviços, Detalhe de serviço, Sobre, Contacto) para confirmar:
- Paleta consistente cinza/preto/branco/vermelho sem resquícios de ocre.
- Textos centrados em mobile, alinhados à esquerda em ≥ md.
- Contraste AA mantido (especialmente vermelho sobre branco e branco sobre vermelho).

## Fora de âmbito

- Não alterar imagens nem estrutura de páginas.
- Não mexer em tipografia.
- Não tocar em conteúdo / dados reais já integrados.
