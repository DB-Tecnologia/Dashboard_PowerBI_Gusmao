# TAREFAS_PARA_CONCLUSAO.md — Plano de Execução para Conclusão

**Projeto:** Dashboard Power BI
**Data:** 2026-08-25

> **Atualizações P0-02/P0-03/P1-02 (2026-08-25):** Playwright foi validado em ambiente demo com 7 cenários. O `.env.production.example` foi completado com todas as variáveis do contrato geral, Oracle/COMPASS como fonte padrão e validação automatizada, sem credenciais reais. A formatação foi padronizada em 387 arquivos e `pnpm format:check` passou. P0-04 continua responsável pela exigência da chave TOTP no boot; P1-01 continua responsável pelo lint.

---

## 1. Lista Completa de Tarefas Restantes

### P0 — Bloqueadores Críticos

| ID    | Área      | Tarefa                                                 | Problema resolvido                         | Arquivos envolvidos                                                    | Dependências | Complexidade | Estimativa | Critério de aceite                                                                       | Risco |
| ----- | --------- | ------------------------------------------------------ | ------------------------------------------ | ---------------------------------------------------------------------- | ------------ | ------------ | ---------- | ---------------------------------------------------------------------------------------- | ----- |
| P0-01 | Infra     | Configurar TLS/HTTPS no nginx                          | Tráfego não criptografado em produção      | `infra/docker/nginx/default.conf`, `docker-compose.prod.yml`           | —            | Média        | 4h         | Nginx serve HTTPS com certificado válido; redirect HTTP→HTTPS                            | Alto  |
| P0-02 | Qualidade | Validar configuração do Playwright (Web na porta 3000) | Testes E2E não funcionam corretamente      | `playwright.config.ts`                                                 | —            | Baixa        | 0.5h       | **Concluído:** `pnpm test:e2e:playwright` executa 7 cenários contra Web na porta 3000    | Médio |
| P0-03 | Infra     | Completar e validar `.env.production.example`          | Referência de produção incompleta          | `infra/env/.env.production.example`, `scripts/verify-env-examples.mjs` | —            | Baixa        | 1h         | **Concluído:** todas as variáveis documentadas, sem credenciais e com Oracle como padrão | Médio |
| P0-04 | Segurança | Garantir `TOTP_ENCRYPTION_KEY` definida em produção    | Secrets TOTP em plain text se não definida | `infra/env/.env.production.example`, docs                              | —            | Baixa        | 1h         | Env example documenta necessidade da key; validação no boot                              | Médio |

### P1 — Obrigatório para o Lançamento

| ID    | Área            | Tarefa                                            | Problema resolvido                      | Arquivos envolvidos                                     | Dependências | Complexidade | Estimativa | Critério de aceite                                              | Risco |
| ----- | --------------- | ------------------------------------------------- | --------------------------------------- | ------------------------------------------------------- | ------------ | ------------ | ---------- | --------------------------------------------------------------- | ----- |
| P1-01 | Qualidade       | Corrigir erros de lint (1129 erros)               | Qualidade de código abaixo do padrão    | `apps/api/src/*`, `apps/web/src/*`                      | —            | Alta         | 16h        | `pnpm lint` passa sem erros                                     | Médio |
| P1-02 | Qualidade       | Corrigir formatação Prettier (387 arquivos)       | Formatação inconsistente                | Todo o repositório                                      | —            | Baixa        | 3-5h       | **Concluído:** `pnpm format:check` passa sem arquivos pendentes | Baixo |
| P1-03 | Testes          | Expandir testes E2E (exportação, admin CRUD, 2FA) | Cobertura E2E insuficiente              | `tests/e2e/`                                            | P0-02        | Alta         | 12h        | Mínimo 15 testes E2E cobrindo fluxos críticos                   | Médio |
| P1-04 | Infra           | Adicionar step de build no CI                     | CI não valida build                     | `.github/workflows/ci.yml`                              | —            | Baixa        | 1h         | CI executa `pnpm build` e falha se build quebrar                | Baixo |
| P1-05 | Infra           | Configurar SMTP real para produção                | E-mails de recuperação não são enviados | `infra/env/.env.production.example`, `email.service.ts` | —            | Média        | 4h         | E-mail de recuperação enviado com SMTP real                     | Médio |
| P1-06 | Observabilidade | Implementar logs estruturados (pino ou winston)   | Sem observabilidade                     | `apps/api/src/main.ts`, services                        | —            | Alta         | 8h         | Logs em formato JSON com nível, timestamp, contexto             | Alto  |
| P1-07 | Infra           | Documentar estratégia de backup e restore         | Sem backup documentado                  | `docs/architecture/ARQUITETURA.md`                      | —            | Média        | 4h         | Documento de backup/restore para Supabase e Redis               | Médio |
| P1-08 | Infra           | Documentar estratégia de rollback                 | Sem rollback documentado                | `docs/architecture/ARQUITETURA.md`                      | —            | Baixa        | 2h         | Procedimento de rollback via git + docker compose               | Baixo |

