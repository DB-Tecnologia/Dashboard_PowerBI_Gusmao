import { render, screen } from '@testing-library/react';

import { AreaChartWidget } from './area-chart-widget';

jest.mock('recharts', () => {
  const actual = jest.requireActual('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 400, height: 280 }}>{children}</div>
    ),
  };
});

describe('AreaChartWidget', () => {
  const sampleData = [
    { period: 'Jan', valor: 100 },
    { period: 'Fev', valor: 150 },
  ];

  it('renderiza titulo e descricao', () => {
    render(
      <AreaChartWidget
        title="Tendência"
        description="Evolução da variação"
        data={sampleData}
        xKey="period"
        series={[{ dataKey: 'valor', name: 'Valor', color: '#1d4ed8', fillOpacity: 0.3 }]}
      />,
    );

    expect(screen.getByText('Tendência')).toBeInTheDocument();
    expect(screen.getByText('Evolução da variação')).toBeInTheDocument();
  });

  it('renderiza sem erros com dados vazios', () => {
    render(
      <AreaChartWidget
        title="Vazio"
        description="Sem dados"
        data={[]}
        xKey="period"
        series={[{ dataKey: 'valor', name: 'Valor', color: '#1d4ed8' }]}
      />,
    );

    expect(screen.getByText('Vazio')).toBeInTheDocument();
  });
});
