import { DatabasePlugin } from '@api/db/db.plugin';
import { eq } from 'drizzle-orm';
import Elysia, { t } from 'elysia';
import { AccountService } from './account.service';
import { AccountDB } from './data/account.db';
import { AccountDTO } from './data/account.dto';
import { CreateAccountRequest } from './data/create-account.req';
import { PatchAccountRequest } from './data/patch-account.req';

const AccountParams = t.Object({ accountID: t.String({ format: 'uuid' }) });

export const AccountController = new Elysia({ prefix: '/account' })
  .use(DatabasePlugin)
  .derive({ as: 'scoped' }, ({ db }) => ({ service: new AccountService(db()) }))

  .get(
    '/',
    async ({ db }) => {
      return db().query.AccountDB.findMany();
    },
    {
      response: t.Array(AccountDTO),
    },
  )

  .post(
    '/',
    async ({ service, body }) => {
      return service.create(body);
    },
    {
      body: CreateAccountRequest,
      response: AccountDTO,
    },
  )

  .get(
    '/:accountID',
    async ({ db, params, status }) => {
      const account = await db().query.AccountDB.findFirst({ where: eq(AccountDB.id, params.accountID) });
      if (!account) return status(404, `No Account exists with ID '${params.accountID}'`);

      return account;
    },
    {
      params: AccountParams,
      response: {
        200: AccountDTO,
        404: t.String(),
      },
    },
  )

  .patch(
    '/:accountID',
    async ({ service, params, body }) => {
      return service.patch(params.accountID, body);
    },
    {
      params: AccountParams,
      body: PatchAccountRequest,
      response: AccountDTO,
    },
  )

  .delete(
    '/:accountID',
    async ({ service, params }) => {
      await service.delete(params.accountID);
    },
    {
      params: AccountParams,
    },
  );
