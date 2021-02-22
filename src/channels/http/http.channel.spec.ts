import { HttpModule, HttpService, Type } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpChannel } from './http.channel';
import { HttpNotification } from './http-notification.interface';
import { of } from 'rxjs';
import { NestJsNotificationChannel } from '../notification-channel.interface';

const testUrl = 'testUrl';
const testToHttpData = { test: 'toHttp' };
const testToPayloadData = { test: 'toPayload' };

class TestNotification implements HttpNotification {
  public broadcastOn(): any[] {
    return [HttpChannel];
  }

  public httpUrl(): string {
    return testUrl;
  }

  public toHttp() {
    return testToHttpData;
  }

  public toPayload() {
    return testToPayloadData;
  }
}

class TestToPayloadNotification implements HttpNotification {
  httpUrl(): string {
    return testUrl;
  }
  toPayload?(): Record<string, any> {
    return testToPayloadData;
  }
  public broadcastOn(): Type<NestJsNotificationChannel>[] {
    return [HttpChannel];
  }
}

class TestToHttpNotification implements HttpNotification {
  httpUrl(): string {
    return testUrl;
  }
  toHttp(): Record<string, any> {
    return testToHttpData;
  }
  public broadcastOn(): Type<NestJsNotificationChannel>[] {
    return [HttpChannel];
  }
}

describe('HttpChannel', () => {
  let service: HttpChannel;
  let httpService: HttpService;
  let testNotification: TestNotification;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [HttpChannel],
    }).compile();

    service = module.get<HttpChannel>(HttpChannel);
    httpService = module.get<HttpService>(HttpService);
    testNotification = new TestNotification();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getData', () => {
    it('should return toHttp data when only toHttp present', () => {
      const notification = new TestToHttpNotification();
      const res = service.getData(notification);
      expect(res).toEqual(testToHttpData);
    });

    it('should return toHttp data when not only toHttp present', () => {
      const res = service.getData(testNotification);
      expect(res).toEqual(testToHttpData);
    });

    it('should return toPayload data when toHttp not present', () => {
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
      expect(httpService.post).toHaveBeenCalledWith(testUrl, testGetData);
    });
  });
});
