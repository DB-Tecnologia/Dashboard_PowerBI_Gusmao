# ROADMAP_ATUALIZADO.md — Roadmap Baseado no Estado Real

**Projeto:** Dashboard Power BI
**Data:** 2026-07-20
**Base:** Auditoria completa baseada em evidências de código

---

## 1. Estado Atual

| Métrica                   | Valor                                     |
| ------------------------- | ----------------------------------------- |
| Conclusão do escopo total | 84%                                       |
| Conclusão do MVP          | 90%                                       |
| Completude funcional      | 88%                                       |
| Completude técnica        | 82%                                       |
| Prontidão para produção   | 65%                                       |
| Classificação atual       | MVP funcional com pendências de hardening |
| Nível de risco            | Médio                                     |
| Requisitos concluídos     | 58/72                                     |
| Requisitos parciais       | 8/72                                      |
| Requisitos não iniciados  | 6/72                                      |
| Bloqueadores P0           | 4                                         |
| Tarefas totais restantes  | 26                                        |

---

## 2. Fases Restantes

### Fase 0 — Correções Emergenciais (P0)

**Objetivo:** Eliminar bloqueadores críticos que impedem qualquer validação ou deploy.

**Tarefas:**

- P0-01: Configurar TLS/HTTPS no nginx
- P0-02: Corrigir config Playwright (webServer.url porta 3000)
- P0-03: Criar `.env.production.example` versionado
- P0-04: Garantir TOTP_ENCRYPTION_KEY em produção

**Dependências:** Nenhuma (primeira fase)

**Critérios de saída:**

- Testes E2E executam corretamente
- Variáveis de produção documentadas
- Nginx configurado para HTTPS

**Estimativa:** 6.5h

**Riscos:** Configuração de certificado TLS pode exigir domínio válido

---

### Fase 1 — Conclusão do MVP (P1 essenciais)

**Objetivo:** Garantir que o MVP seja utilizável de forma controlada em ambiente interno.

**Tarefas:**

- P1-02: Corrigir formatação Prettier (187 arquivos)
- P1-04: Adicionar step de build no CI
- P1-01: Corrigir erros de lint (1129 erros)
- P1-03: Expandir testes E2E (mínimo 15 testes)
- P1-05: Configurar SMTP real

**Dependências:** Fase 0 (P0-02 para testes E2E)

**Critérios de saída:**

- `pnpm quality` passa
- `pnpm test` passa
- `pnpm build` passa no CI
- Testes E2E cobrem fluxos críticos
- E-mails de recuperação enviados

**Estimativa:** 35h

**Riscos:** Correção de lint pode introduzir regressões se não feita com cuidado

---

### Fase 2 — Segurança e Estabilidade (P1 restantes + P2)

**Objetivo:** Hardening de segurança, observabilidade e estabilidade operacional.

**Tarefas:**

- P1-06: Logs estruturados (pino/winston)
- P1-07: Documentar backup e restore
- P1-08: Documentar rollback
- P2-05: Silenciar erros Redis ECONNREFUSED
- P2-06: Remover código órfão
- P2-07: Atualizar documentação divergente
- P2-01: Remover Supabase browser do frontend
- P2-04: Bloqueio por inatividade no frontend
- P2-02: Testes de segurança
- P2-08: Cron de refresh de relatórios

**Dependências:** Fase 1

**Critérios de saída:**

- Logs em formato JSON
- Backup e rollback documentados
- Frontend não depende de Supabase browser
- Documentação alinhada com código
- Cron de refresh funcional

**Estimativa:** 43h

**Riscos:** Remoção de Supabase browser pode quebrar componentes se não feita com testes

---

### Fase 3 — Homologação

**Objetivo:** Validar sistema end-to-end em ambiente de homologação.

**Tarefas:**

- Deploy em ambiente de homologação (VPS ou similar)
- Configurar Supabase de homologação
- Configurar SQL Server/Oracle de homologação
- Executar todos os fluxos críticos manualmente
- Executar suite completa de testes
- Validar performance com dados reais
- Validar 2FA/TOTP com app real
- Validar exportações com dados reais

**Dependências:** Fase 2

**Critérios de saída:**

- Todos os fluxos críticos validados
- Sem erros 500 em fluxos principais
- Performance aceitável (< 3s para dashboard home)
- 2FA funcional com Google Authenticator
- Exportações geram arquivos válidos

**Estimativa:** 16h

**Riscos:** Dados reais podem revelar problemas de query performance

---

### Fase 4 — Produção

**Objetivo:** Deploy em produção com monitoramento e segurança.

**Tarefas:**

- P0-01: Configurar TLS/HTTPS (certificado válido)
- Configurar domínio e DNS
- Deploy via GitHub Actions
- Configurar alertas básicos
- Validar healthchecks em produção
- Configurar backup automático do Supabase
- Configurar backup do Redis
- Treinar equipe de operação

**Dependências:** Fase 3

**Critérios de saída:**

- Sistema acessível via HTTPS
- Healthchecks respondendo
- Backup automático configurado
- Alertas básicos ativos
- Equipe treinada para operação básica

**Estimativa:** 12h

**Riscos:** Configuração de DNS e certificado pode exigir coordenação com infraestrutura do cliente

---

### Fase 5 — Melhorias Pós-Lançamento

**Objetivo:** Evoluções e funcionalidades opcionais.

**Tarefas:**

- P2-03: Métricas (Prometheus/Grafana)
- P3-01: Storage S3 para exports
- P3-02: Exportar dashboard como imagem/PDF
- P3-03: Compartilhamento de dashboards
- P3-04: Alertas de segurança em tempo real
- P3-05: Dashboard de monitoramento
- P3-06: Escala horizontal (multi-instância)

