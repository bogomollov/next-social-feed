import type { MetadataRoute } from "next";
import { routing } from "@/shared/i18n/routing";
import { env } from "@/shared/lib/env";

const PUBLIC_PATHS = ["", "/login", "/signup", "/forgot-password"];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.NEXT_PUBLIC_APP_URL;

  return PUBLIC_PATHS.map((path) => ({
    url: `${baseUrl}/${routing.defaultLocale}${path}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          `${baseUrl}/${locale}${path}`,
        ]),
      ),
    },
  }));
}
