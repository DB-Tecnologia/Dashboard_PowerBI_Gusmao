import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  BiDomain,
  BiEnvelope,
  BiFiltersValue,
  BiSource,
  BiStatus,
  ProductionSummaryValue,
} from './bi.types';
import { BiRefreshService } from './bi-refresh.service';
import { DatabaseProviderService } from '../sql-server/database-provider.service';
import { SqlQueryService } from '../sql-server/sql-query.service';

const DEFINITION_VERSION = 'bi-v1' as const;

type PlantioRow = { QTD_HA_EFETIVO: number | null; DATA_PLANTIO: string | Date | null };
type ColheitaRow = { QTD_HA_EFETIVO: number | null; DATA_LANCAMENTO: string | Date | null };

@Injectable()
export class BiIntegrationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly databaseProviderService: DatabaseProviderService,
    private readonly sqlQueryService: SqlQueryService,
    private readonly biRefreshService: BiRefreshService,
  ) {}

  async getSource() {
    const health = await this.databaseProviderService.checkHealth();
    const provider = this.databaseProviderService.getProvider();

    return {
      provider,
      source: this.toSource(provider),
      environment: this.configService.get<string>('NODE_ENV', 'development'),
      status: health.status,
      configured: health.details.configured,
      latencyMs: health.details.latencyMs ?? null,
      warnings: health.status === 'ok' ? [] : ['A fonte configurada nao esta acessivel.'],
    };
  }

  async getFreshness() {
    const source = await this.getSource();

    return {
      source: source.source,
      provider: source.provider,
      status: source.status,
      dataAsOf: null,
      lastSyncedAt: null,
      watermark: null,
      warnings:
        source.warnings.length > 0
          ? source.warnings
          : ['Nenhum snapshot de BI foi registrado nesta instalacao.'],
    };
  }

  async getFilters(): Promise<BiEnvelope<BiFiltersValue>> {
    const source = await this.getSource();
    const status: BiStatus = source.status === 'ok' ? 'available' : 'unavailable';

    return this.envelope(
      {
        dimensions: [
          { key: 'safra', label: 'Safra', options: [] },
          { key: 'fazenda', label: 'Fazenda', options: [] },
          { key: 'cultura', label: 'Cultura', options: [] },
          { key: 'variedade', label: 'Variedade', options: [] },
          { key: 'status', label: 'Status', options: [] },
        ],
      },
      'dimension',
      source.source,
      status,
      source.status === 'ok'
        ? ['Opcoes de filtro serao preenchidas pelo snapshot Oracle/COMPASS.']
        : source.warnings,
    );
  }

  async getDomain(domain: BiDomain): Promise<BiEnvelope<ProductionSummaryValue>> {
    const source = await this.getSource();

    if (source.status !== 'ok') {
      return this.envelope<ProductionSummaryValue>(
        null,
        'n/a',
        source.source,
        'unavailable',
        source.warnings,
      );
    }

    if (source.provider !== 'oracle') {
      return this.envelope<ProductionSummaryValue>(null, 'n/a', source.source, 'not_configured', [
        'SQL Server demo esta saudavel, mas nao possui o modelo agricola de producao.',
      ]);
    }

    if (domain !== 'productionSummary') {
      return this.envelope<ProductionSummaryValue>(null, 'n/a', source.source, 'not_configured', [
        `O dominio ${domain} aguarda a validacao da view Oracle/COMPASS correspondente.`,
      ]);
    }

    try {
      const [plantio, colheita] = await Promise.all([
        this.sqlQueryService.executeView<PlantioRow>(
          {
            viewName: 'EXTRATOR.EXT_COL_OS_PLANTIO',
            columns: ['QTD_HA_EFETIVO', 'DATA_PLANTIO'],
          },
          'oracle',
        ),
        this.sqlQueryService.executeView<ColheitaRow>(
          {
            viewName: 'EXTRATOR.EXT_COL_OS_COLHEITA',
            columns: ['QTD_HA_EFETIVO', 'DATA_LANCAMENTO'],
          },
          'oracle',
        ),
      ]);

      const value = {
        plantedAreaHa: sumArea(plantio),
        harvestedAreaHa: sumArea(colheita),
        plantingOperations: plantio.length,
        harvestOperations: colheita.length,
      };
      const dataAsOf = maxDate([
        ...plantio.map((row) => row.DATA_PLANTIO),
        ...colheita.map((row) => row.DATA_LANCAMENTO),
      ]);

      return this.envelope(value, 'ha', source.source, 'available', [], dataAsOf);
    } catch {
      return this.envelope<ProductionSummaryValue>(null, 'ha', source.source, 'unavailable', [
        'A fonte Oracle respondeu ao healthcheck, mas a consulta de producao falhou.',
      ]);
    }
  }

  startRefresh(idempotencyKey: string, requestedBy: string) {
    return this.biRefreshService.start({ idempotencyKey, requestedBy });
  }

  getRefresh(runId: string) {
    return this.biRefreshService.get(runId);
  }

  private envelope<TValue>(
    value: TValue | null,
    unit: string,
    source: BiSource,
    status: BiStatus,
    warnings: string[],
    dataAsOf: string | null = null,
  ): BiEnvelope<TValue> {
    return {
      value,
      unit,
      dataAsOf,
      lastSyncedAt: null,
      source,
      status,
      definitionVersion: DEFINITION_VERSION,
      warnings,
    };
  }

  private toSource(provider: 'sqlserver' | 'oracle'): BiSource {
    return provider === 'oracle' ? 'oracle-compass' : 'sqlserver-demo';
  }
}

function sumArea(rows: Array<{ QTD_HA_EFETIVO: number | null }>): number {
  return round(rows.reduce((total, row) => total + Number(row.QTD_HA_EFETIVO ?? 0), 0));
}

function maxDate(values: Array<string | Date | null>): string | null {
  const dates = values
    .map((value) => (value ? new Date(value) : null))
    .filter((value): value is Date => value !== null && !Number.isNaN(value.getTime()));

  if (dates.length === 0) {
    return null;
  }

  return new Date(Math.max(...dates.map((date) => date.getTime()))).toISOString();
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