**Dependências:** Fase 4

**Critérios de saída:** Conforme cada tarefa

**Estimativa:** 106h

**Riscos:** Escala horizontal é complexa e pode exigir refatoração arquitetural

---

## 3. Entregáveis por Fase

| Fase   | Entregáveis                                                                  |
| ------ | ---------------------------------------------------------------------------- |
| Fase 0 | Nginx TLS, Playwright corrigido, env production, TOTP key                    |
| Fase 1 | Lint limpo, format limpo, CI com build, E2E expandido, SMTP real             |
| Fase 2 | Logs estruturados, backup/rollback docs, frontend sem Supabase, cron refresh |
| Fase 3 | Ambiente de homologação validado                                             |
| Fase 4 | Produção com HTTPS, backup, alertas                                          |
| Fase 5 | S3, export dashboard, compartilhamento, métricas, escala                     |

---

## 4. Dependências entre Fases

```
Fase 0 → Fase 1 → Fase 2 → Fase 3 → Fase 4 → Fase 5
```

Nenhuma fase pode ser pulada. Fase 5 pode ser executada em paralelo com operação de produção.

---

## 5. Riscos por Fase

| Fase   | Risco principal                                | Mitigação                                    |
| ------ | ---------------------------------------------- | -------------------------------------------- |
| Fase 0 | Certificado TLS exige domínio                  | Provisionar domínio com antecedência         |
| Fase 1 | Correção de lint introduz regressões           | Fazer em batches com testes entre cada batch |
| Fase 2 | Remoção de Supabase browser quebra componentes | Testes de componentes antes e depois         |
| Fase 3 | Dados reais revelam problemas de performance   | Testar com volume representativo             |
| Fase 4 | Configuração de DNS/certificado                | Coordenar com infra do cliente               |
| Fase 5 | Escala horizontal é complexa                   | Avaliar necessidade real antes de investir   |

---

## 6. Cenário Mínimo

**Objetivo:** MVP utilizável em ambiente interno controlado.

**Percentual atual relacionado:** 90%

**Tarefas restantes:**

- P0-02, P0-03, P0-04 (correções rápidas)
- P1-02, P1-04 (formatação + CI)
- Validação manual dos fluxos críticos

**Estimativa de esforço:** ~10h

**Principais riscos:** Sem TLS, sem observabilidade, sem backup — aceitável para MVP interno

**Condições necessárias:**

- Supabase configurado
- SQL Server/Oracle acessível
- Redis configurado (opcional, fallback em memória)

---

## 7. Cenário Recomendado

**Objetivo:** Produto estável, seguro e adequado para os primeiros clientes reais.

**Percentual atual relacionado:** 84%

**Tarefas restantes:**

- Todas as tarefas P0 (4)
- Todas as tarefas P1 (8)
- Tarefas P2 essenciais: P2-05, P2-06, P2-07, P2-01

**Estimativa de esforço:** ~75h

**Principais riscos:** Correção de lint extensa, remoção de Supabase browser

**Condições necessárias:**

- Todas do cenário mínimo
- TLS/HTTPS configurado
- SMTP real
- Logs estruturados
- Backup documentado

---

## 8. Cenário Completo

**Objetivo:** Conclusão de todo o escopo e roadmap originalmente definidos.

**Percentual atual relacionado:** 84%

**Tarefas restantes:**

- Todas as tarefas P0 (4)
- Todas as tarefas P1 (8)
- Todas as tarefas P2 (8)
- Todas as tarefas P3 (6)

**Estimativa de esforço:** ~204.5h

**Principais riscos:** Escala horizontal é complexa, alertas em tempo real exigem infraestrutura adicional

**Condições necessárias:**

- Todas do cenário recomendado
- S3 configurado
- Métricas e monitoramento ativos
- Multi-instância (se necessário)

---

## 7. Marcos Alcançados (Concluídos)

| Data       | Marco                                                        | Status |
| ---------- | ------------------------------------------------------------ | ------ |
| 2026-06-04 | Fundação técnica (monorepo, Docker, CI)                      | ✅     |
| 2026-06-05 | Auth e plataforma base                                       | ✅     |
| 2026-06-07 | Persistência de relatórios e favoritos                       | ✅     |
| 2026-06-10 | Dashboard admin e editor visual mínimo                       | ✅     |
| 2026-06-11 | BullMQ + Redis para exports                                  | ✅     |
| 2026-06-28 | Consolidação de governança                                   | ✅     |
| 2026-06-28 | Correções de segurança (CSRF, path traversal, timing attack) | ✅     |
| 2026-06-29 | 2FA obrigatório para admins                                  | ✅     |
| 2026-06-29 | Hardening de sessão (blacklist, versioning)                  | ✅     |
| 2026-06-29 | Herança de permissões via grupos                             | ✅     |
| 2026-06-29 | Cache de queries SQL com TTL e LRU                           | ✅     |
| 2026-06-29 | Retenção LGPD com cron diário                                | ✅     |
| 2026-06-29 | Editor visual completo (react-grid-layout)                   | ✅     |
| 2026-06-29 | Dashboard admin com tendências                               | ✅     |
| 2026-06-29 | Drill-down multi-dimensão                                    | ✅     |
| 2026-06-29 | Testes E2E com Playwright (6 testes)                         | ✅     |
| 2026-07-02 | Correção de 7 testes web                                     | ✅     |
| 2026-07-02 | Auditoria local (FALHAS.md)                                  | ✅     |
