# MATRIZ_REQUISITOS.md — Matriz Oficial de Requisitos

**Projeto:** Dashboard Power BI
**Data da auditoria:** 2026-07-20
**Metodologia:** Análise baseada em evidências de código, documentação e runtime real.

---

## Legenda de Status

- **Concluído** — implementado, funcional e com evidência
- **Parcial** — fluxo principal existe, mas com lacunas
- **Não iniciado** — sem implementação relevante
- **Não comprovado** — não há evidência suficiente
- **Fora do escopo** — não pertence ao V1

---

## Matriz de Requisitos

### Módulo AUTH

| ID | Requisito | Origem | Prioridade | Peso | Status | % | Evidência | Pendências | Risco | Dependências |
|----|-----------|--------|------------|------|--------|---|-----------|------------|-------|--------------|
| AUTH-001 | Login por e-mail + senha (bcrypt) | ESCOPO.md | Crítica | 15% | Concluído | 95% | `apps/api/src/auth/auth.controller.ts:46-56`, `auth.service.ts:43-76` | — | Baixo | — |
| AUTH-002 | Refresh token com rotação | ESCOPO.md | Crítica | 10% | Concluído | 95% | `auth.service.ts:78-91` | — | Baixo | AUTH-001 |
| AUTH-003 | Logout com revogação + blacklist | ESCOPO.md | Alta | 5% | Concluído | 90% | `auth.controller.ts:83-111`, `token-blacklist.service.ts` | Blacklist em memória sem Redis | Médio | AUTH-002 |
| AUTH-004 | Recuperação de senha por e-mail | ESCOPO.md | Alta | 5% | Concluído | 85% | `auth.controller.ts:58-72`, `password-reset.service.ts` | SMTP em modo mock; envio real não confirmado | Médio | AUTH-001 |
| AUTH-005 | 2FA/TOTP setup/verify/disable/login | ESCOPO.md | Alta | 8% | Concluído | 90% | `auth.controller.ts:153-195`, `totp.service.ts`, `totp-encryption.service.ts` | Secret em plain text se `TOTP_ENCRYPTION_KEY` não definida | Médio | AUTH-001 |
| AUTH-006 | 2FA obrigatório para admins | ESCOPO.md RN-015 | Alta | 5% | Concluído | 95% | `two-factor.guard.ts:21-35` | — | Baixo | AUTH-005 |
| AUTH-007 | Rate limiting no login (5/15min) | ESCOPO.md RN-003 | Alta | 5% | Concluído | 95% | `login-attempts.service.ts` | — | Baixo | AUTH-001 |
| AUTH-008 | Perfil do usuário (GET /auth/me) | ESCOPO.md | Média | 3% | Concluído | 95% | `auth.controller.ts:133-139` | — | Baixo | AUTH-001 |
| AUTH-009 | Alteração de senha (PATCH /auth/me/password) | ESCOPO.md | Média | 3% | Concluído | 95% | `auth.controller.ts:141-151`, `auth.service.ts:119-144` | — | Baixo | AUTH-001 |
| AUTH-010 | Revogação de todas as sessões | ESCOPO.md | Média | 3% | Concluído | 90% | `auth.controller.ts:113-131`, `auth.service.ts:240-247` | — | Baixo | AUTH-002 |
| AUTH-011 | Hardening de sessão (timeout inatividade) | ESCOPO.md RN-017 | Alta | 5% | Concluído | 85% | `auth.service.ts:303-321` (SESSION_INACTIVITY_TIMEOUT_SECONDS) | — | Baixo | AUTH-002 |
| AUTH-012 | CSRF middleware | ESCOPO.md | Alta | 3% | Concluído | 90% | `apps/api/src/common/middleware/csrf.middleware.ts` | — | Baixo | — |
| AUTH-013 | Headers de segurança (CSP, HSTS, etc) | ESCOPO.md | Alta | 3% | Concluído | 95% | `main.ts:26` (helmet) | — | Baixo | — |
| AUTH-014 | Sessão web em sessionStorage | ESCOPO.md | Alta | 3% | Concluído | 90% | `apps/web/src/lib/auth/session.ts` | — | Baixo | — |

