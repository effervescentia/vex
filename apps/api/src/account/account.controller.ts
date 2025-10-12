import { DatabasePlugin } from '@api/db/db.plugin';
import { EnvironmentPlugin } from '@api/global/environment.plugin';
import Elysia, { t } from 'elysia';
import { AccountService } from './account.service';
import { AccountAliasService } from './account-alias.service';
import { AccountDTO } from './data/account.dto';
import { AccountAliasDTO } from './data/account-alias.dto';
import { AccountDetailsDTO } from './data/account-details.dto';
import { CreateAccountRequest } from './data/create-account.req';
import { PatchAccountRequest } from './data/patch-account.req';
import { UpdateAccountAliasRequest } from './data/update-account-alias.req';

const AccountParams = t.Object({ accountID: t.String({ format: 'uuid' }) });

export const AccountController = new Elysia({ prefix: '/account' })
  .use(DatabasePlugin)
  .use(EnvironmentPlugin)
  .derive({ as: 'scoped' }, ({ db, env }) => ({
    service: new AccountService(db(), env),
    aliasService: new AccountAliasService(db(), env),
  }))

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
      response: AccountDetailsDTO,
    },
  )

  .get(
    '/:accountID',
    async ({ service, params, status }) => {
      const account = await service.getDetails(params.accountID);
      if (!account) return status(404, `No Account exists with ID '${params.accountID}'`);

      return account;
    },
    {
      params: AccountParams,
      response: {
        200: AccountDetailsDTO,
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

  .put(
    '/:accountID/alias',
    async ({ aliasService, params, body }) => {
      await aliasService.update(params.accountID, body);

      return aliasService.getAll(params.accountID);
    },
    {
      params: AccountParams,
      body: UpdateAccountAliasRequest,
      response: t.Array(AccountAliasDTO),
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
