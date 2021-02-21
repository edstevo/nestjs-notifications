import { DynamicModule, HttpModule, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [HttpModule],
  providers: [NotificationsService],
})
export class NestJsNotificationsModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: NestJsNotificationsModule,
      providers: [NotificationsService],
      exports: [NotificationsService],
    };
  }
}
