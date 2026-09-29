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

  it('deve distribuir eventos mock em varios meses com datas cronologicas coerentes', () => {
    const minimumSpanInMilliseconds = 300 * 24 * 60 * 60 * 1000;
    const notificationDates = demoNotifications.map((item) => Date.parse(item.created_at));
    const exportDates = demoExportJobs.map((item) => Date.parse(item.created_at));
    const settingDates = demoSystemSettings.map((item) => Date.parse(item.updated_at));

    expect(Math.max(...notificationDates) - Math.min(...notificationDates)).toBeGreaterThanOrEqual(
      minimumSpanInMilliseconds,
    );
    expect(Math.max(...exportDates) - Math.min(...exportDates)).toBeGreaterThanOrEqual(
      minimumSpanInMilliseconds,
    );
    expect(Math.max(...settingDates) - Math.min(...settingDates)).toBeGreaterThanOrEqual(
      180 * 24 * 60 * 60 * 1000,
    );

    for (const dates of [notificationDates, exportDates]) {
      expect(dates).toEqual([...dates].sort((left, right) => right - left));
    }

    for (const notification of demoNotifications) {
      if (notification.read_at) {
        expect(Date.parse(notification.read_at)).toBeGreaterThanOrEqual(
          Date.parse(notification.created_at),
        );
      }
    }

    for (const job of demoExportJobs) {
      expect(Date.parse(job.expires_at)).toBeGreaterThan(Date.parse(job.created_at));
      if (job.completed_at) {
        expect(Date.parse(job.completed_at)).toBeGreaterThanOrEqual(Date.parse(job.created_at));
      }
    }
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
