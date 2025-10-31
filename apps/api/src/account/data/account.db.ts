import { AuthCredentialDB } from '@api/auth/data/auth-credential.db';
import { MemoDB } from '@api/memo/data/memo.db';
import { MemoBoostDB } from '@api/memo/data/memo-boost.db';
import { id, timestamps } from '@bltx/db';
import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { AccountAliasDB } from './account-alias.db';

export const AccountDB = pgTable('account', {
  id: id('id'),
  description: text('description'),
  ...timestamps,
});

export const AccountRelations = relations(AccountDB, ({ many }) => ({
  credentials: many(AuthCredentialDB),
  aliases: many(AccountAliasDB),
  memos: many(MemoDB),
  boosts: many(MemoBoostDB),
}));
