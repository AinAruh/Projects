# Cadastro de Ativos Industriais

Aplicação dedicada ao cadastro de equipamentos: React, TypeScript, Vite e Tailwind CSS no frontend; ASP.NET Core Web API em .NET 10, Entity Framework Core e PostgreSQL no backend. Interface em português e nomes técnicos em inglês.

## Funcionalidades entregues

- Criar, consultar, visualizar detalhes, editar e excluir equipamentos.
- Pesquisa por código, nome, descrição, fabricante, modelo, série, tipo e status, sem diferenciar acentos ou maiúsculas.
- Filtros por tipo e status, contador de resultados e atualização da lista.
- Formulários com validação, confirmação de exclusão e mensagens de erro/sucesso.
- Layout responsivo, tabela com rolagem em telas pequenas e modais com foco contido, retorno de foco e fechamento por Escape. Ações bloqueadas durante o salvamento.
- Persistência PostgreSQL; ID e data de cadastro gerados pelo backend.

Tipos: Motor, Bomba, Esteira, Tanque, Robô, Máquina e Outro. Status: Operando, Parado, Manutenção, Alarme e Offline. Alarme é somente um valor do cadastro.

Não há autenticação, usuários, dashboard ou outros módulos na aplicação executável. Havia arquivos de autenticação no workspace antes desta entrega: foram preservados, mas excluídos da compilação pelos `.csproj`; suas rotas, serviços e migration não participam desta aplicação. A pasta preexistente `Projects/` não é a aplicação executada.

## Estrutura e principais arquivos

```text
frontend/
  src/
    components/Modal.tsx
    features/assets/
      AssetsPage.tsx
      components/AssetForm.tsx
      components/AssetDetails.tsx
      components/StatusBadge.tsx
    services/api.ts
    types/asset.ts
    index.css
backend/
  Domain/Entities/Asset.cs
  Domain/Enums/
  Application/DTOs/SaveAssetRequest.cs
  Application/DTOs/AssetDto.cs
  Application/Interfaces/
  Application/Services/AssetService.cs
  Infrastructure/Data/AssetsDbContext.cs
  Infrastructure/Data/Migrations/
  Infrastructure/Repositories/AssetRepository.cs
  API/Controllers/AssetsController.cs
  API/Middleware/ExceptionMiddleware.cs
  API/Program.cs
README.md
```

A API trata HTTP; Application valida e coordena operações; Domain contém entidade e enums; Infrastructure implementa persistência. O frontend concentra a funcionalidade em `features/assets` e centraliza HTTP em `services/api.ts`.

## Banco de dados

A migration `202608260001_InitialCreate` cria `assets`:

| Coluna | Tipo PostgreSQL | Regras |
| --- | --- | --- |
| id | uuid | Chave primária, gerada pela API |
| code | varchar(30) | Obrigatório, 2–30 caracteres, índice único, gravado em maiúsculas |
| name | varchar(120) | Obrigatório, 2–120 caracteres |
| description | varchar(500) | Texto opcional; padrão vazio |
| type | varchar(30) | Enum obrigatório |
| manufacturer | varchar(100) | Obrigatório |
| model | varchar(100) | Obrigatório |
| serial_number | varchar(100) | Obrigatório, índice único |
| status | varchar(30) | Enum obrigatório |
| created_at | timestamp with time zone | Gerado em UTC e preservado na edição |

O EF mantém também `__EFMigrationsHistory`. O banco local desta entrega contém essas duas tabelas; não foram criadas tabelas de autenticação.

## Como executar

Pré-requisitos: Node.js 22+, .NET SDK 10, PostgreSQL 16+ e ferramenta `dotnet-ef` compatível com EF Core 10.

Configure `ConnectionStrings:AssetsDatabase` em `backend/API/appsettings.Local.json` (arquivo ignorado pelo Git) para desenvolvimento:

```json
{
  "ConnectionStrings": {
    "AssetsDatabase": "Host=localhost;Port=5432;Database=industrial_assets;Username=postgres;Password=SUA_SENHA"
  }
}
```

Também é possível usar `ConnectionStrings__AssetsDatabase`; a variável de ambiente tem precedência. Crie o banco `industrial_assets` no seu PostgreSQL antes da migration.

Na raiz do projeto:

```powershell
dotnet restore backend/IndustrialAssets.slnx
dotnet ef database update --project backend/Infrastructure --startup-project backend/API -- --environment Development
dotnet run --project backend/API
```

