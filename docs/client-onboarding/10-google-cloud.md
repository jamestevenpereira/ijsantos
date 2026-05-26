# Google Cloud — Serviços Cloud Avançados

**Projeto:** [NOME DO PROJETO] — [NOME DO CLIENTE]

> **Normalmente não é necessário** para sites institucionais, landing pages ou projetos standard. Consulte as indicações abaixo para perceber se o seu projeto precisa do Google Cloud.

---

## O que é o Google Cloud?

O Google Cloud (GCP — Google Cloud Platform) é a infraestrutura cloud da Google. Ao contrário do Google Analytics ou do Google Search Console, o Google Cloud é uma plataforma técnica avançada destinada a projetos com necessidades específicas que vão além de um site standard.

Pense no Google Cloud como o "back-office técnico" da Google — onde vivem APIs avançadas, processamento de dados, inteligência artificial e serviços de infraestrutura.

---

## Quando é necessário?

O Google Cloud pode ser necessário em projetos que usam:

| Serviço | Para quê |
|---|---|
| **Google Maps API** | Mapa interativo no site com marcadores, rotas ou pesquisa de moradas |
| **Places API** | Autocompletar moradas, pesquisa de locais |
| **OAuth / Login com Google** | Botão "Entrar com a sua conta Google" na aplicação |
| **Cloud Functions** | Código que corre na cloud da Google em resposta a eventos |
| **Google Cloud Storage** | Armazenamento avançado de ficheiros e media |
| **Vision API** | Reconhecimento de imagens ou texto em fotos |
| **Translate API** | Tradução automática de conteúdo |
| **BigQuery** | Análise avançada de grandes volumes de dados |

---

## Quando NÃO é necessário?

Para a grande maioria dos projetos, o Google Cloud não é necessário:

| Tipo de projeto | Precisa de Google Cloud? |
|---|---|
| Site institucional | Não |
| Landing page | Não |
| Site com formulário de contacto | Não |
| Projeto com Supabase como backend | Normalmente não |
| E-commerce simples | Normalmente não |
| Blog ou portfolio | Não |
| Site com Google Analytics e Search Console | Não — estes têm as próprias consolas gratuitas |

> **Em caso de dúvida:** Se o programador não mencionou o Google Cloud como necessário, provavelmente não é necessário para o projeto.

---

## Nota sobre custos

Ao contrário de muitas ferramentas da Google (Analytics, Search Console, GTM), o Google Cloud **não é gratuito** na maioria dos serviços. Funciona com um modelo **pay-as-you-go** (paga pelo que usa), com um crédito inicial gratuito de $300 para novos utilizadores.

Se o projeto precisar do Google Cloud, o programador irá:

- Especificar exatamente o que precisa de ser configurado.
- Estimar os custos mensais antes de ativar qualquer serviço.
- Configurar alertas de orçamento para evitar surpresas na faturação.

---

## Se o projeto precisar do Google Cloud

O programador irá fornecer um guia específico conforme as APIs ou serviços necessários. A configuração base é:

1. Aceder a [console.cloud.google.com](https://console.cloud.google.com).
2. Fazer login com a conta Google da empresa.
3. Criar um projeto.
4. Ativar as APIs necessárias.
5. Configurar dados de faturação.
6. Adicionar o programador com as permissões adequadas.

---

## Estado neste projeto

> **[Este projeto [precisa / não precisa] de Google Cloud.]**
>
> [Se precisar — inserir aqui: APIs necessárias, estimativa de custo e próximos passos.]

---

## Checklist (apenas se aplicável)

- [ ] Confirmação do programador de que o Google Cloud é necessário
- [ ] APIs identificadas e custo estimado aprovado pelo cliente
- [ ] Conta Google Cloud criada com o email da empresa
- [ ] Projeto criado no Google Cloud
- [ ] Dados de faturação configurados (cartão do cliente)
- [ ] Alerta de orçamento ativado
- [ ] `[EMAIL DO ADMIN]` adicionado com permissões adequadas
- [ ] APIs necessárias ativadas pelo programador
