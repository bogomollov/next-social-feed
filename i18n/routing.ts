import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "ru"],

  // Used when no locale matches
  defaultLocale: "en",
  localeCookie: false,
  localePrefix: {
    mode: "always",
    prefixes: {
      en: "/en",
      ru: "/ru",
      // ...
    },
  },
});
