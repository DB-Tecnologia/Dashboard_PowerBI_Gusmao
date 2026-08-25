# AUDITORIA_PROJETO.md — Auditoria Completa do Projeto

**Projeto:** Dashboard Power BI
**Data da auditoria:** 2026-07-20
**Auditor:** Rui Diniz

> **Atualização em 2026-08-25:** a configuração do Playwright foi validada contra a Web em `3000` e a API demo em `3001`; os 7 cenários existentes passaram. As referências abaixo a uma porta incorreta representam o estado observado na auditoria original e foram superadas por esta validação; a limitação de cobertura adicional permanece em P1-03.

> **Atualização P0-03 em 2026-08-25:** `infra/env/.env.production.example` está versionado e foi completado com as variáveis de produção, Oracle como fonte padrão e sem credenciais demo. A validação automatizada está em `pnpm verify:env`; P0-04 ainda cobre a exigência de TOTP no boot.

---

## 1. Resumo Executivo

O Dashboard Power BI é uma plataforma web interna de relatórios e BI que centraliza relatórios de um sistema desktop em uma interface web segura. O projeto está em estado **funcional avançado**, com a maioria dos fluxos principais implementada, testada e integrada entre frontend e backend.

A auditoria baseada em evidências de código confirma que **58 dos 72 requisitos identificados estão concluídos**, 8 são parciais e 6 não foram iniciados. O projeto entrega autenticação completa com JWT, 2FA/TOTP obrigatório para admins, dashboard com KPIs e gráficos Recharts, drill-down multi-dimensão, dashboards personalizados com editor visual drag-and-drop, catálogo e execução de relatórios, pipeline de exportação com BullMQ+Redis, administração completa de usuários/grupos/permissões, auditoria com retenção LGPD, e infraestrutura Docker para dev e prod.

As principais lacunas são: lint com 1129 erros, formatação incorreta em 187 arquivos, testes E2E limitados, ausência de observabilidade estruturada, HTTPS/TLS não configurado no nginx, e funcionalidades de menor prioridade como export de dashboard como imagem e compartilhamento entre usuários.

---

## 2. Descrição do Projeto

Plataforma web interna que centraliza relatórios de um sistema desktop acessível apenas localmente, oferecendo acesso autenticado via navegador, com perfis (Visualizador, Downloader, Administrador), permissões por setor, dashboards com gráficos interativos e pipeline de exportação auditado.

**Público-alvo:** Usuários internos de uma organização agrícola (produção, comercial, algodoeira).

**Problema resolvido:** Dificuldade de acesso remoto, falta de controle granular, ausência de dashboards interativos, inexistência de trilha de auditoria.

---

## 3. Stack Identificada

### Backend

- Node.js 20+, NestJS 10, TypeScript strict
- JWT + refresh token, bcrypt (12 rounds), otplib (2FA/TOTP)
- SQL Server via `mssql`, Oracle via `oracledb` (alternativa)
- Supabase (PostgreSQL) via `@supabase/supabase-js`
- BullMQ + ioredis para fila de exports
- Jest + Supertest para testes
- Helmet, cookie-parser, CSRF middleware

### Frontend

- Next.js 14 (App Router), TypeScript strict
- Tailwind CSS, componentes locais
- Recharts (gráficos), @dnd-kit (drag-and-drop), react-grid-layout
- @tanstack/react-query (data fetching)
- Jest + Testing Library

### Infraestrutura

- pnpm workspaces (monorepo)
- Docker Compose (dev, demo, prod)
- GitHub Actions (CI + deploy VPS via SSH)
- Nginx como reverse proxy em produção
- Redis 7.4 para BullMQ e token blacklist

---

## 4. Documentos Analisados

