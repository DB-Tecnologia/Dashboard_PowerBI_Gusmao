# ESCOPO.md — Escopo do Projeto

**Projeto:** Dashboard Power BI
**Atualizado em:** 2026-09-29
**Fase:** Demo funcional; produto parcial, sem aceite nem liberação para produção

> **Leitura do status:** as caixas abaixo representam presença de implementação no repositório, não dados reais, persistência durável, conformidade legal ou aceite de produção. O ambiente demo tem SQL Server de exemplo, Supabase não configurado e valores agrícolas sintéticos. Use a [auditoria do estado real](../audits/ESTADO_REAL_PROJETO_2026-09-29.md) como retrato atual.

---

## 1. Objetivo do Projeto

Centralizar relatórios de um sistema desktop em uma interface web segura, com dashboards interativos e controle de acesso por setor. A plataforma permite que usuários internos visualizem, filtrem e exportem relatórios provenientes de um SQL Server corporativo, com perfis de acesso diferenciados e governança administrativa.

---

## 2. Problema que o Sistema Resolve

A organização possui relatórios em um sistema desktop acessível apenas localmente. Isso gera:

- Dificuldade de acesso remoto aos relatórios;
- Falta de controle granular de quem pode ver ou exportar cada relatório;
- Ausência de dashboards interativos e KPIs consolidados;
- Inexistência de trilha de auditoria de acessos e exportações;
- Necessidade de exportar relatórios em PDF e Excel de forma controlada.

A plataforma web resolve esses problemas oferecendo acesso autenticado via navegador, com perfis (Visualizador, Downloader, Administrador), permissões por setor, dashboards com gráficos interativos e pipeline de exportação auditado.

---

## 3. Público-Alvo / Usuários

| Perfil        | Descrição                                                      | Permissões                                  |
| ------------- | -------------------------------------------------------------- | ------------------------------------------- |
| Visualizador  | Usuário com acesso somente leitura aos relatórios do seu setor | Visualizar relatórios do seu setor          |
| Downloader    | Usuário que pode visualizar e exportar relatórios              | Visualizar + exportar PDF e Excel           |
| Administrador | Usuário com acesso total ao sistema                            | Gerenciar usuários, permissões e relatórios |

---

## 4. Escopo Funcional

### Estado real vs escopo desejado

O escopo original prevê 18 telas e 6 módulos. Há implementações parciais nas 18 telas; nenhuma deve ser considerada concluída para V1 de produção antes de dados do cliente, persistência e critérios de aceite serem validados.

### Módulo Auth

- [x] Login por e-mail + senha (bcrypt)
- [x] Recuperação por e-mail com token JWT temporário
- [x] Sessão com JWT de curta duração + refresh token
- [x] Rate limiting no login (anti brute-force)
- [x] 2FA opcional via TOTP (Authenticator App)
- [x] Log de eventos de autenticação
- [x] Revogação de tokens e invalidação de sessões (blacklist/token versioning); o hardening operacional e testes no ambiente produtivo ainda exigem validação
- [x] 2FA obrigatório para administradores no fluxo de autenticação

### Módulo Permissões

- [x] Perfis: Visualizador, Downloader, Admin
- [x] Permissões por setor (financeiro, RH, vendas, etc)
- [x] Permissão individual por relatório específico
- [x] Grupo de acesso com roles e setores
- [x] Auditoria de mudanças de permissão
- [x] Herança/agregação de permissões via grupos no runtime
- [ ] Bloqueio automático após inatividade (timeout)
- [ ] Guard combinado JWT + role + permission

### Módulo SQL Server

- [x] Conexão via pool com SQL Server (mssql)
- [x] Queries parametrizadas (prevenção SQL Injection)
- [x] Suporte a stored procedures e views
- [x] Validação de identificadores
- [x] Cache LRU/TTL de consultas configurável por ambiente, local à memória do processo
- [ ] Atualização em tempo real ou por agendamento (cron)
- [ ] Monitoramento de lentidão e timeout de queries

### Módulo Relatórios

- [x] Listagem por setor com busca e filtros
- [x] Filtros: data, categoria e parâmetros customizados
- [x] Visualização inline no navegador (tabela/grid)
- [x] Exportação para PDF, Excel, CSV e JSON
- [x] Relatórios favoritos por usuário
- [x] Gestão administrativa de relatórios (CRUD, parâmetros, validação de fonte)
- [x] Pipeline de export com BullMQ e fila (com fallback em memória)
- [ ] Storage S3 ou equivalente para arquivos

### Módulo BI

- [x] Gráficos interativos: linha, barra, pizza, área (Recharts)
- [x] KPIs com indicadores de variação (delta %)
- [x] Drill-down em gráficos para dados detalhados por dimensão selecionável
- [x] Salvar layouts de dashboard personalizados
- [x] Widgets configuráveis: KPI, gráfico, tabela
- [x] Editor visual com paleta, drag-and-drop, redimensionamento e configuração; canvas livre, compartilhamento e versionamento não estão fechados
- [x] Drill-down multi-dimensão selecionável (fazenda, cultura, variedade, safra, cliente, produto, status e tempo, conforme KPI)
- [ ] Editor visual completo para o V1 (base de paleta e resize existe; capacidades finais, persistência e aceite pendentes)
- [ ] Exportar dashboard como imagem/PDF
- [ ] Compartilhamento entre usuários do mesmo grupo

