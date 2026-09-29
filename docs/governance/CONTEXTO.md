# CONTEXTO.md — Contexto Vivo do Projeto

**Projeto:** Dashboard Power BI
**Atualizado em:** 2026-09-29

## 2026-09-29 — Refinamento visual agro corporativo da home BI

- A home autenticada usa fundo natural claro, cartões brancos, verde floresta, verde petróleo e âmbar; a fonte é a pilha nativa do sistema. A paleta é provisória porque a marca oficial não forneceu tokens.
- A navegação autenticada vira menu acessível abaixo de 1024 px e barra lateral compacta fixa a partir desse ponto. A home apresenta cada resumo uma vez, identifica dados fictícios e período, e organiza gráfico principal, destaques, áreas e KPIs.
- Gráficos e componentes compartilhados usam cores, legendas, tooltips, eixos e foco alinhados. Rótulos legados “Talhoes” e “Operacoes” são normalizados somente na apresentação.
- Uma revisão em telas pequenas identificou que a altura integral de um cartão de KPI encobria os botões de drill-down; o estilo foi removido e o fluxo móvel foi coberto por E2E.
- Nenhum endpoint, banco, contrato ou valor de dado foi alterado. Especificação e critérios: `docs/specs/bi/SPEC-dashboard-visual-agro-corporativo.md`.
- Validação final: Web 43 suítes/147 testes, typecheck, build e E2E 8/8 aprovados; revisão visual a 390, 640, 1024 e 1440 px sem rolagem horizontal. Cores de texto medidas atendem contraste WCAG AA.

## 2026-09-29 — Realismo temporal da demonstração

- A série do dashboard demo cobre 12 meses. Para manter cartões, deltas e gráfico comparáveis, KPIs com data mensal devem mostrar o mês atual e comparar com o mês anterior, enquanto o histórico permanece em 12 pontos.
- Notificações, exportações e configurações mock devem usar datas espalhadas ao longo de vários meses; os eventos permanecem ordenados por data e respeitam a sequência de criação, conclusão, leitura e expiração.
- A Web identifica a janela temporal da série e mantém o aviso de dados fictícios. Nenhum schema, endpoint ou fonte Oracle/COMPASS é alterado por esta tarefa.
- Especificação e critérios: `docs/specs/transversal/SPEC-demo-dados-ampliados.md`; validação visual feita no Compose demo.

### Conclusão em 2026-09-29

- O fallback API agora distribui Produção, Comercial e Algodoeira em 12 competências mensais; os KPIs do demo mostram o mês atual, usam o mês anterior como comparação e mantêm as mesmas métricas na série histórica.
- Contratos fictícios usam retratos mensais datados. Linhas vindas de fonte que não forneça `DATA_CONTRATO` continuam no comparativo anual anterior.
- Notificações e exportações cobrem ao menos 300 dias; configurações cobrem oito competências e têm datas coerentes. O script SQL demo cria competências financeiras móveis dos últimos 12 meses.
- A home mostra `Histórico: últimos 12 meses` e prioriza uma métrica mensal para o gráfico de destaque. Nenhum dado real ou conexão com Oracle/COMPASS foi adicionada.

## 2026-09-29 — Dados fictícios ampliados para a demo

- A conta `viewer.diretoria@example.com` foi adicionada ao seed local como `viewer`, com consulta aos setores da demo e sem permissões administrativas; usa `AUTH_DEMO_USER_PASSWORD`.
- O fallback da home agora oferece 36 registros mensais por conjunto de plantio/colheita, 12 contratos, 24 embarques e mais categorias nos drill-downs. O limite de categorias agrupadas passou de 8 para 12.
- SQL Server demo: financeiro tem 36 linhas mensais; comercial 18; operações 12; diretoria 12. As telas mockadas da Web têm 12 KPIs, notificações e exportações; configurações têm 8 exemplos.
- Tudo foi gerado como dado fictício; não muda Oracle/COMPASS nem o contrato BI v1. A senha continua em `.env.demo` local e não é escrita na documentação.
- A especificação SDD está em `docs/specs/transversal/SPEC-demo-dados-ampliados.md`. Testes focados de dashboard, autenticação e fixtures Web, typecheck, build e validadores do workspace/env/Docker/docs passaram; smoke checks após rebuild confirmaram login geral, 12 KPIs, dimensões ampliadas e contagens SQL.

## 2026-09-29 — Auditoria do ambiente local Docker

