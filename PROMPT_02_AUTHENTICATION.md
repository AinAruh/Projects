# PROMPT 02 — Cadastro e Login de Usuários

Atue como um **Engenheiro de Software Sênior**, seguindo **Clean Code, SOLID, DRY, KISS** e práticas atuais de segurança para aplicações web.

Evolua a aplicação existente de **Cadastro de Ativos Industriais** para incluir **cadastro, autenticação e sessão de usuários**. Preserve o CRUD de ativos já implementado e não recrie o projeto do zero.

Ao concluir, deve ser possível:

1. cadastrar um usuário;
2. entrar com e-mail e senha;
3. manter a sessão após atualizar a página;
4. consultar os dados do usuário autenticado;
5. sair da aplicação;
6. impedir o acesso às páginas e APIs protegidas sem autenticação.

## Stack existente

Mantenha a stack atual:

### Frontend

- React;
- TypeScript;
- Vite;
- Tailwind CSS.

### Backend

- C#;
- .NET 10;
- ASP.NET Core Web API;
- Entity Framework Core;
- ASP.NET Core Identity.

### Banco de dados

- PostgreSQL.

Não introduza outro framework de frontend, outro banco de dados, Docker, microserviços ou serviços externos de autenticação.

## Escopo funcional

### Cadastro

Crie uma página pública em `/register` com:

- nome completo;
- e-mail;
- senha;
- confirmação de senha;
- aceite obrigatório dos termos de uso e política de privacidade.

Requisitos:

- validar os campos no frontend e no backend;
- normalizar o e-mail;
- não permitir e-mail duplicado;
- exigir senha com no mínimo 8 caracteres, letra maiúscula, letra minúscula, número e caractere especial;
- verificar se senha e confirmação coincidem;
- nunca armazenar ou registrar senha em texto puro;
- usar o hash seguro fornecido pelo ASP.NET Core Identity;
- após o cadastro bem-sucedido, redirecionar para o login e exibir uma mensagem de sucesso;
- não implementar confirmação de e-mail nesta etapa.

### Login

Crie uma página pública em `/login` com:

- e-mail;
- senha;
- opção **Lembrar-me**;
- link para a página de cadastro;
- botão para mostrar ou ocultar a senha.

Requisitos:

- autenticar com e-mail e senha;
- retornar uma mensagem genérica para credenciais inválidas, sem revelar se o e-mail existe;
- implementar bloqueio temporário após tentativas consecutivas inválidas usando os recursos do ASP.NET Core Identity;
- redirecionar o usuário autenticado para `/assets`;
- se um usuário autenticado acessar `/login` ou `/register`, redirecioná-lo para `/assets`;
- não implementar recuperação de senha nesta etapa; se houver texto sobre senha esquecida, deixe-o desabilitado e identificado como indisponível.

### Sessão e logout

Use o modelo abaixo:

- access token JWT de curta duração, preferencialmente 15 minutos;
- refresh token aleatório, de uso único e com rotação;
- access token mantido apenas em memória no frontend;
- refresh token armazenado exclusivamente em cookie `HttpOnly`, `Secure` e com `SameSite` configurado adequadamente;
- armazene somente o **hash** do refresh token no banco;
- revogue o refresh token anterior a cada renovação;
- revogue a sessão no logout;
- restaure a sessão ao recarregar a aplicação por meio do endpoint de refresh;
- não use `localStorage` ou `sessionStorage` para armazenar tokens.

Em desenvolvimento HTTP local, permita configurar `Secure=false` por ambiente. Em produção, `Secure` deve ser obrigatório.

## Modelo de usuário

Crie `ApplicationUser` estendendo `IdentityUser<Guid>` com apenas os campos necessários:

- `Id`;
- `FullName`;
- `Email` e campos internos do Identity;
- `CreatedAt`;
- `IsActive`.

Crie também uma entidade `RefreshToken` com:

- `Id`;
- `UserId`;
- `TokenHash`;
- `ExpiresAt`;
- `CreatedAt`;
- `RevokedAt` opcional;
- `ReplacedByTokenId` opcional.

