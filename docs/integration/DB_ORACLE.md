# DB_ORACLE.md — Mapeamento Completo do Banco Oracle

> Gerado em 02/07/2026 a partir do dump `exp_full_xecdb_20260612-1215.dmp` importado no Oracle XE 21c do Docker dev.

---

## 1. Informações Gerais do Banco

| Propriedade             | Valor                                                |
| ----------------------- | ---------------------------------------------------- |
| **Nome do banco**       | XE                                                   |
| **Versão**              | Oracle Database 21c Express Edition 21.0.0.0.0       |
| **PDB**                 | XEPDB1                                               |
| **Open mode**           | READ WRITE                                           |
| **Log mode**            | NOARCHIVELOG                                         |
| **Database role**       | PRIMARY                                              |
| **Character set**       | AL32UTF8                                             |
| **NCHAR character set** | AL16UTF16                                            |
| **NLS Language**        | AMERICAN                                             |
| **NLS Territory**       | AMERICA                                              |
| **Tablespaces**         | TEMP (TEMPORARY), UNDOTBS1 (UNDO), USERS (PERMANENT) |
| **Dump de origem**      | `exp_full_xecdb_20260612-1215.dmp` (702 MB)          |
| **Formato do dump**     | Oracle Data Pump (expdp)                             |
| **Data do dump**        | 12/06/2026 12:15                                     |

---

## 2. Schemas de Negócio

Schemas com status **OPEN** importados do dump:

| Schema         | Status | Descrição                                            |
| -------------- | ------ | ---------------------------------------------------- |
| **AGNEW**      | OPEN   | Schema principal do ERP (sistema agrícola/comercial) |
| **EXTRATOR**   | OPEN   | Schema de extração/ETL para dashboards e relatórios  |
| **UNISYSTEM**  | OPEN   | Schema de autenticação e auditoria do sistema        |
| **ABACO**      | OPEN   | Schema auxiliar                                      |
| **DBCONSULTA** | OPEN   | Schema de consultas                                  |

### Resumo de objetos por schema

| Schema         | Tabelas | Views | Mat. Views | Sequences | Procedures | Functions | Packages | Triggers | Types | Jobs |
| -------------- | ------- | ----- | ---------- | --------- | ---------- | --------- | -------- | -------- | ----- | ---- |
| **AGNEW**      | 2.648   | 391   | 26         | 84        | 265        | 390       | 2        | 718      | 11    | 19   |
| **EXTRATOR**   | 57      | 0     | 0          | 1         | 1          | 2         | 0        | 0        | 1     | 0    |
| **UNISYSTEM**  | 7       | 0     | 0          | 1         | 2          | 5         | 1        | 3        | 0     | 1    |
| **ABACO**      | —       | —     | —          | —         | —          | —         | —        | —        | —     | —    |
| **DBCONSULTA** | —       | —     | —          | —         | —          | —         | —        | —        | —     | —    |

---

## 3. Schema EXTRATOR (Extração/ETL para Dashboards)

### 3.1 Tabelas (57 tabelas)

