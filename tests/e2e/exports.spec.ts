import { expect, test, type Page } from '@playwright/test';

import { loginAsUser } from './helpers';

async function openReportWithResults(page: Page): Promise<void> {
  await loginAsUser(page);
  await page.goto('/app/reports');
  await page.getByRole('button', { name: 'Abrir dashboard' }).first().click();
  await expect(page.getByRole('button', { name: 'Executar consulta' })).toBeVisible();
  await page.getByRole('button', { name: 'Executar consulta' }).click();
  await expect(page.getByText('Resultados')).toBeVisible({ timeout: 15_000 });
}

test.describe('Exportações', () => {
  test('consulta relatório e exibe controle de exportação', async ({ page }) => {
    await openReportWithResults(page);

    await expect(page.getByRole('button', { name: 'Exportar' })).toBeVisible();
  });

  test('abre o modal e solicita exportação em CSV', async ({ page }) => {
    await openReportWithResults(page);
    await page.getByRole('button', { name: 'Exportar' }).click();

    await expect(page.getByRole('heading', { name: 'Exportar relatório' })).toBeVisible();
    await page.getByRole('button', { name: 'CSV', exact: true }).click();
    await page.getByRole('button', { name: 'Exportar CSV' }).click();

    await expect(page.getByText('Exportação em CSV solicitada com sucesso.')).toBeVisible({
      timeout: 15_000,
    });
  });

  test('exibe exportação concluída e permite download', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/app/exports');

    await expect(page.getByRole('heading', { name: 'Historico de exportacoes' })).toBeVisible();
    await expect(page.getByText('Concluido')).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('link', { name: 'Baixar' }).first().click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('financeiro-mensal.pdf');
  });
});
