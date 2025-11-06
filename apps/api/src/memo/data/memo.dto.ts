import { type Static, t } from 'elysia';
import { MemoVisibility } from './memo-visibility.enum';

export type Memo = Static<typeof MemoDTO>;

export const MemoDTO = t.Object({
  id: t.String({ format: 'uuid' }),
  authorID: t.String({ format: 'uuid' }),
  visibility: t.Enum(MemoVisibility),
  geolocation: t.Tuple([t.Number(), t.Number()]),
  deletedAt: t.Nullable(t.Date()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});