| Tabela                      | Registros | Descrição                                     |
| --------------------------- | --------- | --------------------------------------------- |
| `EXT_ACOMP_CESSAO_CREDITO`  | 70        | Acompanhamento de cessão de crédito           |
| `EXT_ACOMP_CLI_CONT`        | —         | Acompanhamento cliente x contrato             |
| `EXT_ACOMP_CONTRATO`        | —         | Acompanhamento de contratos                   |
| `EXT_ACOMP_CONT_EMB_NEG`    | —         | Contrato x embarque x negociação              |
| `EXT_ACOMP_CONT_FINAN`      | —         | Contrato x financeiro                         |
| `EXT_ACOMP_CONT_LCTOS`      | —         | Contrato x lançamentos                        |
| `EXT_ACOMP_CONT_NF`         | —         | Contrato x notas fiscais                      |
| `EXT_ACOMP_CONT_PROD`       | —         | Contrato x produtos                           |
| `EXT_ACOMP_CONT_PROD_EMB`   | —         | Contrato x produto x embarque                 |
| `EXT_ACOMP_CONT_PROD_FINAN` | —         | Contrato x produto x financeiro               |
| `EXT_ACOMP_CONT_PROD_LCTOS` | —         | Contrato x produto x lançamentos              |
| `EXT_ACOMP_CONT_PROD_NF`    | —         | Contrato x produto x NF                       |
| `EXT_ACOMP_FINAN_COMP`      | —         | Financeiro complementar                       |
| `EXT_ACOMP_FIXACOES`        | —         | Fixações                                      |
| `EXT_ACOMP_PROD_CES_CRED`   | —         | Produto x cessão de crédito                   |
| `EXT_ACOMP_PROD_FINAN_COMP` | —         | Produto x financeiro complementar             |
| `EXT_ACOMP_PROD_FIXACOES`   | —         | Produto x fixações                            |
| `EXT_ACOMP_PROD_TAKEUP`     | —         | Produto x take-up                             |
| `EXT_ACOMP_PROD_TKP_BLOC`   | —         | Produto x take-up x blocos                    |
| `EXT_ACOMP_TAKEUP`          | —         | Take-up                                       |
| `EXT_ACOMP_TAKEUP_BLOCO`    | —         | Take-up x bloco                               |
| `EXT_ALG_GRAFICO`           | —         | Gráficos de algodão                           |
| `EXT_ALG_GRAFICO_CAR`       | —         | Gráficos de algodão (carregamento)            |
| `EXT_ALG_GRAFICO_MOV`       | —         | Gráficos de algodão (movimentação)            |
| `EXT_ALG_MODULO`            | —         | Módulos de algodão                            |
| `EXT_ALG_PLUMA`             | —         | Pluma de algodão                              |
| `EXT_ANAL_PLANT_APT`        | —         | Análise de plantio (aptidão)                  |
| `EXT_ANAL_PLANT_CEN`        | —         | Análise de plantio (cenário)                  |
| `EXT_ANAL_PLANT_PREV`       | —         | Análise de plantio (previsão)                 |
| `EXT_COL_GRAFICO`           | —         | Gráficos de colheita                          |
| **`EXT_COL_OS_COLHEITA`**   | **12**    | **Ordens de serviço de colheita (dashboard)** |
| **`EXT_COL_OS_PLANTIO`**    | **186**   | **Ordens de serviço de plantio (dashboard)**  |
| `EXT_GST_COMERCIAL_CLIENTE` | —         | Gestão comercial - clientes                   |
| `EXT_GST_COMERCIAL_PV`      | —         | Gestão comercial - pedidos de venda           |
| `EXT_GST_COMERCIAL_PV_ITEM` | —         | Gestão comercial - itens de PV                |
| `EXT_MAPA_GER_FAZ_COMERC`   | —         | Mapa gerencial fazenda (comercial)            |
| `EXT_MAPA_GER_FAZ_GERAL`    | —         | Mapa gerencial fazenda (geral)                |
| `EXT_MAPA_GER_FAZ_PO`       | —         | Mapa gerencial fazenda (PO)                   |
| `EXT_MAPA_GER_FAZ_RESUMO`   | —         | Mapa gerencial fazenda (resumo)               |
| `EXT_MEDIA_GRAFICO`         | —         | Médias para gráficos                          |
| `EXT_MEDIA_OS_PLANTIO`      | —         | Médias de OS de plantio                       |
| `EXT_MEDIA_PROD_SEM`        | —         | Médias de produção semanal                    |
| `EXT_PLUV_DATAS`            | —         | Datas pluviométricas                          |
| `EXT_PLUV_MEDICOES`         | —         | Medições pluviométricas                       |
| `EXT_PLUV_SAFRAS`           | —         | Safras pluviométricas                         |
| `EXT_PLUV_TALHOES`          | —         | Talhões pluviométricos                        |
| `EXT_PROG_EMBARQUE`         | —         | Programação de embarques                      |
| `EXT_PROG_EMB_SAFRAS`       | —         | Programação de embarques por safra            |
| `INTEGRACAO_COMPASS`        | —         | Integração com Compass                        |
| `INTEGRACAO_COMPASS_FIL`    | —         | Integração Compass (filiais)                  |
| `INTEGRACAO_PARAMETROS`     | —         | Parâmetros de integração                      |
| `UNI_ATUALIZADOR`           | —         | Atualizador de dados                          |
| `UNI_ATUALIZADOR_SQL`       | —         | SQL do atualizador                            |
| `UNI_DASHBOARD`             | —         | Configuração de dashboards                    |
| `UNI_DASHBOARD_HORARIO`     | —         | Horários de atualização de dashboards         |
| `UNI_DASHBOARD_SQL`         | —         | SQL de dashboards                             |
| `UNI_PARAMETROS`            | —         | Parâmetros gerais                             |

### 3.2 Colunas das Tabelas Usadas pelo Dashboard

#### `EXT_COL_OS_PLANTIO` — 186 registros

| Coluna               | Tipo           | Null? |
| -------------------- | -------------- | ----- |
| `NR_CONTROLE`        | VARCHAR2(24)   | Y     |
| `COD_EMPRESA`        | NUMBER(22)     | Y     |
| `NOME_EMPRESA`       | VARCHAR2(200)  | Y     |
| `SIGLA_EMPRESA`      | VARCHAR2(40)   | Y     |
| `COD_FILIAL`         | NUMBER(22)     | Y     |
| `DESCRICAO_FILIAL`   | VARCHAR2(160)  | Y     |
| `SEQ_PLA_TIPO_CULT`  | VARCHAR2(40)   | Y     |
| `DESC_CULTURA`       | VARCHAR2(140)  | Y     |
| `COD_SAFRA`          | NUMBER(22)     | Y     |
| `DESCRICAO_SAFRA`    | VARCHAR2(60)   | Y     |
| `SEQ_PLA_AGLOMERADO` | VARCHAR2(40)   | Y     |
| `SIGLA_AGLOMERADO`   | VARCHAR2(48)   | Y     |
| `DESC_AGLOMERADO`    | VARCHAR2(120)  | Y     |
| `SEQ_PLA_FAZENDA`    | VARCHAR2(40)   | Y     |
| `SIGLA_FAZENDA`      | VARCHAR2(48)   | Y     |
| `DESC_FAZENDA`       | VARCHAR2(160)  | Y     |
| `SEQ_PLA_TALHAO`     | VARCHAR2(40)   | Y     |
| `NUMERO_TALHAO`      | VARCHAR2(28)   | Y     |
| `DESC_TALHAO`        | VARCHAR2(160)  | Y     |
| `SEQ_PLA_VARIEDADE`  | VARCHAR2(4000) | Y     |
| `DESC_VARIEDADE`     | VARCHAR2(4000) | Y     |
| `CICLO`              | NUMBER(22)     | Y     |
| `QTD_HA_EFETIVO`     | NUMBER(22)     | Y     |
| `DATA_PLANTIO`       | DATE(7)        | Y     |
| `PREVISAO_COLHEITA`  | DATE(7)        | Y     |

#### `EXT_COL_OS_COLHEITA` — 12 registros

