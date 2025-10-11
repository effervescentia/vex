import type { DB } from '@api/db/db.types';

export class DataService {
  constructor(protected readonly db: DB) {}
}
