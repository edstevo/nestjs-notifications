import { HttpModule, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [HttpModule],
  providers: [NotificationsService],
})
export class NestJsNotificationsModule {}
