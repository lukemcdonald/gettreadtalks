import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // Use direct URL instead of env variable for local dev
  plugins: [convexClient()],
});
