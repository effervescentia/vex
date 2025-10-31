import { DataService } from '@api/global/data.service';
import type { PatchTextMemo } from '@api/memo/data/patch-text-memo.req';
import { insertOne, updateOne } from '@bltx/db';
import { eq, type InferInsertModel } from 'drizzle-orm';
import { TextContentDB } from './data/text-content.db';

export class ContentService extends DataService {
  async createText(data: InferInsertModel<typeof TextContentDB>) {
    return insertOne(this.db, TextContentDB, data);
  }

  async patchText(memoID: string, data: PatchTextMemo) {
    await updateOne(this.db, TextContentDB, eq(TextContentDB.memoID, memoID), data);
  }
}