### P2 — Importante Após Estabilização

| ID    | Área            | Tarefa                                                              | Problema resolvido                         | Arquivos envolvidos                                                        | Dependências | Complexidade | Estimativa | Critério de aceite                                     | Risco |
| ----- | --------------- | ------------------------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------- | ------------ | ------------ | ---------- | ------------------------------------------------------ | ----- |
| P2-01 | Frontend        | Remover dependência de Supabase browser no frontend                 | Violação de arquitetura                    | `apps/web/src/lib/app-data.ts`, componentes                                | —            | Alta         | 8h         | Frontend não importa `@supabase/supabase-js`           | Médio |
| P2-02 | Testes          | Adicionar testes de segurança (rate limiting, CSRF, path traversal) | Cobertura de segurança insuficiente        | `apps/api/src/**/*.spec.ts`                                                | —            | Média        | 6h         | Testes cobrem rate limiting, CSRF, path traversal      | Baixo |
| P2-03 | Observabilidade | Adicionar métricas (Prometheus/Grafana ou similar)                  | Sem métricas                               | `apps/api/src/`                                                            | P1-06        | Alta         | 12h        | Endpoint `/metrics` com métricas de API                | Alto  |
| P2-04 | Frontend        | Implementar bloqueio proativo por inatividade no frontend           | Sessão não expira proativamente no cliente | `apps/web/src/components/app/`                                             | —            | Média        | 4h         | Frontend detecta inatividade e redireciona para login  | Baixo |
| P2-05 | Backend         | Silenciar erros Redis ECONNREFUSED quando sem Redis                 | Spam de erros no console                   | `apps/api/src/common/redis-connection.service.ts`                          | —            | Baixa        | 2h         | Log único de aviso em vez de spam contínuo             | Baixo |
| P2-06 | Código          | Remover código órfão (validation-test, authz-test)                  | Código morto                               | `apps/api/src/validation-test/`, `authz-test.controller.ts`                | —            | Baixa        | 1h         | Módulos removidos sem quebrar build                    | Baixo |
| P2-07 | Documentação    | Atualizar divergências entre ROADMAP, ESCOPO e código               | Documentação inconsistente                 | `ROADMAP.md`, `docs/product/ESCOPO.md`, `docs/architecture/ARQUITETURA.md` | —            | Média        | 4h         | ROADMAP reflete estado real; ESCOPO documenta Oracle   | Baixo |
| P2-08 | Backend         | Implementar cron de refresh de relatórios/KPIs                      | Refresh manual apenas                      | `apps/api/src/sql-server/`, `apps/api/src/platform/dashboard/`             | —            | Média        | 6h         | Cron agendado atualiza cache de queries periodicamente | Baixo |

### P3 — Evoluções Futuras