### Módulo PERMISSIONS

| ID | Requisito | Origem | Prioridade | Peso | Status | % | Evidência | Pendências | Risco | Dependências |
|----|-----------|--------|------------|------|--------|---|-----------|------------|-------|--------------|
| PERM-001 | Roles: Visualizador, Downloader, Admin | ESCOPO.md | Crítica | 8% | Concluído | 95% | `roles.guard.ts`, `auth.types.ts` | — | Baixo | AUTH-001 |
| PERM-002 | Permissões por setor | ESCOPO.md RN-006 | Crítica | 8% | Concluído | 90% | `sectors.guard.ts` | — | Baixo | PERM-001 |
| PERM-003 | Permissão individual por relatório | ESCOPO.md | Alta | 5% | Concluído | 85% | `report-authorization.service.ts` | — | Médio | PERM-001 |
| PERM-004 | Grupo de acesso com roles e setores | ESCOPO.md | Alta | 5% | Concluído | 90% | `apps/api/src/admin/groups/*` | — | Baixo | PERM-001 |
| PERM-005 | CRUD de permissões granulares | ESCOPO.md | Alta | 5% | Concluído | 85% | `permissions.controller.ts`, `permissions.service.ts` | — | Médio | PERM-001 |
| PERM-006 | Herança de permissões via grupos | ESCOPO.md RN-016 | Alta | 5% | Concluído | 85% | `effective-permissions.service.ts:17-55` | — | Médio | PERM-004 |
| PERM-007 | Auditoria de mudanças de permissão | ESCOPO.md RN-013 | Alta | 3% | Concluído | 85% | `permissions.service.ts` (audit calls) | — | Baixo | PERM-005 |
| PERM-008 | Guard combinado JWT + role + permission | ESCOPO.md | Alta | 3% | Concluído | 85% | `permissions.guard.ts`, `effective-permissions.service.ts` | — | Baixo | PERM-005 |
| PERM-009 | Bloqueio automático após inatividade | ESCOPO.md | Média | 3% | Parcial | 50% | Timeout no refresh (`auth.service.ts:303-321`), mas sem bloqueio proativo no frontend | Bloqueio proativo no frontend | Médio | AUTH-011 |

### Módulo SQL SERVER / DATABASE

| ID | Requisito | Origem | Prioridade | Peso | Status | % | Evidência | Pendências | Risco | Dependências |
|----|-----------|--------|------------|------|--------|---|-----------|------------|-------|--------------|
| SQL-001 | Conexão via pool com SQL Server (mssql) | ESCOPO.md | Crítica | 8% | Concluído | 90% | `sql-server.service.ts` | — | Baixo | — |
| SQL-002 | Queries parametrizadas | ESCOPO.md RN-009 | Crítica | 8% | Concluído | 95% | `sql-query.service.ts`, `sql-parameters.ts` | — | Baixo | SQL-001 |
| SQL-003 | Validação de identificadores | ESCOPO.md | Alta | 5% | Concluído | 90% | `sql-query-validator.ts` | — | Baixo | SQL-001 |
| SQL-004 | Suporte a stored procedures e views | ESCOPO.md | Alta | 5% | Concluído | 85% | `sql-query.service.ts` | — | Baixo | SQL-001 |
| SQL-005 | Cache de resultados com TTL e LRU | ESCOPO.md | Média | 5% | Concluído | 85% | `query-cache.service.ts` | Admin endpoints para invalidate/stats | Baixo | SQL-001 |
| SQL-006 | Suporte Oracle como alternativa | DB_ORACLE.md, .env.example | Média | 5% | Parcial | 70% | `oracle.service.ts`, `oracle.config.ts`, `database-provider.service.ts` | Não documentado no ESCOPO principal; integração parcial | Médio | SQL-001 |
| SQL-007 | Monitoramento de lentidão e timeout | ESCOPO.md | Média | 3% | Parcial | 25% | Timeout configurável em env, sem logs estruturados de performance | Logs estruturados, métricas | Médio | SQL-001 |
| SQL-008 | Cron de refresh agendado | ESCOPO.md | Baixa | 2% | Não iniciado | 0% | — | Não implementado | Baixo | SQL-001 |