### Módulo Admin

- [x] CRUD completo de usuários e grupos
- [x] Gestão de relatórios: fonte SQL, parâmetros, setor
- [x] Logs de acesso e download com filtro
- [x] Configurações do sistema editáveis via API
- [x] Dashboard administrativo com KPIs operacionais
- [x] Gráficos de tendência no dashboard admin; os valores dependem dos registros disponíveis no ambiente
- [ ] Alertas de segurança em tempo real
- [ ] Governança completa

---

## 5. Escopo Não Funcional

### Segurança

- Senhas com bcrypt (salt rounds >= 12)
- JWT access token (15min) + refresh token (7 dias) com rotação
- Queries 100% parametrizadas (sem concatenação de strings)
- Sanitização de inputs (XSS) e Content-Security-Policy
- CSRF token (cookie + header)
- Rate limiting no login (5 tentativas/15min por IP)
- 2FA opcional via TOTP
- HTTPS com TLS 1.3, HSTS e certificado gerenciado
- Headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- Sessão web em sessionStorage (não localStorage)

### Performance

- Cache de queries LRU/TTL configurável por ambiente, limitado ao processo da API
- Pool de conexões SQL Server
- `@tanstack/react-query` está declarada, mas não estrutura os fluxos principais da Web
- Fila/worker de exportações com BullMQ + Redis; fallback em memória existe e arquivos são locais

### Disponibilidade

- Healthcheck da API (`/health`) e do SQL Server (`/health/sql`)
- Docker Compose para alta disponibilidade em produção
- Deploy automatizado via GitHub Actions

### Escalabilidade

- Monorepo com pnpm workspaces
- Arquitetura modular NestJS
- NÃO IDENTIFICADO estratégia de escala horizontal (múltiplas instâncias)

### Usabilidade

- Web responsivo (desktop e mobile)
- Design system com componentes acessíveis
- Estados de loading, erro, vazio e sucesso nas telas

### Acessibilidade

- ARIA labels nos formulários
- Focus states visíveis
- NÃO IDENTIFICADO auditoria de acessibilidade completa

### Observabilidade

- Healthchecks da API e SQL Server
- Logs de auditoria de ações administrativas
- NÃO IDENTIFICADO sistema de monitoramento estruturado (ex: Datadog, Grafana)

### Manutenibilidade

- TypeScript strict em todo o projeto
- ESLint + Prettier + Husky
- Documentação estrutural na raiz do repositório
- SDD + TDD como metodologia

### Compatibilidade

- Node.js 20+
- pnpm 9+
- Navegadores modernos (Chromium, Firefox, Safari)

### LGPD

- O sistema armazena dados pessoais (email, nome, IP, user agent)
- A API expõe retenção, anonimização e portabilidade; política aprovada, persistência e operação efetiva precisam de validação

---

## 6. Fora do Escopo V1

- App Mobile (iOS/Android) — roadmap V2 (PWA ou React Native)
- Pipeline de dados / Data Warehouse / OLAP — roadmap V2
- A demo usa SQL Server para relatórios de exemplo. O BI alvo Oracle/COMPASS consta nos documentos atuais, mas diverge da restrição de fonte SQL Server no PDF original; o escopo contratual deve ser confirmado antes da implementação produtiva.
- Relatórios em tempo real (live) — V1 usa refresh agendado; streaming via WebSocket na V2
- Multi-tenancy (múltiplas empresas) — V1 é single-tenant
- Assinaturas digitais em relatórios (certificado ICP-Brasil) — fora do MVP

---

## 7. Regras de Negócio

