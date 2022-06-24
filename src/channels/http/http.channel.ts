import { lastValueFrom } from 'rxjs';
import {
  HttpService,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpNotification } from './http-notification.interface';
import { NestJsNotificationChannel } from '../notification-channel.interface';
import { AxiosResponse } from 'axios';

@Injectable()
export class HttpChannel implements NestJsNotificationChannel {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Send the given notification
   * @param notification
   */
  public async send(
    notification: HttpNotification,
  ): Promise<AxiosResponse<any>> {
    const message = this.getData(notification);
    return lastValueFrom(this.httpService.post(notification.httpUrl(), message));
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
