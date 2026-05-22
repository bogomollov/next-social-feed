import { connection } from "next/server";
import { getTranslations } from "next-intl/server";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";
import { redirectIfAuthenticated } from "@/server/auth/session";

export default async function VerifyEmailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email?: string | string[] }>;
}) {
  await connection();
  const { locale } = await params;
  await redirectIfAuthenticated(locale);
  const t = await getTranslations({ locale, namespace: "VerifyEmailPage" });

  const resolvedSearchParams = await searchParams;
  const email = Array.isArray(resolvedSearchParams.email)
    ? resolvedSearchParams.email[0] ?? null
    : resolvedSearchParams.email ?? null;

  return (
    <AuthShell
      locale={locale}
      badge={t("badge")}
      title={t("title")}
      description={t("description")}
    >
      <VerifyEmailForm email={email} />
    </AuthShell>
  );
}
