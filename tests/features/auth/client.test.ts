import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockSocial,
  mockEmailSignIn,
  mockUsernameSignIn,
  mockEmailSignUp,
  mockRequestPasswordReset,
  mockResetPassword,
  mockVerifyEmail,
  mockSendVerificationOtp,
} = vi.hoisted(() => ({
  mockSocial: vi.fn(),
  mockEmailSignIn: vi.fn(),
  mockUsernameSignIn: vi.fn(),
  mockEmailSignUp: vi.fn(),
  mockRequestPasswordReset: vi.fn(),
  mockResetPassword: vi.fn(),
  mockVerifyEmail: vi.fn(),
  mockSendVerificationOtp: vi.fn(),
}));

vi.mock("better-auth/react", () => ({
  createAuthClient: () => ({
    signIn: {
      social: mockSocial,
      email: mockEmailSignIn,
      username: mockUsernameSignIn,
    },
    signUp: {
      email: mockEmailSignUp,
    },
    requestPasswordReset: mockRequestPasswordReset,
    resetPassword: mockResetPassword,
    emailOtp: {
      verifyEmail: mockVerifyEmail,
      sendVerificationOtp: mockSendVerificationOtp,
    },
    useSession: vi.fn(),
    signOut: vi.fn(),
  }),
}));

vi.mock("better-auth/client/plugins", () => ({
  emailOTPClient: () => ({ id: "email-otp" }),
  usernameClient: () => ({ id: "username" }),
}));

import {
  requestPasswordResetByEmail,
  resendEmailVerificationOtp,
  resetPasswordWithToken,
  signInWithGithub,
  signInWithLogin,
  signUpWithEmail,
  verifyEmailWithOtp,
} from "@/features/auth/lib/client";

describe("auth client helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState({}, "", "http://localhost:3000/en/login");
    mockSocial.mockResolvedValue({ error: null });
    mockEmailSignIn.mockResolvedValue({ error: null });
    mockUsernameSignIn.mockResolvedValue({ error: null });
    mockEmailSignUp.mockResolvedValue({ error: null });
    mockRequestPasswordReset.mockResolvedValue({ error: null });
    mockResetPassword.mockResolvedValue({ error: null });
    mockVerifyEmail.mockResolvedValue({ error: null });
    mockSendVerificationOtp.mockResolvedValue({ error: null });
  });

  it("uses social sign-in with an absolute callback url for GitHub", async () => {
    await signInWithGithub("/en");

    expect(mockSocial).toHaveBeenCalledWith({
      provider: "github",
      callbackURL: "http://localhost:3000/en",
    });
  });

  it("uses email sign-in when login contains @", async () => {
    await signInWithLogin({
      login: "john@example.com",
      password: "secret123",
      callbackPath: "/en",
    });

    expect(mockEmailSignIn).toHaveBeenCalledWith({
      email: "john@example.com",
      password: "secret123",
      callbackURL: "http://localhost:3000/en",
    });
    expect(mockUsernameSignIn).not.toHaveBeenCalled();
  });

  it("uses username sign-in when login is not an email", async () => {
    await signInWithLogin({
      login: "john_doe",
      password: "secret123",
      callbackPath: "/en",
    });

    expect(mockUsernameSignIn).toHaveBeenCalledWith({
      username: "john_doe",
      password: "secret123",
      callbackURL: "http://localhost:3000/en",
    });
    expect(mockEmailSignIn).not.toHaveBeenCalled();
  });

  it("uses absolute callback urls for sign-up and password reset flows", async () => {
    await signUpWithEmail({
      name: "John Doe",
      username: "john_doe",
      email: "john@example.com",
      password: "secret123",
      callbackPath: "/en",
    });
    await requestPasswordResetByEmail({
      email: "john@example.com",
      redirectPath: "/en/reset-password",
    });

    expect(mockEmailSignUp).toHaveBeenCalledWith({
      name: "John Doe",
      username: "john_doe",
      email: "john@example.com",
      password: "secret123",
      callbackURL: "http://localhost:3000/en",
    });
    expect(mockRequestPasswordReset).toHaveBeenCalledWith({
      email: "john@example.com",
      redirectTo: "http://localhost:3000/en/reset-password",
    });
  });

  it("delegates reset and email verification actions to better-auth", async () => {
    await resetPasswordWithToken({
      token: "token-123",
      newPassword: "secret123",
    });
    await verifyEmailWithOtp({
      email: "john@example.com",
      otp: "123456",
    });
    await resendEmailVerificationOtp({
      email: "john@example.com",
    });

    expect(mockResetPassword).toHaveBeenCalledWith({
      token: "token-123",
      newPassword: "secret123",
    });
    expect(mockVerifyEmail).toHaveBeenCalledWith({
      email: "john@example.com",
      otp: "123456",
    });
    expect(mockSendVerificationOtp).toHaveBeenCalledWith({
      email: "john@example.com",
      type: "email-verification",
    });
  });
});
