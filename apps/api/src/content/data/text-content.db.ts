import { PostDB } from '@api/memo/data/memo.db';
import { timestamps, uuidV7 } from '@bltx/db';
import { relations } from 'drizzle-orm';
import { index, pgTable, text } from 'drizzle-orm/pg-core';

export const TextContentDB = pgTable(
  'text_content',
  {
    postID: uuidV7('post_id')
      .references(() => PostDB.id, { onDelete: 'cascade' })
      .notNull(),
    content: text('content').notNull(),
    ...timestamps,
  },
  (t) => [index().on(t.postID)],
);

export const TextContentRelations = relations(TextContentDB, ({ one }) => ({
  post: one(PostDB, { fields: [TextContentDB.postID], references: [PostDB.id] }),
}));
