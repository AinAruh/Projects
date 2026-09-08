# PROMPT 03 — Dashboard Administrativo, Operacional e Financeiro

Atue como um **Engenheiro de Software Sênior e Product Designer**, seguindo **Clean Code, SOLID, DRY, KISS**, acessibilidade e boas práticas de visualização de dados.

Evolua a aplicação existente de **Gestão de Ativos Industriais**, preservando integralmente o cadastro de ativos e a autenticação já implementados. Crie um **dashboard completo**, responsivo e funcional, alimentado exclusivamente por dados reais persistidos no PostgreSQL.

O dashboard deve oferecer uma visão executiva da operação, da disponibilidade dos equipamentos e dos principais indicadores financeiros. Não recrie o projeto do zero e não substitua a arquitetura ou a stack existentes.

## Stack existente

### Frontend

- React;
- TypeScript;
- Vite;
- Tailwind CSS;
- React Router;
- adicionar **Recharts** para os gráficos, salvo se o projeto já utilizar outra biblioteca equivalente.

### Backend

- C#;
- .NET 10;
- ASP.NET Core Web API;
- Entity Framework Core;
- ASP.NET Core Identity e autenticação existente.

### Banco de dados

- PostgreSQL.

Não introduza outro framework de frontend, outro banco, serviços externos de BI, Docker ou microserviços.

## Objetivo funcional

Crie uma página privada em `/dashboard`, acessível somente a usuários autenticados, que permita à administração responder rapidamente:

- quantos ativos existem;
- quantos estão operando, parados, em manutenção, em alarme ou offline;
- qual é a disponibilidade operacional atual;
- quais tipos e fabricantes concentram mais equipamentos;
- quais ativos precisam de atenção imediata;
- qual é o valor total de aquisição e o valor contábil atual dos ativos;
- quanto foi gasto em manutenção no período;
- qual é o orçamento de manutenção e quanto dele já foi consumido;
- como custos e investimentos evoluíram ao longo do período;
- quais ativos representam os maiores custos.

Não exiba números fictícios, aleatórios ou codificados no frontend. Estados sem dados devem aparecer explicitamente como **“Sem dados no período”**.

## Fonte e modelagem dos dados financeiros

Como o cadastro atual de ativos não contém informações financeiras suficientes, estenda-o somente com os campos essenciais:

- `AcquisitionValue`: valor original de aquisição;
- `AcquisitionDate`: data de aquisição;
- `CurrentBookValue`: valor contábil atual;
- `AnnualMaintenanceBudget`: orçamento anual de manutenção.

Crie a entidade `AssetFinancialEntry` para registrar movimentações financeiras relacionadas ao ativo:

- `Id`;
- `AssetId`;
- `Type`: `MaintenanceCost`, `Improvement`, `OtherCost`;
- `Amount`;
- `OccurredOn`;
- `Description`;
- `CreatedAt`.

Regras:

- valores monetários devem usar `decimal`, nunca `float` ou `double`;
- persistir valores com precisão PostgreSQL `numeric(18,2)`;
- valores devem ser maiores que zero;
- datas futuras não são permitidas, exceto quando a regra estiver explicitamente documentada;
- uma movimentação deve pertencer a um ativo existente;
- a exclusão de um ativo que possua lançamentos deve ser bloqueada com resposta `409 Conflict`, evitando perda financeira acidental;
- não calcular depreciação automaticamente nesta etapa; `CurrentBookValue` será informado e validado;
- moeda padrão configurável, inicialmente `BRL`;
- todos os totais e gráficos financeiros devem ser calculados no backend a partir dos registros persistidos.

Inclua no formulário de ativo os novos campos financeiros. Crie também uma interface simples, dentro dos detalhes do ativo, para listar, adicionar, editar e excluir seus lançamentos financeiros. Isso é apenas o suporte mínimo necessário para alimentar o dashboard; não crie um módulo contábil completo.

## Filtros globais

No topo do dashboard, disponibilize filtros que afetem todos os indicadores e gráficos aplicáveis:

- período, com opções `Este mês`, `Últimos 3 meses`, `Últimos 6 meses`, `Este ano` e `Personalizado`;
- tipo de equipamento;
- status;
- fabricante;
- campo de busca por código ou nome.

Requisitos dos filtros:

- período personalizado exige data inicial e final válidas;
- refletir os filtros na URL por query string para permitir compartilhamento e atualização da página;
- oferecer ação **Limpar filtros**;
- aplicar debounce na busca textual;
- não filtrar grandes conjuntos apenas no navegador; enviar filtros ao backend;
- exibir claramente o intervalo e a moeda usados nos dados financeiros.

## Conteúdo do dashboard

### 1. Cabeçalho

Exibir:

