import { IconLayoutGrid, IconShieldCheck, IconUserScan } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/theme-button";
import { Link } from "@/i18n/navigation";

type AuthShellProps = {
  locale: string;
  badge: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

const authHighlightIcons = [IconShieldCheck, IconUserScan] as const;

export async function AuthShell({
  locale,
  badge,
  title,
  description,
  children,
}: AuthShellProps) {
  const t = await getTranslations({ locale, namespace: "AuthShell" });
  const authHighlights = [
    {
      title: t("highlights.logic.title"),
      description: t("highlights.logic.description"),
      icon: authHighlightIcons[0],
    },
    {
      title: t("highlights.layout.title"),
      description: t("highlights.layout.description"),
      icon: authHighlightIcons[1],
    },
  ];

  return (
    <main className="app-shell">
      <div className="auth-grid">
        <section className="flex flex-col gap-6 rounded-[calc(var(--radius)+0.5rem)] border border-border bg-card p-5 shadow-[var(--shadow-xs)] sm:p-6 lg:p-8">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-sm font-medium text-foreground"
            >
              <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted">
                <IconLayoutGrid size={18} />
              </span>
              {t("brand")}
            </Link>
            <ModeToggle />
          </div>

          <div className="flex flex-1 flex-col justify-between gap-8">
            <div className="flex max-w-xl flex-col gap-4">
              <Badge variant="outline" className="w-fit">
                {badge}
              </Badge>
              <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {title}
                </h1>
                <p className="max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
                  {description}
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {authHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <Card key={item.title} size="sm">
                    <CardContent className="flex items-start gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
                        <Icon size={18} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h2 className="text-sm font-semibold text-foreground">
                          {item.title}
                        </h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="flex flex-col justify-center">
          <div className="rounded-[calc(var(--radius)+0.5rem)] border border-border bg-card p-5 shadow-[var(--shadow-sm)] sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-3">
              <Badge variant="outline" className="w-fit">
                {badge}
              </Badge>
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            </div>
            <Separator className="mb-6" />
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
