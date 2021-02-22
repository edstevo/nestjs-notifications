import { Type } from '@nestjs/common';
import { NestJsNotificationChannel } from '../channels/notification-channel.interface';

export interface NestJsNotification {
  /**
   * Get the channels the notification should broadcast on.
   * @returns {Type<NestJsNotificationChannel>[]} array
   */
  broadcastOn(): Type<NestJsNotificationChannel>[];

  /**
   * Get the json representation of the notification.
   * @returns json
   */
  toPayload?(): Record<string, any>;
}
