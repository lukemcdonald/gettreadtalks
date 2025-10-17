/**
 * Sentry error tracking utilities for Convex functions
 *
 * Convex automatically sends these tags:
 * - func: Function name (e.g., "talks:create")
 * - func_type: "query" | "mutation" | "action" | "http_action"
 * - func_runtime: "default" | "node"
 * - request_id: Request ID
 * - server_name: Deployment name (e.g., "happy-animal-123")
 * - environment: "prod" | "dev" | "preview"
 * - user: tokenIdentifier (if authenticated)
 */

export interface ErrorContext {
  // Business domain context
  feature: 'talks' | 'speakers' | 'collections' | 'users' | 'clips' | 'topics' | 'affiliateLinks';
  operation?: 'create' | 'update' | 'delete' | 'archive' | 'publish' | 'list' | 'get' | 'search';

  // Error categorization
  error_category?:
    | 'validation'
    | 'auth'
    | 'not_found'
    | 'permission'
    | 'database'
    | 'external_api'
    | 'unknown';
  error_severity?: 'low' | 'medium' | 'high' | 'critical';

  // User context
  user_role?: string;
  is_authenticated?: boolean;

  // Business context
  entity_status?: string;
  batch_size?: number;

  // Performance context
  is_slow_query?: boolean;
  duration_ms?: number;
}

/**
 * Enhance error with context tags for Sentry
 *
 * Usage:
 * ```ts
 * throw enhanceError(
 *   new Error('Talk not found'),
 *   { feature: 'talks', operation: 'get', error_category: 'not_found' }
 * );
 * ```
 */
export function enhanceError(error: Error, context: ErrorContext): Error {
  // Store context as error properties (Convex will forward to Sentry)
  Object.entries(context).forEach(([key, value]) => {
    if (value !== undefined) {
      (error as any)[`tag_${key}`] = value;
    }
  });

  return error;
}

/**
 * Create a tagged error with context
 */
export function createError(message: string, context: ErrorContext): Error {
  return enhanceError(new Error(message), context);
}

/**
 * Extract feature name from function path
 * e.g., "talks:create" → "talks"
 */
export function extractFeature(funcName: string): ErrorContext['feature'] | undefined {
  const match = funcName.match(/^(talks|speakers|collections|users|clips|topics|affiliateLinks):/);
  return match ? (match[1] as ErrorContext['feature']) : undefined;
}
