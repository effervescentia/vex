import { TextContentDTO } from '@api/content/data/text-content.dto';
import { type Static, t } from 'elysia';

export type PatchTextPost = Static<typeof PatchTextPostRequest>;

export const PatchTextPostRequest = t.Partial(t.Pick(TextContentDTO, ['content']));
