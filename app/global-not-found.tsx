import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist or may have been moved.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center antialiased">
        <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-[calc(var(--radius)+0.5rem)] border border-border bg-card p-8 text-center shadow-[var(--shadow-sm)]">
          <h1 className="text-2xl font-semibold tracking-tight">
            Page not found
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or may have
            been moved.
          </p>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-primary bg-primary px-5 text-sm font-medium text-primary-foreground"
          >
            Back to feed
          </Link>
        </div>
      </body>
    </html>
  );
}
