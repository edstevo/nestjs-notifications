import { lastValueFrom } from 'rxjs';
import {
  HttpService,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SendGridNotification } from './sendgrid-notification.interface';
import { NestJsNotificationChannel } from '../notification-channel.interface';
import { SendGridApiUrl } from './constants';
import { AxiosResponse } from 'axios';

@Injectable()
export class SendGridChannel implements NestJsNotificationChannel {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Send the given notification
   * @param notification
   */
  public async send(
    notification: SendGridNotification,
  ): Promise<AxiosResponse<any>> {
    const data = this.getData(notification);
    return lastValueFrom(this.httpService
      .post(SendGridApiUrl, data, {
        headers: {
          Authorization: notification.sendGridApiKey(),
        },
      }));
  }

  /**
   * Get the data for the notification.
   * @param notification
   */
  getData(notification: SendGridNotification) {
    if (typeof notification.toSendGrid === 'function') {
      return notification.toSendGrid();
    }

    if (typeof notification.toPayload === 'function') {
      return notification.toPayload();
    }

    throw new InternalServerErrorException(
      'Notification is missing toPayload method.',
    );
  }
}
