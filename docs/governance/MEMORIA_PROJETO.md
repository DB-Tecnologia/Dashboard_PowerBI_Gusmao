# Memória Persistida do Projeto

**Projeto:** Dashboard Power BI Gusmão

**Última atualização:** 2026-08-25
**Finalidade:** contexto consolidado e histórico de handoff técnico para agentes e colaboradores.

## Objetivo e leitura

Este documento preserva um retrato reutilizável do projeto entre sessões, conversas e agentes. Ele combina o estado vigente, as decisões técnicas, as validações e a linha do tempo das tarefas concluídas.

Ao iniciar uma tarefa relevante, leia nesta ordem:

1. `README.md`, para visão comercial e operação local.
2. `AGENTS.md`, para regras de desenvolvimento, segurança e entrega.
3. `PRD.md`, para produto, requisitos e critérios de aceite.
4. `ROADMAP.md`, para prioridade e estado das tarefas.
5. `docs/INDEX.md`, para localizar a documentação canônica.
6. Este arquivo, para o snapshot e o histórico consolidado.
7. `docs/governance/CONTEXTO.md` e `docs/governance/RELATORIO.md`, para decisões e diário formal mais recentes.

Depois da leitura, confira o snapshot contra o código, os comandos de validação e o Git. O runtime real prevalece sobre documentos históricos ou escopos desejados.

## Snapshot vigente

### Estado do produto

O produto é uma plataforma web interna de relatórios e BI em estado funcional parcial. A base disponível contempla autenticação, sessão, perfil, dashboard inicial, catálogo e visualização de relatórios, administração de usuários e grupos, permissões, notificações, exportações, auditoria e configurações.

O ambiente demo local é o principal critério de validação atual. Ele usa SQL Server como fonte demonstrativa e pode ser executado com a topologia Docker documentada. A integração produtiva com Oracle 19c/COMPASS ainda depende de informações de infraestrutura e de consultas de reconciliação.

**Nível de prontidão atual:**

- **Desenvolvimento local:** pronto para validação reproduzível com Docker demo.
- **Qualidade automatizada:** gates de lint, formatação, typecheck, testes, build, documentação, ambiente, Docker e E2E aprovados no último ciclo concluído.
- **Produção:** não liberada; a exigência da chave TOTP no boot foi concluída, mas ainda faltam integração Oracle/COMPASS, hardening operacional, SMTP real e demais itens do roadmap.
- **BI de produção:** ainda não reconciliado com a fonte Oracle; não declarar KPIs produtivos como validados antes do smoke test e da reconciliação.

### Estado do Git

- Branch de trabalho: `main`.
- Remote esperado: `origin` apontando para `DB-Tecnologia/Dashboard_PowerBI_Gusmao`.
- Último ciclo funcional concluído antes desta tarefa: `6b92afe` (`docs: criar memoria persistida do projeto`).
- A memória é criada neste ciclo. O hash do próprio commit será comunicado na entrega e incorporado no próximo snapshot, evitando referência circular.

## Produto, stack e topologia

### Contexto de negócio

O Dashboard Gusmão organiza indicadores operacionais para apoiar gestão, acompanhamento da produção e exploração de relatórios. A primeira fatia de BI prioriza produção, grãos, algodão, algodoeira e romaneios. Armazenamento, comercial, embarques, resultados e custos permanecem em fases posteriores.

### Stack

- Node.js 20 ou superior.
- pnpm 9.x e pnpm workspaces.
- API NestJS com TypeScript strict, Jest e Supertest.
- Web Next.js 14 com App Router, TypeScript strict, Tailwind CSS e Testing Library.
- SQL Server via `mssql` para a origem demo e compatibilidade legada.
- Supabase em partes da plataforma.
- Redis previsto na topologia Docker e nos contratos de ambiente, mas não deve ser tratado como dependência funcional principal sem evidência no runtime.
- Docker Compose para ambiente demo e preparação de produção.
- Playwright para os fluxos E2E.

### Topologia vigente

```text
Browser -> apps/web (Next.js, porta 3000)
       -> apps/api (NestJS, porta 3001)
       -> SQL Server demo / Oracle 19c COMPASS na produção
       -> Redis para os serviços previstos no Compose
```

O fluxo de desenvolvimento usa a Web na porta `3000` e a API demo na porta `3001`. A comunicação entre containers deve usar os nomes de serviço do Compose, sem transformar a porta local em contrato interno.

### Módulos reais

