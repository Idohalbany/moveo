import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { DbModule } from '../../db/db.module';

@Module({
  imports: [DbModule],
  providers: [TagsService],
  controllers: [TagsController],
})
export class TagsModule {}
