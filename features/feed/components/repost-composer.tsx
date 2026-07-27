"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createRepost,
  type CreateRepostState,
} from "@/features/feed/server/create-repost";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";

const MAX_CONTENT_LENGTH = 500;

const initialState: CreateRepostState = { status: "idle" };

type RepostComposerProps = {
  postId: string;
  quotedFromLabel: string;
  quotedAuthor: string;
  quotedHandle: string;
  quotedContent: string;
  placeholder: string;
  submitLabel: string;
  errorMessages: {
    too_long: string;
    unauthorized: string;
    not_found: string;
    rate_limited: string;
  };
  onSuccess?: () => void;
};

export function RepostComposer({
  postId,
  quotedFromLabel,
  quotedAuthor,
  quotedHandle,
  quotedContent,
  placeholder,
  submitLabel,
  errorMessages,
  onSuccess,
}: RepostComposerProps) {
  const createRepostForPost = createRepost.bind(null, postId);
  const [state, formAction, isPending] = useActionState(
    createRepostForPost,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      onSuccess?.();
    }
  }, [state, onSuccess]);

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4">
      <div className="surface-subtle flex flex-col gap-1 p-3">
        <p className="text-xs font-medium text-muted-foreground">
          {quotedFromLabel} {quotedAuthor} ({quotedHandle})
        </p>
        <p className="text-sm leading-6 text-foreground">{quotedContent}</p>
      </div>
      <form ref={formRef} action={formAction} className="flex flex-col gap-2">
        <Textarea
          name="content"
          placeholder={placeholder}
          maxLength={MAX_CONTENT_LENGTH}
          disabled={isPending}
        />
        {state.status === "error" ? (
          <p className="text-sm text-destructive">
            {errorMessages[state.error]}
          </p>
        ) : null}
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={isPending}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
