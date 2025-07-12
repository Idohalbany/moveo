import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';

export interface Call {
  id: number;
  title: string;
}

@Injectable()
export class CallsService {
  constructor(private readonly db: DbService) {}

  async findAll(): Promise<Call[]> {
    const rows = await this.db.query<Call>(
      'SELECT * FROM "Calls" ORDER BY id DESC',
    );
    return rows;
  }
}
