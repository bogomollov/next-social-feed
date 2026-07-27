"use server";

import { asc, eq } from "drizzle-orm";
import { getOptionalSession } from "@/server/auth/session";
import { db } from "@/server/db/client";
import { postComment } from "@/server/db/schema";

export type PostCommentDTO = {
  id: string;
  author: string;
  handle: string;
  content: string;
  createdAt: string;
};

export type GetCommentsResult =
  | { status: "success"; comments: PostCommentDTO[] }
  | { status: "error"; error: "unauthorized" };

export async function getComments(postId: string): Promise<GetCommentsResult> {
  const session = await getOptionalSession();

  if (!session?.user) {
    return { status: "error", error: "unauthorized" };
  }

  const rows = await db
    .select({
      id: postComment.id,
      author: postComment.authorName,
      handle: postComment.authorHandle,
      content: postComment.content,
      createdAt: postComment.createdAt,
    })
    .from(postComment)
    .where(eq(postComment.postId, postId))
    .orderBy(asc(postComment.createdAt));

  return {
    status: "success",
    comments: rows.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
    })),
  };
}
