import { Type } from '@nestjs/common';
import { NestJsNotificationChannel } from 'src/channels/notification-channel.interface';
import { HttpChannel } from '../channels/http/http.channel';
import { NestJsNotification } from './notification.interface';

class TestNotification implements NestJsNotification {
  /**
   * Get the channels the notification should broadcast on
   * @returns {Type<NestJsNotificationChannel>[]} array
   */
  public broadcastOn(): Type<NestJsNotificationChannel>[] {
    return [HttpChannel];
  }
}

describe('Notification', () => {
  let notification: TestNotification;

  beforeEach(() => {
    notification = new TestNotification();
  });

  it('should be defined', () => {
    expect(notification).toBeDefined();
  });

  describe('broadcastOn', () => {
    it('should return Type<BaseChannel> correctly', () => {
      const res = notification.broadcastOn();
      expect(res).toBeInstanceOf(Array);
      expect(res[0]).toEqual(HttpChannel);
    });
  });
});
