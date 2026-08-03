import { expect, test } from "@playwright/test";

test.describe("auth routes", () => {
  test("login page renders core auth controls", async ({ page }) => {
    await page.goto("/en/login");

    await expect(
      page.getByRole("heading", { level: 1, name: "Access your account" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Login with GitHub" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Forgot your password?" })).toBeVisible();
  });

  test("signup validates mismatched passwords on the client", async ({ page }) => {
    await page.goto("/en/signup");

    await page.getByLabel("Full name").fill("John Doe");
    await page.getByLabel("Email").fill("john@example.com");
    await page.getByLabel("Username").fill("john_doe");
    await page.getByLabel("Password", { exact: true }).fill("secret123");
    await page.getByLabel("Confirm password").fill("different123");
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page.getByText("Passwords do not match.")).toBeVisible();
  });

  test("forgot password page renders the request form", async ({ page }) => {
    await page.goto("/en/forgot-password");

    await expect(
      page.getByRole("heading", { level: 1, name: "Reset your password" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Send reset link" }),
    ).toBeVisible();
  });

  test("reset password route disables submit without a token", async ({ page }) => {
    await page.goto("/en/reset-password");

    await expect(
      page.getByRole("heading", { level: 1, name: "Choose a new password" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Reset password" }),
    ).toBeDisabled();
  });

  test("verify email route disables actions when email is missing", async ({ page }) => {
    await page.goto("/en/verify-email");

    await expect(
      page.getByRole("heading", { level: 1, name: "Confirm your email" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Verify email" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Resend code" })).toBeDisabled();
  });
});
