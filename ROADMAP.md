# ROADMAP.md — Roadmap de Desenvolvimento

**Projeto:** Dashboard Power BI
**Atualizado em:** 2026-09-29
**Metodologia:** Specification-Driven Development (SDD) + Test-Driven Development (TDD)

**Fonte de prioridade e execução.** Para saber se uma capacidade foi verificada no runtime e separar protótipo, demo, persistência e prontidão para produção, use [Estado real do projeto (2026-09-29)](docs/audits/ESTADO_REAL_PROJETO_2026-09-29.md).

- **Base do escopo:** `docs/product/ESCOPO_DASHBOARD_Plataforma_BI_V1.md`
- **Estado verificado do runtime:** `docs/audits/ESTADO_REAL_PROJETO_2026-09-29.md`
- **Análise histórica de aderência:** `docs/audits/ANALISE_ESCOPO_V1.md` (não é a referência de status atual)
- **Escopo consolidado:** `docs/product/ESCOPO.md`

---

## 1. Visão Geral do Roadmap

O projeto evolui em fases, épicos, histórias e tarefas. Cada item segue o padrão **SDD + TDD**:

- **SDD — Especificação:** o que deve ser entregue, critérios funcionais, dependências
- **TDD — Testes:** testes unitários, integração, E2E, validação manual, comandos de verificação
- **Entregáveis:** arquivos, rotas, data de conclusão, notas e débitos técnicos

Documentos detalhados por categoria:

- [📋 Telas (18 do escopo V1)](docs/roadmap/01-telas.md)
- [📋 Módulos (6 funcionais)](docs/roadmap/02-modulos.md)
- [📋 Tarefas técnicas e infraestrutura](docs/roadmap/03-tarefas-tecnicas.md)

---

## 2. Convenções de Status

- `PENDENTE` — não iniciado
- `EM ESPECIFICAÇÃO` — SDD em andamento
- `ESPECIFICADO` — especificação concluída, aguardando implementação
- `EM TESTE` — TDD em andamento (fase RED/GREEN)
- `EM DESENVOLVIMENTO` — implementação em andamento
- `EM REVISÃO` — implementação concluída, aguardando validação
- `CONCLUÍDO` — validado, testado e documentado
- `BLOQUEADO` — impedido por dependência externa
- `CANCELADO` — descartado ou fora de escopo

Os status “concluído” de tarefas técnicas abaixo registram a implementação descrita naquela tarefa; não certificam que o produto inteiro esteja pronto para produção. A prontidão das telas e dos módulos V1 está resumida na auditoria de estado real.

---

## Visão Geral de Progresso

| Categoria                       | Concluído | Parcial | Pendente | Total |
| ------------------------------- | :-------: | :-----: | :------: | :---: |
| **Telas V1**                    |     0     |   18    |    0     |  18   |
| **Módulos V1**                  |     0     |    6    |    0     |   6   |
| **Frentes de fechamento do V1** |     0     |    0    |    7     |   7   |

As 18 telas têm implementação ou fluxo demonstrável em algum grau; “parcial” indica que isso não comprova persistência durável, dados reais reconciliados ou aceite de produção. Os números não são uma porcentagem de código concluído.

---

## Fases de Entrega

| Fase       | Nome                       | Objetivo                                                 | Status                                                             |
| ---------- | -------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------ |
| **Fase 0** | Fundação técnica           | Monorepo, Docker e automação base                        | 🟠 Base presente; operação produtiva não validada                  |
| **Fase 1** | Auth e plataforma base     | Login, JWT, refresh, usuários/grupos e relatórios        | 🟠 Fluxos presentes; persistência demo parcial                     |
| **Fase 2** | Administração e governança | Permissões, auditoria, settings, profile e segurança     | 🟠 APIs/telas presentes; dependem de configuração durável e aceite |
| **Fase 3** | BI avançado e dashboards   | Gráficos, drill-down, dashboards personalizados e editor | 🟠 UI e APIs presentes; BI real Oracle/COMPASS pendente            |
| **Fase 4** | Hardening e fechamento     | TOTP, E2E e aceite operacional                           | 🟠 Alguns controles existem; liberação de produção pendente        |

---

## Resumo por Tela

