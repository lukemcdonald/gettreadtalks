import { authComponent } from '../../auth';

/**
 * Base user type returned by Convex better-auth adapter.
 *
 * The Better Auth component has its own tables and types;
 * they are not part of your app's DataModel, so Doc<"user"> is not defined there.
 *
 * We infer the type directly from what the adapter returns.
 */
const _getAuthUser = authComponent.safeGetAuthUser; // For type inference only
type BaseAuthUser = Awaited<ReturnType<typeof _getAuthUser>>;

/**
 * Non-null authenticated user type.
 *
 * Per Convex AI support: If the admin plugin is configured and Convex types
 * are regenerated, this type should automatically include admin plugin fields.
 * However, if the inferred type doesn't include these fields, we extend it
 * manually to ensure type safety.
 */
type NonNullAuthUser = Exclude<BaseAuthUser, null>;

/**
 * User type with admin plugin fields.
 *
 * The admin plugin adds these fields to the user table at runtime:
 * - role: User's role (e.g., 'admin', 'user')
 * - banned: Whether the user is banned
 * - banReason: Reason for the ban
 * - banExpires: When the ban expires
 *
 * Note: If Convex component types are regenerated to include admin plugin fields,
 * this extension may become redundant. Until then, this ensures type safety.
 */
export type User = NonNullAuthUser & {
  role?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: number | null;
};

/**
 * Admin user type with guaranteed admin role.
 *
 * Use this type for functions that require admin access, making it clear
 * that the role is guaranteed to be 'admin'. This provides better type safety
 * and clearer intent in function signatures.
 *
 * Note: This is a type-level guarantee. Runtime checks should still be performed
 * using `requireAdmin()` or `isAdmin()`.
 */
export type AdminUser = User & {
  role: 'admin';
};
