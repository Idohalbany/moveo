import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';

export interface Tag {
  id: number;
  name: string;
}

@Injectable()
export class TagsService {
  constructor(private readonly db: DbService) {}

  async findAll(): Promise<Tag[]> {
    const rows = await this.db.query<Tag>(
      'SELECT * FROM "Tags" ORDER BY id DESC',
    );
    return rows;
  }
}
