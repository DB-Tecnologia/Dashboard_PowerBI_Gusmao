# Solicitações do Cliente — Projeto Gusmão

**Fonte:** `Conversa do WhatsApp com Projeto gusmao 010239 dashboard.txt`  
**Cliente identificado na conversa:** Anderson Gusmão  
**Última confirmação de escopo:** 24/08/2026  
**Base de análise:** [mapeamento do sistema BI](mapeamento_sistema_bi_grupo_franciosi.md) e [relatório de KPIs](relatorio_kpis_producao_graos_algodao.md)

> Este documento organiza as solicitações e decisões registradas na conversa. Não interpreta as ocorrências marcadas como `<Mídia oculta>` e não reproduz credenciais, links privados ou dados de acesso.

## 1. Conclusão principal do escopo

Em 24/08/2026, o cliente confirmou que o objetivo era consultar o sistema real para selecionar os KPIs que devem ser levados ao painel de BI. Quando perguntado sobre a aba prioritária, respondeu:

- **Produção**.
- **Grãos e algodão**.

Esse escopo está coberto principalmente pelas seguintes rotas já analisadas:

```text
Visão Grupo → Colheita → Grãos / Algodão → Algodoeira
                         ↓
                Romaneios / Armazenamento / Comercial
```

Rotas prioritárias:

- `/`
- `/colheita`
- `/graos`
- `/algodao`
- `/algodoeira`
- `/romaneios`
- `/armazenamento`
- `/comercial`

## 2. Solicitações funcionais do cliente

| Solicitação                             | Evidência na conversa                                                                                                                        | Interpretação objetiva                                                                                                        | Abas/KPIs relacionados                                | Status na análise                                         |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------- |
| Selecionar os KPIs no sistema real      | “isso mesmo”, em resposta à proposta de consultar o sistema para escolher os KPIs; 24/08, linhas 239–240                                     | A equipe deve usar o BI existente como fonte para definir os indicadores                                                      | Todas as abas produtivas; relatório de KPIs           | **Recomendação pronta; validação formal pendente**        |
| Priorizar produção                      | “produção”; 24/08, linha 242                                                                                                                 | A primeira entrega deve atender acompanhamento operacional da safra                                                           | `/`, `/colheita`, `/graos`, `/algodao`, `/algodoeira` | **Coberto**                                               |
| Acompanhar grãos                        | “graos”; 24/08, linha 243                                                                                                                    | Incluir avanço, volume, produtividade, qualidade e talhões de grãos                                                           | `/graos`, `/romaneios`                                | **Coberto**                                               |
| Acompanhar algodão                      | “algodao”; 24/08, linha 243                                                                                                                  | Incluir campo, rolos, @/ha, saldo a colher e estimativas                                                                      | `/algodao`, `/algodoeira`                             | **Coberto com dados parciais**                            |
| Apoiar filtros por empresa              | “para ajuda na estrutura dos filtros relacionados a empresa”; 26/05, linha 130, acompanhado de mídias                                        | Criar ou validar uma dimensão de filtro para empresa; a conversa não define se equivale a empresa, filial, fazenda ou unidade | Todas as abas produtivas                              | **Pendente de definição**                                 |
| Atualizar os dashboards a partir do ERP | Cliente informou que não acredita existir API nativa e que havia sido discutida a criação de uma API para atualização; 08/06, linhas 173–177 | A integração deve buscar dados do COMPASS ERP/Oracle para alimentar o BI                                                      | Integração; todas as abas alimentadas pelo ERP        | **Parcial; mecanismo e operação ainda não especificados** |
| Garantir conexão com o banco            | Cliente perguntou sobre o andamento da conexão e demonstrou preocupação; 10/06, linha 186                                                    | A conectividade com a base é uma preocupação de aceite do projeto                                                             | Integração Oracle                                     | **Requisito de integração; não tratado como concluído**   |

## 3. Requisitos técnicos confirmados

| Item                      | Evidência                                                                                     | Decisão/restrição registrada                                                                            |
| ------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| ERP                       | “COMPASS ERP”; 08/06, linha 175                                                               | O ERP de origem informado é o COMPASS ERP                                                               |
| Fornecedor do ERP         | “da unisystem” e endereço institucional; 08/06, linhas 176–177                                | O sistema é da Unisystem                                                                                |
| Banco de dados            | “o DB é o oracle 19c”; 08/06, linha 180                                                       | A base de dados de referência é Oracle 19c                                                              |
| API nativa                | Cliente informou que acredita que não haverá API nativa; 08/06, linha 173                     | Não assumir disponibilidade de API pronta                                                               |
| API para atualização      | Cliente informou que a criação de uma API havia sido discutida; 08/06, linha 173              | Considerar uma camada de integração própria como hipótese de solução                                    |
| Dependência do fornecedor | Cliente disse que o pessoal do ERP provavelmente não ajudaria na integração; 10/06, linha 192 | Planejar acesso, credenciais técnicas e integração sem depender exclusivamente do suporte do fornecedor |
| Segurança da conexão      | A conversa não define usuário, rede, whitelist ou permissões                                  | Confirmar acesso read-only, autenticação, origem permitida, logs e tratamento de falhas                 |

