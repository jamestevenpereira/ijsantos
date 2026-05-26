# Cloudflare — Conta e Gestão do Domínio

**Projeto:** [NOME DO PROJETO] — [NOME DO CLIENTE]

---

## O que é o Cloudflare?

O Cloudflare é a plataforma central do projeto. Gere o domínio do site (ex.: `[DOMÍNIO]`), garante segurança, velocidade e serve de base para publicar o site online.

Pense no Cloudflare como o "hub" de tudo: o endereço do site, o alojamento, o certificado de segurança (HTTPS), a proteção contra ataques e a configuração técnica de email passam por aqui.

**A conta é sempre do cliente.** O programador é adicionado como administrador para configurar o que é necessário — mas a propriedade e o controlo ficam sempre do lado do cliente.

---

## O que precisa de fazer

### Passo 1 — Criar conta Cloudflare

1. Aceder a [cloudflare.com](https://cloudflare.com).
2. Clicar em **"Sign Up"** (Criar conta).
3. Introduzir o email da empresa (`[EMAIL DO CLIENTE]`) e uma password segura.
4. Verificar o email através do link enviado para a caixa de entrada.
5. Fazer login com as credenciais criadas.

> Use o email principal da empresa, pois é para esse endereço que chegarão notificações e alertas da conta.

---

### Passo 2 — Adicionar o domínio ao Cloudflare

**Se já tem domínio registado** (ex.: comprado no GoDaddy, OVH, SAPO, Namecheap, etc.):

1. Após o login, clicar em **"Add a domain"** ou **"+ Add Site"**.
2. Introduzir o domínio: `[DOMÍNIO]` (sem `www` ou `https://`).
3. Clicar em **"Continue"**.
4. Selecionar o plano **Free** e clicar em **"Continue"**.
5. O Cloudflare irá analisar os DNS atuais automaticamente — clicar em **"Continue"** após a análise.
6. O Cloudflare irá mostrar dois **Nameservers** (ex.: `xxx.ns.cloudflare.com` e `yyy.ns.cloudflare.com`).
7. **Copie estes dois endereços** — vai precisar deles no Passo 3.

**Se ainda não tem domínio:**

Pode adquirir diretamente no Cloudflare Registrar, que é mais simples e sem custo adicional (preço de custo, sem markup). Informe o programador e avançamos juntos.

---

### Passo 3 — Alterar os Nameservers no seu registar de domínio

> Este passo só se aplica se o domínio foi comprado noutro serviço. Se comprou o domínio no Cloudflare, pode avançar para o Passo 4.

1. Aceder ao painel do serviço onde comprou o domínio (ex.: GoDaddy, OVH, SAPO).
2. Localizar as configurações de **"Nameservers"** ou **"DNS"** do domínio `[DOMÍNIO]`.
3. Substituir os nameservers existentes pelos dois fornecidos pelo Cloudflare no Passo 2.
4. Guardar as alterações.

> A propagação pode demorar entre 30 minutos e 48 horas. Quando estiver ativa, o Cloudflare envia um email de confirmação.

**Não sabe como fazer no seu serviço específico?** Informe o programador qual o serviço onde comprou o domínio e tratamos de guiar ou ajudar a resolver.

---

### Passo 4 — Adicionar o programador como administrador

1. Fazer login na conta Cloudflare em [dash.cloudflare.com](https://dash.cloudflare.com).
2. No canto superior direito, clicar no nome da conta ou no ícone do utilizador.
3. Selecionar **"Manage Account"** e depois **"Members"**.
4. Clicar em **"Invite Member"**.
5. Introduzir o email do programador: `[EMAIL DO ADMIN]`
6. Em **Role**, selecionar **"Administrator"**.
7. Clicar em **"Send Invitation"**.

O programador irá aceitar o convite por email. Após aceitar, terá acesso para configurar tudo o que é necessário.

---

## O que será feito por nós

Após receber o acesso, o programador irá:

- Confirmar que os Nameservers estão ativos e o domínio está a funcionar no Cloudflare.
- Configurar os DNS records necessários (A, CNAME, MX, TXT, etc.).
- Configurar redirecionamentos (ex.: `www.[DOMÍNIO]` → `[DOMÍNIO]`).
- Ativar o certificado SSL/HTTPS automático.
- Configurar regras de segurança e cache, quando necessário.
- Configurar Cloudflare Pages para publicação do site (ver [02-cloudflare-pages.md](02-cloudflare-pages.md)).
- Adicionar os DNS records de email (SPF, DKIM) para Resend e/ou Google Workspace, se aplicável.

---

## Notas importantes

- **A conta é sempre sua.** O programador tem acesso técnico de administrador, mas não pode transferir o domínio nem remover o cliente da conta.
- **Não é necessário partilhar a password.** O acesso é feito por convite — o programador recebe um email e aceita. Nunca é necessário partilhar credenciais.
- **O plano Free do Cloudflare é suficiente** para a grande maioria dos projetos. Só será necessário atualizar o plano em casos muito específicos — o programador informará se isso acontecer.
- **Ativar 2FA** na conta Cloudflare é fortemente recomendado (ver [seguranca-e-boas-praticas.md](seguranca-e-boas-praticas.md)).

---

## Checklist final

- [ ] Conta Cloudflare criada com o email da empresa (`[EMAIL DO CLIENTE]`)
- [ ] 2FA ativado na conta Cloudflare
- [ ] Domínio `[DOMÍNIO]` adicionado ao Cloudflare
- [ ] Nameservers atualizados no registar do domínio (se aplicável)
- [ ] Email de confirmação do Cloudflare recebido (domínio ativo)
- [ ] `[EMAIL DO ADMIN]` adicionado como **Administrator**
- [ ] Programador confirmou que aceitou o convite e tem acesso
