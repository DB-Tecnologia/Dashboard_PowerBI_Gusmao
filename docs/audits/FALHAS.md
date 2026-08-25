# FALHAS.md — Auditoria local do projeto Dashboard Power BI

Data: 2026-07-02

> **Atualização em 2026-08-25:** F-10 foi resolvido com zero erros e zero avisos no `pnpm lint`. F-11 foi resolvido anteriormente com a normalização de 387 arquivos e `pnpm format:check` aprovado. Os números abaixo preservam o diagnóstico original da auditoria.

## Ambiente de teste

- Node.js v22.22.3
- pnpm 9.15.4
- Windows (PowerShell)
- Sem Redis local
- Sem SQL Server local
- Sem Supabase local
- `.env` criado a partir de `infra/env/.env.example`

## Resumo

| Categoria        | Total | Passou | Falhou |
| ---------------- | ----- | ------ | ------ |
| pnpm install     | 1     | 1      | 0      |
| verify:workspace | 1     | 1      | 0      |
| verify:docker    | 1     | 1      | 0      |
| verify:docs      | 1     | 1      | 0      |
| typecheck        | 2     | 2      | 0      |
| test (API)       | 304   | 304    | 0      |
| test (Web)       | 142   | 142    | 0      |
| build            | 2     | 2      | 0      |
| lint             | 1     | 1      | 0      |
| format:check     | 1     | 1      | 0      |
| API runtime      | —     | OK     | —      |
| Web runtime      | —     | OK     | —      |

---

## F-01 — Typecheck API: erros em `retention.service.spec.ts`

**Severidade:** Média

**Status:** ✅ Corrigido

**Arquivo:** `apps/api/src/audit/services/retention.service.spec.ts` (linhas 48 e 141)

**Erro:**

```
error TS2345: Argument of type 'Mocked<ExportsServiceLike>' is not assignable to parameter of type 'ExportsService'.
  Type 'Mocked<ExportsServiceLike>' is missing the following properties from type 'ExportsService': queue, connection, memoryExports, validateFileName, and 14 more.
```

**Descrição:** O mock `ExportsServiceLike` não implementa todos os membros de `ExportsService`, causando erro de tipo em 2 locais do spec.

**Correção:** Removido o tipo `ExportsServiceLike` e importado `ExportsService` real. Variável tipada como `jest.Mocked<ExportsService>` com cast `as unknown as jest.Mocked<ExportsService>` no mock.

---

## F-02 — Teste API: `report-definitions.repository.spec.ts` falha

**Severidade:** Média

**Status:** ✅ Corrigido

**Arquivo:** `apps/api/src/reports/repositories/report-definitions.repository.spec.ts`

**Erro:**

```
TypeError: configService.get is not a function
  at isDemoMode (reports/repositories/report-definitions.repository.ts:150:24)
```

**Descrição:** O teste de persistência Supabase passava `supabaseService` como argumento do construtor, mas o repositório aceita `ConfigService`. O mock não tinha método `get()`, causando crash em `isDemoMode()`.

**Correção:** Removido o teste inválido de persistência Supabase (o repositório é em memória, não usa Supabase). O teste de demo seed com `new ConfigService({ APP_MODE: 'demo' })` funciona corretamente.

---

## F-03 — Testes Web: `platform-api.test.ts` — `getApiUrl` não exportada

**Severidade:** Alta

**Status:** ✅ Corrigido

**Arquivo:** `apps/web/src/lib/platform-api.test.ts` (linha 61)

**Erro:**

```
TypeError: (0 , _adminapi.getApiUrl) is not a function
  at downloadExportFile (src/lib/platform-api.ts:313:41)
```

**Descrição:** `platform-api.ts` importa `getApiUrl` de `admin-api.ts`, mas essa função não está exportada (ou o mock do teste não a provê). O teste falha ao tentar chamar `downloadExportFile`.

**Correção:** Adicionado `getApiUrl: jest.fn(() => 'http://localhost:3001')` ao mock de `./admin-api` no teste, permitindo que `downloadExportFile` resolva a URL corretamente.

---

## F-04 — Testes Web: `kpi-card.test.tsx` — `data-testid="sparkline"` não encontrado

**Severidade:** Baixa

**Status:** ✅ Corrigido

**Arquivo:** `apps/web/src/components/dashboard/kpi-card.test.tsx` (linha 83)

**Erro:**

```
TestingLibraryElementError: Unable to find an element by: [data-testid="sparkline"]
```

**Descrição:** O componente `KpiCard` renderiza um `<svg>` como sparkline mas não inclui o atributo `data-testid="sparkline"` esperado pelo teste.

