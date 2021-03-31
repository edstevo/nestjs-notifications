import { NestJsNotification } from '../notification/notification.interface';

export interface NestJsNotificationChannel {
  /**
   * Send the given notification
   * @param notification
   */
  send(notification: NestJsNotification): Promise<any>;
}
