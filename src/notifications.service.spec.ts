import { Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationChannelInterface } from './channels/notification-channel.interface';
import { HttpChannel } from './channels/http/http.channel';
import { NotificationInterface } from './notification/notification.interface';
import { NotificationsService } from './notifications.service';

jest.mock('./channels/http/http.channel');

class TestNotification implements NotificationInterface {
  public broadcastOn(): Type<NotificationChannelInterface>[] {
    return [HttpChannel];
  }
}

describe('NotificationsService', () => {
  let module: TestingModule;
  let moduleRef: ModuleRef;
  let service: NotificationsService;
  let notification: TestNotification;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [NotificationsService],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
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