- O Compose demo foi construído e iniciado localmente com Web, API, SQL Server demo e Redis; Web, API e healthcheck SQL responderam, e uma consulta autenticada leu três linhas da view financeira de demonstração.
- A home permite dados sintéticos no `DATA_MODE=mock`; o contrato BI v1 corretamente respondeu `not_configured` para a fonte `sqlserver-demo`. Oracle/COMPASS, snapshots e reconciliação seguem pendentes.
- `UsersRepository` mantém usuários em memória. No Compose demo, Supabase não está configurado e telas de notificações e histórico de exportações ainda usam o cliente legado de `app-data.ts`, em modo mock.
- Risco de demonstração: TOTP da conta admin é pré-ativado; com a chave de criptografia vazia no template demo, o código atual é escrito no log. O ambiente e as credenciais são exclusivamente locais.
- Divergência documental registrada: `docs/product/ESCOPO.md` ainda marca recursos presentes no runtime como pendentes. A auditoria e a ordem das lacunas foram registradas em `docs/audits/AUDITORIA_LOCAL_DOCKER_2026-09-29.md`.
- Nenhuma mudança funcional foi feita. Os validadores workspace, env, Docker e docs passaram antes desta edição; o smoke check da aplicação passou. Testes automatizados, typecheck, lint e build completos não foram executados nesta tarefa.

## 2026-08-25 — Hardening P0-04 da chave TOTP

- `TotpEncryptionService` agora rejeita a inicialização quando `NODE_ENV=production` e `TOTP_ENCRYPTION_KEY` está ausente, vazia ou composta apenas por espaços.
- O erro ocorre durante a instanciação do provider, antes de a API executar `listen`, e não inclui o valor da chave.
- Desenvolvimento, ambiente demo e testes continuam permitindo o fallback controlado para preservar a compatibilidade local.
- Foram adicionados testes para ausência, whitespace, produção válida, fallback fora de produção e criptografia/descriptografia.

## 2026-08-25 — Memória persistida do projeto

- Criado `docs/governance/MEMORIA_PROJETO.md` como pacote consolidado de contexto e histórico para handoff entre agentes e conversas.
- A memória separa o snapshot vigente e a linha do tempo técnica de `CONTEXTO.md`, que continua sendo a fonte de decisões e riscos atuais, e de `RELATORIO.md`, que continua sendo o diário formal das sessões.
- O protocolo exige leitura no início, conferência contra runtime e Git, registro ao final e proibição explícita de secrets, tokens, senhas, chaves privadas, `.env` reais e dados sensíveis.
- `scripts/verify-docs.mjs` passa a proteger a existência, as seções mínimas, o link no índice e a ausência de credenciais conhecidas.

## 2026-08-25 — Correção da dívida de lint P1-01

- O ESLint passou de 7.920 erros e 683 avisos aparentes para o diagnóstico real de 25 achados após a exclusão recursiva de `dist`, `.next`, `build`, `out`, cobertura e relatórios gerados.
- Foram corrigidos os 2 erros e 23 avisos reais em API, Web, testes e scripts; `pnpm lint` agora passa com zero erros e zero avisos.
- A configuração mantém exceção restrita de `no-console` apenas para scripts CLI de validação. O código de aplicação usa `console.warn` somente para o fallback de auditoria já existente.
- Typecheck, testes e build permaneceram aprovados; não houve alteração de contrato, banco, Docker ou fluxo de tela.

## 2026-08-25 — Padronização de formatação P1-02

- O Prettier foi aplicado aos 387 arquivos que estavam fora do padrão, usando a configuração vigente do projeto.
- `pnpm format:check` passou sem arquivos pendentes; não foram alterados contratos, comportamento funcional, banco, Docker ou telas.
- A política global de texto foi fixada em `LF` no `.gitattributes` para impedir que `core.autocrlf` reintroduza falsos desvios de formatação em novos checkouts Windows.
- A correção de lint P1-01 foi concluída separadamente da normalização de estilo P1-02.

## 2026-08-25 — Validação P0-02 do Playwright

- A configuração atual foi validada contra a Web em `3000` e a API demo em `3001`; os 7 cenários E2E atuais passaram.
- A expansão P1-03 foi concluída com 16 testes E2E; as credenciais administrativas são exigidas somente por variáveis de runtime.

## 2026-08-25 — Expansão P1-03 dos testes E2E

