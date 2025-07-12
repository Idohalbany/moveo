import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';

export interface Task {
  id: number;
  name: string;
}

@Injectable()
export class TasksService {
  constructor(private readonly db: DbService) {}

  async findAll(): Promise<Task[]> {
    const rows = await this.db.query<Task>(
      'SELECT * FROM "tasks" ORDER BY id DESC',
    );
    return rows;
  }
}
