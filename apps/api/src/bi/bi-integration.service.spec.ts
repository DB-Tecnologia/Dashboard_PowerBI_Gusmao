import { BiIntegrationService } from './bi-integration.service';
import { BiRefreshService } from './bi-refresh.service';

describe('BiIntegrationService', () => {
  it('explicita que o SQL Server demo ainda nao possui o modelo agricola', async () => {
    const service = new BiIntegrationService(
      { get: () => 'sqlserver' } as never,
      {
        getProvider: () => 'sqlserver',
        checkHealth: async () => ({ status: 'ok', details: { configured: {} } }),
      } as never,
      {} as never,
      {} as never,
    );

    const response = await service.getDomain('productionSummary');

    expect(response).toEqual(
      expect.objectContaining({
        value: null,
        source: 'sqlserver-demo',
        status: 'not_configured',
        definitionVersion: 'bi-v1',
      }),
    );
    expect(response.warnings).toEqual(
      expect.arrayContaining([expect.stringContaining('SQL Server demo')]),
    );
  });

  it('agrega o resumo de producao somente com dados Oracle', async () => {
    const service = new BiIntegrationService(
      { get: () => 'oracle' } as never,
      {
        getProvider: () => 'oracle',
        checkHealth: async () => ({ status: 'ok', details: { configured: {} } }),
      } as never,
      {
        executeView: jest.fn(async ({ viewName }: { viewName: string }) =>
          viewName.includes('PLANTIO')
            ? [{ QTD_HA_EFETIVO: 10, DATA_PLANTIO: '2026-07-01' }]
            : [{ QTD_HA_EFETIVO: 4, DATA_LANCAMENTO: '2026-07-05' }],
        ),
      } as never,
      {} as never,
    );

    const response = await service.getDomain('productionSummary');

    expect(response.status).toBe('available');
    expect(response.source).toBe('oracle-compass');
    expect(response.value).toEqual(
      expect.objectContaining({
        plantedAreaHa: 10,
        harvestedAreaHa: 4,
        plantingOperations: 1,
        harvestOperations: 1,
      }),
    );
  });
});

describe('BiRefreshService', () => {
  it('reutiliza o mesmo job para uma chave de idempotencia repetida', async () => {
    const service = new BiRefreshService({
      getProvider: () => 'sqlserver',
      checkHealth: async () => ({ status: 'ok', details: { configured: {} } }),
    } as never);

    const first = await service.start({
      idempotencyKey: 'demo-window-1',
      requestedBy: 'admin@example.com',
    });
    const second = await service.start({
      idempotencyKey: 'demo-window-1',
      requestedBy: 'admin@example.com',
    });

    expect(second.runId).toBe(first.runId);
    expect(second.idempotent).toBe(true);
    expect(second.status).toBe('skipped');
    expect(second.counts).toEqual({ read: 0, written: 0 });
  });

  it('registra falha sem escrever snapshot quando a fonte esta indisponivel', async () => {
    const service = new BiRefreshService({
      getProvider: () => 'oracle',
      checkHealth: async () => ({ status: 'unavailable', details: { configured: {} } }),
    } as never);

    const run = await service.start({
      idempotencyKey: 'oracle-window-1',
      requestedBy: 'admin@example.com',
    });

    expect(run.status).toBe('failed');
    expect(run.counts).toEqual({ read: 0, written: 0 });
    expect(run.lastValidSnapshotAt).toBeNull();
    expect(run.errors).toHaveLength(1);
  });
});