- A cobertura Playwright passou de 7 para 16 testes aprovados contra Web `3000` e API demo `3001`, preservando os cenários de autenticação, dashboard, drill-down e catálogo.
- Foram adicionados cenários de login administrativo com TOTP válido e inválido, bloqueio de usuário comum, listas de usuários e grupos, criação/exclusão de grupo, consulta, modal e solicitação de exportação, histórico/download e ciclo completo de 2FA.
- Os helpers exigem `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD` e `E2E_ADMIN_TOTP_SECRET` em runtime; nenhum segredo é gravado em teste, documentação ou commit.
- O E2E revelou duas lacunas de integração e elas foram corrigidas: validação dos campos TOTP nos DTOs da API e envio do Bearer pelo cliente Web nas chamadas autenticadas de configuração, verificação e desativação 2FA.
- O helper de grupos obtém o CSRF pelo contexto do navegador, sem desabilitar a proteção da API.
- No modo demo, a tela de histórico usa dados demonstrativos; a reconciliação entre o job recém-solicitado e o histórico persistido fica para a validação com dados reais.

## 2026-08-25 — Configuração P0-03 de produção

- O arquivo `infra/env/.env.production.example` foi completado com as variáveis do `.env.example`, `NGINX_PORT` e os parâmetros específicos de Oracle, cache, TOTP e retenção.
- A configuração padrão documentada é `DATABASE_PROVIDER=oracle`, com `REDIS_HOST=redis`, `TRUST_PROXY_HOPS=1`, CORS pelo domínio público e nenhum segredo preenchido.
- `scripts/verify-env-examples.mjs` e `pnpm verify:env` passaram a proteger a cobertura e a segurança dos templates.
- A chave `TOTP_ENCRYPTION_KEY` permanece vazia no exemplo por segurança, mas o boot de produção agora falha explicitamente até que a infraestrutura a forneça em ambiente seguro.

## 2026-08-24 — Docker demo e contrato BI v1

- O repositório foi clonado em `Dashboard_PowerBI_Gusmao`, preservando os documentos existentes no diretório pai.
- O Compose demo está operacional com SQL Server, API NestJS, Next.js e Redis.
- O entrypoint do SQL Server passou a normalizar CRLF para LF durante o build, evitando falha de shebang em checkout Windows.
- A API ganhou `apps/api/src/bi`, com contrato versionado, fonte substituível, frescor, filtros, resumo de produção Oracle e refresh idempotente.
- O dashboard legado só usa números sintéticos quando `DATA_MODE=mock`; BI v1 não mascara indisponibilidade.
- Oracle/COMPASS permanece aguardando rede, host, service name e usuário somente leitura do cliente.
  **Responsável pela atualização:** Agente IA / Desenvolvedor

---

## 1. Resumo Executivo

O Dashboard Power BI é uma plataforma web interna de relatórios e BI em estado funcional avançado. O sistema entrega autenticação com JWT, dashboard com KPIs e gráficos Recharts, catálogo e execução de relatórios via SQL Server/Oracle, administração de usuários/grupos/permissões com herança via grupos, auditoria com retenção LGPD, exportações com pipeline real, notificações, settings, dashboards personalizados com editor visual drag-and-drop completo (react-grid-layout) e seed automático de dashboard padrão por setor, dashboard admin com gráficos de tendência (agregações temporais de audit logs, exports e usuários), 2FA/TOTP obrigatório para admins, hardening de sessão (token blacklist, token versioning, revogação), cache de queries SQL com TTL e LRU, política de retenção de logs com cron diário e cobertura E2E de 16 testes. As lacunas remanescentes são a evolução do drill-down multi-dimensão e a validação produtiva com Oracle/COMPASS. O principal risco técnico é a dependência de fallback em memória quando Supabase não está configurado.

---

## 2. Estado Atual do Projeto

