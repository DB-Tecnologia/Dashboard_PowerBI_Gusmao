# Estado real do projeto — 2026-09-29

**Projeto:** Dashboard Power BI Gusmão
**Base:** branch `main`, runtime do monorepo e Compose demo local
**Objetivo:** fonte atual para separar o que existe no código, o que está ligado a serviços e o que ainda depende de configuração ou desenvolvimento.

> O PDF V1 e os documentos de produto descrevem requisitos. Eles não são prova de que um fluxo esteja conectado, persistente ou pronto para produção. Quando houver diferença, este retrato e o runtime prevalecem sobre análises antigas.

## Resumo executivo

O repositório contém uma plataforma web funcional para demonstração: autenticação, telas administrativas, dashboard, catálogo e consulta de relatórios, exportação, auditoria, configurações e dashboards personalizados. O Compose demo está ativo com Web, API, SQL Server e Redis.

Isso ainda **não é o produto de BI produtivo**. Os gráficos agrícolas da home usam dados fictícios; a integração Oracle/COMPASS não está configurada nem reconciliada. Parte dos repositórios usa memória quando o Supabase não está configurado, e as telas de notificações e histórico de exportações ainda usam o cliente legado de dados fictícios, apesar das rotas correspondentes existirem na API.

## Runtime local verificado

| Serviço         | Endpoint/porta          | Estado observado                                                    |
| --------------- | ----------------------- | ------------------------------------------------------------------- |
| Web Next.js     | `http://localhost:3000` | Container ativo; home autenticada renderiza.                        |
| API NestJS      | `http://localhost:3001` | Container ativo; `/health` responde.                                |
| SQL Server demo | `localhost:1433`        | Container ativo e saudável; usado pelos relatórios de exemplo.      |
| Redis           | `localhost:6379`        | Container ativo e saudável; usado pelo worker BullMQ de exportação. |

Verificação do Compose em 2026-09-29: quatro serviços em execução. O SQL demo tem exemplos de relatórios, não os dados agrícolas reais do cliente.

## O que funciona no runtime

### Web e API

- Login JWT, refresh, logout, redefinição de senha, perfil, rate limit e proteção das rotas autenticadas.
- 2FA/TOTP configurável e obrigatório para administradores; a API valida a chave de criptografia em produção.
- CRUD de usuários, grupos, permissões, relatórios administrativos, dashboards e widgets.
- Home com KPIs, histórico sintético de 12 meses, abas Executiva/Analítica/Operacional, gráficos, comparação entre períodos e drill-down por dimensões.
- Catálogo, filtros, execução de consultas e apresentação dos resultados do SQL Server demo.
- Exportação por API em PDF, XLSX, CSV e JSON, com worker BullMQ/Redis, download autenticado e arquivo em armazenamento local.
- Rotas de API para notificações, exportações, auditoria, settings, retenção LGPD e métricas do dashboard administrativo.
- Menu móvel acessível e apresentação responsiva da home revisados nas larguras 390, 640, 1024 e 1440 px.

### Dados e serviços

- A home agrícola demo opera com `DATA_MODE=mock`. Os seus valores servem para demonstrar a interface e não vêm do Oracle/COMPASS.
- O SQL Server local atende consultas dos relatórios de exemplo. As queries usam parâmetros e a camada de SQL valida identificadores.
- O cache de query implementado é LRU/TTL em memória do processo; não é compartilhado entre réplicas da API.
- A API inclui cliente Supabase e migrations. No Compose demo, Supabase não está configurado; usuários, grupos, permissões, sessões, dashboards, parte dos jobs e do BI ficam em memória e podem se perder ao reiniciar a API.
- O repositório contém 12 arquivos de migration Supabase. A existência dos arquivos não significa que essas migrations estejam aplicadas a um banco conectado.
- O status de refresh do BI fica em memória. No modo demo, `POST /api/v1/bi/refresh` valida a fonte e termina como `skipped`; não carrega dados nem grava snapshot ou watermark.

## Limites por tela do escopo V1

`Presente, parcial` significa que existe tela ou fluxo utilizável, mas faltam conexão produtiva, persistência durável ou critérios completos do V1. Nenhuma dessas classificações declara dados de negócio validados.