- `README.md`
- `AGENTS.md`
- `docs/product/ESCOPO.md`
- `ROADMAP.md`
- `docs/governance/CONTEXTO.md`
- `docs/architecture/ARQUITETURA.md`
- `docs/architecture/BANCO_DADOS.md`
- `docs/audits/ANALISE_ESCOPO_V1.md`
- `docs/reference/api.md`
- `docs/reference/web.md`
- `docs/KPIS.md`
- `docs/DB_ORACLE.md`
- `docs/audits/FALHAS.md`
- `docs/operations/ROADMAP_FALHAS.md`
- `docs/specs/` (37 arquivos)
- `docs/roadmap/` (3 arquivos)
- `docs/decisions/` (7 ADRs)
- `infra/env/.env.example`
- `infra/env/.env.demo.example`
- `supabase/migrations/` (12 migrations)
- `.github/workflows/ci.yml`
- `.github/workflows/deploy-vps.yml`

---

## 5. Escopo Consolidado

O escopo V1 prevê 18 telas e 6 módulos funcionais (Auth, Permissões, SQL Server, Relatórios, BI, Admin). O estado real entrega todas as 18 telas em nível funcional, com 6 módulos parcialmente completos (lacunas em funcionalidades avançadas de menor prioridade).

---

## 6. Metodologia da Auditoria

A auditoria foi realizada em 13 etapas:

1. Inventário documental (leitura de toda documentação)
2. Inventário técnico (estrutura do repositório, stack)
3. Consolidação dos requisitos (72 requisitos identificados)
4. Mapeamento requisito vs implementação (leitura de código-fonte)
5. Análise funcional por módulo
6. Análise técnica (backend, frontend, banco)
7. Avaliação de resultados de build e testes (baseado em `FALHAS.md`)
8. Avaliação de segurança
9. Avaliação de infraestrutura
10. Cálculo ponderado
11. Identificação de pendências
12. Plano de conclusão
13. Geração de arquivos finais

**Critério:** Uma funcionalidade só é considerada concluída quando há evidência de código funcional, não apenas existência de arquivo ou declaração em documentação.

---

## 7. Percentual Geral

### Cálculo ponderado por área

| Área                            | Peso     | % Concluído | Contribuição |
| ------------------------------- | -------- | ----------- | ------------ |
| Funcionalidades principais      | 30%      | 88%         | 26.4%        |
| Regras de negócio               | 15%      | 85%         | 12.75%       |
| Back-end e APIs                 | 10%      | 88%         | 8.8%         |
| Front-end e experiência         | 10%      | 87%         | 8.7%         |
| Banco de dados e integridade    | 8%       | 82%         | 6.56%        |
| Auth, autorização e segurança   | 8%       | 90%         | 7.2%         |
| Integrações externas            | 5%       | 75%         | 3.75%        |
| Testes e qualidade              | 5%       | 65%         | 3.25%        |
| Infra, deploy e observabilidade | 5%       | 60%         | 3.0%         |
| Documentação e operação         | 4%       | 85%         | 3.4%         |
| **Total geral**                 | **100%** |             | **83.81%**   |

---

## 8. Percentual do MVP

O MVP (funcionalidades críticas: auth, relatórios, dashboard básico, admin básico) está **~90% concluído**.

---

## 9. Percentual por Módulo

| Módulo        | % Concluído | Status                   |
| ------------- | ----------- | ------------------------ |
| AUTH          | 92%         | Funcional com ressalvas  |
| PERMISSIONS   | 82%         | Funcional com ressalvas  |
| SQL/DATABASE  | 72%         | Funcional com pendências |
| REPORTS       | 82%         | Funcional com ressalvas  |
| BI/DASHBOARD  | 82%         | Funcional com ressalvas  |
| ADMIN         | 80%         | Funcional com ressalvas  |
| NOTIFICATIONS | 82%         | Funcional                |
| EXPORTS       | 85%         | Funcional                |
| INFRA/TESTS   | 55%         | Parcial                  |

---

## 10. Percentual Técnico

**Completude técnica: 82%**

O backend é modular, bem estruturado, com guards, DTOs, validação e separação de camadas. O frontend tem 18 telas com estados de loading/erro/vazio. O banco tem 12 migrations coerentes. A infraestrutura tem Docker Compose para 3 ambientes e CI/CD.

