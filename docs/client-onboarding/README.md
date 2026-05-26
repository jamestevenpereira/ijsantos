# Onboarding de Projeto — Documentação para o Cliente

**Projeto:** [NOME DO PROJETO]  
**Cliente:** [NOME DO CLIENTE]  
**Site:** [DOMÍNIO]  
**Preparado por:** [NOME DO PROGRAMADOR]  
**Data:** [DATA]

---

## O que é este documento?

Este conjunto de documentos foi preparado para guiar o cliente no processo de configuração das contas e plataformas necessárias para o projeto. Está escrito de forma simples e acessível, mesmo para quem não tem experiência técnica.

**O cliente não precisa de perceber de tecnologia** — apenas de seguir os passos indicados em cada documento.

---

## Como usar esta documentação

Para cada serviço:

1. Leia **"O que precisa de fazer"** — são os passos da responsabilidade do cliente.
2. Leia **"O que será feito por nós"** — são os passos técnicos da nossa responsabilidade.
3. Siga o **Checklist final** para confirmar que tudo está pronto antes de avançar.

---

## Serviços por Tipo de Projeto

Nem todos os projetos precisam de todos os serviços. Use a tabela abaixo como guia:

| # | Serviço | Ficheiro | Obrigatório? | Quando usar |
|---|---|---|---|---|
| 1 | Cloudflare | [01-cloudflare.md](01-cloudflare.md) | **Sim** | Todos os projetos |
| 2 | Cloudflare Pages | [02-cloudflare-pages.md](02-cloudflare-pages.md) | **Sim** | Todos os projetos |
| 3 | Resend | [03-resend.md](03-resend.md) | **Sim** | Sites com formulários ou emails automáticos |
| 4 | Google Workspace | [04-google-workspace.md](04-google-workspace.md) | Recomendado | Se o cliente quiser email profissional (ex.: `geral@dominio.com`) |
| 5 | Supabase | [05-supabase.md](05-supabase.md) | Depende | Projetos com base de dados, login ou backend |
| 6 | Google Analytics | [06-google-analytics.md](06-google-analytics.md) | Recomendado | Todos os sites com presença online |
| 7 | Google Search Console | [07-google-search-console.md](07-google-search-console.md) | Recomendado | Todos os sites que precisam de visibilidade no Google |
| 8 | Google Tag Manager | [08-google-tag-manager.md](08-google-tag-manager.md) | Opcional | Apenas se houver múltiplos scripts de marketing |
| 9 | Meta Business | [09-meta-business.md](09-meta-business.md) | Opcional | Apenas se houver campanhas Facebook/Instagram Ads |
| 10 | Google Cloud | [10-google-cloud.md](10-google-cloud.md) | Raramente | Projetos avançados com APIs específicas |

---

## Antes de começar — Leitura obrigatória

Recomendamos a leitura do documento de [Segurança e Boas Práticas](seguranca-e-boas-praticas.md) antes de criar qualquer conta. Inclui orientações simples para manter as contas do projeto seguras.

---

## Placeholders a substituir antes de enviar

Antes de enviar esta documentação ao cliente, substitua os seguintes valores em todos os ficheiros:

| Placeholder | Descrição | Exemplo |
|---|---|---|
| `[NOME DO CLIENTE]` | Nome da empresa ou pessoa | Empresa Exemplo, Lda. |
| `[NOME DO PROJETO]` | Nome interno do projeto | Site Institucional 2025 |
| `[DOMÍNIO]` | Endereço do site | exemplo.pt |
| `[EMAIL DO ADMIN]` | Email do programador a adicionar | dev@email.com |
| `[EMAIL DO CLIENTE]` | Email principal do cliente | geral@exemplo.pt |
| `[NOME DO PROGRAMADOR]` | Nome ou agência | James Pereira |
| `[DATA]` | Data de envio do documento | Maio 2025 |

---

## Ordem de configuração recomendada

Para uma configuração sem problemas, seguir esta ordem:

1. Ler [Segurança e Boas Práticas](seguranca-e-boas-praticas.md)
2. Configurar [Cloudflare](01-cloudflare.md) — base de tudo
3. Configurar [Resend](03-resend.md) — precisa do Cloudflare para DNS
4. Configurar [Google Workspace](04-google-workspace.md) — se necessário, precisa do Cloudflare para MX records
5. Configurar [Google Search Console](07-google-search-console.md) — precisa do Cloudflare para verificação
6. Configurar [Google Analytics](06-google-analytics.md)
7. Configurar [Supabase](05-supabase.md) — se aplicável
8. Configurar serviços opcionais
9. [Cloudflare Pages](02-cloudflare-pages.md) — o programador trata disto após ter acesso ao Cloudflare
