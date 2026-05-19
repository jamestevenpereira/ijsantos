# Solicitação ao Cliente: Materiais, Conteúdo e Acessos

> **Documento para partilhar com o cliente.** Inclui tudo o que precisamos para colocar o site no ar: materiais, conteúdo, e como criar e partilhar os acessos às plataformas necessárias.

---

## 1) Materiais Obrigatórios

### 1.1 Fotos institucionais
- Fotos profissionais dos Co-Founders (ideal: 3 a 6 fotos por pessoa, fundo neutro ou ambiente de trabalho).
- Foto de equipa (se houver).
- Logotipo em alta qualidade (`.svg` preferencial, ou `.png` com fundo transparente, resolução mínima 800×800 px).

### 1.2 Fotos de obras e serviços
- Fotos reais de obras concluídas e em andamento.
- Fotos "antes e depois" (se disponíveis).
- Fotos organizadas por tipo de serviço (ex.: construção, remodelação, limpezas exteriores, etc.).
- Mínimo recomendado: 15 a 20 fotos de obras de boa qualidade (iluminação natural, sem objetos a obstruir).

### 1.3 Conteúdo comercial
- Descrição curta da empresa (2 a 4 frases — o que fazem, onde e para quem).
- Lista completa dos serviços prestados.
- Diferenciais / porque nos escolher (ex.: "X anos de experiência", "equipa certificada", etc.).
- Zonas geográficas de atuação.
- Contactos finais para publicação: telefone, email, morada, horários de atendimento.
- Link para redes sociais oficiais (Instagram, Facebook, LinkedIn, etc.).

---

## 2) Materiais Recomendados (opcional, mas muito valorizado)

- Depoimentos/testemunhos de clientes: nome, localidade e texto (necessita autorização para publicação).
- Certificações, licenças, prémios ou selos de confiança (ex.: alvará de construção).
- Perguntas frequentes (FAQ) que recebem com regularidade por WhatsApp/telefone.

---

## 3) Aprovação de Direitos de Imagem

Antes de publicar, precisamos de confirmação escrita (mensagem ou email) para:

- As fotos enviadas podem ser publicadas no website.
- As pessoas identificáveis nas fotos autorizaram a sua publicação.
- O cliente aprova o uso de imagens geradas por IA nas secções ilustrativas.

**Nota sobre imagens geradas por IA:** Para secções do site que não exigem fotos reais do cliente (ex.: ícones, ilustrações de fundo, imagens de contexto), vamos usar imagens geradas por inteligência artificial com licença de uso comercial livre — sem riscos de direitos de autor.

---

## 4) Infraestrutura Proposta (Custo 0 EUR no arranque)

| Serviço | Plataforma | Para que serve | Custo |
|---|---|---|---|
| Hospedagem do site | Cloudflare Pages | Publicar o site online | Gratuito |
| Armazenamento de imagens | Cloudflare R2 | Guardar fotos e ficheiros do site | Gratuito até 10 GB/mês |
| CDN e performance | Cloudflare | Velocidade e segurança global | Gratuito |
| Envio de emails | Resend | Formulário de contacto e notificações | Gratuito até 3.000 emails/mês |
| Domínio | A definir | Endereço do site (ex.: www.empresa.pt) | Custo variável (~10–15 EUR/ano) |

---

## 5) Criação de Contas e Acessos — Passo a Passo para o Cliente

O cliente não precisa de saber configurar nada tecnicamente. Basta **criar as contas** e **adicionar o programador como membro**. Depois, toda a configuração técnica é feita pelo nosso lado.

O email do programador a adicionar em todas as plataformas é:
**`jamestevenpereira@gmail.com`**

---

### 5.1 Conta Cloudflare

O Cloudflare vai servir para hospedar o site (Cloudflare Pages) e guardar as imagens (Cloudflare R2).

