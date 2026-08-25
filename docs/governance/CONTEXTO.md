# CONTEXTO.md — Contexto Vivo do Projeto

**Projeto:** Dashboard Power BI
**Atualizado em:** 2026-08-25

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
- A expansão para exportação, CRUD administrativo e 2FA permanece como P1-03.

## 2026-08-25 — Configuração P0-03 de produção

- O arquivo `infra/env/.env.production.example` foi completado com as variáveis do `.env.example`, `NGINX_PORT` e os parâmetros específicos de Oracle, cache, TOTP e retenção.
- A configuração padrão documentada é `DATABASE_PROVIDER=oracle`, com `REDIS_HOST=redis`, `TRUST_PROXY_HOPS=1`, CORS pelo domínio público e nenhum segredo preenchido.
- `scripts/verify-env-examples.mjs` e `pnpm verify:env` passaram a proteger a cobertura e a segurança dos templates.
- A chave `TOTP_ENCRYPTION_KEY` permanece vazia no exemplo; P0-04 deverá exigir seu preenchimento no boot de produção.

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

O Dashboard Power BI é uma plataforma web interna de relatórios e BI em estado funcional avançado. O sistema entrega autenticação com JWT, dashboard com KPIs e gráficos Recharts, catálogo e execução de relatórios via SQL Server/Oracle, administração de usuários/grupos/permissões com herança via grupos, auditoria com retenção LGPD, exportações com pipeline real, notificações, settings, dashboards personalizados com editor visual drag-and-drop completo (react-grid-layout) e seed automático de dashboard padrão por setor, dashboard admin com gráficos de tendência (agregações temporais de audit logs, exports e usuários), 2FA/TOTP obrigatório para admins, hardening de sessão (token blacklist, token versioning, revogação), cache de queries SQL com TTL e LRU, política de retenção de logs com cron diário e baseline E2E validado com Playwright. As lacunas remanescentes são a expansão da cobertura E2E para fluxos adicionais e a evolução do drill-down multi-dimensão. O principal risco técnico é a dependência de fallback em memória quando Supabase não está configurado.

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

| Pendência                                                | Área      | Prioridade | Próxima ação                                            |
| -------------------------------------------------------- | --------- | ---------- | ------------------------------------------------------- |
| F-01: Typecheck API — mock incompleto em retention.spec  | Qualidade | Média      | Completar mock de ExportsService no spec                |
| F-02: Teste API — ConfigService sem método get() no mock | Qualidade | Média      | Adicionar mock de get() no ConfigService do spec        |
| F-10: Lint — 25 achados reais                            | Qualidade | Média      | **Resolvido em 2026-08-25** com `pnpm lint`             |
| F-11: Format — 387 arquivos com formatação incorreta     | Qualidade | Baixa      | **Resolvido em 2026-08-25** com `pnpm format`           |
| F-12: Redis — spam de erros ECONNREFUSED sem Redis local | Infra     | Média      | Silenciar erros de conexão Redis quando não configurado |
| Drill-down multi-dimensão                                | BI        | Média      | Já implementado mas dimensão pode ser mais flexível     |
| Expansão dos testes E2E (Playwright)                     | Qualidade | Média      | Ampliar cobertura para exportação, admin CRUD e 2FA     |

---

## 7. Bloqueios

| Bloqueio              | Severidade | Descrição                              | Dependência |
| --------------------- | ---------- | -------------------------------------- | ----------- |
| Nenhum bloqueio ativo | —          | O projeto está operacional e evoluindo | —           |

---

## 8. Riscos Técnicos

| Risco                                                    | Impacto | Mitigação                                                  |
| -------------------------------------------------------- | ------- | ---------------------------------------------------------- |
| Fallback em memória perde dados ao reiniciar             | Alto    | Garantir Supabase configurado em produção                  |
| Fila em memória não suporta múltiplas instâncias         | Baixo   | BullMQ + Redis já implementados com fallback               |
| `pnpm typecheck` falha sem artefatos de build do Next.js | Baixo   | Rodar `pnpm build` antes do typecheck                      |
| Testes E2E configurados (Playwright)                     | Baixo   | 7 testes E2E base em `tests/e2e/`, validados em 2026-08-25 |

---

## 9. Próximos Passos

1. Validação final de aderência ao escopo V1.
2. Validar com `pnpm verify:docs`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

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
