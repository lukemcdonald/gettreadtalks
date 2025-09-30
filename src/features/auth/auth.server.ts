import { createAuth } from "@convex/auth";
import { getToken } from "@convex-dev/better-auth/nextjs";

export const getAuthToken = () => {
  return getToken(createAuth);
};
