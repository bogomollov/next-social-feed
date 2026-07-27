import { getTranslations } from "next-intl/server";
import { CenteredAuthCard } from "@/features/auth/components/centered-auth-card";
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
    <CenteredAuthCard
      badge={t("badge")}
      title={t("title")}
      description={t("description")}
    >
      <SignupForm />
    </CenteredAuthCard>
  );
}
