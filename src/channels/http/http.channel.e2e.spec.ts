import { HttpService, Type } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpChannel } from './http.channel';
import { NotificationsService } from '../../notifications.service';
import { NestJsNotificationsModule } from '../../nestjs-notifications.module';
import { HttpNotification } from './http-notification.interface';
import { of } from 'rxjs';
import { NotificationChannelInterface } from '../notification-channel.interface';

const testUrl = 'testUrl';
const testData = { test: true };

class TestNotification implements HttpNotification {
  data: any;

  constructor(data: any) {
    this.data = data;
  }

  /**
   * Get the channels the notification should broadcast on.
   * @returns {Type<NotificationChannelInterface>[]} array
   */
  public broadcastOn(): Type<NotificationChannelInterface>[] {
    return [HttpChannel];
  }

  httpUrl(): string {
    return testUrl;
  }

  toHttp() {
    return this.data;
  }
}

describe('HttpChannel E2E', () => {
  let module: TestingModule;
  let service: NotificationsService;
  let httpService: HttpService;
  let notification: TestNotification;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [NestJsNotificationsModule],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    httpService = module.get<HttpService>(HttpService);
    notification = new TestNotification(testData);
  });

  describe('Send Notification Via Http Channel', () => {
    it('should post Http correctly', async () => {
      jest.spyOn(httpService, 'post').mockImplementation(() => of(null));

      await service.send(notification);
      expect(httpService.post).toHaveBeenCalledWith(testUrl, testData);
    });
  });
});
