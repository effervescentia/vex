import { AccountDB } from '@api/account/data/account.db';
import { TextContentDB } from '@api/content/data/text-content.db';
import { geolocation, id, nativeEnum, timestamps, uuidV7 } from '@bltx/db';
import { relations } from 'drizzle-orm';
import { index, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { MemoBoostDB } from './memo-boost.db';
import { MemoVisibility } from './memo-visibility.enum';

export const MemoVisibilityEnum = nativeEnum('memo_visibility', MemoVisibility);

export const MemoDB = pgTable(
  'memo',
  {
    id: id('id'),
    authorID: uuidV7('author_id')
      .references(() => AccountDB.id, { onDelete: 'cascade' })
      .notNull(),
    visibility: MemoVisibilityEnum('visibility').default(MemoVisibility.PUBLIC).notNull(),
    geolocation: geolocation('geolocation').notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    ...timestamps,
  },
  (t) => [index().on(t.authorID)],
);

export const MemoRelations = relations(MemoDB, ({ one, many }) => ({
  author: one(AccountDB, { fields: [MemoDB.authorID], references: [AccountDB.id] }),
  text: one(TextContentDB),
  boosts: many(MemoBoostDB),
}));
