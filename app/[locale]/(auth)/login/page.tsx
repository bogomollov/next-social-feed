import { getTranslations } from "next-intl/server";
import { AuthShell } from "@/features/auth/components/auth-shell";
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
    <AuthShell
      locale={locale}
      badge={t("badge")}
      title={t("title")}
      description={t("description")}
    >
      <LoginForm />
    </AuthShell>
  );
}
