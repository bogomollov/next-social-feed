"use client";

import { useState, useTransition } from "react";
import {
  IconHeart,
  IconHeartFilled,
  IconMessageCircle,
  IconRepeat,
  IconUserPlus,
} from "@tabler/icons-react";
import { toggleLike } from "@/features/feed/server/toggle-like";
import { Link } from "@/shared/i18n/navigation";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { PostComments } from "./post-comments";
import { RepostComposer } from "./repost-composer";

type CommentsLabels = {
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

type RepostLabels = {
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

type FeedInteractionBarProps = {
  postId: string;
  postAuthor: string;
  postHandle: string;
  postContent: string;
  comments: number;
  likes: number;
  liked: boolean;
  reposts: number;
  isAuthorized: boolean;
  isOwnPost: boolean;
  followLabel: string;
  registerLabel: string;
  authorName: string;
  commentsLabels: CommentsLabels;
  repostLabels: RepostLabels;
};

export function FeedInteractionBar({
  postId,
  postAuthor,
  postHandle,
  postContent,
  comments,
  likes,
  liked,
  reposts,
  isAuthorized,
  isOwnPost,
  followLabel,
  registerLabel,
  authorName,
  commentsLabels,
  repostLabels,
}: FeedInteractionBarProps) {
  const [likeState, setLikeState] = useState({ liked, count: likes });
  const [repostCount, setRepostCount] = useState(reposts);
  const [commentCount, setCommentCount] = useState(comments);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [repostOpen, setRepostOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggleLike = () => {
    const previous = likeState;
    const optimisticLiked = !previous.liked;

    setLikeState({
      liked: optimisticLiked,
      count: previous.count + (optimisticLiked ? 1 : -1),
    });

    startTransition(async () => {
      const result = await toggleLike(postId);

      if (result.status === "error") {
        setLikeState(previous);
        return;
      }

      setLikeState((current) => ({ ...current, liked: result.liked }));
    });
  };

  if (!isAuthorized) {
    const metrics = [
      { key: "likes", value: likes, icon: IconHeart },
      { key: "comments", value: comments, icon: IconMessageCircle },
      { key: "reposts", value: reposts, icon: IconRepeat },
    ];

    return (
      <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <Button asChild key={metric.key} size="sm" variant="outline">
                <Link href="/signup">
                  <Icon data-icon="inline-start" />
                  {metric.value}
                </Link>
              </Button>
            );
          })}
        </div>
        <Button asChild size="sm">
          <Link href="/signup">
            <IconUserPlus data-icon="inline-start" />
            {registerLabel}
          </Link>
        </Button>
      </div>
    );
  }

  const LikeIcon = likeState.liked ? IconHeartFilled : IconHeart;

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            aria-pressed={likeState.liked}
            onClick={handleToggleLike}
            className={cn(
              likeState.liked && "border-destructive/40 text-destructive",
            )}
          >
            <LikeIcon data-icon="inline-start" />
            {likeState.count}
          </Button>
          <Button
            size="sm"
            variant="outline"
            aria-pressed={commentsOpen}
            aria-label={commentsLabels.toggleAria}
            onClick={() => setCommentsOpen((current) => !current)}
            className={cn(commentsOpen && "border-primary/40 text-primary")}
          >
            <IconMessageCircle data-icon="inline-start" />
            {commentCount}
          </Button>
          <Button
            size="sm"
            variant="outline"
            aria-pressed={repostOpen}
            aria-label={repostLabels.toggleAria}
            onClick={() => setRepostOpen((current) => !current)}
            className={cn(repostOpen && "border-primary/40 text-primary")}
          >
            <IconRepeat data-icon="inline-start" />
            {repostCount}
          </Button>
        </div>
        {isOwnPost ? null : (
          <Button size="sm">
            <IconUserPlus data-icon="inline-start" />
            {followLabel}
          </Button>
        )}
      </div>
      {commentsOpen ? (
        <PostComments
          postId={postId}
          authorName={authorName}
          placeholder={commentsLabels.placeholder}
          submitLabel={commentsLabels.submit}
          emptyLabel={commentsLabels.empty}
          loadErrorLabel={commentsLabels.loadError}
          errorMessages={commentsLabels.errors}
          onCommentAdded={() => setCommentCount((count) => count + 1)}
        />
      ) : null}
      {repostOpen ? (
        <RepostComposer
          postId={postId}
          quotedFromLabel={repostLabels.quotedFrom}
          quotedAuthor={postAuthor}
          quotedHandle={postHandle}
          quotedContent={postContent}
          placeholder={repostLabels.placeholder}
          submitLabel={repostLabels.submit}
          errorMessages={repostLabels.errors}
          onSuccess={() => {
            setRepostCount((count) => count + 1);
            setRepostOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
