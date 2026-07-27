import type { FeedPost } from "@/features/feed/server/posts";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { SectionHeader } from "@/shared/ui/page-shell";
import { FeedInteractionBar } from "./feed-interaction-bar";
import { PostComposer } from "./post-composer";

export type FeedSectionsProps = {
  posts: FeedPost[];
  streamTitle: string;
  streamDescription: string;
  followLabel: string;
  registerLabel: string;
  isAuthorized: boolean;
  currentUserHandle: string | null;
  likedPostIds: Set<string>;
  authorName: string;
  composerPlaceholder: string;
  composerSubmitLabel: string;
  composerTopicPlaceholder: string;
  composerErrors: {
    empty: string;
    too_long: string;
    unauthorized: string;
  };
  commentsLabels: {
    placeholder: string;
    submit: string;
    empty: string;
    loadError: string;
    toggleAria: string;
    errors: {
      empty: string;
      too_long: string;
      unauthorized: string;
    };
  };
  repostLabels: {
    placeholder: string;
    submit: string;
    toggleAria: string;
    quotedFrom: string;
    errors: {
      too_long: string;
      unauthorized: string;
      not_found: string;
    };
  };
};

const COMPOSER_TOPICS = [
  "General",
  "Announcement",
  "Question",
  "Idea",
  "Discussion",
  "Milestone",
  "Feedback",
  "Show and tell",
];

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function FeedSections({
  posts,
  streamTitle,
  streamDescription,
  followLabel,
  registerLabel,
  isAuthorized,
  currentUserHandle,
  likedPostIds,
  authorName,
  composerPlaceholder,
  composerSubmitLabel,
  composerTopicPlaceholder,
  composerErrors,
  commentsLabels,
  repostLabels,
}: FeedSectionsProps) {
  const topics = Array.from(
    new Set([...COMPOSER_TOPICS, ...posts.map((post) => post.topic)]),
  );

  return (
    <div className="flex flex-col gap-6">
      {isAuthorized ? (
        <PostComposer
          authorName={authorName}
          placeholder={composerPlaceholder}
          submitLabel={composerSubmitLabel}
          topicPlaceholder={composerTopicPlaceholder}
          topics={topics}
          errorMessages={composerErrors}
        />
      ) : null}

      <section className="section-shell">
        <SectionHeader title={streamTitle} description={streamDescription} />
        <div className="feed-grid">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(post.author)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle>{post.author}</CardTitle>
                        <Badge variant="outline">{post.topic}</Badge>
                      </div>
                      <CardDescription>
                        {post.handle} / {post.role}
                      </CardDescription>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {post.time}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                {post.content ? (
                  <p className="text-sm leading-7 text-foreground">
                    {post.content}
                  </p>
                ) : null}
                {post.repostOf ? (
                  <div className="surface-subtle flex flex-col gap-1 p-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      {repostLabels.quotedFrom} {post.repostOf.author} (
                      {post.repostOf.handle})
                    </p>
                    <p className="text-sm leading-6 text-foreground">
                      {post.repostOf.content}
                    </p>
                  </div>
                ) : null}
                <FeedInteractionBar
                  postId={post.id}
                  postAuthor={post.author}
                  postHandle={post.handle}
                  postContent={post.content}
                  comments={post.comments}
                  likes={post.likes}
                  liked={likedPostIds.has(post.id)}
                  reposts={post.reposts}
                  isAuthorized={isAuthorized}
                  isOwnPost={post.handle === currentUserHandle}
                  followLabel={followLabel}
                  registerLabel={registerLabel}
                  authorName={authorName}
                  commentsLabels={commentsLabels}
                  repostLabels={repostLabels}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
