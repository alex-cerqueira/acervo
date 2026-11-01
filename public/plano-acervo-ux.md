# Acervo UX — plano do sistema de governança

Versão de planejamento: 11/09/2026. Proposta de piloto; taxonomia e metas ainda precisam ser validadas pela equipe. Tema visual inspirado no azul B3 (#002C63), com azul de interação #0063DE e superfícies brancas.

## 1. Problema e proposta de valor

Arquivos de UX Research e UI se acumulam em pastas e ferramentas sem uma visão confiável de responsáveis, atualização, cobertura por produto e vínculo com o negócio. Isso aumenta o tempo de busca, dificulta reutilizar estudos e provoca repetição de trabalho.

O Acervo UX centraliza **metadados e referências**, mantendo arquivos e permissões nos repositórios originais. O valor esperado é reduzir esforço de localização e retrabalho, preservar memória de pesquisa e aumentar o uso de evidências nas decisões. A classificação do arquivo não comprova sua qualidade; a revisão humana continua necessária.

Públicos: analistas, responsáveis pelos documentos e gestão de Design/ResearchOps. Unidade principal de informação: registro de item ou pasta, identificado por ID local e referência à origem.

## 2. Escopo do MVP entregue

- Tela de login com contas compartilhadas de demonstração e sessões no servidor.
- Dois perfis autorizados no servidor: gestão e analista.
- Banco persistente de registros; catálogo pesquisável e filtros por portfólio, formato, status e registros de demonstração/cadastrados.
- Dashboard de itens ativos, pastas, diversidade de formatos, portfólios e pendências.
- Hierarquia navegável portfólio → cadeia → produto/serviço → documentos.
- Cadastro e edição de metadados e URL HTTPS. Não há cópia ou upload do conteúdo dos documentos.
- Fila de registros sem responsável, classificação incompleta, em revisão ou modificados há mais de 180 dias.
- Ranking nominal exclusivo de gestão, com filtro por mês de cadastro, quantidade registrada e validada.
- Leitura de definição .iqy (host, URL, lista e visão), sem executar a URL remota.
- Importação CSV com mapeamento de campos, validação, conferência e deduplicação por URL; até 200 registros por lote e 2 MB por arquivo.
- Exportação CSV com proteção para fórmulas em células exportadas.
- Adaptador Confluence Cloud no servidor preparado para credenciais; consulta real ainda não validada no ambiente do usuário.
- Plano de descoberta via Rovo e roteiro exportável; cliente MCP/OAuth ainda não implementado.

Dados de exemplo são identificados como demonstração. A taxonomia exemplificada (Listado, Balcão, Infraestrutura etc.) não constitui uma taxonomia oficial da B3.

## 3. Modelo de dados

| Grupo | Campos | Regra |
|---|---|---|
| Identificação | ID local, nome, natureza, formato | Natureza: Item/Pasta. Formato: PowerPoint, Word, Excel, Figma, PDF, Link, Imagem, Vídeo, Outros. Pasta tem formato Pasta. |
| Origem | URL, provedor, ID na origem, caminho original | URL HTTPS sem credenciais; ID da origem quando disponível. |
| Responsabilidade | responsável pelo conteúdo, registrador, data de cadastro | Registrador definido pela sessão; não assumir que o último editor é o responsável. |
| Temporalidade | modificação na origem, criação no catálogo, auditoria | Datas da origem preservadas, alterações do catálogo auditadas separadamente. |
| Negócio | portfólio, tipo de cadeia, cadeia, tipo de entrega, produto/serviço | Tipo de cadeia: valor/serviço. Tipo de entrega: Produto/Serviço. |
| Pesquisa | método, resumo, valor para o negócio | Campos complementares para encontrabilidade. |
| Governança | status, classificação | Em revisão, Validado, Pendente, Arquivado. Classificação é rótulo; não muda permissões na origem. |

Quantidades são derivadas dos registros. Pastas não contam como arquivos. Formatos são a contagem distinta de formatos de itens ativos. Registros arquivados não entram no dashboard de ativos nem no ranking. A árvore pode exibir arquivados para manter rastreabilidade. No piloto, o total de arquivos inclui links catalogados; apresentar essa definição aos usuários.

**Extensão corporativa recomendada:** entidades normalizadas de usuários, portfólios, cadeias, produtos/serviços, documentos, origens, revisões, usos de evidências, execuções de sincronização e candidatos de conciliação. Manter IDs estáveis, versionar a taxonomia e registrar realocações de documentos.

## 4. Perfis e autorização

| Ação | Analista | Gestão |
|---|---|---|
| Consultar catálogo, hierarquia e governança | Sim | Sim |
| Cadastrar documento | Sim, entra em revisão | Sim |
| Editar registro | Apenas cadastro próprio | Todos |
| Validar/arquivar | Não | Sim |
| Importação em lote e consulta a fontes | Não | Sim |
| Ranking nominal e autoria do cadastro | Não | Sim |

A API verifica a sessão e o perfil; ocultar controles não é o único mecanismo de autorização. A atribuição de responsável não transfere automaticamente a propriedade do cadastro.

A demonstração usa `gestao@acervo.demo` e `analista@acervo.demo`, ambos com senha de teste `AcervoDemo2026!`. Não são contas corporativas. As sessões têm duração de oito horas, cookie HttpOnly/Secure/SameSite e token aleatório armazenado no banco. Não inserir conteúdo corporativo sensível na demonstração.

**Antes de produção:** SSO corporativo (ex.: Entra ID), contas individuais, concessão de perfis por administração, rate limiting de autenticação, política de sessão, autorização por portfólio/documento, retenção, backup/restauração e revisão de segurança. A classificação Restrito do MVP é apenas um rótulo e não restringe a visibilidade dentro do catálogo.

## 5. Fluxo de cadastro e curadoria

1. Analista informa nome, responsável, natureza, formato, URL, modificação e contexto de negócio.
2. Sistema valida campos e consulta a URL normalizada para evitar duplicação.
3. Registro recebe autoria da sessão, data de cadastro e status Em revisão.
4. Gestão verifica consistência de hierarquia, relevância do resumo e responsável.
5. Registro passa a Validado ou Pendente; a origem permanece inalterada.
6. Rotina semanal revisa pendências. Arquivos com modificação antiga recebem sinal de revisão, não julgamento automático de obsolescência.
7. Arquivamento lógico mantém histórico e referência original.

No MVP, um documento antigo pode continuar sinalizado mesmo após revisar seus metadados. Para produção, incluir `reviewed_at`, `review_due_at`, motivo e responsável pela revisão, sem alterar artificialmente a data de modificação na origem.

Cadência proposta: analista cadastra ao finalizar cada estudo; responsável revisa relevância; gestão tria semanalmente, mantém taxonomia mensalmente e avalia valor trimestralmente. Definir SLA de revisão no piloto.

## 6. .iqy e repositório Microsoft

O arquivo .iqy descreve uma consulta web; não contém necessariamente os registros. No fluxo atual, o sistema lê a definição, identifica a origem e permite importar os dados exportados pelo Excel como CSV UTF-8. O arquivo de consulta não é executado automaticamente, nem fornece por si só autorização para acesso.

Procedimento do piloto:

1. Carregar um .iqy real e validar host, lista e visão.
2. Abrir a consulta no Excel autenticado, atualizar e salvar o resultado em CSV UTF-8.
3. Mapear nomes de colunas para os campos do catálogo, conferir e importar.
4. Separar caminho físico da taxonomia. A posição das pastas não é assumida automaticamente: portfólio, cadeia e produto devem ser confirmados em colunas ou por uma regra de mapeamento acordada.
5. Confirmar semântica de responsável, autor e modificado por. A aplicação não pode inferir responsabilidade de negócio com confiança apenas a partir do último editor.

Evolução: aplicativo registrado no Entra, escopos mínimos aprovados, leitura Microsoft Graph ou SharePoint REST conforme origem, paginação, delta/checkpoints, tarefas em segundo plano, renovação de credenciais e tratamento de exclusões/renomeações. A query deve ser tratada como configuração de origem, não como um banco de dados. As credenciais nunca devem ficar no CSV, no IQY, no Git ou no navegador.

## 7. Confluence e Rovo

### Conciliação determinística implementada

Preparar no servidor as variáveis:

- `CONFLUENCE_HOST`: origem HTTPS, por exemplo https://empresa.atlassian.net.
- `CONFLUENCE_EMAIL`: conta técnica autorizada.
- `CONFLUENCE_TOKEN`: segredo da conta para autenticação Basic de piloto; manter fora do código.
- `CONFLUENCE_SPACE_IDS`: de 1 a 5 IDs numéricos de espaços, separados por vírgula.

A consulta usa páginas por espaço (`/wiki/api/v2/spaces/{id}/pages`) e anexos por página (`/wiki/api/v2/pages/{id}/attachments`), segue paginação e extrai referências HTTPS de Figma e SharePoint do corpo storage das páginas. Compara origem+ID ou URL normalizada. Nome semelhante, sozinho, não é correspondência segura.

Cada execução é limitada a 40 chamadas remotas, com timeout de 12 segundos por chamada. Se houver erro, paginação restante ou limite, o retorno indica cobertura parcial. Os resultados são **candidatos não encontrados no catálogo**, nunca uma afirmação de inexistência. A cobertura é somente dos conteúdos acessíveis à conta, nos espaços selecionados e tipos suportados. Não inclui automaticamente blogs, whiteboards, databases ou links escondidos em macros especiais. Não há execução periódica nem retomada automática nesta versão.

Os candidatos passam por preenchimento de responsável e hierarquia antes de cadastrar. Nenhuma página ou anexo é alterado na origem. Permissões e proprietário desconhecidos não são inventados. URLs equivalentes em formatos diferentes podem gerar candidatos adicionais e exigem revisão.

**Evolução para escala:** jobs duráveis com checkpoints, retentativas exponenciais para 429/5xx, respeito a Retry-After, registro de escopo/horário, deduplicação também por IDs estáveis, normalização específica de provedores, varredura incremental, expansão de tipos e revisão humana de divergências. Preferir OAuth 2.0 para integração corporativa multiusuário.

### Descoberta via Rovo — planejada

Integrar o servidor do aplicativo ao Atlassian Rovo MCP com OAuth e consentimento. Usar search/fetch para descobrir documentos por tema ou intenção, preservando ACLs. Retornar título, URL, ID, origem e trecho de evidência. Confirmar os resultados na API de origem e comparar ao catálogo.

Rovo é uma camada de descoberta semântica. Sua busca não substitui enumeração completa do repositório e não garante cobertura total. O cliente MCP e o fluxo OAuth não estão conectados nesta versão. O roteiro de descoberta pode ser baixado na interface.

## 8. Ranking e indicadores

Ranking: quantidade de itens únicos cadastrados por pessoa no período de criação, com total validado ao lado. Pastas, arquivados, edições e duplicações não pontuam. O responsável pelo documento pode ser diferente do registrador. Importações ficam atribuídas a quem executa o lote; na produção, separar contribuição manual de migrações para evitar distorção. Não usar volume isolado como avaliação de desempenho.

Saúde exibida no MVP: itens ativos validados, com responsável e hierarquia preenchidos e modificação nos últimos 180 dias ÷ total de itens ativos. Mede condição dos metadados, não rigor metodológico ou impacto.

| Indicador de valor | Como medir | Observação |
|---|---|---|
| Encontrabilidade | Mediana do tempo para localizar evidência em tarefas equivalentes | Comparar linha de base e piloto |
| Completude | Itens com responsável e hierarquia completos / itens ativos | Meta inicial proposta: 95% |
| Cobertura da origem | Itens reconciliados / itens elegíveis enumerados | Informar escopo, permissões e última consulta |
| Retrabalho evitado | Estudos reaproveitados com confirmação do responsável | Não inferir só de downloads |
| Reuso | Evidências citadas em novas iniciativas / evidências ativas | Exige instrumentação futura |
| Esforço economizado | (Tempo anterior − tempo atual) × frequência de buscas | Estimativa, sem monetização fictícia |
| Valor de decisão | Decisões vinculadas à evidência, resultado e contexto | Correlação não prova causalidade |

Hipótese de sucesso: reduzir em 30% o tempo de busca no piloto. Ainda não há evidência de economia ou redução de retrabalho. Levantar baseline antes da implantação.

## 9. Plano de implantação

| Etapa indicativa | Entregas | Critério de saída |
|---|---|---|
| Semanas 1–2: fundação | IQY real, mapeamento, taxonomia, baseline e responsáveis | Amostra validada pela gestão |
| Semanas 3–4: piloto | Um portfólio catalogado, treinamento e curadoria | Casos de busca e cadastro validados pelos perfis |
| Semanas 5–6: integrações | Identidade corporativa, leitura Microsoft/Confluence e jobs | Autorização e cobertura verificadas em ambiente real |
| Semanas 7–8: escala | Demais portfólios, Rovo, instrumentação de reuso | Acompanhamento de métricas e rotina estabelecida |

Estimativa sujeita a acessos, tamanho da base, políticas corporativas e disponibilidade da equipe. Dependências: dono de ResearchOps, desenvolvimento full-stack, administração Microsoft/Atlassian e representantes dos portfólios.

## 10. Critérios de aceite

- Analista não recebe ranking via API nem valida documentos.
- Cadastro preserva responsável, modificação, natureza, formato e hierarquia.
- Recarregar a aplicação mantém registros no banco.
- URL repetida não gera contribuição adicional.
- Importação tem mapeamento e conferência, informa erros e não promete ler a fonte apenas ao carregar IQY.
- Contadores de itens e pastas não são confundidos.
- Integração sem credencial informa que não está conectada.
- Conciliação com limite/erro não se apresenta como completa.
- Dados de demonstração e documentos reais são distinguíveis.

## Referências consultadas

- [Confluence Cloud REST API v2 — páginas](https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-page/)
- [Confluence Cloud REST API v2 — anexos](https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-attachment/)
- [Atlassian Rovo](https://www.atlassian.com/software/rovo)
- [B3 — Brand center](https://www.b3.com.br/en_us/b3/press/brand-center/)

As referências sustentam viabilidade e identidade visual; a arquitetura, metas e cronograma são propostas para o projeto.