- título **Visão Geral**;
- saudação discreta com o nome do usuário autenticado;
- data e hora da última atualização;
- botão **Atualizar dados**;
- filtros globais;
- ação de logout no cabeçalho principal já existente.

Não criar dados em tempo real, WebSocket ou atualização automática contínua. A atualização ocorre ao alterar filtros ou usar o botão.

### 2. Cards de indicadores operacionais

Exibir cards com:

- total de ativos;
- ativos operando;
- ativos parados;
- ativos em manutenção;
- ativos em alarme;
- ativos offline;
- disponibilidade operacional.

Calcule a disponibilidade atual como:

```text
ativos operando / total de ativos * 100
```

Quando não houver ativos, retornar `0`, nunca `NaN` ou erro de divisão por zero. Use cores coerentes com os badges de status já existentes e forneça texto/ícone, sem depender apenas da cor.

### 3. Cards de indicadores financeiros

Exibir:

- valor total de aquisição;
- valor contábil atual total;
- custos de manutenção no período;
- orçamento anual de manutenção;
- saldo do orçamento;
- percentual do orçamento consumido;
- investimentos em melhorias no período;
- custo médio de manutenção por ativo.

Regras:

- usar formatação `pt-BR` e moeda configurada;
- saldo negativo deve aparecer como estouro do orçamento;
- percentuais devem ser calculados no backend;
- divisões sem denominador devem resultar em zero;
- informar por tooltip a fórmula de cada indicador não óbvio;
- valores devem respeitar os filtros selecionados.

### 4. Gráficos operacionais

Adicionar:

1. gráfico de rosca **Ativos por status**;
2. gráfico de barras horizontais **Ativos por tipo**;
3. gráfico de barras **Top 5 fabricantes por quantidade de ativos**.

Cada gráfico deve possuir:

- título e descrição curta;
- legenda;
- tooltip acessível;
- valores e percentuais quando aplicável;
- estado de carregamento;
- estado vazio;
- fallback textual ou tabela resumida para acessibilidade;
- cores consistentes em todo o sistema.

### 5. Gráficos financeiros

Adicionar:

1. gráfico de linha ou área **Custos mensais de manutenção**, agrupado por mês no intervalo selecionado;
2. gráfico de barras agrupadas **Orçamento versus realizado**, por mês;
3. gráfico de barras horizontais **Top 5 ativos por custo de manutenção**;
4. gráfico de composição **Movimentações por tipo**, separando manutenção, melhorias e outros custos.

Meses sem movimentações devem aparecer com valor zero dentro do intervalo solicitado. Ordene séries cronologicamente no backend e retorne datas em formato não ambíguo.

### 6. Área de atenção

Exibir uma lista **Ativos que exigem atenção**, contendo ativos com status:

- `Alarm` primeiro;
- `Maintenance` em seguida;
- `Stopped` e `Offline` depois.

Mostrar no máximo dez itens com código, nome, tipo, fabricante, status e ação para abrir os detalhes do ativo. A ordenação deve ser determinística e calculada no backend. Se não houver itens, exibir uma mensagem positiva sem ocultar o componente.

### 7. Resumo financeiro tabular

Exibir uma tabela com os ativos de maior impacto financeiro contendo:

- código;
- nome;
- valor de aquisição;
- valor contábil atual;
- custo de manutenção no período;
- orçamento anual;
- percentual consumido;
- ação para abrir os detalhes.

Permitir ordenar pelas colunas financeiras. Paginar no backend e não retornar a base inteira. Exibir moeda e percentuais com alinhamento apropriado.

## Endpoints da API

Crie endpoints privados sob `/api/dashboard`, todos protegidos com `[Authorize]`:

```text
GET /api/dashboard/summary
GET /api/dashboard/operational-charts
GET /api/dashboard/financial-charts
GET /api/dashboard/attention-assets
GET /api/dashboard/financial-assets
```

Crie também o suporte mínimo aos lançamentos financeiros:

```text
GET    /api/assets/{assetId}/financial-entries
POST   /api/assets/{assetId}/financial-entries
PUT    /api/assets/{assetId}/financial-entries/{entryId}
DELETE /api/assets/{assetId}/financial-entries/{entryId}
```

Todos os endpoints devem aceitar `CancellationToken`. Os endpoints do dashboard devem receber filtros tipados por query string, compartilhar uma validação única e retornar DTOs específicos, nunca entidades do EF Core.

Exemplo:

```text
GET /api/dashboard/summary?startDate=2026-01-01&endDate=2026-12-31&type=Motor&status=Operating&manufacturer=WEG&search=MOT
```

Use:

