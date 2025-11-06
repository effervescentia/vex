import { ContentService } from '@api/content/content.service';
import { TextContentDB } from '@api/db/db.schema';
import { DataService } from '@api/global/data.service';
import { insertOne } from '@bltx/db';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { InternalServerError } from 'elysia';
import type { CreateTextMemo } from './data/create-text-memo.req';
import { MemoDB } from './data/memo.db';
import type { MemoWithContent } from './data/memo-with-content.dto';
import type { PatchTextMemo } from './data/patch-text-memo.req';

export class MemoService extends DataService {
  private async unsafeGetWithContent(memoID: string) {
    const memo = await this.getWithContent(memoID);
    if (!memo) throw new InternalServerError(`No Memo exists with ID '${memoID}'`);

    return memo;
  }

  async findWithContent(authorID: string): Promise<MemoWithContent[]> {
    return this.db.query.MemoDB.findMany({
      where: eq(MemoDB.authorID, authorID),
      with: { text: { columns: { memoID: false } } },
      orderBy: desc(MemoDB.createdAt),
    });
  }

  async getWithContent(memoID: string): Promise<MemoWithContent | undefined> {
    return this.db.query.MemoDB.findFirst({
      where: and(eq(MemoDB.id, memoID), isNull(MemoDB.deletedAt)),
      with: { text: { columns: { memoID: false } } },
    });
  }

  async createText(authorID: string, data: CreateTextMemo) {
    const memoID = await this.transaction(async (tx) => {
      const memo = await insertOne(tx, MemoDB, { ...data, authorID });

      await new ContentService(tx).createText({ memoID: memo.id, content: data.content });

      return memo.id;
    });

    return this.unsafeGetWithContent(memoID);
  }

  async patchText(memoID: string, data: PatchTextMemo) {
    await new ContentService(this.db).patchText(memoID, data);

    return this.unsafeGetWithContent(memoID);
  }

  async delete(memo: MemoWithContent) {
    if (memo.text) {
      // text content has no deletion side effect
    }

    await this.transaction(async (tx) => {
      await tx.delete(MemoDB).where(eq(MemoDB.id, memo.id));
      await tx.delete(TextContentDB).where(eq(TextContentDB.memoID, memo.id));
    });
  }
}
