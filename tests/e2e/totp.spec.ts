import { expect, test } from '@playwright/test';

import { generateTotpCode, getUserCredentials, invalidTotpCode, loginAsUser } from './helpers';

test.describe('2FA no perfil', () => {
  test('inicia configuração, rejeita código inválido, ativa e limpa 2FA', async ({ page }) => {
    const credentials = getUserCredentials();

    await loginAsUser(page);
    await page.goto('/app/profile');
    await expect(page.getByRole('heading', { name: 'Perfil do usuário' })).toBeVisible();
    await page.getByRole('button', { name: 'Ativar 2FA' }).click();

    await expect(page.locator('#verify-totp')).toBeVisible({ timeout: 10_000 });
    const secret = (await page.locator('code').first().textContent())?.trim();
    expect(secret).toBeTruthy();

    await page.locator('#verify-totp').fill(invalidTotpCode(secret!));
    await page.getByRole('button', { name: 'Verificar e ativar' }).click();
    await expect(page.locator('p[role="alert"]')).toContainText('Código inválido');

    page.once('dialog', (dialog) => dialog.accept());
    await page.locator('#verify-totp').fill(generateTotpCode(secret!));
    await page.getByRole('button', { name: 'Verificar e ativar' }).click();
    await expect(page.getByText('2FA ativado')).toBeVisible({ timeout: 10_000 });

    page.once('dialog', (dialog) => dialog.accept());
    await page.locator('#disable-totp').fill(generateTotpCode(secret!));
    await page.locator('#disable-totp-password').fill(credentials.password);
    await page.getByRole('button', { name: 'Desativar 2FA' }).click();
    await expect(page.getByRole('button', { name: 'Ativar 2FA' })).toBeVisible({ timeout: 10_000 });
  });
});
