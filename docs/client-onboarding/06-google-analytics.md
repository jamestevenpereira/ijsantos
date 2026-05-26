# Google Analytics — Análise de Visitas e Comportamento

**Projeto:** [NOME DO PROJETO] — [NOME DO CLIENTE]

---

## O que é o Google Analytics?

O Google Analytics é a ferramenta gratuita da Google para medir tudo o que acontece no site:

- Quantas pessoas visitam o site e quando.
- De onde vêm (pesquisa Google, redes sociais, email, anúncios, etc.).
- Quais as páginas mais visitadas e mais tempo de permanência.
- Que ações realizam (cliques em botões, preenchimento de formulários, etc.).
- Que dispositivos usam (telemóvel, computador, tablet).
- Em que país ou cidade estão os visitantes.

É essencial para perceber se o site está a funcionar e para tomar decisões de marketing e conteúdo com base em dados reais — e não em suposições.

---

## O que precisa de fazer

### Passo 1 — Aceder ao Google Analytics

1. Aceder a [analytics.google.com](https://analytics.google.com).
2. Fazer login com a conta Google da empresa.
   - Se não tiver conta Google associada à empresa, criar uma em [accounts.google.com](https://accounts.google.com).

---

### Passo 2 — Criar conta Google Analytics

1. Clicar em **"Start measuring"** (ou **"Começar a medir"**).
2. Em **"Account name"** (Nome da conta): introduzir o nome da empresa — `[NOME DO CLIENTE]`.
3. Em **"Data Sharing Settings"**: manter as opções padrão (ou desmarcar conforme preferência).
4. Clicar em **"Next"**.

---

### Passo 3 — Criar propriedade GA4

1. Em **"Property name"** (Nome da propriedade): introduzir o nome do site — `[NOME DO PROJETO]` ou `[DOMÍNIO]`.
2. Selecionar o **fuso horário**: `(GMT+00:00) Lisboa` ou `(GMT+01:00) Lisboa` (conforme a época do ano).
3. Selecionar a **moeda**: `Euro (EUR)`.
4. Clicar em **"Next"**.
5. Preencher as informações sobre o negócio (pode selecionar as opções mais próximas da realidade).
6. Clicar em **"Create"** e aceitar os Termos de Serviço da Google.

---

### Passo 4 — Criar Data Stream (fluxo de dados)

1. Após criar a propriedade, será pedido para configurar um Data Stream.
2. Selecionar **"Web"**.
3. Em **"Website URL"**: introduzir `https://[DOMÍNIO]`.
4. Em **"Stream name"**: dar um nome (ex.: `[NOME DO PROJETO] — Web`).
5. Clicar em **"Create stream"**.
6. Será gerado um **Measurement ID** no formato `G-XXXXXXXXXX`.
7. **Copiar este ID e enviá-lo ao programador** — é necessário para instalar o tracking no site.

---

### Passo 5 — Adicionar o programador com permissões de Editor

1. No Google Analytics, clicar no ícone de engrenagem **"Admin"** no canto inferior esquerdo.
2. Na coluna **"Account"** (à esquerda), clicar em **"Account Access Management"**.
3. Clicar no botão **"+"** e selecionar **"Add users"**.
4. Introduzir o email do programador: `[EMAIL DO ADMIN]`
5. Selecionar o role **"Editor"**.
   - Editor: pode configurar o Analytics sem aceder a dados de faturação ou gerir utilizadores.
   - Administrator: acesso total — selecionar se necessário para configurações avançadas.
6. Clicar em **"Add"**.

---

## O que será feito por nós

Após receber o acesso e o Measurement ID, o programador irá:

- Instalar o código de tracking do Google Analytics no site.
- Configurar eventos personalizados (ex.: clique no botão de contacto, envio de formulário), se necessário.
- Ligar o Google Analytics ao Google Search Console (permite ver dados de pesquisa no Analytics).
- Verificar que os dados estão a ser recolhidos corretamente após a publicação.

---

## Notas sobre privacidade e RGPD

Para projetos com utilizadores na União Europeia, o Google Analytics deve ser configurado em conformidade com o RGPD (Regulamento Geral de Proteção de Dados). O programador irá:

- Configurar anonimização de IPs, se necessário.
- Orientar sobre a necessidade de banner de cookies / política de privacidade.
- Configurar o consentimento de cookies, se o projeto o exigir.

---

## Notas sobre custos

O Google Analytics é **completamente gratuito** para a maioria dos projetos. O Google Analytics 4 (GA4) é a versão atual e substitui o Universal Analytics.

---

## Checklist final

- [ ] Conta Google Analytics criada com o email da empresa
- [ ] Propriedade GA4 criada para `[DOMÍNIO]`
- [ ] Fuso horário e moeda configurados corretamente (Lisboa / EUR)
- [ ] Data Stream criado para o site
- [ ] Measurement ID (`G-XXXXXXXXXX`) enviado ao programador
- [ ] `[EMAIL DO ADMIN]` adicionado como **Editor** ou **Administrator**
- [ ] Programador instalou o tracking no site
- [ ] Dados a aparecer no Google Analytics após publicação (pode demorar 24–48h)
