import type { Environment } from '@api/app/app.env';
import { PostDB } from '@api/db/db.schema';
import type { DB } from '@api/db/db.types';
import { DataService } from '@api/global/data.service';
import { ForbiddenError } from '@api/global/forbidden.error';
import { insertOne } from '@bltx/db';
import { addSeconds } from 'date-fns';
import { and, desc, eq, gt } from 'drizzle-orm';
import { humanId } from 'human-id';
import { AccountAliasDB } from './data/account-alias.db';
import type { AccountAlias } from './data/account-alias.dto';
import type { UpdateAccountAlias } from './data/update-account-alias.req';

export class AccountAliasService extends DataService {
  private static generateName() {
    return humanId({ addAdverb: true, capitalize: false, separator: '_' });
  }

  private static getMillisecondSuffix() {
    return String(new Date().getMilliseconds()).padStart(3, '0');
  }

  private static getNanosecondSuffix() {
    return (String(performance.now()).split('.')[1] ?? '').padStart(6, '0');
  }

  constructor(
    db: DB,
    private readonly env: Environment,
  ) {
    super(db);
  }

  private async getByName(name: string) {
    return this.db.query.AccountAliasDB.findFirst({ where: eq(AccountAliasDB.name, name) });
  }

  private async getActive(accountID: string) {
    return this.db.query.AccountAliasDB.findFirst({
      where: and(eq(AccountAliasDB.accountID, accountID), eq(AccountAliasDB.isActive, true)),
    });
  }

  private async create(accountID: string, name: string) {
    return insertOne(this.db, AccountAliasDB, { name, accountID, isActive: true });
  }

  async getAll(accountID: string) {
    return this.db.query.AccountAliasDB.findMany({
      where: eq(AccountAliasDB.accountID, accountID),
      orderBy: desc(AccountAliasDB.createdAt),
    });
  }

  /**
   * this function recursively calls itself to find a new unique account alias
   */
  async createInitial(accountID: string): Promise<AccountAlias> {
    const baseName = AccountAliasService.generateName();
    const nameWithMilliseconds = `${baseName}_${AccountAliasService.getMillisecondSuffix()}`;
    const nameWithNanoseconds = `${baseName}_${AccountAliasService.getNanosecondSuffix()}`;

    for (const name of [baseName, nameWithMilliseconds, nameWithNanoseconds]) {
      if (!(await this.getByName(name))) return this.create(accountID, name);
    }

    return this.createInitial(accountID);
  }

  async update(accountID: string, { name }: UpdateAccountAlias) {
    const aliasCount = await this.db.$count(AccountAliasDB, eq(AccountAliasDB.accountID, accountID));

    if (aliasCount > this.env.ACCOUNT_MAX_ALIASES) {
      throw new ForbiddenError(`Maximum of ${this.env.ACCOUNT_MAX_ALIASES} aliases are associated with this account`);
    }

    await this.transaction(async (tx) => {
      const self = new AccountAliasService(tx, this.env);

      const activeAlias = await self.getActive(accountID);

      let expiry = this.env.ACCOUNT_ALIAS_EXPIRY_LONG;

      if (activeAlias) {
        // count the number of posts made using the active alias
        const activityCount = await tx.$count(
          PostDB,
          and(eq(PostDB.authorID, accountID), gt(PostDB.createdAt, activeAlias.createdAt)),
        );

        if (!activityCount) {
          // use a shorter expiry if there is no activity associated with the alias
          expiry = this.env.ACCOUNT_ALIAS_EXPIRY_SHORT;
        }
      }

      await tx
        .update(AccountAliasDB)
        .set({ isActive: false, expiredAt: addSeconds(new Date(), expiry) })
        .where(and(eq(AccountAliasDB.accountID, accountID), eq(AccountAliasDB.isActive, true)));

      await self.create(accountID, name);
    });
  }
}
