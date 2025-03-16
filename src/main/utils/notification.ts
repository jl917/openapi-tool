import { Notification, NotificationConstructorOptions } from 'electron';

export function showNotification(config: NotificationConstructorOptions) {
  const notification = new Notification({
    ...config,
    silent: true,
  });
  notification.show();
}
