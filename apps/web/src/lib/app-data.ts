import { createClient } from '@supabase/supabase-js';

import type { KpiItem } from '@/lib/kpis';

export type NotificationItem = {
  id: string;
  notification_type: 'report_available' | 'access_granted' | 'export_ready' | 'alert';
  title: string;
  message: string;
  related_resource_id?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
};

export type ExportJobItem = {
  id: string;
  report_id: string;
  export_format: 'pdf' | 'excel' | 'csv' | 'json';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  file_url?: string;
  file_size_bytes?: number;
  error_message?: string;
  created_at: string;
  completed_at?: string;
  expires_at: string;
};

export type SystemSettingItem = {
  id: string;
  setting_key: string;
  setting_value: unknown;
  description?: string;
  is_sensitive: boolean;
  updated_at: string;
};

export interface AppDataClient {
  listKpis(): Promise<KpiItem[]>;
  listNotifications(): Promise<NotificationItem[]>;
  markNotificationAsRead(id: string): Promise<void>;
  markAllNotificationsAsRead(ids: string[]): Promise<void>;
  listExportJobs(): Promise<ExportJobItem[]>;
  listSystemSettings(): Promise<SystemSettingItem[]>;
}

export const demoKpis: KpiItem[] = [
  {
    id: 'receita-mensal',
    title: 'Receita mensal',
    sector: 'Financeiro',
    value: 120000,
    previousValue: 100000,
    unit: 'currency',
  },
  {
    id: 'margem-operacional',
    title: 'Margem operacional',
    sector: 'Financeiro',
    value: 0.32,
    previousValue: 0.3,
    unit: 'percent',
  },
  {
    id: 'leads-qualificados',
    title: 'Leads qualificados',
    sector: 'Comercial',
    value: 430,
    previousValue: 400,
    unit: 'number',
  },
  {
    id: 'sla-operacional',
    title: 'SLA operacional',
    sector: 'Operações',
    value: 0.92,
    previousValue: 0.9,
    unit: 'percent',
  },
  {
    id: 'dashboards-ativos',
    title: 'Dashboards ativos',
    sector: 'BI',
    value: 18,
    previousValue: 16,
    unit: 'number',
  },
  {
    id: 'exportacoes-mensais',
    title: 'Exportações mensais',
    sector: 'BI',
    value: 240,
    previousValue: 220,
    unit: 'number',
  },
  {
    id: 'area-plantada',
    title: 'Área plantada',
    sector: 'Produção',
    value: 14820,
    previousValue: 13940,
    unit: 'number',
  },
  {
    id: 'area-colhida',
    title: 'Área colhida',
    sector: 'Produção',
    value: 11360,
    previousValue: 10520,
    unit: 'number',
  },
  {
    id: 'contratos-ativos',
    title: 'Contratos ativos',
    sector: 'Comercial',
    value: 186,
    previousValue: 172,
    unit: 'number',
  },
  {
    id: 'volume-entregue',
    title: 'Volume entregue',
    sector: 'Comercial',
    value: 4280,
    previousValue: 3970,
    unit: 'number',
  },
  {
    id: 'fardos-beneficiados',
    title: 'Fardos beneficiados',
    sector: 'Algodoeira',
    value: 68400,
    previousValue: 65120,
    unit: 'number',
  },
  {
    id: 'embarques-no-prazo',
    title: 'Embarques no prazo',
    sector: 'Algodoeira',
    value: 0.89,
    previousValue: 0.84,
    unit: 'percent',
  },
];

function demoTimestamp(dayOffset: number, hour = 9): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + dayOffset);
  date.setUTCHours(hour, 0, 0, 0);
  return date.toISOString();
}

