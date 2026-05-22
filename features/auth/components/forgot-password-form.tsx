"use client";

import { useState } from "react";
import { IconArrowRight, IconMail } from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import { requestPasswordResetByEmail } from "@/features/auth/lib/client";
import { Link } from "@/shared/i18n/navigation";
import { cn } from "@/shared/lib/utils";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const t = useTranslations("ForgotPasswordForm");
  const locale = useLocale();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();

    const result = await requestPasswordResetByEmail({
      email,
      redirectPath: `/${locale}/reset-password`,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? t("errors.request_failed"));
      return;
    }

    setSuccess(t("success"));
  };

  return (
    <form className={cn("flex flex-col gap-5", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t("email_placeholder")}
            required
          />
          <FieldDescription>{t("email_description")}</FieldDescription>
        </Field>

        <FieldError>{error}</FieldError>

        {success ? (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        ) : null}

        <Field>
          <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
            <IconMail data-icon="inline-start" />
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
