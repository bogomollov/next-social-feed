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

const mockToggleRepost = vi.fn();
vi.mock("@/features/feed/server/toggle-repost", () => ({
  toggleRepost: (...args: unknown[]) => mockToggleRepost(...args),
}));

const mockGetComments = vi.fn();
vi.mock("@/features/feed/server/comments", () => ({
  getComments: (...args: unknown[]) => mockGetComments(...args),
}));

const mockCreateComment = vi.fn();
vi.mock("@/features/feed/server/create-comment", () => ({
  createComment: (...args: unknown[]) => mockCreateComment(...args),
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

const commentsLabels = {
  placeholder: "Write a comment...",
  submit: "Comment",
  empty: "No comments yet.",
  loadError: "Unable to load comments.",
  toggleAria: "Toggle comments",
  errors: {
    empty: "Write something before commenting.",
    too_long: "Keep your comment under 500 characters.",
    unauthorized: "Sign in to comment.",
  },
};

const interactionBarProps = {
  authorName: "Maya Torres",
  commentsLabels,
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
    mockToggleRepost.mockReset();
    mockGetComments.mockReset();
    mockCreateComment.mockReset();
    mockGetComments.mockResolvedValue({ status: "success", comments: [] });
  });

  it("renders signup links for unauthenticated interaction bars", () => {
    render(
      <FeedInteractionBar
        postId="post-1"
        comments={2}
        likes={5}
        liked={false}
        reposts={1}
        reposted={false}
        isAuthorized={false}
        isOwnPost={false}
        followLabel="Follow"
        registerLabel="Register to follow"
        {...interactionBarProps}
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
        reposted={false}
        isAuthorized
        isOwnPost={false}
        followLabel="Follow"
        registerLabel="Register to follow"
        {...interactionBarProps}
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
        reposted={false}
        isAuthorized
        isOwnPost
        followLabel="Follow"
        registerLabel="Register to follow"
        {...interactionBarProps}
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
        reposted={false}
        isAuthorized
        isOwnPost={false}
        followLabel="Follow"
        registerLabel="Register to follow"
        {...interactionBarProps}
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
        reposted={false}
        isAuthorized
        isOwnPost={false}
        followLabel="Follow"
        registerLabel="Register to follow"
        {...interactionBarProps}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /5/ }));
    expect(screen.getByRole("button", { name: /6/ })).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /5/ })).toBeInTheDocument(),
    );
  });

  it("optimistically toggles the repost button and calls toggleRepost", async () => {
    mockToggleRepost.mockResolvedValue({ status: "success", reposted: true });

    render(
      <FeedInteractionBar
        postId="post-1"
        comments={2}
        likes={5}
        liked={false}
        reposts={1}
        reposted={false}
        isAuthorized
        isOwnPost={false}
        followLabel="Follow"
        registerLabel="Register to follow"
        {...interactionBarProps}
      />,
    );

    const repostButton = screen.getByRole("button", { name: /^1$/ });
    fireEvent.click(repostButton);

    expect(screen.getByRole("button", { name: /^2$/ })).toBeInTheDocument();
    await waitFor(() => expect(mockToggleRepost).toHaveBeenCalledWith("post-1"));
  });

  it("reverts the repost toggle when the server action fails", async () => {
    mockToggleRepost.mockResolvedValue({ status: "error", error: "unauthorized" });

    render(
      <FeedInteractionBar
        postId="post-1"
        comments={2}
        likes={5}
        liked={false}
        reposts={1}
        reposted={false}
        isAuthorized
        isOwnPost={false}
        followLabel="Follow"
        registerLabel="Register to follow"
        {...interactionBarProps}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /^1$/ }));
    expect(screen.getByRole("button", { name: /^2$/ })).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /^1$/ })).toBeInTheDocument(),
    );
  });

  it("loads and shows comments when the comments button is toggled", async () => {
    mockGetComments.mockResolvedValue({
      status: "success",
      comments: [
        {
          id: "comment-1",
          author: "Jordan Lee",
          handle: "@jordan",
          content: "Great post!",
          createdAt: "2026-01-01T00:00:00.000Z",
        },
      ],
    });

    render(
      <FeedInteractionBar
        postId="post-1"
        comments={2}
        likes={5}
        liked={false}
        reposts={1}
        reposted={false}
        isAuthorized
        isOwnPost={false}
        followLabel="Follow"
        registerLabel="Register to follow"
        {...interactionBarProps}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /toggle comments/i }));

    await waitFor(() => expect(mockGetComments).toHaveBeenCalledWith("post-1"));
    expect(await screen.findByText("Great post!")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /toggle comments/i }));
    expect(screen.queryByText("Great post!")).not.toBeInTheDocument();
  });

  it("submits a new comment and optimistically bumps the comment count", async () => {
    mockCreateComment.mockResolvedValue({
      status: "success",
      comment: {
        id: "comment-2",
        author: "Maya Torres",
        handle: "@maya",
        content: "Thanks for reading!",
        createdAt: "2026-01-02T00:00:00.000Z",
      },
    });

    render(
      <FeedInteractionBar
        postId="post-1"
        comments={2}
        likes={5}
        liked={false}
        reposts={1}
        reposted={false}
        isAuthorized
        isOwnPost={false}
        followLabel="Follow"
        registerLabel="Register to follow"
        {...interactionBarProps}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /toggle comments/i }));
    await waitFor(() => expect(mockGetComments).toHaveBeenCalled());

    const textbox = await screen.findByPlaceholderText("Write a comment...");
    fireEvent.change(textbox, { target: { value: "Thanks for reading!" } });
    fireEvent.click(screen.getByRole("button", { name: "Comment" }));

    await waitFor(() =>
      expect(mockCreateComment).toHaveBeenCalledWith(
        "post-1",
        "Thanks for reading!",
      ),
    );
    expect(await screen.findByText("Thanks for reading!")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /toggle comments/i }),
    ).toHaveTextContent("3");
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
        repostedPostIds={new Set()}
        commentsLabels={commentsLabels}
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
        repostedPostIds={new Set()}
        commentsLabels={commentsLabels}
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
        repostedPostIds={new Set()}
        commentsLabels={commentsLabels}
        {...composerProps}
      />,
    );

    expect(screen.queryByRole("button", { name: /follow/i })).not.toBeInTheDocument();
  });
});
