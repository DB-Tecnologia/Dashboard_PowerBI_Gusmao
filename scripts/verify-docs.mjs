import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();

const requiredFiles = [
  'README.md',
  'AGENTS.md',
  'PRD.md',
  'ROADMAP.md',
  'docs/INDEX.md',
  'docs/architecture/ARQUITETURA.md',
  'docs/architecture/BANCO_DADOS.md',
  'docs/product/ESCOPO.md',
  'docs/governance/CONTEXTO.md',
  'docs/governance/RELATORIO.md',
  'docs/governance/MEMORIA_PROJETO.md',
  'docs/reference/api.md',
  'docs/reference/web.md',
  'docs/decisions/README.md',
  'docs/decisions/ADR-0001-monorepo.md',
  'docs/decisions/ADR-0002-tooling-qualidade.md',
  'docs/decisions/ADR-0003-nestjs-api.md',
  'docs/decisions/ADR-0004-nextjs-web.md',
  'docs/decisions/ADR-0005-design-system-base.md',
  'docs/decisions/ADR-0006-docker-compose-dev.md',
  'docs/specs/README.md',
];

const missingFiles = requiredFiles.filter((file) => !existsSync(resolve(root, file)));

if (missingFiles.length > 0) {
  console.error('Documentação obrigatória ausente:');
  for (const file of missingFiles) console.error(`- ${file}`);
  process.exit(1);
}

const readme = readFileSync(resolve(root, 'README.md'), 'utf8');

const requiredReadmeSections = [
  '## Setup rápido',
  '## Checklist de setup local',
  '## Desenvolvimento sem Docker',
  '## Desenvolvimento com Docker',
  '## Arquitetura e monorepo',
  '## Decisões arquiteturais',
  '## Troubleshooting',
  '## Segurança',
];

const missingSections = requiredReadmeSections.filter((section) => !readme.includes(section));

if (missingSections.length > 0) {
  console.error('README sem seções obrigatórias:');
  for (const section of missingSections) console.error(`- ${section}`);
  process.exit(1);
}

const requiredCommands = [
  'pnpm install',
  'pnpm verify:workspace',
  'pnpm verify:env',
  'pnpm verify:docker',
  'pnpm verify:docs',
  'pnpm quality',
  'pnpm dev:api',
  'pnpm dev:web',
  'pnpm docker:dev',
];

const missingCommands = requiredCommands.filter((command) => !readme.includes(command));

if (missingCommands.length > 0) {
  console.error('README sem comandos obrigatórios:');
  for (const command of missingCommands) console.error(`- ${command}`);
  process.exit(1);
}

const memoryPath = resolve(root, 'docs/governance/MEMORIA_PROJETO.md');
const memory = readFileSync(memoryPath, 'utf8');

const requiredMemorySections = [
  '## Objetivo e leitura',
  '## Snapshot vigente',
  '## Produto, stack e topologia',
  '## Arquitetura e fontes de dados',
  '## Decisões técnicas relevantes',
  '## Linha do tempo de tarefas',
  '## Pendências e bloqueios',
  '## Protocolo de atualização',
  '## Segurança e dados proibidos',
];

const missingMemorySections = requiredMemorySections.filter((section) => !memory.includes(section));

if (missingMemorySections.length > 0) {
  console.error('Memória persistida sem seções obrigatórias:');
  for (const section of missingMemorySections) console.error(`- ${section}`);
  process.exit(1);
}

const index = readFileSync(resolve(root, 'docs/INDEX.md'), 'utf8');

if (!index.includes('governance/MEMORIA_PROJETO.md')) {
  console.error('Índice da documentação sem referência à memória persistida.');
  process.exit(1);
}

const forbiddenSecretPatterns = [
  /BEGIN PRIVATE KEY/i,
  /Bearer\s+eyJ/i,
  /(?:JWT_(?:ACCESS|REFRESH)_SECRET|TOTP_ENCRYPTION_KEY|(?:SQLSERVER|ORACLE|SMTP)_PASSWORD)\s*=\s*[^\s`]+/i,
];

const foundForbiddenPatterns = forbiddenSecretPatterns.filter((pattern) => pattern.test(memory));

if (foundForbiddenPatterns.length > 0) {
  console.error('Memória persistida contém valores sensíveis ou credenciais conhecidas:');
  for (const pattern of foundForbiddenPatterns) console.error(`- ${pattern}`);
  process.exit(1);
}

console.log('Documentação e memória persistida validadas com sucesso.');
