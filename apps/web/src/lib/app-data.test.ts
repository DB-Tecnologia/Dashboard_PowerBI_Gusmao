import {
  createAppDataClient,
  demoExportJobs,
  demoKpis,
  demoNotifications,
  demoSystemSettings,
} from './app-data';

describe('app-data demo client', () => {
  it('deve usar dados mockados quando NEXT_PUBLIC_USE_MOCK_DATA=true', async () => {
    const client = createAppDataClient({
      useMockData: true,
    });

    await expect(client.listKpis()).resolves.toEqual(demoKpis);
    await expect(client.listExportJobs()).resolves.toEqual(demoExportJobs);
    await expect(client.listNotifications()).resolves.toEqual(demoNotifications);
    await expect(client.listSystemSettings()).resolves.toEqual(demoSystemSettings);
  });

  it('deve oferecer variedade suficiente para explorar a demonstracao', () => {
    expect(demoKpis).toHaveLength(12);
    expect(demoNotifications.length).toBeGreaterThanOrEqual(10);
    expect(new Set(demoNotifications.map((item) => item.notification_type)).size).toBe(4);
    expect(demoExportJobs.length).toBeGreaterThanOrEqual(10);
    expect(new Set(demoExportJobs.map((item) => item.status)).size).toBe(4);
    expect(demoSystemSettings).toHaveLength(8);
  });

  it('deve permitir marcar notificacao isolada e em lote no client demo', async () => {
    const client = createAppDataClient({
      useMockData: true,
    });

    await client.markNotificationAsRead('notif-1');
    let notifications = await client.listNotifications();

    expect(notifications.find((item) => item.id === 'notif-1')?.is_read).toBe(true);

    await client.markAllNotificationsAsRead(demoNotifications.map((item) => item.id));
    notifications = await client.listNotifications();

    expect(notifications.filter((item) => !item.is_read)).toHaveLength(0);
  });
});
