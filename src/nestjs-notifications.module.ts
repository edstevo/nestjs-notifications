import { DynamicModule, HttpModule, Module } from '@nestjs/common';
import { NestJsNotificationsModuleAsyncOptions } from './interfaces';
import { NestJsNotificationsCoreModule } from './nestjs-notifications.core-module';
import { NestJsNotificationsService } from './nestjs-notifications.service';

@Module({
  imports: [HttpModule],
  providers: [NestJsNotificationsService],
})
export class NestJsNotificationsModule {
  public static forRoot(): DynamicModule {
    return {
      module: NestJsNotificationsModule,
      imports: [NestJsNotificationsCoreModule.forRoot()],
      exports: [NestJsNotificationsCoreModule],
    };
  }

  public static forRootAsync(
    options: NestJsNotificationsModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: NestJsNotificationsModule,
      imports: [NestJsNotificationsCoreModule.forRootAsync(options)],
      exports: [NestJsNotificationsCoreModule],
    };
  }
}
