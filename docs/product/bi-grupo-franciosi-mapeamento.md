# Mapeamento do Sistema BI — Grupo Franciosi

**Ambiente analisado:** [BI Grupo Franciosi](https://bi.grupofranciosi.app/)  
**Contexto:** produção — grãos e algodão  
**Data da análise:** 24/08/2026  
**Safra principal observada:** 25/26  
**Escopo:** inventário das abas do menu, finalidade, KPIs, fontes e limitações.

> Este documento não contém credenciais de acesso. Os números representam um retrato do sistema no momento da análise e devem ser atualizados após uma nova sincronização.

## 1. Visão executiva do sistema

O BI está organizado como uma cadeia operacional que vai do campo ao resultado financeiro:

```text
Visão Grupo
   ↓
Colheita → Grãos / Soja / Algodão → Algodoeira → Armazenamento
   ↓                                      ↓
Romaneios → Comercial → Embarques → Faturamento / Resultados / Custo
   ↓
Compras / Insumos / Almoxarifado / Gestão / Alertas
```

O núcleo mais relevante para o cliente é formado por:

1. **Visão Grupo**, para leitura executiva da safra.
2. **Colheita**, para acompanhar o que entrou nas últimas 24 horas.
3. **Grãos**, **Soja** e **Algodão**, para avanço, produtividade, qualidade e talhões.
4. **Algodoeira**, para o fluxo campo → pátio → beneficiamento → fibra.
5. **Armazenamento**, **Comercial** e **Embarques**, para estoque, vendas e cumprimento de contratos.
6. **Resultados**, **Custo** e **Faturamento**, para avaliar receita, margem e desempenho histórico.

## 2. Mapa completo das abas

### 2.1 Visão Geral

| Aba              | Rota | Finalidade                                      | Principais KPIs                                                                                | Relevância     |
| ---------------- | ---- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------- |
| Home Visão Grupo | `/`  | Resumo consolidado da safra e do beneficiamento | Área colhida, avanço %, culturas em janela, volume colhido, alertas, produtividade por cultura | **Muito alta** |

**Leitura observada:** 13.142/17.916 ha colhidos, 73%, 76.852 t no grupo, 2 culturas em janela e 9 encerradas. A tela informa zero alertas ativos no resumo, mas orienta consultar a aba Algodoeira para o beneficiamento.

### 2.2 Agrícola

| Aba            | Rota             | Finalidade                                    | Principais KPIs                                                                             | Fonte/observação                                       |
| -------------- | ---------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Colheita       | `/colheita`      | Monitorar entradas de hoje e ontem por talhão | Frentes ativas, toneladas recebidas, rolos, entradas por talhão, última entrada             | Romaneios e Unisystem; atualiza na sincronização       |
| Algodão        | `/algodao`       | Acompanhar a colheita do algodão no campo     | Área plantada/colhida, avanço, saldo a colher, rolos, @/ha, peso médio, variedades, talhões | Oracle/Unisystem; peso estimado para rolos não pesados |
| Soja           | `/soja`          | Acompanhar a safra de soja                    | Área, volume, sc/ha, ritmo diário, umidade, impureza, avariados, variedades e histórico     | SIAGRI; última carga exibida em 09/06/2026             |
| Milho e outros | `/graos`         | Acompanhar milho e demais grãos               | Área, avanço, volume, sc/ha por cultura, ritmo e qualidade                                  | Romaneios/Unisystem; 9 culturas                        |
| Algodoeira     | `/algodoeira`    | Controlar o beneficiamento do algodão         | Rolos no campo/pátio/gin, caroço, pluma, rendimento, ordens, fardinhos/hora e HVI           | Balança, ordens do gin, Unisystem e HVI                |
| Armazenamento  | `/armazenamento` | Controlar produtos disponíveis para venda     | Estoque por cultura, produto, armazém e fazenda                                             | Oracle; posição física por produto/armazém             |

### 2.3 Comercial

| Aba       | Rota         | Finalidade                                                  | Principais KPIs                                                                                  |
| --------- | ------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Comercial | `/comercial` | Medir disponibilidade e venda de grãos e algodão            | Disponível, vendido, a vender, % comercializado, preço médio, destino                            |
| Romaneios | `/romaneios` | Consultar movimentação física de entradas e saídas          | Quantidade de romaneios, peso líquido, umidade, impureza, avariados, produto e fazenda           |
| Embarques | `/embarques` | Acompanhar execução de contratos                            | Contratos ativos, % atendida, receita realizada, saldo a embarcar, ritmo diário, cliente/trading |
| Insumos   | `/insumos`   | Controlar estoque de fertilizantes, defensivos e biológicos | Valor em estoque, itens, entradas e saídas semanais, categoria e fazenda                         |
| Sementes  | `/sementes`  | Controlar estoque e movimentação de sementes                | Valor, variedades, cultura, fazenda, chegadas e saídas                                           |

### 2.4 Análise

| Aba               | Rota             | Finalidade                                    | Principais KPIs                                                                                    |
| ----------------- | ---------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Safra Resultados  | `/resultados`    | Comparar produção e receita por safra         | Produção, receita, líder de volume, líder de receita, produtividade, qualidade, fazenda e projeção |
| Custo de Produção | `/custo`         | Avaliar desembolso, margem e custo unitário   | Custo total, R$/ha, custo por unidade, margem, margem/ha, equilíbrio e composição                  |
| Faturamento       | `/faturamento`   | Analisar receita fiscal e por safra           | Receita anual, variação, cultura, fazenda, preço médio e exportação                                |
| Áreas & Cenários  | `/insumos-areas` | Controlar áreas plantadas e comparar cenários | Área por safra, cultura, fazenda, 1ª safra, safrinha e cenário ativo                               |

### 2.5 Administrativo

| Aba           | Rota            | Finalidade                                        | Principais KPIs                                                                                     |
| ------------- | --------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Compras       | `/compras`      | Acompanhar o ciclo de compras e gasto operacional | Solicitações, cotações, pedidos, entradas, total comprado, média mensal, categoria e lead time      |
| Almoxarifado  | `/almoxarifado` | Controlar itens de consumo                        | Produtos, posições, armazéns, movimentações e maiores saldos                                        |
| EBITDA        | `/ebitda`       | Avaliar geração de caixa e endividamento          | EBITDA, margem, EBIDA/lucro, juros, dívida, amortização, captação e investimentos                   |
| Status Diário | `/status`       | Consolidar a situação operacional do dia          | Compras, pedidos, OS, embarques, saldo contratual, colheita recebida, contas a pagar/receber e NF-e |

### 2.6 Relatórios

| Aba              | Rota                | Finalidade                         | Principais KPIs                                                                            |
| ---------------- | ------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------ |
| Notas Duplicadas | `/notas-duplicadas` | Apoiar auditoria de contas a pagar | Suspeitas fortes, casos em aberto, valor em risco, duplicidades pagas e títulos analisados |

### 2.7 Gestão

| Aba               | Rota            | Finalidade                                     | Principais KPIs                                                                                         |
| ----------------- | --------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Alertas           | `/alertas`      | Centralizar anomalias e pendências             | Novos, em análise, resolvidos, falsos positivos e taxa de falso positivo                                |
| Aceite de Pedidos | `/aceite`       | Controlar aprovações e backlog                 | Pedidos pendentes, valor aguardando alçada, aging, pedidos com nota e tempo médio de aceite             |
| Combustível       | `/combustivel`  | Monitorar estoque, abastecimento e divergência | Litros, abastecimentos, preço médio, divergência de bomba, estoque por tanque e consumo por equipamento |
| Fornecedores      | `/fornecedores` | Avaliar concentração e risco de fornecedores   | Compras, fornecedores ativos, Pareto, concentração, novos fornecedores e variação de gasto              |
| Serviços          | `/servicos`     | Monitorar despesas com serviços                | Gasto, prestadores, notas, pessoa física, ISS retido, categoria e desvio mensal                         |
| Bens              | `/bens`         | Controlar patrimônio e saneamento cadastral    | Bens, valor de aquisição, valor contábil, cadastro incompleto, NF vinculada e categoria                 |

## 3. Fluxo recomendado para o cliente

### Acompanhamento diário da produção

1. **Visão Grupo:** confirmar avanço consolidado e culturas ainda em janela.
2. **Colheita:** verificar entradas das últimas 24 horas e frentes ativas.
3. **Grãos / Soja:** avaliar avanço por fazenda, talhão, produtividade e qualidade.
4. **Algodão:** priorizar talhões parados, saldo a colher, rolos e estimativa de @/ha.
5. **Algodoeira:** conferir fila de pátio, ordens abertas, rendimento, produção de pluma e HVI.

### Acompanhamento comercial e financeiro

6. **Armazenamento:** validar saldo físico por produto e armazém.
7. **Comercial:** comparar disponível, vendido e a vender por cultura.
8. **Embarques:** conferir contratos, saldo, cliente e ritmo necessário.
9. **Resultados / Custo / Faturamento:** revisar receita, custo, margem, preço e projeções.

## 4. Fontes e linhagem dos dados

| Fonte                 | Uso observado                                                              | Tipo                                       |
| --------------------- | -------------------------------------------------------------------------- | ------------------------------------------ |
| Oracle / Unisystem    | Colheita, algodão, grãos, algodoeira, estoque, comercial, compras e gestão | Operacional; em geral ao vivo ou diário    |
| SIAGRI                | Histórico de safra, soja, custo e parte dos resultados                     | Base histórica/congelada em vários painéis |
| Balança da algodoeira | Peso real dos rolos que chegaram ao gin                                    | Real; alimenta caroço e rendimento         |
| Romaneios             | Entradas, saídas, peso líquido e qualidade dos grãos                       | Real; base de movimentação física          |
| Ordens de serviço     | Vínculo entre colheita, talhão e rolos/módulos                             | Real, quando o ERP possui o vínculo        |
| HVI                   | Qualidade da fibra por fardinho                                            | Real para fardinhos analisados             |

## 5. Convenções e limitações importantes

- Grãos são apresentados em toneladas e sacas de 60 kg.
- Algodão usa caroço, rolos, toneladas, @/ha e fardinhos; a unidade varia conforme o estágio do processo.
- Para rolos de algodão ainda não pesados, o BI estima o caroço com a média da safra atual de 2.553 kg/rolo.
- O @/ha do algodão é calculado sobre a área colhida marcada; enquanto a balança não fecha todos os rolos, o indicador é parcial/projetado.
- A pluma por talhão é rateada pela ordem de beneficiamento. O HVI não está plenamente vinculado ao talhão.
- Soja foi informada como saldo inicial no armazenamento; o painel registra que não há colheita por talhão de soja no sistema atual.
- Algodão é safrinha na terra da soja. Por isso, a soma de áreas de 1ª safra e safrinha pode superar a área física da fazenda.
- O painel de grãos mostra produtividade consolidada como “—”, embora a produtividade exista por cultura; a leitura correta é por cultura/fazenda.

## 6. Qualidade e atualização observadas

- O cabeçalho geral indicava banco conectado e dados sincronizados em 24/08 às 08:31.
- Algumas páginas exibiram posições em 23/08 ou 22/08, conforme o fato operacional mais recente.
- As páginas **Insumos**, **Sementes** e **Status Diário** exibiram referência a 19/09/2026, posterior à data da análise. Essa inconsistência deve ser corrigida antes de comparar esses painéis com os demais.
- A tela Visão Grupo mostrava zero alertas ativos no resumo, enquanto a Central de Alertas mostrava 489 alertas novos. As duas métricas precisam ser explicitamente diferenciadas no produto.
- A atualização é descrita como sincronização agendada ou acionada pelo usuário, mas a periodicidade efetiva varia por módulo.

## 7. Abas prioritárias para o cliente

| Prioridade                  | Abas                                                                              | Motivo                                                |
| --------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------- |
| P0 — operação diária        | `/`, `/colheita`, `/graos`, `/algodao`, `/algodoeira`                             | Decisão sobre avanço da colheita, gargalos e produção |
| P1 — fluxo físico/comercial | `/armazenamento`, `/comercial`, `/embarques`, `/romaneios`                        | Estoque disponível, vendas, contratos e expedição     |
| P1 — resultado              | `/resultados`, `/custo`, `/faturamento`                                           | Rentabilidade, receita, custo e projeção              |
| P2 — suporte operacional    | `/insumos`, `/compras`, `/almoxarifado`, `/combustivel`, `/status`                | Abastecimento, compras, estoque de consumo e execução |
| P2 — governança             | `/alertas`, `/aceite`, `/notas-duplicadas`, `/fornecedores`, `/servicos`, `/bens` | Controles, riscos e saneamento administrativo         |
