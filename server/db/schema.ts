import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  name: varchar("name", { length: 255 }),
  image: text("image"),

  // Legacy field kept to avoid destructive migration paths from the old schema.
  passwordHash: text("password_hash"),
  githubId: varchar("github_id", { length: 255 }),

  username: varchar("username", { length: 255 }).unique(),
  displayUsername: varchar("display_username", { length: 255 }).unique(),
  bio: text("bio"),
  followersCount: integer("followers_count").default(0).notNull(),
  followingCount: integer("following_count").default(0).notNull(),
  postsCount: integer("posts_count").default(0).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const account = pgTable(
  "account",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: varchar("account_id", { length: 255 }).notNull(),
    providerId: varchar("provider_id", { length: 255 }).notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    password: text("password"),
    scope: text("scope"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    providerAccountUnique: uniqueIndex("account_provider_account_unique").on(
      table.providerId,
      table.accountId,
    ),
    userIdIdx: index("account_user_id_idx").on(table.userId),
  }),
);

export const session = pgTable(
  "session",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => ({
    userIdIdx: index("session_user_id_idx").on(table.userId),
  }),
);

export const verification = pgTable(
  "verification",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    identifierIdx: index("verification_identifier_idx").on(table.identifier),
  }),
);

export const post = pgTable(
  "post",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull(),
    authorId: uuid("author_id").references(() => user.id, {
      onDelete: "set null",
    }),
    authorName: varchar("author_name", { length: 255 }).notNull(),
    authorHandle: varchar("author_handle", { length: 255 }).notNull(),
    authorRole: varchar("author_role", { length: 255 }).notNull(),
    topic: varchar("topic", { length: 255 }).notNull(),
    content: text("content").notNull(),
    likes: integer("likes").default(0).notNull(),
    comments: integer("comments").default(0).notNull(),
    reposts: integer("reposts").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    slugUnique: uniqueIndex("post_slug_unique").on(table.slug),
    authorIdIdx: index("post_author_id_idx").on(table.authorId),
    createdAtIdx: index("post_created_at_idx").on(table.createdAt),
  }),
);
