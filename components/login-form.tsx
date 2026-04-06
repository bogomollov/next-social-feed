"use client";

import { useState } from "react";
import { IconArrowRight, IconBrandGithub } from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/navigation";
import { signInWithGithub, signInWithLogin } from "@/lib/auth-client";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const t = useTranslations("LoginForm");
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const callbackPath = `/${locale}`;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const login = String(formData.get("login") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const result = await signInWithLogin({
      login,
      password,
      callbackPath,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? t("login_failed"));
      return;
    }

    router.replace("/");
    router.refresh();
  };

  const handleGithubLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    await signInWithGithub(callbackPath);
    setIsSubmitting(false);
  };

  return (
    <form className={cn("flex flex-col gap-5", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="login">{t("login")}</FieldLabel>
          <Input
            id="login"
            name="login"
            type="text"
            placeholder={t("login_placeholder")}
            required
          />
        </Field>

        <Field>
          <div className="flex items-center justify-between gap-3">
            <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {t("forgot_password")}
            </Link>
          </div>
          <Input id="password" name="password" type="password" required />
        </Field>

        <FieldError>{error}</FieldError>

        <Field>
          <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
            {t("login_button")}
            <IconArrowRight data-icon="inline-end" />
          </Button>
        </Field>

        <FieldSeparator>{t("or_continue_with")}</FieldSeparator>

        <Field>
          <Button
            onClick={handleGithubLogin}
            variant="outline"
            type="button"
            disabled={isSubmitting}
            size="lg"
            className="w-full"
          >
            <IconBrandGithub data-icon="inline-start" />
            {t("login_with_github")}
          </Button>
          <FieldDescription className="pt-1 text-center">
            {t("no_account")}{" "}
            <Link href="/signup" className="text-foreground underline underline-offset-4">
              {t("sign_up")}
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
