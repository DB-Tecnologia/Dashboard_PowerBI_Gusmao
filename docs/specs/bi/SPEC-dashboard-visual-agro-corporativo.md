# SPEC — Refinamento visual da home do dashboard

**Módulo:** BI / Web
**Status:** Concluída
**Atualizado em:** 2026-09-29

## Objetivo

Deixar a home autenticada do dashboard e sua navegação prontas para demonstração ao cliente, com leitura executiva, identidade agro corporativa, conteúdo legível e comportamento responsivo sem alterar os dados ou contratos existentes.

## Contexto

A inspeção visual da rota `/app` identificou navegação que ocupa a primeira tela em larguras estreitas, repetição dos mesmos três KPIs no resumo e no destaque, rótulos pequenos com espaçamento excessivo, textos sem acentuação e títulos redundantes. O shell declara Inter sem carregar um arquivo de fonte; não há fonte local versionada. A API e os dados de demonstração ficam fora desta mudança.

## Regras e decisões

- Usar cores de superfície `#F6F7F2` e `#FFFFFF`, texto `#17211B`, primária floresta `#14532D`, secundária petróleo `#0F766E`, destaque colheita `#B45309` e neutros de texto/borda com contraste adequado.
- Validar contraste mínimo WCAG AA para texto normal (4,5:1); não usar cor como único meio para comunicar tendência ou estado.
- Manter “Dashboard Power BI” como nome do produto e usar “Visão geral” como título da página.
- Exibir as métricas de resumo uma única vez. Manter destaque principal, gráfico temporal, leitura por área e cartões por KPI.
- Abaixo de 1024 px, oferecer navegação recolhida em menu acessível; a partir de 1024 px, usar barra lateral fixa compacta.
- Corrigir acentuação do conteúdo visível e usar a pilha de fontes nativa do sistema, sem dependência externa.
- Preservar abas, drill-down, conteúdo demonstrativo e estados existentes de carregamento, erro, vazio e sucesso.
- Não alterar API, banco de dados, fontes, contratos ou semântica de negócio dos KPIs.

## Fluxo esperado

1. O usuário abre `/app` e vê título, janela temporal e aviso de demonstração quando aplicável.
2. Lê cada KPI de resumo uma vez, em seguida o destaque e sua linha do tempo.
3. Explora áreas e cartões de KPI, podendo alternar abas e abrir drill-down sem perder a navegação.
4. Em telas estreitas, abre e fecha a navegação por um botão com estado acessível; o conteúdo continua visível sem a lista de navegação empurrá-lo para baixo.

## Critérios de aceite

- [x] Em 390, 640, 1024 e 1440 px não há rolagem horizontal nem texto ou controle cortado.
- [x] Menu móvel funciona por teclado e leitor de tela, expõe `aria-expanded` e permite navegar para as mesmas rotas.
- [x] Resumo executivo não duplica contagem de KPIs, áreas ou delta médio.
- [x] Textos visíveis na home e no shell têm acentuação correta, hierarquia consistente e leitura confortável a 100% de zoom.
- [x] Cores de texto atendem WCAG AA e séries/estados também são identificados por texto, forma, padrão ou ícone.
- [x] Abas Executiva, Analítica e Operacional, drill-down e estados de carregamento/erro/vazio permanecem funcionais.
- [x] Testes da Web, typecheck, build e revisão visual responsiva passam.

## Impacto técnico

| Área        | Impacto                                                                                              |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| Arquitetura | Nenhuma mudança; somente apresentação Web e shell autenticado.                                       |
| Banco/API   | Sem alterações de schema, endpoints ou contratos.                                                    |
| Frontend    | Tokens CSS/Tailwind, layout autenticado, navegação, home, cartões e gráficos compartilhados.         |
| Testes      | Atualizar testes da home e da navegação; verificar gráficos e estados afetados.                      |
| Segurança   | Sem mudanças no fluxo de autenticação ou autorização; navegação preserva os mesmos links protegidos. |

## Testes necessários

- Componente: menu móvel alterna estado, expõe `aria-expanded` e mantém destinos existentes.
- Home: título, indicadores não duplicados, badge demo/período, abas, drill-down e conteúdo com acentuação.
- Gráficos: legenda, tooltip, cores, valores e estado sem série.
- Manual: revisar screenshots em 390, 640, 1024 e 1440 px e verificar contraste/foco por teclado.
- Workspace Web: `pnpm --filter @dashboard-power-bi/web test`, `pnpm typecheck` e `pnpm build`.

## Riscos e dependências

- A identidade visual oficial da empresa não foi fornecida; a paleta proposta é uma direção de produto provisória e deve ser substituída se a marca entregar tokens oficiais.
- Recharts calcula ticks e dimensões responsivamente; rótulos precisam continuar legíveis com séries de 12 meses e cartões estreitos.
- A home contém textos esperados por testes; os testes associados devem ser atualizados junto às correções de cópia.
- Dependências: componentes locais de UI, Tailwind, Recharts e o `AuthenticatedLayout` existente.

## Resultado da validação — 2026-09-29

- Implementação limitada à apresentação e aos testes da Web; API, banco, contratos e valores dos dados não foram alterados.
- `pnpm --filter @dashboard-power-bi/web test -- --runInBand`: 43 suítes e 147 testes aprovados.
- `pnpm typecheck` e `pnpm build`: aprovados.
- `pnpm exec playwright test tests/e2e/auth-dashboard.spec.ts --project=chromium --workers=1`: 8 cenários aprovados, incluindo menu móvel e drill-down.
- Revisão visual em 390, 640, 1024 e 1440 px: sem rolagem horizontal; navegação móvel recolhida abaixo de 1024 px e barra lateral fixa a partir desse breakpoint.
- Contrastes medidos: texto principal/fundo 15,36:1; texto atenuado/cartão branco 6,55:1; texto branco nas cores floresta/petróleo/âmbar 9,11:1, 5,47:1 e 5,02:1.
- A paleta agro corporativa continua provisória até a disponibilização dos tokens oficiais da marca.