Lacunas técnicas: lint (1129 erros), formatação (187 arquivos), testes E2E limitados (6 testes), sem observabilidade estruturada, sem TLS no nginx.

---

## 11. Percentual Funcional

**Completude funcional: 88%**

Todos os fluxos principais (login, dashboard, relatórios, exportação, admin) estão funcionais e integrados entre frontend e backend. As lacunas funcionais são em features de menor prioridade (export dashboard como imagem, compartilhamento, alertas em tempo real, cron de refresh).

---

## 12. Prontidão para Produção

**Prontidão para produção: 65%**

Bloqueadores para produção:

- Lint com 1129 erros (qualidade de código)
- TLS/HTTPS não configurado no nginx
- Sem observabilidade estruturada (logs, métricas, alertas)
- Sem backup configurado para Supabase
- Sem estratégia de rollback documentada
- Testes E2E limitados
- `.env.production.example` foi completado; ainda faltam segredos reais fornecidos por ambiente seguro e validação obrigatória de TOTP no boot

---

## 13. Memória de Cálculo

### Cálculo por requisito (amostra dos principais)

```
AUTH-001 (15% peso módulo): 95% × 15% = 14.25%
AUTH-002 (10%): 95% × 10% = 9.5%
AUTH-003 (5%): 90% × 5% = 4.5%
...
PERM-001 (8%): 95% × 8% = 7.6%
SQL-001 (8%): 90% × 8% = 7.2%
SQL-006 (5%): 70% × 5% = 3.5%
REP-001 (8%): 90% × 8% = 7.2%
BI-001 (8%): 90% × 8% = 7.2%
BI-008 (5%): 80% × 5% = 4.0%
INFRA-006 (2%): 10% × 2% = 0.2%
TEST-004 (2%): 25% × 2% = 0.5%
```

### Cálculo por área (consolidado)

```
Funcionalidades principais (30%): 88% médio → 26.4%
Regras de negócio (15%): 85% médio → 12.75%
Back-end e APIs (10%): 88% → 8.8%
Front-end (10%): 87% → 8.7%
Banco (8%): 82% → 6.56%
Segurança (8%): 90% → 7.2%
Integrações (5%): 75% → 3.75%
Testes (5%): 65% → 3.25%
Infra (5%): 60% → 3.0%
Documentação (4%): 85% → 3.4%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: 83.81% ≈ 84%
```

---

## 14. Matriz de Requisitos

Ver arquivo `docs/audits/MATRIZ_REQUISITOS.md` para a tabela completa de 72 requisitos.

---

## 15. Funcionalidades Concluídas

