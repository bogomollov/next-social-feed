import { getTranslations } from "next-intl/server";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { SignupForm } from "@/features/auth/components/signup-form";
import { redirectIfAuthenticated } from "@/server/auth/session";

export default async function SignupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await redirectIfAuthenticated(locale);
  const t = await getTranslations({ locale, namespace: "SignupPage" });

  return (
    <AuthShell
      locale={locale}
      badge={t("badge")}
      title={t("title")}
      description={t("description")}
    >
      <SignupForm />
    </AuthShell>
  );
}