### Módulo REPORTS

| ID | Requisito | Origem | Prioridade | Peso | Status | % | Evidência | Pendências | Risco | Dependências |
|----|-----------|--------|------------|------|--------|---|-----------|------------|-------|--------------|
| REP-001 | Listagem por setor com busca e filtros | ESCOPO.md | Crítica | 8% | Concluído | 90% | `reports.controller.ts:23-33`, `reports-api.service.ts` | — | Baixo | PERM-002 |
| REP-002 | Filtros: data, categoria, parâmetros custom | ESCOPO.md | Alta | 5% | Concluído | 85% | `report-advanced-filters.tsx`, `report-filters.ts` | — | Baixo | REP-001 |
| REP-003 | Visualização inline (tabela/grid) | ESCOPO.md | Crítica | 5% | Concluído | 90% | `report-detail.tsx`, `reports.controller.ts:62-70` | — | Baixo | REP-001 |
| REP-004 | Exportação PDF/XLSX/CSV/JSON | ESCOPO.md | Crítica | 8% | Concluído | 85% | `exports.service.ts`, `export-file-builder.service.ts` | — | Baixo | REP-003 |
| REP-005 | Relatórios favoritos por usuário | ESCOPO.md | Média | 3% | Concluído | 85% | `report-favorites.service.ts`, `reports.controller.ts:35-60` | — | Baixo | REP-001 |
| REP-006 | Gestão admin CRUD de relatórios | ESCOPO.md | Alta | 5% | Concluído | 85% | `report-definitions.admin.controller.ts` | — | Médio | PERM-001 |
| REP-007 | Validação de fonte SQL | ESCOPO.md | Alta | 3% | Concluído | 85% | `report-definition.validator.ts`, `POST /admin/reports/validate` | — | Baixo | SQL-001 |
| REP-008 | Pipeline BullMQ + Redis para exports | ESCOPO.md | Média | 5% | Concluído | 80% | `exports.processor.ts`, `exports.queue.ts` | Fallback em memória se Redis indisponível | Médio | REP-004 |
| REP-009 | Storage S3 para arquivos de export | ESCOPO.md | Baixa | 2% | Não iniciado | 0% | — | Não implementado | Baixo | REP-004 |

### Módulo BI / DASHBOARD

| ID | Requisito | Origem | Prioridade | Peso | Status | % | Evidência | Pendências | Risco | Dependências |
|----|-----------|--------|------------|------|--------|---|-----------|------------|-------|--------------|
| BI-001 | Dashboard home com KPIs consolidados | ESCOPO.md | Crítica | 8% | Concluído | 90% | `dashboard.controller.ts:17-21`, `dashboard.service.ts` | — | Baixo | SQL-001 |
| BI-002 | Gráficos Recharts (linha, barra, pizza, área) | ESCOPO.md | Alta | 5% | Concluído | 90% | `apps/web/src/components/charts/*` | — | Baixo | BI-001 |
| BI-003 | KPIs com indicadores de variação (delta %) | ESCOPO.md | Alta | 3% | Concluído | 90% | `dashboard.service.ts`, `kpi-card.tsx` | — | Baixo | BI-001 |
| BI-004 | Drill-down multi-dimensão selecionável | ESCOPO.md | Alta | 5% | Concluído | 85% | `dashboard.controller.ts:29-37`, `dashboard.service.ts` (8 dimensões) | — | Baixo | BI-001 |
| BI-005 | Histórico de KPI (12 meses) | api.md | Média | 3% | Concluído | 85% | `dashboard.controller.ts:39-43` | — | Baixo | BI-001 |
| BI-006 | Dashboards personalizados (CRUD) | ESCOPO.md | Alta | 5% | Concluído | 85% | `dashboards.controller.ts`, `dashboards.service.ts` | — | Baixo | AUTH-001 |
| BI-007 | Widgets configuráveis (KPI, gráfico, tabela, texto, iframe) | ESCOPO.md | Média | 3% | Concluído | 85% | `dashboards.service.ts`, migration 004_widget_types | — | Baixo | BI-006 |
| BI-008 | Editor visual drag-and-drop completo | ESCOPO.md | Alta | 5% | Concluído | 80% | `dashboard-canvas.tsx`, `resizable-widget-card.tsx`, `widget-palette.tsx` (react-grid-layout) | — | Médio | BI-006 |
| BI-009 | Dashboard padrão por setor (seed automático) | ESCOPO.md | Média | 3% | Concluído | 85% | `dashboards.controller.ts:24-36`, `dashboard-templates.ts` | — | Baixo | BI-006 |
| BI-010 | Exportar dashboard como imagem/PDF | ESCOPO.md | Baixa | 2% | Não iniciado | 0% | — | Não implementado | Baixo | BI-006 |
| BI-011 | Compartilhamento entre usuários do mesmo grupo | ESCOPO.md | Baixa | 2% | Não iniciado | 0% | — | Não implementado | Baixo | BI-006 |