- **Login** com JWT + refresh token + rate limiting — `auth.controller.ts:46-56`
- **Refresh token** com rotação e hash bcrypt — `auth.service.ts:78-91`
- **Logout** com revogação + blacklist de access token — `auth.controller.ts:83-111`
- **Revogação de todas as sessões** (token versioning) — `auth.controller.ts:113-131`
- **Recuperação de senha** com token temporário — `password-reset.service.ts`
- **2FA/TOTP** completo (setup, verify, disable, login) — `auth.controller.ts:153-195`
- **2FA obrigatório para admins** — `two-factor.guard.ts:21-35`
- **Perfil do usuário** (GET /auth/me, PATCH /auth/me/password) — `auth.controller.ts:133-151`
- **CSRF middleware** (double-submit pattern) — `csrf.middleware.ts`
- **Headers de segurança** (helmet: CSP, HSTS, X-Frame-Options, etc) — `main.ts:26`
- **Sessão em sessionStorage** com refresh automático — `apps/web/src/lib/auth/session.ts`
- **Dashboard home** com payload consolidado de BI — `dashboard.controller.ts:17-21`
- **Drill-down multi-dimensão** (8 dimensões selecionáveis) — `dashboard.controller.ts:29-37`
- **Histórico de KPI** (12 meses) — `dashboard.controller.ts:39-43`
- **Gráficos Recharts** (bar, line, pie, area) — `apps/web/src/components/charts/*`
- **Dashboards personalizados** (CRUD completo) — `dashboards.controller.ts`
- **Editor visual drag-and-drop** (react-grid-layout, redimensionamento) — `dashboard-canvas.tsx`
- **Dashboard padrão por setor** (seed automático) — `dashboards.controller.ts:24-36`
- **Catálogo de relatórios** com busca e paginação — `reports.controller.ts:23-33`
- **Visualização inline** com parâmetros — `reports.controller.ts:62-70`
- **Filtros avançados** — `report-advanced-filters.tsx`
- **Favoritos de relatórios** — `report-favorites.service.ts`
- **Gestão admin de relatórios** (CRUD, parâmetros, validação) — `report-definitions.admin.controller.ts`
- **Exportação** PDF/XLSX/CSV/JSON com pipeline — `exports.service.ts`, `export-file-builder.service.ts`
- **Fila BullMQ + Redis** com fallback em memória — `exports.processor.ts`
- **Download autenticado** com proteção path traversal — `exports.service.ts:40-60`
- **CRUD de usuários** — `apps/api/src/admin/users/*`
- **CRUD de grupos** — `apps/api/src/admin/groups/*`
- **CRUD de permissões** granulares — `permissions.controller.ts`
- **Herança de permissões via grupos** — `effective-permissions.service.ts`
- **Guard combinado** JWT + role + permission — `permissions.guard.ts`
- **Auditoria** com filtros (usuário, ação, recurso, período) — `audit.controller.ts`
- **Retenção LGPD** (cron diário, anonimização) — `retention.service.ts`
- **Direitos do titular** (anonimização, portabilidade) — `retention.controller.ts`, admin endpoints
- **Dashboard administrativo** com KPIs e tendências — `admin-dashboard.service.ts`
- **Configurações do sistema** editáveis via API — `settings.controller.ts`
- **Notificações** (listagem, marcar como lida) — `notifications.controller.ts`
- **Healthchecks** (API + SQL Server/Oracle) — `health.service.ts`
- **Swagger/OpenAPI** — `main.ts:45-53`
- **Cache de queries** com TTL e LRU — `query-cache.service.ts`
- **Cache admin** (invalidate, stats) — `query-cache.controller.ts`
- **Docker Compose** dev, demo, prod — `infra/docker/`
- **CI/CD** GitHub Actions — `.github/workflows/`
- **Nginx** reverse proxy em produção — `infra/docker/nginx/default.conf`
- **Oracle** como provedor alternativo — `oracle.service.ts`, `database-provider.service.ts`

---

## 16. Funcionalidades Parciais

| Funcionalidade                       | %   | Pendência                                                                                     |
| ------------------------------------ | --- | --------------------------------------------------------------------------------------------- |
| SMTP envio real de e-mails           | 50% | `SMTP_MODE=mock` no env example; envio real não confirmado                                    |
| Testes E2E (Playwright)              | 70% | 7 testes de baseline (auth, dashboard, drill-down e relatórios); cobertura adicional pendente |
| Lint                                 | 25% | 1129 erros, 426 warnings                                                                      |
| Formatação Prettier                  | 10% | 187 arquivos com formatação incorreta                                                         |
| Observabilidade                      | 10% | Apenas logs NestJS nativos; sem métricas/tracing/alertas                                      |
| HTTPS/TLS produção                   | 50% | Nginx configurado mas sem SSL/TLS                                                             |
| Monitoramento de queries             | 25% | Timeout configurável, sem logs estruturados de performance                                    |
| Bloqueio por inatividade no frontend | 50% | Timeout no refresh, sem bloqueio proativo no frontend                                         |
| Governança completa                  | 50% | Auditoria, permissões, settings, retenção ativos, mas cobertura incompleta                    |

---

## 17. Funcionalidades Não Iniciadas

| Funcionalidade                                               | Origem    |
| ------------------------------------------------------------ | --------- |
| Cron de refresh agendado de relatórios/KPIs                  | ESCOPO.md |
| Storage S3 para arquivos de exportação                       | ESCOPO.md |
| Exportar dashboard como imagem/PDF                           | ESCOPO.md |
| Compartilhamento de dashboards entre usuários do mesmo grupo | ESCOPO.md |
| Alertas de segurança em tempo real                           | ESCOPO.md |
| Sistema de monitoramento estruturado (Datadog/Grafana)       | ESCOPO.md |

