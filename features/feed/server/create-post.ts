"use server";

import { updateTag } from "next/cache";
import { getOptionalSession } from "@/server/auth/session";
import { db } from "@/server/db/client";
import { post } from "@/server/db/schema";
import { checkRateLimit } from "@/server/lib/rate-limit";

const MAX_CONTENT_LENGTH = 500;
const MAX_TOPIC_LENGTH = 60;
const FALLBACK_TOPIC = "General";
const DEFAULT_ROLE = "Member";
const RATE_LIMIT = { limit: 5, windowSeconds: 60 };

export type CreatePostState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      error: "empty" | "too_long" | "unauthorized" | "rate_limited";
    };

export async function createPost(
  _prevState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  const session = await getOptionalSession();

  if (!session?.user) {
    return { status: "error", error: "unauthorized" };
  }

  const rateLimit = await checkRateLimit(
    `create-post:${session.user.id}`,
    RATE_LIMIT,
  );

  if (!rateLimit.allowed) {
    return { status: "error", error: "rate_limited" };
  }

  const content = String(formData.get("content") ?? "").trim();

  if (!content) {
    return { status: "error", error: "empty" };
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return { status: "error", error: "too_long" };
  }

  const topic =
    String(formData.get("topic") ?? "").trim().slice(0, MAX_TOPIC_LENGTH) ||
    FALLBACK_TOPIC;

  const username =
    session.user.username ?? session.user.email?.split("@")[0] ?? "member";

  await db.insert(post).values({
    slug: crypto.randomUUID(),
    authorId: session.user.id,
    authorName: session.user.name || username,
    authorHandle: `@${username}`,
    authorRole: DEFAULT_ROLE,
    topic,
    content,
  });

  updateTag("posts");

  return { status: "success" };
}
