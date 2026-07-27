import { redis } from "@/server/cache/redis";
import { db } from "@/server/db/client";
import { account, session, user, verification } from "@/server/db/schema";
import { sendAuthEmail } from "@/server/email";
import { logSecurityEvent } from "@/server/lib/logger";
import { env } from "@/shared/lib/env";
import { redisStorage } from "@better-auth/redis-storage";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins/email-otp";
import { username } from "better-auth/plugins/username";

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = env;

export const auth = betterAuth({
  appName: env.APP_NAME,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      account,
      session,
      verification,
    },
  }),
  session: {
    storeSessionInDatabase: false,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
      strategy: "jwe",
    },
  },
  verification: {
    storeInDatabase: false,
    storeIdentifier: "hashed",
  },
  advanced: {
    cookiePrefix: "next-social-feed",
    database: {
      generateId: "uuid",
    },
  },
  logger: {
    level: "warn",
    log: (level, message, ...args) => {
      logSecurityEvent(level === "error" ? "error" : "warn", "auth.internal", {
        message,
        details: args,
      });
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (createdUser) => {
          logSecurityEvent("info", "auth.user_created", {
            userId: createdUser.id,
            email: createdUser.email,
          });
        },
      },
    },
    session: {
      create: {
        after: async (createdSession) => {
          logSecurityEvent("info", "auth.session_created", {
            userId: createdSession.userId,
          });
        },
      },
    },
  },
  trustedOrigins: [env.BETTER_AUTH_URL, env.NEXT_PUBLIC_APP_URL],
  ...(GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET
    ? {
        socialProviders: {
          github: {
            clientId: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            overrideUserInfoOnSignIn: true,
            mapProfileToUser: (profile) => ({
              username: profile.login,
            }),
          },
        },
      }
    : {}),
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendAuthEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Open this link to reset your password: ${url}`,
        html: `<p>Open this link to reset your password:</p><p><a href="${url}">${url}</a></p>`,
      });
    },
  },
  account: {
    storeStateStrategy: "cookie",
    storeAccountCookie: true,
    encryptOAuthTokens: true,
  },
  ...(redis
    ? {
        secondaryStorage: redisStorage({
          client: redis,
          keyPrefix: "session:",
        }),
      }
    : {}),
  plugins: [
    username(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      otpLength: 6,
      expiresIn: 5 * 60,
      storeOTP: "hashed",
      sendVerificationOTP: async ({ email, otp, type }) => {
        const subjectByType = {
          "email-verification": "Verify your email",
          "sign-in": "Your sign-in code",
          "forget-password": "Your password reset code",
          "change-email": "Confirm your new email",
        } as const;

        const introByType = {
          "email-verification": "Enter this code to verify your email:",
          "sign-in": "Enter this code to complete sign in:",
          "forget-password": "Enter this code to reset your password:",
          "change-email": "Enter this code to confirm your new email:",
        } as const;

        await sendAuthEmail({
          to: email,
          subject: subjectByType[type],
          text: `${introByType[type]} ${otp}`,
          html: `<p>${introByType[type]}</p><p><strong style="font-size: 24px; letter-spacing: 0.3em;">${otp}</strong></p><p>This code expires in 5 minutes.</p>`,
        });
      },
    }),
    nextCookies(),
  ],
});
