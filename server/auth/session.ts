import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";

export const getOptionalSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
});

export const getCurrentUser = cache(async () => {
  const session = await getOptionalSession();
  return session?.user ?? null;
});

export async function redirectIfAuthenticated(locale: string) {
  const session = await getOptionalSession();

  if (session) {
    redirect(`/${locale}`);
  }
}
