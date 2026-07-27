"use server";

import { eq, sql } from "drizzle-orm";
import { updateTag } from "next/cache";
import { getOptionalSession } from "@/server/auth/session";
import { db } from "@/server/db/client";
import { post, postComment } from "@/server/db/schema";
import type { PostCommentDTO } from "./comments";

const MAX_CONTENT_LENGTH = 500;

export type CreateCommentResult =
  | { status: "success"; comment: PostCommentDTO }
  | { status: "error"; error: "empty" | "too_long" | "unauthorized" };

export async function createComment(
  postId: string,
  content: string,
): Promise<CreateCommentResult> {
  const session = await getOptionalSession();

  if (!session?.user) {
    return { status: "error", error: "unauthorized" };
  }

  const trimmed = content.trim();

  if (!trimmed) {
    return { status: "error", error: "empty" };
  }

  if (trimmed.length > MAX_CONTENT_LENGTH) {
    return { status: "error", error: "too_long" };
  }

  const username =
    session.user.username ?? session.user.email?.split("@")[0] ?? "member";
  const authorName = session.user.name || username;
  const authorHandle = `@${username}`;

  const [inserted] = await db
    .insert(postComment)
    .values({
      postId,
      authorId: session.user.id,
      authorName,
      authorHandle,
      content: trimmed,
    })
    .returning();

  await db
    .update(post)
    .set({ comments: sql`${post.comments} + 1` })
    .where(eq(post.id, postId));

  updateTag("posts");

  return {
    status: "success",
    comment: {
      id: inserted.id,
      author: authorName,
      handle: authorHandle,
      content: trimmed,
      createdAt: inserted.createdAt.toISOString(),
    },
  };
}
