import { Provider } from '@nestjs/common';
import { DynamicModule, Global, Module, ValueProvider } from '@nestjs/common';
import { JobOptions, Queue } from 'bull';
import {
  NESTJS_NOTIFICATIONS_JOB_OPTIONS,
  NESTJS_NOTIFICATIONS_OPTIONS,
  NESTJS_NOTIFICATIONS_QUEUE,
} from './constants';
import {
  NestJsNotificationsModuleAsyncOptions,
  NestJsNotificationsModuleOptions,
  NestJsNotificationsModuleOptionsFactory,
} from './interfaces';
import { NestJsNotificationsService } from './nestjs-notifications.service';

@Global()
@Module({})
export class NestJsNotificationsCoreModule {
  public static forRoot(
    options: NestJsNotificationsModuleOptions,
  ): DynamicModule {
    const queueProvider: ValueProvider = {
      provide: NESTJS_NOTIFICATIONS_QUEUE,
      useValue: options.queue ? options.queue : null,
    };

    const jobOptionsProvider: ValueProvider = {
      provide: NESTJS_NOTIFICATIONS_JOB_OPTIONS,
      useValue: options.defaultJobOptions ? options.defaultJobOptions : {},
    };

    return {
      global: true,
      module: NestJsNotificationsCoreModule,
      providers: [
        queueProvider,
        jobOptionsProvider,
        NestJsNotificationsService,
      ],
      exports: [
        NESTJS_NOTIFICATIONS_QUEUE,
        NESTJS_NOTIFICATIONS_JOB_OPTIONS,
        NestJsNotificationsService,
      ],
    };
  }

  public static forRootAsync(
    asyncOptions: NestJsNotificationsModuleAsyncOptions,
  ): DynamicModule {
    return {
      global: true,
      module: NestJsNotificationsCoreModule,
      imports: asyncOptions.imports || [],
      providers: [
        ...this.createAsyncProviders(asyncOptions),
        ...this.createQueueProvider(),
        NestJsNotificationsService,
      ],
      exports: [
        NESTJS_NOTIFICATIONS_QUEUE,
        NESTJS_NOTIFICATIONS_JOB_OPTIONS,
        NestJsNotificationsService,
      ],
    };
  }

  private static createQueueProvider(): Provider[] {
    return [
      {
        provide: NESTJS_NOTIFICATIONS_QUEUE,
        inject: [NESTJS_NOTIFICATIONS_OPTIONS],
        useFactory(options: NestJsNotificationsModuleOptions): Queue {
          return options.queue ? options.queue : null;
        },
      },
      {
        provide: NESTJS_NOTIFICATIONS_JOB_OPTIONS,
        inject: [NESTJS_NOTIFICATIONS_OPTIONS],
        useFactory(options: NestJsNotificationsModuleOptions): JobOptions {
          return options.defaultJobOptions ? options.defaultJobOptions : {};
        },
      },
    ];
  }

  static createAsyncProviders(
    options: NestJsNotificationsModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    } else if (!options.useClass) {
      return [
        {
          provide: NESTJS_NOTIFICATIONS_OPTIONS,
          useValue: {},
          inject: options.inject || [],
        },
      ];
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  static createAsyncOptionsProvider(
    options: NestJsNotificationsModuleAsyncOptions,
  ): Provider<any> {
    if (options.useFactory) {
      return {
        provide: NESTJS_NOTIFICATIONS_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = options.useClass || options.useExisting;

    if (!inject) {
      throw new Error(
        'Invalid configuration. Must provide useFactory, useClass or useExisting',
      );
    }

    return {
      provide: NESTJS_NOTIFICATIONS_OPTIONS,
      async useFactory(
        optionsFactory: NestJsNotificationsModuleOptionsFactory,
      ): Promise<NestJsNotificationsModuleOptions> {
        const opts = await optionsFactory.createNestJsNotificationsModuleOptions();
        return opts;
      },
      inject: [inject],
    };
  }
}
