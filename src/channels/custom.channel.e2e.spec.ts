import { Type } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NestJsNotificationsModule } from '../nestjs-notifications.module';
import { NotificationInterface } from '../notification/notification.interface';
import { NotificationsService } from '../notifications.service';
import { NotificationChannelInterface } from './notification-channel.interface';

const testSendFn = jest.fn().mockImplementation(() => Promise.resolve());

class CustomChannel implements NotificationChannelInterface {
  send = testSendFn;
}

class CustomNotification implements NotificationInterface {

  /**
   * Get the channels the notification should broadcast on.
   * @returns {Type<NotificationChannelInterface>[]} array
   */
  public broadcastOn(): Type<NotificationChannelInterface>[] {
    return [CustomChannel];
  }
}

describe('CustomChannel E2E', () => {
  let module: TestingModule;
  let service: NotificationsService;
  let notification: CustomNotification;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [NestJsNotificationsModule],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    notification = new CustomNotification();
  });

  describe('Send Notification Via Webhook Channel', () => {
    it('should post webhook correctly', async () => {
      await service.send(notification);
      expect(testSendFn).toHaveBeenCalled();
    });
  });
});
