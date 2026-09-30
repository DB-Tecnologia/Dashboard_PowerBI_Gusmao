# Prévia temporária do cliente na VPS — 2026-09-30

## Resultado

A prévia do Dashboard Gusmão está disponível em [https://srv1728931.hstgr.cloud](https://srv1728931.hstgr.cloud). O hostname é temporário e controlado pelo provedor; não é um domínio pertencente ao projeto. A instalação destina-se a avaliação do cliente, não a uso produtivo.

A VPS continua com Debian GNU/Linux 13, Docker Engine 26.1.5 e Docker Compose 2.26.1. O inventário inicial mediu 4 vCPUs, 15 GiB de RAM e cerca de 181 GiB livres. O projeto usa Compose isolado em `/opt/dashboard-gusmao-preview/source`; os segredos reais ficam em `infra/env/.env.preview`, modo `0600`, fora do Git.

## Topologia e acesso

```text
Internet -> Caddy (TCP 80/443) -> Web Next.js
                            \-> API NestJS -> SQL Server Express demo
                                           -> Redis
```

- O Compose `dashboard-gusmao-preview` executa Caddy, Web, API, SQL Server e Redis. A inspeção dos bindings Docker confirmou publicação somente das portas TCP 80 e 443 no Caddy; API, SQL Server e Redis não publicam portas no host.
- A Web e a API usam os modos explícitos de demonstração. A home vem do dataset sintético móvel de 12 meses; o SQL Server contém os relatórios fictícios de exemplo.
- A API usa um usuário SQL `dashboard_reader`, membro de `db_datareader`, com `EXECUTE` no schema de relatórios. Não recebe permissão de escrita.
- A única conta compartilhável é papel `viewer` em Diretoria, Financeiro, Comercial e Operações. O seed com administrador/TOTP fixo não é executado no perfil da VPS.
- Caddy obteve certificado público da Let's Encrypt. A resposta externa de `/login` foi HTTP 200; HTTP redireciona com 308 para HTTPS.
- O arquivo `.env.preview` tem modo `0600`. Nenhuma senha, token, segredo, IP ou fingerprint é registrado nesta auditoria.

## Substituição da aplicação anterior

O usuário pediu para limpar a VPS e substituir a aplicação. Depois que a nova stack passou por healthchecks, login e consulta SQL, o projeto Docker anterior foi parado e removido pelo Compose identificado nos metadados dos containers. Foram removidos seus containers, arquivos da aplicação, arquivo de ambiente antigo, imagens associadas e cache Docker sem uso. Nenhum backup foi criado, conforme o escopo explícito de limpeza. Debian, Docker, a nova stack e a chave SSH permaneceram.

Após a limpeza, só há cinco containers ativos, todos da prévia, cinco volumes nomeados da prévia e cinco imagens usadas por ela. A pasta da aplicação antiga não existe mais. O `docker system df` registrou 3,646 GB em imagens da prévia, 95,27 MB em volumes ativos e cache de build vazio.

## Segurança operacional

- A identidade SSH foi comparada ao painel do provedor antes de instalar a chave pública `Dev.RuiDiniz`. O login por chave foi validado em uma conexão nova.
- O arquivo `/etc/ssh/sshd_config.d/00-preview-key-only.conf` define `PermitRootLogin prohibit-password`, `PasswordAuthentication no` e `KbdInteractiveAuthentication no`; `sshd -t`, reload e novo login por chave passaram.
- UFW não está instalado e a política local `iptables INPUT` é `ACCEPT`. Os serviços da aplicação ficam protegidos por não terem bindings de porta; TCP 80/443 foram confirmadas de um cliente externo. Regras do firewall do provedor não foram alteradas.
- A VPS não recebeu dados reais. O hostname do provedor, credenciais de demo e segredos do serviço devem ser tratados como temporários e não reutilizados em produção.

## Validações operacionais

- `pnpm --filter @dashboard-power-bi/api build`: aprovado.
- `pnpm --filter @dashboard-power-bi/web build`: aprovado.
- `pnpm verify:env`, configuração do Compose de prévia e `git diff --check`: aprovados.
- Construção das imagens da API, Web e SQL Server na VPS: aprovada.
- Cinco serviços Docker saudáveis. O SQL Server foi reiniciado e voltou saudável com o seed reaplicado.
- HTTPS externo válido: `/login` 200; HTTP redireciona para HTTPS; `/api/health/sql` indica SQL Server disponível.
- Login confirmado sem 2FA; perfil `viewer`, quatro setores; dashboard com 12 KPIs e 12 pontos temporais; catálogo com quatro relatórios; execução SQL do relatório financeiro retornou cinco linhas.
- Não foram executadas suítes Jest/Playwright nesta operação.

## Limites e próximos passos

- BI e relatórios contêm apenas dados fictícios; Oracle/COMPASS não está conectado nem reconciliado.
- Usuários, favoritos e partes do domínio permanecem em memória. A tela Web de notificações e o histórico Web de exportações usam fixtures; alterações nesses dados não são garantidas após reinício.
- O SQL demo reexecuta o seed ao iniciar e repõe as tabelas de exemplo; mudanças manuais no banco são perdidas no reinício.
- O hostname é temporário. Próximo passo para um piloto mais durável: obter domínio próprio, configurar DNS, definir backups/restauração, observabilidade, retenção e estratégia de persistência para os dados de plataforma.
- Essa prévia não valida os critérios de produção do V1 nem substitui a auditoria de estado real do produto.
