import "server-only";

import { desc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/server/db/client";
import { post } from "@/server/db/schema";

export type FeedPost = {
  id: string;
  author: string;
  handle: string;
  role: string;
  time: string;
  topic: string;
  content: string;
  likes: number;
  comments: number;
  reposts: number;
  repostOf: {
    author: string;
    handle: string;
    content: string;
  } | null;
};

function formatRelativeTime(date: Date, locale: string) {
  const now = Date.now();
  const diffInSeconds = Math.round((date.getTime() - now) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  const intervals = [
    { unit: "day", seconds: 60 * 60 * 24 },
    { unit: "hour", seconds: 60 * 60 },
    { unit: "minute", seconds: 60 },
  ] as const;

  for (const interval of intervals) {
    const value = Math.round(diffInSeconds / interval.seconds);

    if (Math.abs(value) >= 1) {
      return rtf.format(value, interval.unit);
    }
  }

  return rtf.format(diffInSeconds, "second");
}

export async function getFeedPosts(locale: string): Promise<FeedPost[]> {
  "use cache";

  cacheLife({
    stale: 300,
    revalidate: 900,
    expire: 3600,
  });

  cacheTag("posts");
  cacheTag(`posts:${locale}`);

  const rows = await db
    .select({
      id: post.id,
      author: post.authorName,
      handle: post.authorHandle,
      role: post.authorRole,
      topic: post.topic,
      content: post.content,
      likes: post.likes,
      comments: post.comments,
      reposts: post.reposts,
      repostOfAuthorName: post.repostOfAuthorName,
      repostOfAuthorHandle: post.repostOfAuthorHandle,
      repostOfContent: post.repostOfContent,
      createdAt: post.createdAt,
    })
    .from(post)
    .orderBy(desc(post.createdAt));

  return rows.map((row) => ({
    id: row.id,
    author: row.author,
    handle: row.handle,
    role: row.role,
    time: formatRelativeTime(
      row.createdAt instanceof Date ? row.createdAt : new Date(row.createdAt),
      locale,
    ),
    topic: row.topic,
    content: row.content,
    likes: row.likes,
    comments: row.comments,
    reposts: row.reposts,
    repostOf:
      row.repostOfAuthorName && row.repostOfAuthorHandle
        ? {
            author: row.repostOfAuthorName,
            handle: row.repostOfAuthorHandle,
            content: row.repostOfContent ?? "",
          }
        : null,
  }));
}
