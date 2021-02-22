import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NestJsNotificationChannel } from './channels/notification-channel.interface';
import { NestJsNotification } from './notification/notification.interface';

@Injectable()
export class NestJsNotificationsService {
  constructor(private moduleRef: ModuleRef) {}

  /**
   * Process a notification and send via designated channel
   * @param notification
   */
  public send(notification: NestJsNotification): Promise<void[]> {
    const channels = notification.broadcastOn();
    return Promise.all(
      channels.map((channel: Type<NestJsNotificationChannel>) =>
        this.sendOnChannel(notification, channel),
      ),
    );
  }

  /**
   * Send notification on designated channel
   * @param notification
   * @param channel
   */
  async sendOnChannel(
    notification: NestJsNotification,
    channel: Type<NestJsNotificationChannel>,
  ): Promise<any> {
    const chann = await this.resolveChannel(channel);
    await chann.send(notification);
  }

  /**
   * Resolve the channel needed to send the Notification
   * @param channel
   */
  resolveChannel = (channel: Type<NestJsNotificationChannel>) =>
    this.moduleRef.create(channel);
}
