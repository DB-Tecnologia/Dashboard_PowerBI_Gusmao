# SPEC-INFRA-007 — Prévia temporária do cliente na VPS

**ID:** INFRA-007

**Módulo:** Infraestrutura e autenticação

**Fase:** Entrega de demonstração

**Status:** Concluído

**Atualizado em:** 2026-09-30

---

## 1. Objetivo

Substituir a aplicação que ocupa a VPS autorizada por uma prévia HTTPS isolada do Dashboard Gusmão, com dados fictícios variados e uma única conta geral de consulta.

## 2. Contexto

A VPS executa Debian 13 e Docker. O projeto demo atual é apropriado apenas para desenvolvimento: publica portas internas, usa dados parcialmente em memória e o seed padrão cria uma conta administrativa com TOTP fixo. O DNS temporário `srv1728931.hstgr.cloud` aponta para a VPS. Não há domínio próprio nem configuração Oracle/COMPASS.

## 3. Regras de Negócio

| Código | Regra                                                                                                                                          | Status     |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| RN-01  | A experiência pública identifica indicadores e relatórios como demonstração com dados fictícios.                                               | Confirmado |
| RN-02  | O acesso compartilhável é de leitura, cobre todos os setores e não é administrador.                                                            | Confirmado |
| RN-03  | A senha de consulta é compartilhada separadamente; segredos de assinatura/criptografia e senhas do SQL Server permanecem no host, fora do Git. | Confirmado |
| RN-04  | Somente o proxy HTTPS publica portas; API, SQL Server e Redis permanecem na rede Docker.                                                       | Confirmado |
| RN-05  | O banco de relatórios contém apenas os conjuntos SQL de demonstração; não há Oracle/COMPASS nem dados reais do cliente.                        | Confirmado |
| RN-06  | A troca remove a aplicação anterior e seus dados locais, mas preserva Debian, Docker e o acesso SSH por chave.                                 | Confirmado |

## 4. Fluxo Esperado

### Fluxo principal

1. Construir as imagens de produção e preparar os segredos fora do repositório.
2. Subir a nova stack em Compose isolado e conferir saúde antes da substituição.
3. Encerrar e remover a stack anterior e seus arquivos/imagens associados, conforme pedido explícito.
4. Publicar o Web por Caddy com certificado HTTPS automático para o hostname temporário.
5. Entregar ao usuário o endereço e a conta de consulta.

### Fluxos alternativos

- Se 80/443 não estiverem acessíveis pela rede do provedor, manter a stack pronta e informar o bloqueio de HTTPS sem expor serviços internos.
- Se o certificado não for emitido, verificar DNS público e firewall do provedor; não orientar o cliente a usar login em HTTP.

## 5. Critérios de Aceite

- [x] A URL temporária abre com certificado HTTPS válido; HTTP redireciona para HTTPS.
- [x] Login funciona com uma conta de papel `viewer` nos quatro setores; conta administrativa demo não é criada.
- [x] Dashboard retorna 12 KPIs com histórico em 12 pontos e o catálogo oferece quatro relatórios.
- [x] A consulta ao relatório financeiro executa no SQL Server demo com cinco linhas e usuário sem privilégios de escrita.
- [x] Somente TCP 80/443 são publicados; API, Redis e SQL Server não têm portas publicadas.
- [x] Os cinco serviços ficaram saudáveis; o SQL Server foi reiniciado e o seed repetível manteve a aplicação saudável.
- [x] A aplicação anterior, seus containers, arquivos, imagens e dados dos containers foram removidos da VPS conforme pedido.
- [x] Documentação registra limites, dados fictícios, validações e próximos passos.

## 6. Impacto Técnico

| Área           | Impacto                                                                                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Arquitetura    | Compose dedicado para prévia; Caddy termina TLS; API, Web, SQL Server e Redis em redes privadas.                                                               |
| Banco de dados | Usa SQL Server demo e seed reexecutável; não recebe dados reais. O seed repõe as tabelas demo ao reiniciar.                                                    |
| API            | Flag restrita ao ambiente de prévia cria uma conta viewer; modo demo e SQL Server configurados por ambiente.                                                   |
| Frontend       | Build de produção recebe `NEXT_PUBLIC_USE_MOCK_DATA=true` e URL relativa `/api`.                                                                               |
| Testes         | Builds, healthchecks e smoke checks de acesso; o job CI fornece Redis para as suítes E2E da API que inicializam o worker BullMQ.                               |
| Infraestrutura | A aplicação anterior na VPS foi substituída; portas 80/443 no proxy e volumes nomeados para os serviços de demonstração.                                       |
| Segurança      | Segredos gerados no host; usuário SQL sem privilégios de escrita; sem porta direta para API/DB/Redis; acesso público temporário limitado por papel de leitura. |

## 7. Testes Necessários

| Tipo                   | Arquivo                              | Descrição                                                               |
| ---------------------- | ------------------------------------ | ----------------------------------------------------------------------- |
| Build                  | Docker Compose preview               | Construção das imagens Web e API.                                       |
| Manual                 | URL HTTPS                            | Certificado, carregamento da Web, autenticação e navegação de consulta. |
| Integração operacional | `/health`, `/health/sql`, relatórios | Saúde da API/SQL Server e consulta aos relatórios de exemplo.           |
| Segurança operacional  | Containers, portas e arquivos        | Confirmar ausência de portas internas publicadas e segredos no Git.     |

## 8. Riscos

| Risco                                                                    | Impacto                                                 | Mitigação                                                                                               |
| ------------------------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Hostname temporário controlado pelo provedor pode mudar ou ser removido. | Link e certificado deixam de funcionar.                 | Tratar como preview temporária; apontar domínio próprio quando existir.                                 |
| Regras do firewall podem mudar e bloquear HTTP/HTTPS.                    | Cliente perde acesso ou renovação do certificado falha. | HTTPS e redirecionamento foram confirmados externamente; manter 80/443 liberadas no painel do provedor. |
| Usuários e algumas telas usam memória/fixtures.                          | Alterações não persistem e o histórico não é completo.  | Documentar a experiência como demo; não usar para operação real.                                        |
| Remoção do Compose antigo apaga a aplicação e seus dados.                | A aplicação anterior deixa de funcionar.                | Ação autorizada explicitamente pelo usuário; confirmar projeto e caminhos exatos antes da remoção.      |

## 9. Dependências

- Acesso SSH validado por chave.
- DNS público do hostname temporário apontando para a VPS.
- Portas 80 e 443 acessíveis no host e no firewall do provedor.
- Docker Engine e Docker Compose disponíveis.
