import type { DB } from '@api/db/db.types';
import { transaction } from '@bltx/db';

export class DataService {
  constructor(protected readonly db: DB) {}

  protected get transaction() {
    return transaction(this.db);
  }
}
