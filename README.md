# Cadastro de Ativos Industriais

Aplicação full stack para cadastrar e administrar equipamentos industriais. O escopo é deliberadamente restrito ao CRUD de ativos, com interface em português e código técnico em inglês.

## Estrutura

```text
.
├── frontend/                    # React, TypeScript, Vite e Tailwind CSS
│   └── src/
│       ├── components/          # Componentes compartilhados
│       ├── features/assets/     # Tela, formulário e detalhes de ativos
│       ├── services/            # Cliente HTTP da API
│       └── types/               # Tipos do domínio no frontend
└── backend/
    ├── Domain/                  # Entidade e enums do domínio
    ├── Application/             # Casos de uso, DTOs e contratos
    ├── Infrastructure/          # EF Core, PostgreSQL, repositório e migration
    └── API/                     # Controllers, configuração e middleware
```

## Pré-requisitos

- Node.js 22 ou superior
- .NET SDK 10
- PostgreSQL 16 ou superior
- EF Core CLI: `dotnet tool install --global dotnet-ef`

## Banco de dados

Crie um banco vazio e ajuste `ConnectionStrings:AssetsDatabase` em `backend/API/appsettings.json` (ou use a variável `ConnectionStrings__AssetsDatabase`). Depois aplique a migration:

```bash
cd backend
dotnet restore
dotnet ef database update --project Infrastructure --startup-project API
```

A migration cria a tabela `assets` com as colunas `id` (UUID), `code`, `name`, `description`, `type`, `manufacturer`, `model`, `serial_number`, `status` e `created_at`. Código e número de série possuem índices únicos.

## Executar o backend

```bash
cd backend
dotnet run --project API
```

A API estará em `http://localhost:5000`. Em desenvolvimento, o documento OpenAPI fica em `http://localhost:5000/openapi/v1.json`.

## Executar o frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`. Para usar outro endereço da API, copie `.env.example` para `.env` e altere `VITE_API_URL`.

## Endpoints

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/assets` | Lista todos os ativos |
| GET | `/api/assets/{id}` | Consulta um ativo |
| POST | `/api/assets` | Cadastra um ativo |
| PUT | `/api/assets/{id}` | Atualiza um ativo |
| DELETE | `/api/assets/{id}` | Exclui um ativo |

Exemplo de payload para POST/PUT:

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

Valores de `type`: `Motor`, `Pump`, `Conveyor`, `Tank`, `Robot`, `Machine`, `Other`. Valores de `status`: `Operating`, `Stopped`, `Maintenance`, `Alarm`, `Offline`.

## Testar o cadastro

1. Inicie PostgreSQL, aplique a migration e execute backend e frontend.
2. Abra **Novo Ativo**, preencha os campos obrigatórios e salve.
3. Use a pesquisa por código, nome, fabricante, modelo ou número de série.
4. Valide as ações de visualizar e editar.
5. Clique em excluir e confirme a exclusão.
6. Opcionalmente, use `curl` para validar a API diretamente:

```bash
curl -X POST http://localhost:5000/api/assets \
  -H 'Content-Type: application/json' \
  -d '{"code":"MOT-001","name":"Motor principal","description":"Linha 1","type":"Motor","manufacturer":"WEG","model":"W22","serialNumber":"SN-001","status":"Operating"}'
curl http://localhost:5000/api/assets
```

O backend rejeita campos obrigatórios ausentes, tamanhos inválidos, enums inválidos e códigos ou números de série duplicados, usando respostas HTTP adequadas (`400`, `404`, `409` e `500`).
