import "server-only";

type LogLevel = "info" | "warn" | "error";

const consoleByLevel: Record<LogLevel, (...args: unknown[]) => void> = {
  info: console.info,
  warn: console.warn,
  error: console.error,
};

export function logSecurityEvent(
  level: LogLevel,
  event: string,
  context: Record<string, unknown> = {},
) {
  consoleByLevel[level](
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      event,
      ...context,
    }),
  );
}
