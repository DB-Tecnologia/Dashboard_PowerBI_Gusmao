import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DashboardHome } from './dashboard-home';
import { fetchDashboardDrilldown, fetchDashboardHome, fetchKpiHistory } from '@/lib/platform-api';

jest.mock('@/lib/platform-api', () => ({
  fetchDashboardDrilldown: jest.fn(),
  fetchDashboardHome: jest.fn(),
  fetchKpiHistory: jest.fn(),
}));

describe('DashboardHome', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    Object.defineProperty(window, 'ResizeObserver', {
      writable: true,
      configurable: true,
      value: class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    });

    (fetchDashboardHome as jest.Mock).mockResolvedValue({
      summary: {
        totalKpis: 3,
        totalSectors: 3,
        averageDelta: 10.5,
      },
      businessAreas: [
        { businessArea: 'producao', label: 'Produção', total: 1, averageDelta: 11.11 },
        { businessArea: 'comercial', label: 'Comercial', total: 1, averageDelta: 11.11 },
        { businessArea: 'algodoeira', label: 'Algodoeira', total: 1, averageDelta: 10.84 },
      ],
      kpis: [
        {
          id: 'receita',
          title: 'Receita mensal',
          businessArea: 'producao',
          sector: 'Financeiro',
          value: 120000,
          previousValue: 108000,
          unit: 'currency',
        },
        {
          id: 'leads',
          title: 'Leads qualificados',
          businessArea: 'comercial',
          sector: 'Comercial',
          value: 430,
          previousValue: 387,
          unit: 'number',
        },
        {
          id: 'sla',
          title: 'Talhoes monitorados',
          businessArea: 'algodoeira',
          sector: 'Operacoes',
          value: 0.92,
          previousValue: 0.83,
          unit: 'percent',
        },
      ],
      sectorSummaries: [
        { sector: 'Financeiro', total: 1, averageDelta: 11.11 },
        { sector: 'Comercial', total: 1, averageDelta: 11.11 },
        { sector: 'Operacoes', total: 1, averageDelta: 10.84 },
      ],
      charts: {
        sectorDistribution: [
          { sector: 'Financeiro', total: 1, averageDelta: 11.11 },
          { sector: 'Comercial', total: 1, averageDelta: 11.11 },
          { sector: 'Operacoes', total: 1, averageDelta: 10.84 },
        ],
        kpiPerformance: [
          {
            id: 'receita',
            title: 'Receita mensal',
            businessArea: 'producao',
            sector: 'Financeiro',
            value: 120000,
            previousValue: 108000,
            delta: 11.11,
          },
          {
            id: 'leads',
            title: 'Leads qualificados',
            businessArea: 'comercial',
            sector: 'Comercial',
            value: 430,
            previousValue: 387,
            delta: 11.11,
          },
        ],
      },
      availableDrilldowns: [
        {
          kpiId: 'receita',
          label: 'Receita mensal',
          dimensions: [
            { dimension: 'fazenda', label: 'Fazenda' },
            { dimension: 'cultura', label: 'Cultura' },
            { dimension: 'tempo', label: 'Tempo' },
          ],
        },
      ],
    });

    (fetchDashboardDrilldown as jest.Mock).mockResolvedValue({
      kpiId: 'receita',
      label: 'Receita mensal',
      dimension: 'fazenda',
      availableDimensions: [
        { dimension: 'fazenda', label: 'Fazenda' },
        { dimension: 'cultura', label: 'Cultura' },
        { dimension: 'tempo', label: 'Tempo' },
      ],
      series: [
        { label: 'Atual', value: 120000 },
        { label: 'Anterior', value: 108000 },
      ],
      rows: [
        { period: 'Fazenda Norte', value: 120000, delta: 11.11 },
        { period: 'Fazenda Sul', value: 108000, delta: 0 },
      ],
    });

    (fetchKpiHistory as jest.Mock).mockResolvedValue({
      kpiId: 'receita',
      label: 'Receita mensal',
      unit: 'currency',
      granularity: 'monthly',
      rangeMonths: 12,
      periods: [
        { period: 'Jan', value: 98000, previousValue: 92000, delta: 6.52 },
        { period: 'Fev', value: 108000, previousValue: 98000, delta: 10.2 },
        { period: 'Mar', value: 120000, previousValue: 108000, delta: 11.11 },
      ],
    });
  });

  it('renderiza a aba executiva com métricas únicas, linha do tempo e destaques', async () => {
    render(<DashboardHome />);

    expect(await screen.findByRole('heading', { name: 'Visão geral' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Executiva' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Analítica' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Operacional' })).toBeInTheDocument();
    expect(screen.getByText('Linha do tempo principal')).toBeInTheDocument();
    expect(screen.getByText('Destaques do período')).toBeInTheDocument();
    expect(screen.getAllByText('KPIs monitorados')).toHaveLength(1);
    expect(screen.getAllByText('Áreas cobertas')).toHaveLength(1);
    expect(screen.getAllByText('Variação média')).toHaveLength(1);
    expect(screen.getAllByText('Receita mensal').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Leads qualificados').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Talhões monitorados').length).toBeGreaterThan(0);
    expect(screen.queryByText('Talhoes monitorados')).not.toBeInTheDocument();
  });

  it('identifica os indicadores ficticios quando a demonstracao esta ativa', async () => {
    const previousMockMode = process.env.NEXT_PUBLIC_USE_MOCK_DATA;
    process.env.NEXT_PUBLIC_USE_MOCK_DATA = 'true';

    try {
      render(<DashboardHome />);

      expect(
        await screen.findByText('Demonstração · Dados fictícios para visualização'),
      ).toBeInTheDocument();
      expect(screen.getByText('Histórico: últimos 12 meses')).toBeInTheDocument();
      expect(screen.queryByText(/KPIs reais do Oracle/i)).not.toBeInTheDocument();
    } finally {
      if (previousMockMode === undefined) {
        delete process.env.NEXT_PUBLIC_USE_MOCK_DATA;
      } else {
        process.env.NEXT_PUBLIC_USE_MOCK_DATA = previousMockMode;
      }
    }
  });

  it('renderiza fallback quando a carga falha', async () => {
    (fetchDashboardHome as jest.Mock).mockRejectedValueOnce(new Error('falha'));

    render(<DashboardHome />);

    await waitFor(() => {
      expect(
        screen.getByText('Não foi possível carregar os indicadores de BI.'),
      ).toBeInTheDocument();
    });
  });

  it('abre drilldown ao clicar em um KPI e permite voltar', async () => {
    const user = userEvent.setup();

    render(<DashboardHome />);

    await user.click(
      await screen.findByRole('button', { name: /abrir detalhamento de receita mensal/i }),
    );

    expect(fetchDashboardDrilldown).toHaveBeenCalledWith('receita', undefined);
    expect(await screen.findByText('Drill-down · Receita mensal')).toBeInTheDocument();
    expect(screen.getByText('Atual')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /voltar ao resumo/i }));

    expect(screen.queryByText('Drill-down · Receita mensal')).not.toBeInTheDocument();
  });

  it('exibe breadcrumb e seletor de dimensoes no drilldown', async () => {
    const user = userEvent.setup();

    render(<DashboardHome />);

    await user.click(
      await screen.findByRole('button', { name: /abrir detalhamento de receita mensal/i }),
    );

    expect(await screen.findByText('Drill-down · Receita mensal')).toBeInTheDocument();
    expect(screen.getByLabelText('Navegação estrutural')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Fazenda' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Cultura' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tempo' })).toBeInTheDocument();
  });

  it('troca dimensao ao clicar em outra tab de dimensao', async () => {
    const user = userEvent.setup();

    render(<DashboardHome />);

    await user.click(
      await screen.findByRole('button', { name: /abrir detalhamento de receita mensal/i }),
    );

    await screen.findByText('Drill-down · Receita mensal');

    (fetchDashboardDrilldown as jest.Mock).mockResolvedValueOnce({
      kpiId: 'receita',
      label: 'Receita mensal',
      dimension: 'cultura',
      availableDimensions: [
        { dimension: 'fazenda', label: 'Fazenda' },
        { dimension: 'cultura', label: 'Cultura' },
        { dimension: 'tempo', label: 'Tempo' },
      ],
      series: [
        { label: 'Atual', value: 120000 },
        { label: 'Anterior', value: 108000 },
      ],
      rows: [
        { period: 'Soja', value: 80000, delta: 5 },
        { period: 'Milho', value: 40000, delta: 0 },
      ],
    });

    await user.click(screen.getByRole('tab', { name: 'Cultura' }));

    await waitFor(() => {
      expect(fetchDashboardDrilldown).toHaveBeenCalledWith('receita', 'cultura');
    });
  });

  it('troca para as abas analitica e operacional sem recarregar a home', async () => {
    const user = userEvent.setup();

    render(<DashboardHome />);

    await user.click(await screen.findByRole('tab', { name: 'Analítica' }));

    expect(screen.getByRole('tab', { name: 'Analítica' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Distribuição por setor')).toBeInTheDocument();
    expect(screen.getByText('Variação dos indicadores')).toBeInTheDocument();
    expect(screen.getByText('Série histórica comparativa')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Operacional' }));

    expect(screen.getByRole('tab', { name: 'Operacional' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText('Acompanhamento operacional')).toBeInTheDocument();
    expect(screen.getByText('Itens que pedem atenção')).toBeInTheDocument();
    expect(fetchDashboardHome).toHaveBeenCalledTimes(1);
  });
});
