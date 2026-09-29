import { test, expect } from '@playwright/test';
import { loginAsUser } from './helpers';

test.describe('Autenticação', () => {
  test('login com credenciais válidas redireciona para dashboard', async ({ page }) => {
    await loginAsUser(page);
  });

  test('login com credenciais inválidas exibe erro', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('E-mail').fill('invalid@test.com');
    await page.getByLabel('Senha').fill('wrongpassword');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByText('E-mail ou senha inválidos.', { exact: true })).toBeVisible({
      timeout: 10_000,
    });
    await expect(page).not.toHaveURL(/\/app/);
  });

  test('logout redireciona para login', async ({ page }) => {
    await loginAsUser(page);

    const logoutButton = page.getByRole('button', { name: /sair|logout|exit/i }).first();
    await expect(logoutButton).toBeVisible({ timeout: 5_000 });
    await logoutButton.click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });
});

test.describe('Dashboard Home', () => {
  test('carrega a home executiva com KPIs após login', async ({ page }) => {
    await loginAsUser(page);

    await expect(page.getByRole('heading', { name: 'Visão geral' })).toBeVisible({
      timeout: 15_000,
    });
  });

  test('abre drill-down ao clicar em KPI', async ({ page }) => {
    await loginAsUser(page);

    const drilldownButton = page.getByRole('button', { name: /Abrir detalhamento de/ }).first();
    await expect(drilldownButton).toBeVisible({ timeout: 10_000 });
    await drilldownButton.click();
    await expect(page.getByRole('heading', { name: /^Drill-down/ })).toBeVisible({
      timeout: 10_000,
    });
  });

  test('seletor de dimensão aparece no drill-down', async ({ page }) => {
    await loginAsUser(page);

    const drilldownButton = page.getByRole('button', { name: /Abrir detalhamento de/ }).first();
    await expect(drilldownButton).toBeVisible({ timeout: 10_000 });
    await drilldownButton.click();
    await expect(page.getByRole('tablist')).toBeVisible({ timeout: 10_000 });
  });

  test('menu e drill-down funcionam em uma tela móvel', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginAsUser(page);

    const navigationToggle = page.locator('button[aria-controls="mobile-navigation-panel"]');
    await expect(navigationToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(navigationToggle).toHaveAttribute('aria-controls', 'mobile-navigation-panel');

    await navigationToggle.press('Enter');
    await expect(navigationToggle).toHaveAttribute('aria-expanded', 'true');
    const mobileNavigation = page.getByRole('navigation', { name: 'Navegação móvel' });
    await expect(mobileNavigation).toBeVisible();
    await expect(mobileNavigation.getByRole('link', { name: /Visão geral/ })).toBeVisible();

    await navigationToggle.press('Enter');
    await expect(mobileNavigation).toBeHidden();
    await expect(page.evaluate(() => document.documentElement.scrollWidth)).resolves.toBe(390);

    const drilldownButton = page.getByRole('button', { name: /Abrir detalhamento de/ }).first();
    await expect(drilldownButton).toBeVisible();
    await drilldownButton.click();
    await expect(page.getByRole('heading', { name: /^Drill-down/ })).toBeVisible();
  });
});

test.describe('Relatórios', () => {
  test('abre o catálogo de relatórios após login', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/app/reports');
    await expect(page.getByRole('heading', { name: 'Catálogo de dashboards' })).toBeVisible({
      timeout: 15_000,
    });
  });
});
