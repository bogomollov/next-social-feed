import { createAuthClient } from "better-auth/react";
import { emailOTPClient, usernameClient } from "better-auth/client/plugins";
import { env } from "@/shared/lib/env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [usernameClient(), emailOTPClient()],
});

const toAbsoluteCallbackURL = (callbackPath: string) => {
  if (typeof window === "undefined") {
    return callbackPath;
  }

  return new URL(callbackPath, window.location.origin).toString();
};

export const signInWithGithub = async (callbackPath: string) => {
  return authClient.signIn.social({
    provider: "github",
    callbackURL: toAbsoluteCallbackURL(callbackPath),
  });
};

export const signInWithLogin = async ({
  login,
  password,
  callbackPath,
}: {
  login: string;
  password: string;
  callbackPath: string;
}) => {
  const callbackURL = toAbsoluteCallbackURL(callbackPath);

  if (login.includes("@")) {
    return authClient.signIn.email({
      email: login,
      password,
      callbackURL,
    });
  }

  return authClient.signIn.username({
    username: login,
    password,
    callbackURL,
  });
};

export const signUpWithEmail = async ({
  name,
  username,
  email,
  password,
  callbackPath,
}: {
  name: string;
  username: string;
  email: string;
  password: string;
  callbackPath: string;
}) => {
  return authClient.signUp.email({
    name,
    username,
    email,
    password,
    callbackURL: toAbsoluteCallbackURL(callbackPath),
  });
};

export const requestPasswordResetByEmail = async ({
  email,
  redirectPath,
}: {
  email: string;
  redirectPath: string;
}) => {
  return authClient.requestPasswordReset({
    email,
    redirectTo: toAbsoluteCallbackURL(redirectPath),
  });
};

export const resetPasswordWithToken = async ({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}) => {
  return authClient.resetPassword({
    token,
    newPassword,
  });
};

export const verifyEmailWithOtp = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) => {
  return authClient.emailOtp.verifyEmail({
    email,
    otp,
  });
};

export const resendEmailVerificationOtp = async ({
  email,
}: {
  email: string;
}) => {
  return authClient.emailOtp.sendVerificationOtp({
    email,
    type: "email-verification",
  });
};

export const { signUp, signIn, useSession, signOut } = authClient;
