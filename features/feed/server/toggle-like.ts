"use server";

import { and, eq, sql } from "drizzle-orm";
import { updateTag } from "next/cache";
import { getOptionalSession } from "@/server/auth/session";
import { db } from "@/server/db/client";
import { post, postLike } from "@/server/db/schema";
import { checkRateLimit } from "@/server/lib/rate-limit";

const RATE_LIMIT = { limit: 30, windowSeconds: 60 };

export type ToggleLikeResult =
  | { status: "success"; liked: boolean }
  | { status: "error"; error: "unauthorized" | "rate_limited" };

export async function toggleLike(postId: string): Promise<ToggleLikeResult> {
  const session = await getOptionalSession();

  if (!session?.user) {
    return { status: "error", error: "unauthorized" };
  }

  const userId = session.user.id;

  const rateLimit = await checkRateLimit(`toggle-like:${userId}`, RATE_LIMIT);

  if (!rateLimit.allowed) {
    return { status: "error", error: "rate_limited" };
  }

  const removed = await db
    .delete(postLike)
    .where(and(eq(postLike.postId, postId), eq(postLike.userId, userId)))
    .returning();

  if (removed.length > 0) {
    await db
      .update(post)
      .set({ likes: sql`greatest(${post.likes} - 1, 0)` })
      .where(eq(post.id, postId));

    updateTag("posts");
    return { status: "success", liked: false };
  }

  const inserted = await db
    .insert(postLike)
    .values({ postId, userId })
    .onConflictDoNothing({ target: [postLike.postId, postLike.userId] })
    .returning();

  if (inserted.length > 0) {
    await db
      .update(post)
      .set({ likes: sql`${post.likes} + 1` })
      .where(eq(post.id, postId));
  }

  updateTag("posts");
  return { status: "success", liked: true };
}
