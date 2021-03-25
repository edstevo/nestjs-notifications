import { ModuleMetadata } from '@nestjs/common';

export type NestJsNotificationsModuleAsyncOptions = Pick<
  ModuleMetadata,
  'imports'
>;
