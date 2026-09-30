# Viabilidade da VPS para prévia ao cliente — 2026-09-30

## Conclusão

A VPS tem recursos suficientes para hospedar uma instância isolada de demonstração do Dashboard Gusmão. O host já executa outra aplicação em Docker, que foi preservada. O Dashboard Gusmão ainda não foi instalado.

A máquina tem Debian GNU/Linux 13, Docker Engine 26.1.5 e Docker Compose 2.26.1; dispõe de 4 vCPUs, 15 GiB de RAM e cerca de 181 GiB livres em disco. A memória disponível estava em aproximadamente 14 GiB durante a inspeção. O acesso de saída ao registry do Docker respondeu; isso confirma resolução de nomes e conectividade externa para baixar imagens.

## Acesso e integridade

- A identidade SSH do servidor foi comparada com o painel do provedor antes de autenticar.
- A chave pública `Dev.RuiDiniz` foi instalada para o usuário `root`, com permissões restritas, e o login por chave foi validado sem autenticação por senha.
- A chave privada permaneceu no computador de desenvolvimento. Endereço do servidor, fingerprints, credenciais e conteúdo de arquivos de ambiente não são registrados neste documento.
- A autenticação SSH por senha ainda permanece habilitada no host. A senha deve ser trocada; qualquer desativação do acesso por senha deve ocorrer somente depois de confirmar o acesso por chave em uma nova sessão.

## O que já existe na VPS

- Há um projeto Compose independente ativo com quatro containers saudáveis e um container de seed encerrado com sucesso. A inspeção usou metadados de containers, imagens, portas, mounts e nomes/tamanhos da pasta do projeto; arquivos de ambiente, logs e dados da aplicação não foram lidos.
- No instante da coleta, cada container ativo usava menos de 3% de CPU e entre 8 e 112 MiB de RAM.
- Os serviços Web/API desse projeto já publicam portas no host. PostgreSQL e Redis estão limitados a portas de loopback. Não houve conflito observado nas portas padrão de HTTP/HTTPS nem na porta 8082 usada pelo Nginx do Compose de produção deste repositório.
- O Compose existente não declara volumes nomeados, e os containers consultados não reportam mounts. Antes de reiniciá-los, recriá-los ou remover imagens, é necessário confirmar como os dados persistem. Nenhum container, imagem, volume ou arquivo da aplicação existente foi alterado.
- UFW não está instalado, `nftables` não está disponível e a política `INPUT` do `iptables` aparece como `ACCEPT`. O firewall configurado no painel do provedor não é visível pelo acesso SSH e ainda precisa ser conferido.
- Docker reporta cerca de 5,4 GB em imagens e aproximadamente 4,9 GB reclamáveis. Esse espaço não foi limpo: imagens sem tag podem ser necessárias para rollback do projeto existente.

## Compatibilidade com este projeto

O repositório oferece um Compose demo para desenvolvimento local e um Compose de produção; nenhum está pronto, sem ajustes, para uma prévia pública ao cliente:

- O Compose demo inicia Web e API em modo de desenvolvimento e publica também API, SQL Server e Redis no host.
- O Compose de produção usa Nginx somente em HTTP, não inclui o SQL Server de demonstração e define Oracle como fonte padrão. A integração Oracle/COMPASS não está configurada.
- A demonstração sintética depende de `DATA_MODE=mock` na API e `NEXT_PUBLIC_USE_MOCK_DATA=true` na Web. O Dockerfile de produção não recebe atualmente a segunda variável como argumento de build.
- O ambiente de produção requer segredos próprios, incluindo `JWT_ACCESS_SECRET` e `TOTP_ENCRYPTION_KEY`. Sem persistência Supabase configurada, partes da plataforma recorrem à memória e perdem dados ao reiniciar.
- O seed de demonstração cria contas administrativas e de consulta quando as variáveis de demo são preenchidas; não deve ser exposto como está em um ambiente público sem um fluxo de bootstrap e credenciais apropriados.

## Trabalho necessário antes de enviar ao cliente

1. Criar um perfil Compose de prévia separado, com nome de projeto, rede, armazenamento e diretório próprios; não usar `docker compose down`, `docker system prune` ou portas já ocupadas pelo projeto existente.
2. Servir a aplicação por um domínio/subdomínio controlado, com DNS apontado para a VPS e HTTPS válido. Só o reverse proxy deve receber tráfego público; API, Redis e SQL Server ficam restritos à rede Docker.
3. Preparar imagens de produção que identifiquem explicitamente dados sintéticos, habilitem o modo mock no build da Web e na API e, se o cliente testar relatórios SQL, incluam o SQL Server demo isolado.
4. Criar um bootstrap seguro para um usuário de consulta com senha exclusiva; revisar a conta administrativa demo e seu TOTP fixo no código antes de disponibilizar qualquer acesso externo.
5. Definir segredos fora do repositório, política de acesso da porta SSH, firewall de host/provedor, retenção, backup e forma de reiniciar/rollback.
6. Validar HTTPS, login de consulta, dashboard, relatórios incluídos, saúde dos containers e ausência de exposição de portas internas antes de compartilhar o endereço.

## Limites desta inspeção

Foi feito inventário de sistema, capacidade, Docker, containers, listeners, autenticação SSH e conectividade de saída. Não foram lidos `.env`, logs, bancos, código, documentos ou conteúdo de containers do outro projeto. Também não foram executados scans externos de segurança, atualizações de sistema, backups, alterações de firewall, rotação da senha root ou instalação do Dashboard Gusmão.
