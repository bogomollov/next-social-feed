import { getTranslations } from "next-intl/server";
import { CenteredAuthCard } from "@/features/auth/components/centered-auth-card";
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
    <CenteredAuthCard
      badge={t("badge")}
      title={t("title")}
      description={t("description")}
    >
      <ForgotPasswordForm />
    </CenteredAuthCard>
  );
}
