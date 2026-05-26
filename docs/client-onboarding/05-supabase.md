# Supabase — Base de Dados e Backend

**Projeto:** [NOME DO PROJETO] — [NOME DO CLIENTE]

---

## O que é o Supabase?

O Supabase é a plataforma de backend do projeto — responsável por guardar e gerir os dados, autenticação de utilizadores e ficheiros quando o projeto o exige.

É utilizado quando o projeto inclui funcionalidades como:

- **Base de dados** — guardar registos, utilizadores, produtos, pedidos, formulários, etc.
- **Autenticação** — sistema de login e registo de utilizadores no site ou aplicação.
- **Storage** — armazenar ficheiros, imagens ou documentos enviados pelos utilizadores.
- **API automática** — comunicação entre o site/app e a base de dados.

**Não é necessário** para sites institucionais simples, landing pages ou sites sem área de login ou base de dados. O programador irá confirmar se o projeto precisa de Supabase.

---

## Conta: quem cria e porquê

A conta Supabase é criada pelo cliente porque é onde os dados do projeto ficam guardados. A propriedade dos dados é sempre do cliente — o programador tem acesso técnico para configurar e desenvolver, mas não possui os dados.

---

## O que precisa de fazer

### Passo 1 — Criar conta Supabase

1. Aceder a [supabase.com](https://supabase.com).
2. Clicar em **"Start your project"** ou **"Sign Up"**.
3. Pode registar-se com email, conta GitHub ou conta Google.
4. Confirmar o email, se solicitado.

> Use o email principal da empresa (`[EMAIL DO CLIENTE]`).

---

### Passo 2 — Criar uma organização

1. Após o login, clicar em **"New Organization"**.
2. Dar um nome à organização: `[NOME DO CLIENTE]`.
3. Selecionar o plano **"Free"** (suficiente para começar — pode ser atualizado depois).
4. Clicar em **"Create Organization"**.

---

### Passo 3 — Criar o projeto

1. Dentro da organização, clicar em **"New Project"**.
2. Dar um nome ao projeto: `[NOME DO PROJETO]`.
3. Definir uma **password segura para a base de dados** — esta password é gerada pelo Supabase ou pode ser definida pelo cliente.
   - **Guardar esta password num local seguro** — é necessária para acessos de manutenção.
4. Selecionar a **região** do servidor:
   - Para Portugal e Europa: **"West EU (Ireland)"** ou **"Central EU (Frankfurt)"** (recomendado).
5. Clicar em **"Create new project"**.
6. Aguardar 1 a 2 minutos enquanto o projeto é criado.

---

### Passo 4 — Adicionar o programador como administrador

1. No painel do projeto, clicar em **"Settings"** (ícone de engrenagem) no menu lateral.
2. Selecionar **"Team"** ou **"Members"**.
3. Clicar em **"Invite"** ou **"Add Member"**.
4. Introduzir o email do programador: `[EMAIL DO ADMIN]`
5. Selecionar o role **"Owner"** ou **"Administrator"** (o nome pode variar).
6. Clicar em **"Send Invitation"**.

---

## O que será feito por nós

Após receber o acesso, o programador irá:

- Criar as tabelas e a estrutura da base de dados conforme os requisitos do projeto.
- Configurar autenticação (registo, login, recuperação de password, login social), se aplicável.
- Configurar políticas de segurança dos dados (Row Level Security — RLS).
- Integrar o Supabase com o código do site ou aplicação.
- Configurar o Storage para upload de ficheiros, se necessário.
- Verificar backups automáticos e monitorização.

---

## Notas sobre billing, segurança e ownership

### Planos e custos

| Plano | Custo | Base de dados | Storage | Utilizadores ativos/mês |
|---|---|---|---|---|
| Free | 0 USD | 500 MB | 1 GB | 50.000 |
| Pro | 25 USD/mês | 8 GB | 100 GB | 100.000 |
| Team | 599 USD/mês | 16 GB+ | 200 GB+ | Sem limite |

O plano Free é suficiente para a maioria dos projetos no arranque. O programador informará caso seja necessário fazer upgrade.

### Segurança

- A password da base de dados deve ser guardada pelo cliente num local seguro (gestor de passwords ou documento privado).
- Recomendamos ativar **2FA** na conta Supabase para proteção extra.
- O programador nunca deve guardar a password da base de dados em código visível ao público.

### Ownership e propriedade dos dados

- Os dados são do cliente. O Supabase é a plataforma onde ficam alojados, mas o controlo é sempre do cliente.
- O cartão de crédito (para planos pagos) é sempre associado à conta do cliente.
- Em caso de término da colaboração, o programador deve ser removido da organização e do projeto.

---

## Checklist final

- [ ] Conta Supabase criada com o email da empresa (`[EMAIL DO CLIENTE]`)
- [ ] 2FA ativado na conta Supabase
- [ ] Organização `[NOME DO CLIENTE]` criada
- [ ] Projeto `[NOME DO PROJETO]` criado
- [ ] Região europeia selecionada (Ireland ou Frankfurt)
- [ ] Password da base de dados guardada em local seguro
- [ ] `[EMAIL DO ADMIN]` adicionado como **Owner** ou **Administrator**
- [ ] Programador confirmou que aceitou o convite e tem acesso
