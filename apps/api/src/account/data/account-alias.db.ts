import { id, timestamps, uuidV7 } from '@bltx/db';
import { relations } from 'drizzle-orm';
import { boolean, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { AccountDB } from './account.db';

export const AccountAliasDB = pgTable(
  'account_alias',
  {
    id: id('id'),
    accountID: uuidV7('account_id')
      .references(() => AccountDB.id, { onDelete: 'cascade' })
      .notNull(),
    name: text('name').notNull().unique(),
    isActive: boolean('is_active').notNull(),
    expiredAt: timestamp('expires_at', { withTimezone: true }),
    ...timestamps,
  },
  (t) => [index().on(t.accountID), index().on(t.name)],
);

export const AccountAliasRelations = relations(AccountAliasDB, ({ one }) => ({
  account: one(AccountDB, { fields: [AccountAliasDB.accountID], references: [AccountDB.id] }),
}));