A conexão Oracle/API deve ser tratada como requisito técnico e risco de projeto. O fato de o BI analisado atualmente mostrar dados conectados não substitui a validação formal da arquitetura de integração do projeto.

## 4. Matriz de rastreabilidade com a última análise

| Solicitação               | Cobertura encontrada                                                        | Abas relacionadas                            | Situação                                                  |
| ------------------------- | --------------------------------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------- |
| Produção de grãos         | Área, avanço, volume, sc/ha, ritmo e qualidade                              | `/graos`, `/romaneios`                       | **Coberto**                                               |
| Produção de algodão       | Área, avanço, rolos, @/ha, peso médio e saldo                               | `/algodao`                                   | **Coberto com dados parciais**                            |
| Beneficiamento            | Campo, pátio, gin, caroço, pluma, rendimento e HVI                          | `/algodoeira`                                | **Coberto**                                               |
| Visão executiva da safra  | Área e volume do grupo, culturas em janela e avanço                         | `/`                                          | **Coberto**                                               |
| Filtros por empresa       | Necessidade explicitamente mencionada, mas sem regra dimensional            | Todas as abas produtivas                     | **Pendente de confirmação**                               |
| Atualização automática    | Oracle/Unisystem identificados; API e frequência ainda não definidos        | Integração                                   | **Parcial**                                               |
| Seleção final de KPIs     | Sistema foi analisado e os indicadores foram recomendados                   | Relatório de KPIs                            | **Recomendação pronta; aceite do cliente pendente**       |
| Estoque e fluxo comercial | Estoque, disponível, vendido, a vender e embarques identificados como apoio | `/armazenamento`, `/comercial`, `/embarques` | **Apoio recomendado; não foi o foco primário confirmado** |

## 5. KPIs recomendados para aprovação

### 5.1 Essenciais para produção

| KPI                    | Aplicação                                                 | Status do dado na análise                          |
| ---------------------- | --------------------------------------------------------- | -------------------------------------------------- |
| Área plantada          | Denominador da safra e comparação entre fazendas/culturas | Real/cenário de áreas                              |
| Área colhida           | Medir execução física                                     | Real quando a área está marcada no ERP             |
| Avanço da colheita     | Área colhida ÷ área plantada                              | Derivado de dados reais                            |
| Volume colhido         | Medir produção recebida                                   | Real por romaneio/ERP                              |
| Produtividade de grãos | Peso líquido ÷ ha colhidos em sc/ha                       | Real derivado por cultura                          |
| Qualidade dos grãos    | Umidade, impureza e avariados                             | Real de romaneios                                  |
| Rolos de algodão       | Campo, pesagem e recebimento                              | Real operacional                                   |
| @/ha de algodão        | Produtividade do algodão                                  | Parcial/estimado enquanto houver rolos sem pesagem |
| Saldo a colher         | Área ou rolos ainda não concluídos                        | Derivado operacional                               |

### 5.2 Beneficiamento do algodão

- Rolos ainda no campo.
- Rolos no pátio.
- Rolos pesados.
- Rolos beneficiados.
- Caroço beneficiado.
- Pluma produzida.
- Rendimento de pluma.
- Ordens de descaroçamento.
- Fardinhos por hora/turno.
- Qualidade HVI e classificação visual.

Classificação recomendada:

- Peso de balança e fardinhos analisados: **real**.
- Rolos ainda não pesados: **estimados pela média atual**.
- @/ha do algodão: **parcial/projetado**.
- Rendimento: **parcial enquanto a ordem estiver aberta**.
- HVI por talhão: **não rastreável integralmente no modelo atual**; o BI informa associação por ordem do dia.

### 5.3 Apoio à decisão operacional e comercial

- Estoque físico por produto, armazém e fazenda.
- Volume disponível para comercializar.
- Volume vendido.
- Volume a vender.
- Percentual comercializado.
- Contratos ativos.
- Percentual atendido.
- Saldo a embarcar.
- Ritmo de embarques.

Esses KPIs são recomendados como segunda camada porque conectam produção, estoque e venda, embora o foco final confirmado pelo cliente seja produção de grãos e algodão.

### 5.4 Indicadores financeiros posteriores

- Custo por hectare.
- Custo por cultura e fazenda.
- Receita por cultura e safra.
- Margem em valor.
- Margem percentual.
- Ponto de equilíbrio.
- Projeção de receita e custo.

Esses indicadores devem entrar após a validação dos KPIs operacionais, pois a análise encontrou diferenças de fonte e janela entre SIAGRI, Unisystem e Oracle.

## 6. Evidências textuais do cliente e classificação

### 6.1 Mensagens que alteram ou confirmam o escopo

