import { AuthPlugin } from '@api/auth/auth.plugin';
import { AuthSessionService } from '@api/auth/auth-session.service';
import { AuthSessionDB } from '@api/auth/data/auth-session.db';
import { DatabasePlugin } from '@api/db/db.plugin';
import { EnvironmentPlugin } from '@api/global/environment.plugin';
import { eq } from 'drizzle-orm';
import Elysia, { t } from 'elysia';
import { CreateTextPostRequest } from './data/create-text-post.req';
import { PatchTextPostRequest } from './data/patch-text-post.req';
import { PostWithContentDTO } from './data/post-with-content.dto';
import { PostService } from './post.service';

export class UnauthorizedError extends Error {
  code = 401;
  status = 'UNAUTHORIZED';
}

const PostParams = t.Object({ postID: t.String({ format: 'uuid' }) });

export const PostController = new Elysia({ prefix: '/post' })
  .use(DatabasePlugin)
  .use(EnvironmentPlugin)
  .use(AuthPlugin)
  .macro({
    authenticated: {
      resolve: async ({ db, env, cookie: { accessToken } }) => {
        const sessionService = new AuthSessionService(db(), env());

        try {
          if (typeof accessToken.value !== 'string') throw new UnauthorizedError();

          const tokenData = await sessionService.accessToken.verify(accessToken.value);
          if (!tokenData) throw new UnauthorizedError();

          const session = await db().query.AuthSessionDB.findFirst({
            where: eq(AuthSessionDB.id, tokenData.sessionID),
            with: { credential: { with: { account: true }, columns: {} } },
            columns: {},
          });
          if (!session) throw new UnauthorizedError();

          accessToken.value = await sessionService.accessToken.sign({ sessionID: tokenData.sessionID });

          return { principal: session.credential.account };
        } catch (err) {
          accessToken?.remove();
          throw err;
        }
      },
    },
  })
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
    async ({ service, body }) => {
      return service.createText(body);
    },
    {
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