| Coluna               | Tipo          | Null? |
| -------------------- | ------------- | ----- |
| `NR_CONTROLE`        | VARCHAR2(24)  | Y     |
| `COD_EMPRESA`        | NUMBER(22)    | N     |
| `NOME_EMPRESA`       | VARCHAR2(200) | Y     |
| `SIGLA_EMPRESA`      | VARCHAR2(40)  | Y     |
| `COD_FILIAL`         | NUMBER(22)    | N     |
| `DESCRICAO_FILIAL`   | VARCHAR2(160) | Y     |
| `SEQ_PLA_TIPO_CULT`  | VARCHAR2(40)  | Y     |
| `DESC_CULTURA`       | VARCHAR2(140) | Y     |
| `COD_SAFRA`          | NUMBER(22)    | Y     |
| `DESCRICAO_SAFRA`    | VARCHAR2(60)  | Y     |
| `SEQ_PLA_AGLOMERADO` | VARCHAR2(40)  | Y     |
| `SIGLA_AGLOMERADO`   | VARCHAR2(48)  | Y     |
| `DESC_AGLOMERADO`    | VARCHAR2(120) | Y     |
| `SEQ_PLA_FAZENDA`    | VARCHAR2(40)  | Y     |
| `SIGLA_FAZENDA`      | VARCHAR2(48)  | Y     |
| `DESC_FAZENDA`       | VARCHAR2(160) | Y     |
| `SEQ_PLA_TALHAO`     | VARCHAR2(40)  | Y     |
| `NUMERO_TALHAO`      | VARCHAR2(28)  | Y     |
| `DESC_TALHAO`        | VARCHAR2(160) | Y     |
| `SEQ_PLA_VARIEDADE`  | VARCHAR2(40)  | Y     |
| `DESC_VARIEDADE`     | VARCHAR2(80)  | Y     |
| `QTD_HA_EFETIVO`     | NUMBER(22)    | Y     |
| `DATA_LANCAMENTO`    | DATE(7)       | Y     |

### 3.3 Procedures e Functions

| Nome                | Tipo      |
| ------------------- | --------- |
| `PPROCESSAEMBARQUE` | PROCEDURE |
| `FN_CONCAT_LISTA`   | FUNCTION  |
| `FN_SPLIT`          | FUNCTION  |

---

## 4. Schema AGNEW (ERP Principal)

### 4.1 Visão Geral

O schema AGNEW é o **schema principal do ERP agrícola**, contendo:

- **2.648 tabelas** — dados de produção, comercial, financeiro, fiscal, RH, patrimônio
- **391 views** — consultas consolidadas para relatórios e dashboards
- **26 materialized views** — dados pré-calculados para performance
- **265 procedures** — lógica de negócio (REINF, eSocial, contabilidade, etc.)
- **390 functions** — funções auxiliares
- **718 triggers** — automações de banco
- **84 sequences** — geração de IDs
- **19 jobs** — agendamentos automáticos

### 4.2 Tabelas Usadas pelo Dashboard

#### `INSTRUCAO_EMBARQUE` — 12 registros