---

## 18. Divergências

### Documentado, mas não implementado

| Item                               | Documento                                                              | Evidência                                                                                            |
| ---------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Cron de refresh                    | ESCOPO.md, ARQUITETURA.md                                              | `ScheduleModule.forRoot()` ativo, mas apenas cron de retenção implementado                           |
| Storage S3                         | ESCOPO.md                                                              | Não há código referente a S3                                                                         |
| Export dashboard como imagem/PDF   | ESCOPO.md                                                              | Não implementado                                                                                     |
| Compartilhamento de dashboards     | ESCOPO.md                                                              | Não implementado                                                                                     |
| Alertas de segurança em tempo real | ESCOPO.md                                                              | Não implementado                                                                                     |
| `.env.production.example`          | `infra/env/.env.production.example`, `scripts/verify-env-examples.mjs` | Template completo, sem credenciais e validado automaticamente; preenchimento seguro ainda necessário |

### Implementado, mas não documentado no ESCOPO principal

| Item                                          | Evidência                                                           | Observação                                                                        |
| --------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Suporte Oracle como provedor alternativo      | `oracle.service.ts`, `database-provider.service.ts`, `DB_ORACLE.md` | ESCOPO.md diz "V1 conecta apenas ao SQL Server"; Oracle está implementado e ativo |
| Cache admin endpoints (invalidate, stats)     | `query-cache.controller.ts`                                         | Não mencionado em ESCOPO.md                                                       |
| Token blacklist com Redis                     | `token-blacklist.service.ts`                                        | Não detalhado no ESCOPO                                                           |
| TOTP encryption com AES-256-GCM               | `totp-encryption.service.ts`                                        | Não mencionado no ESCOPO                                                          |
| Dashboard admin trends (agregações temporais) | `admin-dashboard.service.ts`                                        | Documentado em api.md mas não em ESCOPO                                           |

### Implementado parcialmente (aparenta estar concluído mas tem lacunas)

| Item                                        | Aparência                  | Lacuna real                                                                                                 |
| ------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| ROADMAP marca 18/18 telas como "Concluído"  | ROADMAP.md:49              | 6 módulos marcados como "Parcial" — telas existem mas funcionalidades avançadas pendentes                   |
| Testes E2E marcados como CONCLUÍDO (DT-005) | ROADMAP.md:123             | Baseline validado com 7 testes; cobertura adicional de exportação, admin CRUD e 2FA permanece pendente      |
| `pnpm quality` como comando de validação    | README.md:66               | Inclui lint e format:check que falham (1129 erros, 187 arquivos)                                            |
| CI/CD pipeline                              | `.github/workflows/ci.yml` | CI executa `pnpm quality` (que falha) e `pnpm test:e2e` (API e2e, não Playwright); não executa `pnpm build` |

### Código órfão ou não utilizado

| Item                                         | Evidência             | Observação                                                                |
| -------------------------------------------- | --------------------- | ------------------------------------------------------------------------- |
| `apps/api/src/validation-test/`              | 3 arquivos            | Módulo de validação sem uso aparente em fluxos principais                 |
| `apps/api/src/auth/authz-test.controller.ts` | Controller de teste   | Controller de teste de autorização                                        |
| `packages/shared/` e `packages/ui/`          | Diretórios reservados | Vazios, sem implementação                                                 |
| `apps/web/src/lib/supabase.ts`               | 338 bytes             | Cliente Supabase browser — frontend não deve acessar Supabase diretamente |

### Mocks e placeholders