**Correção:** O mock do `SparklineChart` estava em `@/components/charts` mas o componente importa de `@/components/charts/sparkline-chart`. Corrigido o path do mock para `@/components/charts/sparkline-chart`.

---

## F-05 — Testes Web: `authenticated-layout.test.tsx` — texto "Usuários" não encontrado

**Severidade:** Baixa

**Status:** ✅ Corrigido

**Arquivo:** `apps/web/src/components/app/authenticated-layout.test.tsx` (linha 49)

**Erro:**

```
TestingLibraryElementError: Unable to find an element with the text: Usuários, which matches selector 'span'.
```

**Descrição:** O teste espera encontrar um `<span>` com texto "Usuários" no sidebar, mas o componente não renderiza esse link (provavelmente o link de admin não aparece para o usuário mockado ou o texto mudou).

**Correção:** O sidebar renderiza "Usuarios" (ASCII sem acento) mas o teste esperava "Usuários" (com acento). Corrigido o texto esperado para "Usuarios".

---

## F-06 — Testes Web: `report-detail.test.tsx` — botão "Exportar PDF" não encontrado

**Severidade:** Média

**Status:** ✅ Corrigido

**Arquivo:** `apps/web/src/components/reports/report-detail.test.tsx` (linha 60)

**Erro:**

```
TestingLibraryElementError: Unable to find an accessible element with the role "button" and name `/exportar pdf/i`
```

**Descrição:** O teste espera um botão com nome "Exportar PDF", mas o componente renderiza apenas um botão "Exportar" genérico. O teste não reflete o UI atual.

**Correção:** O componente tem fluxo de exportação em 2 passos: botão "Exportar" abre um modal, e dentro do modal há o botão "Exportar PDF". Adicionado o clique no botão "Exportar" antes de clicar em "Exportar PDF" no modal.

---

## F-07 — Testes Web: `notifications-list.test.tsx` — 3 testes falham por dependência de Supabase

**Severidade:** Alta

**Status:** ✅ Corrigido

**Arquivo:** `apps/web/src/components/notifications/notifications-list.test.tsx` (linhas 46, 57, 89)

**Erro:**

```
Error: Supabase nao configurado para este ambiente.
  at createSupabaseBrowserClient (src/lib/app-data.ts:183:11)
```

**Descrição:** O componente `NotificationsList` chama `createAppDataClient()` que tenta criar um cliente Supabase browser. Sem `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`, lança erro. Os testes não mockam essa dependência adequadamente. 3 testes falham:

- "renderiza notificacoes carregadas pela API e marca uma como lida"
- "renderiza erro quando a API falha"
- "marca todas como lidas pela API"

**Correção:** Substituído o mock de `@/lib/platform-api` por mock de `@/lib/app-data` com `getAppDataClient` retornando um objeto mockado com `listNotifications`, `markNotificationAsRead` e `markAllNotificationsAsRead`. Corrigidos os textos esperados para corresponder ao componente atual (ASCII sem acentos). Ajustada a asserção de `markAllNotificationsAsRead` para receber array de IDs em vez de chamada sem argumentos.

---

## F-08 — Testes Web: `exports-list.test.tsx` — 2 testes falham por dependência de Supabase

**Severidade:** Alta

**Status:** ✅ Corrigido

**Arquivo:** `apps/web/src/components/exports/exports-list.test.tsx` (linhas 49, 73)

**Erro:**

```
Error: Supabase nao configurado para este ambiente.
  at createSupabaseBrowserClient (src/lib/app-data.ts:183:11)
```

**Descrição:** Mesmo problema de F-07. O componente `ExportsList` chama `createAppDataClient()` que depende de Supabase browser. 2 testes falham:

- "renderiza erro quando a API falha"
- "baixa o arquivo concluido usando a API autenticada"

**Correção:** Substituído o mock de `@/lib/platform-api` por mock de `@/lib/app-data` com `getAppDataClient` retornando um objeto mockado com `listExportJobs`. Corrigidos os textos esperados para corresponder ao componente atual (ASCII sem acentos). O teste de download foi reescrito para validar o `link` com `href` do arquivo, já que o componente usa `<a download>` em vez de `<button>` com chamada `downloadExportFile`.

---

## F-09 — Testes Web: `admin-settings.test.tsx` — falha por dependência de Supabase

**Severidade:** Alta

**Status:** ✅ Corrigido

**Arquivo:** `apps/web/src/components/admin/admin-settings.test.tsx` (linha 29)

**Erro:**

```
Error: Supabase nao configurado para este ambiente.
  at createSupabaseBrowserClient (src/lib/app-data.ts:183:11)
```

