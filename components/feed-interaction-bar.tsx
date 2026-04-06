"use client";

import {
  IconHeart,
  IconMessageCircle,
  IconRepeat,
  IconUserPlus,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

type FeedInteractionBarProps = {
  comments: number;
  likes: number;
  reposts: number;
  isAuthorized: boolean;
  followLabel: string;
  registerLabel: string;
};

export function FeedInteractionBar({
  comments,
  likes,
  reposts,
  isAuthorized,
  followLabel,
  registerLabel,
}: FeedInteractionBarProps) {
  const metrics = [
    { key: "likes", value: likes, icon: IconHeart },
    { key: "comments", value: comments, icon: IconMessageCircle },
    { key: "reposts", value: reposts, icon: IconRepeat },
  ];

  if (!isAuthorized) {
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

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Button key={metric.key} size="sm" variant="outline">
              <Icon data-icon="inline-start" />
              {metric.value}
            </Button>
          );
        })}
      </div>
      <Button size="sm">
        <IconUserPlus data-icon="inline-start" />
        {followLabel}
      </Button>
    </div>
  );
}
