import { createHmac } from 'node:crypto';

import { expect, type Page } from '@playwright/test';

const AUTH_STORAGE_KEY = 'dashboard-power-bi:auth-session';

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Variável de ambiente E2E obrigatória não configurada: ${name}`);
  }

  return value;
}

export function getUserCredentials() {
  return {
    email: requiredEnv('E2E_EMAIL'),
    password: requiredEnv('E2E_PASSWORD'),
  };
}

export function getAdminCredentials() {
  return {
    email: requiredEnv('E2E_ADMIN_EMAIL'),
    password: requiredEnv('E2E_ADMIN_PASSWORD'),
    totpSecret: requiredEnv('E2E_ADMIN_TOTP_SECRET'),
  };
}

export async function loginAsUser(page: Page): Promise<void> {
  const credentials = getUserCredentials();

  await page.goto('/login');
  await page.getByLabel('E-mail').fill(credentials.email);
  await page.getByLabel('Senha').fill(credentials.password);
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page).toHaveURL(/\/app/, { timeout: 15_000 });
}

export async function loginAsAdmin(page: Page): Promise<void> {
  const credentials = getAdminCredentials();

  await page.goto('/login');
  await page.getByLabel('E-mail').fill(credentials.email);
  await page.getByLabel('Senha').fill(credentials.password);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.locator('#totp')).toBeVisible({ timeout: 10_000 });
  await page.locator('#totp').fill(generateTotpCode(credentials.totpSecret));
  await page.getByRole('button', { name: 'Verificar e entrar' }).click();

  await expect(page).toHaveURL(/\/app/, { timeout: 15_000 });
}

export function generateTotpCode(secret: string, timestamp = Date.now()): string {
  const counter = Math.floor(timestamp / 1_000 / 30);
  const secretBytes = decodeBase32(secret);
  const counterBuffer = Buffer.alloc(8);
  const high = Math.floor(counter / 0x100000000);
  const low = counter % 0x100000000;

  counterBuffer.writeUInt32BE(high, 0);
  counterBuffer.writeUInt32BE(low, 4);

  const digest = createHmac('sha1', secretBytes).update(counterBuffer).digest();
  const offset = digest.at(-1)! & 0x0f;
  const code =
    ((digest.at(offset)! & 0x7f) << 24) |
    ((digest.at(offset + 1)! & 0xff) << 16) |
    ((digest.at(offset + 2)! & 0xff) << 8) |
    (digest.at(offset + 3)! & 0xff);

  return (code % 1_000_000).toString().padStart(6, '0');
}

export function invalidTotpCode(secret: string): string {
  const validCode = generateTotpCode(secret);
  const replacement = validCode[0] === '0' ? '1' : '0';

  return `${replacement}${validCode.slice(1)}`;
}

export async function getAuthenticatedSession(page: Page): Promise<{
  accessToken: string;
  tokenType: string;
}> {
  return page.evaluate((storageKey) => {
    const rawSession = window.sessionStorage.getItem(storageKey);

    if (!rawSession) {
      throw new Error('Sessão E2E não encontrada.');
    }

    const session = JSON.parse(rawSession) as { accessToken?: string; tokenType?: string };

    if (!session.accessToken || !session.tokenType) {
      throw new Error('Sessão E2E inválida.');
    }

    return { accessToken: session.accessToken, tokenType: session.tokenType };
  }, AUTH_STORAGE_KEY);
}

export async function createGroupThroughAuthenticatedBrowser(
  page: Page,
  name: string,
): Promise<void> {
  const session = await getAuthenticatedSession(page);
  const apiUrl = process.env.E2E_API_URL ?? 'http://localhost:3001';

  await page.request.get(`${apiUrl}/admin/groups`, {
    headers: { Authorization: `${session.tokenType} ${session.accessToken}` },
  });

  const csrfCookie = (await page.context().cookies(apiUrl)).find(
    (cookie) => cookie.name === 'csrf-token',
  )?.value;

  const response = await page.request.post(`${apiUrl}/admin/groups`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${session.tokenType} ${session.accessToken}`,
      ...(csrfCookie ? { 'x-csrf-token': csrfCookie } : {}),
    },
    data: {
      name,
      description: 'Grupo temporário da suíte E2E.',
      roles: ['viewer'],
      sectors: ['financeiro'],
      permissionIds: [],
    },
  });
  const body = await response.text();

  expect(response.ok(), `Falha ao criar grupo E2E (${response.status()}): ${body}`).toBe(true);
}

function decodeBase32(encoded: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const map = new Map<string, number>();
  const output: number[] = [];
  let bits = 0;
  let value = 0;

  for (let index = 0; index < alphabet.length; index += 1) {
    map.set(alphabet[index]!, index);
  }

  for (const character of encoded.toUpperCase().replace(/=+$/, '')) {
    const digit = map.get(character);

    if (digit === undefined) {
      throw new Error('E2E_ADMIN_TOTP_SECRET deve estar em base32.');
    }

    value = (value << 5) | digit;
    bits += 5;

    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }

  return Buffer.from(output);
}
