import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  cacheComponents: true,
};

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./shared/i18n/request.ts",
  experimental: {
    srcPath: ["./app", "./features", "./shared"],
    messages: {
      path: "./shared/i18n/locales",
      format: "json",
      locales: "infer",
      precompile: true,
    },
  },
});

export default withNextIntl(nextConfig);
