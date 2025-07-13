import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { v4 as uuidv4 } from 'uuid';

export interface Tag {
  id: string;
  name: string;
}

@Injectable()
export class TagsService {
  constructor(private readonly db: DbService) {}

  async findAll(): Promise<Tag[]> {
    const query = `SELECT * FROM "tags" ORDER BY name ASC`;
    return this.db.query<Tag>(query);
  }

  async createTag(name: string): Promise<Tag> {
    if (!name.trim()) {
      throw new BadRequestException('Tag name must not be empty');
    }

    const id = uuidv4();
    const query = `INSERT INTO "tags" (id, name) VALUES ($1, $2) RETURNING *`;
    const values = [id, name];

    const [tag] = await this.db.query<Tag>(query, values);
    return tag;
  }

  async renameTag(id: string, name: string): Promise<Tag> {
    if (!name.trim()) {
      throw new BadRequestException('New tag name must not be empty');
    }

    const query = `
      UPDATE "tags"
      SET name = $2
      WHERE id = $1
      RETURNING *
    `;
    const values = [id, name];

    const [tag] = await this.db.query<Tag>(query, values);
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag;
  }

  async deleteTag(id: string): Promise<void> {
    const query = `DELETE FROM "tags" WHERE id = $1 RETURNING *`;
    const result = await this.db.query(query, [id]);

    if (result.length === 0) {
      throw new NotFoundException('Tag not found');
    }
  }
}
