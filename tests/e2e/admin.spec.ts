import { expect, test } from '@playwright/test';

import {
  createGroupThroughAuthenticatedBrowser,
  getAdminCredentials,
  invalidTotpCode,
  loginAsAdmin,
  loginAsUser,
} from './helpers';

test.describe('Administração', () => {
  test('login administrativo com TOTP válido', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/app/admin');

    await expect(page.getByRole('heading', { name: 'Painel administrativo' })).toBeVisible();
  });

  test('login administrativo com TOTP inválido exibe erro', async ({ page }) => {
    const credentials = getAdminCredentials();

    await page.goto('/login');
    await page.getByLabel('E-mail').fill(credentials.email);
    await page.getByLabel('Senha').fill(credentials.password);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.locator('#totp')).toBeVisible({ timeout: 10_000 });
    await page.locator('#totp').fill(invalidTotpCode(credentials.totpSecret));
    await page.getByRole('button', { name: 'Verificar e entrar' }).click();

    await expect(page.getByText('E-mail ou senha inválidos.', { exact: true })).toBeVisible({
      timeout: 10_000,
    });
    await expect(page).not.toHaveURL(/\/app/);
  });

  test('usuário comum não acessa a administração', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/app/admin/users');

    await expect(page.getByRole('heading', { name: /carregar os usuários/i })).toBeVisible({
      timeout: 15_000,
    });
  });

  test('carrega a lista administrativa de usuários', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/app/admin/users');

    await expect(page.getByRole('heading', { name: 'Gerenciamento de usuários' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Usuários cadastrados' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Novo usuário' })).toBeVisible();
  });

  test('carrega grupos e cria/exclui grupo temporário', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/app/admin/groups');

    await expect(page.getByRole('heading', { name: 'Gerenciamento de grupos' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Novo grupo' })).toBeVisible();

    const groupName = `E2E Grupo ${Date.now()}`;
    await createGroupThroughAuthenticatedBrowser(page, groupName);
    await page.reload();

    const groupRow = page.getByRole('row').filter({ hasText: groupName });
    await expect(groupRow).toBeVisible({ timeout: 10_000 });

    page.once('dialog', (dialog) => dialog.accept());
    await groupRow.getByRole('button', { name: 'Excluir' }).click();
    await expect(groupRow).not.toBeVisible({ timeout: 10_000 });
  });
});
