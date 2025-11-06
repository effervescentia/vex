import { AuthPlugin } from '@api/auth/auth.plugin';
import { DatabasePlugin } from '@api/db/db.plugin';
import { BadRequestError } from '@api/global/bad-request.error';
import { EnvironmentPlugin } from '@api/global/environment.plugin';
import Elysia, { NotFoundError, t } from 'elysia';
import { CreateTextMemoRequest } from './data/create-text-memo.req';
import { MemoWithContentDTO } from './data/memo-with-content.dto';
import { PatchTextMemoRequest } from './data/patch-text-memo.req';
import { MemoService } from './memo.service';

class MemoNotFoundError extends NotFoundError {
  constructor(memoID: string) {
    super(`No Memo exists with ID '${memoID}'`);
  }
}

const MemoParams = t.Object({ memoID: t.String({ format: 'uuid' }) });

export const MemoController = new Elysia({ prefix: '/memo' })
  .use(DatabasePlugin)
  .use(EnvironmentPlugin)
  .use(AuthPlugin)
  .derive({ as: 'scoped' }, ({ db }) => ({ service: new MemoService(db()) }))

  .get(
    '/',
    async ({ service, principal }) => {
      return service.findWithContent(principal.id);
    },
    {
      authenticated: true,
      response: t.Array(MemoWithContentDTO),
    },
  )

  .post(
    '/text',
    async ({ service, body, principal }) => {
      return service.createText(principal.id, body);
    },
    {
      authenticated: true,
      body: CreateTextMemoRequest,
      response: MemoWithContentDTO,
    },
  )

  .patch(
    '/text/:memoID',
    async ({ service, params, body, principal }) => {
      const memo = await service.getWithContent(params.memoID);
      if (!memo || memo.authorID !== principal.id) throw new MemoNotFoundError(params.memoID);
      if (!memo.text) throw new BadRequestError(`Memo '${params.memoID}' does not have text content`);

      return service.patchText(params.memoID, body);
    },
    {
      authenticated: true,
      params: MemoParams,
      body: PatchTextMemoRequest,
      response: MemoWithContentDTO,
    },
  )

  .get(
    '/:memoID',
    async ({ service, params, principal }) => {
      const memo = await service.getWithContent(params.memoID);
      if (!memo || memo.authorID !== principal.id) throw new MemoNotFoundError(params.memoID);

      return memo;
    },
    {
      authenticated: true,
      params: MemoParams,
      response: MemoWithContentDTO,
    },
  )

  .delete(
    '/:memoID',
    async ({ service, params, principal }) => {
      const memo = await service.getWithContent(params.memoID);
      if (!memo || memo.authorID !== principal.id) throw new MemoNotFoundError(params.memoID);

      await service.delete(memo);
    },
    {
      authenticated: true,
      params: MemoParams,
    },
  );