| Item                 | Local                                                   | Observação                                              |
| -------------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| SMTP em modo mock    | `.env.example:33` (`SMTP_MODE=mock`)                    | E-mails reais não são enviados                          |
| Fallback em memória  | Repositórios híbridos em `apps/api/src/*/repositories/` | Dados perdidos ao reiniciar se Supabase não configurado |
| Widget tipo "Tabela" | `dashboard-templates.ts`                                | Placeholder sem dados reais                             |
| Demo user            | `.env.example:28-29`                                    | Usuário demo sem 2FA (rotas admin retornam 403)         |

### Riscos de falsa conclusão

| Item                                                   | Risco                                                                  |
| ------------------------------------------------------ | ---------------------------------------------------------------------- |
| ROADMAP marca todas as 18 telas como "✅ Concluído"    | Pode levar a crer que o V1 está completo, mas 6 módulos são "Parcial"  |
| DT-005 (Testes E2E) marcado como CONCLUÍDO             | Baseline validado com 7 testes; cobertura adicional permanece pendente |
| `pnpm build` passa                                     | Lint e format:check falham; qualidade de código abaixo do ideal        |
| F-01 e F-02 marcados como "✅ Corrigido" em FALHAS.md  | CONTEXTO.md ainda lista F-01 e F-02 como pendências                    |
| ARQUITETURA.md diz "Redis não é dependência funcional" | BullMQ e token blacklist usam Redis com fallback em memória            |

---

## 19. Auditoria de Código

### Backend

**Arquitetura:** Modular NestJS com separação clara: controllers → services → repositories. Guards para JWT, roles, sectors, permissions e 2FA. DTOs com class-validator. ValidationPipe global com whitelist e forbidNonWhitelisted.

**Pontos fortes:**

- Queries SQL parametrizadas com validação de identificadores (`sql-query-validator.ts`)
- Proteção path traversal no download de exports (`exports.service.ts:40-60`)
- TOTP secret criptografado com AES-256-GCM (`totp-encryption.service.ts`)
- Token blacklist com Redis + fallback memória (`token-blacklist.service.ts`)
- Rate limiting com janela deslizante (`login-attempts.service.ts`)
- Timing-safe comparison no JWT (`token.service.ts`)
- Sessão com timeout de inatividade configurável (`auth.service.ts:303-321`)

**Problemas encontrados:**

| Arquivo                        | Local           | Problema                                                                            | Severidade | Correção                                     |
| ------------------------------ | --------------- | ----------------------------------------------------------------------------------- | ---------- | -------------------------------------------- |
| `exports.processor.ts:41`      | onModuleInit    | Cria conexão Redis sem tratamento de erro assíncrono                                | Média      | Try/catch no `onModuleInit`                  |
| `playwright.config.ts`         | webServer.url   | Validado em `http://localhost:3000` para a Web; API demo em `http://localhost:3001` | —          | Manter baseline e ampliar cobertura em P1-03 |
| `apps/web/src/lib/supabase.ts` | Cliente browser | Frontend ainda tem cliente Supabase browser                                         | Média      | Remover se não usado                         |
| Lint geral                     | 1129 erros      | `@typescript-eslint/no-explicit-any` extensivo                                      | Média      | Refatorar tipos                              |

### Frontend

**18 telas implementadas** em `apps/web/src/app/app/`:

- Login, forgot-password, reset-password
- Dashboard home, dashboards personalizados
- Reports (catálogo, detalhe)
- Exports
- Notifications
- Profile
- Admin (dashboard, users, groups, permissions, reports, audit, settings)

**Pontos fortes:**

- AuthGuard protege rotas autenticadas
- React Query para data fetching
- Estados de loading, erro, vazio e sucesso
- Componentes de gráfico reutilizáveis
- CSRF token enviado via header `x-csrf-token`

**Problemas:**

| Arquivo                        | Problema                                                                       | Severidade |
| ------------------------------ | ------------------------------------------------------------------------------ | ---------- |
| `apps/web/src/lib/app-data.ts` | Componentes ainda dependem de `createAppDataClient()` que usa Supabase browser | Média      |
| Texto em ASCII sem acentos     | "Usuarios" em vez de "Usuários"                                                | Baixa      |

---

## 20. Auditoria de Segurança

