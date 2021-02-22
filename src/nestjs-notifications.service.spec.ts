import { Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { NestJsNotificationChannel } from './channels/notification-channel.interface';
import { HttpChannel } from './channels/http/http.channel';
import { NestJsNotification } from './notification/notification.interface';
import { NestJsNotificationsService } from './nestjs-notifications.service';

jest.mock('./channels/http/http.channel');

class TestNotification implements NestJsNotification {
  public broadcastOn(): Type<NestJsNotificationChannel>[] {
    return [HttpChannel];
  }
}

describe('NestJsNotificationsService', () => {
  let module: TestingModule;
  let moduleRef: ModuleRef;
  let service: NestJsNotificationsService;
  let notification: TestNotification;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [NestJsNotificationsService],
    }).compile();

    service = module.get<NestJsNotificationsService>(NestJsNotificationsService);
    moduleRef = module.get<ModuleRef>(ModuleRef);
    notification = new TestNotification();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('send', () => {
    it('should call sendOnChannel correctly', async () => {
      service.sendOnChannel = jest.fn();

      await service.send(notification);

      expect(service.sendOnChannel).toBeCalledWith(notification, HttpChannel);
    });
  });

  describe('sendOnChannel', () => {
    it('should send via channel correctly', async () => {
      const channelService = ((await moduleRef.create(
        HttpChannel,
      )) as unknown) as jest.Mocked<HttpChannel>;

      service.resolveChannel = jest
        .fn()
        .mockImplementation(() => channelService);

      await service.sendOnChannel(notification, HttpChannel);
      expect(channelService.send).toHaveBeenCalledWith(notification);
    });
  });

  describe('resolveChannel', () => {
    it('should resolve channel correctly', async () => {
      const res = await service.resolveChannel(HttpChannel);
      expect(res).toBeInstanceOf(HttpChannel);
    });
  });
});