| Área           | Status             | Observações                                                                                             |
| -------------- | ------------------ | ------------------------------------------------------------------------------------------------------- |
| Backend        | Funcional avançado | NestJS com módulos ativos; repositórios híbridos (Supabase + memória); 305 testes (304 passam, 1 falha) |
| Frontend       | Funcional avançado | Next.js 14 com 18 telas implementadas (18 concluídas, 0 parciais, 0 pendentes); 142 testes (142 passam) |
| Banco de dados | Funcional parcial  | 8 migrations Supabase aplicadas; SQL Server/Oracle externo para relatórios                              |
| Testes         | Estável            | `pnpm test` web 142/142; API 304/305; typecheck API com 2 erros TS em spec; build OK                    |
| Infraestrutura | Funcional          | Docker Compose dev/prod; GitHub Actions para deploy VPS                                                 |
| Documentação   | Atualizada         | Governança consolidada; auditoria de runtime em 2026-06-29                                              |
| Segurança      | Avançado           | JWT, bcrypt 12, CSRF, helmet, 2FA obrigatório para admins, token blacklist, versioning                  |
| BI             | Avançado           | KPIs, charts Recharts, drill-down, editor visual completo, cache de queries, retenção                   |

---

## 3. Histórico de Desenvolvimento

### 2026-07-02 — Correção de Testes Web e Auditoria Completa

- **O que foi analisado:** Suite completa de testes web (142 testes), typecheck API, testes API (305), build, infraestrutura Docker.
- **O que foi decidido:**
  - Corrigir 7 falhas de testes web (F-03 a F-09) identificadas em `docs/audits/FALHAS.md`.
  - Auditar projeto completo para identificar novas falhas.
  - Avaliar viabilidade de Docker Compose para testes locais.
- **O que foi corrigido:**
  - F-03: `getApiUrl` não mockada em `platform-api.test.ts`.
  - F-04: Path do mock incorreto em `kpi-card.test.tsx` (`@/components/charts` → `@/components/charts/sparkline-chart`).
  - F-05: Texto "Usuários" (acentuado) → "Usuarios" (ASCII) em `authenticated-layout.test.tsx`.
  - F-06: Fluxo de exportação em 2 passos não coberto em `report-detail.test.tsx`.
  - F-07: Mock de Supabase browser inadequado em `notifications-list.test.tsx`.
  - F-08: Mesmo problema em `exports-list.test.tsx`.
  - F-09: Mesmo problema em `admin-settings.test.tsx`.
- **Estado final dos testes:**
  - Web: 142/142 passando (43 suites).
  - API: 304/305 passando (1 falha: `report-definitions.repository.spec.ts`).
  - Typecheck API: 2 erros TS em `retention.service.spec.ts` (mock incompleto).
  - Build: passa para ambos API e Web.
- **Docker Compose avaliado:**
  - `docker-compose.dev.yml`: api + web + redis, funcional para dev local.
  - `docker-compose.demo.yml`: sqlserver + api + web + redis, requer `.env.demo` (não versionado).
  - `docker-compose.prod.yml`: api + web + redis + nginx, requer `.env.production`.
  - Dockerfiles dev e prod estão corretos e prontos para uso.

### 2026-06-28 — Consolidação de Governança do Repositório

- **O que foi analisado:** Estrutura completa do repositório, runtime real (app.module.ts, migrations, docs existentes), escopo V1 do PDF, análise de aderência, roadmap existente.
- **O que foi decidido:**
  - Consolidar arquivos de governança na raiz como fontes canônicas únicas.
  - Converter `docs/architecture.md` e `HANDOFF.md` em stubs apontando para os novos arquivos.
  - Remover referências a `SPRINT_STATUS.md` (arquivo inexistente).
  - Mesclar estruturas do AGENTS.md (preservar regras atuais + adicionar SDD, TDD, checklist, conduta).
- **O que foi criado:**
  - `ARQUITETURA.md` — arquitetura completa do sistema.
  - `BANCO_DADOS.md` — arquitetura completa do banco de dados.
  - `ESCOPO.md` — escopo consolidado do projeto.
  - `CONTEXTO.md` — contexto vivo do projeto (este arquivo).
  - `RELATORIO.md` — registro diário de desenvolvimento.
- **O que foi alterado:**
  - `AGENTS.md` — mesclagem de estruturas, remoção de referências a SPRINT_STATUS.md e HANDOFF.md.
  - `ROADMAP.md` — adição de convenções de status, backlog geral, matriz SDD/TDD e definição de pronto.
- **O que ficou pendente:**
  - Validar com `pnpm verify:docs`.
- **Evidências no repositório:** Novos arquivos na raiz; AGENTS.md e ROADMAP.md atualizados; docs/architecture.md e HANDOFF.md convertidos em stubs; README.md atualizado.

### 2026-06-10 — Entrega do Dashboard Administrativo e Editor Visual Mínimo

