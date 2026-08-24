# PRD - Dashboard Gusmao

**Versao:** 1.0
**Atualizado em:** 2026-08-24
**Status:** Base funcional parcial; BI de producao em validacao local

## 1. Produto

O Dashboard Gusmao e uma plataforma web interna de relatorios e inteligencia de negocio para centralizar indicadores operacionais do Grupo Franciosi. O produto deve transformar dados do sistema operacional agricola em visoes confiaveis, rastreaveis e uteis para gestao.

O ambiente local usa SQL Server demo para validar a plataforma. A integracao real sera feita posteriormente com Oracle 19c/COMPASS, em modo somente leitura, quando a infraestrutura fornecer rede, host, porta, service name e usuario apropriado.

## 2. Problema e publico

O sistema atual concentra informacoes em telas e relatorios operacionais que dificultam comparacao entre unidades, acompanhamento da safra, analise de qualidade e resposta rapida da gestao. O produto deve dar uma visao unica de producao sem esconder indisponibilidade ou inventar valores.

Publicos prioritarios:

- Gestao: visao consolidada, tendencia e frescor dos dados.
- Operacao agricola: colheita, graos, algodao e rendimento.
- Operacao da algodoeira: recebimento, beneficiamento, qualidade e estoque.
- Comercial e armazenagem: romaneios, saldos e movimentos, conforme as fases seguintes.
- Administradores: acesso, permissoes, auditoria e saude das integracoes.

## 3. Objetivos

- Entregar uma plataforma Docker local reproduzivel com Web, API, Redis e SQL Server demo.
- Validar login, dashboard, relatorios, healthchecks e comunicacao entre servicos.
- Entregar a primeira fatia de BI para producao de graos e algodao.
- Substituir a fonte de dados sem alterar o contrato consumido pela Web.
- Expor origem, status, data de corte, ultima sincronizacao e alertas em toda resposta de BI.
- Preparar a integracao Oracle/COMPASS sem credenciais reais no repositorio.

## 4. Escopo funcional

### 4.1 Plataforma base

- Autenticacao, sessao e autorizacao por perfil, setor e permissao.
- Dashboard inicial e catalogo de relatorios.
- Relatorios com filtros, visualizacao e exportacao quando autorizado.
- Administracao de usuarios, grupos, permissoes, configuracoes e auditoria.
- Indicadores de saude da API, da fonte de dados e dos jobs de atualizacao.

### 4.2 BI prioritario

O fluxo inicial deve seguir:

```text
Visao Grupo -> Colheita -> Graos / Algodao -> Algodoeira
                                      -> Romaneios
```

Primeira fatia:

- Resumo da producao.
- Producao de graos.
- Producao de algodao.
- Operacao da algodoeira.
- Romaneios e filtros relacionados.
- Frescor dos dados, data de corte e origem consultada.

Indicadores devem ser documentados com definicao, unidade, granularidade, periodo, fonte e regra de calculo. O conjunto inicial inclui volume produzido, area, produtividade, recebimento, beneficiamento, qualidade, saldo e movimentacao quando a fonte real permitir reconciliacao.

### 4.3 Fases posteriores

Armazenamento, comercial, embarques, resultados e custos ficam fora da primeira fatia, mas devem permanecer mapeados no roadmap para evolucao posterior.

## 5. Contrato de dados

Respostas versionadas de BI devem informar, no minimo:

```text
value
unit
dataAsOf
lastSyncedAt
source
status
definitionVersion
warnings
```

Estados como `not_configured`, `unavailable`, `stale` e `ready` devem ser explicitos. Quando a origem real estiver indisponivel, a API nao pode retornar fallback sintetico silencioso. Dados demo ou mock devem ser identificados pela configuracao e pelo campo `source`.

Endpoints versionados devem cobrir filtros, frescor, producao, algodao, algodoeira, solicitacao de atualizacao e status do job.

## 6. Integracao e atualizacao

- SQL Server demo e uma fonte local substituivel.
- Oracle 19c/COMPASS sera a fonte real de producao, somente leitura.
- Consultas Oracle devem ser parametrizadas, ter smoke queries e registrar falhas sem expor credenciais.
- Atualizacoes devem ser idempotentes, registrar inicio, fim, contagens, erros, watermark e ultimo snapshot valido.
- A data de corte deve ser visivel para permitir reconciliacao com o sistema de origem.
- Nenhuma credencial real, dump privado ou segredo deve ser criado ou versionado.

## 7. Requisitos nao funcionais

- Node.js >= 20.11 e pnpm 9.x.
- Docker Compose deve iniciar o ambiente demo de forma reproduzivel.
- API NestJS e Web Next.js devem ter healthchecks e comunicacao verificavel.
- Testes unitarios, integracao, E2E, typecheck e build devem permanecer executaveis.
- Falhas de dependencia, timeout, ausencia de credencial e repeticao de job devem ter comportamento observavel e testado.
- Logs, auditoria e respostas nao devem vazar tokens, senhas ou strings de conexao.

## 8. Criterios de aceite

### Ambiente demo

- SQL Server, API, Web e Redis iniciam com Docker Compose.
- Healthchecks e portas estao saudaveis.
- Login, dashboard e relatorios funcionam no ambiente demo.
- A API informa claramente quando a base demo nao possui dados de BI de producao.

### Qualidade

- `pnpm verify:workspace`
- `pnpm verify:docker`
- `pnpm verify:docs`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

### Oracle/COMPASS

- Acesso validado por smoke queries somente leitura.
- Consultas de producao reconciliadas com KPIs do sistema de origem.
- Data de corte, origem, frescor e warnings visiveis no dashboard.
- Timeout, indisponibilidade, falta de credencial e reexecucao do mesmo job cobertos por testes.

## 9. Fora do escopo imediato

- Criar ou distribuir credenciais Oracle.
- Promover o ambiente demo para producao.
- Definir HTTPS, backup, deploy e operacao definitiva antes da validacao local.
- Fechar armazenamento, comercial, embarques, resultados e custos na primeira entrega.

## 10. Fontes de requisitos

- `docs/product/solicitacoes-cliente-gusmao-2026-08-24.md`
- `docs/product/bi-grupo-franciosi-mapeamento.md`
- `docs/product/kpis-producao-graos-algodao-2026-08-24.md`
- `docs/integration/relatorio-integracao-bi-gusmao-2026-08-24.md`
- `docs/product/ESCOPO.md`
- `docs/product/ESCOPO_DASHBOARD_Plataforma_BI_V1.md`
- `ROADMAP.md`
