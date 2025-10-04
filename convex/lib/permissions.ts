import type { MutationCtx, QueryCtx } from '../_generated/server';
import { authComponent } from '../auth';

export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const user = await authComponent.getAuthUser(ctx);

  if (!user) {
    return null;
  }

  return user;
}

export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const user = await getCurrentUser(ctx);

  if (!user) {
    throw new Error('Authentication required');
  }

  return user;
}
