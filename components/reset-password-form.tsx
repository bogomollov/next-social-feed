"use client";

import { useState } from "react";
import { IconArrowRight } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/navigation";
import { resetPasswordWithToken } from "@/lib/auth-client";

export function ResetPasswordForm({
  token,
  className,
  ...props
}: React.ComponentProps<"form"> & { token: string | null }) {
  const t = useTranslations("ResetPasswordForm");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setError(t("errors.missing_token"));
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
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

    const result = await resetPasswordWithToken({
      token,
      newPassword: password,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? t("errors.reset_failed"));
      return;
    }

    router.replace("/login");
  };

  return (
    <form className={cn("flex flex-col gap-5", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
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
          <Button type="submit" disabled={isSubmitting || !token} size="lg" className="w-full">
            {t("submit")}
            <IconArrowRight data-icon="inline-end" />
          </Button>
        </Field>

        <FieldDescription className="text-center">
          <Link href="/login" className="text-foreground underline underline-offset-4">
            {t("back_to_login")}
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
