# SPEC-T09 — Exportação PDF/Excel com Histórico

**ID:** T09
**Módulo:** Reports
**Fase:** Fase 3
**Status:** Parcial
**Atualizado em:** 2026-09-29

> A API tem fila/worker BullMQ e download autenticado; arquivos são locais e a lista Web de histórico ainda usa fixtures. Consulte a [auditoria atual](../../audits/ESTADO_REAL_PROJETO_2026-09-29.md).

---

## 1. Objetivo

Permitir exportação de relatórios em PDF, Excel, CSV e JSON, com histórico de exportações, download autenticado e expiração automática.

## 2. Contexto

Fluxo de exportação para usuários com role downloader ou admin. A API gera os arquivos via pipeline assíncrono T09b; storage durável e histórico Web ligado à API permanecem pendentes.

## 3. Regras de Negócio

| Código | Regra                                               | Status     |
| ------ | --------------------------------------------------- | ---------- |
| RN-007 | Apenas Downloader e Admin podem exportar relatórios | Confirmado |
| RN-012 | Exportações expiram após 7 dias                     | Confirmado |

## 4. Fluxo Esperado

### Fluxo principal — Exportar

1. Usuário executa relatório e visualiza resultados.
2. Clica "Exportar" → modal com seleção de formato.
3. Seleciona PDF, Excel, CSV ou JSON.
4. POST /exports com reportId, formato, parâmetros.
5. API cria job assíncrono na fila; o worker gera o arquivo e grava no filesystem local.
6. Exportação registrada em api_export_jobs.
7. Frontend exibe notificação de conclusão.
8. Download disponível em GET /exports/:id/download.

### Fluxo — Histórico

1. Usuário acessa `/app/exports`.
2. A tela Web atual usa fixtures via `app-data.ts` no demo e não consulta o histórico real da API.
3. O contrato da API oferece listagem/status e download autenticado de jobs.

### Fluxo alternativo — Sem permissão

1. Usuário com role viewer tenta exportar.
2. API retorna 403.
3. Frontend exibe "Sem permissão para exportar".

## 5. Critérios de Aceite

- [x] Botão de exportação por relatório (PDF, Excel, CSV, JSON)
- [x] Modal de confirmação com seleção de formato
- [x] Geração assíncrona no backend via BullMQ/worker
- [ ] Histórico Web de exportações reconciliado com jobs reais
- [x] Download autenticado
- [x] Expiração automática (7 dias)
- [x] Controle de permissão (downloader/admin)
- [x] Pipeline assíncrono com BullMQ
- [ ] Notificação Web ligada ao job real após conclusão
- [ ] Storage S3 ou equivalente

## 6. Impacto Técnico

| Área           | Impacto                                                                              |
| -------------- | ------------------------------------------------------------------------------------ |
| Arquitetura    | Módulo Exports + integração Reports                                                  |
| Banco de dados | api_export_jobs (Supabase)                                                           |
| API            | POST /exports, GET /exports, GET /exports/:id/download                               |
| Frontend       | /app/exports, export-modal.tsx, exports-list.tsx                                     |
| Testes         | Unit (export-modal, exports-list), Integration (exports.controller, exports.service) |
| Infraestrutura | Storage de arquivos (local atual, S3 pendente)                                       |
| Segurança      | RolesGuard (downloader/admin), download autenticado, expiração                       |

## 7. Testes Necessários

| Tipo        | Arquivo                    | Descrição                                 |
| ----------- | -------------------------- | ----------------------------------------- |
| Unit        | export-modal.tsx           | Seleção de formato                        |
| Unit        | exports-list.tsx           | Listagem, filtros, download               |
| Integration | exports.controller.spec.ts | Solicitação de exportação                 |
| Integration | exports.service.spec.ts    | Geração de PDF/XLSX real                  |
| E2E         | —                          | Exportar → verificar notificação → baixar |
| Manual      | —                          | Verificar qualidade do arquivo gerado     |

## 8. Riscos

| Risco                             | Impacto                                               | Mitigação                                 |
| --------------------------------- | ----------------------------------------------------- | ----------------------------------------- |
| Fallback da fila pode perder jobs | Exportações pendentes podem sumir no modo alternativo | Exigir Redis na operação e monitorar fila |
| Arquivo grande                    | OOM, timeout                                          | Processamento assíncrono (T09b)           |
| Storage local cheio               | Falha em novas exportações                            | S3 ou equivalente (pendente)              |

## 9. Dependências

- `exports.service` (geração de PDF/Excel/CSV/JSON)
- `exports.controller` (solicitação, histórico, download)
- `roles.guard` (controle downloader/admin)
- BullMQ + Redis implementados (T09b); storage externo e histórico Web integrados pendentes
