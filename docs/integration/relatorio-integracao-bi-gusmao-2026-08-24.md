# Relatório de integração e pendências do Dashboard BI Grupo Franciosi

**Data da análise:** 24/08/2026  
**Repositório analisado:** [DB-Tecnologia/Dashboard_PowerBI_Gusmao](https://github.com/DB-Tecnologia/Dashboard_PowerBI_Gusmao)  
**Commit de referência analisado:** `e3ca4e3`  
**Escopo:** comparar o que já está implementado no repositório com o BI de produção analisado, as solicitações do cliente e os KPIs de grãos e algodão.

> Este documento é uma análise estática do código, da documentação e dos testes do repositório. Não representa uma nova sincronização com o ambiente de produção, Oracle 19c ou COMPASS ERP. Nenhuma credencial ou dado de autenticação é reproduzido aqui.

> **Atualização de validação em 25/08/2026:** a configuração do Playwright foi validada no ambiente demo. A Web respondeu na porta `3000`, a API na porta `3001` e os 7 cenários E2E existentes passaram. A expansão de cobertura continua planejada em P1-03.

> **Atualização P0-03 em 25/08/2026:** `infra/env/.env.production.example` foi completado com o contrato geral e os parâmetros de Oracle 19c/COMPASS, sem credenciais reais. `pnpm verify:env` valida a cobertura e os defaults seguros. A validação da chave TOTP no boot permanece em P0-04.

## 1. Conclusão executiva

O repositório entrega uma base funcional avançada para uma plataforma de BI: autenticação, permissões, dashboards configuráveis, relatórios, exportações, administração, API NestJS, frontend Next.js, Docker, integração com Supabase e adaptadores para SQL Server e Oracle.

Entretanto, ele ainda não está integrado de ponta a ponta ao escopo operacional do BI Grupo Franciosi. A implementação existente possui um conjunto genérico de KPIs de plantio, colheita e comercialização e uma camada Oracle inicial, mas não reproduz os indicadores que foram validados no sistema real para:

- visão consolidada do grupo;
- produção completa de grãos e soja;
- produção de algodão, rolos e produtividade em arrobas;
- algodoeira, pátio, gin, caroço, pluma, rendimento e HVI;
- armazenamento e estoques;
- qualidade por cultura e talhão;
- custos, receita, margem e projeções da safra 25/26;
- rastreabilidade de valores reais, estimados, parciais e históricos.

O ponto mais crítico é o comportamento de fallback em `DashboardService.loadDataset()`: se as consultas Oracle falharem ou retornarem vazio, o serviço pode retornar um dataset sintético. Isso é aceitável para demonstração e testes, mas não pode permanecer silencioso em produção. A aplicação deve informar que a fonte está indisponível ou que o dado está desatualizado, nunca apresentar uma simulação como se fosse o resultado operacional.

### Decisão recomendada

O próximo ciclo deve priorizar a integração e a confiabilidade da camada de dados antes da ampliação de telas. A sequência recomendada é:

`Oracle 19c / COMPASS ERP → atualização controlada → modelo analítico → API de KPIs → filtros e metadados → dashboard web → validação contra o BI atual`

O repositório pode ser aproveitado como plataforma de apresentação, autenticação e governança. O que falta é transformar a integração Oracle atual em um domínio agrícola completo, auditável e operacionalmente seguro.

## 2. Base utilizada na análise

Foram cruzadas quatro fontes de evidência:

1. código do repositório, principalmente `apps/api`, `apps/web`, `infra` e `supabase`;
2. documentação do próprio projeto, incluindo `README.md`, `docs/audits/AUDITORIA_PROJETO.md`, `docs/audits/MATRIZ_REQUISITOS.md`, `docs/architecture/ARQUITETURA.md`, `docs/integration/DB_ORACLE.md`, `docs/architecture/BANCO_DADOS.md` e `docs/product/KPIS.md`;
3. última análise do BI Grupo Franciosi, registrada em `docs/product/bi-grupo-franciosi-mapeamento.md` e `docs/product/kpis-producao-graos-algodao-2026-08-24.md`;
4. solicitações do cliente, organizadas em `docs/product/solicitacoes-cliente-gusmao-2026-08-24.md`.

### Estado verificado no repositório

| Verificação                       |              Resultado | Interpretação                                                                                          |
| --------------------------------- | ---------------------: | ------------------------------------------------------------------------------------------------------ |
| Instalação com lockfile congelado |                 Passou | Dependências reproduzíveis no ambiente analisado                                                       |
| Verificação de workspace          |                 Passou | Estrutura do monorepo válida                                                                           |
| Verificação de documentação       |                 Passou | Validadores básicos da documentação passaram                                                           |
| Verificação de Docker             |                 Passou | Compose de desenvolvimento validado                                                                    |
| TypeScript                        |                 Passou | API e web sem erro de typecheck                                                                        |
| Testes API                        | 47 suítes / 304 testes | Passaram                                                                                               |
| Testes web                        | 43 suítes / 142 testes | Passaram                                                                                               |
| Build                             |                 Passou | API NestJS e web Next.js foram compilados                                                              |
| Lint                              |                 Falhou | 633 erros e 23 avisos na execução atual; parte dos erros também atingiu artefatos compilados em `dist` |
| Formatação                        |                 Falhou | 417 arquivos fora do padrão Prettier                                                                   |
| E2E Playwright                    |   Validado no baseline | 7 cenários passaram contra a Web em `3000`; a expansão de cobertura permanece pendente                 |

Os testes e o build demonstram que a base técnica compila e possui cobertura unitária relevante. Eles não comprovam conexão com o Oracle produtivo, qualidade dos dados, reconciliação com o BI atual ou prontidão operacional.

## 3. O que já está pronto

### 3.1 Plataforma web e API

Está implementado:

- monorepo com `apps/api` e `apps/web`;
- API NestJS 10 com TypeScript estrito;
- frontend Next.js 14;
- autenticação, JWT, recuperação de senha, 2FA, grupos, permissões e setores;
- páginas de login, perfil, dashboards, relatórios, exportações, notificações e administração;
- componentes de cards de KPI, tabelas, gráficos, widgets redimensionáveis e dashboards configuráveis;
- drilldown inicial de KPI;
- validação de parâmetros e consultas parametrizadas;
- healthchecks da API e do provedor de dados;
- Docker Compose para desenvolvimento e produção;
- Nginx como reverse proxy;
- pipeline de CI com instalação, qualidade, testes e testes E2E da API.

A auditoria interna do repositório classifica o projeto como funcional avançado, com aproximadamente 84% do escopo total e 90% do MVP documentado. Esses percentuais descrevem o escopo genérico da plataforma, não a cobertura dos KPIs agrícolas específicos do Grupo Franciosi.

### 3.2 Persistência e governança da plataforma

O desenho atual separa corretamente dois tipos de informação:

- **Supabase:** usuários, grupos, permissões, auditoria, configurações, dashboards, exportações, notificações, definições de relatórios e favoritos;
- **banco externo:** relatórios e indicadores operacionais.

Há repositórios, migrations, controle de permissões e registros de auditoria. Em alguns fluxos, quando o Supabase não está configurado, existem fallbacks em memória. Isso deve ser permitido somente em desenvolvimento ou demonstração; em produção, a persistência da plataforma deve ser obrigatória.

### 3.3 Integração Oracle já existente

O repositório já possui uma primeira camada Oracle:

- `OracleService` utiliza pool de conexões lazy e `oracledb`;
- configuração por host, porta, service name, usuário e senha em variáveis de ambiente;
- execução de SQL com bind parameters;
- `SELECT 1 FROM dual` para healthcheck;
- fechamento do pool no encerramento da aplicação;
- seleção de provedor por `DATABASE_PROVIDER=oracle` ou SQL Server;
- validação de nomes de views, colunas e filtros na camada de consultas.

Essa base é reutilizável, mas a existência do adaptador não significa que o ambiente de produção esteja conectado. O dump Oracle documentado no repositório é uma referência de desenvolvimento e não comprova acesso ao Oracle 19c produtivo do COMPASS ERP.

### 3.4 Fontes Oracle atualmente consumidas pelo dashboard

Em `apps/api/src/platform/dashboard/dashboard.service.ts`, o dataset Oracle inicial consulta quatro fontes:

| Fonte                          | Uso atual no repositório                              | Cobertura para o projeto |
| ------------------------------ | ----------------------------------------------------- | ------------------------ |
| `EXTRATOR.EXT_COL_OS_PLANTIO`  | operações, áreas, talhões, cultura e data de plantio  | Parcial                  |
| `EXTRATOR.EXT_COL_OS_COLHEITA` | operações, áreas, talhões, cultura e data de colheita | Parcial                  |
| `AGNEW.VW_CONS_CONTRATO_GRAOS` | contratos, quantidades, entregas, saldo e status      | Parcial                  |
| `AGNEW.INSTRUCAO_EMBARQUE`     | instruções, quantidade, fardos e situação de embarque | Parcial                  |

A documentação Oracle também identifica objetos como `UNI_ATUALIZADOR`, `UNI_ATUALIZADOR_SQL` e `UNI_DASHBOARD_HORARIO`, que podem apoiar a atualização, mas ainda não estão configurados no repositório como um fluxo de ingestão agrícola completo.

### 3.5 KPIs que já existem no código

O serviço de dashboard contém KPIs genéricos hardcoded, entre eles:

- área plantada;
- operações de plantio;
- área colhida;
- variedades plantadas;
- talhões monitorados;
- contratos comerciais;
- quantidade entregue;
- quantidade pendente;
- quantidade devolvida;
- contratos da algodoeira.

Isso cobre uma primeira visão de produção e comercial. Os KPIs são calculados em um serviço central, mas ainda precisam ser convertidos em definições versionadas, com fórmula, unidade, fonte, safra, data de corte e confiabilidade.

## 4. Comparação com o BI operacional analisado

### 4.1 Cobertura por área

| Área do BI real                | O que foi encontrado no repositório                               | Situação                                                           |
| ------------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------------ |
| Visão Grupo `/`                | Home genérica com KPIs e gráficos                                 | Cobertura visual parcial; faltam os KPIs consolidados reais        |
| Colheita `/colheita`           | Área colhida e operações genéricas                                | Parcial; falta avanço, volume e reconciliação por cultura          |
| Grãos `/graos`                 | Plantio/colheita e contratos de grãos                             | Parcial; faltam produtividade, qualidade e volume real por cultura |
| Algodão `/algodao`             | Não há modelo completo de rolos e arrobas                         | Pendente                                                           |
| Algodoeira `/algodoeira`       | Apenas referência genérica a contratos da algodoeira              | Pendente; falta pátio, gin, caroço, pluma, rendimento e HVI        |
| Romaneios `/romaneios`         | Não há integração específica de pesagens/romaneios                | Pendente                                                           |
| Armazenamento `/armazenamento` | Não há modelo de estoque por produto e unidade                    | Pendente                                                           |
| Comercial `/comercial`         | Contratos, entregas, pendências, devoluções e embarques genéricos | Parcial                                                            |
| Embarques                      | `INSTRUCAO_EMBARQUE` e dados de contrato                          | Parcial; falta a visão operacional completa                        |
| Resultados/Custo               | Não há modelo agrícola de custo, receita, margem e projeção       | Pendente                                                           |

### 4.2 KPIs do retrato de produção que ainda não estão cobertos

Os valores abaixo são a linha de base observada no BI real em 24/08/2026. Eles servem para reconciliação, não devem ser gravados como valores atuais no código.

| Domínio         | Linha de base do BI real                                                      | Cobertura no repositório                                     |
| --------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Grupo           | 13.142/17.916 ha colhidos, 73%, 76.852 t                                      | Não coberto como modelo consolidado                          |
| Grãos           | 8.569/9.824 ha, 87%, 52.448 t                                                 | Área/colheita genéricas; volume e avanço completos pendentes |
| Algodão         | 4.500/8.019 ha, 56,1%, 9.540 rolos, 362 @/ha                                  | Pendente                                                     |
| Algodoeira      | 3.238 rolos, 8.306 t de caroço, 3.389 t de pluma, rendimento parcial de 40,8% | Pendente                                                     |
| Estoque         | 49.936 t de grãos e 2.524,2 t de pluma                                        | Pendente                                                     |
| Comercialização | 86.095 t disponíveis, 31.170 t vendidas, 36,2% comercializado                 | Contratos/embarques parciais                                 |
| Qualidade       | umidade, impureza e avariados por cultura                                     | Pendente                                                     |
| Financeiro      | receita, custo, margem, histórico e projeção da safra 25/26                   | Pendente                                                     |

### 4.3 Conflitos de contexto que precisam ser resolvidos

Há uma divergência documental e de arquitetura que precisa ser fechada antes da implantação:

- a solicitação do cliente aponta COMPASS ERP, fornecedor Unisystem e Oracle 19c;
- a documentação principal do repositório descreve SQL Server externo como fonte de relatórios, com Oracle como alternativa;
- o código possui Oracle implementado, mas o fluxo de dashboard ainda é limitado a quatro fontes;
- o BI analisado apresentou painéis com data de 24/08/2026 e outros indicando 19/09/2026.

Até a confirmação do ambiente de origem, o projeto deve tratar o Oracle 19c como fonte-alvo do escopo do cliente, mantendo o SQL Server apenas como compatibilidade legada ou alternativa explicitamente documentada.

## 5. O que falta fazer

### 5.1 Prioridade P0 — bloqueadores da integração produtiva

| Item                     | Falta atual                                                                         | Risco                                                           | Entrega necessária                                                                       |
| ------------------------ | ----------------------------------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Fonte oficial            | O repositório não prova conexão ao Oracle 19c produtivo                             | Dashboard pode operar com dados de demonstração ou fonte errada | Validar rede, service name, usuário read-only e smoke queries no ambiente produtivo      |
| Fallback silencioso      | Dataset sintético pode ser retornado quando a consulta Oracle falha ou vem vazia    | Usuário pode tomar decisão com dado falso                       | Desativar fallback sintético em produção; exibir indisponível, último sucesso e motivo   |
| Modelo agrícola          | Quatro fontes são insuficientes para o conjunto de abas e KPIs reais                | Não há paridade com o BI atual                                  | Mapear tabelas/views de produção, romaneios, qualidade, algodoeira, estoque e financeiro |
| KPIs de grãos e algodão  | Não existem as fórmulas completas de volume, produtividade, rolos, @/ha e qualidade | Entrega não atende ao pedido principal do cliente               | Implementar contratos de KPI versionados e reconciliados                                 |
| Segurança de produção    | Nginx produtivo não apresenta TLS configurado na evidência analisada                | Risco de exposição de autenticação e dados                      | Configurar HTTPS, certificados, redirecionamento, headers e renovação                    |
| Configuração de produção | `.env.production.example` completo, sem credenciais e com Oracle como padrão        | Ainda depende de preencher segredos e validar TOTP no boot      | Executar P0-04, fornecer infraestrutura e validar conexão Oracle read-only               |
| Persistência             | Há fallbacks em memória em partes da plataforma                                     | Perda de estado em reinício ou múltiplas instâncias             | Tornar Supabase obrigatório em produção e falhar cedo quando ausente                     |
| Backup e rollback        | Estratégia de backup e rollback não está fechada                                    | Recuperação incerta em incidente                                | Definir backups, retenção, restauração testada e procedimento de rollback                |

### 5.2 Prioridade P1 — integração funcional e operação diária

- criar o catálogo de dimensões: empresa, filial, fazenda, unidade operacional, safra, cultura, variedade, talhão e período;
- definir a regra do filtro “empresa” solicitada pelo cliente e propagar o filtro em todas as queries;
- criar a camada de staging/normalização para não acoplar a interface diretamente ao desenho do ERP;
- implementar atualização agendada com controle de execução, watermark, contagem de registros e última sincronização;
- impedir duplicidade em reprocessamentos e permitir reexecução segura da mesma janela;
- expor `dataAsOf`, `lastSyncedAt`, origem, status e versão da definição em cada resposta;
- suportar os estados `real`, `estimado`, `parcial` e `histórico`;
- registrar o peso médio estimado para rolos ainda não pesados;
- registrar que a pluma por talhão é rateada e que o HVI não está plenamente vinculado ao talhão;
- modelar a divergência de datas e impedir que painéis de cortes diferentes sejam somados sem aviso;
- criar reconciliação automática entre origem, camada analítica e telas;
- separar a camada de dashboard da persistência de plataforma;
- definir observabilidade com logs estruturados, métricas, alertas e rastreamento dos jobs;
- ampliar a cobertura do Playwright para exportação, CRUD administrativo e 2FA após a validação do baseline;
- incluir `pnpm build` e os cenários web reais no pipeline de CI;
- corrigir lint e formatação para que `pnpm quality` seja uma validação confiável.

### 5.3 Prioridade P2 — evolução posterior

Depois da paridade operacional, podem ser priorizados:

- armazenamento de arquivos de exportação em S3 ou serviço equivalente;
- geração de imagem/PDF do dashboard;
- compartilhamento controlado de dashboards;
- alertas operacionais em tempo real;
- módulos climáticos, pluviometria, crédito, logística e outros KPIs do catálogo genérico;
- comparação histórica entre safras;
- previsões e cenários de receita, custo e margem;
- pacote de relatórios executivos para diretoria.

## 6. Arquitetura de integração recomendada

### 6.1 Fluxo alvo

```text
COMPASS ERP / Oracle 19c
        │  conta read-only, rede privada/VPN
        ▼
Conector Oracle + consultas versionadas
        │
        ▼
Staging de integração + ledger de atualizações
        │  normalização, deduplicação, unidade e qualidade
        ▼
Modelo analítico agrícola
        │
        ├── produção de grãos e soja
        ├── produção de algodão
        ├── romaneios, balança e qualidade
        ├── algodoeira, HVI, caroço e pluma
        ├── armazenamento e estoque
        └── comercial, contratos e embarques
        ▼
Serviço de KPIs NestJS
        │  fórmula, status, data de corte e fonte
        ▼
API autenticada
        │
        ▼
Frontend Next.js e abas do BI
```

O Supabase deve continuar armazenando os dados da plataforma — usuários, permissões, favoritos, dashboards e auditoria — e não deve substituir o Oracle como fonte dos fatos agrícolas. Redis pode apoiar filas e cache, mas não deve ser a fonte oficial dos indicadores.

### 6.2 Camadas e responsabilidades

#### Camada de origem

Usar Oracle 19c do COMPASS ERP como fonte de leitura. A conta deve ter somente permissões necessárias para as views/tabelas aprovadas. O projeto precisa confirmar com a Unisystem:

- objetos oficiais para cada indicador;
- significado das colunas e chaves;
- unidade de medida;
- timestamp de atualização;
- regras de cancelamento, devolução, rateio e reprocessamento;
- diferença entre peso registrado e peso estimado;
- relacionamento entre rolo, fardo, talhão, lote e resultado de HVI.

#### Camada de staging

Criar uma área de integração com:

- `sync_run` ou equivalente, contendo início, fim, status, origem, watermark, erro e contagens;
- tabelas de staging por domínio;
- chave natural da origem e hash da linha para detectar alteração;
- data de carga e data do evento de origem;
- versão da regra de transformação;
- flags de estimativa, parcialidade e histórico.

Essa camada permite reprocessar uma janela sem duplicar fatos e facilita a comparação entre o ERP e o dashboard.

#### Modelo analítico

O mínimo recomendado é um modelo por fatos e dimensões:

- `dim_empresa`, `dim_filial`, `dim_fazenda`, `dim_unidade`, `dim_safra`, `dim_cultura`, `dim_variedade`, `dim_talhao`;
- fato de plantio;
- fato de colheita;
- fato de romaneio/pesagem;
- fato de qualidade;
- fato de algodoeira/beneficiamento;
- fato de estoque;
- fato de contrato e embarque;
- fato financeiro agrícola.

O BI pode consultar views analíticas estáveis, em vez de depender de múltiplas tabelas do ERP diretamente no frontend.

#### Serviço de KPI

Cada KPI deve possuir uma definição versionada com:

| Campo               | Exemplo de conteúdo                       |
| ------------------- | ----------------------------------------- |
| `kpiId`             | `producao.graos.produtividade`            |
| `nome`              | Produtividade de grãos                    |
| `formula`           | toneladas colhidas / hectares colhidos    |
| `unidade`           | t/ha ou sc/ha                             |
| `fonte`             | view analítica e campos de origem         |
| `filtros`           | empresa, fazenda, safra, cultura, período |
| `dataAsOf`          | data de corte dos fatos                   |
| `status`            | real, estimado, parcial ou histórico      |
| `definitionVersion` | versão da fórmula                         |
| `reconciledAt`      | data da última validação contra a origem  |

A fórmula não deve ficar apenas embutida em um serviço monolítico sem documentação. Alterações de regra precisam ser rastreáveis.

#### API

As rotas atuais podem ser evoluídas, mas a separação por domínio facilita contrato, testes e manutenção. Uma proposta de rotas é:

```text
GET  /api/v1/bi/filters
GET  /api/v1/bi/metadata/freshness
GET  /api/v1/bi/production/summary
GET  /api/v1/bi/production/grains
GET  /api/v1/bi/production/cotton
GET  /api/v1/bi/cotton-gin
GET  /api/v1/bi/storage
GET  /api/v1/bi/commercial
GET  /api/v1/bi/results
POST /api/v1/bi/refresh
GET  /api/v1/bi/refresh/:runId
```

O `POST /refresh` deve ser restrito a administradores ou a um job interno. A resposta de cada domínio deve trazer o valor, a unidade, a data de corte, a fonte, o status de confiabilidade e eventuais avisos.

Exemplo de contrato conceitual:

```json
{
  "kpiId": "producao.algodao.avanco",
  "value": 56.1,
  "unit": "%",
  "dataAsOf": "2026-08-24",
  "lastSyncedAt": "2026-08-24T08:30:00-03:00",
  "source": "Oracle/COMPASS",
  "status": "real",
  "definitionVersion": "1.0.0",
  "warnings": []
}
```

#### Frontend

As telas atuais de dashboard, cards, tabelas e gráficos podem ser reutilizadas. Para atender ao BI real, será necessário:

- criar as abas e rotas equivalentes às analisadas;
- incluir filtros globais e mostrar o escopo selecionado;
- exibir data de corte e última sincronização;
- diferenciar visualmente dado real, estimado, parcial e histórico;
- informar quando a fonte estiver indisponível ou atrasada;
- impedir mistura silenciosa de painéis com datas de corte diferentes;
- manter drilldown até empresa, fazenda, talhão, lote, romaneio e fardo quando a origem permitir.

### 6.3 Atualização e idempotência

O job de atualização deve:

1. iniciar um registro de execução;
2. testar conectividade e versão do esquema;
3. ler somente a janela necessária, usando watermark de origem;
4. carregar staging;
5. validar contagens, unidades e chaves;
6. aplicar deduplicação e upsert;
7. publicar a nova versão analítica;
8. recalcular ou invalidar o cache;
9. registrar sucesso, duração, contagens e avisos;
10. disponibilizar o resultado no endpoint de status.

O mesmo job executado duas vezes para a mesma origem, safra e janela deve produzir o mesmo resultado final. Falhas de leitura devem deixar o último snapshot válido disponível, marcado como desatualizado, e não substituir o snapshot por dados sintéticos.

### 6.4 Segurança, rede e segredos

Antes da produção, é necessário validar:

- acesso read-only ao Oracle 19c;
- rede, VPN, firewall e whitelist do servidor da API;
- TLS entre navegador, Nginx e serviços;
- armazenamento de segredos fora do código e fora dos commits;
- chave obrigatória para criptografia dos segredos de 2FA;
- contas de serviço separadas por ambiente;
- auditoria de consultas administrativas e jobs de atualização;
- limites de timeout, tamanho de resposta e concorrência;
- política para logs sem dados sensíveis.

O arquivo de exemplo de ambiente deve conter nomes de variáveis e valores ilustrativos não funcionais, mas nunca credenciais reais.

### 6.5 Observabilidade e operação

Monitorar pelo menos:

- disponibilidade e latência do Oracle;
- tempo de obtenção de cada fonte;
- sucesso/falha dos jobs de atualização;
- idade do dado por domínio;
- quantidade de linhas lidas, inseridas, alteradas e rejeitadas;
- diferenças de reconciliação entre origem e camada analítica;
- p95 da API por rota de KPI;
- acertos e expiração do cache;
- falhas de fila e reprocessamentos;
- erro de autorização e tentativas anormais;
- uso de CPU, memória, pool Oracle e conexões.

Alertas mínimos: Oracle indisponível, atualização atrasada, queda anormal de volume, divergência de unidade, erro de schema, falha consecutiva de job e aumento de erro 5xx.

## 7. Mapeamento de fontes e pendências de dados

| Domínio     | Fonte a validar                                                   | Dados necessários                                                  | Estado                                              |
| ----------- | ----------------------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------- |
| Plantio     | `EXT_COL_OS_PLANTIO` e objetos relacionados                       | safra, empresa, fazenda, talhão, cultura, área, data e variedade   | Inicialmente conectado                              |
| Colheita    | `EXT_COL_OS_COLHEITA` e objetos relacionados                      | área, volume, data, cultura, talhão e operação                     | Inicialmente conectado                              |
| Romaneios   | balança e romaneios do COMPASS                                    | peso bruto/líquido, umidade, impureza, avariados, origem e destino | Não integrado no dashboard do repositório           |
| Algodão     | tabelas/views de produção e colheita                              | rolos, peso, @/ha, área, saldo, estimativa e pesagens              | Pendente                                            |
| Algodoeira  | pátio, gin, beneficiamento e fardos                               | rolos, caroço, pluma, rendimento, fardinhos/hora e status          | Pendente                                            |
| HVI         | resultados de laboratório                                         | lote/fardo, talhão quando possível, fibra, qualidade e data        | Pendente; vínculo talhão incompleto no BI atual     |
| Estoque     | saldos por unidade/produto                                        | grãos, pluma, localização, disponibilidade e data                  | Pendente                                            |
| Comercial   | `VW_CONS_CONTRATO_GRAOS`, instruções e demais objetos             | vendido, disponível, a vender, contrato, embarque e cliente        | Parcial                                             |
| Financeiro  | custos, receitas e resultados da safra                            | custo/ha, preço, receita, margem e projeção                        | Pendente                                            |
| Atualização | `UNI_ATUALIZADOR`, `UNI_ATUALIZADOR_SQL`, `UNI_DASHBOARD_HORARIO` | horário, status, origem e última carga                             | Identificado na documentação; job ainda não fechado |

## 8. Plano de execução recomendado

### Fase 0 — decisão e segurança

1. Confirmar Oracle 19c como fonte oficial do escopo do cliente.
2. Confirmar com a Unisystem o dicionário de dados e as views oficiais.
3. Criar conta read-only, acesso de rede e smoke test.
4. Definir o contrato dos KPIs prioritários.
5. Corrigir TLS, variáveis obrigatórias, chave de 2FA, backups e rollback.
6. Desligar fallback sintético em produção.
7. Corrigir Playwright, lint, formatação e pipeline de build.

**Critério de saída:** a API conecta no Oracle correto, falha de origem é visível e a configuração produtiva é reproduzível.

### Fase 1 — dados e atualização

1. Mapear objetos, chaves, unidades e timestamps.
2. Criar staging e ledger de sincronização.
3. Implementar fatos de plantio, colheita, romaneio, qualidade, algodão, algodoeira, estoque e comercial.
4. Implementar filtros de empresa, unidade, fazenda, safra e cultura.
5. Criar jobs incrementais e reprocessamento idempotente.
6. Registrar a qualidade e a origem de cada métrica.

**Critério de saída:** cada domínio tem carga repetível, contagens verificáveis e snapshot identificável.

### Fase 2 — KPIs e telas

1. Implementar visão Grupo, Colheita, Grãos, Algodão e Algodoeira.
2. Implementar Romaneios, Armazenamento, Comercial e Embarques.
3. Implementar Resultado/Custo após validação das regras financeiras.
4. Expor status real/estimado/parcial/histórico.
5. Adicionar drilldown de acordo com o que a origem realmente rastreia.
6. Reconciliar as telas com o BI atual.

**Critério de saída:** os KPIs prioritários batem com a linha de base aceita pelo cliente, respeitando a mesma data de corte e unidade.

### Fase 3 — homologação e operação

1. Executar testes de carga, erro de rede, timeout, retry e reprocessamento.
2. Validar segurança, logs, alertas e permissões por setor.
3. Fazer UAT com produção, algodoeira, comercial e diretoria.
4. Documentar runbook de atualização, incidente, rollback e reconciliação.
5. Liberar primeiro em ambiente controlado e acompanhar os primeiros ciclos de carga.

### Fase 4 — evolução opcional

Adicionar previsões, margem projetada, cenários de venda, alertas em tempo real, exportações avançadas, compartilhamento e demais módulos fora do primeiro corte operacional.

## 9. Critérios de aceite da integração

O trabalho deve ser considerado integrado somente quando todos os itens abaixo forem comprovados:

- Oracle 19c produtivo acessível por conta read-only a partir do ambiente da API;
- smoke queries e consultas de cada domínio executadas sem erro;
- nenhum fallback sintético acionado em produção;
- linha de base do BI de 24/08/2026 reproduzida com mesma data, unidade e filtros;
- visão Grupo, Grãos, Algodão, Algodoeira, Estoque e Comercial conciliadas;
- valores de algodão com peso estimado claramente identificados;
- rateio de pluma por talhão identificado e HVI sem vínculo não inventado;
- filtros por empresa, unidade, fazenda, safra e cultura funcionando de ponta a ponta;
- data de corte e última sincronização exibidas em todas as abas;
- divergência entre 24/08/2026 e 19/09/2026 tratada como aviso e não misturada automaticamente;
- execução repetida do mesmo job sem duplicidade;
- falha de origem visível, com último snapshot e alerta;
- logs estruturados, métricas e alertas operacionais ativos;
- backups, restauração e rollback testados;
- testes de contrato, integração, erro, retry, duplicidade e E2E aprovados;
- `pnpm quality`, `pnpm typecheck`, `pnpm test`, `pnpm build` e E2E aprovados no CI.

## 10. Riscos e decisões em aberto

| Risco/decisão                               | Impacto                                   | Responsável pela confirmação        |
| ------------------------------------------- | ----------------------------------------- | ----------------------------------- |
| Oracle 19c ou SQL Server como fonte oficial | Pode invalidar o desenho de conexão       | Cliente, Unisystem e equipe técnica |
| Views oficiais do COMPASS                   | Sem elas, o mapeamento fica frágil        | Unisystem                           |
| Regra do filtro por empresa                 | Pode alterar todos os números exibidos    | Cliente                             |
| Frequência de atualização                   | Define frescor e custo operacional        | Cliente e equipe técnica            |
| Peso médio de rolos não pesados             | Afeta produção e produtividade do algodão | Operação/algodoeira                 |
| Rateio da pluma por talhão                  | Afeta rastreabilidade e margem por talhão | Operação e qualidade                |
| Vinculação HVI–talhão                       | Limita análise de qualidade agrícola      | Algodoeira/laboratório              |
| Data de corte dos painéis                   | Pode gerar somas incompatíveis            | Dono do produto                     |
| Acesso de rede ao banco                     | Bloqueia homologação                      | Infraestrutura/cliente              |
| Backup e rollback                           | Define recuperação em incidente           | Infraestrutura                      |

## 11. Referências internas

- `docs/product/bi-grupo-franciosi-mapeamento.md` — estrutura e rotas do BI analisado.
- `docs/product/kpis-producao-graos-algodao-2026-08-24.md` — linha de base dos KPIs, limitações e confiabilidade.
- `docs/product/solicitacoes-cliente-gusmao-2026-08-24.md` — solicitações funcionais e técnicas do cliente.
- Repositório: [Dashboard_PowerBI_Gusmao](https://github.com/DB-Tecnologia/Dashboard_PowerBI_Gusmao).
- No repositório: `apps/api/src/platform/dashboard/dashboard.service.ts`, `apps/api/src/sql-server/oracle.service.ts`, `apps/api/src/sql-server/database-provider.service.ts`, `docs/integration/DB_ORACLE.md`, `docs/product/KPIS.md`, `docs/architecture/ARQUITETURA.md`, `docs/architecture/BANCO_DADOS.md`, `docs/audits/AUDITORIA_PROJETO.md`, `infra/docker/nginx/default.conf`, `infra/docker/docker-compose.prod.yml`, `.github/workflows/ci.yml` e `playwright.config.ts`.

## Síntese final

O projeto já tem uma plataforma capaz de receber a entrega e uma integração Oracle inicial. O trabalho restante não é apenas criar novas telas: é construir a camada de dados agrícola que conecte o COMPASS ERP aos KPIs reais, preserve o contexto de data e unidade, exponha as incertezas das estimativas e permita reconciliação. A prioridade é eliminar o risco de dado sintético ou desatualizado parecer real e, em seguida, completar os domínios de grãos, algodão, algodoeira, estoque, comercial e resultado.
