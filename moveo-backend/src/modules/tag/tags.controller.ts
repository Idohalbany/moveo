import { Controller, Get } from '@nestjs/common';
import { TagsService, Tag } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async getAllTags(): Promise<Tag[]> {
    return this.tagsService.findAll();
  }
}
