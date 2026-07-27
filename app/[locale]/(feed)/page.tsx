import { Suspense } from "react";
import {
  IconBookmark,
  IconChevronRight,
  IconSearch,
  IconSparkles,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  FeedSections,
  type FeedSectionsProps,
} from "@/features/feed/components/feed-sections";
import { FeedSectionsSkeleton } from "@/features/feed/components/feed-sections-skeleton";
import { getFeedPosts, type FeedPost } from "@/features/feed/server/posts";
import { getOptionalSession } from "@/server/auth/session";
import { Link } from "@/shared/i18n/navigation";
import { routing } from "@/shared/i18n/routing";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { PageBody, PageHeader, PageShell } from "@/shared/ui/page-shell";
import { ModeToggle } from "@/shared/ui/theme-button";

type PageProps = {
  params: Promise<{ locale: string }>;
};

type CurrentUser = {
  displayName: string;
  username: string;
} | null;

type FeedAuthor = {
  name: string;
  handle: string;
  role: string;
};

const getSession = getOptionalSession;

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

async function getCurrentUser(fallbackName: string): Promise<CurrentUser> {
  const session = await getSession();

  if (!session?.user) {
    return null;
  }

  return {
    displayName: session.user.name ?? fallbackName,
    username:
      session.user.username ?? session.user.email?.split("@")[0] ?? "user",
  };
}

async function getFeedAuthors(postsPromise: Promise<FeedPost[]>) {
  const posts = await postsPromise;

  return Array.from(
    new Map<string, FeedAuthor>(
      posts.map((post) => [
        post.handle,
        {
          name: post.author,
          handle: post.handle,
          role: post.role,
        },
      ]),
    ).values(),
  );
}

function GuestActions({
  loginLabel,
  registerLabel,
}: {
  loginLabel: string;
  registerLabel: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="outline" size="sm">
        <Link href="/login">{loginLabel}</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/signup">{registerLabel}</Link>
      </Button>
    </div>
  );
}

function SessionBadgeFallback({
  loginLabel,
  registerLabel,
}: {
  loginLabel: string;
  registerLabel: string;
}) {
  return <GuestActions loginLabel={loginLabel} registerLabel={registerLabel} />;
}

async function SessionBadge({
  fallbackName,
  loginLabel,
  registerLabel,
}: {
  fallbackName: string;
  loginLabel: string;
  registerLabel: string;
}) {
  const currentUser = await getCurrentUser(fallbackName);

  if (!currentUser) {
    return <GuestActions loginLabel={loginLabel} registerLabel={registerLabel} />;
  }

  return (
    <Badge variant="outline" className="gap-1.5">
      <IconUserCircle size={14} />
      {`@${currentUser.username}`}
    </Badge>
  );
}

async function FeedSectionsWithSession({
  fallbackName,
  postsPromise,
  ...props
}: Omit<FeedSectionsProps, "posts" | "isAuthorized"> & {
  fallbackName: string;
  postsPromise: Promise<FeedPost[]>;
}) {
  const [currentUser, posts] = await Promise.all([
    getCurrentUser(fallbackName),
    postsPromise,
  ]);

  return (
    <FeedSections
      {...props}
      posts={posts}
      isAuthorized={Boolean(currentUser)}
    />
  );
}

