import { AccountDB } from '@api/account/data/account.db';
import { createdTimestamp, uuidV7 } from '@bltx/db';
import { relations } from 'drizzle-orm';
import { index, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { MemoDB } from './memo.db';

export const MemoBoostDB = pgTable(
  'memo_boost',
  {
    memoID: uuidV7('memo_id')
      .references(() => MemoDB.id, { onDelete: 'cascade' })
      .notNull(),
    accountID: uuidV7('account_id')
      .references(() => AccountDB.id, { onDelete: 'cascade' })
      .notNull(),
    ...createdTimestamp,
  },
  (t) => [primaryKey({ columns: [t.memoID, t.accountID] }), index().on(t.memoID), index().on(t.accountID)],
);

export const MemoBoostRelations = relations(MemoBoostDB, ({ one }) => ({
  memo: one(MemoDB, { fields: [MemoBoostDB.memoID], references: [MemoDB.id] }),
  account: one(AccountDB, { fields: [MemoBoostDB.accountID], references: [AccountDB.id] }),
}));