| ID  | Tela                      | Estado observado e limite principal                                                                                     |
| --- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| T01 | Login                     | Presente; contas demo e repositório com fallback em memória.                                                            |
| T02 | Recuperação de senha      | Fluxo presente; SMTP de produção não está configurado.                                                                  |
| T03 | Home BI                   | Presente; KPIs e séries demo sintéticos, sem Oracle reconciliado.                                                       |
| T04 | Catálogo de relatórios    | Presente e ligado à API; fontes locais são de demonstração.                                                             |
| T05 | Visualização de relatório | Presente; consulta de leitura ao SQL Server demo.                                                                       |
| T06 | Filtros avançados         | Presente; validar todos os parâmetros com as consultas reais do cliente.                                                |
| T07 | BI interativo             | Gráficos, abas e drill-down presentes; falta dado agrícola real e aceite da área de negócio.                            |
| T08 | Dashboards personalizados | CRUD e editor presentes; persistência depende da configuração do Supabase; compartilhamento/versionamento não fechados. |
| T09 | Exportações               | Worker da API gera e baixa arquivos; histórico da tela usa fixtures e os arquivos não têm storage externo.              |
| T10 | Perfil                    | Presente, com troca de senha e gestão de TOTP; persistência da conta depende da configuração do backend.                |
| T11 | Notificações              | Rotas da API existem; a tela Web ainda lê fixtures via `app-data.ts`.                                                   |
| T12 | Dashboard administrativo  | KPIs e gráficos de tendência presentes; dados dependem dos registros disponíveis no ambiente.                           |
| T13 | Gestão de usuários        | Tela e API presentes; alterações podem ficar apenas em memória no demo.                                                 |
| T14 | Gestão de permissões      | Tela e API presentes; persistência e aceite dependem do Supabase e dos dados reais.                                     |
| T15 | Gestão de relatórios      | CRUD e validação de fonte pela API; a persistência é híbrida e depende do Supabase.                                     |
| T16 | Editor visual             | Paleta, drag, resize, configuração e grid presentes; compartilhar, versionar e exportar dashboards não estão fechados.  |
| T17 | Auditoria                 | Tela e API presentes; durabilidade varia conforme o repositório e Supabase configurado.                                 |
| T18 | Configurações             | Edição via API presente; no demo, fallback em memória não sobrevive ao reinício.                                        |

## Lacunas que impedem concluir e liberar o V1

1. **BI de negócio:** receber acesso Oracle/COMPASS somente leitura; confirmar schemas, queries, fórmulas, unidades e datas de corte; alimentar produção, grãos, algodão, algodoeira e romaneios; reconciliar números com a área responsável.
2. **Refresh BI:** trocar o smoke check por carga real idempotente, persistir execuções, snapshots e watermark e definir o comportamento para falha, atraso e reprocessamento.
3. **Persistência da plataforma:** configurar Supabase e aplicar/validar migrations em ambiente durável; eliminar ou restringir fallback em memória para ambientes que precisem preservar alterações.
4. **Integração das telas:** trocar o acesso legado/mock das telas de notificações e histórico de exportações pelo cliente autenticado da API; confirmar que ações e histórico correspondem.
5. **Arquivos de exportação:** mover arquivos do filesystem local para storage durável (por exemplo S3), com expiração, limpeza e links de download apropriados.
6. **Operação de produção:** configurar TLS/domínio, secrets obrigatórios, SMTP real, logs e métricas, backup/restore e rollback; validar Compose e deploy em clone/ambiente limpo.
7. **Aderência e aceite:** revisar as 18 telas e seis módulos frente ao escopo aprovado, testar com os papéis reais e dados reconciliados, e registrar aceite funcional/segurança.

## Segurança e uso do demo

- A configuração demo não é ambiente de produção. Não expor portas ou contas demo à Internet.
- `TOTP_ENCRYPTION_KEY` é obrigatória quando `NODE_ENV=production`. Sem essa chave fora de produção, o código permite fallback sem criptografia e registra um aviso; mantenha o uso restrito ao ambiente local.
- Nenhum segredo, senha, token ou valor de `.env` deve ser copiado para documentação ou versionamento.
- A camada de relatórios SQL deve continuar sendo somente leitura, com queries parametrizadas e nomes de objetos validados.

## Validações recentes

- Compose demo: Web, API, SQL Server e Redis ativos em 2026-09-29.
- Revisão visual da home: larguras de 390, 640, 1024 e 1440 px sem rolagem horizontal.
- Web: 43 suítes e 147 testes aprovados na última execução registrada.
- Playwright `tests/e2e/auth-dashboard.spec.ts`: 8 cenários aprovados na última execução registrada.
- `pnpm typecheck`, `pnpm build`, `pnpm lint`, `pnpm verify:docs` e Prettier nos arquivos alterados: aprovados na última execução registrada.
- Nesta reconciliação documental: `pnpm verify:docs`, Prettier direcionado aos Markdown alterados e `git diff --check` passaram.
- A suíte completa de testes da API não foi executada nesta atualização documental; não inferir seu resultado atual a partir dos testes da Web.

## Próxima sequência recomendada

1. Alinhar telas de notificações e exportações à API e persistir dados da plataforma.
2. Integrar Oracle/COMPASS e completar refresh/snapshot/reconciliação dos KPIs.
3. Fechar hardening operacional de produção, storage de exports, backup/restore e observabilidade.
4. Revalidar critérios das 18 telas e obter aceite com usuários e dados reais.