| Item                                         | Status | Evidência                                           |
| -------------------------------------------- | ------ | --------------------------------------------------- |
| Senhas com bcrypt (12 rounds)                | ✅     | `auth.service.ts:343-347`                           |
| JWT access token (15min)                     | ✅     | `.env.example:20`                                   |
| Refresh token (7 dias) com rotação           | ✅     | `auth.service.ts:78-91`                             |
| Refresh token hash com bcrypt                | ✅     | `auth.service.ts:337-341`                           |
| 2FA/TOTP obrigatório para admins             | ✅     | `two-factor.guard.ts:21-35`                         |
| TOTP secret criptografado AES-256-GCM        | ✅     | `totp-encryption.service.ts`                        |
| Rate limiting login (5/15min)                | ✅     | `login-attempts.service.ts`                         |
| Rate limiting TOTP (3/5min)                  | ✅     | `totp-attempts.service.ts`                          |
| Token blacklist (Redis + memória)            | ✅     | `token-blacklist.service.ts`                        |
| Token versioning (revogação em massa)        | ✅     | `auth.service.ts:240-247`                           |
| CSRF middleware (double-submit)              | ✅     | `csrf.middleware.ts`                                |
| Headers de segurança (helmet)                | ✅     | `main.ts:26`                                        |
| CORS com credentials e origins configuráveis | ✅     | `main.ts:28-31`                                     |
| Queries SQL parametrizadas                   | ✅     | `sql-parameters.ts`, `sql-query.service.ts`         |
| Validação de identificadores SQL             | ✅     | `sql-query-validator.ts`                            |
| Path traversal protection em downloads       | ✅     | `exports.service.ts:40-60`                          |
| ValidationPipe global (whitelist + forbid)   | ✅     | `main.ts:36-42`                                     |
| Sessão em sessionStorage                     | ✅     | `apps/web/src/lib/auth/session.ts`                  |
| Trust proxy configurável                     | ✅     | `main.ts:22-24`                                     |
| Timing-safe JWT comparison                   | ✅     | `token.service.ts`                                  |
| TOTP disable proibido para admin             | ✅     | `auth.service.ts:219-223`                           |
| LGPD: retenção e anonimização                | ✅     | `retention.service.ts`                              |
| LGPD: direitos do titular                    | ✅     | Admin endpoints                                     |
| HTTPS/TLS em produção                        | ❌     | Nginx sem SSL configurado                           |
| Secrets não versionados                      | ✅     | `.gitignore` exclui `.env`                          |
| `TOTP_ENCRYPTION_KEY` vazia no env example   | ⚠️     | Secret TOTP em plain text se não definida           |
| `JWT_ACCESS_SECRET=dev-secret-change-me`     | ⚠️     | Secret de desenvolvimento no env example (esperado) |

**Riscos de segurança:**

- **Médio:** TOTP_ENCRYPTION_KEY vazia faz secrets TOTP serem armazenados em plain text
- **Alto:** Sem TLS/HTTPS no nginx de produção
- **Médio:** Fallback em memória sem persistência pode perder dados ao reiniciar
- **Baixo:** Demo user sem 2FA (rotas admin retornam 403, comportamento esperado)

---

## 21. Auditoria de Banco

**Supabase (PostgreSQL):** 12 migrations coerentes cobrindo auth, reports, dashboards, exports, settings, permissões, auditoria, token versioning, group permissions, widget types, favorite reports.

**SQL Server:** Pool de conexões com `mssql`, queries parametrizadas, validação de identificadores, healthcheck.

**Oracle:** Suporte alternativo via `oracledb` com pool, config segura e healthcheck.

**Problemas:**

- Sem estratégia de backup documentada para Supabase
- Sem migração de dados entre ambientes
- Fallback em memória não persiste dados
- Sem índices adicionais documentados além dos das migrations

---

## 22. Auditoria de Testes

