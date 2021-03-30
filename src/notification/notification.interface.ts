import { Type } from '@nestjs/common';
import { JobOptions } from 'bull';
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

export interface NestJsQueuedNotification {
  /**
   * Return any job options for this Notification
   * @returns {JobOptions | null}
   */
  getJobOptions(): JobOptions | null;
}