1. Auth
2. Admin Users
3. Admin Groups
4. Permissions
5. Reports
6. Dashboard
7. Notifications
8. Exports
9. Audit
10. Settings
11. SQL Server

Itens como dashboard interativo completo, editor visual, 2FA/TOTP e processamento durável devem ser tratados como lacunas ou trabalho parcial até que existam no runtime e nos testes.

## Arquitetura e fontes de dados

### Fonte demo

O SQL Server demo permite iniciar e validar a plataforma sem depender do ambiente do cliente. Os templates de ambiente e o Compose documentam o uso local, os healthchecks e a comunicação entre Web, API, SQL Server e Redis.

### Fonte produtiva

Oracle 19c/COMPASS é a fonte alvo para produção, com acesso somente leitura. Ainda são necessários:

- rede e autorização entre o ambiente da aplicação e o Oracle;
- host, porta e service name;
- usuário somente leitura fornecido pela infraestrutura;
- smoke queries aprovadas;
- mapeamento das tabelas, campos, unidades e data de corte;
- reconciliação dos KPIs de produção, grãos, algodão, algodoeira e romaneios;
- atualização idempotente com watermark, contagens, erros e último snapshot válido.

Não existe dump Oracle versionado no repositório e nenhum agente deve criar credenciais fictícias como se fossem acesso produtivo.

### Contrato de dados esperado

As respostas de BI devem evoluir com os metadados `value`, `unit`, `dataAsOf`, `lastSyncedAt`, `source`, `status`, `definitionVersion` e `warnings`. Endpoints versionados de filtros, frescor, produção, algodão, algodoeira, atualização e status do job fazem parte da direção do produto, mas não devem ser declarados concluídos apenas por estarem descritos.

## Regras para agentes

As regras completas estão em [`AGENTS.md`](../../AGENTS.md). Em resumo:

- trabalhar sobre o estado real do código;
- ler a documentação canônica antes de editar;
- limitar o escopo e não inventar arquitetura ou regra de negócio;
- preservar contratos, segurança, testes e histórico;
- nunca registrar ou versionar secrets, tokens, senhas, chaves privadas, cookies, `.env` reais ou dados sensíveis;
- atualizar `ROADMAP.md`, `CONTEXTO.md`, `RELATORIO.md` e esta memória quando a tarefa exigir;
- executar as validações aplicáveis antes de declarar a tarefa concluída;
- criar commit independente em português brasileiro e confirmar o push quando esse for o acordo da tarefa.

## Roadmap e próximas prioridades

As tarefas P0-02, P0-03, P1-02, P1-01 e P0-04 estão concluídas. As prioridades vigentes são:

1. **P1-03:** ampliar E2E para filtros, exportação, administração e 2FA quando os fluxos existirem no runtime.
2. **P1-04:** consolidar build e qualidade no CI.
3. **P0-01:** preparar TLS/HTTPS de produção.
4. **P1-05:** implementar SMTP real; o modo mock continua sendo uma limitação documentada.
5. **P1-06 a P1-08:** logs estruturados, backup e rollback operacional.
6. **Integração Oracle/COMPASS:** executar quando a infraestrutura fornecer os dados de conexão e acesso somente leitura.

A ordem final deve ser confirmada no `ROADMAP.md` e pode ser ajustada pelo risco de lançamento.

## Validações conhecidas

No último ciclo concluído, foram aprovados os gates abaixo:

- `pnpm lint`: zero erros e zero avisos após P1-01.
- `pnpm format:check`: aprovado após a padronização de 387 arquivos em P1-02.
- `pnpm verify:workspace`, `pnpm verify:env`, `pnpm verify:docker` e `pnpm verify:docs`.
- `pnpm quality`.
- `pnpm typecheck`, `pnpm test` e `pnpm build`.
- `pnpm test:e2e:playwright`, com os fluxos existentes contra Web `3000` e API demo `3001`.

Essas evidências comprovam a base demo e a qualidade do código no ciclo registrado. Elas não substituem a validação Oracle, a reconciliação de KPIs nem o teste de produção.

## Decisões técnicas relevantes

