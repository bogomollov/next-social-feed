import { getTranslations } from "next-intl/server";
import { Link } from "@/shared/i18n/navigation";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";

export default async function NotFound() {
  const t = await getTranslations("NotFoundPage");

  return (
    <main className="app-shell flex min-h-[calc(100vh-2rem)] items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-[calc(var(--radius)+0.5rem)] border border-border bg-card p-8 text-center shadow-[var(--shadow-sm)]">
        <Badge variant="outline">{t("badge")}</Badge>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          {t("description")}
        </p>
        <Button asChild size="lg">
          <Link href="/">{t("back_home")}</Link>
        </Button>
      </div>
    </main>
  );
}
