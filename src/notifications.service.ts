import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { BaseChannel } from './channels/base.channel';
import { Notification } from './notification/notification';

@Injectable()
export class NotificationsService {
  constructor(private moduleRef: ModuleRef) {}

  /**
   * Process a notification and send via designated channel
   * @param notification
   */
  public send(notification: Notification): Promise<void[]> {
    const channels = notification.broadcastOn();
    return Promise.all(
      channels.map((channel: Type<BaseChannel>) =>
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
    notification: Notification,
    channel: Type<BaseChannel>,
  ): Promise<any> {
    const chann = await this.resolveChannel(channel);
    await chann.send(notification);
  }

  /**
   * Resolve the channel needed to send the Notification
   * @param channel
   */
  resolveChannel = (channel: Type<BaseChannel>) =>
    this.moduleRef.create(channel);
}
