"use client";

import { useEffect, useState, useTransition } from "react";
import { createComment } from "@/features/feed/server/create-comment";
import { getComments, type PostCommentDTO } from "@/features/feed/server/comments";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";

const MAX_CONTENT_LENGTH = 500;

type PostCommentsProps = {
  postId: string;
  authorName: string;
  placeholder: string;
  submitLabel: string;
  emptyLabel: string;
  loadErrorLabel: string;
  errorMessages: {
    empty: string;
    too_long: string;
    unauthorized: string;
    rate_limited: string;
  };
  onCommentAdded?: () => void;
};

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function PostComments({
  postId,
  authorName,
  placeholder,
  submitLabel,
  emptyLabel,
  loadErrorLabel,
  errorMessages,
  onCommentAdded,
}: PostCommentsProps) {
  const [comments, setComments] = useState<PostCommentDTO[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [content, setContent] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    startTransition(async () => {
      const result = await getComments(postId);

      if (cancelled) {
        return;
      }

      if (result.status === "error") {
        setLoadError(true);
        return;
      }

      setComments(result.comments);
    });

    return () => {
      cancelled = true;
    };
  }, [postId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = content.trim();

    if (!trimmed) {
      return;
    }

    startTransition(async () => {
      const result = await createComment(postId, trimmed);

      if (result.status === "error") {
        setSubmitError(errorMessages[result.error]);
        return;
      }

      setSubmitError(null);
      setContent("");
      setComments((current) => [...(current ?? []), result.comment]);
      onCommentAdded?.();
    });
  };

  return (
    <div className="flex flex-col gap-4 border-t border-border pt-4">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Avatar size="sm">
          <AvatarFallback>{getInitials(authorName)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col gap-2">
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={placeholder}
            maxLength={MAX_CONTENT_LENGTH}
            disabled={isPending}
          />
          {submitError ? (
            <p className="text-sm text-destructive">{submitError}</p>
          ) : null}
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={isPending || !content.trim()}
            >
              {submitLabel}
            </Button>
          </div>
        </div>
      </form>

      <div className="flex flex-col gap-3">
        {loadError ? (
          <p className="text-sm text-destructive">{loadErrorLabel}</p>
        ) : comments === null ? null : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyLabel}</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <Avatar size="sm">
                <AvatarFallback>{getInitials(comment.author)}</AvatarFallback>
              </Avatar>
              <div className="surface-subtle flex-1 p-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {comment.author}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {comment.handle}
                  </p>
                </div>
                <p className="mt-1 text-sm leading-6 text-foreground">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
