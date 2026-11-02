# Acervo UX — Governança de pesquisa

![Acervo — Governança de pesquisa](docs/images/acervo.svg)

Plataforma de Alex Cerqueira para catalogar pesquisas de UX/UI, organizar evidências pelo contexto do negócio e gerar insights com apoio de IA.

[Acessar o sistema](https://acervo-ux-governanca.dr-alexcerqueira.chatgpt.site) — sujeito às permissões de acesso da instância no ChatGPT Sites.

## Problema e valor

Pesquisas espalhadas entre pastas, documentos e ferramentas dificultam localizar evidências, identificar responsáveis e reaproveitar conhecimento. O Acervo UX reúne metadados e conecta cada documento à hierarquia portfólio → cadeia de valor ou serviço → produto ou serviço.

O objetivo é reduzir o tempo de busca, evitar retrabalho e tornar decisões mais rastreáveis. Esses benefícios são objetivos do produto, não resultados já medidos. O tema visual é inspirado na B3; o projeto não deve ser apresentado como um produto oficial da empresa.

## Funcionalidades

- Login com perfis de gestão e analista.
- Visão geral, filtros e rede de conhecimento interativa em canvas.
- Catálogo e cadastro de documentos com responsável, data, natureza, formato, caminho e URL.
- Governança dos registros, status de revisão e contexto de negócio.
- Gestão de usuários e taxonomia com bloqueios de exclusão quando existem dependências.
- Ranking nominal de contribuição para gestão.
- Importação de CSV e identificação de consultas IQY.
- Insights: escolha de ferramenta, configuração, conciliação e seleção dos arquivos.
- Análise de personas, dores, necessidades e oportunidades com citações e cobertura documental.
- Exportação dos resultados da análise em JSON.

## Stack e estrutura

React 19, TypeScript, Vinext, Vite, Tailwind CSS 4, componentes Shadcn/Radix, Lucide, Cloudflare Workers e D1 (SQLite). A análise usa a OpenAI Responses API.

| Caminho | Responsabilidade |
| --- | --- |
| `app/page.tsx` | Tela principal, login, catálogo e navegação |
| `app/insights.tsx` | Origem dos dados e análise de evidências |
| `app/graph.tsx` | Rede de conhecimento |
| `app/settings.tsx` | Usuários e taxonomia |
| `app/surfaces.tsx` | Importação CSV e superfícies auxiliares |
| `app/api/` | Autenticação, registros, gestão, ranking e integrações |
| `lib/model.ts` | Modelo de registros, parser CSV e dados demonstrativos |
| `lib/server.ts` | Banco, sessões e validações |
| `lib/insights-validation.ts` | Pré-requisitos da análise e modelos da IA |
| `components/ui/` | Componentes de interface |
| `drizzle/` | Migrações SQL |
| `worker/`, `build/`, `vite.config.ts` | Runtime e build |
| `.openai/hosting.json` | Identidade do Site original e binding D1 |

Este é o código-fonte da versão hospedada. Não é a distribuição antiga com servidor Node/SQLite independente: o ambiente local simula Workers e D1 com Wrangler/Miniflare.

## Instalação local

Requisitos: Node.js 24 LTS recomendado (mínimo declarado: 22.13), pnpm 11.25.0, Git e internet para instalar dependências. Compatível com Windows, macOS e Linux. Execute os comandos na raiz do projeto após clonar ou extrair os arquivos.

```sh
# Instale o pnpm apenas se ainda não tiver a versão necessária.
npm install --global pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm run build
```

Preserve o `pnpm-lock.yaml`; não misture gerenciadores na instalação das dependências.

### Preparar o banco

Depois do primeiro build, aplique estas migrações, nesta ordem, uma única vez por banco local:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_dizzy_mother_askani.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_users.sql
```

A primeira migração cria tabelas e índices; não reaplique em um banco já inicializado. Preserve `.wrangler/state` para manter os dados locais.

### Rodar

```sh
pnpm start
```

Abra a URL exibida no terminal e mantenha-o aberto. Para desenvolvimento com atualização automática, use `pnpm dev` (porta 5173 por padrão no perfil portátil). Um clone limpo seleciona o perfil portátil automaticamente.

### Contas de demonstração

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Gestão | `gestao@acervo.demo` | `b3demo` |
| Analista | `analista@acervo.demo` | `b3demo` |

Usuários cadastrados em Configurações também usam a senha compartilhada `b3demo`. Trata-se de autenticação demonstrativa: antes de usar dados corporativos, implemente autenticação individual/SSO. O acesso privado do Sites é uma proteção separada do login interno.

## Como usar

1. Entre como gestão e confira a taxonomia em **Configurações**.
2. Cadastre documentos ou importe um CSV no catálogo, revisando o mapeamento.
3. Explore a visão geral, os filtros e a rede de conhecimento.
4. Em **Insights → Origens de dados**, selecione a ferramenta e informe os dados de conexão ou carregue um CSV.
5. Em **Conciliação**, selecione arquivos e confira o texto disponível.
6. Informe a pergunta, a chave OpenAI e o modelo. Autorize o envio e execute a análise.
7. Revise as citações e hipóteses antes de usá-las em decisões.

O stepper numerado permite retornar às etapas anteriores. A conciliação fica em memória enquanto a tela está aberta; recarregar a página ou sair dela exige carregar novamente os arquivos. Registros cadastrados no catálogo persistem no banco.

## Integrações

| Ferramenta | Implementação | Limites |
| --- | --- | --- |
| SharePoint | Identifica URL/lista/visão do IQY e recebe CSV exportado | Não atualiza IQY diretamente; exporte os registros no Excel |
| OneDrive | Microsoft Graph: token, drive e pasta opcional | Lista hierarquia e metadados; não extrai automaticamente PDF/Office |
| Confluence Cloud | URL `/wiki`, e-mail, token e espaços opcionais; páginas, anexos e links | Até cinco espaços e 40 chamadas; recupera texto das páginas |
| Notion | Token da integração, páginas e blocos acessíveis | Depende do compartilhamento das páginas; limites são sinalizados |
| Dovetail | CSV exportado | Sem API direta nesta versão |
| Airtable | Token, base, tabela e visualização opcional | Usa campos dos registros como texto |

OneDrive, Notion e Airtable possuem limites de paginação/chamadas; resultados parciais são identificados. O token Microsoft deve estar válido: não há aquisição/renovação automática por OAuth. Não há chamada ao Rovo nesta versão.

## CSV fictício de teste

`examples/catalogo-pesquisas-ux-50-documentos.csv` contém 50 documentos fictícios com conteúdo para testar Insights. Os links `example.com` são ilustrativos, sem arquivos reais associados.

- CSV UTF-8, até 2 MB e 200 registros por lote.
- Catálogo: mapear nome, responsável, data, natureza, portfólio, cadeia, produto e URL HTTPS.
- `kind` distingue Item/Pasta; `format` indica PDF, Word, Excel, Figma etc.
- Insights: incluir `name`, `path`, `url` e `content`, ou equivalentes reconhecidos como nome, caminho, conteúdo e resumo.
- Nome e URL sem texto não são suficientes para análise; adicione conteúdo fiel ao documento.

O importador do catálogo aplica seus padrões de status e não preserva automaticamente todas as colunas extras. O fluxo Insights é separado e lê a coluna textual para análise.

## IA e adesão

O seletor oferece `gpt-4.1-mini`, `gpt-4.1`, `gpt-4.1-nano` e `gpt-4o`. Disponibilidade depende da chave e do provedor. A análise aceita até 30 documentos e 120 mil caracteres. Documentos sem texto são excluídos do denominador.

A chave é enviada ao servidor na solicitação e não é persistida no banco. A chamada usa `store: false`, sem substituir os termos e políticas de retenção do provedor. O envio exige autorização no formulário.

O servidor confere a existência literal das citações no documento indicado e descarta insights sem citações válidas. A adesão é calculada pelo sistema:

```text
Adesão = documentos distintos com citações válidas para o insight
         ÷ documentos com texto analisados × 100
```

Esse percentual mede cobertura documental, não confiança estatística, prevalência entre participantes ou certeza da conclusão. A verificação literal não valida a interpretação semântica. Personas são hipóteses a revisar.

## Desenvolvimento e verificação

```sh
pnpm exec tsc --noEmit
pnpm run build
pnpm run lint
pnpm run db:generate
```

`db:generate` é usado para alterações de esquema, não para o primeiro uso. O pacote não configura um comando `test`. As integrações foram anteriormente verificadas com respostas simuladas; conexões autenticadas e análise com chave real precisam de validação no ambiente de destino. A exportação para GitHub não foi reinstalada do zero nesta entrega.

## Hospedagem, dados e segurança

GitHub armazena o código. Enviar este repositório não atualiza automaticamente o site e GitHub Pages não executa as APIs/banco desta aplicação. A hospedagem original é ChatGPT Sites; preserve `.openai/hosting.json` para continuar publicando nessa mesma instância.

Uma implantação independente na Cloudflare exige configuração própria de Worker, D1, migrações, domínio e acesso. Não existe workflow GitHub Actions de deploy neste pacote. Os detalhes herdados do starter estão em `docs/STARTER.md`.

Não versionar `node_modules`, `dist`, `.wrangler`, `.sites-runtime`, `.env`, tokens ou dados reais. Esta entrega contém código e demonstrações, sem registros, sessões e credenciais da instância hospedada.

O token do Confluence é salvo no banco pela implementação atual. Antes de uso corporativo, revise a proteção desse segredo, a senha compartilhada, a limitação de requisições e as permissões por documento. Clonar o código não reproduz as proteções de acesso da hospedagem original.

## Origem e licença

Exportação da versão 13, commit `059dbd5e67158aaeebb8f11162fd71999437d793`, com este README e CSV demonstrativo adicionados. Inclui `redirect: 'manual'` e bloqueio explícito de respostas 3xx, compatíveis com o runtime de borda.

Não foi atribuída licença de redistribuição ao código próprio. Preserve as licenças de terceiros em `vendor/` e `build/`.
