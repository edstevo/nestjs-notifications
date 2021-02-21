import { Type } from '@nestjs/common';
import { HttpChannel } from '../channels/http/http.channel';
import { NotificationChannelInterface } from '../channels/notification-channel.interface';
import { NotificationInterface } from './notification.interface';

export class ExampleNotification implements NotificationInterface {
  private data: any;

  constructor(data: any) {
    this.data = data;
  }

  /**
   * Get the channels the notification should broadcast on
   * @returns {Type<NotificationChannelInterface>[]} array
   */
  public broadcastOn(): Type<NotificationChannelInterface>[] {
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
