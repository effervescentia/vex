import { describe, expect, test } from 'bun:test';
import { AccountDB, PostDB, TextContentDB } from '@api/db/db.schema';
import type { PostWithContent } from '@api/lib';
import { insertOne } from '@bltx/db';
import { MockRequest } from '@bltx/test';
import { setupIntegrationTest } from '@test/setup.util';
import { eq } from 'drizzle-orm';
import type { CreateTextPost } from './data/create-text-post.req';
import type { PatchTextPost } from './data/patch-text-post.req';
import { PostVisibility } from './data/post-visibility.enum';
import { PostController } from './post.controller';
import { PostService } from './post.service';

describe('PostController', () => {
  describe('POST /post/text', () => {
    const { app, db } = setupIntegrationTest(PostController);

    const request = (body: CreateTextPost): Promise<PostWithContent> =>
      app()
        .handle(new MockRequest('/post/text', { method: 'post', json: body }))
        .then((res) => res.json());

    test('create text post', async () => {
      const account = await insertOne(db(), AccountDB, {});
      const data: CreateTextPost = { authorID: account.id, geolocation: [0, 0], content: 'my first post' };

      const result = await request(data);

      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          authorID: account.id,
          geolocation: data.geolocation,
          visibility: PostVisibility.PUBLIC,
          text: expect.objectContaining({ content: data.content }),
        }),
      );

      expect(await db().query.PostDB.findFirst({ where: eq(PostDB.id, result.id) })).toEqual(
        expect.objectContaining({
          authorID: account.id,
          geolocation: data.geolocation,
          visibility: PostVisibility.PUBLIC,
        }),
      );

      expect(await db().query.TextContentDB.findFirst({ where: eq(TextContentDB.postID, result.id) })).toEqual(
        expect.objectContaining({ content: data.content }),
      );
    });
  });

  describe('PATCH /post/text/:postID', () => {
    const { app, db } = setupIntegrationTest(PostController);

    const request = (postID: string, body: PatchTextPost): Promise<PostWithContent> =>
      app()
        .handle(new MockRequest(`/post/text/${postID}`, { method: 'patch', json: body }))
        .then((res) => res.json());

    test('patch text post', async () => {
      const account = await insertOne(db(), AccountDB, {});
      const post = await new PostService(db()).createText({
        authorID: account.id,
        geolocation: [0, 0],
        content: 'my first post',
      });
      const data: PatchTextPost = { content: 'my updated text' };

      const result = await request(post.id, data);

      expect(result).toEqual(expect.objectContaining({ text: expect.objectContaining({ content: data.content }) }));

      expect(await db().query.TextContentDB.findFirst({ where: eq(TextContentDB.postID, post.id) })).toEqual(
        expect.objectContaining({ content: data.content }),
      );
    });
  });

  describe('GET /post/:postID', () => {
    const { app, db } = setupIntegrationTest(PostController);

    const request = (postID: string): Promise<unknown> =>
      app()
        .handle(new MockRequest(`/post/${postID}`, { method: 'get' }))
        .then((res) => res.json());

    test('get text post', async () => {
      const account = await insertOne(db(), AccountDB, {});
      const content = 'my first post';
      const post = await new PostService(db()).createText({
        authorID: account.id,
        geolocation: [0, 0],
        content,
      });

      const result = await request(post.id);

      expect(result).toEqual({
        ...post,
        text: expect.objectContaining({ content }),
        createdAt: post.createdAt.toJSON(),
        updatedAt: post.createdAt.toJSON(),
      });
    });
  });

  describe('DELETE /post/:postID', () => {
    const { app, db } = setupIntegrationTest(PostController);

    const request = (postID: string) => app().handle(new MockRequest(`/post/${postID}`, { method: 'delete' }));

    test('delete text post', async () => {
      const account = await insertOne(db(), AccountDB, {});
      const post = await new PostService(db()).createText({
        authorID: account.id,
        geolocation: [0, 0],
        content: 'my first post',
      });

      await request(post.id);

      expect(await db().$count(PostDB, eq(PostDB.id, post.id))).toBe(0);
      expect(await db().$count(TextContentDB, eq(TextContentDB.postID, post.id))).toBe(0);
    });
  });
});
