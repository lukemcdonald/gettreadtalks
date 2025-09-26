import { z } from "zod";

// Server-side environment validation
const serverEnvSchema = z.object({
  BETTER_AUTH_BASE_URL: z.string().url().optional(),
  BETTER_AUTH_EMAIL_FROM: z.string().email().optional(),
  BETTER_AUTH_SECRET: z.string().min(32).optional(),
  CONVEX_DEPLOYMENT: z.string().optional(),
  NEXT_PUBLIC_APP_ENV: z.enum(["development", "preview", "production"]).optional(),
  RESEND_API_KEY: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
});

// Client-side environment validation
const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_ENV: z.enum(["development", "preview", "production"]).optional(),
  NEXT_PUBLIC_BOT_PROTECTION_TOKEN: z.string().optional(),
  NEXT_PUBLIC_CONVEX_URL: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

export function validateServerEnv() {
  const result = serverEnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Invalid server environment variables:", result.error.format());
    return {
      isValid: false,
      errors: result.error.format(),
    };
  }
  return {
    data: result.data,
    isValid: true,
  };
}

export function validateClientEnv() {
  const clientEnv = {
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_BOT_PROTECTION_TOKEN: process.env.NEXT_PUBLIC_BOT_PROTECTION_TOKEN,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  };

  const result = clientEnvSchema.safeParse(clientEnv);
  if (!result.success) {
    console.error("❌ Invalid client environment variables:", result.error.format());
    return {
      errors: result.error.format(),
      isValid: false,
    };
  }
  return {
    data: result.data,
    isValid: true,
  };
}

export function getEnvironmentStatus() {
  const requiredVars = [
    "NEXT_PUBLIC_CONVEX_URL",
    "NEXT_PUBLIC_CONVEX_SITE_URL",
    "SITE_URL",
    "BETTER_AUTH_SECRET",
  ];

  const optional = [
    "NEXT_PUBLIC_SENTRY_DSN",
    "NEXT_PUBLIC_BOT_PROTECTION_TOKEN",
    "BETTER_AUTH_EMAIL_FROM",
    "RESEND_API_KEY",
    "NEXT_PUBLIC_APP_ENV",
  ];

  const missing = requiredVars.filter((key) => !process.env[key]);
  const optionalMissing = optional.filter((key) => !process.env[key]);

  return {
    missing,
    optionalMissing,
    ready: missing.length === 0,
  };
}
