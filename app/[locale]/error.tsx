"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("ErrorPage");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="app-shell flex min-h-[calc(100vh-2rem)] items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-[calc(var(--radius)+0.5rem)] border border-border bg-card p-8 text-center shadow-[var(--shadow-sm)]">
        <Badge variant="outline">{t("badge")}</Badge>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          {t("description")}
        </p>
        <Button size="lg" onClick={() => unstable_retry()}>
          {t("retry")}
        </Button>
      </div>
    </main>
  );
}
