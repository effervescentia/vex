import { TextContentDTO } from '@api/content/data/text-content.dto';
import { type Static, t } from 'elysia';

export type PatchTextMemo = Static<typeof PatchTextMemoRequest>;

export const PatchTextMemoRequest = t.Partial(t.Pick(TextContentDTO, ['content']));
