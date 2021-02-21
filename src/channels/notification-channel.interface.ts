import { NotificationInterface } from '../notification/notification.interface';

export interface NotificationChannelInterface {
  /**
   * Send the given notification
   * @param notification
   */
  send(notification: NotificationInterface): Promise<void>;
}
