import "server-only";

import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/server/db/client";
import { postLike } from "@/server/db/schema";

export async function getLikedPostIds(
  userId: string,
  postIds: string[],
): Promise<Set<string>> {
  if (postIds.length === 0) {
    return new Set();
  }

  const rows = await db
    .select({ postId: postLike.postId })
    .from(postLike)
    .where(and(eq(postLike.userId, userId), inArray(postLike.postId, postIds)));

  return new Set(rows.map((row) => row.postId));
}
