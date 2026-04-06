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
import { signInWithGithub, signUpWithEmail } from "@/lib/auth-client";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const t = useTranslations("SignupForm");
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
    const name = String(formData.get("name") ?? "").trim();
    const username = String(formData.get("username") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirm-password") ?? "");

    if (password !== confirmPassword) {
      setError(t("errors.password_mismatch"));
      setIsSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setError(t("errors.password_length"));
      setIsSubmitting(false);
      return;
    }

    if (username.length < 3) {
      setError(t("errors.username_length"));
      setIsSubmitting(false);
      return;
    }

    const result = await signUpWithEmail({
      name,
      username,
      email,
      password,
      callbackPath,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? t("errors.signup_failed"));
      return;
    }

    router.replace(`/verify-email?email=${encodeURIComponent(email)}`);
  };

  const handleGithubSignup = async () => {
    setError(null);
    setIsSubmitting(true);
    await signInWithGithub(callbackPath);
    setIsSubmitting(false);
  };

  return (
    <form className={cn("flex flex-col gap-5", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">{t("name")}</FieldLabel>
          <Input id="name" name="name" type="text" placeholder={t("name_placeholder")} required />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t("email_placeholder")}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="username">{t("username")}</FieldLabel>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder={t("username_placeholder")}
            required
          />
          <FieldDescription>{t("username_description")}</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
          <Input id="password" name="password" type="password" required />
          <FieldDescription>{t("password_description")}</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirm-password">{t("confirm_password")}</FieldLabel>
          <Input id="confirm-password" name="confirm-password" type="password" required />
        </Field>

        <FieldError>{error}</FieldError>

        <Field>
          <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
            {t("submit")}
            <IconArrowRight data-icon="inline-end" />
          </Button>
        </Field>

        <FieldSeparator>{t("or_continue_with")}</FieldSeparator>

        <Field>
          <Button
            variant="outline"
            type="button"
            onClick={handleGithubSignup}
            disabled={isSubmitting}
            size="lg"
            className="w-full"
          >
            <IconBrandGithub data-icon="inline-start" />
            {t("github")}
          </Button>
          <FieldDescription className="pt-1 text-center">
            {t("has_account")}{" "}
            <Link href="/login" className="text-foreground underline underline-offset-4">
              {t("sign_in")}
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
