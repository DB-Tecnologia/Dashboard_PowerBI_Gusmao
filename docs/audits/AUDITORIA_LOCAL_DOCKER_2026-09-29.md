# Auditoria do ambiente local Docker — 2026-09-29

## Resultado em uma frase

O ambiente demo sobe localmente e permite autenticar, abrir o painel e consultar relatórios de exemplo no SQL Server. Ele ainda não é uma instalação de produção: os indicadores agrícolas do Oracle/COMPASS não estão conectados, parte dos dados é simulada e há fluxos da interface que ainda não usam as APIs existentes.

## O que foi iniciado

Foi usado o Compose de demonstração, recomendado no `README.md`:

```powershell
docker compose --env-file infra/env/.env.demo -f infra/docker/docker-compose.demo.yml up -d --build
```

O arquivo local `infra/env/.env.demo` foi criado a partir do exemplo e é ignorado pelo Git. Os quatro containers ficaram ativos: Web, API, SQL Server demo e Redis. SQL Server e Redis passaram nos healthchecks do Docker.

## Evidências observadas

| Verificação | Resultado |
| --- | --- |
| `http://localhost:3000` | HTTP 200 |
| `GET http://localhost:3001/health` | `ok` |
| `GET http://localhost:3001/health/sql` | `ok` |
| Login de usuário demo comum | Token emitido |
| `GET /dashboard/home` autenticado | 3 KPIs retornados |
| Consulta do relatório demo financeiro | 3 linhas retornadas do SQL Server local |
| `GET /api/v1/bi/production/summary` | `not_configured`, origem `sqlserver-demo` |
| Login da conta demo administrativa | Solicita segundo fator (TOTP) |
| `pnpm verify:workspace`, `verify:env`, `verify:docker`, `verify:docs` | Aprovados; `verify:docs` passou novamente após os registros desta auditoria |

Essas verificações são smoke checks do ambiente. A suíte completa de testes, typecheck, lint e build do monorepo não foi executada nesta auditoria.

## Como entender o sistema

```text
Navegador (Web Next.js :3000)
        │ solicita telas e dados
        ▼
API NestJS (:3001) ── SQL Server demo (relatórios de exemplo)
        ├──────────── Supabase opcional (persistência de partes da plataforma)
        └──────────── Redis/BullMQ (fila de exportação)

Produção planejada: API ── Oracle 19c/COMPASS, somente leitura
```

A Web mostra as telas e envia pedidos. A API valida o login, as permissões e os parâmetros antes de consultar uma fonte de dados ou executar uma ação. O SQL Server local contém tabelas, views e uma stored procedure preenchidas com dados demonstrativos. Isso comprova a ligação técnica entre Web, API e banco; não comprova os indicadores agrícolas reais do negócio.

## Achados da auditoria

### 1. O BI agrícola real ainda não está conectado — bloqueia a conclusão produtiva

Na configuração demo, a API identifica a fonte como `sqlserver-demo`. O endpoint de resumo de produção retorna `not_configured`; grãos, algodão, algodoeira e romaneios aguardam as views de origem. O serviço de frescor retorna datas e watermark vazios. O endpoint de atualização atual faz um smoke check da fonte, mantém o estado do job em memória e termina como `skipped`; não cria nem persiste um snapshot agrícola.

O serviço do dashboard legado permite números sintéticos quando `DATA_MODE=mock`, que é o modo deste Compose. Portanto, os gráficos da home local servem para demonstrar a interface e não devem ser apresentados como números reais do COMPASS. A resposta do contrato BI v1 deixa a origem indisponível/não configurada explícita.

**Para fechar:** obter conexão autorizada e somente leitura ao Oracle/COMPASS; aprovar consultas e mapeamento de campos, unidades e datas de corte; preencher os contratos dos domínios; persistir watermark e snapshots; reconciliar os totais com a área de negócio.

### 2. Dados de usuário e dados de demonstração não são duráveis

