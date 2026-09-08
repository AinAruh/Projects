# PROMPT 04 — Menu Principal e Navegação do Sistema Industrial

Atue como um **Engenheiro de Software Sênior e Product Designer**, seguindo **Clean Code, SOLID, DRY, KISS**, arquitetura orientada a features, acessibilidade e boas práticas de experiência do usuário.

Evolua a aplicação existente de **Gestão de Ativos Industriais** criando o **menu principal completo do sistema**, preparado para organizar os módulos atuais e os módulos previstos no roadmap. Preserve o cadastro de ativos, autenticação, dashboard e identidade visual existentes. Não recrie o projeto do zero.

O objetivo desta etapa é implementar exclusivamente a estrutura de navegação, o layout autenticado e o catálogo central de módulos. Não implemente as regras de negócio dos módulos futuros.

## Stack existente

Mantenha:

### Frontend

- React;
- TypeScript;
- Vite;
- Tailwind CSS;
- React Router;
- biblioteca de ícones já usada pelo projeto.

### Backend

- C#;
- .NET 10;
- ASP.NET Core Web API;
- autenticação e autorização existentes.

Não adicione outro framework visual, Redux, serviço externo de menu, microfrontend, Docker ou microserviços.

## Objetivo funcional

Crie um layout privado reutilizável para todas as páginas autenticadas contendo:

- menu lateral principal;
- cabeçalho superior;
- área central para renderização das rotas filhas;
- breadcrumb;
- identificação do usuário autenticado;
- ação de logout;
- comportamento responsivo para desktop, tablet e celular.

O menu deve permitir ao usuário identificar rapidamente onde está, acessar os módulos disponíveis e entender quais funcionalidades estão planejadas, sem criar links quebrados.

## Arquitetura da informação

Organize o menu nesta ordem e hierarquia:

### 1. Visão Geral

- **Dashboard** — rota `/dashboard` — disponível;

### 2. Gestão de Ativos

- **Ativos Industriais** — rota `/assets` — disponível;
- **Tipos de Equipamento** — rota planejada `/asset-types`;
- **Localizações e Setores** — rota planejada `/locations`;
- **Documentos dos Ativos** — rota planejada `/asset-documents`;

### 3. Manutenção

- **Ordens de Serviço** — rota planejada `/maintenance/work-orders`;
- **Planos Preventivos** — rota planejada `/maintenance/plans`;
- **Agenda de Manutenção** — rota planejada `/maintenance/schedule`;
- **Histórico de Manutenção** — rota planejada `/maintenance/history`;
- **Peças e Materiais** — rota planejada `/maintenance/parts`;

### 4. Operação e Monitoramento

- **Status Operacional** — rota planejada `/operations/status`;
- **Alarmes** — rota planejada `/operations/alarms`;
- **Medições e Telemetria** — rota planejada `/operations/telemetry`;
- **Indicadores Operacionais** — rota planejada `/operations/indicators`;

### 5. Financeiro

- **Visão Financeira** — rota `/dashboard?section=financial` se o dashboard financeiro já estiver implementado; caso contrário, rota planejada `/financial`;
- **Custos de Manutenção** — rota planejada `/financial/maintenance-costs`;
- **Investimentos e Melhorias** — rota planejada `/financial/investments`;
- **Orçamentos** — rota planejada `/financial/budgets`;

### 6. Integrações Industriais

- **PLCs e Controladores** — rota planejada `/integrations/plcs`;
- **OPC UA** — rota planejada `/integrations/opc-ua`;
- **MQTT** — rota planejada `/integrations/mqtt`;
- **Fontes de Dados** — rota planejada `/integrations/data-sources`;

### 7. Relatórios

- **Relatórios de Ativos** — rota planejada `/reports/assets`;
- **Relatórios de Manutenção** — rota planejada `/reports/maintenance`;
- **Relatórios Financeiros** — rota planejada `/reports/financial`;
- **Exportações** — rota planejada `/reports/exports`;

### 8. Administração

- **Usuários** — rota planejada `/admin/users`;
- **Perfis e Permissões** — rota planejada `/admin/roles`;
- **Configurações do Sistema** — rota planejada `/admin/settings`;
- **Auditoria** — rota planejada `/admin/audit`.

### 9. Ajuda

- **Central de Ajuda** — rota planejada `/help`;
- **Sobre o Sistema** — rota `/about` — criar uma página simples com nome, versão e informações técnicas não sensíveis.