function SessionMemberCardFallback({
  fallbackName,
  guestState,
  memberDescription,
  primaryCta,
  secondaryCta,
  handleLabel,
  statusLabel,
}: {
  fallbackName: string;
  guestState: string;
  memberDescription: string;
  primaryCta: string;
  secondaryCta: string;
  handleLabel: string;
  statusLabel: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{fallbackName}</CardTitle>
        <CardDescription>{memberDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <div className="surface-subtle p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {handleLabel}
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">@guest</p>
          </div>
          <div className="surface-subtle p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {statusLabel}
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {guestState}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild className="flex-1">
            <Link href="/signup">{primaryCta}</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/login">{secondaryCta}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

async function SessionMemberCard({
  fallbackName,
  guestState,
  memberState,
  memberDescription,
  primaryCta,
  secondaryCta,
  handleLabel,
  statusLabel,
}: {
  fallbackName: string;
  guestState: string;
  memberState: string;
  memberDescription: string;
  primaryCta: string;
  secondaryCta: string;
  handleLabel: string;
  statusLabel: string;
}) {
  const currentUser = await getCurrentUser(fallbackName);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{currentUser?.displayName ?? fallbackName}</CardTitle>
        <CardDescription>{memberDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <div className="surface-subtle p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {handleLabel}
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              @{currentUser?.username ?? "guest"}
            </p>
          </div>
          <div className="surface-subtle p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {statusLabel}
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {currentUser ? memberState : guestState}
            </p>
          </div>
        </div>
        {!currentUser ? (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild className="flex-1">
              <Link href="/signup">{primaryCta}</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/login">{secondaryCta}</Link>
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function FeedSummaryCardFallback({
  title,
  description,
  eyebrow,
}: {
  title: string;
  description: string;
  eyebrow: string;
}) {
  return (
    <Card>
      <CardHeader>
        <Badge variant="subtle" className="w-fit gap-1.5">
          <IconSparkles size={14} />
          {eyebrow}
        </Badge>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="surface-subtle p-4 text-sm text-muted-foreground">
          Loading feed summary...
        </div>
      </CardContent>
    </Card>
  );
}

async function FeedSummaryCard({
  postsPromise,
  title,
  description,
  eyebrow,
  summaryLabels,
}: {
  postsPromise: Promise<FeedPost[]>;
  title: string;
  description: string;
  eyebrow: string;
  summaryLabels: {
    posts: string;
    authors: string;
    likes: string;
    comments: string;
    reposts: string;
  };
}) {
  const posts = await postsPromise;

  const summaryItems = [
    { value: posts.length, label: summaryLabels.posts },
    {
      value: new Set(posts.map((post) => post.handle)).size,
      label: summaryLabels.authors,
    },
    {
      value: posts.reduce((sum, post) => sum + post.likes, 0),
      label: summaryLabels.likes,
    },
    {
      value: posts.reduce((sum, post) => sum + post.comments, 0),
      label: summaryLabels.comments,
    },
    {
      value: posts.reduce((sum, post) => sum + post.reposts, 0),
      label: summaryLabels.reposts,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <Badge variant="subtle" className="w-fit gap-1.5">
          <IconSparkles size={14} />
          {eyebrow}
        </Badge>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          {summaryItems.map((item) => (
            <div key={item.label} className="surface-subtle p-4">
              <p className="text-2xl font-semibold tracking-tight text-foreground">
                {item.value}
              </p>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AuthorsCardFallback({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <IconUsers size={18} className="text-muted-foreground" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="surface-subtle p-4 text-sm text-muted-foreground">
          Loading authors...
        </div>
      </CardContent>
    </Card>
  );
}

async function AuthorsSection({
  fallbackName,
  postsPromise,
  title,
  description,
  saveAuthorAria,
}: {
  fallbackName: string;
  postsPromise: Promise<FeedPost[]>;
  title: string;
  description: string;
  saveAuthorAria: string;
}) {
  const currentUser = await getCurrentUser(fallbackName);

  if (!currentUser) {
    return null;
  }

  return (
    <Suspense
      fallback={<AuthorsCardFallback title={title} description={description} />}
    >
      <AuthorsCard
        postsPromise={postsPromise}
        title={title}
        description={description}
        saveAuthorAria={saveAuthorAria}
      />
    </Suspense>
  );
}

async function AuthorsCard({
  postsPromise,
  title,
  description,
  saveAuthorAria,
}: {
  postsPromise: Promise<FeedPost[]>;
  title: string;
  description: string;
  saveAuthorAria: string;
}) {
  const authors = await getFeedAuthors(postsPromise);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <IconUsers size={18} className="text-muted-foreground" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {authors.map((author) => (
          <div
            key={author.handle}
            className="surface-subtle flex items-start justify-between gap-3 p-4"
          >
            <div className="flex min-w-0 items-start gap-3">
              <Avatar size="sm">
                <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {author.name}
                </p>
                <p className="text-xs text-muted-foreground">{author.handle}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {author.role}
                </p>
              </div>
            </div>
            <Button
              size="icon-sm"
              variant="outline"
              aria-label={saveAuthorAria}
            >
              <IconBookmark />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function FeedPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const postsPromise = getFeedPosts(locale);
  const t = await getTranslations({ locale, namespace: "FeedPage" });

  return (
    <PageShell>
      <PageBody>
        <PageHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={`${t("description")} ${t("heroHint")}`}
          actions={
            <>
              <Suspense
                fallback={
                  <SessionBadgeFallback
                    loginLabel={t("memberCard.secondaryCta")}
                    registerLabel={t("memberCard.primaryCta")}
                  />
                }
              >
                <SessionBadge
                  fallbackName={t("profile.fallbackName")}
                  loginLabel={t("memberCard.secondaryCta")}
                  registerLabel={t("memberCard.primaryCta")}
                />
              </Suspense>
              <ModeToggle />
            </>
          }
        >
          <form className="page-toolbar">
            <div className="relative flex-1">
              <IconSearch
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="search"
                placeholder={t("search.placeholder")}
                aria-label={t("search.ariaLabel")}
                className="pl-9"
              />
            </div>
            <Button type="submit" className="sm:min-w-40">
              {t("search.button")}
              <IconChevronRight data-icon="inline-end" />
            </Button>
          </form>
        </PageHeader>

        <div className="content-grid">
          <Suspense fallback={<FeedSectionsSkeleton />}>
            <FeedSectionsWithSession
              fallbackName={t("profile.fallbackName")}
              postsPromise={postsPromise}
              streamTitle={t("streamTitle")}
              streamDescription={t("streamDescription")}
              followLabel={t("actions.follow")}
              registerLabel={t("actions.register")}
            />
          </Suspense>

          <aside className="flex flex-col gap-6">
            <Suspense
              fallback={
                <FeedSummaryCardFallback
                  title={t("pulseTitle")}
                  description={t("pulseDescription")}
                  eyebrow={t("searchEyebrow")}
                />
              }
            >
              <FeedSummaryCard
                postsPromise={postsPromise}
                title={t("pulseTitle")}
                description={t("pulseDescription")}
                eyebrow={t("searchEyebrow")}
                summaryLabels={{
                  posts: t("summary.posts"),
                  authors: t("summary.authors"),
                  likes: t("summary.likes"),
                  comments: t("summary.comments"),
                  reposts: t("summary.reposts"),
                }}
              />
            </Suspense>

            <Suspense
              fallback={
                <AuthorsCardFallback
                  title={t("authorsTitle")}
                  description={t("authorsDescription")}
                />
              }
            >
              <AuthorsSection
                fallbackName={t("profile.fallbackName")}
                postsPromise={postsPromise}
                title={t("authorsTitle")}
                description={t("authorsDescription")}
                saveAuthorAria={t("labels.saveAuthorAria")}
              />
            </Suspense>
          </aside>
        </div>
      </PageBody>
    </PageShell>
  );
}