Não crie perfis, avatares, endereços, empresas, permissões, roles ou administração de usuários nesta etapa.

## Endpoints da API

Implemente:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

Comportamentos esperados:

- `register`: recebe nome, e-mail, senha, confirmação e aceite dos termos; retorna `201 Created` sem expor dados sensíveis;
- `login`: recebe e-mail, senha e `rememberMe`; retorna o access token e os dados mínimos do usuário, além de definir o refresh token no cookie;
- `refresh`: lê o cookie, valida e rotaciona o refresh token e retorna um novo access token;
- `logout`: revoga o refresh token, remove o cookie e retorna `204 No Content`;
- `me`: exige autenticação e retorna `id`, `fullName` e `email`.

Use DTOs específicos para entrada e saída. Nunca retorne `PasswordHash`, `SecurityStamp`, token persistido ou outros campos internos do Identity.

Proteja os endpoints existentes `/api/assets` com `[Authorize]`. Endpoints de autenticação devem ser públicos somente quando necessário. Configure Swagger/OpenAPI para aceitar Bearer token.

## Backend e arquitetura

Respeite a separação existente:

```text
backend/
├── Domain/
├── Application/
├── Infrastructure/
└── API/
```

Organize a autenticação sem dependências invertidas:

- **Domain**: entidades próprias que não dependam de infraestrutura, quando aplicável;
- **Application**: DTOs, contratos e casos de uso de autenticação;
- **Infrastructure**: ASP.NET Core Identity, emissão/validação de tokens, persistência e implementações dos contratos;
- **API**: controller, configuração de autenticação/autorização, cookies, rate limiting e respostas HTTP.

Requisitos técnicos:

- registrar serviços por injeção de dependência;
- manter controllers pequenos;
- colocar regras de negócio e fluxo de autenticação em serviços apropriados;
- usar `CancellationToken` em operações assíncronas;
- configurar JWT por opções fortemente tipadas e validar issuer, audience, assinatura e expiração;
- carregar segredo JWT por variável de ambiente ou Secret Manager, nunca versioná-lo em `appsettings.json`;
- validar configurações obrigatórias ao iniciar a aplicação;
- configurar CORS com origem explícita e `AllowCredentials`; não combinar credenciais com origem curinga;
- aplicar rate limiting aos endpoints de cadastro, login e refresh;
- manter tratamento centralizado de erros usando `ProblemDetails` e códigos HTTP adequados;
- não registrar senhas, tokens, cookies ou payloads sensíveis nos logs;
- usar comparações resistentes a timing attacks para hashes de refresh token;
- considerar concorrência durante a rotação do refresh token para impedir reutilização.

## Entity Framework Core e migrations

Integre o Identity ao contexto PostgreSQL existente ou crie um contexto único coerente, evitando dois modelos concorrentes para a mesma conexão.

Crie uma migration real do EF Core contendo:

- tabelas necessárias do ASP.NET Core Identity;
- tabela `refresh_tokens`;
- relacionamento entre usuário e refresh tokens;
- índice único normalizado para e-mail;
- índice único para `token_hash`;
- índices úteis para `user_id` e expiração;
- restrições de tamanho e nulabilidade.

Não edite manualmente uma migration gerada. Execute a migration em um PostgreSQL real e valide cadastro, login, refresh e logout persistidos.

## Frontend e organização

Preserve a organização atual e adicione uma feature de autenticação:

```text
frontend/src/
├── components/
├── features/
│   ├── assets/
│   └── auth/
│       ├── components/
│       ├── pages/
│       ├── schemas/
│       └── hooks/
├── services/
└── types/
```

Implemente:

- roteamento com React Router;
- `LoginPage`;
- `RegisterPage`;
- estado global de autenticação simples usando Context API, sem adicionar Redux;
- `ProtectedRoute` para páginas privadas;
- cliente HTTP centralizado que envie `credentials: 'include'` e o Bearer token;
- tentativa única de refresh ao receber `401`, sem loop infinito;
- logout automático se o refresh falhar;
- indicador de carregamento enquanto a sessão inicial é restaurada;
- mensagens de erro acessíveis e associadas aos campos;
- estados de envio que evitem cliques duplicados;
- navegação por teclado, labels corretas, foco visível e atributos ARIA quando necessários.

