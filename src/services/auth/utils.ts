import type { User } from './types';

/**
 * Check if a user is an admin.
 * Can be used in both client and server components.
 *
 * @param user - User object to check
 * @returns True if user is an admin, false otherwise
 */
export function isAdmin(user: User | null | undefined): boolean {
  return user?.role === 'admin';
}
