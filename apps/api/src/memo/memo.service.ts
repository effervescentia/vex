import { ContentService } from '@api/content/content.service';
import { MemoBoostDB, TextContentDB } from '@api/db/db.schema';
import { DataService } from '@api/global/data.service';
import { type AnyColumn, insertOne } from '@bltx/db';
import { and, desc, eq, getTableColumns, isNull, ne, sql } from 'drizzle-orm';
import { InternalServerError } from 'elysia';
import type { CreateTextMemo } from './data/create-text-memo.req';
import { MemoDB } from './data/memo.db';
import type { Memo } from './data/memo.dto';
import type { MemoInFeed } from './data/memo-in-feed.dto';
import type { MemoWithContent } from './data/memo-with-content.dto';
import type { PatchTextMemo } from './data/patch-text-memo.req';

const DISTANCE_SCALE = 1000;

const llToEarth = (value: AnyColumn | [number, number]) =>
  Array.isArray(value) ? sql`ll_to_earth(${value[1]}, ${value[0]})` : sql`ll_to_earth(${value} -> 2, ${value} -> 1)`;

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

  async findNearby(accountID: string, geolocation: [number, number], radius: number): Promise<MemoInFeed[]> {
    const distance = sql<number>`earth_distance(${llToEarth(MemoDB.geolocation)}, ${llToEarth(geolocation)}) / ${DISTANCE_SCALE}`;

    const isNearby = sql<boolean>`earth_box(${llToEarth(geolocation)}, ${radius * DISTANCE_SCALE}) @> ${llToEarth(MemoDB.geolocation)}`;

    return this.db
      .select({
        ...getTableColumns(MemoDB),
        text: TextContentDB,
        boosted: sql<boolean>`${this.db.$count(
          MemoBoostDB,
          and(eq(MemoBoostDB.memoID, MemoDB.id), eq(MemoBoostDB.accountID, accountID)),
        )} = 1`,
        distance,
      })
      .from(MemoDB)
      .where(and(ne(MemoDB.authorID, accountID), isNull(MemoDB.deletedAt), isNearby))
      .leftJoin(TextContentDB, eq(TextContentDB.memoID, MemoDB.id))
      .orderBy(desc(MemoDB.createdAt));
  }

  async get(memoID: string): Promise<Memo | undefined> {
    return this.db.query.MemoDB.findFirst({
      where: and(eq(MemoDB.id, memoID), isNull(MemoDB.deletedAt)),
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

  async boost(memoID: string, accountID: string) {
    await this.db.insert(MemoBoostDB).values({ memoID, accountID }).onConflictDoNothing();
  }

  async removeBoost(memoID: string, accountID: string) {
    await this.db.delete(MemoBoostDB).where(and(eq(MemoBoostDB.memoID, memoID), eq(MemoBoostDB.accountID, accountID)));
  }
}
