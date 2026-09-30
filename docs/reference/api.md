# API

**Atualizado em:** 2026-09-29

> Rotas existentes não garantem persistência ou que a Web já as consuma. Para os fluxos conectados e as lacunas por módulo, consulte [Estado real do projeto](../audits/ESTADO_REAL_PROJETO_2026-09-29.md).

## Stack

- NestJS 10
- TypeScript estrito
- JWT + refresh token
- `bcrypt`
- Swagger em `/docs`

## Capacidades confirmadas

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout` — revoga refresh token e blacklista access token (jti)
- `POST /auth/sessions/revoke-all` — revoga todas as sessões do usuário (access + refresh)
- `GET /auth/me`
- `PATCH /auth/me/password`
- `PATCH /admin/settings/:key`
- `GET /dashboard/home`
- `GET /dashboard/kpis/:kpiId/drilldown?dimension=...` — drill-down multi-dimensão (fazenda, cultura, variedade, safra, cliente, produto, status, tempo)
- `GET /dashboard/kpis/:kpiId/history` — serie historica de 12 meses do KPI
- `GET /dashboards` — lista dashboards personalizados do usuario; cria dashboard padrão por setor automaticamente quando lista vazia (retorna `{ dashboards, seededViaApi }`)
- `POST /dashboards` — cria dashboard personalizado
- `GET /dashboards/:id` — retorna dashboard especifico
- `PATCH /dashboards/:id` — atualiza dashboard
- `DELETE /dashboards/:id` — remove dashboard
- `POST /dashboards/:id/widgets` — adiciona widget ao dashboard
- `PATCH /dashboards/:id/widgets/:widgetId` — atualiza widget
- `DELETE /dashboards/:id/widgets/:widgetId` — remove widget
- `PATCH /dashboards/:id/widgets/reorder` — reordena widgets do dashboard (batch)
- `PATCH /dashboards/:id/widgets/batch` — atualização em lote de widgets (posição, título, chartType, kpiId, config, content, url)
- `GET /admin/dashboard` — métricas operacionais do painel administrativo
- `GET /admin/dashboard/trends` — agregações temporais de tendências (usuários por mês, atividade por semana, exports por semana, top 5 relatórios, top 5 setores)
- `POST /admin/reports/validate` — valida se fonte SQL (view ou stored_procedure) existe e é acessível
- `POST /admin/cache/invalidate` — invalida todas as entradas do cache de queries (admin apenas)
- `GET /admin/cache/stats` — retorna estatísticas de hit/miss/evictions do cache de queries (admin apenas)
- fluxo de recuperação e redefinição de senha
- 2FA/TOTP: setup (`POST /auth/totp/setup`), verificação (`POST /auth/totp/verify`), desativação (`POST /auth/totp/disable` — exige `code` + `password`, proibido para admin), login TOTP (`POST /auth/totp/login`) — quando ativo, login retorna `requiresTwoFactor: true` + `tempToken`. Rate limiting: 3 tentativas, bloqueio 15 min. Segredo usa AES-256-GCM com `TOTP_ENCRYPTION_KEY`; a chave é exigida em produção. Sem chave fora de produção, o fallback pode armazenar segredo sem criptografia. Admin sem TOTP recebe 403 em rotas protegidas por `TwoFactorGuard`.
- CRUD básico administrativo de usuários
- CRUD básico administrativo de grupos
- catálogo, detalhe e execução de relatórios
- dashboard, notificações, exportações e settings no runtime principal
- permissões e auditoria no runtime principal
- retenção LGPD: `GET /admin/retention/status` (config), `POST /admin/retention/run` (execução manual), cron diário às 03:00
- LGPD direitos do titular: `POST /admin/users/:id/anonymize` (anonimização irreversível), `GET /admin/users/:id/data-export` (portabilidade JSON)
- healthchecks da API e do SQL Server

## Contrato BI v1

As rotas autenticadas abaixo compartilham `source`, `status`, `dataAsOf`, `lastSyncedAt`, `definitionVersion` e `warnings` quando retornam dados de BI:

- `GET /api/v1/bi/source` — fonte ativa, ambiente e healthcheck sanitizado
- `GET /api/v1/bi/freshness` — data de corte, watermark e último snapshot válido
- `GET /api/v1/bi/filters` — dimensões de filtro versionadas
- `GET /api/v1/bi/production/summary` — resumo de plantio/colheita quando Oracle/COMPASS estiver disponível
- `GET /api/v1/bi/grains`, `GET /api/v1/bi/cotton`, `GET /api/v1/bi/ginning`, `GET /api/v1/bi/romaneios` — contratos preparados, com `not_configured` explícito até a validação das views correspondentes
- `POST /api/v1/bi/refresh` — smoke check idempotente da fonte; recebe `{ "idempotencyKey": "..." }`
- `GET /api/v1/bi/refresh/:runId` — status, contagens, erros, watermark e último snapshot válido do job

No SQL Server demo, os domínios agrícolas não são preenchidos com dados sintéticos. A carga efetiva Oracle/COMPASS será habilitada após receber host, service name, rede e usuário somente leitura. No ambiente demo atual a fonte BI retorna `not_configured`; o refresh só valida a fonte, termina `skipped` e não grava snapshot nem watermark durável.

## Padrões importantes

- validação por DTOs
- guards para JWT, roles e setores
- acesso ao SQL Server com queries parametrizadas
- erros HTTP via `HttpException` e `HttpStatus`

## Limitações atuais

- Compose demo não configura Supabase. Repositórios com fallback em memória podem perder alterações ao reiniciar a API; migrations presentes no repositório não foram confirmadas como aplicadas em banco externo.
- A integração BI Oracle/COMPASS, carga idempotente e persistência de snapshots/watermark não estão concluídas.
- API de notificações e exportações existe; porém as telas Web de lista de notificações e histórico de exportações ainda usam fixtures através de `app-data.ts`.
- Worker de exportação usa BullMQ/Redis, mas os arquivos são locais ao container e não há storage externo validado.
- Cache de consultas SQL é LRU/TTL local ao processo, não compartilhado entre instâncias.
- O endpoint de retenção e portabilidade existe, mas operação efetiva depende da persistência configurada e não equivale a validação jurídica de conformidade LGPD.
- Cobertura automatizada existente não comprova integração com Supabase, Oracle/COMPASS ou ambiente de produção. A suíte completa da API não foi executada nesta atualização documental.
