import { getTranslations } from "next-intl/server";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { redirectIfAuthenticated } from "@/server/auth/session";

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await redirectIfAuthenticated(locale);
  const t = await getTranslations({ locale, namespace: "ForgotPasswordPage" });

  return (
    <AuthShell
      locale={locale}
      badge={t("badge")}
      title={t("title")}
      description={t("description")}
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
