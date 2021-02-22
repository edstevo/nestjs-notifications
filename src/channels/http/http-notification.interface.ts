import { NestJsNotification } from '../../notification/notification.interface';

export interface HttpNotification extends NestJsNotification {
  /**
   * Define the Http url to send the notification to
   * @returns {string}
   */
  httpUrl(): string;

  /**
   * Get the Http representation of the notification.
   * @returns {any} http payload data
   */
  toHttp?(): any;
}
