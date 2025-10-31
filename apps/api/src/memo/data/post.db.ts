import { AccountDB } from '@api/account/data/account.db';
import { TextContentDB } from '@api/content/data/text-content.db';
import { geolocation, id, nativeEnum, timestamps, uuidV7 } from '@bltx/db';
import { relations } from 'drizzle-orm';
import { index, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { PostBoostDB } from './post-boost.db';
import { PostVisibility } from './post-visibility.enum';

export const PostVisibilityEnum = nativeEnum('post_visibility', PostVisibility);

export const PostDB = pgTable(
  'post',
  {
    id: id('id'),
    authorID: uuidV7('author_id')
      .references(() => AccountDB.id, { onDelete: 'cascade' })
      .notNull(),
    visibility: PostVisibilityEnum('visibility').default(PostVisibility.PUBLIC).notNull(),
    geolocation: geolocation('geolocation').notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    ...timestamps,
  },
  (t) => [index().on(t.authorID)],
);

export const PostRelations = relations(PostDB, ({ one, many }) => ({
  author: one(AccountDB, { fields: [PostDB.authorID], references: [AccountDB.id] }),
  text: one(TextContentDB),
  boosts: many(PostBoostDB),
}));
