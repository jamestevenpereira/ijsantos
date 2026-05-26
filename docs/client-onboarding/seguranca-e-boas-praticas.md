# Segurança e Boas Práticas

**Projeto:** [NOME DO PROJETO] — [NOME DO CLIENTE]

---

## Porquê é que isto é importante?

As contas criadas para o projeto (Cloudflare, Resend, Supabase, etc.) guardam informações sensíveis: configurações do site, dados de utilizadores, dados de faturação e acesso ao domínio da empresa. Uma conta comprometida pode significar desde o site fora de ar até à perda de dados de clientes.

Este documento define práticas simples que protegem o projeto sem complicar o dia-a-dia.

---

## Princípio base — A propriedade é sempre sua

Todas as contas criadas para o projeto ficam em nome e sob controlo do cliente. O programador é adicionado como administrador para executar o trabalho técnico — mas a propriedade das contas, dos dados e do domínio é sempre do cliente.

**Isto significa:**

- O programador nunca é o proprietário principal de nenhuma conta do projeto.
- O cliente pode remover o acesso do programador a qualquer momento.
- Em caso de término da colaboração, os acessos são removidos sem perda de dados ou controlo.
- A faturação de qualquer serviço pago está sempre associada ao cartão do cliente.

---

## Regras de segurança

### 1. Nunca partilhe passwords

- Nunca envie passwords por email, WhatsApp, SMS ou qualquer mensagem.
- O acesso do programador é feito **exclusivamente por convite** — o programador recebe um email de convite, aceita, e fica com acesso. Nunca precisa da password.
- Se receber um pedido de password por mensagem, recuse e confirme com o programador por telefone.

### 2. Use passwords únicas e seguras

- Use uma password diferente para cada conta — nunca repita passwords.
- Uma boa password tem pelo menos **12 caracteres** e inclui letras maiúsculas, minúsculas, números e símbolos (ex.: `P@ssw0rd!2025` — mas nunca use este exemplo específico).
- Recomendamos o uso de um gestor de passwords:
  - **Bitwarden** — gratuito e open-source.
  - **1Password** — pago, muito completo.
  - Gestor integrado no browser (Chrome, Safari, Firefox) — simples e gratuito.

### 3. Ative a autenticação em dois fatores (2FA)

A autenticação em dois fatores exige um segundo passo de verificação além da password — geralmente um código temporário gerado por uma app no telemóvel. Mesmo que a password seja descoberta, sem o segundo fator não é possível aceder à conta.

**Como ativar em cada plataforma:**

| Plataforma | Como ativar 2FA |
|---|---|
| Cloudflare | Meu Perfil → Autenticação → Autenticação de dois fatores |
| Google (Analytics, Search Console, GTM) | Conta Google → Segurança → Verificação em dois passos |
| Resend | Account Settings → Security → Enable 2FA |
| Supabase | Account Settings → Security → Enable MFA |
| Meta Business | Facebook → Definições → Segurança e login → 2FA |

**App recomendada para 2FA:** Google Authenticator, Microsoft Authenticator ou Authy.

### 4. O acesso é sempre por convite — nunca por partilha de credenciais

Em todas as plataformas usadas neste projeto, o acesso do programador é feito através de convites por email:

1. O cliente adiciona o email do programador na plataforma.
2. A plataforma envia um convite ao programador.
3. O programador aceita o convite e fica com acesso com as permissões definidas.

Não há partilha de passwords, não há acesso à conta pessoal, não há riscos desnecessários.

### 5. Permissões mínimas necessárias

O programador é adicionado como **Administrador** na maioria das plataformas — isto é necessário para configurar corretamente os serviços técnicos. No entanto:

- As permissões podem ser **reduzidas após a configuração** estar concluída, se o cliente preferir.
- Para plataformas com dados sensíveis (ex.: Supabase com dados de clientes), o nível de acesso pode ser ajustado em conjunto.
- Nunca é necessário dar acesso à conta pessoal ou a serviços não relacionados com o projeto.

### 6. Guarde as credenciais em local seguro

Para cada conta criada, guarde num local seguro e privado:

- Email usado no registo.
- Password.
- Códigos de recuperação de 2FA (normalmente fornecidos no momento de ativação).
- Password da base de dados (Supabase), se aplicável.

Sugestão: criar um documento no Google Drive com acesso restrito apenas ao cliente, ou usar um gestor de passwords.

---

## Após o projeto — Gestão de acessos

### Manutenção contínua (se houver)

Se a colaboração continuar com manutenção do site, os acessos do programador são mantidos conforme necessário.

### Término da colaboração

Se a relação de trabalho terminar, o cliente deve:

1. Aceder a cada plataforma (Cloudflare, Resend, Supabase, Google Analytics, etc.).
2. Ir às definições de membros/utilizadores.
3. Remover o email do programador (`[EMAIL DO ADMIN]`).

O programador irá confirmar a remoção e garantir que toda a documentação técnica é entregue ao cliente.

### Transferência para outro programador

Se o cliente mudar de programador:

1. Remover o acesso do programador atual.
2. Adicionar o novo programador com as mesmas permissões.
3. Solicitar ao programador atual a documentação técnica do projeto (arquitetura, variáveis de ambiente, etc.).

---

## Resumo das boas práticas

| Prática | Porquê |
|---|---|
| Passwords únicas por conta | Evita que uma conta comprometida afete todas as outras |
| 2FA em todas as contas | Proteção mesmo que a password seja descoberta |
| Acesso por convite, nunca por password | Sem partilha de credenciais sensíveis |
| Credenciais em local seguro | Evita perder acesso às próprias contas |
| Propriedade sempre do cliente | Controlo total, independente do programador |
| Remover acessos no fim da colaboração | Boa higiene de segurança |

---

## Checklist de segurança geral

- [ ] Passwords únicas e seguras em todas as contas
- [ ] 2FA ativado no Cloudflare
- [ ] 2FA ativado na conta Google
- [ ] 2FA ativado no Resend
- [ ] 2FA ativado no Supabase (se aplicável)
- [ ] 2FA ativado no Meta Business (se aplicável)
- [ ] Acesso do programador feito por convite (sem partilha de passwords)
- [ ] Credenciais guardadas em local seguro pelo cliente
- [ ] Plano definido para remoção de acessos no fim da colaboração
- [ ] Faturação de serviços pagos associada ao cartão do cliente