| Coluna                        | Tipo           | Null? |
| ----------------------------- | -------------- | ----- |
| `SEQ_PLA_INSTRUCAO`           | VARCHAR2(40)   | N     |
| `SEQ_PLA_EXPORTADOR`          | VARCHAR2(40)   | Y     |
| `SEQ_PLA_LEILAO_DCO`          | VARCHAR2(40)   | Y     |
| `SEQ_PLA_DESTINO`             | VARCHAR2(40)   | Y     |
| `SEQ_PLA_CONTRATO`            | VARCHAR2(40)   | Y     |
| `NR_INSTRUCAO`                | CHAR(50)       | Y     |
| `SEQ_PLA_FAZENDA`             | VARCHAR2(40)   | Y     |
| `DATA_INSTRUCAO`              | DATE(7)        | Y     |
| `COD_EMPRESA`                 | NUMBER(22)     | Y     |
| `SEQ_PLA_NAVIO`               | VARCHAR2(40)   | Y     |
| `COD_FILIAL`                  | NUMBER(22)     | Y     |
| `COD_TIPO_LCTO`               | VARCHAR2(12)   | Y     |
| `SAIDA_NAVIO`                 | DATE(7)        | Y     |
| `SEQ_PLA_PORTO`               | VARCHAR2(40)   | Y     |
| `TIPO_OPERACAO`               | VARCHAR2(4)    | Y     |
| `FARDOS`                      | NUMBER(22)     | Y     |
| `COD_SAFRA`                   | NUMBER(22)     | Y     |
| `OBSERVACOES`                 | VARCHAR2(1600) | Y     |
| `CONTAINERS`                  | NUMBER(22)     | Y     |
| `FARDOS_COM_HVI`              | NUMBER(22)     | Y     |
| `UNITARIO_EMISSAO_NOTA`       | CHAR(4)        | Y     |
| `VALOR_HVI_FARDO`             | NUMBER(22)     | Y     |
| `UNITARIO_EMISSAO_NF_VALOR`   | NUMBER(22)     | Y     |
| `SEQ_PLA_DESPACHANTE`         | VARCHAR2(40)   | Y     |
| `SEQ_PLA_ENTREGA`             | VARCHAR2(40)   | Y     |
| `DATA_ENTREGA`                | DATE(7)        | Y     |
| `LIMITE_MIN_PESO`             | NUMBER(22)     | Y     |
| `LIMITE_MAX_PESO`             | NUMBER(22)     | Y     |
| `FORM_LANCAMENTO`             | VARCHAR2(80)   | Y     |
| `TIPO`                        | CHAR(4)        | Y     |
| `DATA_AUTORIZACAO`            | DATE(7)        | Y     |
| `NOME_MOTORISTA`              | VARCHAR2(160)  | Y     |
| `PLACA`                       | VARCHAR2(28)   | Y     |
| `TELEFONE_MOTORISTA`          | VARCHAR2(48)   | Y     |
| `CPF_MOTORISTA`               | VARCHAR2(56)   | Y     |
| `SEQ_PLA_CLIENTE_FATURAMENTO` | VARCHAR2(40)   | Y     |
| `QUANTIDADE`                  | NUMBER(22)     | Y     |
| `PESO_ORIGEM_DESTINO`         | CHAR(4)        | Y     |
| `NICIO_ENTREGA`               | DATE(7)        | Y     |
| `TERMINO_ENTREGA`             | DATE(7)        | Y     |
| `DATA_CARREGAMENTO`           | DATE(7)        | Y     |
| `ARMAZEM`                     | CHAR(4)        | Y     |
| `SEQ_PLA_TRANSPORTADORA`      | VARCHAR2(40)   | Y     |
| `SEQ_PLA_ENDERECO`            | VARCHAR2(40)   | Y     |
| `SEQ_PLA_PRODUTO`             | VARCHAR2(40)   | Y     |
| `SEQ_PLA_UNIDADE`             | VARCHAR2(40)   | Y     |
| `SEQ_PLA_CLASSIFICACAO`       | VARCHAR2(40)   | Y     |
| `VALOR_TOTAL`                 | NUMBER(22)     | Y     |
| `DATA_FECHAMENTO`             | DATE(7)        | Y     |
| `USUARIO_FECHAMENTO`          | VARCHAR2(40)   | Y     |
| `NR_CONTROLE`                 | NUMBER(22)     | Y     |
| `TIPO_FRETE`                  | VARCHAR2(4)    | Y     |
| `DESC_TARA_NF`                | VARCHAR2(4)    | Y     |
| `CLIENTE_DESTINO`             | VARCHAR2(40)   | Y     |
| `SEQ_PLA_NOTA_MAE`            | VARCHAR2(40)   | Y     |
| `INFORMA_TAKEUP`              | VARCHAR2(4)    | Y     |
| `CUMPRIDA`                    | VARCHAR2(4)    | Y     |
| `BLOQ_SLD_NEGATIVO`           | VARCHAR2(4)    | Y     |
| `SEQ_PLA_FAZENDA_TRANSF`      | VARCHAR2(40)   | Y     |
| `PESO_NOTA`                   | VARCHAR2(4)    | Y     |
| `CANCELADO`                   | VARCHAR2(4)    | Y     |
| `UF_PLACA`                    | VARCHAR2(8)    | Y     |
| `COD_TABELA`                  | NUMBER(22)     | Y     |
| `COD_CONTA`                   | NUMBER(22)     | Y     |
| `EMBALAGEM`                   | VARCHAR2(40)   | Y     |
| `NAO_OBRIGA_FRETE`            | CHAR(1)        | Y     |
| `SOMENTE_TRANSFERENCIA`       | VARCHAR2(1)    | Y     |
| `TIPO_INDICE_FATURAMENTO`     | VARCHAR2(1)    | Y     |
| `DIAS_INDICE`                 | FLOAT(22)      | Y     |
| `DATA_FIXACAO_INDICE`         | DATE(7)        | Y     |
| `INDICE_FATURAMENTO`          | FLOAT(22)      | Y     |
| `QUALIDADE_ORIGEM_DESTINO`    | VARCHAR2(1)    | Y     |
| `CONTROLE_FORMACAO_LOTE`      | VARCHAR2(1)    | Y     |
| `NR_CONTROLE_INTERNO`         | VARCHAR2(12)   | Y     |
| `PERM_SLD_NEGATIVO_ROM`       | VARCHAR2(1)    | Y     |
| `SEQ_PLA_ORIGEM`              | VARCHAR2(10)   | Y     |
| `BLOQ_PERIODO_ENTREGA`        | VARCHAR2(1)    | Y     |
| `RETORNO_ARMAZENAGEM`         | VARCHAR2(1)    | Y     |
| `FIBRILHA`                    | VARCHAR2(1)    | Y     |
| `XPED`                        | VARCHAR2(50)   | Y     |
| `NITEMPED`                    | VARCHAR2(6)    | Y     |
| `STATUS_APP`                  | VARCHAR2(1)    | Y     |
| `ID_INTEGRADOR`               | VARCHAR2(100)  | Y     |
| `NR_CARGA`                    | VARCHAR2(100)  | Y     |
| `COD_TIPO_LCTO_CONTA_ORDEM`   | VARCHAR2(3)    | Y     |
| `TIPO_FRETE_CONTA_ORDEM`      | VARCHAR2(1)    | Y     |
| `SEQ_PLA_ARMAZEM_DEST`        | VARCHAR2(10)   | Y     |

#### `VW_CONS_CONTRATO_GRAOS` — 14 registros (View)