export const demoNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    notification_type: 'export_ready',
    title: 'Exportação de receita pronta',
    message: 'O relatório financeiro mensal fictício já pode ser baixado.',
    related_resource_id: 'export-1',
    is_read: false,
    created_at: demoTimestamp(0, 9),
  },
  {
    id: 'notif-2',
    notification_type: 'access_granted',
    title: 'Acesso ao setor Comercial liberado',
    message: 'O perfil de demonstração pode consultar o dashboard Comercial.',
    related_resource_id: 'group-2',
    is_read: true,
    read_at: demoTimestamp(-1, 16),
    created_at: demoTimestamp(-1, 15),
  },
  {
    id: 'notif-3',
    notification_type: 'alert',
    title: 'Carga de KPI realizada',
    message: 'Os indicadores fictícios da demonstração foram atualizados.',
    is_read: false,
    created_at: demoTimestamp(-2, 11),
  },
  {
    id: 'notif-4',
    notification_type: 'report_available',
    title: 'Novo relatório de operações',
    message: 'O relatório de filas fictícias está disponível para consulta.',
    related_resource_id: 'report-3',
    is_read: true,
    read_at: demoTimestamp(-3, 13),
    created_at: demoTimestamp(-3, 12),
  },
  {
    id: 'notif-5',
    notification_type: 'export_ready',
    title: 'Exportação comercial concluída',
    message: 'O arquivo demonstrativo de contratos foi gerado.',
    related_resource_id: 'export-5',
    is_read: false,
    created_at: demoTimestamp(-4, 10),
  },
  {
    id: 'notif-6',
    notification_type: 'alert',
    title: 'SLA abaixo da meta de demonstração',
    message: 'Uma fila fictícia foi incluída para mostrar alertas na tela.',
    is_read: false,
    created_at: demoTimestamp(-5, 8),
  },
  {
    id: 'notif-7',
    notification_type: 'access_granted',
    title: 'Perfil de consulta atualizado',
    message: 'A conta de demonstração recebeu acesso de leitura aos setores.',
    related_resource_id: 'demo-viewer-diretoria',
    is_read: true,
    read_at: demoTimestamp(-6, 14),
    created_at: demoTimestamp(-6, 13),
  },
  {
    id: 'notif-8',
    notification_type: 'report_available',
    title: 'Resumo financeiro atualizado',
    message: 'O conjunto fictício de competências mensais foi atualizado.',
    related_resource_id: 'report-1',
    is_read: false,
    created_at: demoTimestamp(-7, 10),
  },
  {
    id: 'notif-9',
    notification_type: 'export_ready',
    title: 'Arquivo de indicadores pronto',
    message: 'O arquivo de indicadores de demonstração está disponível.',
    related_resource_id: 'export-9',
    is_read: true,
    read_at: demoTimestamp(-8, 16),
    created_at: demoTimestamp(-8, 15),
  },
  {
    id: 'notif-10',
    notification_type: 'alert',
    title: 'Atualização simulada concluída',
    message: 'A atualização de dados fictícios terminou sem alterar dados reais.',
    is_read: true,
    read_at: demoTimestamp(-9, 12),
    created_at: demoTimestamp(-9, 11),
  },
  {
    id: 'notif-11',
    notification_type: 'report_available',
    title: 'Novo resumo da diretoria',
    message: 'Indicadores sintéticos estão disponíveis para consulta.',
    related_resource_id: 'report-4',
    is_read: false,
    created_at: demoTimestamp(-10, 10),
  },
  {
    id: 'notif-12',
    notification_type: 'access_granted',
    title: 'Acesso de leitura confirmado',
    message: 'O acesso de leitura da demonstração continua ativo.',
    related_resource_id: 'demo-viewer-diretoria',
    is_read: true,
    read_at: demoTimestamp(-11, 10),
    created_at: demoTimestamp(-11, 9),
  },
];

