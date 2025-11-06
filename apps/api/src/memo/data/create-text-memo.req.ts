import { TextContentDTO } from '@api/content/data/text-content.dto';
import { type Static, t } from 'elysia';
import { MemoDTO } from './memo.dto';

export type CreateTextMemo = Static<typeof CreateTextMemoRequest>;

export const CreateTextMemoRequest = t.Composite([
  t.Pick(MemoDTO, ['geolocation']),
  t.Partial(t.Pick(MemoDTO, ['visibility'])),
  t.Pick(TextContentDTO, ['content']),
]);
