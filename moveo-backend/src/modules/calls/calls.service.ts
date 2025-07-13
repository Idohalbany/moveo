import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { v4 as uuidv4 } from 'uuid';

export interface Call {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  tasks: {
    id: string;
    name: string;
    status: number;
  }[];
}

@Injectable()
export class CallsService {
  constructor(private readonly db: DbService) {}

  async findAll(): Promise<Call[]> {
    const query = `SELECT * FROM calls ORDER BY "updatedAt" DESC`;
    return this.db.query<Call>(query);
  }

  async findById(id: string): Promise<Call | null> {
    const callQuery = `SELECT * FROM calls WHERE id = $1`;
    const [call] = await this.db.query<Call>(callQuery, [id]);

    if (!call) return null;

    const tagsQuery = `
      SELECT t.id
      FROM tags t
      JOIN call_tags ct ON ct."tagId" = t.id
      WHERE ct."callId" = $1
    `;
    const tagRows = await this.db.query<{ id: string }>(tagsQuery, [id]);
    const tags = tagRows.map((t) => t.id);

    const tasksQuery = `
      SELECT id, name, status
      FROM tasks
      WHERE "callId" = $1
    `;
    const tasks = await this.db.query<{
      id: string;
      name: string;
      status: number;
    }>(tasksQuery, [id]);

    return { ...call, tags, tasks };
  }

  async createCall(name: string, tagIds: string[]): Promise<Call> {
    const id = uuidv4();

    const query = `
    INSERT INTO calls (id, name)
    VALUES ($1, $2)
  `;
    await this.db.query(query, [id, name]);

    if (tagIds.length > 0) {
      const tagInsert = `
      INSERT INTO call_tags ("callId", "tagId")
      VALUES ${tagIds.map((_, i) => `($1, $${i + 2})`).join(', ')}
    `;
      await this.db.query(tagInsert, [id, ...tagIds]);
    }

    return this.findById(id) as Promise<Call>;
  }

  async updateCall(
    id: string,
    name?: string,
    tagIds?: string[],
  ): Promise<Call> {
    const exists = await this.db.query(`SELECT 1 FROM calls WHERE id = $1`, [
      id,
    ]);
    if (exists.length === 0) throw new NotFoundException('Call not found');

    await this.db.query(
      `
        UPDATE calls
        SET name = COALESCE($2, name), "updatedAt" = NOW()
        WHERE id = $1
      `,
      [id, name],
    );

    if (tagIds) {
      await this.db.query(`DELETE FROM call_tags WHERE "callId" = $1`, [id]);

      if (tagIds.length > 0) {
        const tagInsert = `
          INSERT INTO call_tags ("callId", "tagId")
          VALUES ${tagIds.map((_, i) => `($1, $${i + 2})`).join(', ')}
        `;
        await this.db.query(tagInsert, [id, ...tagIds]);
      }
    }

    return this.findById(id) as Promise<Call>;
  }
}
