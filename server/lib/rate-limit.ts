import "server-only";

import { redis } from "@/server/cache/redis";
import { logSecurityEvent } from "@/server/lib/logger";

type RateLimitOptions = {
  limit: number;
  windowSeconds: number;
};

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

export async function checkRateLimit(
  key: string,
  { limit, windowSeconds }: RateLimitOptions,
): Promise<RateLimitResult> {
  if (!redis) {
    logSecurityEvent("warn", "rate_limit.not_configured", { key });
    return { allowed: true };
  }

  const redisKey = `ratelimit:${key}`;

  try {
    const count = await redis.incr(redisKey);

    if (count === 1) {
      await redis.expire(redisKey, windowSeconds);
    }

    if (count <= limit) {
      return { allowed: true };
    }

    const ttl = await redis.ttl(redisKey);
    const retryAfterSeconds = ttl > 0 ? ttl : windowSeconds;

    logSecurityEvent("warn", "rate_limit.exceeded", {
      key,
      limit,
      retryAfterSeconds,
    });

    return { allowed: false, retryAfterSeconds };
  } catch (error) {
    logSecurityEvent("error", "rate_limit.unavailable", {
      key,
      message: error instanceof Error ? error.message : String(error),
    });

    return { allowed: false, retryAfterSeconds: windowSeconds };
  }
}