| Coluna                  | Tipo          | Null? |
| ----------------------- | ------------- | ----- |
| `COD_EMPRESA`           | NUMBER(22)    | Y     |
| `COD_FILIAL`            | NUMBER(22)    | Y     |
| `COD_SAFRA`             | NUMBER(22)    | Y     |
| `SEQ_PLA_CLIENTE`       | VARCHAR2(40)  | N     |
| `SEQ_PLA_ENDERECO`      | VARCHAR2(40)  | N     |
| `SEQ_PLA_CONTRATO`      | VARCHAR2(40)  | N     |
| `SEQ_PLA_MOEDA`         | VARCHAR2(40)  | N     |
| `SEQ_PLA_PRODUTO`       | VARCHAR2(40)  | N     |
| `TIPOCONT`              | CHAR(5)       | Y     |
| `NOME_CLIENTE`          | VARCHAR2(100) | Y     |
| `LOCAL_EMBARQUE`        | VARCHAR2(426) | Y     |
| `NR_CONTRATO`           | VARCHAR2(80)  | Y     |
| `NR_CONTRATO_EMPRESA`   | VARCHAR2(160) | Y     |
| `TIPO`                  | CHAR(0)       | Y     |
| `CODTIPO`               | CHAR(0)       | Y     |
| `BLOQUEIO`              | VARCHAR2(4)   | Y     |
| `MERCADO`               | VARCHAR2(7)   | Y     |
| `FRETE`                 | VARCHAR2(28)  | Y     |
| `FORM_LANCAMENTO`       | VARCHAR2(160) | Y     |
| `SIGLA_UNIDADE`         | VARCHAR2(40)  | Y     |
| `DESCRICAO_PRODUTO`     | VARCHAR2(200) | Y     |
| `QUANTIDADE`            | NUMBER(22)    | N     |
| `QTDE_EMBARC`           | NUMBER(22)    | Y     |
| `VALOR_EMBARC`          | NUMBER(22)    | Y     |
| `DEVOLUCAO`             | NUMBER(22)    | Y     |
| `COMPLEMENTO`           | NUMBER(22)    | Y     |
| `SALDO`                 | NUMBER(22)    | Y     |
| `SALDO_TON`             | NUMBER(22)    | Y     |
| `SIGLA_MOEDA`           | VARCHAR2(20)  | Y     |
| `RECEBIDO`              | NUMBER(22)    | Y     |
| `RECEBIDO_REAL`         | NUMBER(22)    | Y     |
| `VALOR_JUROS`           | NUMBER(22)    | Y     |
| `VALOR_DESCONTO`        | NUMBER(22)    | Y     |
| `UNITARIO`              | NUMBER(22)    | Y     |
| `LIB_SC`                | NUMBER(22)    | Y     |
| `TOTAL`                 | NUMBER(22)    | Y     |
| `SALDO_RECEBER`         | NUMBER(22)    | Y     |
| `VALOR_ORIGEM`          | NUMBER(22)    | Y     |
| `PREV_DESP`             | NUMBER(22)    | Y     |
| `PRECO_IMPOSTOS`        | NUMBER(22)    | Y     |
| `PRECO_FRETE`           | NUMBER(22)    | Y     |
| `PRECO_PORTO`           | NUMBER(22)    | Y     |
| `PRECO_COMISSAO`        | NUMBER(22)    | Y     |
| `ADIANTAMENTO`          | NUMBER(22)    | Y     |
| `ADIANTAMENTO_RECEBIDO` | NUMBER(22)    | Y     |
| `SALDO_ADIANTAMENTO`    | NUMBER(22)    | Y     |
| `STATUS`                | VARCHAR2(4)   | Y     |
| `MODALIDADE`            | VARCHAR2(7)   | Y     |
| `QTDE_TON`              | NUMBER(22)    | Y     |
| `QTDE_EMBARC_TON`       | NUMBER(22)    | Y     |

---

## 5. Schema UNISYSTEM (Autenticação/Auditoria)

### 5.1 Tabelas (7 tabelas)

| Tabela         | Descrição                      |
| -------------- | ------------------------------ |
| `ACESS`        | Controle de acessos do sistema |
| `ACESS_LOG`    | Log de acessos                 |
| `ATUALIZADOR`  | Controle de atualizações       |
| `AUDIT_DDL`    | Auditoria de DDL               |
| `M_UNISYSTEM`  | Metadados do Unisystem         |
| `M_UNI_CHAVES` | Chaves do Unisystem            |
| `UNISYSTEM`    | Tabela principal do Unisystem  |

### 5.2 Procedures e Functions

| Nome          | Tipo      |
| ------------- | --------- |
| `PAUTHENTIC`  | PROCEDURE |
| `PUPDATETIME` | PROCEDURE |
| `TRA_LOGON`   | TRIGGER   |

---

## 6. Views do AGNEW — Lista Completa (391 views)

### Views de Negócio (VW*\* e VU*\*)