| Data       | Decisão                                                             | Motivo                                                                    | Impacto                                                                 |
| ---------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 2026-08-24 | SQL Server demo é a primeira fonte local                            | Permitir validação reproduzível sem o Oracle do cliente                   | Docker e E2E podem ser executados localmente                            |
| 2026-08-24 | Oracle 19c/COMPASS é a fonte alvo de produção                       | Alinhar a plataforma ao sistema operacional do cliente                    | Integração real depende de rede, service name e acesso somente leitura  |
| 2026-08-25 | Playwright usa Web `3000` e API demo `3001`                         | Refletir a topologia real do ambiente local                               | Login e navegação E2E ficaram verificáveis                              |
| 2026-08-25 | Template de produção usa `DATABASE_PROVIDER=oracle` sem credenciais | Tornar o contrato de deploy explícito sem expor dados sensíveis           | Infraestrutura deve preencher os valores em ambiente seguro             |
| 2026-08-25 | Prettier e ESLint são gates obrigatórios                            | Reduzir variação de revisão e falhas estáticas                            | Formatação e lint passaram a ser evidências de entrega                  |
| 2026-08-25 | Memória persistida separada de contexto e diário                    | Reduzir perda de contexto sem misturar decisão atual com histórico formal | Agentes recebem um pacote de handoff consolidado                        |
| 2026-08-25 | Produção falha sem `TOTP_ENCRYPTION_KEY`                            | Impedir armazenamento de secrets TOTP em texto simples                    | O provider falha antes do `listen`; dev/teste preservam compatibilidade |

## Linha do tempo de tarefas

### 2026-08-25 — P0-02: validar configuração do Playwright

- **Objetivo:** comprovar E2E contra Web `3000` e API demo `3001`.
- **Áreas/arquivos:** configuração e testes Playwright relacionados; documentação vigente de operação e governança.
- **Validações:** suíte Playwright existente aprovada com 7 testes, incluindo login válido, login inválido, logout, dashboard, drill-down e catálogo de relatórios; gates gerais registrados no relatório.
- **Limitações/riscos:** cobertura adicional de filtros, exportação, administração e 2FA permanece em P1-03; Oracle não foi exercitado.
- **Commit/push:** `5738dbb`, publicado em `origin/main`.
- **Próximos passos:** ampliar a cobertura quando os fluxos P1-03 forem priorizados.

### 2026-08-25 — P0-03: completar exemplo de ambiente de produção

- **Objetivo:** documentar o contrato de produção com Oracle como fonte padrão sem versionar segredos.
- **Áreas/arquivos:** `infra/env/.env.production.example`, verificador de ambiente, documentação de setup, arquitetura, banco e governança.
- **Validações:** `pnpm verify:env` e demais gates registrados no relatório; template sem credenciais demo e com placeholders seguros.
- **Limitações/riscos:** deploy real depende de domínio, certificados, Supabase, rede Oracle, usuário somente leitura e SMTP real.
- **Commit/push:** `363cab7`, publicado em `origin/main`.
- **Próximos passos:** P0-04 para exigir a chave TOTP no boot.

### 2026-08-25 — P1-02: padronizar formatação do projeto

- **Objetivo:** remover a dívida de formatação identificada pelo Prettier.
- **Áreas/arquivos:** 387 arquivos compatíveis com a configuração existente; política de finais de linha documentada.
- **Validações:** `pnpm format:check` aprovado e diff auditado sem mudança funcional.
- **Limitações/riscos:** o lint permaneceu em tarefa separada, concluída depois em P1-01.
- **Commit/push:** `a20b0c1`, publicado em `origin/main`.
- **Próximos passos:** manter o gate no fluxo de qualidade e evitar reintrodução de divergências.

### 2026-08-25 — P1-01: corrigir dívida de lint

- **Objetivo:** eliminar erros e avisos do ESLint sem esconder problemas por desativação ampla.
- **Áreas/arquivos:** configuração de exclusão de artefatos gerados, scripts e código TypeScript/TSX afetado pelas regras.
- **Validações:** diagnóstico inicial aparente de 7.920 erros e 683 avisos foi reduzido a 25 achados reais após excluir artefatos; os 2 erros e 23 avisos reais foram corrigidos; `pnpm lint` e `pnpm quality` passaram sem erros ou avisos.
- **Limitações/riscos:** exceções restritas para scripts CLI permanecem documentadas; lint não prova reconciliação de dados Oracle.
- **Commit/push:** `58fd208`, publicado em `origin/main`.
- **Próximos passos:** preservar o gate e avançar para P0-04 ou P1-03 conforme prioridade de lançamento.

### 2026-08-25 — P0-04: exigir chave TOTP no boot de produção

