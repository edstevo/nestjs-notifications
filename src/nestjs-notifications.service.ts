import { Inject, Injectable, OnModuleInit, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { JobOptions, Queue } from 'bull';
import { NestJsNotificationChannel } from './channels/notification-channel.interface';
import {
  NESTJS_NOTIFICATIONS_JOB_OPTIONS,
  NESTJS_NOTIFICATIONS_QUEUE,
} from './constants';
import { NestJsNotification, NestJsQueuedNotification } from './notification/notification.interface';

@Injectable()
export class NestJsNotificationsService implements OnModuleInit {
  processor_name = 'nestjs_notification';

  constructor(
    private moduleRef: ModuleRef,
    @Inject(NESTJS_NOTIFICATIONS_QUEUE)
    private notificationsQueue: Queue,
    @Inject(NESTJS_NOTIFICATIONS_JOB_OPTIONS)
    private defaultJobOptions: JobOptions,
  ) { }

  onModuleInit() {
    if (this.notificationsQueue) {
      this.notificationsQueue.process(
        this.processor_name,
        async (job: { data: { notification; callback } }, done) => {
          await job.data.callback(job.data.notification).then(done());
        },
      );
    }
  }

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
   * Push a job to the queue
   * @param notification
   */
  public queue(notification: NestJsQueuedNotification): any {
    if (!this.notificationsQueue) throw new Error('No Queue Specified');

    return this.notificationsQueue.add(
      this.processor_name,
      {
        notification,
        callback: this.send,
      },
      notification.getJobOptions()
        ? notification.getJobOptions()
        : this.defaultJobOptions,
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
