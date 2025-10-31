import { AccountDB } from '@api/account/data/account.db';
import { createdTimestamp, uuidV7 } from '@bltx/db';
import { relations } from 'drizzle-orm';
import { index, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { PostDB } from './post.db';

export const PostBoostDB = pgTable(
  'post_boost',
  {
    postID: uuidV7('post_id')
      .references(() => PostDB.id, { onDelete: 'cascade' })
      .notNull(),
    accountID: uuidV7('account_id')
      .references(() => AccountDB.id, { onDelete: 'cascade' })
      .notNull(),
    ...createdTimestamp,
  },
  (t) => [primaryKey({ columns: [t.postID, t.accountID] }), index().on(t.postID), index().on(t.accountID)],
);

export const PostBoostRelations = relations(PostBoostDB, ({ one }) => ({
  post: one(PostDB, { fields: [PostBoostDB.postID], references: [PostDB.id] }),
  account: one(AccountDB, { fields: [PostBoostDB.accountID], references: [AccountDB.id] }),
}));
