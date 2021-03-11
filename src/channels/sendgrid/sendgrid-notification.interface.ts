import { NestJsNotification } from '../../notification/notification.interface';
import { SendGridRequestBody } from './interfaces/sendgrid-request-body.interface';

export interface SendGridNotification extends NestJsNotification {
  /**
   * Define the your api key
   * @returns {string}
   */
  sendGridApiKey(): string;

  /**
   * Get the SendGrid representation of the notification.
   * @returns {SendGridRequestBody}
   */
  toSendGrid?(): SendGridRequestBody;
}
