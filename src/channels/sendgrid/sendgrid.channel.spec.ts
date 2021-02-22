import { HttpModule, HttpService, Type } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SendGridChannel } from './sendgrid.channel';
import { SendGridNotification } from './sendgrid-notification.interface';
import { of } from 'rxjs';
import { NestJsNotificationChannel } from '../notification-channel.interface';
import { SendGridApiUrl } from './constants';
import { SendGridRequestBody } from './interfaces/sendgrid-request-body.interface';

const testApiKey = 'testUrl';
const testToSendGridData: SendGridRequestBody = {
  personalizations: [
    {
      to: ['test@email.com']
    }
  ],
  from: 'from@email.com',
  subject: "Test Email",
  content: [
    {
      type: 'text/plain',
      value: 'Some content',
    }
  ]
};
const testToPayloadData = { test: 'toPayload' };

class TestNotification implements SendGridNotification {
  public broadcastOn(): any[] {
    return [SendGridChannel];
  }

  public apiKey(): string {
    return testApiKey;
  }

  public toSendGrid() {
    return testToSendGridData;
  }

  public toPayload() {
    return testToPayloadData;
  }
}

class TestToPayloadNotification implements SendGridNotification {
  apiKey(): string {
    return testApiKey;
  }
  toPayload?(): any {
    return testToPayloadData;
  }
  public broadcastOn(): Type<NestJsNotificationChannel>[] {
    return [SendGridChannel];
  }
}

class TestToSendGridNotification implements SendGridNotification {
  apiKey(): string {
    return testApiKey;
  }
  toSendGrid(): SendGridRequestBody {
    return testToSendGridData;
  }
  public broadcastOn(): Type<NestJsNotificationChannel>[] {
    return [SendGridChannel];
  }
}

describe('SendGridChannel', () => {
  let service: SendGridChannel;
  let httpService: HttpService;
  let testNotification: TestNotification;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [SendGridChannel],
    }).compile();

    service = module.get<SendGridChannel>(SendGridChannel);
    httpService = module.get<HttpService>(HttpService);
    testNotification = new TestNotification();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getData', () => {
    it('should return toSendGrid data when only toSendGrid present', () => {
      const notification = new TestToSendGridNotification();
      const res = service.getData(notification);
      expect(res).toEqual(testToSendGridData);
    });

    it('should return toSendGrid data when not only toSendGrid present', () => {
      const res = service.getData(testNotification);
      expect(res).toEqual(testToSendGridData);
    });

    it('should return toPayload data when toSendGrid not present', () => {
      const notification = new TestToPayloadNotification();
      const res = service.getData(notification);
      expect(res).toEqual(testToPayloadData);
    });
  });

  describe('send', () => {
    it('should post data correctly', async () => {
      const testGetData = { getData: true };
      service.getData = jest.fn().mockImplementation(() => testGetData);

      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => of({ test: true } as any));

      await service.send(testNotification);
      expect(httpService.post).toHaveBeenCalledWith(SendGridApiUrl, testGetData, {
        headers: {
          Authorization: testApiKey,
        }
      });
    });
  });
});
