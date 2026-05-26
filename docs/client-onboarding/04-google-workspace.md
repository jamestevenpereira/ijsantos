# Google Workspace — Email Profissional com Domínio Próprio

**Projeto:** [NOME DO PROJETO] — [NOME DO CLIENTE]

---

## O que é o Google Workspace?

O Google Workspace é a solução da Google para ter email profissional com o domínio da empresa, como:

- `geral@[DOMÍNIO]`
- `hello@[DOMÍNIO]`
- `suporte@[DOMÍNIO]`
- `[nome]@[DOMÍNIO]`

Inclui também Google Drive, Google Meet, Google Docs, Google Calendar e Google Chat — tudo integrado e com o domínio da empresa.

---

## Quando é necessário?

O Google Workspace é recomendado quando:

- O cliente quer **receber e responder emails** com o endereço do domínio da empresa.
- O cliente quer **aparentar mais profissionalismo** nas comunicações (em vez de `@gmail.com` ou `@hotmail.com`).
- Há necessidade de **múltiplos endereços de email** para diferentes departamentos ou pessoas.

**Não é obrigatório se:**

- O cliente já tem email profissional noutro serviço (ex.: Microsoft 365 / Outlook, Zoho Mail, etc.).
- Não há necessidade de comunicação por email com o endereço do domínio.

> **Importante:** O Resend (que envia emails automáticos do site) funciona de forma independente do Google Workspace. Pode usar os dois em simultâneo ou só um deles, consoante as necessidades.

---

## Alternativa gratuita — Cloudflare Email Routing

Se o cliente apenas quer **receber** emails enviados para o domínio e redirecioná-los para o Gmail ou outro email existente — **sem precisar de responder com o endereço do domínio** — podemos configurar o **Cloudflare Email Routing** gratuitamente.

**Exemplo:** Emails enviados para `geral@[DOMÍNIO]` chegam automaticamente ao `[EMAIL DO CLIENTE]`.

Esta opção é mais simples e gratuita, mas não permite responder com `geral@[DOMÍNIO]`. Se isso for suficiente, informe o programador e evitamos o custo do Google Workspace.

---

## O que precisa de fazer (se optar pelo Google Workspace)

### Passo 1 — Criar conta Google Workspace

1. Aceder a [workspace.google.com](https://workspace.google.com).
2. Clicar em **"Começar"** ou **"Get Started"**.
3. Preencher o nome da empresa e o número de utilizadores estimado.
4. Quando perguntado sobre domínio, selecionar **"Sim, tenho um domínio"** e introduzir: `[DOMÍNIO]`.
5. Criar o email de administrador principal (ex.: `admin@[DOMÍNIO]` ou `geral@[DOMÍNIO]`).
6. Seguir os restantes passos do processo de configuração inicial.
7. Introduzir os dados de faturação para ativar a conta.

> O Google Workspace tem um **período de teste gratuito de 14 dias**. Após esse período, o custo é a partir de aproximadamente 5,75 EUR por utilizador por mês (plano Business Starter).

---

### Passo 2 — Adicionar o programador como administrador (temporário)

Para que o programador possa configurar os registos DNS e verificar o domínio, precisa de acesso temporário de administrador:

1. Fazer login na consola de administração: [admin.google.com](https://admin.google.com).
2. No menu lateral, ir a **"Utilizadores"** ou **"Users"**.
3. Clicar em **"Convidar utilizador"** ou **"Add new user"**.
4. Introduzir o email do programador: `[EMAIL DO ADMIN]`
5. Atribuir o role de **"Super Admin"**.
6. Guardar e enviar o convite.

> Após a configuração estar concluída, o programador irá confirmar e o acesso de Super Admin pode ser removido, se o cliente preferir.

---

## O que será feito por nós

Após receber o acesso, o programador irá:

- Verificar o domínio `[DOMÍNIO]` no Google Workspace (via registo DNS no Cloudflare).
- Configurar os **MX records** no Cloudflare para que os emails sejam recebidos no Google.
- Configurar **SPF** para que o Google possa enviar emails em nome do domínio.
- Configurar **DKIM** para assinatura digital dos emails.
- Verificar que o envio e receção de emails funcionam corretamente.
- Apoiar na criação de caixas de email adicionais, se necessário.

---

## Notas sobre DNS records

Para que o Google Workspace funcione, são necessários alguns registos no Cloudflare:

| Registo | Propósito |
|---|---|
| MX | Direciona emails recebidos para os servidores do Google |
| SPF (TXT) | Autoriza o Google a enviar emails pelo domínio |
| DKIM (TXT) | Assina digitalmente os emails para evitar spam |

Todos estes registos são configurados pelo programador — o cliente não precisa de os fazer manualmente.

---

## Notas sobre custos

| Plano | Preço/utilizador/mês | Armazenamento | Recomendado para |
|---|---|---|---|
| Business Starter | ~5,75 EUR | 30 GB | Pequenas empresas |
| Business Standard | ~11,50 EUR | 2 TB | Empresas com mais necessidades |

O custo é cobrado mensalmente por número de utilizadores ativos. O cartão de crédito é sempre associado à conta do cliente.

---

## Checklist final

- [ ] Decisão tomada: Google Workspace, Cloudflare Email Routing ou outro serviço
- [ ] Conta Google Workspace criada (se aplicável)
- [ ] Endereços de email definidos (ex.: `geral@[DOMÍNIO]`, `suporte@[DOMÍNIO]`)
- [ ] Programador adicionado como Super Admin (temporário)
- [ ] Domínio `[DOMÍNIO]` verificado no Google Workspace
- [ ] MX records, SPF e DKIM configurados no Cloudflare
- [ ] Envio e receção de emails testados e a funcionar
- [ ] Acesso de Super Admin removido após configuração (se temporário)
