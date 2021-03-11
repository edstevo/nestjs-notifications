import { HttpService, Type } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SendGridChannel } from './sendgrid.channel';
import { NestJsNotificationsService } from '../../nestjs-notifications.service';
import { NestJsNotificationsModule } from '../../nestjs-notifications.module';
import { SendGridNotification } from './sendgrid-notification.interface';
import { of } from 'rxjs';
import { NestJsNotificationChannel } from '../notification-channel.interface';
import { SendGridApiUrl } from './constants';

const testApiKey = 'testApiKey';
const testData = { test: true };

class TestNotification implements SendGridNotification {
  data: any;

  constructor(data: any) {
    this.data = data;
  }

  /**
   * Get the channels the notification should broadcast on.
   * @returns {Type<NestJsNotificationChannel>[]} array
   */
  public broadcastOn(): Type<NestJsNotificationChannel>[] {
    return [SendGridChannel];
  }

  sendGridApiKey(): string {
    return testApiKey;
  }

  toSendGrid() {
    return this.data;
  }
}

describe('SendGridChannel E2E', () => {
  let module: TestingModule;
  let service: NestJsNotificationsService;
  let httpService: HttpService;
  let notification: TestNotification;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [NestJsNotificationsModule],
    }).compile();

    service = module.get<NestJsNotificationsService>(NestJsNotificationsService);
    httpService = module.get<HttpService>(HttpService);
    notification = new TestNotification(testData);
  });

  describe('Send Notification Via Http Channel', () => {
    it('should post Http correctly', async () => {
      jest.spyOn(httpService, 'post').mockImplementation(() => of(null));

      await service.send(notification);
      expect(httpService.post).toHaveBeenCalledWith(SendGridApiUrl, testData, {
        headers: {
          Authorization: testApiKey
        }
      });
    });
  });
});
