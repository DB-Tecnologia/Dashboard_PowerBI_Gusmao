import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { DatabaseProviderService } from '../sql-server/database-provider.service';

export type BiRefreshStatus = 'running' | 'completed' | 'failed' | 'skipped';

export interface BiRefreshInput {
  idempotencyKey: string;
  requestedBy: string;
}

export interface BiRefreshRun {
  runId: string;
  idempotencyKey: string;
  provider: 'sqlserver' | 'oracle';
  requestedBy: string;
  status: BiRefreshStatus;
  startedAt: string;
  finishedAt: string | null;
  counts: { read: number; written: number };
  errors: string[];
  warnings: string[];
  watermark: string | null;
  lastValidSnapshotAt: string | null;
  message: string;
  idempotent?: boolean;
}

@Injectable()
export class BiRefreshService {
  private readonly runs = new Map<string, BiRefreshRun>();

  constructor(private readonly databaseProviderService: DatabaseProviderService) {}

  async start(input: BiRefreshInput): Promise<BiRefreshRun> {
    const existing = this.runs.get(input.idempotencyKey);

    if (existing) {
      return { ...existing, idempotent: true };
    }

    const startedAt = new Date().toISOString();
    const provider = this.databaseProviderService.getProvider();
    const run: BiRefreshRun = {
      runId: randomUUID(),
      idempotencyKey: input.idempotencyKey,
      provider,
      requestedBy: input.requestedBy,
      status: 'running',
      startedAt,
      finishedAt: null,
      counts: { read: 0, written: 0 },
      errors: [],
      warnings: [],
      watermark: null,
      lastValidSnapshotAt: null,
      message: 'Validando a fonte antes da atualizacao.',
    };

    this.runs.set(input.idempotencyKey, run);

    const health = await this.databaseProviderService.checkHealth();
    run.finishedAt = new Date().toISOString();

    if (health.status !== 'ok') {
      run.status = 'failed';
      run.errors.push('A fonte de dados esta indisponivel; nenhum snapshot foi alterado.');
      run.message = 'Atualizacao interrompida por indisponibilidade da fonte.';
      return { ...run };
    }

    run.status = 'skipped';
    run.warnings.push(
      'A carga de BI ainda depende do mapeamento Oracle/COMPASS; somente o smoke check foi executado.',
    );
    run.message = 'Fonte validada. Nenhum dado foi escrito nesta etapa de preparacao.';

    return { ...run };
  }

  get(runId: string): BiRefreshRun {
    const run = [...this.runs.values()].find((candidate) => candidate.runId === runId);

    if (!run) {
      throw new NotFoundException('Execucao de atualizacao nao encontrada.');
    }

    return { ...run };
  }
}
