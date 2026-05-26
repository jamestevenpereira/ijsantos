# Resend — Envio de Emails do Site

**Projeto:** [NOME DO PROJETO] — [NOME DO CLIENTE]

---

## O que é o Resend?

O Resend é o serviço responsável pelo envio de emails automáticos gerados pelo site. Por exemplo:

- Quando um visitante preenche o formulário de contacto → o cliente recebe um email com os dados.
- Quando um utilizador se regista no site → recebe um email de boas-vindas.
- Quando há uma encomenda, pedido ou notificação → o email é enviado automaticamente.

Estes emails são enviados em nome do domínio do cliente (ex.: `noreply@[DOMÍNIO]` ou `hello@[DOMÍNIO]`), o que confere credibilidade e evita que caiam na pasta de spam.

---

## Resend vs. email profissional — Qual a diferença?

É comum surgir confusão entre o Resend e um email profissional. São serviços diferentes com propósitos diferentes:

| | Resend | Google Workspace / Gmail profissional |
|---|---|---|
| Para quê | Enviar emails automáticos **do site** | Enviar e receber emails **manualmente** |
| Exemplo | "Recebeu uma nova mensagem do formulário" | "Responder ao cliente por email" |
| Tem caixa de entrada? | Não | Sim |
| Precisa de login diário? | Não | Sim |
| Quem configura | Programador | Cliente (com apoio nosso) |

**Em resumo:** O Resend é para o site enviar emails. O Google Workspace é para o cliente ter uma caixa de email com o domínio próprio. São complementares, não substitutos.

Se o cliente quiser ter `geral@[DOMÍNIO]` como caixa de entrada, consulte o documento [04-google-workspace.md](04-google-workspace.md).

---

## O que precisa de fazer

### Passo 1 — Criar conta Resend

1. Aceder a [resend.com](https://resend.com).
2. Clicar em **"Sign Up"**.
3. Pode registar-se com email ou com conta Google.
4. Confirmar o email, se solicitado.

> Use o email principal da empresa (`[EMAIL DO CLIENTE]`).

---

### Passo 2 — Adicionar o programador como administrador

1. Após o login, no menu lateral esquerdo, clicar em **"Settings"** (Configurações).
2. Selecionar o separador **"Team"**.
3. Clicar em **"Invite Member"**.
4. Introduzir o email do programador: `[EMAIL DO ADMIN]`
5. Selecionar o role **"Admin"** (ou **"Full Access"**, conforme a versão da interface).
6. Clicar em **"Send Invite"**.

O programador irá aceitar o convite por email.

---

## O que será feito por nós

Após receber o acesso, o programador irá:

- Adicionar e verificar o domínio `[DOMÍNIO]` no Resend.
- Configurar os seguintes DNS records no Cloudflare para autenticação de email:
  - **SPF** — confirma que o Resend tem permissão para enviar emails pelo domínio, evitando que sejam marcados como spam.
  - **DKIM** — assina digitalmente cada email para garantir autenticidade.
  - **DMARC** (recomendado) — define o que fazer com emails não autorizados enviados em nome do domínio.
- Integrar o Resend no código do site (formulários, notificações, etc.).
- Testar o envio e confirmar que os emails chegam corretamente.

> O cliente não precisa de configurar estes registos DNS manualmente. O programador trata de tudo após ter acesso ao Cloudflare e ao Resend.

---

## Notas sobre DNS records

Os registos SPF, DKIM e DMARC são configurados no Cloudflare e são invisíveis para o utilizador final — fazem parte da infraestrutura técnica de email. A sua função é simples: garantir que os emails chegam à caixa de entrada e não ao spam.

---

## Notas sobre custos

| Plano | Emails/mês | Domínios | Custo |
|---|---|---|---|
| Free | 3.000 | 1 | 0 EUR |
| Pro | 50.000+ | Ilimitado | A partir de ~20 USD/mês |

Para a maioria dos projetos, o plano gratuito é suficiente. O programador informará caso o volume de emails exija upgrade.

---

## Checklist final

- [ ] Conta Resend criada com o email da empresa (`[EMAIL DO CLIENTE]`)
- [ ] `[EMAIL DO ADMIN]` adicionado como **Admin** no Resend
- [ ] Programador confirmou que aceitou o convite
- [ ] Programador adicionou e verificou o domínio `[DOMÍNIO]` no Resend
- [ ] DNS records (SPF, DKIM) configurados no Cloudflare pelo programador
- [ ] Envio de emails testado e a funcionar corretamente
