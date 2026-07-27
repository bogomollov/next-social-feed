"use client";

import { useActionState, useEffect, useRef } from "react";
import { IconSend2 } from "@tabler/icons-react";
import {
  createPost,
  type CreatePostState,
} from "@/features/feed/server/create-post";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Textarea } from "@/shared/ui/textarea";

const MAX_CONTENT_LENGTH = 500;

const initialState: CreatePostState = { status: "idle" };

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type PostComposerProps = {
  authorName: string;
  placeholder: string;
  submitLabel: string;
  errorMessages: {
    empty: string;
    too_long: string;
    unauthorized: string;
  };
};

export function PostComposer({
  authorName,
  placeholder,
  submitLabel,
  errorMessages,
}: PostComposerProps) {
  const [state, formAction, isPending] = useActionState(
    createPost,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <Card>
      <CardContent>
        <form ref={formRef} action={formAction} className="flex gap-3">
          <Avatar>
            <AvatarFallback>{getInitials(authorName)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col gap-3">
            <Textarea
              name="content"
              placeholder={placeholder}
              maxLength={MAX_CONTENT_LENGTH}
              required
              disabled={isPending}
            />
            {state.status === "error" ? (
              <p className="text-sm text-destructive">
                {errorMessages[state.error]}
              </p>
            ) : null}
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending} size="sm">
                {submitLabel}
                <IconSend2 data-icon="inline-end" />
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
