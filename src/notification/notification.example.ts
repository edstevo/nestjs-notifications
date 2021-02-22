import { Type } from '@nestjs/common';
import { HttpChannel } from '../channels/http/http.channel';
import { NestJsNotificationChannel } from '../channels/notification-channel.interface';
import { NestJsNotification } from './notification.interface';

export class ExampleNotification implements NestJsNotification {
  private data: any;

  constructor(data: any) {
    this.data = data;
  }

  /**
   * Get the channels the notification should broadcast on
   * @returns {Type<NestJsNotificationChannel>[]} array
   */
  public broadcastOn(): Type<NestJsNotificationChannel>[] {
    return [HttpChannel];
  }

  /**
   * Get the json representation of the notification.
   * @returns {}
   */
  toPayload(): any {
    return this.data;
  }
}