export const demoExportJobs: ExportJobItem[] = [
  {
    id: 'export-1',
    report_id: 'report-1',
    export_format: 'pdf',
    status: 'completed',
    file_url: '/demo-downloads/financeiro-mensal.pdf',
    file_size_bytes: 184320,
    created_at: demoTimestamp(0, 8),
    completed_at: demoTimestamp(0, 8),
    expires_at: demoTimestamp(7, 8),
  },
  {
    id: 'export-2',
    report_id: 'report-2',
    export_format: 'excel',
    status: 'processing',
    created_at: demoTimestamp(0, 8),
    expires_at: demoTimestamp(7, 8),
  },
  {
    id: 'export-3',
    report_id: 'report-3',
    export_format: 'csv',
    status: 'failed',
    error_message: 'Falha simulada para validação da interface.',
    created_at: demoTimestamp(-1, 13),
    expires_at: demoTimestamp(6, 13),
  },
  {
    id: 'export-4',
    report_id: 'report-4',
    export_format: 'json',
    status: 'pending',
    created_at: demoTimestamp(-1, 12),
    expires_at: demoTimestamp(6, 12),
  },
  {
    id: 'export-5',
    report_id: 'report-2',
    export_format: 'excel',
    status: 'completed',
    file_size_bytes: 248832,
    created_at: demoTimestamp(-2, 11),
    completed_at: demoTimestamp(-2, 11),
    expires_at: demoTimestamp(5, 11),
  },
  {
    id: 'export-6',
    report_id: 'report-3',
    export_format: 'csv',
    status: 'completed',
    file_size_bytes: 32768,
    created_at: demoTimestamp(-3, 10),
    completed_at: demoTimestamp(-3, 10),
    expires_at: demoTimestamp(4, 10),
  },
  {
    id: 'export-7',
    report_id: 'report-1',
    export_format: 'pdf',
    status: 'failed',
    error_message: 'Falha simulada para demonstrar o estado de erro.',
    created_at: demoTimestamp(-4, 9),
    expires_at: demoTimestamp(3, 9),
  },
  {
    id: 'export-8',
    report_id: 'report-4',
    export_format: 'json',
    status: 'processing',
    created_at: demoTimestamp(-5, 8),
    expires_at: demoTimestamp(2, 8),
  },
  {
    id: 'export-9',
    report_id: 'report-4',
    export_format: 'excel',
    status: 'completed',
    file_size_bytes: 106496,
    created_at: demoTimestamp(-6, 14),
    completed_at: demoTimestamp(-6, 14),
    expires_at: demoTimestamp(1, 14),
  },
  {
    id: 'export-10',
    report_id: 'report-2',
    export_format: 'csv',
    status: 'pending',
    created_at: demoTimestamp(-7, 13),
    expires_at: demoTimestamp(0, 13),
  },
  {
    id: 'export-11',
    report_id: 'report-3',
    export_format: 'json',
    status: 'completed',
    file_size_bytes: 49152,
    created_at: demoTimestamp(-8, 12),
    completed_at: demoTimestamp(-8, 12),
    expires_at: demoTimestamp(-1, 12),
  },
  {
    id: 'export-12',
    report_id: 'report-1',
    export_format: 'pdf',
    status: 'completed',
    file_size_bytes: 196608,
    created_at: demoTimestamp(-9, 11),
    completed_at: demoTimestamp(-9, 11),
    expires_at: demoTimestamp(-2, 11),
  },
];