| Código | Regra                                                              | Módulo     | Status                                              |
| ------ | ------------------------------------------------------------------ | ---------- | --------------------------------------------------- |
| RN-001 | O usuário precisa estar autenticado para acessar o painel          | Auth       | Confirmado                                          |
| RN-002 | Senhas devem ter no mínimo 8 caracteres                            | Auth       | Confirmado                                          |
| RN-003 | Após 5 tentativas falhas de login, o IP é bloqueado por 15 minutos | Auth       | Confirmado                                          |
| RN-004 | O refresh token expira em 7 dias                                   | Auth       | Confirmado                                          |
| RN-005 | O access token expira em 15 minutos                                | Auth       | Confirmado                                          |
| RN-006 | Usuários só visualizam relatórios do seu setor                     | Permissões | Confirmado                                          |
| RN-007 | Apenas Downloader e Admin podem exportar relatórios                | Permissões | Confirmado                                          |
| RN-008 | Apenas Admin pode gerenciar usuários, grupos e permissões          | Permissões | Confirmado                                          |
| RN-009 | Queries ao SQL Server devem ser parametrizadas                     | SQL Server | Confirmado                                          |
| RN-010 | Somente SELECT e EXEC de stored procedures são permitidos          | SQL Server | Confirmado                                          |
| RN-011 | DROP, DELETE, UPDATE, INSERT, ALTER e TRUNCATE são proibidos       | SQL Server | Confirmado                                          |
| RN-012 | Exportações expiram após 7 dias                                    | Exports    | Confirmado                                          |
| RN-013 | Todas as mutações administrativas geram log de auditoria           | Audit      | Confirmado                                          |
| RN-014 | 2FA/TOTP é opcional para usuários não administradores              | Auth       | Implementado; validar política final                |
| RN-015 | 2FA/TOTP deve ser obrigatório para administradores                 | Auth       | Implementado; testar na configuração real           |
| RN-016 | Usuários herdam permissões dos grupos que pertencem                | Permissões | Implementado no runtime; validar a matriz de acesso |
| RN-017 | Sessão web deve expirar após inatividade (timeout)                 | Auth       | Pendente                                            |
| RN-018 | Dashboards personalizados são privados por usuário                 | BI         | Confirmado                                          |

---

## 8. Critérios Gerais de Aceite

- [x] Sistema executa localmente com instruções documentadas
- [ ] Suíte completa passa em todas as camadas (a execução mais recente registrada cobre Web, typecheck, build e alguns E2E; API completa não foi executada nesta atualização documental)
- [x] Funcionalidades principais documentadas
- [x] Banco de dados documentado (`BANCO_DADOS.md`)
- [ ] Fluxos principais aceitos com persistência e dados reais (o demo local foi validado, mas não substitui aceite do cliente)
- [x] Sem credenciais expostas
- [x] Relatório diário atualizado (`RELATORIO.md`)
- [ ] BI avançado e dashboards personalizados completos
- [x] 2FA obrigatório para administradores implementado; chave e operação produtiva pendem validação
- [x] Testes E2E existem para fluxos de autenticação/dashboard; cobertura integral de aceite permanece pendente

---

## 9. Entregáveis

- Código-fonte (monorepo pnpm com apps/api e apps/web)
- Documentação estrutural (AGENTS.md, ARQUITETURA.md, BANCO_DADOS.md, ESCOPO.md, ROADMAP.md, CONTEXTO.md, RELATORIO.md)
- Scripts de validação (`scripts/`)
- Testes unitários e de integração (Jest, Supertest, Testing Library)
- Migrations de banco de dados (`supabase/migrations/`)
- Deploy automatizado (Docker Compose + GitHub Actions)
- Manual de execução (`README.md`)
- Relatórios diários (`RELATORIO.md`)

---

## 10. Premissas

- O SQL Server do sistema desktop está acessível na rede interna ou via VPN segura.
- O cliente fornece credenciais de leitura no banco (usuário dedicado com permissão SELECT).
- O ambiente de hospedagem (VPS ou cloud) é provisionado pelo cliente.
- Credenciais SMTP para envio de e-mails (recuperação de senha, notificações) serão fornecidas.
- O design system e identidade visual foram aprovados.
- Requisitos de relatórios (queries SQL base) serão documentados e entregues.
- Supabase é usado como persistência de plataforma (PostgreSQL gerenciado).

---

## 11. Restrições

- V1 conecta apenas ao SQL Server (sem Oracle, MySQL ou outros bancos).
- V1 é single-tenant (sem multi-tenancy).
- V1 usa refresh agendado (sem streaming em tempo real via WebSocket).
- V1 não inclui assinaturas digitais com certificado ICP-Brasil.
- V1 não inclui app mobile nativo.
- O prazo original do escopo era 30 dias (3 sprints de 10 dias).

---

## 12. Riscos

| Risco                           | Impacto                                                                         | Probabilidade | Mitigação                                                  |
| ------------------------------- | ------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------- |
| SQL Server indisponível         | Relatórios e KPIs não carregam                                                  | Média         | Healthcheck + fallback gracioso                            |
| Supabase ausente no demo        | Alterações guardadas em memória podem se perder ao reiniciar                    | Alta          | Configurar e validar persistência durável.                 |
| Jobs e arquivos de exportação   | Worker usa BullMQ/Redis, mas arquivos ficam locais e histórico Web usa fixtures | Alta          | Integrar lista Web e storage durável.                      |
| BI Oracle/COMPASS não conectado | KPIs do dashboard não representam dados agrícolas do cliente                    | Alta          | Conectar, persistir snapshots e reconciliar com o negócio. |
| Retenção/LGPD                   | Rotas e cron existem, mas execução depende de persistência e política aprovada  | Alta          | Validar política, evidências e operação com responsáveis.  |
| Operação de produção            | TLS, SMTP, backup/restore e observabilidade não foram aceitos                   | Alta          | Fechar checklist operacional e testar recuperação.         |