| ID  | Tela                                         | Status                                               | Fase   |
| --- | -------------------------------------------- | ---------------------------------------------------- | ------ |
| T01 | Login                                        | 🟠 Presente, parcial                                 | Fase 1 |
| T02 | Recuperação de senha                         | 🟠 Presente, parcial                                 | Fase 1 |
| T03 | Dashboard Home (KPIs)                        | 🟠 Demo sintética; BI real pendente                  | Fase 1 |
| T04 | Catálogo de relatórios                       | 🟠 Presente; catálogo SQL demo                       | Fase 1 |
| T05 | Visualização de relatório                    | 🟠 Presente; SQL demo                                | Fase 1 |
| T06 | Filtros avançados                            | 🟠 Presente; validar com dados do cliente            | Fase 1 |
| T07 | Dashboard interativo (gráficos + drill-down) | 🟠 UI/API presentes; dados reais pendentes           | Fase 3 |
| T08 | Dashboards personalizados e favoritos        | 🟠 Presente; persistência opcional                   | Fase 3 |
| T09 | Exportação PDF/Excel com histórico           | 🟠 API gera arquivos; tela de histórico usa fixtures | Fase 3 |
| T10 | Meu perfil                                   | 🟠 Presente; durabilidade depende da configuração    | Fase 2 |
| T11 | Central de notificações                      | 🟠 API presente; tela Web usa fixtures               | Fase 1 |
| T12 | Dashboard administrativo                     | 🟠 Presente; dados variam por ambiente               | Fase 4 |
| T13 | Gestão de usuários                           | 🟠 Presente; fallback demo em memória                | Fase 1 |
| T14 | Gestão de permissões                         | 🟠 Presente; validar persistência e regras           | Fase 2 |
| T15 | Gestão de relatórios (admin)                 | 🟠 Presente; persistência híbrida                    | Fase 2 |
| T16 | Editor visual drag-and-drop                  | 🟠 Presente; faltam capacidades V1 finais            | Fase 3 |
| T17 | Auditoria com filtros                        | 🟠 Presente; durabilidade depende do repositório     | Fase 2 |
| T18 | Configurações do sistema                     | 🟠 Presente; fallback demo em memória                | Fase 1 |

---

## Resumo por Módulo

| Módulo      | Status     |                                Concluído                                 |                      Parcial                       |                            Pendente                             |
| ----------- | ---------- | :----------------------------------------------------------------------: | :------------------------------------------------: | :-------------------------------------------------------------: |
| AUTH        | 🟠 Parcial | Login, sessão, refresh, recuperação, TOTP admin, rate limit e revogação  |       Persistência demo e operação de email        |              Validar IdP/segredos e operação real               |
| PERMISSIONS | 🟠 Parcial |           Roles, setores, grupos, permissões, herança e guards           |       Persistência não durável sem Supabase        |                Validar matriz e aceite por papel                |
| SQL         | 🟠 Parcial |    SQL Server demo, parâmetros, identificadores, cache local LRU/TTL     |              BI Oracle não conectado               |        Oracle/COMPASS, refresh durável e observabilidade        |
| REPORTS     | 🟠 Parcial |          Catálogo, consulta, filtros, admin e export API/worker          |  Tela de histórico usa fixtures; arquivos locais   |       Dados reais, storage durável e histórico integrado        |
| BI          | 🟠 Parcial |             Home, Recharts, séries demo, drill-down e editor             |   Demo sintética; refresh não persiste snapshots   | Oracle/COMPASS, reconciliação, compartilhamento e versionamento |
| ADMIN       | 🟠 Parcial | Usuários, grupos, permissões, auditoria, settings, tendências e retenção | Algumas listas Web usam fixtures; fallback memória |            Persistência, operação e aceite completos            |

---

## 4. Backlog Geral

| ID      | Tipo           | Descrição                                      | Prioridade | Status    |
| ------- | -------------- | ---------------------------------------------- | ---------- | --------- |
| EP-0001 | Épico          | Criar governança do repositório                | Alta       | CONCLUÍDO |
| EP-0002 | Épico          | Mapear arquitetura                             | Alta       | CONCLUÍDO |
| EP-0003 | Épico          | Mapear banco de dados                          | Alta       | CONCLUÍDO |
| EP-0004 | Épico          | Definir escopo inicial                         | Alta       | CONCLUÍDO |
| EP-0005 | Épico          | Definir estratégia de testes                   | Alta       | CONCLUÍDO |
| T16b    | Tarefa         | Editor visual drag-and-drop completo           | Alta       | CONCLUÍDO |
| T07b    | Tarefa         | Drill-down multi-dimensão                      | Média      | CONCLUÍDO |
| T08b    | Tarefa         | Widgets editáveis e dashboard padrão por setor | Média      | CONCLUÍDO |
| T09b    | Tarefa         | Pipeline BullMQ + Redis para exports           | Média      | CONCLUÍDO |
| T12b    | Tarefa         | Dashboard admin com gráficos de tendência      | Baixa      | CONCLUÍDO |
| DT-001  | Débito técnico | 2FA obrigatório para admins                    | Alta       | CONCLUÍDO |
| DT-002  | Débito técnico | Hardening final de sessão                      | Alta       | CONCLUÍDO |
| DT-003  | Débito técnico | Herança de permissões via grupos               | Média      | CONCLUÍDO |
| DT-004  | Débito técnico | Cache de queries SQL Server                    | Média      | CONCLUÍDO |
| DT-005  | Débito técnico | Testes E2E (Playwright)                        | Média      | CONCLUÍDO |
| DT-006  | Débito técnico | Política de retenção de logs (LGPD)            | Alta       | CONCLUÍDO |

