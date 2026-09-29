# SPEC — Dados ampliados para a demonstração local

**ID:** DEMO-DADOS-001  
**Módulo:** Transversal (BI, relatórios, notificações, exportações e autenticação)  
**Fase:** Demonstração local  
**Status:** Concluído  
**Atualizado em:** 2026-09-29

---

## 1. Objetivo

Deixar a demo Docker mais fácil de explorar com dados fictícios variados e uma conta de consulta que veja os setores operacionais disponíveis.

## 2. Contexto

A conta financeira existente enxerga somente o setor financeiro. Além disso, os exemplos da home, dos relatórios SQL, das notificações e do histórico de exportações têm poucas categorias ou registros. Isso dificulta avaliar filtros, séries temporais, estados e dimensões da interface.

## 3. Regras de negócio

| Código | Regra                                                                                                                                                | Status     |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| RN-01  | Todo registro adicionado para esta tarefa é fictício e identificado como dado de demonstração.                                                       | Confirmado |
| RN-02  | A nova conta `viewer.diretoria@example.com` tem somente o papel `viewer` e pode consultar os setores da demo; não recebe permissões administrativas. | Confirmado |
| RN-03  | A senha da nova conta vem da mesma configuração local `AUTH_DEMO_USER_PASSWORD` usada pelas outras contas demo.                                      | Confirmado |
| RN-04  | O dashboard agrícola legado continua usando sua janela móvel de 12 meses; esta tarefa aumenta categorias e registros por período.                    | Confirmado |
| RN-05  | A ampliação dos exemplos não muda a fonte nem mascara o estado `not_configured` do contrato BI v1 para Oracle/COMPASS.                               | Confirmado |

## 4. Fluxo esperado

1. A pessoa inicia o Compose demo e entra com a conta de consulta geral.
2. A home mostra KPIs dos setores liberados para essa conta.
3. Drill-downs apresentam várias fazendas/unidades, culturas, variedades, safras e clientes fictícios.
4. O catálogo retorna mais linhas nas tabelas SQL de exemplo.
5. Notificações e histórico de exportação exibem mais itens e estados distintos.
6. A home identifica explicitamente os indicadores como fictícios quando a demo está usando dados mockados.

## 5. Critérios de aceite

- A conta de consulta geral autentica sem TOTP e tem apenas papel `viewer`.
- A autorização do backend permite os setores configurados para essa conta e continua restringindo as contas setoriais existentes.
- O fallback do dashboard oferece no mínimo quatro fazendas/unidades, seis variedades e dez clientes no drill-down.
- A demo Web contém 12 KPIs, ao menos dez notificações com os quatro tipos, ao menos dez exportações cobrindo os quatro estados e oito configurações fictícias.
- Quando `NEXT_PUBLIC_USE_MOCK_DATA=true`, a home mostra “Demonstração · Dados fictícios para visualização” e não chama os KPIs de reais ou provenientes do Oracle.
- O SQL Server demo inicializa tabelas de exemplo com linhas variadas e consultas continuam parametrizadas.
- Os testes focados, typecheck, build, validadores de documentação/Docker e smoke checks do Compose passam.

## 6. Impacto técnico

- **Arquitetura:** nenhum serviço novo; seeds existentes do backend, da Web e do SQL Server demo são ampliados.
- **Banco de dados:** somente tabelas fictícias do SQL Server demo são repovoadas pelo script de inicialização existente; schema e contratos não mudam.
- **API:** sem novos endpoints; o seed de usuários de desenvolvimento ganha uma conta de consulta geral.
- **Frontend:** mais exemplos locais para KPIs, notificações, exportações e configurações; sem novas telas.
- **Testes:** cobertura unitária dos limites do conjunto de demonstração, dimensões do drill-down e perfil de acesso da conta geral.
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
