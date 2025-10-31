import { AuthPlugin } from '@api/auth/auth.plugin';
import { DatabasePlugin } from '@api/db/db.plugin';
import { EnvironmentPlugin } from '@api/global/environment.plugin';
import Elysia, { NotFoundError, t } from 'elysia';
import { CreateTextPostRequest } from './data/create-text-memo.req';
import { PostWithContentDTO } from './data/memo-with-content.dto';
import { PatchTextPostRequest } from './data/patch-text-memo.req';
import { PostService } from './memo.service';

const PostParams = t.Object({ postID: t.String({ format: 'uuid' }) });

export const PostController = new Elysia({ prefix: '/post' })
  .use(DatabasePlugin)
  .use(EnvironmentPlugin)
  .use(AuthPlugin)
  .derive({ as: 'scoped' }, ({ db }) => ({ service: new PostService(db()) }))

  .get(
    '/',
    async ({ service, principal }) => {
      return service.findWithContent(principal.id);
    },
    {
      authenticated: true,
      response: t.Array(PostWithContentDTO),
    },
  )

  .post(
    '/text',
    async ({ service, body, principal }) => {
      return service.createText(principal.id, body);
    },
    {
      authenticated: true,
      body: CreateTextPostRequest,
      response: PostWithContentDTO,
    },
  )

  .patch(
    '/text/:postID',
    async ({ service, params, body }) => {
      return service.patchText(params.postID, body);
    },
    {
      params: PostParams,
      body: PatchTextPostRequest,
      response: PostWithContentDTO,
    },
  )

  .get(
    '/details/:postID',
    async ({ service, params, principal }) => {
      const post = await service.getWithContent(params.postID);
      if (!post || post.authorID !== principal.id) throw new NotFoundError(`No Post exists with ID '${params.postID}'`);

      return post;
    },
    {
      authenticated: true,
      params: PostParams,
      response: PostWithContentDTO,
    },
  )

  .delete(
    '/:postID',
    async ({ service, params }) => {
      await service.delete(params.postID);
    },
    {
      params: PostParams,
    },
  );
