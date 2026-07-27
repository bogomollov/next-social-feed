import "server-only";

import { redis } from "@/server/cache/redis";

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
    return { allowed: false, retryAfterSeconds: ttl > 0 ? ttl : windowSeconds };
  } catch {
    return { allowed: true };
  }
}
