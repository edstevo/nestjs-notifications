import { DynamicModule, Global, Module } from '@nestjs/common';
import { NestJsNotificationsModuleAsyncOptions } from './interfaces';
import { NestJsNotificationsService } from './nestjs-notifications.service';

@Global()
@Module({})
export class NestJsNotificationsCoreModule {
  public static forRoot(): DynamicModule {
    return {
      global: true,
      module: NestJsNotificationsCoreModule,
      providers: [NestJsNotificationsService],
      exports: [NestJsNotificationsService],
    };
  }

  public static forRootAsync(
    asyncOptions: NestJsNotificationsModuleAsyncOptions,
  ): DynamicModule {
    return {
      global: true,
      module: NestJsNotificationsCoreModule,
      imports: asyncOptions.imports || [],
      providers: [NestJsNotificationsService],
      exports: [NestJsNotificationsService],
    };
  }
}
