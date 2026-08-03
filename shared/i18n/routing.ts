import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ru"],
  defaultLocale: "en",
  localeCookie: false,
  localePrefix: {
    mode: "always",
    prefixes: {
      en: "/en",
      ru: "/ru",
    },
  },
});