- `400 Bad Request` para filtros ou payloads inválidos;
- `401 Unauthorized` para ausência de autenticação;
- `404 Not Found` para ativo ou lançamento inexistente;
- `409 Conflict` quando uma operação violar integridade;
- `500 Internal Server Error` apenas para erros inesperados.

## Contrato sugerido do resumo

O endpoint `/api/dashboard/summary` deve retornar um contrato fortemente tipado semelhante a:

```json
{
  "generatedAt": "2026-09-08T12:00:00Z",
  "currency": "BRL",
  "period": {
    "startDate": "2026-01-01",
    "endDate": "2026-12-31"
  },
  "operational": {
    "totalAssets": 0,
    "operating": 0,
    "stopped": 0,
    "maintenance": 0,
    "alarm": 0,
    "offline": 0,
    "availabilityPercentage": 0
  },
  "financial": {
    "totalAcquisitionValue": 0,
    "totalCurrentBookValue": 0,
    "maintenanceCost": 0,
    "annualMaintenanceBudget": 0,
    "remainingBudget": 0,
    "budgetUsedPercentage": 0,
    "improvementInvestment": 0,
    "averageMaintenanceCostPerAsset": 0
  }
}
```

O formato pode ser aprimorado, mas mantenha nomes técnicos em inglês e valores numéricos como números JSON, não strings formatadas.

## Backend e arquitetura

Mantenha a separação existente:

```text
backend/
├── Domain/
├── Application/
├── Infrastructure/
└── API/
```

Responsabilidades:

- **Domain**: `AssetFinancialEntry`, enum financeiro e invariantes essenciais;
- **Application**: DTOs, filtros, contratos e serviços de dashboard;
- **Infrastructure**: mapeamentos EF Core e consultas agregadas ao PostgreSQL;
- **API**: controllers pequenos, autorização e tradução HTTP.

Requisitos:

- implementar consultas agregadas diretamente no banco, evitando carregar todos os registros em memória;
- usar `AsNoTracking` nas consultas de leitura;
- evitar problema N+1;
- projetar apenas os campos necessários;
- executar consultas independentes em quantidade responsável, sem compartilhar o mesmo `DbContext` simultaneamente;
- usar `DateOnly` para datas sem horário e UTC para instantes;
- documentar se o limite final do período é inclusivo;
- adicionar índices coerentes com filtros e agrupamentos;
- manter cálculos financeiros centralizados e testáveis;
- não retornar stack traces ou detalhes internos.

Não crie um endpoint genérico que retorne toda a base para o frontend calcular os indicadores.

## Entity Framework Core e migration

Crie uma migration real gerada pelo EF Core contendo:

- novos campos financeiros em `assets`;
- tabela `asset_financial_entries`;
- chave estrangeira para `assets` com comportamento de exclusão restritivo;
- precisão `numeric(18,2)` em todos os valores monetários;
- índices em `asset_id`, `occurred_on`, `type` e combinações úteis para as consultas;
- restrições de nulabilidade e tamanho.

Defina uma estratégia segura para ativos existentes: novos campos monetários podem iniciar em zero e a data de aquisição pode ser nula até atualização cadastral. Execute a migration em PostgreSQL real e valide os dados resultantes. Não escreva a migration manualmente.

## Frontend e organização

Adicione a feature sem misturar regras de dashboard com a feature de ativos:

```text
frontend/src/
├── components/
├── features/
│   ├── assets/
│   ├── auth/
│   └── dashboard/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       └── utils/
├── services/
└── types/
```

Crie componentes pequenos e reutilizáveis, como:

- `DashboardPage`;
- `DashboardFilters`;
- `KpiCard`;
- `ChartCard`;
- `OperationalStatusChart`;
- `AssetTypeChart`;
- `MaintenanceCostChart`;
- `BudgetComparisonChart`;
- `AttentionAssetsList`;
- `FinancialAssetsTable`;
- `DashboardSkeleton`;
- `DashboardErrorState`;
- `DashboardEmptyState`.

Não concentre a página inteira em um único arquivo. Separe formatação monetária, percentual e datas em funções utilitárias testáveis. Não use `any`.

## Experiência e interface

O visual deve ser moderno, profissional e adequado a um sistema de automação industrial:

- layout responsivo em grid;
- excelente leitura em desktop, tablet e mobile;
- cards com hierarquia clara, sem excesso de sombras ou efeitos;
- paleta consistente com o sistema atual;
- números financeiros alinhados e legíveis;
- gráficos que não dependam somente de cor;
- skeleton durante carregamento inicial;
- erro com ação **Tentar novamente**;
- estado vazio por componente;
- atualização de filtros sem apagar abruptamente os dados anteriores;
- tooltips e textos em português;
- foco visível e navegação por teclado;
- respeito a `prefers-reduced-motion`;
- contraste compatível com WCAG AA.

