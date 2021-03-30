import { ModuleMetadata, Type } from '@nestjs/common';
import { JobOptions, Queue } from 'bull';

export type NestJsNotificationsModuleOptions = {
  queue?: Queue;
  defaultJobOptions?: JobOptions;
};

export interface NestJsNotificationsModuleOptionsFactory {
  createNestJsNotificationsModuleOptions():
    | Promise<NestJsNotificationsModuleOptions>
    | NestJsNotificationsModuleOptions;
}

export interface NestJsNotificationsModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<NestJsNotificationsModuleOptionsFactory>;
  useClass?: Type<NestJsNotificationsModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) =>
    | Promise<NestJsNotificationsModuleOptions>
    | NestJsNotificationsModuleOptions;
}
