// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockOrderBy, mockFrom, mockSelect, mockCacheLife, mockCacheTag } =
  vi.hoisted(() => {
    const mockOrderBy = vi.fn();
    const mockFrom = vi.fn();
    const mockSelect = vi.fn();
    const mockCacheLife = vi.fn();
    const mockCacheTag = vi.fn();

    return { mockOrderBy, mockFrom, mockSelect, mockCacheLife, mockCacheTag };
  });

vi.mock("server-only", () => ({}));
vi.mock("drizzle-orm", () => ({
  desc: vi.fn((value) => value),
}));
vi.mock("next/cache", () => ({
  cacheLife: mockCacheLife,
  cacheTag: mockCacheTag,
}));
vi.mock("@/server/db/schema", () => ({
  post: {
    id: "id",
    authorName: "authorName",
    authorHandle: "authorHandle",
    authorRole: "authorRole",
    topic: "topic",
    content: "content",
    likes: "likes",
    comments: "comments",
    reposts: "reposts",
    createdAt: "createdAt",
  },
}));
vi.mock("@/server/db/client", () => ({
  db: {
    select: mockSelect,
  },
}));

describe("getFeedPosts", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockOrderBy.mockResolvedValue([
      {
        id: "post-1",
        author: "Maya Torres",
        handle: "@maya",
        role: "Community builder",
        topic: "Build in public",
        content: "Hello world",
        likes: 5,
        comments: 2,
        reposts: 1,
        createdAt: new Date("2026-04-10T11:59:00.000Z"),
      },
    ]);
    mockFrom.mockReturnValue({
      orderBy: mockOrderBy,
    });
    mockSelect.mockReturnValue({
      from: mockFrom,
    });
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-10T12:00:00.000Z"));
  });

  it("maps db rows into feed posts and applies cache metadata", async () => {
    const { getFeedPosts } = await import("@/features/feed/server/posts");

    const posts = await getFeedPosts("en");

    expect(mockCacheLife).toHaveBeenCalledWith({
      stale: 300,
      revalidate: 900,
      expire: 3600,
    });
    expect(mockCacheTag).toHaveBeenNthCalledWith(1, "posts");
    expect(mockCacheTag).toHaveBeenNthCalledWith(2, "posts:en");
    expect(posts).toEqual([
      expect.objectContaining({
        id: "post-1",
        author: "Maya Torres",
        handle: "@maya",
        role: "Community builder",
        topic: "Build in public",
        content: "Hello world",
        likes: 5,
        comments: 2,
        reposts: 1,
      }),
    ]);
    expect(posts[0].time).toContain("minute");
  });
});
