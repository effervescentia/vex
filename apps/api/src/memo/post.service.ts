import { ContentService } from '@api/content/content.service';
import { TextContentDB } from '@api/db/db.schema';
import { DataService } from '@api/global/data.service';
import { insertOne } from '@bltx/db';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { InternalServerError } from 'elysia';
import type { CreateTextPost } from './data/create-text-post.req';
import type { PatchTextPost } from './data/patch-text-post.req';
import { PostDB } from './data/post.db';
import type { PostWithContent } from './data/post-with-content.dto';

export class PostService extends DataService {
  private async unsafeGetWithContent(postID: string) {
    const post = await this.getWithContent(postID);
    if (!post) throw new InternalServerError(`No Post exists with ID '${postID}'`);

    return post;
  }

  async findWithContent(authorID: string): Promise<PostWithContent[]> {
    return this.db.query.PostDB.findMany({
      where: eq(PostDB.authorID, authorID),
      with: { text: { columns: { postID: false } } },
      orderBy: desc(PostDB.createdAt),
    });
  }

  async getWithContent(postID: string): Promise<PostWithContent | undefined> {
    return this.db.query.PostDB.findFirst({
      where: and(eq(PostDB.id, postID), isNull(PostDB.deletedAt)),
      with: { text: { columns: { postID: false } } },
    });
  }

  async createText(authorID: string, data: CreateTextPost) {
    const postID = await this.transaction(async (tx) => {
      const post = await insertOne(tx, PostDB, { ...data, authorID });

      await new ContentService(tx).createText({ postID: post.id, content: data.content });

      return post.id;
    });

    return this.unsafeGetWithContent(postID);
  }

  async patchText(postID: string, data: PatchTextPost) {
    await new ContentService(this.db).patchText(postID, data);

    return this.unsafeGetWithContent(postID);
  }

  async delete(postID: string) {
    const postWithContent = await this.getWithContent(postID);
    if (!postWithContent) return;

    if (postWithContent.text) {
      // text content has no deletion side effect
    }

    await this.transaction(async (tx) => {
      await tx.delete(PostDB).where(eq(PostDB.id, postID));
      await tx.delete(TextContentDB).where(eq(TextContentDB.postID, postID));
    });
  }
}
