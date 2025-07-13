import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common';
import { TagsService, Tag } from './tags.service';
import { IsNotEmpty } from 'class-validator';

class CreateTagDto {
  @IsNotEmpty()
  name!: string;
}

class UpdateTagDto {
  @IsNotEmpty()
  name!: string;
}

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async getAllTags(): Promise<Tag[]> {
    return this.tagsService.findAll();
  }

  @Post()
  async createTag(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagsService.createTag(createTagDto.name);
  }

  @Put(':id')
  async renameTag(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<Tag> {
    return this.tagsService.renameTag(id, updateTagDto.name);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteTag(@Param('id') id: string): Promise<void> {
    return this.tagsService.deleteTag(id);
  }
}
