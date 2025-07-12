import { Inject, Injectable, Logger } from '@nestjs/common';
import { Pool, QueryResultRow } from 'pg';
import { DB_CONFIG, DbConfig } from './dbTypes';

@Injectable()
export class DbService {
  private readonly pool: Pool;
  private readonly logger = new Logger(DbService.name);

  constructor(@Inject(DB_CONFIG) private dbConfig: DbConfig) {
    this.pool = new Pool({
      connectionString: dbConfig.connectionString,
      max: 10,
    });
  }

  async query<T extends QueryResultRow = any>(
    text: string,
    params?: any[],
  ): Promise<T[]> {
    const start = Date.now();
    try {
      const res = await this.pool.query<T>(text, params);
      if (this.dbConfig.logQueryTime) {
        this.logger.log(`Query: ${text} (${Date.now() - start}ms)`);
      }
      return res.rows;
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(`Query failed: ${text}`, err.stack);
      } else {
        this.logger.error(`Query failed: ${text}`, String(err));
      }
      throw err;
    }
  }

  async shutdown() {
    await this.pool.end();
  }
}
