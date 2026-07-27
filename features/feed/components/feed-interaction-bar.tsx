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

type FeedInteractionBarProps = {
  postId: string;
  comments: number;
  likes: number;
  liked: boolean;
  reposts: number;
  isAuthorized: boolean;
  isOwnPost: boolean;
  followLabel: string;
  registerLabel: string;
};

export function FeedInteractionBar({
  postId,
  comments,
  likes,
  liked,
  reposts,
  isAuthorized,
  isOwnPost,
  followLabel,
  registerLabel,
}: FeedInteractionBarProps) {
  const [likeState, setLikeState] = useState({ liked, count: likes });
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
    <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
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
        <Button size="sm" variant="outline">
          <IconMessageCircle data-icon="inline-start" />
          {comments}
        </Button>
        <Button size="sm" variant="outline">
          <IconRepeat data-icon="inline-start" />
          {reposts}
        </Button>
      </div>
      {isOwnPost ? null : (
        <Button size="sm">
          <IconUserPlus data-icon="inline-start" />
          {followLabel}
        </Button>
      )}
    </div>
  );
}
