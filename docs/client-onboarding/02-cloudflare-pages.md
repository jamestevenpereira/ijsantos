# Cloudflare Pages — Alojamento do Site

**Projeto:** [NOME DO PROJETO] — [NOME DO CLIENTE]

> **Pré-requisito:** A conta Cloudflare e o domínio devem estar configurados antes deste passo. Consulte [01-cloudflare.md](01-cloudflare.md).

---

## O que é o Cloudflare Pages?

O Cloudflare Pages é o serviço onde o site fica publicado online. É gratuito, rápido e seguro.

Funciona assim: sempre que o programador faz uma atualização ao site (uma nova página, uma correção, um novo conteúdo), o Cloudflare Pages publica automaticamente a versão mais recente — sem intervenção do cliente e sem tempo de inatividade.

---

## Quem faz o quê

### O que será feito por nós

Todo o processo técnico é da responsabilidade do programador:

- Ligar o repositório de código (GitHub, da conta do programador) à conta Cloudflare do cliente.
- Criar o projeto no Cloudflare Pages.
- Configurar o processo de publicação automática.
- Ligar o domínio `[DOMÍNIO]` ao site publicado.
- Ativar HTTPS automático.
- Configurar variáveis de ambiente (chaves de API, configurações internas), se necessário.
- Gerir todos os deploys e atualizações futuras.

> **Nota:** O GitHub (repositório de código) é da conta do programador — o cliente não precisa de criar conta no GitHub nem ter acesso a ele.

### O que o cliente precisa de fazer

- **Garantir que o acesso à conta Cloudflare está ativo** (ver [01-cloudflare.md](01-cloudflare.md)).
- **Rever e aprovar o site** quando for apresentado para revisão antes da publicação final.

Não é necessário instalar nada, criar repositórios ou perceber de código.

---

## Como funciona o processo de publicação

```
Programador faz alteração ao código
        ↓
Código é enviado para o GitHub (conta do programador)
        ↓
Cloudflare Pages deteta a atualização automaticamente
        ↓
Site é compilado e publicado em segundos
        ↓
Cliente acede a https://[DOMÍNIO] e vê o site atualizado
```

---

## Domínio, SSL e segurança

| O que | Como funciona |
|---|---|
| Domínio | `[DOMÍNIO]` ligado ao site publicado |
| HTTPS | Certificado SSL ativado automático e gratuito |
| `www.[DOMÍNIO]` | Redirecionado para `[DOMÍNIO]` pelo programador |
| Atualizações | Publicadas automaticamente sem tempo de inatividade |

---

## Ambientes de pré-visualização

O Cloudflare Pages suporta ambientes de pré-visualização (preview deployments): o programador pode publicar versões de teste do site num endereço temporário (ex.: `projeto.pages.dev`) para o cliente rever antes de publicar na versão final. Isto permite aprovar alterações antes de ficarem visíveis para os visitantes.

---

## Notas sobre custos

- O Cloudflare Pages é **gratuito** para a maioria dos projetos.
- Plano gratuito: deploys ilimitados, largura de banda ilimitada, 1 build simultâneo.
- Para projetos com necessidades muito específicas (builds muito frequentes, etc.), pode ser necessário um plano pago. O programador informará se tal acontecer.

---

## Checklist final

- [ ] Conta Cloudflare configurada e programador com acesso (ver [01-cloudflare.md](01-cloudflare.md))
- [ ] Programador configurou o projeto no Cloudflare Pages
- [ ] Domínio `[DOMÍNIO]` ligado ao site
- [ ] HTTPS ativo (cadeado visível no browser)
- [ ] Site acessível em `https://[DOMÍNIO]`
- [ ] `https://www.[DOMÍNIO]` redireciona corretamente
- [ ] Cliente reviu e aprovou o site antes da publicação final
