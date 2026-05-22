"use client";

import { useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { IconRefresh } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import {
  resendEmailVerificationOtp,
  verifyEmailWithOtp,
} from "@/features/auth/lib/client";
import { Link, useRouter } from "@/shared/i18n/navigation";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/ui/input-otp";

export function VerifyEmailForm({
  email,
  className,
  ...props
}: React.ComponentProps<"form"> & { email: string | null }) {
  const t = useTranslations("VerifyEmailForm");
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      setError(t("errors.missing_email"));
      return;
    }

    if (otp.length !== 6) {
      setError(t("errors.otp_length"));
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const result = await verifyEmailWithOtp({
      email,
      otp,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? t("errors.verify_failed"));
      return;
    }

    router.replace("/");
    router.refresh();
  };

  const handleResend = async () => {
    if (!email) {
      setError(t("errors.missing_email"));
      return;
    }

    setError(null);
    setSuccess(null);
    setIsResending(true);

    const result = await resendEmailVerificationOtp({ email });

    setIsResending(false);

    if (result.error) {
      setError(result.error.message ?? t("errors.resend_failed"));
      return;
    }

    setSuccess(t("success"));
  };

  return (
    <form className={cn("flex flex-col gap-5", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <Field className="items-start">
          <FieldLabel htmlFor="verification-code">{t("code")}</FieldLabel>
          <InputOTP
            id="verification-code"
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={otp}
            onChange={setOtp}
            containerClassName="justify-start"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <FieldDescription>
            {t("code_description", {
              email: email ?? t("email_fallback"),
            })}
          </FieldDescription>
        </Field>

        <FieldError>{error}</FieldError>

        {success ? (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        ) : null}

        <Field>
          <Button type="submit" disabled={isSubmitting || !email} size="lg" className="w-full">
            {t("submit")}
          </Button>
        </Field>

        <Field>
          <Button
            type="button"
            variant="outline"
            disabled={isResending || !email}
            onClick={handleResend}
            size="lg"
            className="w-full"
          >
            <IconRefresh data-icon="inline-start" />
            {t("resend")}
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
