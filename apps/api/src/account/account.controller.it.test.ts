import { describe, expect, test } from 'bun:test';
import type { Environment } from '@api/app/app.env';
import { PostDB } from '@api/db/db.schema';
import type { AccountAlias } from '@api/lib';
import { PostService } from '@api/post/post.service';
import { insertOne } from '@bltx/db';
import { MockRequest, type Serialized, serialize } from '@bltx/test';
import { setupIntegrationTest } from '@test/setup.util';
import { eq } from 'drizzle-orm';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountAliasService } from './account-alias.service';
import { AccountDB } from './data/account.db';
import type { Account } from './data/account.dto';
import { AccountAliasDB } from './data/account-alias.db';
import type { AccountDetails } from './data/account-details.dto';
import type { CreateAccount } from './data/create-account.req';
import type { PatchAccount } from './data/patch-account.req';
import type { UpdateAccountAlias } from './data/update-account-alias.req';

const ENVIRONMENT = {
  ACCOUNT_MAX_ALIASES: 3,
  ACCOUNT_ALIAS_EXPIRY_SHORT: 1000,
  ACCOUNT_ALIAS_EXPIRY_LONG: 1000,
} as Environment;

describe('AccountController', () => {
  describe('POST /account', () => {
    const { app, db } = setupIntegrationTest(AccountController);

    const request = (body: CreateAccount): Promise<Serialized<AccountDetails>> =>
      app()
        .handle(new MockRequest('/account', { method: 'post', json: body }))
        .then((res) => res.json());

    test('create account with alias', async () => {
      const data: CreateAccount = { description: 'independent journalist' };

      const result = await request(data);

      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          description: data.description,
          aliases: [
            expect.objectContaining({
              id: expect.any(String),
              name: expect.any(String),
              isActive: true,
              expiredAt: null,
            }),
          ],
        }),
      );

      const { aliases: _, ...resultWithoutAliases } = result;
      expect(serialize(await db().query.AccountDB.findFirst({ where: eq(AccountDB.id, result.id) }))).toEqual(
        resultWithoutAliases,
      );

      expect(
        serialize(await db().query.AccountAliasDB.findMany({ where: eq(AccountAliasDB.accountID, result.id) })),
      ).toEqual([{ ...result.aliases[0]!, accountID: result.id }]);
    });
  });

  describe('GET /account/:accountID', () => {
    const { app, db } = setupIntegrationTest(AccountController);

    const request = (accountID: string): Promise<Serialized<AccountDetails>> =>
      app()
        .handle(new MockRequest(`/account/${accountID}`, { method: 'get' }))
        .then((res) => res.json());

    test('get account', async () => {
      const account = await new AccountService(db(), null!).create({ description: 'entrepreneur' });

      const result = await request(account.id);

      expect(result).toEqual(serialize(account));
    });
  });

  describe('PATCH /account/:accountID', () => {
    const { app, db } = setupIntegrationTest(AccountController);

    const request = (accountID: string, body: PatchAccount): Promise<Serialized<Account>> =>
      app()
        .handle(new MockRequest(`/account/${accountID}`, { method: 'patch', json: body }))
        .then((res) => res.json());

    test('patch account', async () => {
      const account = await insertOne(db(), AccountDB, { description: 'entrepreneur' });
      const data: PatchAccount = { description: 'photographer' };

      const result = await request(account.id, data);

      expect(result).toEqual({
        ...serialize(account),
        description: data.description!,
        updatedAt: expect.any(String),
      });

      expect(new Date(result.updatedAt)).toBeAfter(account.updatedAt);

      expect(serialize(await db().query.AccountDB.findFirst({ where: eq(AccountDB.id, account.id) }))).toEqual(result);
    });
  });

  describe('PUT /account/:accountID/alias', () => {
    const { app, db } = setupIntegrationTest(AccountController);

    const request = (accountID: string, body: UpdateAccountAlias): Promise<Serialized<AccountAlias[]>> =>
      app()
        .handle(new MockRequest(`/account/${accountID}/alias`, { method: 'put', json: body }))
        .then((res) => res.json());

    test('add new account alias', async () => {
      const account = await new AccountService(db(), ENVIRONMENT).create({ description: 'entrepreneur' });
      const data: UpdateAccountAlias = { name: 'many_swords' };

      const result = await request(account.id, data);

      expect(result).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          accountID: account.id,
          name: data.name,
          isActive: true,
          expiredAt: null,
        }),
        {
          ...serialize(account.aliases[0]!),
          accountID: account.id,
          isActive: false,
          updatedAt: expect.any(String),
          expiredAt: expect.any(String),
        },
      ]);

      expect(new Date(result[1]!.updatedAt)).toBeAfter(account.aliases[0]!.updatedAt);
      expect(new Date(result[1]!.expiredAt!)).toBeAfter(new Date());

      expect(serialize(await new AccountAliasService(db(), null!).getAll(account.id))).toEqual(result);
    });
  });

  describe('DELETE /account/:accountID', () => {
    const { app, db } = setupIntegrationTest(AccountController);

    const request = (accountID: string) => app().handle(new MockRequest(`/account/${accountID}`, { method: 'delete' }));

    test('delete account', async () => {
      const account = await new AccountService(db(), ENVIRONMENT).create({ description: 'entrepreneur' });
      await new PostService(db()).createText({ authorID: account.id, geolocation: [0, 0], content: 'my post' });

      await request(account.id);

      expect(await db().$count(AccountDB, eq(AccountDB.id, account.id))).toBe(0);
      expect(await db().$count(AccountAliasDB, eq(AccountAliasDB.accountID, account.id))).toBe(0);
      expect(await db().$count(PostDB, eq(PostDB.authorID, account.id))).toBe(0);
    });
  });
});
