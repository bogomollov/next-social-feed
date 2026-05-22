import { connection } from "next/server";
import { getTranslations } from "next-intl/server";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { redirectIfAuthenticated } from "@/server/auth/session";

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  await connection();
  const { locale } = await params;
  await redirectIfAuthenticated(locale);
  const t = await getTranslations({ locale, namespace: "ResetPasswordPage" });

  const resolvedSearchParams = await searchParams;
  const token = Array.isArray(resolvedSearchParams.token)
    ? resolvedSearchParams.token[0] ?? null
    : resolvedSearchParams.token ?? null;

  return (
    <AuthShell
      locale={locale}
      badge={t("badge")}
      title={t("title")}
      description={t("description")}
    >
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
