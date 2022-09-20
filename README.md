# NestJs Notifications

NestJs Notifications is a flexible multi-channel notification service inspired by Laravel Notifications: https://github.com/illuminate/notifications

This module is designed for sending short informational messages across a variety of delivery channels that notify users of something that occurred in your application. For example, if you are writing a billing application, you might send an "Invoice Paid" notification to your users via email and SMS channels.

You can use pre-built delivery channels in this package, or you can create your own custom channels that can be easily integrated with this package.

## Installation

```bash
$ npm install nestjs-notifications --save
```

## Usage

To make use of this package, you will need a Notification and at least one Channel. You can create your own custom channels, or you can use pre-built ones that come with this package.

Example Channels and example Notifications are below.

Once this has been done, you can be trigger notifications to be sent like so:

```ts
import { HttpService, Injectable } from '@nestjs/common';
import { NestJsNotificationsService } from 'nestjs-notifications';
import { ExampleNotification } from 'xxxx';

@Injectable()
export class ExampleService {
  constructor(private readonly notifications: NestJsNotificationsService) {}

  /**
   * Send the given notification
   */
  public async send(): Promise<void> {
    const notification = new ExampleNotification();
    this.notifications.send(notification);
  }
}
```

### Example Channel

All channels are resolved inside the IOC container, so you can import services, such as the HttpService as you need them.

```ts
import { HttpService, Injectable } from '@nestjs/common';
import { NestJsNotificationChannel, NestJsNotification } from 'nestjs-notifications';

@Injectable()
export class ExampleHttpChannel implements NestJsNotificationChannel {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Send the given notification
   * @param notification
   */
  public async send(notification: NestJsNotification): Promise<void> {
    const data = this.getData(notification);
    await this.httpService.post(notification.httpUrl(), data).toPromise();
  }

  /**
   * Get the data for the notification.
   * @param notification
   */
  getData(notification: NestJsNotification) {
    return notification.toPayload();
  }
}
```

### Example Notification

You can specify as many channels as you want to in the `broadcastOn()` function.

When constructing payloads, you can specify functions to create customised payloads for each channel, or fallback to the default `toPayload()` method.

You can also pass any data you need into the constructor of the notification to pass to the payload constructors.

```ts
import { Type } from '@nestjs/common';
import { HttpChannel, NestJsNotificationChannel, NestJsNotification } from 'nestjs-notifications';
import { CustomChannel } from './src/your-project/custom-channel';
import { EmailChannel } from './src/your-project/email-channel';

export class ExampleNotification implements NestJsNotification {

  /**
   * Data passed into the notification to be used when
   * constructing the different payloads
   */
  private data: any;

  constructor(data: any) {
    this.data = data;
  }

  /**
   * Get the channels the notification should broadcast on
   * @returns {Type<NestJsNotificationChannel>[]} array
   */
  public broadcastOn(): Type<NestJsNotificationChannel>[] {
    return [
      HttpChannel,
      CustomChannel,
      EmailChannel
    ];
  }

  toHttp() { }

  toCustom() { }

  toEmail() { }

  /**
   * Get the json representation of the notification.
   * @returns {}
   */
  toPayload(): any {
    return this.data;
  }
}
```

## Channels Included in this Package

### HttpChannel

The HttpChannel is designed to post data to an external URL/webhook. In order to utilise the channel correctly, you need specify the `httpUrl()` function and return the URL. You can then choose between using the standard `toPayload()` method or `toHttp()` method to the payload specifically for this channel.

You can implement the `HttpNotification` interface on your Notification Class to ensure you include the right methods.

#### HttpChannel Class

```ts
import {
  HttpService,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpNotification, NestJsNotificationChannel } from 'nestjs-notifications';

@Injectable()
export class HttpChannel implements NestJsNotificationChannel {

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
    if (typeof notification.toHttp === 'function') {
      return notification.toHttp();
    }

    if (typeof notification.toPayload === 'function') {
      return notification.toPayload();
    }

    throw new InternalServerErrorException(
      'Notification is missing toPayload method.',
    );
  }
}
```

#### HttpNotification Interface

```ts
import { NestJsNotification } from 'nestjs-notifications';

export interface HttpNotification extends NestJsNotification {
  /**
   * Define the Http url to send the notification to
   * @returns {string}
   */
  httpUrl(): string;

  /**
   * Get the Http representation of the notification.
   * @returns {any} http payload data
   */
  toHttp?(): any;
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

## Collaborating

Would appreciate any support anyone may wish to offer. Please get in contact.

## License

NestJs Notifications is [MIT licensed](LICENSE).
