import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/shared/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/features/feed/server/create-post", () => ({
  createPost: vi.fn(),
}));

const mockToggleLike = vi.fn();
vi.mock("@/features/feed/server/toggle-like", () => ({
  toggleLike: (...args: unknown[]) => mockToggleLike(...args),
}));

import { FeedInteractionBar } from "@/features/feed/components/feed-interaction-bar";
import { FeedSections } from "@/features/feed/components/feed-sections";

const composerProps = {
  authorName: "Maya Torres",
  composerPlaceholder: "What's on your mind?",
  composerSubmitLabel: "Post",
  composerTopicPlaceholder: "Topic",
  composerErrors: {
    empty: "Write something before posting.",
    too_long: "Keep your post under 500 characters.",
    unauthorized: "Sign in to post.",
  },
};

const posts = [
  {
    id: "post-1",
    author: "Maya Torres",
    handle: "@maya",
    role: "Community builder",
    time: "1 minute ago",
    topic: "Build in public",
    content: "The strongest feed layouts put identity and intent first.",
    likes: 5,
    comments: 2,
    reposts: 1,
  },
  {
    id: "post-2",
    author: "Maya Torres",
    handle: "@maya",
    role: "Community builder",
    time: "2 minutes ago",
    topic: "Design systems",
    content: "Consistent card anatomy reduces decision cost.",
    likes: 7,
    comments: 1,
    reposts: 0,
  },
];

describe("feed components", () => {
  beforeEach(() => {
    mockToggleLike.mockReset();
  });

  it("renders signup links for unauthenticated interaction bars", () => {
    render(
      <FeedInteractionBar
        postId="post-1"
        comments={2}
        likes={5}
        liked={false}
        reposts={1}
        isAuthorized={false}
        isOwnPost={false}
        followLabel="Follow"
        registerLabel="Register to follow"
      />,
    );

    expect(screen.getByRole("link", { name: /register to follow/i })).toHaveAttribute(
      "href",
      "/signup",
    );
    expect(screen.getAllByRole("link")).toHaveLength(4);
  });

  it("renders follow controls for authenticated interaction bars", () => {
    render(
      <FeedInteractionBar
        postId="post-1"
        comments={2}
        likes={5}
        liked={false}
        reposts={1}
        isAuthorized
        isOwnPost={false}
        followLabel="Follow"
        registerLabel="Register to follow"
      />,
    );

    expect(screen.getByRole("button", { name: /follow/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /register to follow/i })).not.toBeInTheDocument();
  });

  it("hides the follow control on the user's own post", () => {
    render(
      <FeedInteractionBar
        postId="post-1"
        comments={2}
        likes={5}
        liked={false}
        reposts={1}
        isAuthorized
        isOwnPost
        followLabel="Follow"
        registerLabel="Register to follow"
      />,
    );

    expect(screen.queryByRole("button", { name: /follow/i })).not.toBeInTheDocument();
  });

  it("optimistically toggles the like button and calls toggleLike", async () => {
    mockToggleLike.mockResolvedValue({ status: "success", liked: true });

    render(
      <FeedInteractionBar
        postId="post-1"
        comments={2}
        likes={5}
        liked={false}
        reposts={1}
        isAuthorized
        isOwnPost={false}
        followLabel="Follow"
        registerLabel="Register to follow"
      />,
    );

    const likeButton = screen.getByRole("button", { name: /5/ });
    fireEvent.click(likeButton);

    expect(screen.getByRole("button", { name: /6/ })).toBeInTheDocument();
    await waitFor(() => expect(mockToggleLike).toHaveBeenCalledWith("post-1"));
  });

  it("reverts the like toggle when the server action fails", async () => {
    mockToggleLike.mockResolvedValue({ status: "error", error: "unauthorized" });

    render(
      <FeedInteractionBar
        postId="post-1"
        comments={2}
        likes={5}
        liked={false}
        reposts={1}
        isAuthorized
        isOwnPost={false}
        followLabel="Follow"
        registerLabel="Register to follow"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /5/ }));
    expect(screen.getByRole("button", { name: /6/ })).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /5/ })).toBeInTheDocument(),
    );
  });

  it("renders post cards", () => {
    render(
      <FeedSections
        posts={posts}
        streamTitle="Main stream"
        streamDescription="Description"
        followLabel="Follow"
        registerLabel="Register to follow"
        isAuthorized={false}
        currentUserHandle={null}
        likedPostIds={new Set()}
        {...composerProps}
      />,
    );

    expect(screen.getByText("Main stream")).toBeInTheDocument();
    expect(screen.getAllByText("Maya Torres")).toHaveLength(2);
    expect(screen.getByText("The strongest feed layouts put identity and intent first.")).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("What's on your mind?"),
    ).not.toBeInTheDocument();
  });

  it("shows the post composer only for authorized users", () => {
    render(
      <FeedSections
        posts={posts}
        streamTitle="Main stream"
        streamDescription="Description"
        followLabel="Follow"
        registerLabel="Register to follow"
        isAuthorized
        currentUserHandle={null}
        likedPostIds={new Set()}
        {...composerProps}
      />,
    );

    expect(
      screen.getByPlaceholderText("What's on your mind?"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Post" })).toBeInTheDocument();
  });

  it("does not show a follow button on the current user's own posts", () => {
    render(
      <FeedSections
        posts={posts}
        streamTitle="Main stream"
        streamDescription="Description"
        followLabel="Follow"
        registerLabel="Register to follow"
        isAuthorized
        currentUserHandle="@maya"
        likedPostIds={new Set()}
        {...composerProps}
      />,
    );

    expect(screen.queryByRole("button", { name: /follow/i })).not.toBeInTheDocument();
  });
});