| ID    | Área    | Tarefa                                                 | Problema resolvido                                   | Arquivos envolvidos                  | Dependências | Complexidade | Estimativa | Critério de aceite                                           | Risco |
| ----- | ------- | ------------------------------------------------------ | ---------------------------------------------------- | ------------------------------------ | ------------ | ------------ | ---------- | ------------------------------------------------------------ | ----- |
| P3-01 | Exports | Implementar storage S3 para arquivos de export         | Arquivos locais sem redundância                      | `apps/api/src/platform/exports/`     | —            | Alta         | 12h        | Arquivos persistidos em S3 com URL assinada                  | Médio |
| P3-02 | BI      | Exportar dashboard como imagem/PDF                     | Usuário não pode exportar dashboard                  | `apps/web/src/components/dashboard/` | —            | Alta         | 8h         | Botão de export gera imagem/PDF do dashboard                 | Baixo |
| P3-03 | BI      | Compartilhamento de dashboards entre usuários do grupo | Dashboards são privados apenas                       | `apps/api/src/platform/dashboards/`  | —            | Alta         | 10h        | Usuários do mesmo grupo veem dashboards compartilhados       | Médio |
| P3-04 | Admin   | Alertas de segurança em tempo real                     | Sem alertas proativos                                | `apps/api/src/audit/`                | P2-03        | Muito alta   | 20h        | Alertas enviados para admins em eventos críticos             | Alto  |
| P3-05 | Infra   | Configurar alertas e dashboards de monitoramento       | Sem monitoramento                                    | Infra                                | P2-03        | Alta         | 16h        | Dashboard Grafana com métricas de API, DB, fila              | Alto  |
| P3-06 | Backend | Implementar multi-instância (escala horizontal)        | Fallback em memória não suporta múltiplas instâncias | `apps/api/src/`                      | P3-01        | Muito alta   | 40h        | API funciona com múltiplas instâncias atrás de load balancer | Alto  |

---

## 2. Separação por Prioridade

### P0 — Bloqueadores Críticos (4 tarefas, ~6.5h)

- P0-01: TLS/HTTPS no nginx
- P0-02: Validar config Playwright — concluído em 2026-08-25
- P0-03: Completar `.env.production.example` — concluído em 2026-08-25
- P0-04: Garantir TOTP_ENCRYPTION_KEY em produção

### P1 — Obrigatório para Lançamento (8 tarefas, ~49h)

- P1-01: Corrigir lint
- P1-02: Corrigir formatação — concluído em 2026-08-25
- P1-03: Expandir testes E2E
- P1-04: Build no CI
- P1-05: SMTP real
- P1-06: Logs estruturados
- P1-07: Documentar backup
- P1-08: Documentar rollback

### P2 — Importante Após Estabilização (8 tarefas, ~43h)

- P2-01 a P2-08

### P3 — Evoluções Futuras (6 tarefas, ~106h)

- P3-01 a P3-06

---

## 3. Dependências

```
P0-02 → P1-03 (testes E2E dependem de config correta)
P1-06 → P2-03 (métricas dependem de logs estruturados)
P2-03 → P3-04 (alertas dependem de métricas)
P2-03 → P3-05 (monitoramento depende de métricas)
P3-01 → P3-06 (multi-instância depende de storage externo)
```

---

## 4. Estimativas Consolidadas

| Prioridade | Tarefas | Estimativa total |
| ---------- | ------- | ---------------- |
| P0         | 4       | 6.5h             |
| P1         | 8       | 49h              |
| P2         | 8       | 43h              |
| P3         | 6       | 106h             |
| **Total**  | **26**  | **204.5h**       |

---

## 5. Critérios de Aceite

Cada tarefa tem critérios de aceite específicos na tabela acima. Adicionalmente:

- Toda tarefa P0/P1 deve ter teste de regressão
- Toda tarefa que altera API deve atualizar `docs/reference/api.md`
- Toda tarefa que altera frontend deve atualizar `docs/reference/web.md`
- Toda tarefa deve atualizar `docs/governance/RELATORIO.md` ao final

---

## 6. Ordem Recomendada de Implementação