Mantenha o visual moderno, limpo e profissional da aplicação industrial. As páginas de login e cadastro devem funcionar bem em desktop e dispositivos móveis. Inclua no cabeçalho da área autenticada o nome do usuário e a ação **Sair**, sem criar dashboard ou outros módulos.

## Validações e respostas

- O backend é a fonte definitiva de validação.
- O frontend deve repetir validações básicas para boa experiência, mas nunca substituir as validações da API.
- Use `400 Bad Request` para dados inválidos, `401 Unauthorized` para credenciais/sessão inválidas, `409 Conflict` para e-mail já cadastrado, `429 Too Many Requests` para limite excedido e `500 Internal Server Error` apenas para falhas inesperadas.
- Apresente mensagens em português para o usuário e mantenha código, classes, métodos, variáveis, propriedades e nomes técnicos em inglês.

## Testes obrigatórios

### Backend

Crie testes automatizados para, no mínimo:

- cadastro válido;
- rejeição de e-mail duplicado;
- rejeição de senha inválida;
- login válido;
- login com credenciais inválidas;
- bloqueio por tentativas inválidas;
- acesso não autenticado ao endpoint `me` e aos ativos;
- refresh válido com rotação;
- rejeição da reutilização de refresh token;
- logout e revogação da sessão.

Prefira testes de integração com `WebApplicationFactory` e PostgreSQL real de teste quando disponível. Não substitua PostgreSQL por EF InMemory em testes destinados a validar persistência, índices ou transações.

### Frontend

Crie testes para, no mínimo:

- validação dos formulários;
- cadastro bem-sucedido;
- exibição de erro de cadastro;
- login bem-sucedido;
- credenciais inválidas;
- proteção de rota;
- restauração e encerramento de sessão.

Execute também:

```bash
cd frontend
npm run lint
npm run build
npm test -- --run

cd ../backend
dotnet restore
dotnet build --no-restore
dotnet test --no-build
dotnet ef database update --project Infrastructure --startup-project API
```

## Critérios de aceite

A entrega será considerada completa somente se:

1. um novo usuário puder ser persistido no PostgreSQL;
2. a senha estiver armazenada exclusivamente como hash do Identity;
3. o usuário cadastrado puder fazer login;
4. a sessão sobreviver a uma atualização da página;
5. tokens expirados puderem ser renovados com rotação segura;
6. logout e reutilização de refresh token forem rejeitados corretamente;
7. visitantes não autenticados não puderem acessar `/assets` nem `/api/assets`;
8. erros forem apresentados de forma clara, sem vazar detalhes sensíveis;
9. migrations, builds, testes e lint forem executados com sucesso;
10. nenhuma funcionalidade fora do escopo tiver sido adicionada.

## Não implementar agora

- login social;
- autenticação multifator;
- confirmação de e-mail;
- recuperação ou redefinição de senha;
- roles e permissões;
- painel administrativo;
- edição de perfil;
- organizações ou multi-tenant;
- CAPTCHA;
- dashboard;
- Docker ou microserviços.

## Ao finalizar

Execute a aplicação completa e valide o fluxo no navegador com um PostgreSQL real. Entregue:

1. resumo do que foi criado;
2. estrutura de pastas adicionada ou alterada;
3. principais arquivos criados;
4. endpoints e exemplos de payload/resposta;
5. estrutura e migration do banco;
6. variáveis de ambiente necessárias, usando valores fictícios nos exemplos;
7. instruções para executar frontend, backend e migrations;
8. roteiro para testar cadastro, login, refresh, acesso protegido e logout;
9. testes executados e respectivos resultados;
10. erros encontrados e como foram corrigidos;
11. resultado final dos builds;
12. captura de tela das páginas de cadastro e login em desktop e mobile.

Não considere a tarefa concluída usando mocks como implementação final, armazenamento em memória, tokens no `localStorage`, migrations apenas escritas sem execução ou backend não compilado.
