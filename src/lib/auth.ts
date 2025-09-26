import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    connectionString: "memory://",
    type: "sqlite",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true when email is configured
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  socialProviders: {},
  trustedOrigins: [process.env.BETTER_AUTH_BASE_URL || "http://localhost:3000"],
});
