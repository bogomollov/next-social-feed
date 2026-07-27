"use client";

import { useSyncExternalStore } from "react";
import { IconCheck, IconMoon, IconSun } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Skeleton } from "@/shared/ui/skeleton";

export function ModeToggle() {
  const t = useTranslations("ThemeToggle");
  const { resolvedTheme, setTheme, theme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) {
    return <Skeleton className="h-8 w-24 rounded-md" />;
  }

  const activeTheme = theme === "system" ? resolvedTheme : (theme ?? "light");
  const TriggerIcon = activeTheme === "dark" ? IconMoon : IconSun;
  const themes = [
    {
      id: "light",
      label: t("light.label"),
      description: t("light.description"),
      icon: IconSun,
    },
    {
      id: "dark",
      label: t("dark.label"),
      description: t("dark.description"),
      icon: IconMoon,
    },
  ] as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <TriggerIcon data-icon="inline-start" />
          {activeTheme === "dark" ? t("dark.label") : t("light.label")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("appearance")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((item) => {
          const ItemIcon = item.icon;

          return (
            <DropdownMenuItem key={item.id} onClick={() => setTheme(item.id)}>
              <ItemIcon />
              <span className="flex flex-1 flex-col">
                <span>{item.label}</span>
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              </span>
              {activeTheme === item.id ? <IconCheck /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
