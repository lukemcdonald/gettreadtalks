import type { FunctionReturnType } from 'convex/server';
import type { api } from '@/convex/_generated/api';

/**
 * Infer the user type from the Convex API
 * This automatically stays in sync with the actual return type of api.users.getAuthUser
 */
export type User = FunctionReturnType<typeof api.users.getAuthUser>;

/**
 * Non-null user type for when you know the user is authenticated
 * Use this for components that only render when user exists
 */
export type AuthUser = NonNullable<User>;

/**
 * Sign up parameters
 */
export interface SignUpParams {
  email: string;
  name?: string;
  password: string;
}

/**
 * Sign in parameters
 */
export interface SignInParams {
  email: string;
  password: string;
}
