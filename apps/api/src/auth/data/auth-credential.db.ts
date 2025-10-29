import { AccountDB } from '@api/account/data/account.db';
import { nativeEnum, timestamps, uuidV7 } from '@bltx/db';
import { relations } from 'drizzle-orm';
import { index, pgTable, text } from 'drizzle-orm/pg-core';
import { AuthAlgorithm } from './auth-algorithm.enum';
import { AuthSessionDB } from './auth-session.db';
import { AuthTransport } from './auth-transport.enum';

export const AuthAlgorithmEnum = nativeEnum('auth_algorithm', AuthAlgorithm);
export const AuthTransportEnum = nativeEnum('auth_transport', AuthTransport);

export const AuthCredentialDB = pgTable(
  'auth_credential',
  {
    id: text('id').primaryKey(),
    accountID: uuidV7('account_id')
      .references(() => AccountDB.id, { onDelete: 'cascade' })
      .notNull(),
    publicKey: text('public_key').notNull(),
    algorithm: AuthAlgorithmEnum('algorithm').notNull(),
    transports: AuthTransportEnum('transports').array().notNull(),

    ...timestamps,
  },
  (t) => [index().on(t.accountID)],
);

export const AuthCredentialRelations = relations(AuthCredentialDB, ({ one }) => ({
  account: one(AccountDB, { fields: [AuthCredentialDB.accountID], references: [AccountDB.id] }),
  session: one(AuthSessionDB),
}));
