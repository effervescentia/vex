import { DatabasePlugin } from '@api/db/db.plugin';
import Elysia, { t } from 'elysia';
import { CreateTextPostRequest } from './data/create-text-post.req';
import { PatchTextPostRequest } from './data/patch-text-post.req';
import { PostDTO } from './data/post.dto';
import { PostWithContentDTO } from './data/post-with-content.dto';
import { PostService } from './post.service';

const PostParams = t.Object({ postID: t.String({ format: 'uuid' }) });

export const PostController = new Elysia({ prefix: '/post' })
  .use(DatabasePlugin)
  .derive({ as: 'scoped' }, ({ db }) => ({ service: new PostService(db()) }))

  .post(
    '/text',
    async ({ service, body }) => {
      return service.createText(body);
    },
    {
      body: CreateTextPostRequest,
      response: PostDTO,
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
      response: PostDTO,
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