Em outro terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173. API: http://localhost:5000/api/assets. OpenAPI em desenvolvimento: http://localhost:5000/openapi/v1.json.

Para outro endereço de API, configure `VITE_API_URL` no `frontend/.env` (incluindo `/api`). Para outra origem do frontend, configure `FrontendUrl` no backend.

### Banco local preparado neste computador

A configuração local já apontava para `127.0.0.1:5433`, mas não havia servidor nessa porta. Foi criado um cluster exclusivo em `.local-postgres/`, ignorado pelo Git, com PostgreSQL 17 e a credencial local existente. O servidor escuta apenas em `127.0.0.1`. O PostgreSQL do computador na porta 5432 não foi alterado. Este é um banco novo, sem migração de dados de outros servidores.

Após reiniciar o computador, execute na raiz do projeto, antes da API:

```powershell
& 'C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe' -D "$PWD\.local-postgres" -l "$PWD\.local-postgres\server.log" -o '-h 127.0.0.1 -p 5433' start
```

Para desligar esse banco local:

```powershell
& 'C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe' -D "$PWD\.local-postgres" stop -m fast
```

## Endpoints

| Método | Rota | Resultado |
| --- | --- | --- |
| GET | /api/assets | 200, lista ordenada por código |
| GET | /api/assets/{id} | 200 ou 404 |
| POST | /api/assets | 201 com corpo e Location |
| PUT | /api/assets/{id} | 200 ou 404 |
| DELETE | /api/assets/{id} | 204 ou 404 |

Validação inválida retorna 400; código ou série duplicados retornam 409. Erros inesperados são registrados no backend e retornam uma mensagem genérica. Nenhum endpoint exige login.

Exemplo de POST/PUT:

```json
{
  "code": "MOT-001",
  "name": "Motor da linha principal",
  "description": "Motor trifásico da esteira de alimentação",
  "type": "Motor",
  "manufacturer": "WEG",
  "model": "W22",
  "serialNumber": "SN-2026-001",
  "status": "Operating"
}
```

Valores técnicos de tipo: `Motor`, `Pump`, `Conveyor`, `Tank`, `Robot`, `Machine`, `Other`. Status: `Operating`, `Stopped`, `Maintenance`, `Alarm`, `Offline`. Enums desconhecidos, numéricos ou omitidos são rejeitados.

## Como testar o cadastro

1. Acesse http://localhost:5173 e clique em **Novo Ativo**.
2. Preencha os campos obrigatórios e salve. Confira a mensagem e a linha criada.
3. Recarregue a página para confirmar persistência.
4. Pesquise por código/nome e combine os filtros de tipo/status.
5. Use **Visualizar** para conferir ID, data e todos os dados.
6. Use **Editar**, altere o status e salve.
7. Tente cadastrar código ou série já existentes e confira a rejeição.
8. Clique em **Excluir** e primeiro cancele; confirme que o registro continua. Repita e confirme para excluir.

## Validação e correções

- Corrigida exigência de autenticação que bloqueava `/api/assets`.
- Resolvida ausência do servidor PostgreSQL na porta configurada usando um cluster local próprio.
- Validado tamanho mínimo de código/nome após remover espaços; enums devem ser informados e válidos.
- Modais identificados e acessíveis; erros de salvamento ficam dentro do formulário; exclusão tem confirmação própria.
- Build .NET: sucesso, sem avisos ou erros. Build frontend e ESLint: sucesso.
- Testes de integração HTTP: CRUD, duplicidades, campos inválidos, enums, limites, data de cadastro preservada e registros inexistentes.
- Testes reais no Microsoft Edge via Playwright: cadastro, recarregamento, detalhes, edição, busca sem acentos, filtro de status, cancelamento/confirmação de exclusão e layout desktop/mobile, sem exceções JavaScript.
- Snapshot EF verificado sem mudanças pendentes. Registros temporários de teste são removidos.

Comandos de verificação:

```powershell
dotnet build backend/IndustrialAssets.slnx
dotnet ef migrations has-pending-model-changes --project backend/Infrastructure --startup-project backend/API --no-build -- --environment Development
cd frontend
npm run build
npm run lint
```

O teste automatizado desta execução está em `.verification/check.cjs` (pasta local ignorada pelo Git). Com os servidores ativos e Playwright instalado nessa pasta, execute `node .verification/check.cjs` na raiz. Capturas desktop/mobile e resultado também estão em `.verification/`.