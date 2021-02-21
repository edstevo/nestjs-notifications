import {
  HttpService,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpNotification } from './http-notification.interface';
import { NotificationChannelInterface } from '../notification-channel.interface';

@Injectable()
export class HttpChannel implements NotificationChannelInterface {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Send the given notification
   * @param notification
   */
  public async send(notification: HttpNotification): Promise<void> {
    const message = this.getData(notification);
    await this.httpService.post(notification.httpUrl(), message).toPromise();
  }

  /**
   * Get the data for the notification.
   * @param notification
   */
  getData(notification: HttpNotification) {
    if (typeof notification.toHttp === 'function') {
      return notification.toHttp();
    }

    if (typeof notification.toPayload === 'function') {
      return notification.toPayload();
    }

    throw new InternalServerErrorException(
      'Notification is missing toPayload method.',
    );
  }
}
