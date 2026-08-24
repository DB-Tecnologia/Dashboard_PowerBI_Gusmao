export type BiDomain = 'productionSummary' | 'grains' | 'cotton' | 'ginning' | 'romaneios';

export type BiSource = 'sqlserver-demo' | 'oracle-compass';
export type BiStatus = 'available' | 'unavailable' | 'not_configured';

export interface BiEnvelope<TValue> {
  value: TValue | null;
  unit: string;
  dataAsOf: string | null;
  lastSyncedAt: string | null;
  source: BiSource;
  status: BiStatus;
  definitionVersion: 'bi-v1';
  warnings: string[];
}

export interface ProductionSummaryValue {
  plantedAreaHa: number;
  harvestedAreaHa: number;
  plantingOperations: number;
  harvestOperations: number;
}

export interface BiFilterDefinition {
  key: 'safra' | 'fazenda' | 'cultura' | 'variedade' | 'status';
  label: string;
  options: string[];
}

export interface BiFiltersValue {
  dimensions: BiFilterDefinition[];
}