`UsersRepository` mantém usuários em `Map` dentro do processo da API. No Compose demo, o Supabase também não está configurado e os repositórios que oferecem esse fallback usam memória. Reiniciar ou recriar a API perde alterações feitas nesses domínios. O banco SQL demo contém apenas o conjunto de relatórios de exemplo; ele não substitui a persistência de usuários, permissões, auditoria e configurações da plataforma.

**Para fechar:** escolher e configurar persistência durável para os domínios da plataforma; garantir que criação, atualização, revogação e trilhas administrativas sobrevivam a reinícios; definir migrações, backup e restauração.

### 3. A interface de notificações e o histórico de exportações ainda usam o cliente legado

`NotificationsList` e `ExportsList` chamam `getAppDataClient()` em `apps/web/src/lib/app-data.ts`. No demo, esse cliente entrega fixtures locais; fora do modo mock, tenta acesso direto ao Supabase. A API já tem rotas e clientes centralizados para notificações e exportações em `platform-api.ts`, mas essas duas telas ainda não usam esse fluxo. Assim, uma ação registrada pela API pode não aparecer no histórico exibido pela tela.

**Para fechar:** ligar as duas telas aos endpoints autenticados, exercitar criação, processamento, histórico e download de ponta a ponta, e persistir jobs e arquivos conforme a política de retenção escolhida.

### 4. A conta administrativa demo exige TOTP e não serve para produção

A conta demo administrativa já nasce com TOTP ativado. O template local deixa `TOTP_ENCRYPTION_KEY` vazio; nesse modo de desenvolvimento, a chave TOTP não fica criptografada e o código de demonstração é escrito no log da API. Isso é uma conveniência insegura, limitada ao ambiente local isolado. A senha demo também não deve ser reutilizada fora da demonstração.

**Para fechar antes de qualquer implantação:** provisionar uma chave forte em gerenciador de segredos, remover segredos/códigos demo dos logs e trocar as credenciais de demonstração por contas reais com processo seguro de ativação de 2FA.

### 5. O build Docker não fixa a resolução das dependências

Os Dockerfiles da API e da Web executam `pnpm install --frozen-lockfile=false` e instalam manifests sem copiar o lockfile antes dessa etapa. O resultado pode mudar entre builds, mesmo com o mesmo commit. Além disso, o Compose de desenvolvimento separado da demo espera um Oracle e monta um dump `.dmp`; para conhecer o projeto sem essas dependências, deve-se usar `docker-compose.demo.yml`.

**Para fechar:** instalar com lockfile imutável nas imagens; separar de forma clara o modo demo do ambiente Oracle de desenvolvimento e validar o setup em um clone limpo.

### 6. A documentação descreve estados diferentes

O `README.md` e a onda de agosto no `ROADMAP.md` descrevem o Compose demo e a integração Oracle pendente. O `docs/product/ESCOPO.md` ainda lista como pendentes capacidades já presentes no código, como 2FA obrigatório para admin, drill-down multi-dimensão e BullMQ. Ao mesmo tempo, partes da interface ainda usam fixtures, conforme o achado anterior. Isso torna a contagem de “telas concluídas” diferente de dizer que cada fluxo usa dados reais e persistentes.

**Para fechar:** atualizar o escopo, a matriz das telas e a documentação de módulos a partir de evidências do runtime, separando claramente “interface pronta”, “fluxo ligado à API”, “persistência durável” e “dados produtivos reconciliados”.

## Ordem recomendada para terminar

1. Corrigir a persistência dos usuários e dos domínios de plataforma; fechar o fluxo de notificações e exportações pela API.
2. Integrar Oracle/COMPASS com acesso somente leitura, contratos reais dos domínios agrícolas, snapshot durável e reconciliação dos KPIs.
3. Fechar a operação de produção: segredos, TOTP, e-mail, HTTPS/TLS, backups, restauração, logs e alertas.
4. Rodar testes automatizados e E2E com dados reais de aceite; revisar a matriz de 18 telas e 6 módulos e alinhar a documentação.
