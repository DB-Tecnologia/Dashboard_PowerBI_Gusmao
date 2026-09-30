# SPEC-reports-modulo — Módulo Reports (Relatórios)

**ID:** REP-MOD
**Módulo:** Reports
**Fase:** Base presente; fechamento V1 e integração produtiva pendentes
**Status:** Parcial
**Atualizado em:** 2026-09-29

> Pipeline BullMQ/Redis e worker estão implementados. Storage durável e histórico Web conectado à API permanecem pendentes. Consulte a [auditoria atual](../../audits/ESTADO_REAL_PROJETO_2026-09-29.md).

---

## 1. Objetivo

Gerenciar catálogo, visualização, filtros, execução, exportação e administração de relatórios provenientes do SQL Server.

## 2. Contexto

O módulo Reports é o núcleo funcional da plataforma. Usuários visualizam relatórios do seu setor, aplicam filtros, executam queries no SQL Server e exportam resultados. Admins gerenciam definições de relatórios (fonte SQL, parâmetros, setor).

## 3. Regras de Negócio

| Código | Regra                                                     | Status     |
| ------ | --------------------------------------------------------- | ---------- |
| RN-006 | Usuários só visualizam relatórios do seu setor            | Confirmado |
| RN-007 | Apenas Downloader e Admin podem exportar relatórios       | Confirmado |
| RN-009 | Queries ao SQL Server devem ser parametrizadas            | Confirmado |
| RN-010 | Somente SELECT e EXEC de stored procedures são permitidos | Confirmado |
| RN-012 | Exportações expiram após 7 dias                           | Confirmado |

## 4. Fluxo Esperado

### Fluxo principal — Catálogo → Visualização → Exportação

1. Usuário acessa `/app/reports` (catálogo).
2. Busca e filtra relatórios por setor/tipo.
3. Clica em relatório → `/app/reports/:id` (visualização).
4. Preenche parâmetros dinâmicos.
5. POST /reports/:id/execute → API executa query no SQL Server.
6. Resultados exibidos em tabela.
7. Usuário clica "Exportar" → seleciona formato (PDF/Excel/CSV/JSON).
8. POST /exports → API gera arquivo.
9. Download disponível.

### Fluxo — Admin (gestão de relatórios)

1. Admin acessa `/app/admin/reports`.
2. CRUD de definições: name, sector, source_type, source_name, parameters.
3. Teste de conexão antes de salvar (POST /admin/reports/validate).

## 5. Critérios de Aceite

- [x] Catálogo de relatórios por setor com busca e filtros
- [x] Visualização inline com parâmetros dinâmicos
- [x] Execução via SQL Server (queries parametrizadas)
- [x] Filtros avançados: texto, data, número, dropdown, AND/OR
- [x] Gestão administrativa (CRUD, parâmetros, validação de fonte)
- [x] Persistência real das definições (Supabase)
- [x] Favoritos por usuário
- [x] Exportação: PDF, Excel, CSV, JSON
- [x] Pipeline de export com BullMQ e fila
- [x] Worker de processamento assíncrono
- [ ] Storage S3 ou equivalente
- [ ] Preview de parâmetros com tipos na tela admin

## 6. Impacto Técnico

| Área           | Impacto                                                                          |
| -------------- | -------------------------------------------------------------------------------- |
| Arquitetura    | Módulo Reports + integração SQL Server + Exports                                 |
| Banco de dados | api_report_definitions, api_favorite_reports, api_export_jobs (Supabase)         |
| API            | GET /reports, POST /reports/:id/execute, CRUD /admin/reports, POST /exports      |
| Frontend       | /app/reports, /app/reports/:id, /app/admin/reports, /app/exports                 |
| Testes         | Unit (catalog, detail, filters, admin), Integration (controllers, repositories)  |
| Infraestrutura | SQL Server demo, BullMQ+Redis implementados, storage durável de arquivo pendente |
| Segurança      | Queries parametrizadas, validação de fonte, roles guard                          |

## 7. Testes Necessários

| Tipo        | Arquivo                                     | Descrição                                       |
| ----------- | ------------------------------------------- | ----------------------------------------------- |
| Unit        | reports-catalog.tsx                         | Listagem, busca, filtros                        |
| Unit        | report-detail.tsx                           | Parâmetros, execução, estados                   |
| Unit        | admin-reports.tsx                           | CRUD de definições                              |
| Unit        | report-advanced-filters.tsx                 | Composição de filtros                           |
| Integration | reports.controller.spec.ts                  | Catálogo, execução                              |
| Integration | report-definitions.admin.controller.spec.ts | CRUD admin                                      |
| Integration | report-definitions.repository.spec.ts       | Persistência híbrida                            |
| Integration | exports.controller.spec.ts                  | Solicitação de exportação                       |
| Integration | exports.service.spec.ts                     | Geração de PDF/XLSX                             |
| E2E         | —                                           | Buscar → filtrar → executar → exportar → baixar |
| Manual      | —                                           | Verificar qualidade de PDF/Excel gerado         |

## 8. Riscos

| Risco                          | Impacto                           | Mitigação                                                        |
| ------------------------------ | --------------------------------- | ---------------------------------------------------------------- |
| SQL Server indisponível        | Relatórios não carregam           | Healthcheck + fallback                                           |
| Query lenta                    | Timeout, UX degradada             | Cache LRU/TTL local implementado; métricas pendentes             |
| Fallback em memória perde jobs | Exportações perdidas ao reiniciar | Redis no pipeline principal; validar configuração e persistência |
| Arquivo de exportação grande   | OOM, timeout                      | Processamento assíncrono implementado; medir com cargas reais    |

## 9. Dependências

- `sql-server.service` (execução de queries)
- `report-definitions.repository` (persistência híbrida)
- `exports.service` (geração de PDF/Excel/CSV/JSON)
- BullMQ + Redis implementados para pipeline assíncrono
- S3 ou storage equivalente (pendente)
