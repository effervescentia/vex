import { describe, expect, test } from 'bun:test';
import { AccountDB, PostDB, TextContentDB } from '@api/db/db.schema';
import type { PostWithContent } from '@api/lib';
import { insertOne } from '@bltx/db';
import { MockRequest, type Serialized, serialize } from '@bltx/test';
import { setupIntegrationTest } from '@test/setup.util';
import { eq } from 'drizzle-orm';
import type { CreateTextPost } from './data/create-text-memo.req';
import { PostVisibility } from './data/memo-visibility.enum';
import type { PatchTextPost } from './data/patch-text-memo.req';
import { PostController } from './memo.controller';
import { PostService } from './memo.service';

describe('MemoController', () => {
  describe('GET /post', () => {
    const { app, db } = setupIntegrationTest(PostController);

    const request = (accountID: string): Promise<Serialized<PostWithContent[]>> =>
      app()
        .handle(new MockRequest('/post', { method: 'get', headers: { 'test-principal': accountID } }))
        .then((res) => res.json());

    test('find own posts', async () => {
      const account = await insertOne(db(), AccountDB, {});
      const post = await new PostService(db()).createText(account.id, {
        geolocation: [0, 0],
        content: 'my first post',
      });

      const result = await request(account.id);

      expect(result).toEqual(serialize([post]));
    });
  });

  describe('POST /post/text', () => {
    const { app, db } = setupIntegrationTest(PostController);

    const request = (accountID: string, body: CreateTextPost): Promise<Serialized<PostWithContent>> =>
      app()
        .handle(new MockRequest('/post/text', { method: 'post', json: body, headers: { 'test-principal': accountID } }))
        .then((res) => res.json());

    test('create text post', async () => {
      const account = await insertOne(db(), AccountDB, {});
      const data: CreateTextPost = { geolocation: [0, 0], content: 'my first post' };

      const result = await request(account.id, data);

      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          authorID: account.id,
          geolocation: data.geolocation,
          visibility: PostVisibility.PUBLIC,
          text: expect.objectContaining({ content: data.content }),
        }),
      );

      const { text: _, ...resultWithoutText } = result;
      expect(serialize(await db().query.PostDB.findFirst({ where: eq(PostDB.id, result.id) }))).toEqual(
        resultWithoutText,
      );

      expect(
        serialize(await db().query.TextContentDB.findFirst({ where: eq(TextContentDB.postID, result.id) })),
      ).toEqual({ ...result.text!, postID: result.id });
    });
  });

  describe('PATCH /post/text/:postID', () => {
    const { app, db } = setupIntegrationTest(PostController);

    const request = (postID: string, body: PatchTextPost): Promise<Serialized<PostWithContent>> =>
      app()
        .handle(new MockRequest(`/post/text/${postID}`, { method: 'patch', json: body }))
        .then((res) => res.json());

    test('patch text post', async () => {
      const account = await insertOne(db(), AccountDB, {});
      const post = await new PostService(db()).createText(account.id, {
        geolocation: [0, 0],
        content: 'my first post',
      });
      const data: PatchTextPost = { content: 'my updated text' };

      const result = await request(post.id, data);

      expect(result).toEqual(
        expect.objectContaining({
          text: {
            ...serialize(post.text),
            content: data.content,
            updatedAt: expect.any(String),
          },
        }),
      );

      expect(new Date(result.updatedAt)).toBeAfter(account.updatedAt);

      expect(serialize(await db().query.TextContentDB.findFirst({ where: eq(TextContentDB.postID, post.id) }))).toEqual(
        expect.objectContaining(result.text!),
      );
    });
  });

  describe('GET /post/details/:postID', () => {
    const { app, db } = setupIntegrationTest(PostController);

    const request = (accountID: string, postID: string): Promise<Serialized<PostWithContent>> =>
      app()
        .handle(new MockRequest(`/post/details/${postID}`, { method: 'get', headers: { 'test-principal': accountID } }))
        .then((res) => res.json());

    test('get text post', async () => {
      const account = await insertOne(db(), AccountDB, {});
      const post = await new PostService(db()).createText(account.id, {
        geolocation: [0, 0],
        content: 'my first post',
      });

      const result = await request(account.id, post.id);

      expect(result).toEqual(serialize(post));
    });
  });

  describe('DELETE /post/:postID', () => {
    const { app, db } = setupIntegrationTest(PostController);

    const request = (postID: string) => app().handle(new MockRequest(`/post/${postID}`, { method: 'delete' }));

    test('delete text post', async () => {
      const account = await insertOne(db(), AccountDB, {});
      const post = await new PostService(db()).createText(account.id, {
        geolocation: [0, 0],
        content: 'my first post',
      });

      await request(post.id);

      expect(await db().$count(PostDB, eq(PostDB.id, post.id))).toBe(0);
      expect(await db().$count(TextContentDB, eq(TextContentDB.postID, post.id))).toBe(0);
    });
  });
});
