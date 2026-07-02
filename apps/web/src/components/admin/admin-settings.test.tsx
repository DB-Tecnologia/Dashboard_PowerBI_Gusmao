import { render, screen } from '@testing-library/react';

import { AdminSettings } from './admin-settings';
import { getAppDataClient } from '@/lib/app-data';
import { getRetentionStatus, runRetention } from '@/lib/admin-api';

jest.mock('@/lib/app-data', () => ({
  getAppDataClient: jest.fn(),
}));

jest.mock('@/lib/admin-api', () => ({
  getRetentionStatus: jest.fn(),
  runRetention: jest.fn(),
}));

describe('AdminSettings', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renderiza configuracoes carregadas pela API', async () => {
    (getAppDataClient as jest.Mock).mockReturnValue({
      listSystemSettings: jest.fn().mockResolvedValue([
        {
          id: 's1',
          setting_key: 'smtp.host',
          setting_value: { value: 'smtp.example.com' },
          description: 'Servidor SMTP',
          is_sensitive: false,
          updated_at: '2026-06-07T12:00:00.000Z',
        },
      ]),
    });
    (getRetentionStatus as jest.Mock).mockResolvedValue({
      auditLogDays: 90,
      refreshTokenDays: 30,
      exportDays: 7,
    });

    render(<AdminSettings />);

    expect(await screen.findByText('smtp.host')).toBeInTheDocument();
  });

  it('renderiza erro quando a API falha', async () => {
    (getAppDataClient as jest.Mock).mockReturnValue({
      listSystemSettings: jest.fn().mockRejectedValue(new Error('falha')),
    });
    (getRetentionStatus as jest.Mock).mockResolvedValue(null);

    render(<AdminSettings />);

    expect(
      await screen.findByText('Nao foi possivel carregar as configuracoes.'),
    ).toBeInTheDocument();
  });

  it('exibe politica de retencao quando carregada', async () => {
    (getAppDataClient as jest.Mock).mockReturnValue({
      listSystemSettings: jest.fn().mockResolvedValue([
        {
          id: 's1',
          setting_key: 'smtp.host',
          setting_value: { value: 'smtp.example.com' },
          description: 'Servidor SMTP',
          is_sensitive: false,
          updated_at: '2026-06-07T12:00:00.000Z',
        },
      ]),
    });
    (getRetentionStatus as jest.Mock).mockResolvedValue({
      auditLogDays: 90,
      refreshTokenDays: 30,
      exportDays: 7,
    });

    render(<AdminSettings />);

    expect(await screen.findByText('smtp.host')).toBeInTheDocument();
    expect(screen.getByText('90 dias')).toBeInTheDocument();
    expect(screen.getByText('30 dias')).toBeInTheDocument();
    expect(screen.getByText('7 dias')).toBeInTheDocument();
  });
});
