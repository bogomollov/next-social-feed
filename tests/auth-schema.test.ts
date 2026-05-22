import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("better auth schema", () => {
  it("includes oauth token columns required for social providers", () => {
    const schema = readFileSync("server/db/schema.ts", "utf8");

    expect(schema).toContain('accessToken: text("access_token")');
    expect(schema).toContain('refreshToken: text("refresh_token")');
    expect(schema).toContain('idToken: text("id_token")');
    expect(schema).toContain(
      'accessTokenExpiresAt: timestamp("access_token_expires_at")',
    );
    expect(schema).toContain(
      'refreshTokenExpiresAt: timestamp("refresh_token_expires_at")',
    );
  });

  it("includes verification and session tables required by auth flows", () => {
    const schema = readFileSync("server/db/schema.ts", "utf8");
    const authConfig = readFileSync("server/auth/index.ts", "utf8");

    expect(schema).toContain("export const session = pgTable(");
    expect(schema).toContain('"session"');
    expect(schema).toContain('token: text("token").notNull().unique()');
    expect(schema).toContain("export const verification = pgTable(");
    expect(schema).toContain('"verification"');
    expect(schema).toContain('identifier: text("identifier").notNull()');
    expect(schema).toContain('value: text("value").notNull()');
    expect(authConfig).toContain("session,");
    expect(authConfig).toContain("verification,");
  });
});
