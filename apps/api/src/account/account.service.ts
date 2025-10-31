import type { Environment } from '@api/app/app.env';
import type { DB } from '@api/db/db.types';
import { DataService } from '@api/global/data.service';
import { insertOne, updateOne } from '@bltx/db';
import { desc, eq } from 'drizzle-orm';
import { InternalServerError } from 'elysia';
import { AccountAliasService } from './account-alias.service';
import { AccountDB } from './data/account.db';
import { AccountAliasDB } from './data/account-alias.db';
import type { CreateAccount } from './data/create-account.req';
import type { PatchAccount } from './data/patch-account.req';

export class AccountService extends DataService {
  constructor(
    db: DB,
    private readonly env: Environment,
  ) {
    super(db);
  }

  private async unsafeGetDetails(accountID: string) {
    const account = await this.getDetails(accountID);
    if (!account) throw new InternalServerError(`No Account exists with ID '${accountID}'`);

    return account;
  }

  async getDetails(accountID: string) {
    return this.db.query.AccountDB.findFirst({
      where: eq(AccountDB.id, accountID),
      with: {
        aliases: {
          columns: { accountID: false },
          orderBy: desc(AccountAliasDB.createdAt),
        },
      },
    });
  }

  async create(data: CreateAccount) {
    const accountID = await this.transaction(async (tx) => {
      const account = await insertOne(tx, AccountDB, data);

      await new AccountAliasService(tx, this.env).createInitial(account.id);

      return account.id;
    });

    return this.unsafeGetDetails(accountID);
  }

  async patch(accountID: string, data: PatchAccount) {
    return updateOne(this.db, AccountDB, eq(AccountDB.id, accountID), data);
  }

  async delete(accountID: string) {
    // TODO: delete content of each memo explicitly
    await this.db.delete(AccountDB).where(eq(AccountDB.id, accountID));
  }
}
