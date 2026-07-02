import { render, screen } from '@testing-library/react';

import { ExportsList } from './exports-list';
import { getAppDataClient } from '@/lib/app-data';

jest.mock('@/lib/app-data', () => ({
  getAppDataClient: jest.fn(),
}));

describe('ExportsList', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renderiza exportacoes vindas da API', async () => {
    (getAppDataClient as jest.Mock).mockReturnValue({
      listExportJobs: jest.fn().mockResolvedValue([
        {
          id: 'e1',
          report_id: 'financeiro-dre',
          export_format: 'pdf',
          status: 'completed',
          file_url: 'http://localhost:3001/exports/files/e1.pdf',
          file_size_bytes: 2048,
          error_message: null,
          created_at: '2026-06-07T12:00:00.000Z',
          completed_at: '2026-06-07T12:02:00.000Z',
          expires_at: '2026-06-14T12:00:00.000Z',
        },
      ]),
    });

    render(<ExportsList />);

    expect(await screen.findByText('PDF')).toBeInTheDocument();
    expect(screen.getByText('Concluido')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /baixar/i })).toBeInTheDocument();
  });

  it('renderiza erro quando a API falha', async () => {
    (getAppDataClient as jest.Mock).mockReturnValue({
      listExportJobs: jest.fn().mockRejectedValue(new Error('falha')),
    });

    render(<ExportsList />);

    expect(
      await screen.findByText('Nao foi possivel carregar o historico de exportacoes.'),
    ).toBeInTheDocument();
  });

  it('renderiza link de download para arquivo concluido', async () => {
    (getAppDataClient as jest.Mock).mockReturnValue({
      listExportJobs: jest.fn().mockResolvedValue([
        {
          id: 'e1',
          report_id: 'financeiro-dre',
          export_format: 'pdf',
          status: 'completed',
          file_url: 'http://localhost:3001/exports/files/e1.pdf',
          file_size_bytes: 2048,
          error_message: null,
          created_at: '2026-06-07T12:00:00.000Z',
          completed_at: '2026-06-07T12:02:00.000Z',
          expires_at: '2026-06-14T12:00:00.000Z',
        },
      ]),
    });

    render(<ExportsList />);

    const link = await screen.findByRole('link', { name: /baixar/i });
    expect(link).toHaveAttribute('href', 'http://localhost:3001/exports/files/e1.pdf');
  });
});