- **28/04, linhas 16 e 25:** o cliente questionou a alteração do escopo para Oracle e confirmou “Oracle”. Isso é uma decisão técnica de origem de dados.
- **26/05, linha 130:** o cliente mencionou a necessidade de ajuda na estrutura dos filtros relacionados à empresa. Acompanhou a mensagem com mídias cujo conteúdo não está disponível no exportado.
- **08/06, linhas 173–177:** informou a possibilidade de ausência de API nativa, o COMPASS ERP e a Unisystem.
- **08/06, linha 180:** confirmou Oracle 19c.
- **10/06, linhas 186 e 192:** demonstrou preocupação com a conexão ao banco e informou que o fornecedor do ERP provavelmente não ajudaria.
- **07/07, linhas 209–213:** informou que não entendeu o que precisava validar no documento. Isso revela necessidade de documentação de aceite mais clara, não uma nova funcionalidade do dashboard.
- **16/07, linha 221:** informou que finalizaria a análise e enviaria retorno. Não há, no texto disponível, uma lista adicional de KPIs enviada depois disso.
- **24/08, linhas 239–243:** confirmou a seleção de KPIs no sistema e definiu o foco como produção, grãos e algodão.

### 6.2 Mensagens de confirmação sem novo requisito

As mensagens “Bom dia”, “Boa tarde”, “Boa noite”, “Combinado”, “Positivo”, “Ótimo ótimo”, “Pode deixar” e equivalentes foram tratadas como confirmações ou cordialidades. Elas não adicionam critérios funcionais por si só.

## 7. Itens que não são solicitações do cliente

Os itens abaixo aparecem na conversa, mas não devem ser convertidos em requisito funcional do BI:

- Agendamento e alteração de horário de reuniões.
- Cobranças internas por retorno ou análise.
- Relatórios enviados pela equipe para acompanhamento.
- Convites e links privados de reunião.
- Credenciais de teste enviadas pela equipe.
- Mensagens internas de boas-vindas e inclusão de integrantes no grupo.
- Solicitações da equipe para que o cliente enviasse base de dados, exportação e print de layout.
- Mensagens de acompanhamento sobre o andamento interno do desenvolvimento.

Os conteúdos de acesso presentes na conversa foram deliberadamente omitidos deste documento.

## 8. Mídias ocultas e limites da evidência

O arquivo exportado contém 27 ocorrências identificadas como `<Mídia oculta>`. Como o conteúdo visual ou documental dessas mídias não está disponível no `.txt`, não é possível afirmar que elas contenham:

- Layout aprovado.
- Lista de KPIs.
- Estrutura de filtros.
- Modelo de dados.
- Regras de negócio.
- Aprovação formal do escopo.

As mídias devem ser solicitadas novamente apenas se forem necessárias para fechar alguma decisão de produto ou integração. Até lá, a análise deve usar somente as mensagens textuais e o sistema BI acessível.

## 9. Pendências e decisões necessárias

### Produto e filtros

- Definir se “empresa” significa empresa legal, filial, fazenda, unidade operacional ou outra dimensão.
- Confirmar se o filtro por empresa deve estar presente em todas as abas ou apenas em produção.
- Aprovar a lista final de KPIs essenciais, de beneficiamento e de apoio.
- Confirmar layout, identidade visual e hierarquia das informações, caso o material enviado em mídia seja necessário.

### Integração

- Confirmar acesso read-only ao Oracle 19c.
- Definir se a integração será por API própria, consulta direta, exportação ou combinação desses métodos.
- Definir frequência de atualização e horário de sincronização.
- Definir autenticação, rede, whitelist, rotação de credenciais e logs.
- Definir comportamento quando a fonte estiver indisponível ou retornar dados incompletos.
- Confirmar quem será responsável pelo suporte técnico do ERP e da integração.

### Dados e governança

- Padronizar `data_as_of` e data da última sincronização.
- Separar valores reais, estimados, parciais e históricos na interface.
- Validar o vínculo entre cultura, fazenda, talhão, romaneio, rolo e ordem de beneficiamento.
- Resolver a diferença entre o resumo de alertas ativos e a Central de Alertas.
- Reconciliar cartões e tabelas de estoque antes do aceite executivo.

## 10. Critérios de aceite da próxima validação

O cliente poderá validar o próximo pacote quando conseguir responder afirmativamente a estes itens:

- O dashboard apresenta claramente produção de grãos e algodão.
- Os KPIs essenciais estão visíveis e possuem unidade e data de referência.
- O usuário consegue filtrar os dados pela dimensão correta de empresa.
- Os indicadores parciais ou estimados estão identificados.
- Os dados vêm do Oracle/COMPASS ERP ou possuem origem documentada.
- A atualização e o horário do último carregamento são visíveis.
- A lista de KPIs foi aprovada ou recebeu ajustes objetivos.
- O fluxo de produção do campo ao beneficiamento pode ser acompanhado.
- Nenhuma credencial ou link privado aparece no material entregue.

## 11. Assumptions adotadas

- Este documento é um terceiro artefato e não substitui o mapeamento nem o relatório de KPIs.
- A seleção de KPIs foi baseada na análise real do BI porque o cliente não forneceu uma lista textual final.
- “Filtros relacionados à empresa” permanece como requisito pendente; empresa, filial, fazenda e unidade não foram tratados como sinônimos.
- Oracle/API é requisito e risco de integração, não evidência de implementação concluída.
- Mensagens em mídia oculta não foram interpretadas.
