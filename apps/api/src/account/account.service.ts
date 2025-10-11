import { DataService } from '@api/global/data.service';
import { insertOne, updateOne } from '@bltx/db';
import { eq } from 'drizzle-orm';
import { AccountDB } from './data/account.db';
import type { CreateAccount } from './data/create-account.req';
import type { PatchAccount } from './data/patch-account.req';

export class AccountService extends DataService {
  async create(data: CreateAccount) {
    return insertOne(this.db, AccountDB, data);
  }

  async patch(accountID: string, data: PatchAccount) {
    return updateOne(this.db, AccountDB, eq(AccountDB.id, accountID), data);
  }

  async delete(accountID: string) {
    await this.db.delete(AccountDB).where(eq(AccountDB.id, accountID));
  }
}
