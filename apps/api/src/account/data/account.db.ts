import { AuthCredentialDB } from '@api/auth/data/auth-credential.db';
import { PostDB } from '@api/post/data/post.db';
import { PostBoostDB } from '@api/post/data/post-boost.db';
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
  posts: many(PostDB),
  boosts: many(PostBoostDB),
}));
