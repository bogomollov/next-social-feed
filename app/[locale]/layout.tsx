import "../globals.css";
import { Geist_Mono, Manrope } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { routing } from "@/shared/i18n/routing";
import { DirectionProvider } from "@/shared/ui/direction";
import { ThemeProvider } from "@/shared/ui/theme-provider";

const fontSans = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
});

type Params = Promise<{
  locale: string;
}>;

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir="ltr"
      className="h-full antialiased"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className={`${fontSans.variable} ${fontMono.variable} flex min-h-full flex-col`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            themes={["light", "dark"]}
            disableTransitionOnChange
          >
            <DirectionProvider dir="ltr">{children}</DirectionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
