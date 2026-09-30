# Dashboard Gusmão

## Inteligência operacional para transformar dados agrícolas em decisões melhores

O Dashboard Gusmão é uma plataforma de BI e relatórios criada para dar à gestão uma visão clara da operação do Grupo Franciosi, conectando produção, colheita, grãos, algodão, algodoeira e romaneios em uma experiência web segura e rastreável.

> **Estado em 2026-09-30:** além do ambiente demo local, há uma prévia temporária HTTPS na VPS para avaliação do cliente. Ela usa somente dados fictícios e SQL Server de demonstração. Oracle/COMPASS ainda aguarda acesso, mapeamento e reconciliação; o projeto não está liberado para produção.

## Por que este produto existe

Operações agrícolas geram dados valiosos em muitas telas, relatórios e sistemas. Quando esses dados ficam dispersos, a gestão perde tempo para encontrar respostas, comparar períodos e entender se um indicador está atualizado.

O Dashboard Gusmão organiza essa informação em uma camada única de consulta para que cada área consiga acompanhar o que importa:

- **Gestão:** visão consolidada, tendências e frescor dos dados.
- **Produção:** colheita, volume, área, produtividade e evolução da safra.
- **Grãos e algodão:** indicadores operacionais por cultura, período e unidade.
- **Algodoeira:** recebimento, beneficiamento e qualidade.
- **Armazenagem e comercial:** romaneios, saldos e movimentações nas fases seguintes.
- **Administração:** usuários, permissões, auditoria e saúde das integrações.

## O valor para o negócio

| Desafio                                       | Como o Dashboard Gusmão ajuda                                                 |
| --------------------------------------------- | ----------------------------------------------------------------------------- |
| Informação espalhada em sistemas e relatórios | Centraliza os principais indicadores em uma experiência web única.            |
| Dificuldade para comparar produção e períodos | Estrutura filtros, dimensões e visões para análise operacional.               |
| Dúvida sobre a atualidade de um número        | Exibe origem, data de corte, última sincronização, status e alertas.          |
| Acesso sem governança                         | Usa autenticação, perfis, permissões por setor e trilha de auditoria.         |
| Integração dependente de uma única fonte      | Mantém um contrato de BI substituível entre SQL Server demo e Oracle/COMPASS. |

## Uma visão única da operação

O produto foi organizado para acompanhar o fluxo de decisão do negócio:

```text
Visão Grupo -> Colheita -> Grãos / Algodão -> Algodoeira
                                      -> Romaneios
```

### Primeira frente de BI

- Resumo da produção.
- Produção de grãos.
- Produção de algodão.
- Indicadores da algodoeira.
- Romaneios e filtros relacionados.
- Frescor, data de corte e origem de cada informação.

Armazenamento, comercial, embarques, resultados e custos permanecem no roadmap para as próximas fases de evolução.

## Confiança no dado desde a origem

O Dashboard Gusmão foi desenhado para deixar a qualidade do dado visível, não escondê-la. As respostas de BI carregam metadados como:

```text
value | unit | dataAsOf | lastSyncedAt | source
status | definitionVersion | warnings
```

Na prática, isso significa:

- indisponibilidade da origem aparece como indisponibilidade;
- dados demo e mock são identificados explicitamente;
- não existe fallback sintético silencioso para mascarar falhas;
- atualizações podem ser idempotentes e auditáveis;
- o último snapshot válido e o watermark podem ser preservados;
- a reconciliação com o sistema de origem faz parte do aceite da integração real.

## Integração preparada para Oracle e COMPASS

O ambiente inicial usa SQL Server demo para validar a plataforma sem depender da infraestrutura do cliente. A arquitetura de dados foi preparada para receber Oracle 19c/COMPASS como fonte real, em modo somente leitura.

A etapa de integração será concluída quando estiverem disponíveis rede, host, porta, service name e usuário de leitura. O processo previsto inclui smoke queries, consultas parametrizadas, controle de timeout, registro de execução, contagens, erros, watermark e reconciliação dos KPIs.

Nenhuma credencial real é criada, exposta ou versionada neste repositório.

## O que já está disponível

- Autenticação, sessão e autorização por perfil, setor e permissão; no demo, parte dos repositórios usa memória e perde alterações quando a API reinicia.
- Home executiva de BI responsiva com KPIs sem repetição, séries históricas, destaque do período e identificação explícita dos dados de demonstração.
- Catálogo, filtros, visualização e execução de relatórios.
- Exportações PDF, XLSX, CSV e JSON pela API com worker BullMQ/Redis; os arquivos ficam em storage local, sem S3.
- Administração de usuários, grupos, permissões, relatórios e configurações; a durabilidade depende da configuração do Supabase.
- API de auditoria e notificações; a tela Web de notificações e o histórico Web de exportações ainda usam fixtures em `app-data.ts` no modo demo.
- API versionada para a primeira fatia de BI.
- Ambiente demo Docker com SQL Server, API NestJS, Web Next.js e Redis; não representa a topologia validada de produção.
- Healthchecks, Swagger e validações automatizadas do workspace.

