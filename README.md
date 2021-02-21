# NestJs Notifications

NestJs Notifications is a multi-channel notification service inspired by Laravel Notifications: https://github.com/illuminate/notifications

This module is designed for sending notifications across a variety of delivery channels.

Typically, notifications should be short, informational messages that notify users of something that occurred in your application. For example, if you are writing a billing application, you might send an "Invoice Paid" notification to your users via email and SMS channels.

## Installation

```bash
$ npm install
```

## Usage

The two components you need to make use of in this module are a Channel and a Notification.

### Example Channel

```
import { HttpService, Injectable } from '@nestjs/common';
import { HttpNotification } from './http-notification.interface';
import { NotificationChannelInterface } from '../notification-channel.interface';

@Injectable()
export class HttpChannel implements NotificationChannelInterface {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Send the given notification
   * @param notification
   */
  public async send(notification: HttpNotification): Promise<void> {
    const message = this.getData(notification);
    await this.httpService.post(notification.httpUrl(), message).toPromise();
  }

  /**
   * Get the data for the notification.
   * @param notification
   */
  getData(notification: HttpNotification) {
    return notification.toPayload();
  }
}
```

### Example Notification

You can specify as many channels as you want to in the `broadcastOn` function.

```
import { Type } from '@nestjs/common';
import { HttpChannel } from '../channels/http/http.channel';
import { NotificationChannelInterface } from '../channels/notification-channel.interface';
import { NotificationInterface } from './notification.interface';

export class ExampleNotification implements NotificationInterface {
  private data: any;

  constructor(data: any) {
    this.data = data;
  }

  /**
   * Get the channels the notification should broadcast on
   * @returns {Type<NotificationChannelInterface>[]} array
   */
  public broadcastOn(): Type<NotificationChannelInterface>[] {
    return [HttpChannel];
  }

  /**
   * Get the json representation of the notification.
   * @returns {}
   */
  toPayload(): any {
    return this.data;
  }
}
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

NestJs Notifications is [MIT licensed](LICENSE).