- **O que foi analisado:** Necessidade de dashboard admin com KPIs reais e editor visual de dashboards.
- **O que foi decidido:**
  - Implementar dashboard admin com métricas operacionais reais (total de usuários, ativos, grupos, exportações).
  - Implementar editor visual mínimo com reordenação drag-and-drop via `@dnd-kit/sortable`.
- **O que foi criado:**
  - `apps/api/src/admin/dashboard/admin-dashboard.service.ts` e controller.
  - `apps/web/src/components/dashboard/sortable-widget-card.tsx` (wrapper DnD).
  - `apps/api/src/platform/dashboards/dto/reorder-widgets.dto.ts`.
  - Endpoint `PATCH /dashboards/:id/widgets/reorder`.
- **O que foi alterado:**
  - `apps/web/src/components/dashboard/dashboard-detail.tsx` (modo edição + DnD).
  - `apps/web/src/components/dashboard/widget-card.tsx` (card extraído).
- **O que ficou pendente:**
  - Redimensionamento de widgets.
  - Canvas livre / grid de 12 colunas interativo.
  - Versões de dashboard.
  - Gráficos de tendência no dashboard admin.

### 2026-06-07 — Persistência de Definições de Relatórios e Favoritos

- **O que foi decidido:**
  - Garantir unicidade lógica das definições de relatório (source_name + sector).
  - Criar `api_favorite_reports` alinhada ao contrato da API.
- **O que foi criado:**
  - `supabase/migrations/20260607113000_005_report_definitions_unique_source_sector.sql`.
  - `supabase/migrations/20260607183000_006_api_favorite_reports.sql`.

### 2026-06-05 — Centralização da API e Persistência Supabase

- **O que foi decidido:**
  - API NestJS como fonte oficial de todos os fluxos autenticados.
  - Frontend deixa de depender de leituras diretas do Supabase.
  - Sessão web migra de `localStorage` para `sessionStorage`.
  - Persistência de plataforma via Supabase com fallback em memória.
- **O que foi criado:**
  - `PlatformModule`, `PermissionsModule`, `AuditModule`, `CommonModule` integrados ao AppModule.
  - Migrations 004-006 (api_platform_tables, permissions_table, audit_logs_table).
  - Endpoints `GET /auth/me`, `PATCH /auth/me/password`.
  - Middleware CSRF e headers de segurança.
  - Tela de perfil do usuário (`/app/profile`).
  - Tela de gestão de permissões (`/app/admin/permissions`).
  - Tela de auditoria (`/app/admin/audit`).
  - React Query integrado ao frontend.
- **O que foi alterado:**
  - `apps/web/src/lib/auth/session.ts` — sessionStorage + refresh automático único em 401.
  - `apps/api/src/app.module.ts` — novos módulos adicionados.

### 2026-06-04 — Fundação Técnica (Fase 0)

- **O que foi decidido:**
  - Monorepo pnpm com apps/api e apps/web.
  - NestJS como backend, Next.js 14 como frontend.
  - Docker Compose para dev e prod.
  - GitHub Actions para CI/CD.
  - Supabase como persistência de plataforma.
  - SQL Server como origem de leitura para relatórios.
- **O que foi criado:**
  - Estrutura de monorepo, Dockerfiles, docker-compose.
  - Migrations 001-003 (auth, reports/dashboards, exports/settings).
  - API NestJS com auth, admin, reports, health.
  - Web Next.js com login, dashboard, relatórios, admin básico.
  - ADRs em `docs/decisions/`.

---

## 4. Decisões Técnicas e Arquiteturais

