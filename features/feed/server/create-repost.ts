"use server";

import { eq, sql } from "drizzle-orm";
import { updateTag } from "next/cache";
import { getOptionalSession } from "@/server/auth/session";
import { db } from "@/server/db/client";
import { post } from "@/server/db/schema";
import { checkRateLimit } from "@/server/lib/rate-limit";

const MAX_CONTENT_LENGTH = 500;
const DEFAULT_ROLE = "Member";
const RATE_LIMIT = { limit: 5, windowSeconds: 60 };

export type CreateRepostState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      error: "too_long" | "unauthorized" | "not_found" | "rate_limited";
    };

export async function createRepost(
  postId: string,
  _prevState: CreateRepostState,
  formData: FormData,
): Promise<CreateRepostState> {
  const session = await getOptionalSession();

  if (!session?.user) {
    return { status: "error", error: "unauthorized" };
  }

  const rateLimit = await checkRateLimit(
    `create-repost:${session.user.id}`,
    RATE_LIMIT,
  );

  if (!rateLimit.allowed) {
    return { status: "error", error: "rate_limited" };
  }

  const content = String(formData.get("content") ?? "").trim();

  if (content.length > MAX_CONTENT_LENGTH) {
    return { status: "error", error: "too_long" };
  }

  const [original] = await db
    .select({
      authorName: post.authorName,
      authorHandle: post.authorHandle,
      content: post.content,
      topic: post.topic,
    })
    .from(post)
    .where(eq(post.id, postId))
    .limit(1);

  if (!original) {
    return { status: "error", error: "not_found" };
  }

  const username =
    session.user.username ?? session.user.email?.split("@")[0] ?? "member";

  await db.insert(post).values({
    slug: crypto.randomUUID(),
    authorId: session.user.id,
    authorName: session.user.name || username,
    authorHandle: `@${username}`,
    authorRole: DEFAULT_ROLE,
    topic: original.topic,
    content,
    repostOfId: postId,
    repostOfAuthorName: original.authorName,
    repostOfAuthorHandle: original.authorHandle,
    repostOfContent: original.content,
  });

  await db
    .update(post)
    .set({ reposts: sql`${post.reposts} + 1` })
    .where(eq(post.id, postId));

  updateTag("posts");

  return { status: "success" };
}
