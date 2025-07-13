import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { v4 as uuidv4 } from 'uuid';

export enum TaskStatus {
  Open = 0,
  InProgress = 1,
  Completed = 2,
}

export interface Task {
  id: string;
  callId: string;
  name: string;
  status: TaskStatus;
}

@Injectable()
export class TasksService {
  constructor(private readonly db: DbService) {}

  async findAll(): Promise<Task[]> {
    const query = `
      SELECT * FROM "tasks"
      ORDER BY id DESC
    `;
    return this.db.query<Task>(query);
  }

  async findByCallId(callId: string): Promise<Task[]> {
    const query = `
    SELECT * FROM "tasks"
    WHERE "callId" = $1
    ORDER BY id DESC
  `;
    return this.db.query<Task>(query, [callId]);
  }

  async createTask(
    callId: string,
    name: string,
    status: TaskStatus,
  ): Promise<Task> {
    if (!Object.values(TaskStatus).includes(status)) {
      throw new BadRequestException('Invalid status value');
    }

    const id = uuidv4();
    const query = `
    INSERT INTO "tasks" (id, "callId", name, status)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
    const values = [id, callId, name, status];
    const [task] = await this.db.query<Task>(query, values);

    await this.db.query(
      `UPDATE "calls" SET "updatedAt" = NOW() WHERE id = $1`,
      [callId],
    );

    return task;
  }

  async updateTask(
    id: string,
    name?: string,
    status?: TaskStatus,
  ): Promise<Task> {
    if (status !== undefined && !Object.values(TaskStatus).includes(status)) {
      throw new BadRequestException('Invalid status value');
    }

    const query = `
    UPDATE "tasks"
    SET name = COALESCE($2, name), status = COALESCE($3, status)
    WHERE id = $1
    RETURNING *
  `;
    const values = [id, name, status];
    const [task] = await this.db.query<Task>(query, values);

    if (!task) throw new NotFoundException('Task not found');

    await this.db.query(
      `
    UPDATE "calls"
    SET "updatedAt" = NOW()
    WHERE id = $1
  `,
      [task.callId],
    );

    return task;
  }

  async deleteTask(id: string): Promise<void> {
    // First get the callId before deleting
    const [task] = await this.db.query<Task>(
      'SELECT * FROM "tasks" WHERE id = $1',
      [id],
    );
    if (!task) throw new NotFoundException('Task not found');

    await this.db.query(`DELETE FROM "tasks" WHERE id = $1`, [id]);

    await this.db.query(
      `UPDATE "calls" SET "updatedAt" = NOW() WHERE id = $1`,
      [task.callId],
    );
  }
}