| Data       | Decisão                                                      | Motivo                                              | Impacto                                                                                                                   | Status |
| ---------- | ------------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------ |
| 2026-06-04 | Monorepo pnpm com apps/api e apps/web                        | Organização e compartilhamento de configs           | Estrutura base do projeto                                                                                                 | Ativa  |
| 2026-06-04 | NestJS como API backend                                      | Framework modular TypeScript com DI                 | ADR-0003                                                                                                                  | Ativa  |
| 2026-06-04 | Next.js 14 App Router como frontend                          | SSR/SSG, SEO, ecossistema React                     | ADR-0004                                                                                                                  | Ativa  |
| 2026-06-04 | Docker Compose para dev e prod                               | Padronização de ambiente                            | ADR-0006                                                                                                                  | Ativa  |
| 2026-06-04 | Supabase como persistência de plataforma                     | PostgreSQL gerenciado com RLS                       | Repositórios híbridos                                                                                                     | Ativa  |
| 2026-06-04 | SQL Server como origem de leitura (somente SELECT/EXEC)      | Segurança e isolamento                              | Camada `sql-server/*`                                                                                                     | Ativa  |
| 2026-06-05 | Centralização na API como fonte oficial                      | Eliminar dependência direta do frontend no Supabase | Frontend consome apenas API                                                                                               | Ativa  |
| 2026-06-05 | Sessão web em sessionStorage                                 | Segurança de sessão                                 | Migração de legado + refresh em 401                                                                                       | Ativa  |
| 2026-06-05 | Recharts para gráficos                                       | Biblioteca React para charts interativos            | Componentes em `components/charts/`                                                                                       | Ativa  |
| 2026-06-05 | React Query para data fetching                               | Cache, sync e refetch automático                    | `@tanstack/react-query` no layout                                                                                         | Ativa  |
| 2026-06-05 | 2FA/TOTP com otplib                                          | Segurança de autenticação                           | Setup, verify, disable, login TOTP                                                                                        | Ativa  |
| 2026-06-11 | BullMQ + Redis para pipeline de exports                      | Fila assíncrona com fallback em memória             | Queue + Worker com ioredis                                                                                                | Ativa  |
| 2026-06-10 | @dnd-kit/sortable para editor visual                         | Drag-and-drop acessível e modular                   | Reordenação de widgets                                                                                                    | Ativa  |
| 2026-06-28 | Consolidação de governança na raiz                           | Fontes canônicas únicas de documentação             | 7 arquivos de governança na raiz                                                                                          | Ativa  |
| 2026-06-28 | Correção do CSRF middleware (F-C01)                          | Desbloquear operações state-changing na API         | cookie-parser, CORS credentials, header x-csrf-token no frontend, exclusões de rotas auth                                 | Ativa  |
| 2026-06-28 | Correção do refresh token para todos os usuários (F-C02)     | Desbloquear renovação de sessão para não-demos      | `findAllActive()` no repositório, remoção de `getUsersWithActiveSessions`                                                 | Ativa  |
| 2026-06-28 | Correção do path traversal no download de exports (F-C03)    | Prevenir leitura arbitrária de arquivos do servidor | Validação de fileName (regex UUID+ext), `path.resolve()` + `relative()` contra storageDir                                 | Ativa  |
| 2026-06-28 | Correção do timing attack no JWT (F-C04)                     | Prevenir forja de tokens via análise de tempo       | `crypto.timingSafeEqual` na comparação de assinatura JWT                                                                  | Ativa  |
| 2026-06-29 | Correção do @Query por @Param no AuditController (F-A01)     | Rota GET /admin/audit/:id funcionar corretamente    | Troca de `@Query('id')` por `@Param('id')`                                                                                | Ativa  |
| 2026-06-29 | TwoFactorGuard inconsistente entre controllers admin (F-A02) | Padronizar exigência de 2FA em todas rotas admin    | `TwoFactorGuard` adicionado em `SettingsController`, `PermissionsController` e `AuditController`                          | Ativa  |
| 2026-06-29 | DTOs com class-validator no dashboards controller (F-A03)    | Validar payload dos endpoints de dashboards         | 5 DTOs criados: `CreateDashboardDto`, `UpdateDashboardDto`, `CreateWidgetDto`, `UpdateWidgetDto`, `BatchUpdateWidgetsDto` | Ativa  |
| 2026-06-29 | Alinhar contrato batch update widgets (F-A04)                | Batch update funcionar entre frontend e backend     | Backend agora aceita `{ items: [...] }` via `BatchUpdateWidgetsDto`                                                       | Ativa  |
| 2026-06-29 | DTO com whitelist de keys no settings (F-A05)                | Prevenir modificação de settings sensíveis          | `UpdateSettingDto` com `@IsIn(ALLOWED_SETTING_KEYS)` e `@IsObject()` no value                                             | Ativa  |
| 2026-06-29 | Correção do memory mode em exports (F-A06)                   | Download funcionar em modo desenvolvimento          | `ensureMockFile()` gera arquivo mock no storageDir com conteúdo válido por extensão                                       | Ativa  |
| 2026-06-29 | CORS via env var (F-A07)                                     | Frontend acessar API em produção                    | `CORS_ORIGINS` env var com fallback para localhost (já implementado na sessão F-C01)                                      | Ativa  |
| 2026-06-29 | Filtro por setor no dashboard controller (F-A08)             | Isolamento de dados por setor                       | `@CurrentUser()` injetado; `filterKpisBySectors` mapeia `SectorCode` → `BusinessArea`; `diretoria` e vazio veem tudo      | Ativa  |

