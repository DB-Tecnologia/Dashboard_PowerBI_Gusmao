import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const developmentPath = resolve(root, 'infra/env/.env.example');
const productionPath = resolve(root, 'infra/env/.env.production.example');

function parseEnvFile(path) {
  const values = new Map();

  for (const rawLine of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const separator = line.indexOf('=');

    if (separator <= 0) {
      continue;
    }

    values.set(line.slice(0, separator), line.slice(separator + 1));
  }

  return values;
}

const missingFiles = [developmentPath, productionPath].filter((path) => !existsSync(path));

if (missingFiles.length > 0) {
  console.error('Exemplos de ambiente ausentes:');
  for (const path of missingFiles) console.error(`- ${path}`);
  process.exit(1);
}

const development = parseEnvFile(developmentPath);
const production = parseEnvFile(productionPath);
const requiredProductionKeys = new Set([...development.keys(), 'NGINX_PORT']);
const missingKeys = [...requiredProductionKeys].filter((key) => !production.has(key));

if (missingKeys.length > 0) {
  console.error('.env.production.example sem variáveis obrigatórias:');
  for (const key of missingKeys) console.error(`- ${key}`);
  process.exit(1);
}

const expectedValues = {
  NODE_ENV: 'production',
  DATABASE_PROVIDER: 'oracle',
  REDIS_HOST: 'redis',
  TRUST_PROXY_HOPS: '1',
  NEXT_PUBLIC_API_URL: '/api',
  CORS_ORIGINS: 'https://YOUR_PUBLIC_DOMAIN',
};

const invalidValues = Object.entries(expectedValues).filter(
  ([key, expected]) => production.get(key) !== expected,
);

if (invalidValues.length > 0) {
  console.error('Valores obrigatórios do ambiente de produção estão incorretos:');
  for (const [key, expected] of invalidValues) {
    console.error(`- ${key}: esperado ${expected}`);
  }
  process.exit(1);
}

const requiredEmptySecrets = [
  'AUTH_DEMO_USER_EMAIL',
  'AUTH_DEMO_USER_PASSWORD',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SMTP_PASSWORD',
  'SQLSERVER_PASSWORD',
  'ORACLE_PASSWORD',
  'TOTP_ENCRYPTION_KEY',
];
const populatedSecrets = requiredEmptySecrets.filter((key) => production.get(key));

if (populatedSecrets.length > 0) {
  console.error('O template de produção não pode conter credenciais preenchidas:');
  for (const key of populatedSecrets) console.error(`- ${key}`);
  process.exit(1);
}

const forbiddenValues = ['Admin123!', 'dev-secret-change-me', 'YourStrong!Passw0rd123', 'oracle'];
const forbiddenMatches = forbiddenValues.filter((value) => {
  if (value === 'oracle') {
    return /^(ORACLE_PASSWORD|SQLSERVER_PASSWORD)=oracle$/im.test(
      readFileSync(productionPath, 'utf8'),
    );
  }

  return readFileSync(productionPath, 'utf8').includes(value);
});

if (forbiddenMatches.length > 0) {
  console.error('O template de produção contém valores de demonstração proibidos:');
  for (const value of forbiddenMatches) console.error(`- ${value}`);
  process.exit(1);
}

console.log('Exemplos de ambiente validados com sucesso.');
