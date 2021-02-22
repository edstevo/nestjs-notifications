import { DynamicModule, HttpModule, Module } from '@nestjs/common';
import { NestJsNotificationsService } from './nestjs-notifications.service';

@Module({
  imports: [HttpModule],
  providers: [NestJsNotificationsService],
})
export class NestJsNotificationsModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: NestJsNotificationsModule,
      providers: [NestJsNotificationsService],
      exports: [NestJsNotificationsService],
    };
  }
}
