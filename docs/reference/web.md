# Referência Web

**Atualizado em:** 2026-09-29

> Esta página descreve telas e integrações observadas no código. A classificação de prontidão fica em [Estado real do projeto](../audits/ESTADO_REAL_PROJETO_2026-09-29.md). “Tela presente” não significa dados agrícolas reais, persistência durável ou aceite de produção.

## Stack

- Next.js 14 com App Router
- TypeScript estrito
- Tailwind CSS e componentes locais em `apps/web/src/components`
- Recharts nos gráficos da home e dashboards
- Jest e Testing Library; Playwright para fluxos E2E existentes

## Rotas e telas

A Web contém login, recuperação/reset de senha, perfil, home BI, catálogo e visualização de relatórios, dashboards personalizados, exportações, notificações e áreas administrativas para usuários, grupos, permissões, relatórios, auditoria e configurações. Consulte `apps/web/src/app/` para o inventário exato de rotas.

### Home BI

- Consome o payload de dashboard da API quando o client configurado seleciona o modo de API; o ambiente demo usa `DATA_MODE=mock` e valores agrícolas sintéticos identificados na tela.
- Exibe séries mensais de demonstração, comparação entre períodos, abas Executiva/Analítica/Operacional e drill-down por dimensões.
- A atualização visual de 2026-09-29 organizou KPIs sem repetição, identificação de demo/período, gráfico principal, destaques, leitura por área e indicadores.
- Navegação compacta em telas grandes e menu acessível abaixo de 1024 px. Revisão visual registrada nas larguras 390, 640, 1024 e 1440 px.
- Paleta agro corporativa provisória: fundo `#F6F7F2`, cartões brancos, floresta `#14532D`, petróleo `#0F766E` e âmbar `#B45309`; a fonte é nativa do sistema.

## Integração e persistência

- Auth, perfil, home/dashboards, relatórios, administração, auditoria e settings têm clients e rotas de API. A persistência de partes do domínio depende de Supabase configurado no backend; quando ausente, vários repositórios usam memória.
- **Exceções conhecidas:** as listas de notificações e o histórico de exportações usam `apps/web/src/lib/app-data.ts`; no modo demo exibem fixtures locais e não representam os registros reais criados pela API.
- Solicitar exportação pela tela de relatório inicia o fluxo da API. A API usa worker BullMQ/Redis e disponibiliza download autenticado, mas os arquivos ficam no filesystem do container e a lista Web não reconcilia seus jobs.
- Dashboards personalizados têm CRUD e editor de widgets, drag-and-drop, resize e configuração. A persistência depende de Supabase; compartilhamento/versionamento completo não foi confirmado.
- TOTP aparece no login e perfil; administradores precisam habilitá-lo. Produção requer `TOTP_ENCRYPTION_KEY`; fallback sem criptografia é apenas para execução local controlada.

## Sessão e estados de tela

A sessão é mantida em `sessionStorage`, com tentativa única de refresh quando a API devolve `401`. As telas tratam loading, erro e vazio onde implementado; consulte os testes do componente para cobertura específica. O modo mock facilita demonstração e não deve ser interpretado como backend de produção.

## Validação visual e automatizada registrada

- Web: 43 suítes e 147 testes na última execução registrada.
- Playwright: `tests/e2e/auth-dashboard.spec.ts`, 8 cenários aprovados na última execução registrada.
- `pnpm typecheck`, `pnpm build`, `pnpm lint` e `pnpm verify:docs` aprovados na última execução registrada.
- A suíte completa da API não foi executada nesta atualização documental; não inferir aprovação dela a partir da validação Web.
