import { DataService } from '@api/global/data.service';
import type { PatchTextPost } from '@api/post/data/patch-text-post.req';
import { insertOne, updateOne } from '@bltx/db';
import { eq, type InferInsertModel } from 'drizzle-orm';
import { TextContentDB } from './data/text-content.db';

export class ContentService extends DataService {
  async createText(data: InferInsertModel<typeof TextContentDB>) {
    return insertOne(this.db, TextContentDB, data);
  }

  async patchText(postID: string, patch: PatchTextPost) {
    await updateOne(this.db, TextContentDB, eq(TextContentDB.postID, postID), patch);
  }
}
