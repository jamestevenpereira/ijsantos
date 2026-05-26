# Google Tag Manager — Gestão de Scripts de Marketing

**Projeto:** [NOME DO PROJETO] — [NOME DO CLIENTE]

> **Este serviço é opcional.** Leia as indicações abaixo antes de decidir se faz sentido para o projeto.

---

## O que é o Google Tag Manager?

O Google Tag Manager (GTM) é uma ferramenta que permite instalar e gerir scripts de marketing e análise no site — sem precisar de alterar o código do site a cada vez.

Em vez de pedir ao programador para adicionar cada novo script manualmente, o GTM funciona como um "contentor" no site: um único código é instalado uma vez, e depois todos os outros scripts (pixels, trackers, etc.) são geridos a partir de um painel visual — sem programação.

---

## Quando faz sentido usar o GTM?

O GTM é útil quando há necessidade de gerir **vários scripts de marketing em simultâneo**, como:

- Google Analytics (GA4)
- Google Ads — tracking de conversões de campanhas pagas
- Meta Pixel (Facebook/Instagram Ads)
- Microsoft Clarity ou Hotjar — mapas de calor e gravações de sessão
- LinkedIn Insight Tag
- TikTok Pixel
- Chat online (ex.: Intercom, Tidio, Crisp)
- Outros pixels ou trackers de terceiros

**O GTM é especialmente útil quando:**

- O cliente ou a agência de marketing quer poder adicionar/remover scripts sem depender do programador.
- Há previsão de múltiplas campanhas em várias plataformas.
- O projeto vai crescer e a lista de integrações de marketing tende a aumentar.

---

## Quando NÃO é necessário?

O GTM pode ser dispensado quando:

- O site usa apenas Google Analytics, instalado diretamente no código.
- Não há campanhas pagas em múltiplas plataformas.
- O cliente prefere uma solução mais simples e direta.
- O projeto é uma landing page simples ou site institucional sem marketing avançado.

> Para a maioria dos sites institucionais e landing pages simples, o GTM **não é necessário**. O Google Analytics e eventuais pixels podem ser instalados diretamente no código pelo programador.

---

## Exemplo prático

**Sem GTM:**
Para adicionar o Meta Pixel ao site → o programador precisa de atualizar o código, fazer deploy e publicar. Demora horas ou dias.

**Com GTM:**
Para adicionar o Meta Pixel ao site → qualquer pessoa com acesso ao GTM pode adicioná-lo em 5 minutos, sem tocar no código.

---

## O que precisa de fazer (se decidir usar GTM)

### Passo 1 — Criar conta e contentor GTM

1. Aceder a [tagmanager.google.com](https://tagmanager.google.com).
2. Fazer login com a conta Google da empresa.
3. Clicar em **"Create Account"** (Criar conta).
4. Em **"Account Name"**: introduzir o nome da empresa — `[NOME DO CLIENTE]`.
5. Em **"Country"**: selecionar **"Portugal"**.
6. Em **"Container Name"**: introduzir o domínio — `[DOMÍNIO]`.
7. Em **"Target platform"**: selecionar **"Web"**.
8. Clicar em **"Create"** e aceitar os Termos de Serviço.
9. Será gerado um **GTM ID** no formato `GTM-XXXXXXX`.
10. **Copiar o GTM ID e enviá-lo ao programador**.

---

### Passo 2 — Adicionar o programador como administrador

1. No GTM, clicar em **"Admin"** no menu superior.
2. Na secção **"Account"**, clicar em **"User Management"**.
3. Clicar no botão **"+"** para adicionar utilizador.
4. Introduzir o email do programador: `[EMAIL DO ADMIN]`
5. Selecionar permissão de **"Administrator"** para a conta, e **"Publish"** para o contentor.
6. Clicar em **"Add"** ou **"Invite"**.

---

## O que será feito por nós (se GTM for usado)

- Instalar o código GTM no site.
- Migrar scripts existentes (GA4, etc.) para dentro do GTM.
- Configurar eventos e conversões personalizados, se necessário.
- Documentar os tags instalados para referência futura.

---

## Checklist (se aplicável)

- [ ] Decisão tomada: usar GTM ou instalar scripts diretamente
- [ ] Conta GTM criada com o email da empresa (se aplicável)
- [ ] Contentor criado para `[DOMÍNIO]`
- [ ] GTM ID (`GTM-XXXXXXX`) enviado ao programador
- [ ] `[EMAIL DO ADMIN]` adicionado como Administrator/Publisher
- [ ] GTM instalado no site pelo programador
- [ ] Scripts/pixels migrados para o GTM