**Passo 1 — Criar conta:**
1. Aceder a [cloudflare.com](https://cloudflare.com) e clicar em **"Sign Up"**.
2. Introduzir o email da empresa e uma password segura.
3. Confirmar o email através do link que será enviado para a caixa de entrada.

**Passo 2 — Adicionar o programador como membro:**
1. Fazer login na conta Cloudflare.
2. No canto superior direito, clicar no ícone do utilizador → **"Manage Account"**.
3. No menu lateral, clicar em **"Members"**.
4. Clicar no botão **"Invite Member"**.
5. Introduzir o email: `jamestevenpereira@gmail.com`
6. Em **Role**, selecionar **"Administrator"**.
7. Clicar em **"Send Invitation"**.

O programador irá aceitar o convite e poderá então configurar tudo (Pages, R2, DNS).

---

### 5.2 Conta Resend

O Resend é utilizado para enviar os emails do formulário de contacto do site (ex.: quando um visitante preenche o formulário, o cliente recebe o email).

**Passo 1 — Criar conta:**
1. Aceder a [resend.com](https://resend.com) e clicar em **"Sign Up"**.
2. Pode usar o email da empresa ou criar conta via Google (opção disponível).
3. Confirmar o email se pedido.

**Passo 2 — Adicionar o programador à conta:**
1. Fazer login no Resend.
2. No menu lateral esquerdo, clicar em **"Team"** (ou "Settings" → "Team").
3. Clicar em **"Invite Member"**.
4. Introduzir o email: `jamestevenpereira@gmail.com`
5. Selecionar o role **"Admin"** ou **"Full Access"**.
6. Clicar em **"Send Invite"**.

O programador irá aceitar o convite e configurar o domínio de envio de emails.

---

### 5.3 Domínio (DNS)

Se o cliente já tem um domínio (ex.: comprado no GoDaddy, SAPO, OVH, etc.):

- Precisamos de **acesso ao painel de gestão de DNS** do domínio, ou
- Que o cliente nos forneça as **credenciais de login** do registar de domínio (temporariamente), ou
- Que o domínio seja **transferido para o Cloudflare Registrar** (simplifica tudo e fica mais barato a renovar).

Se o cliente ainda não tem domínio:
- Recomendamos comprar diretamente no **Cloudflare Registrar** (sem markup, preço de custo).
- Criamos nós o domínio depois de ter o acesso à conta Cloudflare.

---

### 5.4 Email profissional (opcional)

Se o cliente quiser ter email com domínio próprio (ex.: `geral@empresa.pt`), recomendamos:

- **Cloudflare Email Routing** (gratuito) — redireciona emails do domínio para o Gmail ou outro email pessoal.
- **Zoho Mail** (gratuito até 5 utilizadores) — caixa de entrada profissional completa.

Informar se é uma necessidade para incluirmos no projeto.

---

## 6) Resumo do que o Cliente Precisa de Fazer

| # | Ação | Urgência |
|---|---|---|
| 1 | Enviar fotos dos Co-Founders | Alta |
| 2 | Enviar fotos de obras (mínimo 15) | Alta |
| 3 | Confirmar/enviar conteúdo comercial (serviços, contactos, etc.) | Alta |
| 4 | Criar conta no Cloudflare e adicionar `jamestevenpereira@gmail.com` como Administrator | Alta |
| 5 | Criar conta no Resend e adicionar `jamestevenpereira@gmail.com` como Admin | Alta |
| 6 | Fornecer acesso ao DNS do domínio (ou confirmar que não tem domínio ainda) | Alta |
| 7 | Confirmar autorização de publicação das imagens | Alta |
| 8 | Enviar depoimentos de clientes (se disponíveis) | Média |
| 9 | Confirmar se precisa de email profissional (`nome@empresa.pt`) | Média |

---

## 7) Prazo Recomendado

Pedir envio de todos os materiais e acessos até **[inserir data]** para não atrasar o lançamento do site.

---

## 8) Mensagem Pronta para Enviar ao Cliente

> Olá,
>
> Para avançarmos com a fase final do vosso site, precisamos de alguns materiais e acessos da vossa parte.
>
> **Materiais necessários:**
> - Fotos profissionais dos Co-Founders (3–6 por pessoa)
> - Fotos de obras realizadas (mínimo 15)
> - Informação comercial: serviços, diferenciais, contactos finais, redes sociais
>
> **Plataformas onde precisamos que criem conta e nos adicionem:**
> 1. **Cloudflare** (cloudflare.com) — hospedagem e imagens do site
> 2. **Resend** (resend.com) — envio de emails do formulário de contacto
>
> Em ambas as plataformas, após criarem a conta, devem adicionar `jamestevenpereira@gmail.com` como Administrador — as instruções detalhadas estão no documento que partilhámos.
>
> Toda a configuração técnica fica do nosso lado. O custo inicial de alojamento é **0 EUR**.
>
> Aguardamos os materiais até [inserir data] para cumprirmos o prazo de lançamento.
>
> Qualquer dúvida, estamos disponíveis.