### Módulo ADMIN

| ID | Requisito | Origem | Prioridade | Peso | Status | % | Evidência | Pendências | Risco | Dependências |
|----|-----------|--------|------------|------|--------|---|-----------|------------|-------|--------------|
| ADM-001 | CRUD completo de usuários | ESCOPO.md | Crítica | 5% | Concluído | 90% | `apps/api/src/admin/users/*` | — | Baixo | PERM-001 |
| ADM-002 | CRUD completo de grupos | ESCOPO.md | Alta | 3% | Concluído | 90% | `apps/api/src/admin/groups/*` | — | Baixo | PERM-004 |
| ADM-003 | Logs de auditoria com filtros | ESCOPO.md RN-013 | Alta | 5% | Concluído | 85% | `audit.controller.ts`, `audit.service.ts` | — | Baixo | — |
| ADM-004 | Configurações do sistema editáveis | ESCOPO.md | Média | 3% | Concluído | 85% | `settings.controller.ts`, `settings.service.ts` | — | Baixo | PERM-001 |
| ADM-005 | Dashboard administrativo com KPIs | ESCOPO.md | Alta | 3% | Concluído | 85% | `admin-dashboard.service.ts`, `admin/page.tsx` | — | Baixo | ADM-001 |
| ADM-006 | Dashboard admin com gráficos de tendência | ESCOPO.md | Média | 3% | Concluído | 80% | `admin-dashboard.service.ts` (trends), `GET /admin/dashboard/trends` | — | Baixo | ADM-005 |
| ADM-007 | Retenção LGPD (cron + anonimização) | ESCOPO.md | Alta | 3% | Concluído | 85% | `retention.service.ts`, `retention.controller.ts` | — | Médio | ADM-003 |
| ADM-008 | Direitos do titular (anonimização, portabilidade) | ESCOPO.md | Alta | 3% | Concluído | 80% | `POST /admin/users/:id/anonymize`, `GET /admin/users/:id/data-export` | — | Médio | ADM-001 |
| ADM-009 | Alertas de segurança em tempo real | ESCOPO.md | Baixa | 2% | Não iniciado | 0% | — | Não implementado | Baixo | ADM-003 |
| ADM-010 | Governança completa | ESCOPO.md | Média | 2% | Parcial | 50% | Auditoria, permissões, settings, retenção ativos | Cobertura incompleta de governança | Médio | ADM-003 |

### Módulo NOTIFICATIONS

| ID | Requisito | Origem | Prioridade | Peso | Status | % | Evidência | Pendências | Risco | Dependências |
|----|-----------|--------|------------|------|--------|---|-----------|------------|-------|--------------|
| NOT-001 | Central de notificações | ESCOPO.md | Média | 3% | Concluído | 80% | `notifications.controller.ts`, `notifications.service.ts` | Simples frente ao PDF | Baixo | AUTH-001 |
| NOT-002 | Marcar como lida | ESCOPO.md | Média | 2% | Concluído | 85% | `notifications-list.tsx` | — | Baixo | NOT-001 |

### Módulo EXPORTS