Adicione a opção **Dashboard** à navegação autenticada e preserve **Ativos Industriais** como módulo separado. Não implemente menu ou páginas para funcionalidades inexistentes.

## Segurança

- todos os endpoints devem exigir usuário autenticado;
- não aceitar identificadores de usuário enviados pelo frontend para definir propriedade dos dados;
- validar e limitar comprimentos de filtros e campos textuais;
- parametrizar consultas por meio do EF Core;
- evitar exposição de informações sensíveis em logs;
- manter CORS restrito à origem configurada;
- manter a política de autenticação e refresh token já estabelecida;
- aplicar limite máximo ao intervalo personalizado, preferencialmente 24 meses, para proteger a API;
- limitar `pageSize` da tabela a no máximo 100.

## Testes obrigatórios

### Backend

Crie testes unitários para fórmulas e testes de integração para, no mínimo:

- resumo sem dados;
- contagem correta por status;
- disponibilidade com e sem ativos;
- filtros por período, tipo, status, fabricante e texto;
- totais monetários com precisão decimal;
- orçamento consumido e saldo negativo;
- meses sem movimentação preenchidos com zero;
- top 5 ordenado corretamente;
- paginação e ordenação da tabela financeira;
- cadastro e validação de lançamento financeiro;
- bloqueio da exclusão de ativo com lançamentos;
- rejeição de acesso não autenticado;
- intervalo inválido ou maior que o permitido.

### Frontend

Crie testes com dados de API simulados apenas no ambiente de teste para:

- renderização dos KPIs;
- formatação monetária em `pt-BR`;
- filtros sincronizados com a URL;
- estados de carregamento, vazio e erro;
- atualização manual;
- acessibilidade básica dos gráficos;
- ordenação e paginação da tabela;
- navegação para os detalhes do ativo;
- comportamento responsivo essencial.

## Critérios de aceite

A entrega será considerada completa somente se:

1. `/dashboard` estiver protegido e integrado à navegação;
2. todos os números vierem do PostgreSQL por meio da API;
3. filtros alterarem consistentemente cards, gráficos, lista e tabela;
4. indicadores financeiros forem calculados com `decimal` e formatados em BRL;
5. lançamentos financeiros puderem ser mantidos nos detalhes do ativo;
6. dashboard funcionar corretamente sem ativos ou movimentações;
7. consultas não carregarem tabelas inteiras em memória;
8. interface funcionar em desktop e mobile;
9. gráficos possuírem alternativa textual acessível;
10. migration, lint, build e todos os testes passarem;
11. nenhum dado de demonstração estiver codificado no frontend;
12. nenhuma funcionalidade fora do escopo for adicionada.

## Não implementar agora

- telemetria em tempo real;
- WebSocket ou SignalR;
- integração com PLC, OPC UA ou MQTT;
- predição por inteligência artificial;
- cálculo automático de depreciação;
- contabilidade fiscal;
- contas a pagar ou receber;
- geração de notas fiscais;
- importação bancária;
- exportação de relatórios em PDF ou Excel;
- comparação entre plantas ou multi-tenant;
- editor personalizável de dashboards;
- envio de alertas ou notificações;
- novos níveis de acesso ou permissões.

## Execução e validação obrigatórias

Execute:

```bash
cd frontend
npm install
npm run lint
npm run build
npm test -- --run

cd ../backend
dotnet restore
dotnet build --no-restore
dotnet test --no-build
dotnet ef database update --project Infrastructure --startup-project API
```

Depois, execute frontend, backend e PostgreSQL e valide no navegador:

1. acesso não autenticado redirecionando para login;
2. dashboard sem dados;
3. dashboard com ativos em diferentes status;
4. cadastro de lançamentos financeiros;
5. atualização dos indicadores e gráficos;
6. todos os filtros e a limpeza dos filtros;
7. estados de erro e tentativa novamente;
8. layout em larguras desktop e mobile.

## Ao finalizar

Informe:

1. o que foi criado;
2. estrutura de pastas adicionada ou alterada;
3. principais arquivos;
4. endpoints e contratos;
5. fórmulas utilizadas em cada indicador;
6. estrutura e migration do banco;
7. índices adicionados e justificativa;
8. como executar frontend, backend, migration e testes;
9. como cadastrar dados financeiros e validar o dashboard;
10. testes executados e resultados;
11. erros encontrados e como foram corrigidos;
12. resultado dos builds;
13. capturas de tela do dashboard preenchido e vazio em desktop e mobile.

Não considere a tarefa concluída se o dashboard usar valores mockados, se os cálculos forem feitos a partir da base inteira carregada no navegador, se a migration não tiver sido aplicada ou se frontend/backend não compilarem.