O produto ainda está em evolução e não representa toda a plataforma V1 descrita no escopo original. O estado real, os limites e as próximas entregas estão registrados no [PRD](PRD.md) e no [ROADMAP](ROADMAP.md).

Para uma avaliação por área, telas, dados e lacunas de produção, consulte a [auditoria do estado real em 2026-09-29](docs/audits/ESTADO_REAL_PROJETO_2026-09-29.md). Ela diferencia telas existentes, fluxos conectados à API, persistência durável e dados reais reconciliados.

## Desenvolvimento com Docker

O ambiente demo é a forma recomendada de conhecer a plataforma localmente.

### Setup rápido

Requisitos: Node.js `>=20.11`, pnpm `9.x` e Docker Desktop.

```bash
git clone https://github.com/DB-Tecnologia/Dashboard_PowerBI_Gusmao.git
cd Dashboard_PowerBI_Gusmao
pnpm install
pnpm verify:workspace
pnpm verify:env
pnpm verify:docker
pnpm verify:docs
```

### Ambiente demo reproduzível

O demo sobe todos os serviços necessários sem credenciais reais:

```powershell
Copy-Item infra/env/.env.demo.example infra/env/.env.demo
docker compose --env-file infra/env/.env.demo -f infra/docker/docker-compose.demo.yml up -d --build
```

Acesse:

- Web: `http://localhost:3000`
- API: `http://localhost:3001`
- Swagger: `http://localhost:3001/docs`
- Healthcheck: `http://localhost:3001/health`
- Fonte de dados: `http://localhost:3001/health/sql`

Para navegar por todos os setores sem permissões administrativas, entre com `viewer.diretoria@example.com`. A senha é a mesma configurada em `AUTH_DEMO_USER_PASSWORD` no arquivo local `infra/env/.env.demo` e usada pelas outras contas demo. A home e os drill-downs usam dados fictícios variados ao longo dos últimos 12 meses, incluindo histórico mensal de Produção, Comercial e Algodoeira; notificações, exportações e configurações também aparecem em datas diferentes. Os relatórios SQL são preenchidos com linhas de demonstração. Nenhum desses valores representa o negócio real.

No ambiente demo, `/api/v1/bi/production/summary` informa `not_configured` quando a base local não possui dados de produção. O contrato não mascara essa condição com números sintéticos.

## Prévia temporária para o cliente