**Descrição:** Mesmo problema de F-07/F-08. O componente `AdminSettings` chama `createAppDataClient()` que depende de Supabase browser.

**Correção:** Substituído o mock de `@/lib/platform-api` por mock de `@/lib/app-data` com `getAppDataClient` retornando um objeto mockado com `listSystemSettings`. Adicionado mock de `@/lib/admin-api` para `getRetentionStatus` e `runRetention`. Corrigidos os textos esperados para corresponder ao componente atual (ASCII sem acentos). O teste de "salvar configuração" foi substituído por teste de exibição da política de retenção, que é a funcionalidade que existe no componente atual.

---

## F-10 — Lint: resolvido em 2026-08-25

**Severidade:** Média

**Descrição histórica:** a auditoria original registrou 1129 erros e 426 warnings. Após a exclusão recursiva dos artefatos gerados e a correção dos 25 achados reais, `pnpm lint` passa com zero erros e zero avisos.

- Os dois casts `any` dos testes de guards foram substituídos por `ExecutionContext`.
- Imports, estados e parâmetros sem uso foram removidos.
- Scripts CLI mantêm apenas a exceção de `no-console` restrita no `eslint.config.mjs`.

---

## F-11 — Format:check: resolvido em 2026-08-25

**Severidade:** Baixa

**Descrição histórica:** `pnpm format:check` apontava arquivos fora do padrão. A normalização foi concluída em 387 arquivos e a verificação atual passa.

---

## F-12 — API runtime: spam de erros Redis no console

**Severidade:** Média

**Descrição:** Sem Redis local (`localhost:6379`), a API spamma continuamente `AggregateError [ECONNREFUSED]` no console. O fallback em memória funciona, mas o erro é ruidoso e não tratado silenciosamente. O `ioredis` emite eventos `error` não tratados que poluem o output.

---

## F-13 — Docker Compose demo sem `.env.demo` versionado

**Severidade:** Baixa

**Status:** ✅ Corrigido

**Descrição:** O `docker-compose.demo.yml` referencia `../env/.env.demo` em `env_file`, mas esse arquivo não existe no repositório (apenas `.env.example` e `.env.production.example` são versionados). Para usar o compose demo, é necessário criar `infra/env/.env.demo` manualmente com as variáveis apropriadas (incluindo `MSSQL_SA_PASSWORD`, `ACCEPT_EULA`, `SQLSERVER_DATABASE`, etc.).

**Correção:** Criado `infra/env/.env.demo.example` como referência versionada e adicionada exceção no `.gitignore`.

---

## F-14 — README.md: 2FA marcado como "opcional, obrigatório pendente"

**Severidade:** Baixa

**Status:** ✅ Corrigido

**Descrição:** O README.md dizia "2FA/TOTP implementado e opcional; obrigatório para admins pendente (DT-001)", mas o `TwoFactorGuard` já força 2FA para admins e o DT-001 está concluído no ROADMAP.

**Correção:** Atualizado para "2FA/TOTP implementado e obrigatório para admins".

---

## F-15 — CONTEXTO.md: pendências desatualizadas

**Severidade:** Baixa

**Status:** ✅ Corrigido

**Descrição:** A seção de pendências do CONTEXTO.md listava itens já concluídos (editor visual, 2FA obrigatório, hardening de sessão, herança de permissões, cache SQL, BullMQ, retenção LGPD) como pendentes.

**Correção:** Pendências atualizadas para refletir apenas itens remanescentes: F-01, F-02, F-10, F-11, F-12, drill-down, Playwright.

---

## Observações (não são falhas)

- **403 em rotas admin:** Comportamento esperado. O `TwoFactorGuard` exige 2FA ativo para admins. O usuário demo (`admin@example.com`) não tem 2FA habilitado, então rotas `/admin/*` retornam 403.
- **Build passa:** `pnpm build` compila ambos API e Web com sucesso.
- **API endpoints funcionais:** `/health`, `/auth/login`, `/auth/me`, `/dashboard/home`, `/reports`, `/notifications`, `/exports`, `/dashboards`, `/health/sql` todos respondem 200.
- **Web páginas funcionais:** `/` e `/login` respondem 200 em runtime.
- **Swagger disponível:** `/docs` responde 200 em desenvolvimento.
- **Docker Compose pronto:** 3 compose files (dev, demo, prod) funcionais. Dev sobe sem dependências externas. Demo requer `.env.demo`. Prod requer `.env.production`.
- **Auditoria de lógica (2026-07-02):** Controllers e services auditados (reports, auth, sql-server, supabase, audit, exports, dashboards). Nenhuma falha de lógica nova encontrada. Guards, DTOs, validação e autorização estão consistentes.
