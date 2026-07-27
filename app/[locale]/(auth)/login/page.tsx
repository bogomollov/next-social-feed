import { getTranslations } from "next-intl/server";
import { CenteredAuthCard } from "@/features/auth/components/centered-auth-card";
import { LoginForm } from "@/features/auth/components/login-form";
import { redirectIfAuthenticated } from "@/server/auth/session";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await redirectIfAuthenticated(locale);
  const t = await getTranslations({ locale, namespace: "LoginPage" });

  return (
    <CenteredAuthCard
      badge={t("badge")}
      title={t("title")}
      description={t("description")}
    >
      <LoginForm />
    </CenteredAuthCard>
  );
}
