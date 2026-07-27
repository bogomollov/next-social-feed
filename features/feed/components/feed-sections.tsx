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
  authorName: string;
  composerPlaceholder: string;
  composerSubmitLabel: string;
  composerTopicPlaceholder: string;
  composerErrors: {
    empty: string;
    too_long: string;
    unauthorized: string;
  };
};

const FALLBACK_TOPICS = ["Update", "Announcement", "Question", "Idea"];

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
  authorName,
  composerPlaceholder,
  composerSubmitLabel,
  composerTopicPlaceholder,
  composerErrors,
}: FeedSectionsProps) {
  const topics = Array.from(new Set(posts.map((post) => post.topic)));

  return (
    <div className="flex flex-col gap-6">
      {isAuthorized ? (
        <PostComposer
          authorName={authorName}
          placeholder={composerPlaceholder}
          submitLabel={composerSubmitLabel}
          topicPlaceholder={composerTopicPlaceholder}
          topics={topics.length > 0 ? topics : FALLBACK_TOPICS}
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
                <p className="text-sm leading-7 text-foreground">{post.content}</p>
                <FeedInteractionBar
                  comments={post.comments}
                  likes={post.likes}
                  reposts={post.reposts}
                  isAuthorized={isAuthorized}
                  isOwnPost={post.handle === currentUserHandle}
                  followLabel={followLabel}
                  registerLabel={registerLabel}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
