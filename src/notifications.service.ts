import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NotificationChannelInterface } from './channels/notification-channel.interface';
import { NotificationInterface } from './notification/notification.interface';

@Injectable()
export class NotificationsService {
  constructor(private moduleRef: ModuleRef) {}

  /**
   * Process a notification and send via designated channel
   * @param notification
   */
  public send(notification: NotificationInterface): Promise<void[]> {
    const channels = notification.broadcastOn();
    return Promise.all(
      channels.map((channel: Type<NotificationChannelInterface>) =>
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
    notification: NotificationInterface,
    channel: Type<NotificationChannelInterface>,
  ): Promise<any> {
    const chann = await this.resolveChannel(channel);
    await chann.send(notification);
  }

  /**
   * Resolve the channel needed to send the Notification
   * @param channel
   */
  resolveChannel = (channel: Type<NotificationChannelInterface>) =>
    this.moduleRef.create(channel);
}
