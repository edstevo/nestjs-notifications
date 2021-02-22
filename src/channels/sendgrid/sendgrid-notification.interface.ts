import { NestJsNotification } from '../../notification/notification.interface';
import { SendGridRequestBody } from './interfaces/sendgrid-request-body.interface';

export interface SendGridNotification extends NestJsNotification {
  /**
   * Define the your api key
   * @returns {string}
   */
  apiKey(): string;



  /**
   * Get the Http representation of the notification.
   * @returns {SendGridRequestBody} http payload data
   */
  toSendGrid?(): SendGridRequestBody;
}
