import "server-only";

import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/server/db/client";
import { postRepost } from "@/server/db/schema";

export async function getRepostedPostIds(
  userId: string,
  postIds: string[],
): Promise<Set<string>> {
  if (postIds.length === 0) {
    return new Set();
  }

  const rows = await db
    .select({ postId: postRepost.postId })
    .from(postRepost)
    .where(
      and(eq(postRepost.userId, userId), inArray(postRepost.postId, postIds)),
    );

  return new Set(rows.map((row) => row.postId));
}