## Escopo atual versus roadmap

Use um catálogo central tipado para definir quais itens estão disponíveis. Nesta etapa:

- **Dashboard** estará disponível somente se sua rota já existir e estiver funcional;
- **Ativos Industriais** estará disponível;
- **Visão Financeira** estará disponível somente se o dashboard financeiro já existir;
- **Sobre o Sistema** estará disponível;
- todos os demais itens devem ser marcados como planejados.

Itens planejados:

- devem aparecer desabilitados, com contraste adequado;
- devem exibir o badge **Em breve**;
- devem possuir tooltip explicando que o módulo ainda não está disponível;
- não devem alterar a URL ao serem selecionados;
- não devem renderizar páginas vazias, telas falsas ou dados mockados;
- devem poder ser habilitados futuramente alterando uma única propriedade no catálogo de navegação.

Não confunda item planejado com falta de permissão. Um item indisponível pelo roadmap usa **Em breve**; um item sem permissão deve ficar oculto.

## Modelo tipado do catálogo

Crie um catálogo de navegação fortemente tipado, semelhante a:

```ts
export type NavigationItemStatus = 'available' | 'planned';

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: IconType;
  status: NavigationItemStatus;
  requiredPermission?: string;
  exact?: boolean;
}

export interface NavigationGroup {
  id: string;
  label: string;
  items: NavigationItem[];
}
```

Adapte `IconType` à biblioteca existente. Não armazene componentes React, permissões ou estrutura de menu no banco nesta etapa. Não use `any`.

O catálogo deve ser a única fonte para:

- renderização do menu desktop;
- renderização do menu mobile;
- títulos de páginas quando aplicável;
- breadcrumbs;
- verificação visual de item ativo;
- futuras regras de permissão.

Evite duplicar arrays de itens em diferentes componentes.

## Layout desktop

Em telas grandes, implemente uma sidebar fixa com:

- logotipo e nome do sistema no topo;
- largura expandida suficiente para os títulos;
- modo recolhido mostrando apenas os ícones;
- botão acessível para expandir ou recolher;
- grupos identificados por títulos;
- grupos expansíveis quando possuírem vários itens;
- rolagem independente quando a altura for insuficiente;
- item ativo destacado com cor, fundo e indicador lateral;
- tooltips no modo recolhido;
- rodapé com resumo do usuário e acesso ao menu de conta.

Requisitos:

- persistir apenas a preferência visual de sidebar recolhida em `localStorage`; não armazenar tokens ou dados sensíveis;
- iniciar expandida quando não houver preferência;
- preservar a área útil do conteúdo sem sobreposição;
- não abrir automaticamente todos os grupos;
- manter aberto o grupo que contém a rota atual;
- usar transições discretas e respeitar `prefers-reduced-motion`.

## Layout mobile e tablet

Em telas pequenas:

- ocultar a sidebar fixa;
- exibir botão de menu no cabeçalho;
- abrir a navegação em drawer lateral;
- incluir overlay e botão explícito para fechar;
- fechar ao selecionar uma rota disponível;
- fechar com tecla `Escape` e clique no overlay;
- prender o foco dentro do drawer enquanto aberto;
- devolver o foco ao botão que abriu o menu;
- impedir rolagem do conteúdo ao fundo;
- manter logout e identificação do usuário acessíveis.

Não use uma barra inferior com dezenas de itens. O mesmo catálogo deve alimentar desktop e mobile.

## Cabeçalho superior

O cabeçalho deve conter:

- botão mobile ou controle de recolhimento conforme o viewport;
- breadcrumb da rota atual;
- título da página;
- nome do usuário autenticado;
- menu de conta com **Minha conta** marcado como planejado e **Sair** funcional.

Não adicione busca global, notificações ou seletor de empresa nesta etapa. Esses controles não podem aparecer como botões sem função.

## Breadcrumbs

Gere breadcrumbs a partir do catálogo e das rotas, sem strings duplicadas em cada página.

Exemplos:

```text
Visão Geral / Dashboard
Gestão de Ativos / Ativos Industriais
Gestão de Ativos / Ativos Industriais / MOT-001
```

Requisitos:

- o último item representa a página atual e não deve ser link;
- itens intermediários só devem ser links quando possuírem destino funcional;
- detalhes dinâmicos devem usar um nome ou código legível, nunca apenas UUID;
- em mobile, permitir simplificação visual sem remover o nome acessível da página.

