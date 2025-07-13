import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { CallsModule } from './modules/calls/calls.module';
import { TagsModule } from './modules/tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule.register({
      connectionString: process.env.DATABASE_URL ?? '',
      logQueryTime: true,
    }),
    TasksModule,
    CallsModule,
    TagsModule,
  ],
  exports: [DbModule],
})
export class AppModule {}
