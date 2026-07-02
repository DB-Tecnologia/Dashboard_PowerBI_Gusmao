import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NotificationsList } from './notifications-list';
import { getAppDataClient } from '@/lib/app-data';

jest.mock('@/lib/app-data', () => ({
  getAppDataClient: jest.fn(),
}));

describe('NotificationsList', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renderiza notificacoes carregadas pela API e marca uma como lida', async () => {
    const mockMarkNotificationAsRead = jest.fn().mockResolvedValue(undefined);
    (getAppDataClient as jest.Mock).mockReturnValue({
      listNotifications: jest.fn().mockResolvedValue([
        {
          id: 'n1',
          notification_type: 'alert',
          title: 'Alerta operacional',
          message: 'Verifique a fila.',
          related_resource_id: null,
          is_read: false,
          read_at: null,
          created_at: '2026-06-07T12:00:00.000Z',
        },
      ]),
      markNotificationAsRead: mockMarkNotificationAsRead,
      markAllNotificationsAsRead: jest.fn(),
    });

    render(<NotificationsList />);

    expect(await screen.findByText('Alerta operacional')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Marcar como lida' }));

    await waitFor(() => expect(mockMarkNotificationAsRead).toHaveBeenCalledWith('n1'));
  });

  it('renderiza erro quando a API falha', async () => {
    (getAppDataClient as jest.Mock).mockReturnValue({
      listNotifications: jest.fn().mockRejectedValue(new Error('falha')),
      markNotificationAsRead: jest.fn(),
      markAllNotificationsAsRead: jest.fn(),
    });

    render(<NotificationsList />);

    expect(
      await screen.findByText('Nao foi possivel carregar as notificacoes.'),
    ).toBeInTheDocument();
  });

  it('marca todas como lidas pela API', async () => {
    const mockMarkAllNotificationsAsRead = jest.fn().mockResolvedValue(undefined);
    (getAppDataClient as jest.Mock).mockReturnValue({
      listNotifications: jest.fn().mockResolvedValue([
        {
          id: 'n1',
          notification_type: 'alert',
          title: 'Alerta operacional',
          message: 'Verifique a fila.',
          related_resource_id: null,
          is_read: false,
          read_at: null,
          created_at: '2026-06-07T12:00:00.000Z',
        },
        {
          id: 'n2',
          notification_type: 'export_ready',
          title: 'Exportacao pronta',
          message: 'Baixe o arquivo.',
          related_resource_id: null,
          is_read: false,
          read_at: null,
          created_at: '2026-06-07T12:01:00.000Z',
        },
      ]),
      markNotificationAsRead: jest.fn(),
      markAllNotificationsAsRead: mockMarkAllNotificationsAsRead,
    });

    render(<NotificationsList />);

    await screen.findAllByText('Exportacao pronta');
    await userEvent.click(screen.getByRole('button', { name: /marcar todas como lidas/i }));

    await waitFor(() => expect(mockMarkAllNotificationsAsRead).toHaveBeenCalledWith(['n1', 'n2']));
  });
});