## Rotas e proteção

Use rotas aninhadas do React Router:

```text
/
└── ProtectedRoute
    └── AppLayout
        ├── /dashboard
        ├── /assets
        ├── /assets/:id
        └── /about
```

Requisitos:

- páginas privadas devem renderizar dentro de `AppLayout` usando `Outlet`;
- `/` deve redirecionar para `/dashboard` quando o dashboard existir; caso contrário, para `/assets`;
- manter `/login` e `/register` fora do layout privado;
- preservar a restauração de sessão antes de decidir redirecionamentos;
- criar uma página `NotFoundPage` para rotas inexistentes, com ação para voltar ao módulo inicial;
- não criar rotas reais para itens planejados;
- acesso direto a uma rota privada sem sessão deve redirecionar ao login preservando o destino para retorno após autenticação;
- impedir open redirect: o destino de retorno deve aceitar apenas caminhos internos conhecidos.

## Permissões futuras

Prepare o catálogo para permissões futuras por meio da propriedade opcional `requiredPermission`, mas não implemente um sistema de roles ou permissões nesta etapa se ele ainda não existir.

Se permissões já estiverem implementadas:

- filtrar itens antes de renderizar;
- ocultar grupos vazios;
- nunca usar apenas o menu como controle de segurança;
- manter autorização equivalente no backend e nas rotas;
- não mostrar badge **Em breve** para falta de permissão.

Se permissões ainda não existirem, não simule permissões e não codifique verificações por nome ou e-mail de usuário.

## Organização do frontend

Use uma estrutura semelhante a:

```text
frontend/src/
├── app/
│   ├── routes/
│   │   └── AppRoutes.tsx
│   └── navigation/
│       ├── navigation.config.ts
│       ├── navigation.types.ts
│       └── navigation.utils.ts
├── components/
│   └── layout/
│       ├── AppLayout.tsx
│       ├── Sidebar.tsx
│       ├── SidebarGroup.tsx
│       ├── SidebarItem.tsx
│       ├── MobileNavigation.tsx
│       ├── AppHeader.tsx
│       ├── Breadcrumbs.tsx
│       └── UserMenu.tsx
├── features/
│   ├── assets/
│   ├── auth/
│   └── dashboard/
└── pages/
    ├── AboutPage.tsx
    └── NotFoundPage.tsx
```

Adapte a estrutura ao projeto real sem duplicar pastas equivalentes. Componentes de layout não devem conhecer regras internas de ativos, dashboard ou autenticação além do contrato mínimo necessário.

## Estado e responsabilidades

- `AppLayout` compõe sidebar, cabeçalho e conteúdo;
- o catálogo declara grupos e itens;
- utilitários resolvem rota ativa e breadcrumbs;
- contexto ou hook de autenticação fornece usuário e logout;
- estado local controla drawer, grupos expandidos e sidebar recolhida;
- React Router controla localização e navegação;
- não adicionar Context API global apenas para controlar um booleano local;
- não buscar o catálogo na API;
- não duplicar o usuário autenticado em outro estado global.

## Identidade visual

Mantenha a interface moderna e profissional do sistema industrial:

- preservar logotipo, paleta e tipografia existentes;
- usar ícones semanticamente consistentes;
- evitar excesso de cores, gradientes, sombras e animações;
- garantir contraste WCAG AA;
- item ativo deve ser perceptível sem depender apenas da cor;
- badges **Em breve** devem ser discretos e legíveis;
- estados de hover, focus, active e disabled devem ser claramente diferentes;
- conteúdo deve usar largura e espaçamento consistentes entre os módulos;
- não alterar o estilo interno das telas existentes além do necessário para inseri-las no layout.

## Acessibilidade obrigatória

- usar elemento `<nav>` com nome acessível;
- listas de navegação devem usar semântica apropriada;
- controles de grupo devem informar `aria-expanded` e `aria-controls`;
- botão de recolhimento deve ter nome acessível dinâmico;
- item ativo deve usar `aria-current="page"`;
- itens planejados devem ser realmente não interativos ou usar `aria-disabled="true"` sem navegação;
- tooltips também devem funcionar por teclado;
- drawer deve possuir gerenciamento correto de foco;
- todas as ações devem ser utilizáveis por teclado;
- não colocar botão dentro de link ou link dentro de botão;
- respeitar zoom de 200%, textos longos e `prefers-reduced-motion`.

## Comportamento em erros