1. **P0-02:** Validar config Playwright (concluído em 2026-08-25; desbloqueia testes E2E)
2. **P0-03:** Completar `.env.production.example` (concluído em 2026-08-25)
3. **P0-04:** Garantir TOTP_ENCRYPTION_KEY em produção
4. **P1-02:** Corrigir formatação Prettier (concluído em 2026-08-25; 387 arquivos padronizados)
5. **P1-04:** Adicionar build no CI
6. **P1-01:** Corrigir erros de lint (trabalho extenso)
7. **P1-03:** Expandir testes E2E
8. **P0-01:** Configurar TLS/HTTPS no nginx
9. **P1-05:** Configurar SMTP real
10. **P1-06:** Implementar logs estruturados
11. **P1-07:** Documentar backup
12. **P1-08:** Documentar rollback
13. **P2-05:** Silenciar erros Redis
14. **P2-06:** Remover código órfão
15. **P2-07:** Atualizar documentação divergente
16. **P2-01:** Remover Supabase browser do frontend
17. **P2-04:** Bloqueio por inatividade no frontend
18. **P2-02:** Testes de segurança
19. **P2-08:** Cron de refresh
20. **P2-03:** Métricas
21. **P3-xx:** Evoluções futuras conforme prioridade

---

## 7. Checklist para MVP

- [x] P0-02: Config Playwright validada; 7 testes E2E passando em 2026-08-25
- [x] P0-03: `.env.production.example` completo e validado em 2026-08-25
- [ ] P0-04: TOTP_ENCRYPTION_KEY documentada
- [x] P1-02: Formatação Prettier corrigida em 2026-08-25; 387 arquivos padronizados
- [ ] P1-04: Build no CI
- [ ] `pnpm test` passa (API + Web)
- [ ] `pnpm typecheck` passa
- [ ] `pnpm build` passa
- [ ] Fluxos principais validados manualmente (login, dashboard, relatório, export, admin)
- [ ] Supabase configurado e funcional
- [ ] SQL Server/Oracle acessível

---

## 8. Checklist para Produção

- [ ] Todos os itens do checklist MVP
- [ ] P0-01: TLS/HTTPS configurado no nginx
- [ ] P1-01: Lint sem erros
- [ ] P1-03: Testes E2E expandidos (mínimo 15)
- [ ] P1-05: SMTP real configurado
- [ ] P1-06: Logs estruturados implementados
- [ ] P1-07: Backup documentado e testado
- [ ] P1-08: Rollback documentado e testado
- [ ] `TOTP_ENCRYPTION_KEY` definida em produção
- [ ] `JWT_ACCESS_SECRET` forte em produção
- [ ] Redis configurado e healthcheck passando
- [ ] Docker Compose prod testado end-to-end
- [ ] Deploy VPS testado
- [ ] Healthchecks respondendo (`/health`, `/health/sql`)
- [ ] Sem secrets versionados
- [ ] Documentação operacional atualizada

---

## 9. Definition of Done Global

O projeto é considerado totalmente concluído quando:

- [ ] Todos os requisitos obrigatórios implementados
- [ ] Todos os critérios de aceite atendidos
- [ ] Projeto compila e executa (`pnpm build`, `pnpm dev:api`, `pnpm dev:web`)
- [ ] Fluxos críticos funcionam (login, dashboard, relatório, export, admin)
- [ ] Não existem bloqueadores P0
- [ ] Não existem vulnerabilidades críticas conhecidas
- [ ] Banco consistente (migrations aplicadas)
- [ ] Integrações obrigatórias conectadas (SQL Server, Supabase, SMTP)
- [ ] Testes críticos passando (`pnpm test`, `pnpm test:e2e:playwright`)
- [ ] Deploy configurado e testado
- [ ] Logs e alertas mínimos funcionando
- [ ] Documentação operacional atualizada
- [ ] Backup e restore documentados
- [ ] Ambiente de produção preparado
- [ ] `pnpm lint` passa
- [ ] `pnpm format:check` passa
- [ ] `pnpm quality` passa
- [ ] HTTPS/TLS ativo em produção
- [ ] Projeto operável sem depender exclusivamente de conhecimento informal