| ID | Requisito | Origem | Prioridade | Peso | Status | % | Evidência | Pendências | Risco | Dependências |
|----|-----------|--------|------------|------|--------|---|-----------|------------|-------|--------------|
| EXP-001 | Solicitação de exportação | ESCOPO.md | Crítica | 3% | Concluído | 90% | `exports.controller.ts` | — | Baixo | REP-004 |
| EXP-002 | Fila + Worker (BullMQ + Redis) | ESCOPO.md | Alta | 3% | Concluído | 80% | `exports.processor.ts` | Fallback em memória | Médio | EXP-001 |
| EXP-003 | Histórico de exportações | ESCOPO.md | Média | 2% | Concluído | 85% | `exports-list.tsx` | — | Baixo | EXP-001 |
| EXP-004 | Download autenticado | ESCOPO.md | Alta | 2% | Concluído | 90% | `exports.service.ts` (path traversal protection) | — | Baixo | EXP-001 |
| EXP-005 | Expiração automática (7 dias) | ESCOPO.md RN-012 | Média | 2% | Concluído | 85% | `retention.service.ts` | — | Baixo | EXP-001 |
| EXP-006 | Auditoria de exports | ESCOPO.md RN-013 | Média | 2% | Concluído | 85% | `exports.processor.ts` (audit calls) | — | Baixo | ADM-003 |

### Módulo INFRA / TESTS

| ID | Requisito | Origem | Prioridade | Peso | Status | % | Evidência | Pendências | Risco | Dependências |
|----|-----------|--------|------------|------|--------|---|-----------|------------|-------|--------------|
| INFRA-001 | Docker Compose dev | ESCOPO.md | Alta | 3% | Concluído | 90% | `docker-compose.dev.yml` | — | Baixo | — |
| INFRA-002 | Docker Compose prod | ESCOPO.md | Alta | 3% | Concluído | 85% | `docker-compose.prod.yml`, Dockerfiles prod, nginx | — | Baixo | — |
| INFRA-003 | CI/CD GitHub Actions | ESCOPO.md | Alta | 3% | Concluído | 80% | `ci.yml`, `deploy-vps.yml` | CI não executa build nem typecheck | Médio | — |
| INFRA-004 | Healthchecks (API + SQL) | ESCOPO.md | Média | 2% | Concluído | 90% | `health.service.ts`, `/health`, `/health/sql` | — | Baixo | — |
| INFRA-005 | Swagger/OpenAPI | ARQUITETURA.md | Média | 2% | Concluído | 85% | `main.ts:45-53` | Apenas em non-production | Baixo | — |
| TEST-001 | Testes unitários backend | ESCOPO.md | Alta | 3% | Concluído | 85% | 37 arquivos .spec.ts, ~304 testes passando | — | Baixo | — |
| TEST-002 | Testes unitários frontend | ESCOPO.md | Alta | 3% | Concluído | 85% | 37 arquivos .test.tsx, ~142 testes passando | — | Baixo | — |
| TEST-003 | Testes E2E (Playwright) | ESCOPO.md | Média | 2% | Parcial | 50% | `tests/e2e/auth-dashboard.spec.ts` (6 testes) | Apenas auth+dashboard; config do webServer aponta para porta errada (3001 vs 3000) | Médio | — |
| TEST-004 | Lint sem erros | ESCOPO.md | Média | 2% | Parcial | 25% | `pnpm lint` falha com 1129 erros | Corrigir @typescript-eslint warnings | Médio | — |
| TEST-005 | Formatação Prettier | ESCOPO.md | Baixa | 1% | Parcial | 10% | `pnpm format:check` falha com 187 arquivos | Executar `pnpm format` | Baixo | — |
| INFRA-006 | Observabilidade estruturada | ESCOPO.md | Média | 2% | Não iniciado | 10% | Apenas logs NestJS nativos | Sem Datadog/Grafana/tracing | Alto | — |
| INFRA-007 | HTTPS/TLS em produção | ESCOPO.md | Alta | 2% | Parcial | 50% | Nginx configurado, mas sem TLS/SSL config | Configurar certificado TLS no nginx | Alto | INFRA-002 |

---

## Resumo Quantitativo

| Status | Quantidade |
|--------|-----------|
| Concluído | 58 |
| Parcial | 8 |
| Não iniciado | 6 |
| Não comprovado | 0 |
| Fora do escopo | 0 |
| **Total** | **72** |