- se os dados do usuário falharem por sessão expirada, executar o fluxo de refresh existente;
- se a renovação falhar, limpar a sessão e redirecionar ao login;
- logout deve impedir cliques duplicados e apresentar estado de processamento;
- falha de logout no servidor não deve manter credenciais locais como se a sessão continuasse válida;
- erro em uma página interna não deve desmontar permanentemente o menu;
- adicionar um error boundary apenas se o projeto ainda não possuir um, sem ocultar erros silenciosamente.

## Testes obrigatórios

Use a infraestrutura de testes do frontend existente ou configure Vitest, React Testing Library e `user-event` sem duplicar ferramentas.

Teste, no mínimo:

1. renderização dos grupos e itens disponíveis;
2. badge e estado desabilitado dos itens planejados;
3. ausência de navegação ao selecionar item planejado;
4. destaque correto do item ativo;
5. expansão do grupo que contém a rota atual;
6. recolhimento e expansão da sidebar;
7. persistência da preferência visual;
8. abertura, fechamento, foco e tecla `Escape` no drawer mobile;
9. geração de breadcrumbs estáticos e dinâmicos;
10. redirecionamento de rota privada sem autenticação;
11. retorno seguro à rota solicitada após login;
12. logout pelo menu de usuário;
13. filtragem por permissão, somente se permissões já existirem;
14. página 404;
15. ausência de violações básicas de acessibilidade.

Não teste apenas snapshots. Prefira testes que simulem o comportamento do usuário.

## Critérios de aceite

A entrega será considerada completa somente se:

1. todas as páginas privadas existentes usarem o mesmo `AppLayout`;
2. desktop possuir sidebar expansível e recolhível;
3. mobile possuir drawer acessível e funcional;
4. Dashboard, Ativos e Sobre navegarem sem recarregar a página quando disponíveis;
5. itens futuros aparecerem como **Em breve** sem gerar links quebrados;
6. rota atual e breadcrumb forem resolvidos pelo catálogo central;
7. autenticação, retorno após login e logout continuarem funcionando;
8. menu não for usado como único mecanismo de autorização;
9. layout funcionar com textos longos, teclado, zoom e diferentes viewports;
10. não houver arrays duplicados de navegação;
11. lint, testes e build passarem sem erros;
12. módulos futuros não tiverem sido implementados acidentalmente.

## Não implementar agora

- regras de negócio dos itens marcados como planejados;
- páginas vazias apenas para fazer os links funcionarem;
- busca global;
- central de notificações;
- favoritos ou itens recentes;
- personalização da ordem do menu;
- catálogo de menu vindo do banco;
- editor administrativo de menu;
- troca de empresa, planta ou tenant;
- permissões novas caso ainda não existam;
- menu inferior mobile;
- microfrontends;
- dados mockados para módulos futuros.

## Execução e validação obrigatórias

Execute:

```bash
cd frontend
npm install
npm run lint
npm run build
npm test -- --run
```

Execute também os testes e o build existentes do backend para garantir que a reorganização de rotas e autenticação não quebrou contratos:

```bash
cd backend
dotnet restore
dotnet build --no-restore
dotnet test --no-build
```

Valide manualmente no navegador:

1. sidebar expandida e recolhida em desktop;
2. atualização da página preservando a preferência da sidebar;
3. drawer em larguras de celular e tablet;
4. navegação por Dashboard, Ativos e Sobre;
5. item ativo e breadcrumb em todas as rotas existentes;
6. itens **Em breve** sem navegação;
7. acesso direto a rota privada sem autenticação;
8. retorno à rota original após login;
9. logout;
10. página 404;
11. navegação completa apenas por teclado;
12. zoom de 200% e preferência de movimento reduzido.

## Ao finalizar

Informe:

1. o que foi criado;
2. árvore final de navegação;
3. estrutura de pastas alterada;
4. principais componentes e suas responsabilidades;
5. rotas disponíveis;
6. itens planejados;
7. estratégia adotada para item ativo e breadcrumbs;
8. integração com autenticação e permissões;
9. comportamento desktop e mobile;
10. testes executados e resultados;
11. erros encontrados e correções;
12. resultado do lint e build;
13. capturas de tela do menu expandido, recolhido e mobile.

Não considere a tarefa concluída se existirem links quebrados, arrays duplicados de menu, itens falsamente funcionais, páginas privadas fora do layout, problemas de teclado/foco ou build com erro.
