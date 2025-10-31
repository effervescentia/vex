import { AuthPlugin } from '@api/auth/auth.plugin';
import { DatabasePlugin } from '@api/db/db.plugin';
import { EnvironmentPlugin } from '@api/global/environment.plugin';
import Elysia, { t } from 'elysia';
import { CreateTextPostRequest } from './data/create-text-post.req';
import { PatchTextPostRequest } from './data/patch-text-post.req';
import { PostWithContentDTO } from './data/post-with-content.dto';
import { PostService } from './post.service';

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
    '/:postID',
    async ({ service, params, status }) => {
      const post = await service.getWithContent(params.postID);
      if (!post) return status(404, `No Post exists with ID '${params.postID}'`);

      return post;
    },
    {
      params: PostParams,
      response: {
        200: PostWithContentDTO,
        404: t.String(),
      },
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