- **Objetivo:** impedir que a API de produção use o fallback em texto simples para secrets TOTP.
- **Áreas/arquivos:** `apps/api/src/auth/services/totp-encryption.service.ts`, testes unitários, template de ambiente e documentação vigente.
- **Validações:** teste específico passou com 9 casos para ausência, whitespace, chave válida, fallback fora de produção e round-trip criptográfico; gates globais passaram, com API 48/48 e 313 testes, Web 43/43 e 142 testes, build aprovado e Playwright 7/7. Smoke real em produção sem chave recusou o boot antes do `listen`.
- **Limitações/riscos:** a chave real continua dependente da infraestrutura e deve ser fornecida por gerenciador de segredos; rotação e backup codes permanecem fora do escopo.
- **Commit/push:** será criado com a mensagem `security: exigir chave TOTP no boot de producao` e publicado em `origin/main`; o hash final será comunicado na entrega e consolidado no próximo snapshot.
- **Próximos passos:** P1-03 para expandir E2E de 2FA e fluxos administrativos.

### 2026-08-25 — Criar memória persistida do projeto

- **Objetivo:** criar um pacote consolidado de contexto e histórico para handoff entre agentes.
- **Áreas/arquivos:** esta memória, `docs/INDEX.md`, `AGENTS.md`, `docs/governance/CONTEXTO.md`, `docs/governance/RELATORIO.md`, `scripts/verify-docs.mjs` e referência de documentação no `README.md`.
- **Validações:** `pnpm verify:docs`, `pnpm verify:workspace`, `pnpm verify:env`, `pnpm verify:docker`, `pnpm format:check`, `pnpm quality`, `pnpm typecheck`, `pnpm test`, `pnpm build` e `pnpm test:e2e:playwright` passaram. A primeira execução E2E teve uma falha transitória no logout; o teste isolado e a repetição completa passaram com 7 de 7.
- **Limitações/riscos:** o hash final deste próprio commit será incorporado no próximo snapshot para evitar referência circular.
- **Commit/push:** será comunicado na entrega e publicado em `origin/main`.
- **Próximos passos:** iniciar a próxima tarefa lendo esta memória e confirmar seu snapshot contra o runtime e o Git.

## Pendências e bloqueios

| Item                                         | Estado                               | Impacto                                                                     |
| -------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------- |
| Integração Oracle/COMPASS                    | Bloqueada por infraestrutura         | Não há conexão produtiva nem reconciliação de KPIs                          |
| Smoke queries e data de corte                | Pendente                             | Sem prova de consistência dos indicadores reais                             |
| Atualização idempotente e ledger de execução | Pendente                             | Frescor, watermark e último snapshot ainda precisam de fechamento produtivo |
| E2E expandido                                | Pendente em P1-03                    | Cobertura de filtros, exportação, administração e 2FA ainda é limitada      |
| SMTP real                                    | Pendente em P1-05                    | Notificações produtivas continuam dependendo do modo mock                   |
| TLS, backup, rollback e logs operacionais    | Pendentes em P0-01/P1-06/P1-07/P1-08 | Hardening e operação de produção não concluídos                             |

## Protocolo de atualização

### Ao iniciar uma tarefa

1. Ler os documentos listados em [Objetivo e leitura](#objetivo-e-leitura).
2. Conferir branch, remote, árvore de trabalho e último commit.
3. Comparar o snapshot com o código, os serviços e os comandos de validação aplicáveis.
4. Registrar qualquer divergência como pendência ou decisão antes de tratá-la como fato.

### Ao finalizar uma tarefa

1. Atualizar o snapshot com o estado real, sem declarar como pronto o que não foi validado.
2. Adicionar uma entrada na linha do tempo com objetivo, áreas, validações, riscos, commit, push e próximos passos.
3. Atualizar `CONTEXTO.md` para decisões e riscos atuais.
4. Atualizar `RELATORIO.md` como diário formal da sessão.
5. Ajustar `ROADMAP.md` e `docs/INDEX.md` quando o estado ou a navegação mudarem.
6. Executar `pnpm verify:docs` e os gates aplicáveis antes do commit.
7. Conferir o diff, a árvore de trabalho e a sincronização com `origin/main`.

## Segurança e dados proibidos

Esta memória nunca deve conter secrets, tokens, senhas, chaves privadas, cookies, credenciais, conteúdo de `.env` real, dados pessoais ou valores de acesso a Oracle, SQL Server, Supabase, SMTP ou JWT. Use somente nomes de variáveis, placeholders seguros, estados e referências a documentação. Se uma tarefa revelar dado sensível, registre apenas que existe uma dependência protegida e remova o valor do texto, do diff e do histórico antes da entrega.
