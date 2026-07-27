import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

import { FeedInteractionBar } from "@/features/feed/components/feed-interaction-bar";
import { FeedSections } from "@/features/feed/components/feed-sections";

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
  it("renders signup links for unauthenticated interaction bars", () => {
    render(
      <FeedInteractionBar
        comments={2}
        likes={5}
        reposts={1}
        isAuthorized={false}
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
        comments={2}
        likes={5}
        reposts={1}
        isAuthorized
        followLabel="Follow"
        registerLabel="Register to follow"
      />,
    );

    expect(screen.getByRole("button", { name: /follow/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /register to follow/i })).not.toBeInTheDocument();
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
      />,
    );

    expect(screen.getByText("Main stream")).toBeInTheDocument();
    expect(screen.getAllByText("Maya Torres")).toHaveLength(2);
    expect(screen.getByText("The strongest feed layouts put identity and intent first.")).toBeInTheDocument();
  });
});
