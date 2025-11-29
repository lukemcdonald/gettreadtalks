import { authComponent } from '../../auth';

const _getAuthUser = authComponent.safeGetAuthUser;
type BaseAuthUser = Awaited<ReturnType<typeof _getAuthUser>>;

/**
 * Authenticated user type. Includes admin plugin fields (role, banned, etc.)
 * from the Better Auth component schema.
 */
export type User = Exclude<BaseAuthUser, null>;

/**
 * Admin user type with guaranteed admin role.
 */
export type AdminUser = User & {
  role: 'admin';
};
