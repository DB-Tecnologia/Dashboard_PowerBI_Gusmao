# SPEC — Dados ampliados para a demonstração local

**ID:** DEMO-DADOS-001  
**Módulo:** Transversal (BI, relatórios, notificações, exportações e autenticação)  
**Fase:** Demonstração local  
**Status:** Concluída
**Atualizado em:** 2026-09-29

---

## 1. Objetivo

Deixar a demo Docker mais fácil de explorar com dados fictícios variados, distribuídos em datas e períodos coerentes, e uma conta de consulta que veja os setores operacionais disponíveis.

## 2. Contexto

A conta financeira existente enxerga somente o setor financeiro. Além disso, embora o dashboard agrícola já gere uma série móvel de 12 meses e o SQL financeiro tenha competências mensais, as notificações e exportações ficam concentradas em poucos dias, e os KPIs mensais comparam o acumulado de 12 meses com apenas um mês. Isso dificulta avaliar uma história temporal convincente e deixa as variações visualmente exageradas.

## 3. Regras de negócio

| Código | Regra                                                                                                                                                                          | Status     |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| RN-01  | Todo registro adicionado para esta tarefa é fictício e identificado como dado de demonstração.                                                                                 | Confirmado |
| RN-02  | A nova conta `viewer.diretoria@example.com` tem somente o papel `viewer` e pode consultar os setores da demo; não recebe permissões administrativas.                           | Confirmado |
| RN-03  | A senha da nova conta vem da mesma configuração local `AUTH_DEMO_USER_PASSWORD` usada pelas outras contas demo.                                                                | Confirmado |
| RN-04  | O dashboard agrícola legado continua usando sua janela móvel de 12 meses; esta tarefa aumenta categorias e registros por período.                                              | Confirmado |
| RN-05  | A ampliação dos exemplos não muda a fonte nem mascara o estado `not_configured` do contrato BI v1 para Oracle/COMPASS.                                                         | Confirmado |
| RN-06  | Registros de notificações, exportações e configurações cobrem períodos diferentes, preservando ordem cronológica e consistência entre criação, conclusão, leitura e expiração. | Confirmado |
| RN-07  | KPIs mensais dos três setores da demo exibem o mês atual e comparam com o mês anterior; seus gráficos mantêm os últimos 12 meses.                                              | Confirmado |
| RN-08  | A interface mostra explicitamente a janela de histórico usada na série principal da demo.                                                                                      | Confirmado |

## 4. Fluxo esperado

1. A pessoa inicia o Compose demo e entra com a conta de consulta geral.
2. A home mostra KPIs dos setores liberados para essa conta.
3. Drill-downs apresentam várias fazendas/unidades, culturas, variedades, safras e clientes fictícios.
4. O catálogo retorna mais linhas nas tabelas SQL de exemplo.
5. Notificações e histórico de exportação exibem mais itens e estados distintos.
6. A home identifica explicitamente os indicadores como fictícios quando a demo está usando dados mockados.
7. As timelines de Produção, Comercial e Algodoeira informam os últimos 12 meses e comparam KPIs mensais ao mês anterior.
8. Notificações, exportações e configurações mostram registros distribuídos por vários meses, ordenados do mais recente para o mais antigo.

## 5. Critérios de aceite

- A conta de consulta geral autentica sem TOTP e tem apenas papel `viewer`.
- A autorização do backend permite os setores configurados para essa conta e continua restringindo as contas setoriais existentes.
- O fallback do dashboard oferece no mínimo quatro fazendas/unidades, seis variedades e dez clientes no drill-down.
- A demo Web contém 12 KPIs, ao menos dez notificações com os quatro tipos, ao menos dez exportações cobrindo os quatro estados e oito configurações fictícias.
- Quando `NEXT_PUBLIC_USE_MOCK_DATA=true`, a home mostra “Demonstração · Dados fictícios para visualização” e não chama os KPIs de reais ou provenientes do Oracle.
- As séries sintéticas dos três setores contêm 12 competências mensais; os KPIs mensais usam o valor do mês atual e comparam o valor do mês anterior, evitando comparar acumulado anual com um mês isolado. Contratos fictícios têm uma data por competência; fontes sem data preservam o comparativo anual existente.
- As notificações e exportações cobrem pelo menos 300 dias; a lista fica em ordem cronológica decrescente e os timestamps de conclusão/leitura/expiração são coerentes com a criação.
- Os timestamps das configurações não são todos iguais e cobrem pelo menos seis meses.
- A home mostra o rótulo “Histórico: últimos 12 meses” junto à descrição do dashboard.
- O SQL Server demo inicializa tabelas de exemplo com linhas variadas e consultas continuam parametrizadas.
- Os testes focados, typecheck, build, validadores de documentação/Docker e smoke checks do Compose passam.

## 6. Impacto técnico

- **Arquitetura:** nenhum serviço novo; seeds existentes do backend, da Web e do SQL Server demo são ampliados.
- **Banco de dados:** somente tabelas fictícias do SQL Server demo são repovoadas pelo script de inicialização existente; schema e contratos não mudam.
- **API:** sem novos endpoints; o fallback de demonstração cria retratos mensais para contratos e indicadores e calcula valores/deltas da mesma janela. Fontes sem data preservam o comparativo anual existente.
- **Frontend:** exemplos locais com histórico de datas distribuídas e janela temporal identificada; a tela executiva prioriza KPIs com histórico mensal para a série de destaque; sem novas telas.
- **Testes:** cobertura unitária dos limites do conjunto de demonstração, dimensões do drill-down, perfil da conta geral, amplitude/ordem das datas e comparabilidade dos KPIs mensais.
- **Infraestrutura:** imagens Web/API e seed SQL do Compose demo são reconstruídos para atualização local.
- **Segurança:** a conta geral é somente leitura; não se altera a autenticação das contas existentes nem se usam dados reais.

## 7. Testes necessários

- `pnpm --filter @dashboard-power-bi/web exec jest --runInBand src/lib/app-data.test.ts`
- `pnpm --filter @dashboard-power-bi/api exec jest --runInBand src/platform/dashboard/dashboard.service.spec.ts src/auth/auth.service.spec.ts`
- `pnpm verify:docs`, `pnpm verify:docker`, `pnpm typecheck` e os smoke checks do Compose demo.

## 8. Riscos

- Os valores são plausíveis apenas para demonstrar telas e não devem ser usados como indicadores do negócio.
- Os usuários são mantidos em memória no modo demo e desaparecem quando a API é recriada.
- BI v1 continua sem snapshot real; Oracle/COMPASS e reconciliação de KPIs seguem pendentes.

## 9. Dependências

- `infra/env/.env.demo` configurado localmente, com `AUTH_DEMO_USER_PASSWORD`.
- Docker Compose demo e os pacotes do workspace instalados para executar validações.
