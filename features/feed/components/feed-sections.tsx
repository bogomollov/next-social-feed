import { IconSparkles } from "@tabler/icons-react";
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

export type FeedSectionsProps = {
  posts: FeedPost[];
  streamTitle: string;
  streamDescription: string;
  pulseTitle: string;
  pulseDescription: string;
  searchEyebrow: string;
  followLabel: string;
  registerLabel: string;
  summaryLabels: {
    posts: string;
    authors: string;
    likes: string;
    comments: string;
    reposts: string;
  };
  isAuthorized: boolean;
};

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
  pulseTitle,
  pulseDescription,
  searchEyebrow,
  followLabel,
  registerLabel,
  summaryLabels,
  isAuthorized,
}: FeedSectionsProps) {
  const summaryItems = [
    { value: posts.length, label: summaryLabels.posts },
    {
      value: new Set(posts.map((post) => post.handle)).size,
      label: summaryLabels.authors,
    },
    {
      value: posts.reduce((sum, post) => sum + post.likes, 0),
      label: summaryLabels.likes,
    },
    {
      value: posts.reduce((sum, post) => sum + post.comments, 0),
      label: summaryLabels.comments,
    },
    {
      value: posts.reduce((sum, post) => sum + post.reposts, 0),
      label: summaryLabels.reposts,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="section-shell">
        <SectionHeader
          title={pulseTitle}
          description={pulseDescription}
          actions={
            <Badge variant="subtle" className="gap-1.5">
              <IconSparkles size={14} />
              {searchEyebrow}
            </Badge>
          }
        />
        <div className="metric-grid">
          {summaryItems.map((item) => (
            <Card key={item.label} size="sm">
              <CardContent className="flex flex-col gap-1">
                <p className="text-2xl font-semibold tracking-tight text-foreground">
                  {item.value}
                </p>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {item.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

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