| View                            | Categoria                            |
| ------------------------------- | ------------------------------------ |
| `VW_CONS_CONTRATO_GRAOS`        | **Comercial — usada pelo dashboard** |
| `VW_CONS_CONT_NEG_GRAOS`        | Comercial                            |
| `VW_CONS_VISAO_GRAOS`           | Comercial                            |
| `VW_CONT_VENDA_GRAOS`           | Comercial                            |
| `VW_NEG_COMPRA_GRAOS`           | Comercial                            |
| `VW_PROG_EMB_NEG_CONTRATO`      | Comercial                            |
| `VW_EMBARQUE_CONT_NEG`          | Comercial                            |
| `VW_PEDIDOS_VENDAS`             | Comercial                            |
| `VW_PEDIDOS_VENDA_SEMENTES`     | Comercial                            |
| `VW_COMISSAO_PED_VENDA_RECEBER` | Comercial                            |
| `VW_COMISSOES_PAGAR_CONTRATO`   | Comercial                            |
| `VW_CONTAS_RECEBER_CONTRATO`    | Financeiro                           |
| `VW_CONTRATO_NF_SAIDA`          | Fiscal                               |
| `VW_CONT_FIN_RECEBIDO`          | Financeiro                           |
| `VW_BANCO_FLUXO_CAIXA`          | Financeiro                           |
| `VW_BANCO_FRETE_CTE`            | Financeiro/Frete                     |
| `VW_BANCO_FRETE_PED_VENDA`      | Financeiro/Frete                     |
| `VW_CHEQUE_FLUXO_CAIXA`         | Financeiro                           |
| `VW_FLUXO_CAIXA`                | Financeiro                           |
| `VW_FLUXO_CAIXA_LCTOS`          | Financeiro                           |
| `VW_PREVISAO_FLUXO_CAIXA`       | Financeiro                           |
| `VW_SALDO_FLUXO_CAIXA`          | Financeiro                           |
| `VW_SALDO_FLUXO_DIA_MENSAL`     | Financeiro                           |
| `VW_FICHA_CONTA_CORRENTE`       | Financeiro                           |
| `VW_FICHA_FLUXO_CAIXA`          | Financeiro                           |
| `VW_FICHA_EMP_A_COMPENSAR`      | Financeiro                           |
| `VW_FICHA_EMP_REPASSE`          | Financeiro                           |
| `VW_ORCAMENTO`                  | Orçamento                            |
| `VW_ORC_AREA_FAZENDA`           | Orçamento                            |
| `VW_ORC_DESPESAS_IMPOSTOS`      | Orçamento                            |
| `VW_ORC_REALIZADO`              | Orçamento                            |
| `VW_ORC_SEL_MES_ANO`            | Orçamento                            |
| `VW_NFE_ENTRADA`                | Fiscal                               |
| `VW_NFE_ENTRADA_ITEM`           | Fiscal                               |
| `VW_NFE_SAIDA`                  | Fiscal                               |
| `VW_NFE_SAIDA_ITEM`             | Fiscal                               |
| `VW_NFE_EXPORTACAO`             | Fiscal                               |
| `VW_NFE_IMPORTACAO`             | Fiscal                               |
| `VW_NFE_OBS_IMPOSTOS`           | Fiscal                               |
| `VW_CTE`                        | Fiscal/Transporte                    |
| `VW_MDFE`                       | Fiscal/Transporte                    |
| `VW_EMPRESAS`                   | Cadastro                             |
| `VW_FAZENDAS`                   | Cadastro                             |
| `VW_FAZENDAS_ASSOCIADOS`        | Cadastro                             |
| `VW_FILIAIS`                    | Cadastro                             |
| `VW_SAFRAS`                     | Cadastro                             |
| `VW_CLIENTE_ENDERECO`           | Cadastro                             |
| `VW_CLIENTES_REFERENCIAS`       | Cadastro                             |
| `VW_PRODUTOR_SGL`               | Cadastro                             |
| `VW_ESTOQUE`                    | Estoque                              |
| `VW_ESTOQUE_FLUXO_CAIXA`        | Estoque                              |
| `VW_MOVIMENTACAO_PRODUTOS`      | Estoque                              |
| `VW_MOV_LOTE_PRODUTO`           | Estoque                              |
| `VW_SALDO_LOTES_SEMENTES`       | Estoque                              |
| `VW_PRODUTO_LOTE`               | Estoque                              |
| `VW_MAPA_FILTROS`               | Mapa                                 |
| `VW_MAP_FAZENDAS`               | Mapa                                 |
| `VW_MAP_TALHOES`                | Mapa                                 |
| `VW_MAP_TALHOES_COLHEITA`       | Mapa                                 |
| `VW_MAP_TALHOES_PLANTADO`       | Mapa                                 |
| `VW_MAP_VARIEDADES`             | Mapa                                 |
| `VW_MAP_PRAGAS`                 | Mapa                                 |
| `VW_MAP_MONITORAMENTO_PRAGAS`   | Mapa                                 |
| `VW_MAP_PRECOLHEITA`            | Mapa                                 |
| `VW_MAP_DETALHAR_PLANTIO`       | Mapa                                 |
| `VW_MAP_DETALHAR_APLICACAO`     | Mapa                                 |
| `VW_MAP_MEDIA_PRODUCAO`         | Mapa                                 |
| `VW_PLANO_OPER_SEMENTE`         | Plano operacional                    |
| `VW_PLANO_OPER_ADUBACAO`        | Plano operacional                    |
| `VW_PLANO_OPER_DEFENSIVOS`      | Plano operacional                    |
| `VW_PLANO_OPER_COMBUSTIVEL`     | Plano operacional                    |
| `VW_PLANO_OPER_MANEJO`          | Plano operacional                    |
| `VW_DESCASAMENTO_DOLAR`         | Cambial                              |
| `VW_DEVOLUCAO_VENDA_SEM`        | Comercial                            |
| `VW_APP_EMBARQUE_ALG`           | App mobile                           |
| `VW_APP_EMBARQUE_FARDOS`        | App mobile                           |
| `VW_BENEFICIAMENTO_ALG_TOTAIS`  | Beneficiamento                       |
| `VW_UNIG_*` (60+ views)         | Sistema Unigraos                     |
| `VW_WS_*` (120+ views)          | Web Service / API                    |
| `VW_LCDPR_*` (10 views)         | LCDPR (contabilidade rural)          |
| `VW_UNI_*` (40+ views)          | Sistema comercial                    |

### Materialized Views (26)

| Nome                         | Categoria estimada |
| ---------------------------- | ------------------ |
| `VM_BANCO_FLUXO_CAIXA`       | Financeiro         |
| `VM_CUSTO_GERAL`             | Custos             |
| `VM_PRE_CTB_SALDOS_VERTICAL` | Contabilidade      |
| `VM_ORCAMENTO`               | Orçamento          |
| `VM_REPROCESSA_ESTOQUE`      | Estoque            |
| _(+ 21 outras)_              | —                  |

---

## 7. Sequences (86 sequences)

### AGNEW (84 sequences)

Principais:

| Sequence                   | Uso estimado            |
| -------------------------- | ----------------------- |
| `SEQUENCIA_ABASTECIMENTOS` | Abastecimentos          |
| `SEQUENCIA_BAIXA_CHEQUE`   | Baixa de cheques        |
| `SEQUENCIA_BAIXA_PAGAR`    | Baixa de contas a pagar |
| `SEQUENCIA_CONTAS_PAGAR`   | Contas a pagar          |
| `SEQUENCIA_CONTABILIDADE`  | Contabilidade           |
| `SEQUENCIA_EMPRESA`        | Empresas                |
| `SEQUENCIA_FILIAL`         | Filiais                 |
| `SEQUENCIA_FOLHA`          | Folha de pagamento      |
| `SEQUENCIA_ORDEM_COMPRA`   | Ordens de compra        |
| `SEQUENCIA_OS_MANUT`       | OS de manutenção        |
| `SEQUENCIA_PEPS`           | PEPS (custos)           |
| `SEQUENCIA_PLANILHA`       | Planilhas               |
| `SEQUENCE_FLUXO_DIA`       | Fluxo de caixa diário   |
| _(+ 71 outras)_            | —                       |

### EXTRATOR (1 sequence)

- `UNI_SEQ` — sequence de uso geral

### UNISYSTEM (1 sequence)

- Sequence própria do sistema

---

## 8. Procedures e Functions do AGNEW (663 objetos)

### Procedures Principais (265 procedures)

| Categoria         | Exemplos                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **REINF/eSocial** | `PENVIAR4010`, `PENVIAR4020`, `PENVIAR4040`, `PENVIAR4080`, `PENVIAR4099`, `PENVIAR1070`, `PENVIAR2010`, `PENVIAR2050`, `PENVIAR2055`, `PENVIAR2098`, `PENVIAR2099`, `PATUALIZADADOSR1000`, `PATUALIZADADOSR1070`, `PATUALIZADADOSR2010`, `PATUALIZADADOSR2020`, `PATUALIZADADOSR2050`, `PATUALIZADADOSR2055`, `PATUALIZADADOSR2099`, `PATUALIZADADOSR4099`, `PATUALIZADADOSR9000`, `PCONSULTARREINF`, `PRETORNAESOCIAL`, `PENVIAESOCIAL` |
| **Custos**        | `PREPROCESSAVALORCUSTOPEPS`                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Processamento** | `PPROCESSAEMBARQUE` (EXTRATOR)                                                                                                                                                                                                                                                                                                                                                                                                            |

### Functions (390 functions)

Funções auxiliares para cálculos, conversões, validações e formatações utilizadas em views, procedures e triggers.

---

## 9. Integração com a Aplicação (Dashboard Power BI)

### 9.1 Tabelas/Views Consultadas pela API

O `DashboardService` (`apps/api/src/platform/dashboard/dashboard.service.ts`) consulta 4 fontes:

| Fonte                    | Schema   | Tipo   | Registros | KPIs gerados                             |
| ------------------------ | -------- | ------ | --------- | ---------------------------------------- |
| `EXT_COL_OS_PLANTIO`     | EXTRATOR | Tabela | 186       | Área plantada, talhões plantados         |
| `EXT_COL_OS_COLHEITA`    | EXTRATOR | Tabela | 12        | Área colhida, talhões colhidos           |
| `VW_CONS_CONTRATO_GRAOS` | AGNEW    | View   | 14        | Contratos ativos, quantidade contratada  |
| `INSTRUCAO_EMBARQUE`     | AGNEW    | Tabela | 12        | Embarques programados, fardos produzidos |

### 9.2 Fluxo de Dados

```
Oracle XE (XEPDB1)
  ├── EXTRATOR.EXT_COL_OS_PLANTIO ──┐
  ├── EXTRATOR.EXT_COL_OS_COLHEITA ─┤
  ├── AGNEW.VW_CONS_CONTRATO_GRAOS ─┤── SqlQueryService.executeView()
  └── AGNEW.INSTRUCAO_EMBARQUE ─────┘           │
                                                ↓
                                    DashboardService.loadDataset()
                                                │
                                                ↓
                                    12 KPIs calculados
                                    (com drilldown e histórico)
                                                │
                                                ↓
                                    DashboardController → GET /dashboard/*
                                                │
                                                ↓
                                    Frontend Next.js (gráficos)
```

### 9.3 Configuração de Conexão

| Parâmetro                 | Valor (dev)                 |
| ------------------------- | --------------------------- |
| `DATABASE_PROVIDER`       | `oracle`                    |
| `ORACLE_HOST`             | `oracle` (container Docker) |
| `ORACLE_PORT`             | `1521`                      |
| `ORACLE_SERVICE_NAME`     | `XEPDB1`                    |
| `ORACLE_USER`             | `system`                    |
| `ORACLE_PASSWORD`         | `oracle`                    |
| `ORACLE_POOL_MIN`         | `0`                         |
| `ORACLE_POOL_MAX`         | `5`                         |
| `ORACLE_POOL_INCREMENT`   | `1`                         |
| `ORACLE_QUEUE_TIMEOUT_MS` | `60000`                     |
| `ORACLE_STMT_CACHE_SIZE`  | `30`                        |

### 9.4 KPIs do Dashboard com Dados Reais

| KPI                     | Setor      | Valor atual | Valor anterior | Delta |
| ----------------------- | ---------- | ----------- | -------------- | ----- |
| Contratos da algodoeira | Algodoeira | 12          | 2              | +500% |
| Embarques programados   | Algodoeira | 12          | 2              | +500% |
| Produção de fardos      | Algodoeira | 0           | 0              | 0%    |
| Contratos comerciais    | Comercial  | 14          | 12.6           | +11%  |
| Quantidade entregue     | Comercial  | 14.462      | 13.016         | +11%  |
| Quantidade pendente     | Comercial  | 5.734       | 5.160          | +11%  |