---

## 5. Matriz SDD/TDD por Tarefa

| ID  | Tarefa                    | Spec criada | Teste criado | Implementado | Documentado |
| --- | ------------------------- | ----------- | ------------ | ------------ | ----------- |
| T01 | Login                     | Sim         | Sim          | Sim          | Sim         |
| T02 | Recuperação de senha      | Sim         | Sim          | Sim          | Sim         |
| T03 | Dashboard Home            | Sim         | Sim          | Sim          | Sim         |
| T04 | Catálogo de relatórios    | Sim         | Sim          | Sim          | Sim         |
| T05 | Visualização de relatório | Sim         | Sim          | Sim          | Sim         |
| T06 | Filtros avançados         | Sim         | Sim          | Sim          | Sim         |
| T07 | Dashboard interativo      | Sim         | Sim          | Sim          | Sim         |
| T08 | Dashboards personalizados | Sim         | Sim          | Sim          | Sim         |
| T09 | Exportação PDF/Excel      | Sim         | Sim          | Sim          | Sim         |
| T10 | Meu perfil                | Sim         | Sim          | Sim          | Sim         |
| T11 | Notificações              | Sim         | Sim          | Sim          | Sim         |
| T12 | Dashboard administrativo  | Sim         | Sim          | Sim          | Sim         |
| T13 | Gestão de usuários        | Sim         | Sim          | Sim          | Sim         |
| T14 | Gestão de permissões      | Sim         | Sim          | Sim          | Sim         |
| T15 | Gestão de relatórios      | Sim         | Sim          | Sim          | Sim         |
| T16 | Editor visual             | Sim         | Sim          | Sim          | Sim         |
| T17 | Auditoria                 | Sim         | Sim          | Sim          | Sim         |
| T18 | Configurações do sistema  | Sim         | Sim          | Sim          | Sim         |

---

## 6. Definição de Pronto

Uma tarefa só é considerada pronta quando:

- [ ] Requisito documentado
- [ ] Critérios de aceite definidos
- [ ] Teste criado ou justificativa registrada
- [ ] Implementação concluída
- [ ] Testes passando (`pnpm test`, `pnpm typecheck`)
- [ ] Documentação atualizada
- [ ] `CONTEXTO.md` atualizado
- [ ] `RELATORIO.md` atualizado

---

## Notas e Próximos Passos

1. **Próxima onda:** persistência durável e alinhamento das telas de notificações/exportações à API.
2. **Concluído:** Editor visual drag-and-drop completo (T16b) — 2026-06-29
3. **Concluído:** 2FA obrigatório para admins (DT-001), hardening de sessão (DT-002), herança via grupos (DT-003), cache SQL (DT-004), retenção LGPD (DT-006)
4. **Concluído:** Dashboard padrão por setor (T08b) — 2026-06-29
5. **Concluído:** Dashboard admin com gráficos de tendência (T12b) — 2026-06-29
6. **Concluído:** Drill-down multi-dimensão (T07b) — 2026-06-29 (seletor de dimensão, breadcrumb, 3-5 dimensões por KPI)
7. **Concluído:** Testes E2E com Playwright (DT-005) — 2026-06-29 (6 testes: auth, dashboard, drill-down)
8. **Concluído:** Correção de 7 testes web (F-03 a F-09) — 2026-07-02 (web 142/142 passando)
9. **Pendências remanescentes:** Oracle/COMPASS e reconciliação; snapshots de BI; Supabase/persistência durável; histórico Web de notificações e exportações; storage durável de arquivos; TLS, SMTP, backup/restore e observabilidade. Veja a lista priorizada na [auditoria atual](docs/audits/ESTADO_REAL_PROJETO_2026-09-29.md).
10. **Verificação antes de cada commit:** execute os validadores pertinentes ao escopo e registre o resultado real; não marque execução que não ocorreu.