| Categoria               | Quantidade               | Status                                                      |
| ----------------------- | ------------------------ | ----------------------------------------------------------- |
| Testes API (spec)       | 37 arquivos, ~304 testes | ✅ Passando                                                 |
| Testes Web (test)       | 37 arquivos, ~142 testes | ✅ Passando                                                 |
| Testes E2E (Playwright) | 1 arquivo, 7 testes      | ⚠️ Parcial: baseline validado; cobertura adicional pendente |
| Lint                    | 1129 erros, 426 warnings | ❌ Falhando                                                 |
| Format                  | 187 arquivos             | ❌ Falhando                                                 |
| Typecheck               | API + Web                | ✅ Passando                                                 |
| Build                   | API + Web                | ✅ Passando                                                 |

**Fluxos críticos sem teste E2E:**

- Exportação de relatórios
- CRUD administrativo de usuários
- Dashboards personalizados
- Editor visual
- 2FA/TOTP login flow

---

## 23. Auditoria de Infraestrutura

| Item                | Status         | Evidência                                             |
| ------------------- | -------------- | ----------------------------------------------------- |
| Docker Compose dev  | ✅ Funcional   | `docker-compose.dev.yml`                              |
| Docker Compose demo | ✅ Funcional   | `docker-compose.demo.yml` (requer `.env.demo`)        |
| Docker Compose prod | ✅ Funcional   | `docker-compose.prod.yml` (api + web + redis + nginx) |
| Dockerfiles prod    | ✅ Multi-stage | `api.prod.Dockerfile`, `web.prod.Dockerfile`          |
| Nginx reverse proxy | ✅ Configurado | `nginx/default.conf`                                  |
| Redis healthcheck   | ✅             | `docker-compose.prod.yml:56-60`                       |
| CI GitHub Actions   | ⚠️ Parcial     | `ci.yml` executa quality + test + e2e, mas não build  |
| Deploy VPS          | ✅ Configurado | `deploy-vps.yml` via SSH + docker compose             |
| Healthchecks        | ✅             | `/health`, `/health/sql`                              |
| Observabilidade     | ❌ Inexistente | Sem métricas, tracing, alertas                        |
| HTTPS/TLS           | ❌             | Nginx escuta porta 80 apenas                          |
| Backup              | ❌             | Não documentado                                       |
| Rollback            | ❌             | Não documentado                                       |

**Classificação de prontidão operacional:** Parcial

---

## 24. Riscos

| Risco                                        | Severidade | Probabilidade | Mitigação                                         |
| -------------------------------------------- | ---------- | ------------- | ------------------------------------------------- |
| Fallback em memória perde dados ao reiniciar | Alto       | Média         | Garantir Supabase configurado em produção         |
| Sem TLS/HTTPS em produção                    | Alto       | Alta          | Configurar certificado SSL no nginx               |
| Lint com 1129 erros                          | Médio      | Alta          | Corrigir progressivamente                         |
| Testes E2E insuficientes                     | Médio      | Alta          | Expandir cobertura Playwright                     |
| Sem observabilidade estruturada              | Alto       | Alta          | Implementar logs estruturados + métricas          |
| TOTP_ENCRYPTION_KEY não definida em dev      | Médio      | Alta          | Definir em produção                               |
| Cobertura Playwright ainda limitada          | Médio      | Média         | Expandir testes para exportação, admin CRUD e 2FA |
| Template de produção sem segredos reais      | Médio      | Média         | Preencher via ambiente seguro e executar P0-04    |
| CI não executa build                         | Médio      | Média         | Adicionar step de build no ci.yml                 |
| SMTP em modo mock                            | Médio      | Média         | Configurar SMTP real em produção                  |

---

## 25. Conclusão Final

O Dashboard Power BI está em estado **funcional avançado**, com **84% do escopo total concluído** e **90% do MVP entregue**. O projeto entrega valor real com todos os fluxos principais funcionando, mas **não está pronto para produção** devido a bloqueadores como ausência de TLS, observabilidade insuficiente, lint falhando e testes E2E limitados.

**Classificação atual:** MVP funcional com pendências de hardening

**Nível de risco:** Médio

**Recomendação:** Pode ser usado como MVP controlado em ambiente interno, mas precisa de correções antes de produção.
