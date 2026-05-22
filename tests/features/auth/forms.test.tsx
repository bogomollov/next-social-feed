import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockRouter,
  mockSignInWithLogin,
  mockSignInWithGithub,
  mockSignUpWithEmail,
  mockRequestPasswordResetByEmail,
  mockResetPasswordWithToken,
  mockVerifyEmailWithOtp,
  mockResendEmailVerificationOtp,
} = vi.hoisted(() => ({
  mockRouter: {
    replace: vi.fn(),
    refresh: vi.fn(),
  },
  mockSignInWithLogin: vi.fn(),
  mockSignInWithGithub: vi.fn(),
  mockSignUpWithEmail: vi.fn(),
  mockRequestPasswordResetByEmail: vi.fn(),
  mockResetPasswordWithToken: vi.fn(),
  mockVerifyEmailWithOtp: vi.fn(),
  mockResendEmailVerificationOtp: vi.fn(),
}));

vi.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string, values?: Record<string, string>) =>
    values?.email ? `${key}:${values.email}` : key,
}));

vi.mock("@/shared/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  useRouter: () => mockRouter,
}));

vi.mock("@/features/auth/lib/client", () => ({
  signInWithLogin: mockSignInWithLogin,
  signInWithGithub: mockSignInWithGithub,
  signUpWithEmail: mockSignUpWithEmail,
  requestPasswordResetByEmail: mockRequestPasswordResetByEmail,
  resetPasswordWithToken: mockResetPasswordWithToken,
  verifyEmailWithOtp: mockVerifyEmailWithOtp,
  resendEmailVerificationOtp: mockResendEmailVerificationOtp,
}));

vi.mock("@/shared/ui/input-otp", () => ({
  InputOTP: ({
    id,
    value,
    onChange,
  }: {
    id?: string;
    value?: string;
    onChange?: (value: string) => void;
  }) => (
    <input
      id={id}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
    />
  ),
  InputOTPGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  InputOTPSlot: () => null,
}));

import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { LoginForm } from "@/features/auth/components/login-form";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { SignupForm } from "@/features/auth/components/signup-form";
import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";

describe("auth forms", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignInWithLogin.mockResolvedValue({ error: null });
    mockSignInWithGithub.mockResolvedValue({ error: null });
    mockSignUpWithEmail.mockResolvedValue({ error: null });
    mockRequestPasswordResetByEmail.mockResolvedValue({ error: null });
    mockResetPasswordWithToken.mockResolvedValue({ error: null });
    mockVerifyEmailWithOtp.mockResolvedValue({ error: null });
    mockResendEmailVerificationOtp.mockResolvedValue({ error: null });
  });

  it("submits the login form and redirects on success", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("login"), "john@example.com");
    await user.type(screen.getByLabelText("password"), "secret123");
    await user.click(screen.getByRole("button", { name: "login_button" }));

    await waitFor(() => {
      expect(mockSignInWithLogin).toHaveBeenCalledWith({
        login: "john@example.com",
        password: "secret123",
        callbackPath: "/en",
      });
    });
    expect(mockRouter.replace).toHaveBeenCalledWith("/");
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  it("shows client validation for mismatched signup passwords", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("name"), "John Doe");
    await user.type(screen.getByLabelText("email"), "john@example.com");
    await user.type(screen.getByLabelText("username"), "john_doe");
    await user.type(screen.getByLabelText(/^password$/), "secret123");
    await user.type(screen.getByLabelText("confirm_password"), "different123");
    await user.click(screen.getByRole("button", { name: "submit" }));

    expect(mockSignUpWithEmail).not.toHaveBeenCalled();
    expect(screen.getByText("errors.password_mismatch")).toBeInTheDocument();
  });

  it("submits forgot password requests and shows success state", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText("email"), "john@example.com");
    await user.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() => {
      expect(mockRequestPasswordResetByEmail).toHaveBeenCalledWith({
        email: "john@example.com",
        redirectPath: "/en/reset-password",
      });
    });
    expect(screen.getByText("success")).toBeInTheDocument();
  });

  it("submits password resets and redirects to login", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm token="token-123" />);

    await user.type(screen.getByLabelText("password"), "secret123");
    await user.type(screen.getByLabelText("confirm_password"), "secret123");
    await user.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() => {
      expect(mockResetPasswordWithToken).toHaveBeenCalledWith({
        token: "token-123",
        newPassword: "secret123",
      });
    });
    expect(mockRouter.replace).toHaveBeenCalledWith("/login");
  });

  it("submits email verification and supports resending the otp", async () => {
    const user = userEvent.setup();
    render(<VerifyEmailForm email="john@example.com" />);

    await user.type(screen.getByLabelText("code"), "123456");
    await user.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() => {
      expect(mockVerifyEmailWithOtp).toHaveBeenCalledWith({
        email: "john@example.com",
        otp: "123456",
      });
    });
    expect(mockRouter.replace).toHaveBeenCalledWith("/");
    expect(mockRouter.refresh).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "resend" }));

    await waitFor(() => {
      expect(mockResendEmailVerificationOtp).toHaveBeenCalledWith({
        email: "john@example.com",
      });
    });
    expect(screen.getByText("success")).toBeInTheDocument();
  });
});
