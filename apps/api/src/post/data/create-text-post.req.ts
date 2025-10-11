import { TextContentDTO } from '@api/content/data/text-content.dto';
import { type Static, t } from 'elysia';
import { PostDTO } from './post.dto';

export type CreateTextPost = Static<typeof CreateTextPostRequest>;

export const CreateTextPostRequest = t.Composite([
  t.Pick(PostDTO, ['authorID', 'geolocation']),
  t.Partial(t.Pick(PostDTO, ['visibility'])),
  t.Pick(TextContentDTO, ['content']),
]);