---

## 10. Tabelas AGNEW — Lista Completa (2.648 tabelas)

> Lista abreviada das principais categorias. A lista completa tem 2.648 tabelas.

### Categorias identificadas por prefixo:

| Prefixo                       | Categoria                                     | Nº estimado |
| ----------------------------- | --------------------------------------------- | ----------- |
| `AMOSTRAS_*`                  | Análises de amostras (sementes, solo, pragas) | ~60         |
| `ABASTECIMENTO*`              | Abastecimento de máquinas/veículos            | ~5          |
| `ACERTO_*`                    | Acertos financeiros/comerciais                | ~10         |
| `ALCADAS_*`                   | Alçadas de aprovação                          | ~5          |
| `ADUBACAO*`                   | Adubação                                      | ~3          |
| `AGLOMERADOS`                 | Aglomerados de fazendas                       | 1           |
| `ALGODAO_*`                   | Algodão                                       | ~3          |
| `ALM_*`                       | Almoxarifado                                  | ~5          |
| `CAD_*`                       | Cadastros diversos                            | ~5          |
| `CONTAS_*`                    | Contas a pagar/receber                        | ~5          |
| `CTE*`                        | Conhecimento de transporte                    | ~5          |
| `EMPRESAS`/`FILIAIS`          | Cadastros empresariais                        | ~3          |
| `FAZENDAS`/`TALHOES`          | Cadastros rurais                              | ~5          |
| `FUNCIONARIOS`                | Recursos humanos                              | ~3          |
| `IMP_*`                       | Impostos                                      | ~10         |
| `INSTRUCAO_EMBARQUE*`         | Embarques                                     | ~5          |
| `LANCAMENTOS`                 | Lançamentos contábeis                         | ~3          |
| `MB_*`                        | Módulo de campo                               | ~10         |
| `MOEDAS*`                     | Moedas e índices                              | ~5          |
| `NF_*`                        | Notas fiscais                                 | ~10         |
| `ORCAMENTO*`                  | Orçamento                                     | ~5          |
| `PATRIMONIOS`                 | Patrimônio                                    | ~3          |
| `PEDIDO_*`                    | Pedidos de compra/venda                       | ~10         |
| `PRODUTOS`/`PRODUTO_*`        | Produtos e lotes                              | ~10         |
| `PROG_EMBARQUE*`              | Programação de embarques                      | ~5          |
| `SAFRA`/`CULTURA`/`VARIEDADE` | Cadastros agrícolas                           | ~5          |
| `VM_*`                        | Materialized views                            | 26          |
| `VW_*`                        | Views                                         | 391         |
| _(+ ~1.900 outras)_           | Diversos                                      | —           |

---

## 11. Docker — Configuração do Oracle XE

### docker-compose.dev.yml

```yaml
oracle:
  image: gvenzl/oracle-xe:21-full
  container_name: dashboard-power-bi-oracle-dev
  environment:
    ORACLE_PASSWORD: oracle
    APP_USER: extrator
    APP_USER_PASSWORD: oracle
  ports:
    - '1521:1521'
  volumes:
    - oracle_data:/opt/oracle/oradata
    - ../../exp_full_xecdb_20260612-1215.dmp:/opt/oracle/dump/exp_full_xecdb_20260612-1215.dmp:ro
    - ./oracle/import-dump.sh:/opt/oracle/scripts/extensions/import-dump.sh:ro
  healthcheck:
    test: ['CMD', 'healthcheck.sh']
    interval: 30s
    timeout: 10s
    retries: 10
    start_period: 120s
```

### Script de Importação

O script `infra/docker/oracle/import-dump.sh`:

1. Aguarda o Oracle ficar pronto
2. Cria um directory Oracle apontando para `/tmp`
3. Copia o dump para `/tmp` (pois o mount original é read-only)
4. Executa `impdp` (Data Pump import) com `TABLE_EXISTS_ACTION=REPLACE`
5. Marca um flag para não re-importar em reinícios

### Comandos úteis

```bash
# Conectar no Oracle via sqlplus
docker exec -it dashboard-power-bi-oracle-dev sqlplus system/oracle@XEPDB1

# Verificar saúde
curl http://localhost:3001/health/sql

# Logs do Oracle
docker logs dashboard-power-bi-oracle-dev 2>&1 | tail -20

# Re-importar o dump (remove flag primeiro)
docker exec dashboard-power-bi-oracle-dev rm -f /opt/oracle/oradata/.dump_imported
docker exec dashboard-power-bi-oracle-dev bash /opt/oracle/scripts/extensions/import-dump.sh
```

---

## 12. Observações e Limitações

1. **Dump é de produção** — os dados são reais do ERP AGNEW/EXTRATOR
2. **980 erros de importação** — quase todos são warnings de compilação de procedures/triggers (normal em import cross-version)
3. **Oracle XE 21c** — versão gratuita, limitada a 2GB de RAM e 12GB de dados
4. **NOARCHIVELOG** — sem archive log ativo (aceitável para dev)
5. **Character set AL32UTF8** — UTF-8 completo, compatível com a aplicação
6. **Procedures com warnings** — procedures de REINF/eSocial podem não compilar completamente devido a dependências de pacotes Oracle não presentes no XE
7. **Materialized views** — algumas podem não ter sido atualizadas após import (refresh groups com erro de data)
8. **Conexão via `system`** — em produção, recomenda-se usar um usuário com privilégios limitados