---

## 5. Decisões de Produto e Escopo

| Data       | Decisão                                    | Motivo                     | Impacto                                     |
| ---------- | ------------------------------------------ | -------------------------- | ------------------------------------------- |
| 2026-06-04 | V1 é single-tenant                         | Simplificação do MVP       | Sem multi-tenancy nesta versão              |
| 2026-06-04 | V1 conecta apenas ao SQL Server            | Foco no banco do cliente   | Oracle/MySQL no roadmap V2                  |
| 2026-06-04 | App mobile fora do V1                      | Foco no web responsivo     | Mobile no roadmap V2 (PWA ou React Native)  |
| 2026-06-05 | 2FA opcional (não obrigatório para admins) | Facilitar adoção inicial   | Risco de segurança a ser revisado na Fase 4 |
| 2026-06-10 | Editor visual mínimo (apenas reordenação)  | Entregar valor incremental | Redimensionamento e paleta como débito      |

---

## 6. Pendências Atuais

| Pendência                                                | Área      | Prioridade | Próxima ação                                                       |
| -------------------------------------------------------- | --------- | ---------- | ------------------------------------------------------------------ |
| F-01: Typecheck API — mock incompleto em retention.spec  | Qualidade | Média      | Completar mock de ExportsService no spec                           |
| F-02: Teste API — ConfigService sem método get() no mock | Qualidade | Média      | Adicionar mock de get() no ConfigService do spec                   |
| F-10: Lint — 25 achados reais                            | Qualidade | Média      | **Resolvido em 2026-08-25** com `pnpm lint`                        |
| F-11: Format — 387 arquivos com formatação incorreta     | Qualidade | Baixa      | **Resolvido em 2026-08-25** com `pnpm format`                      |
| F-12: Redis — spam de erros ECONNREFUSED sem Redis local | Infra     | Média      | Silenciar erros de conexão Redis quando não configurado            |
| Drill-down multi-dimensão                                | BI        | Média      | Já implementado mas dimensão pode ser mais flexível                |
| Expansão dos testes E2E (Playwright)                     | Qualidade | Média      | **Resolvido em 2026-08-25** com 16 testes contra Web 3000/API 3001 |

---

## 7. Bloqueios

| Bloqueio              | Severidade | Descrição                              | Dependência |
| --------------------- | ---------- | -------------------------------------- | ----------- |
| Nenhum bloqueio ativo | —          | O projeto está operacional e evoluindo | —           |

---

## 8. Riscos Técnicos

| Risco                                                    | Impacto | Mitigação                                                                     |
| -------------------------------------------------------- | ------- | ----------------------------------------------------------------------------- |
| Fallback em memória perde dados ao reiniciar             | Alto    | Garantir Supabase configurado em produção                                     |
| Fila em memória não suporta múltiplas instâncias         | Baixo   | BullMQ + Redis já implementados com fallback                                  |
| `pnpm typecheck` falha sem artefatos de build do Next.js | Baixo   | Rodar `pnpm build` antes do typecheck                                         |
| Testes E2E configurados (Playwright)                     | Baixo   | 16 testes em `tests/e2e/`, com credenciais administrativas somente em runtime |

---

## 9. Próximos Passos

1. Adicionar o step de build no CI (P1-04).
2. Validar a integração Oracle/COMPASS quando a infraestrutura fornecer acesso somente leitura.
3. Preservar a suíte E2E com `pnpm test:e2e:playwright` e credenciais somente em runtime.

---

## 10. Notas Importantes para Próximos Agentes

- Sempre ler este arquivo antes de trabalhar.
- Sempre atualizar este arquivo ao final da sessão.
- Não remover histórico antigo.
- Registrar decisões, bloqueios e mudanças de direção.
- O `AGENTS.md` é a fonte de regras de execução; este arquivo é a fonte de contexto e histórico.
- O `ROADMAP.md` é a fonte única de direção do projeto.
- O `RELATORIO.md` é o registro diário do que foi feito.
- Prevalece sempre o runtime atual sobre documentação antiga ou expectativas do PDF.
