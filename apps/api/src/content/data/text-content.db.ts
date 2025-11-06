import { MemoDB } from '@api/memo/data/memo.db';
import { timestamps, uuidV7 } from '@bltx/db';
import { relations } from 'drizzle-orm';
import { index, pgTable, text } from 'drizzle-orm/pg-core';

export const TextContentDB = pgTable(
  'text_content',
  {
    memoID: uuidV7('memo_id')
      .references(() => MemoDB.id, { onDelete: 'cascade' })
      .notNull(),
    content: text('content').notNull(),
    ...timestamps,
  },
  (t) => [index().on(t.memoID)],
);

export const TextContentRelations = relations(TextContentDB, ({ one }) => ({
  memo: one(MemoDB, { fields: [TextContentDB.memoID], references: [MemoDB.id] }),
}));
