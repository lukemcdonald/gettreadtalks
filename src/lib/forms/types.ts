/**
 * Shared types for form handling and Server Actions.
 */

/**
 * Result type for Server Actions that handle form submissions.
 * Used by all Server Actions that return success/error responses to forms.
 *
 * @template T - The data type returned on success
 *
 * @example
 * ```ts
 * export async function createItemAction(
 *   data: unknown
 * ): Promise<ActionResult<{ itemId: string }>> {
 *   // ...
 * }
 * ```
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> };
