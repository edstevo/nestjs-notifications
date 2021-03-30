import { Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { NestJsNotificationChannel } from './channels/notification-channel.interface';
import { HttpChannel } from './channels/http/http.channel';
import { NestJsNotification, NestJsQueuedNotification } from './notification/notification.interface';
import { NestJsNotificationsService } from './nestjs-notifications.service';
import { NestJsNotificationsModule } from './nestjs-notifications.module';
import { BullModule, getQueueToken, InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NestJsNotificationsModuleOptions, NestJsNotificationsModuleOptionsFactory } from './interfaces';

jest.mock('./channels/http/http.channel');

class TestNotification implements NestJsNotification, NestJsQueuedNotification {
  public broadcastOn(): Type<NestJsNotificationChannel>[] {
    return [HttpChannel];
  }

  getJobOptions() { return null }
}

export class NestJsNotificationConfigService
  implements NestJsNotificationsModuleOptionsFactory {
  constructor(
    @InjectQueue('notifications_queue')
    private readonly notificationsQueue: Queue,
  ) {}

  createNestJsNotificationsModuleOptions = (): NestJsNotificationsModuleOptions => {
    return {
      queue: this.notificationsQueue,
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    }
  };
}

describe('NestJsNotificationsService', () => {
  let module: TestingModule;
  let moduleRef: ModuleRef;
  let service: NestJsNotificationsService;
  let notification: TestNotification;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [NestJsNotificationsModule.forRoot({})]
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

  describe('queuing',()=>{
    let queue: Queue;

    beforeEach(async () => {
      module = await Test.createTestingModule({
        imports: [
          NestJsNotificationsModule.forRootAsync({
            imports: [
              BullModule.forRoot({}),
              BullModule.registerQueue({
                name: 'notifications_queue',
              }),
            ],
            useClass: NestJsNotificationConfigService
          })
        ],
        providers: [

        ]
      }).compile();

      service = module.get<NestJsNotificationsService>(NestJsNotificationsService);
      moduleRef = module.get<ModuleRef>(ModuleRef);
      notification = new TestNotification();
      queue = module.get<Queue>(getQueueToken('notifications_queue'))
    });

    it('should be defined',()=>{
      expect(service).toBeDefined();
    });

    describe('queue',()=>{
      fit('should add to the queue correctly', async ()=>{
        jest.spyOn(queue, 'add').mockImplementation(()=>true as any);

        await service.queue(notification);

        expect(queue.add).toHaveBeenCalled()
      })
    });
  })
});
