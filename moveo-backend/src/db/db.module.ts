// db.module.ts
import { Global, DynamicModule, Module } from '@nestjs/common';
import { DbService } from './db.service';
import { DB_CONFIG, DbConfig } from './dbTypes';

@Global()
@Module({})
export class DbModule {
  static register(dbConfig: DbConfig): DynamicModule {
    return {
      module: DbModule,
      providers: [
        {
          provide: DB_CONFIG,
          useValue: dbConfig,
        },
        DbService,
      ],
      exports: [DbService],
    };
  }
}
