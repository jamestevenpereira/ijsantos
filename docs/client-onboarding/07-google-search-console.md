# Google Search Console — Presença no Google

**Projeto:** [NOME DO PROJETO] — [NOME DO CLIENTE]

---

## O que é o Google Search Console?

O Google Search Console é uma ferramenta gratuita da Google que mostra como o site está a aparecer nos resultados de pesquisa do Google:

- Quantas vezes o site aparece quando alguém pesquisa no Google.
- Quantas pessoas clicam no site a partir do Google.
- Para que palavras e frases o site aparece.
- Quais as páginas que o Google conhece e indexou.
- Problemas técnicos que podem estar a prejudicar a visibilidade do site.
- Estado do sitemap e do rastreamento pelo Google.v

É uma ferramenta essencial para qualquer site que queira ter visibilidade nos resultados de pesquisa. E é totalmente gratuita.

---

## O que precisa de fazer

### Passo 1 — Aceder ao Google Search Console

1. Aceder a [search.google.com/search-console](https://search.google.com/search-console).
2. Fazer login com a conta Google da empresa (a mesma usada para o Google Analytics, se possível).

---

### Passo 2 — Adicionar propriedade de domínio

Existem dois tipos de propriedade no Search Console. Recomendamos **"Domain"** (Domínio), pois cobre automaticamente todos os subdomínios (`www`, `mail`, etc.) e ambos os protocolos (`http` e `https`):

1. Clicar em **"Add property"** ou **"Start now"**.
2. Selecionar o separador **"Domain"** (não "URL prefix").
3. Introduzir o domínio: `[DOMÍNIO]` — sem `www` nem `https://` (apenas o domínio limpo).
4. Clicar em **"Continue"**.

---

### Passo 3 — Verificar o domínio via DNS no Cloudflare

O Google precisa de confirmar que é o proprietário do domínio. Para isso, fornece um registo DNS que tem de ser adicionado no Cloudflare:

1. O Google irá mostrar um código de verificação no formato: `google-site-verification=XXXXXXXXXXXX`.
2. **Copiar este código completo** (incluindo `google-site-verification=`).
3. **Enviar este código ao programador** por email ou mensagem.
4. O programador irá adicionar este código como registo TXT no Cloudflare.
5. Após confirmar a adição, voltar ao Search Console e clicar em **"Verify"** (Verificar).
6. A verificação pode demorar alguns minutos.

> Se a verificação falhar na primeira tentativa, aguardar 10–15 minutos e tentar novamente — a propagação DNS pode demorar.

---

### Passo 4 — Adicionar o programador como proprietário ou utilizador

1. No Search Console, selecionar a propriedade `[DOMÍNIO]` na lista.
2. No menu lateral esquerdo, clicar em **"Settings"** (Configurações).
3. Clicar em **"Users and permissions"** (Utilizadores e permissões).
4. Clicar em **"Add User"** (Adicionar utilizador).
5. Introduzir o email do programador: `[EMAIL DO ADMIN]`
6. Selecionar o tipo de permissão:
   - **"Owner"** — acesso completo, incluindo gestão de utilizadores (recomendado para o programador).
   - **"Full"** — acesso a todos os dados, sem gerir utilizadores.
7. Clicar em **"Add"**.

---

## O que será feito por nós

Após verificar o domínio e receber acesso, o programador irá:

- Adicionar o registo TXT de verificação no Cloudflare (para o Passo 3 acima).
- Enviar o sitemap do site ao Google (ex.: `https://[DOMÍNIO]/sitemap.xml`) para acelerar a indexação.
- Verificar que as páginas principais estão a ser indexadas corretamente.
- Identificar e resolver eventuais problemas técnicos de indexação.
- Ligar o Search Console ao Google Analytics para dados combinados (recomendado).

---

## Ligação com o Google Analytics

Após ambos estarem configurados, o programador irá ligar o Search Console ao Google Analytics. Isto permite ver dados de pesquisa diretamente no Analytics — por exemplo, quais as palavras que trazem mais visitas ao site.

---

## Notas sobre timing

- Após a publicação do site, pode demorar alguns dias até o Google indexar as páginas.
- Os primeiros dados no Search Console podem demorar até **72 horas** a aparecer.
- O sitemap acelera este processo.

---

## Checklist final

- [ ] Google Search Console acedido com o email da empresa
- [ ] Propriedade de domínio `[DOMÍNIO]` adicionada (tipo "Domain", não "URL prefix")
- [ ] Código de verificação TXT copiado e enviado ao programador
- [ ] Registo TXT adicionado no Cloudflare pelo programador
- [ ] Domínio verificado com sucesso no Search Console
- [ ] `[EMAIL DO ADMIN]` adicionado como **Owner** ou **Full**
- [ ] Programador enviou o sitemap ao Google
- [ ] Search Console ligado ao Google Analytics pelo programador
- [ ] Primeiros dados a aparecer no Search Console (pode demorar alguns dias)