A prévia está em [https://srv1728931.hstgr.cloud](https://srv1728931.hstgr.cloud). O hostname é temporário e controlado pelo provedor da VPS. Entre com a conta e a senha de consulta compartilhadas separadamente; ela tem papel `viewer` nos quatro setores e não possui acesso administrativo.

Essa instância serve somente para avaliação visual e funcional. A home, notificações e outros exemplos usam valores fictícios; os relatórios SQL consultam tabelas preenchidas com dados de demonstração. Não há conexão Oracle/COMPASS, persistência durável de usuários nem dados reais do cliente. O SQL demo repõe seu conjunto de exemplo ao reiniciar.

O perfil isolado está em `infra/docker/docker-compose.preview.yml`, o proxy HTTPS em `infra/docker/caddy/Caddyfile.preview` e o modelo de variáveis em `infra/env/.env.preview.example`. Na VPS, o arquivo real `infra/env/.env.preview` contém credenciais e segredos e permanece fora do Git, com acesso restrito ao `root`.

Somente o Caddy publica as portas 80/443. API, SQL Server e Redis ficam na rede Docker privada. O SSH do host aceita a chave validada e não aceita autenticação por senha. A prévia não equivale a um ambiente de produção e será substituída por domínio próprio quando ele estiver disponível.

### Checklist de setup local

- [ ] Instalar Node.js 20 ou superior.
- [ ] Instalar pnpm 9 ou superior.
- [ ] Instalar Docker Desktop.
- [ ] Clonar o repositório.
- [ ] Rodar `pnpm install`.
- [ ] Rodar as verificações do workspace.
- [ ] Subir o ambiente demo.
- [ ] Validar Web, API, Swagger e healthchecks.

## Arquitetura e monorepo

O monorepo separa a experiência Web, a API, os contratos compartilhados, a infraestrutura Docker e a documentação operacional.

## Para equipes técnicas

### Stack

- Node.js 20+ e pnpm 9+.
- TypeScript strict.
- NestJS para a API.
- Next.js 14 com App Router para a Web.
- Tailwind CSS e Recharts.
- SQL Server demo e Oracle/COMPASS como fontes substituíveis.
- Redis para serviços de apoio e jobs.
- Docker Compose para desenvolvimento, demo e produção.
- GitHub Actions para automação de deploy.

### Arquitetura resumida

```text
Web Next.js -> API NestJS -> Fonte de dados
                         -> SQL Server demo
                         -> Oracle 19c / COMPASS
                         -> Redis e serviços de plataforma
```

### Comandos principais

```bash
pnpm verify:workspace
pnpm verify:docker
pnpm verify:docs
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm test:e2e:playwright
pnpm build
pnpm quality
pnpm dev:api
pnpm dev:web
pnpm docker:dev
pnpm docker:demo
```

### Testes E2E com Playwright

Os testes E2E executam contra a Web em `http://localhost:3000` e a API demo em `http://localhost:3001`. O conjunto atual exige credenciais fornecidas somente no ambiente de execução:

- `E2E_EMAIL` e `E2E_PASSWORD` para o usuário comum.
- `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD` e `E2E_ADMIN_TOTP_SECRET` para os cenários administrativos e 2FA.
- `E2E_BASE_URL` e `E2E_API_URL` podem substituir as URLs locais padrão.

Configure essas variáveis em um gerenciador de segredos ou no shell local, sem salvá-las em arquivos versionados, e execute:

```bash
pnpm test:e2e:playwright
```

Os testes falham explicitamente quando as credenciais administrativas não são fornecidas. O segredo TOTP é usado apenas para gerar códigos temporários durante a execução e nunca deve aparecer em logs, documentação ou commits.

## Desenvolvimento sem Docker

```bash
pnpm dev:api
pnpm dev:web
```

URLs locais:

```text
Web: http://localhost:3000
API: http://localhost:3001
Healthcheck: http://localhost:3001/health
Swagger: http://localhost:3001/docs
```

## Decisões arquiteturais

As principais decisões técnicas estão registradas em [`docs/decisions/`](docs/decisions/), incluindo a escolha do monorepo, NestJS, Next.js, design system e Docker Compose.

## Segurança

Segurança e governança fazem parte do produto desde a autenticação até a integração de dados:

- Nunca versionar `.env` real, tokens, senhas ou strings de conexão.
- Oracle deve ser acessado somente com usuário de leitura.
- Consultas SQL devem ser parametrizadas e ter identificadores validados.
- A API aplica JWT, bcrypt, autorização, CSRF e headers de segurança.
- A plataforma mantém trilha de auditoria para ações administrativas.
- Dados demo, mock, indisponíveis ou desatualizados devem ser identificados no contrato.

## Troubleshooting

- **Porta em uso:** ajuste `API_PORT`, `WEB_PORT`, `REDIS_PORT` ou `NGINX_PORT`.
- **Dependências inconsistentes:** remova os diretórios `node_modules` e rode `pnpm install` novamente.
- **SQL Server indisponível:** valide as variáveis `SQLSERVER_*` e `http://localhost:3001/health/sql`.
- **Oracle não configurado:** a integração real depende de rede, host, service name e usuário de leitura fornecidos pelo cliente.

## Documentação

Comece pelo [índice da documentação](docs/INDEX.md):

- [PRD](PRD.md): produto, público, requisitos e critérios de aceite.
- [ROADMAP](ROADMAP.md): fases, prioridades e próximos marcos.
- [Arquitetura](docs/architecture/ARQUITETURA.md): topologia e módulos.
- [Integração BI](docs/integration/relatorio-integracao-bi-gusmao-2026-08-24.md): fontes, atualização e Oracle.
- [Produto e KPIs](docs/product/): escopo, mapeamento e indicadores.
- [API e Web](docs/reference/): contratos e fluxos disponíveis.
- [Decisões](docs/decisions/): ADRs arquiteturais.
- [Memória persistida](docs/governance/MEMORIA_PROJETO.md): snapshot, histórico, validações e handoff para agentes.

## Deploy e suporte operacional

Os artefatos de produção e prévia estão em:

```text
infra/docker/docker-compose.prod.yml
infra/docker/docker-compose.preview.yml
infra/docker/caddy/Caddyfile.preview
infra/docker/api.prod.Dockerfile
infra/docker/web.prod.Dockerfile
.github/workflows/deploy-vps.yml
```

O deploy automatizado e os limites operacionais estão descritos em [Arquitetura](docs/architecture/ARQUITETURA.md). O workflow de deploy em `main` usa os secrets GitHub do ambiente de produção; a prévia temporária da VPS adicional usa um Compose próprio. Variáveis de produção devem ser fornecidas exclusivamente pelo ambiente seguro de execução.

O template versionado [`infra/env/.env.production.example`](infra/env/.env.production.example) documenta o contrato completo de produção, com Oracle/COMPASS como fonte padrão e SQL Server como compatibilidade legada. Para preparar uma implantação:

```powershell
Copy-Item infra/env/.env.production.example infra/env/.env.production
pnpm verify:env
pnpm docker:prod
```

Preencha o arquivo local somente com o gerenciador de segredos ou ambiente seguro da operação. `TOTP_ENCRYPTION_KEY` é obrigatória antes do boot de produção; sem ela, a API encerra a inicialização para impedir armazenamento de secrets TOTP em texto simples. Não versione `infra/env/.env.production`; a conexão Oracle, o Supabase, o domínio, SMTP, JWT e a chave TOTP dependem da infraestrutura real e continuam sem valores no repositório.

## Licença

Uso interno e controlado. Consulte a equipe responsável pelo projeto para informações sobre distribuição, operação e acesso aos dados.
