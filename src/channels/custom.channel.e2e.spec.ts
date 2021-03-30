import { Type } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NestJsNotificationsModule } from '../nestjs-notifications.module';
import { NestJsNotification } from '../notification/notification.interface';
import { NestJsNotificationsService } from '../nestjs-notifications.service';
import { NestJsNotificationChannel } from './notification-channel.interface';

const testSendFn = jest.fn().mockImplementation(() => Promise.resolve());

class CustomChannel implements NestJsNotificationChannel {
  send = testSendFn;
}

class CustomNotification implements NestJsNotification {

  /**
   * Get the channels the notification should broadcast on.
   * @returns {Type<NestJsNotificationChannel>[]} array
   */
  public broadcastOn(): Type<NestJsNotificationChannel>[] {
    return [CustomChannel];
  }
}

describe('CustomChannel E2E', () => {
  let module: TestingModule;
  let service: NestJsNotificationsService;
  let notification: CustomNotification;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [NestJsNotificationsModule.forRoot({})],
    }).compile();

    service = module.get<NestJsNotificationsService>(NestJsNotificationsService);
    notification = new CustomNotification();
  });

  describe('Send Notification Via Webhook Channel', () => {
    it('should post webhook correctly', async () => {
      await service.send(notification);
      expect(testSendFn).toHaveBeenCalled();
    });
  });
});
