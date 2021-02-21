import { Type } from '@nestjs/common';
import { NotificationChannelInterface } from '../channels/notification-channel.interface';

export interface NotificationInterface {
  /**
   * Get the channels the notification should broadcast on.
   * @returns {Type<NotificationChannelInterface>[]} array
   */
  broadcastOn(): Type<NotificationChannelInterface>[];

  /**
   * Get the json representation of the notification.
   * @returns json
   */
  toPayload?(): Record<string, any>;
}
