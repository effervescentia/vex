import { TextContentDTO } from '@api/content/data/text-content.dto';
import { type Static, t } from 'elysia';
import { MemoDTO } from './memo.dto';

export type MemoWithContent = Static<typeof MemoWithContentDTO>;

export const MemoWithContentDTO = t.Composite([
  MemoDTO,
  t.Object({
    text: t.Nullable(t.Omit(TextContentDTO, ['memoID'])),
  }),
]);