### Onda 2026-08 — Docker e integração BI

- ✅ Repositório `main` clonado em `Dashboard_PowerBI_Gusmao` sem alterar os documentos do diretório pai.
- ✅ Ambiente demo reproduzível com SQL Server, API, Web e Redis; normalização de EOL corrigida no entrypoint Linux.
- ✅ P0-02 concluído: Playwright validado contra a Web em `3000`, com API demo em `3001` e 7 cenários E2E aprovados em 2026-08-25.
- ✅ P0-03 concluído: `.env.production.example` completo, sem credenciais, com Oracle/COMPASS como fonte padrão e verificador automatizado.
- ✅ P1-02 concluído: formatação padronizada nos 387 arquivos identificados pelo Prettier; `pnpm format:check` aprovado em 2026-08-25.
- ✅ P1-01 concluído: lint corrigido em 2026-08-25; `pnpm lint` passou com zero erros e zero avisos após a exclusão recursiva de artefatos gerados e a correção dos 25 achados reais.
- ✅ P0-04 concluído: API rejeita boot de produção sem `TOTP_ENCRYPTION_KEY`; desenvolvimento e testes preservam o fallback controlado.
- ✅ P1-03 concluído: 16 testes E2E aprovados em 2026-08-25, cobrindo autenticação, dashboard, drill-down, relatórios, administração, exportação e 2FA.
- ⚠️ A suíte demo valida o histórico de exportações com dados demonstrativos; a reconciliação do job criado com o histórico persistido depende do modo real de dados.
- ✅ Contrato BI v1 com fonte, frescor, filtros, resumo de produção Oracle e refresh idempotente.
- ⏳ Oracle/COMPASS bloqueado até receber rede, host, service name e credencial somente leitura.
- ⏳ Smoke queries de algodão, algodoeira e romaneios, reconciliação de KPIs e persistência durável do ledger de refresh.

### Auditoria do runtime demo — 2026-09-29

- ✅ Compose demo iniciado e validado: Web HTTP 200, API e SQL Server saudáveis, login demo e consulta de relatório de exemplo retornando três linhas.
- ✅ Dados sintéticos ampliados para exploração: dashboard com mais categorias e períodos, quatro relatórios SQL com 12 a 36 linhas, listas com 12 notificações e 14 exportações, e conta de consulta geral sem papel administrativo.
- ✅ Cronologia visual da demo concluída em 2026-09-29: histórico mensal de 12 meses para os três setores, notificações/exportações/configurações distribuídas por datas diferentes, indicadores comparados com o mês anterior e rótulo visível da janela histórica.
- ⏳ Integrar Oracle/COMPASS de verdade: o endpoint de produção permanece `not_configured` com a fonte SQL Server demo; o refresh atual só executa smoke check e mantém o estado em memória.
- ⏳ Tornar durável a persistência de usuários e fechar a integração de notificações e histórico de exportação da Web com os endpoints da API.
- ⏳ Tornar as imagens Docker reprodutíveis com instalação pelo lockfile.
- ⏳ Alinhar escopo e matriz de aceite às capacidades do runtime e distinguir protótipo visual de fluxo persistente com dado real.

Os detalhes e evidências estão em [Auditoria do ambiente local Docker](docs/audits/AUDITORIA_LOCAL_DOCKER_2026-09-29.md).

> Para o retrato consolidado e atual das 18 telas, módulos, integrações, riscos de demo e validações, use [Estado real do projeto](docs/audits/ESTADO_REAL_PROJETO_2026-09-29.md). Os documentos detalhados em `docs/roadmap/` registram requisitos e contexto histórico; suas declarações antigas de status não prevalecem sobre a auditoria atual.

### Refinamento visual da home BI — 2026-09-29

- ✅ Concluída a home executiva com hierarquia única para os KPIs, identificação de dados fictícios e janela temporal, gráfico principal e destaques lado a lado, leitura por área e cartões de indicador.
- ✅ Navegação autenticada compacta em telas grandes e recolhida em menu acessível abaixo de 1024 px; cores, tipografia, acentuação e gráficos foram padronizados.
- ✅ Abas, drill-down e estados existentes preservados; sem alteração de API, banco ou valores dos dados.
- ✅ Especificação, testes, revisão em 390/640/1024/1440 px, typecheck, build e Playwright registrados em `docs/specs/bi/SPEC-dashboard-visual-agro-corporativo.md`.

---

_Este ROADMAP é a fonte única de verdade. Toda mudança de escopo ou prioridade deve ser refletida aqui e nos documentos vinculados em `docs/roadmap/`._