export const demoSystemSettings: SystemSettingItem[] = [
  {
    id: 'setting-1',
    setting_key: 'app.mode',
    setting_value: 'demo',
    description: 'Modo de execução atual da plataforma.',
    is_sensitive: false,
    updated_at: demoTimestamp(0, 8),
  },
  {
    id: 'setting-2',
    setting_key: 'mail.smtp_mode',
    setting_value: 'mock',
    description: 'Entrega de e-mail desabilitada nesta demonstração.',
    is_sensitive: false,
    updated_at: demoTimestamp(0, 8),
  },
  {
    id: 'setting-3',
    setting_key: 'sql.connection_string',
    setting_value: 'Server=sqlserver;Database=DashboardPowerBI;',
    description: 'Conexão sanitizada do banco local de demonstração.',
    is_sensitive: true,
    updated_at: demoTimestamp(0, 8),
  },
  {
    id: 'setting-4',
    setting_key: 'data.source',
    setting_value: 'sqlserver-demo',
    description: 'Fonte fictícia usada para os relatórios de exemplo.',
    is_sensitive: false,
    updated_at: demoTimestamp(0, 8),
  },
  {
    id: 'setting-5',
    setting_key: 'exports.max_rows',
    setting_value: 50000,
    description: 'Limite demonstrativo de linhas por exportação.',
    is_sensitive: false,
    updated_at: demoTimestamp(0, 8),
  },
  {
    id: 'setting-6',
    setting_key: 'security.session_timeout_minutes',
    setting_value: 30,
    description: 'Tempo de inatividade configurado para a sessão demo.',
    is_sensitive: false,
    updated_at: demoTimestamp(0, 8),
  },
  {
    id: 'setting-7',
    setting_key: 'cache.ttl_seconds',
    setting_value: 300,
    description: 'Duração demonstrativa do cache de consultas.',
    is_sensitive: false,
    updated_at: demoTimestamp(0, 8),
  },
  {
    id: 'setting-8',
    setting_key: 'notifications.enabled',
    setting_value: true,
    description: 'Notificações fictícias habilitadas na demonstração.',
    is_sensitive: false,
    updated_at: demoTimestamp(0, 8),
  },
];

type CreateAppDataClientOptions = {
  useMockData?: boolean;
};

let appDataClient: AppDataClient | null = null;

export function createAppDataClient(options: CreateAppDataClientOptions = {}): AppDataClient {
  return options.useMockData ? createMockAppDataClient() : createSupabaseAppDataClient();
}

export function getAppDataClient(): AppDataClient {
  if (!appDataClient) {
    appDataClient = createAppDataClient({
      useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true',
    });
  }

  return appDataClient;
}

function createMockAppDataClient(): AppDataClient {
  let notifications = clone(demoNotifications);

  return {
    async listKpis() {
      return clone(demoKpis);
    },
    async listNotifications() {
      return clone(notifications);
    },
    async markNotificationAsRead(id: string) {
      notifications = notifications.map((item) =>
        item.id === id
          ? { ...item, is_read: true, read_at: item.read_at ?? new Date().toISOString() }
          : item,
      );
    },
    async markAllNotificationsAsRead(ids: string[]) {
      const selected = new Set(ids);
      notifications = notifications.map((item) =>
        selected.has(item.id)
          ? { ...item, is_read: true, read_at: item.read_at ?? new Date().toISOString() }
          : item,
      );
    },
    async listExportJobs() {
      return clone(demoExportJobs);
    },
    async listSystemSettings() {
      return clone(demoSystemSettings);
    },
  };
}

function createSupabaseAppDataClient(): AppDataClient {
  const supabase = createSupabaseBrowserClient();

  return {
    async listKpis() {
      const [kpisResult, sectorsResult] = await Promise.all([
        supabase.from('kpis').select('*').eq('is_active', true),
        supabase.from('sectors').select('*').eq('is_active', true),
      ]);

      const sectorMap = new Map<string, { name: string }>();
      for (const sector of sectorsResult.data ?? []) {
        sectorMap.set(sector.id, sector);
      }

      return (kpisResult.data ?? []).map((kpi) => {
        const value = kpi.target_value ?? 0;

        return {
          id: kpi.id,
          title: kpi.name,
          sector: sectorMap.get(kpi.sector_id)?.name ?? kpi.sector_id,
          value,
          previousValue: Math.round(value * 0.9),
          unit: kpi.unit,
        } satisfies KpiItem;
      });
    },
    async listNotifications() {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
    async markNotificationAsRead(id: string) {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    async markAllNotificationsAsRead(ids: string[]) {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .in('id', ids);
      if (error) throw error;
    },
    async listExportJobs() {
      const { data, error } = await supabase
        .from('export_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
    async listSystemSettings() {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('setting_key');
      if (error) throw error;
      return data ?? [];
    },
  };
}

function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? '';
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? '';

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase nao configurado para este ambiente.');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
