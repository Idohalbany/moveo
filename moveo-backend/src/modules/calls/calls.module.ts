import { Module } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallsController } from './calls.controller';
import { DbModule } from '../../db/db.module';

@Module({
  imports: [DbModule],
  providers: [CallsService],
  controllers: [CallsController],
})
export class CallsModule {}
