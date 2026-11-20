import type { ActionResult } from '@/lib/forms/types';

export function isFailedActionResult(
  result: unknown
): result is Extract<ActionResult<unknown>, { success: false }> {
  return (
    typeof result === 'object' &&
    result !== null &&
    'success' in result &&
    result.success === false
  );
}

export function getActionErrorMessage(
  result: Extract<ActionResult<unknown>, { success: false }>
) {
  return result.errors._form ?? result.errors.root ?? 'An error occurred';
}
