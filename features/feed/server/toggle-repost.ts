"use server";

import { and, eq, sql } from "drizzle-orm";
import { updateTag } from "next/cache";
import { getOptionalSession } from "@/server/auth/session";
import { db } from "@/server/db/client";
import { post, postRepost } from "@/server/db/schema";

export type ToggleRepostResult =
  | { status: "success"; reposted: boolean }
  | { status: "error"; error: "unauthorized" };

export async function toggleRepost(postId: string): Promise<ToggleRepostResult> {
  const session = await getOptionalSession();

  if (!session?.user) {
    return { status: "error", error: "unauthorized" };
  }

  const userId = session.user.id;

  const removed = await db
    .delete(postRepost)
    .where(and(eq(postRepost.postId, postId), eq(postRepost.userId, userId)))
    .returning();

  if (removed.length > 0) {
    await db
      .update(post)
      .set({ reposts: sql`greatest(${post.reposts} - 1, 0)` })
      .where(eq(post.id, postId));

    updateTag("posts");
    return { status: "success", reposted: false };
  }

  const inserted = await db
    .insert(postRepost)
    .values({ postId, userId })
    .onConflictDoNothing({ target: [postRepost.postId, postRepost.userId] })
    .returning();

  if (inserted.length > 0) {
    await db
      .update(post)
      .set({ reposts: sql`${post.reposts} + 1` })
      .where(eq(post.id, postId));
  }

  updateTag("posts");
  return { status: "success", reposted: true };
}
