import { track } from '@/services/analytics';

function getErrorCode(result: object) {
  if ('code' in result && typeof result.code === 'string') {
    return result.code;
  }
}

function getResultCount(result: object) {
  if ('talks' in result && Array.isArray(result.talks)) {
    return result.talks.length;
  }
}

export function withToolTracking<H>(toolName: string, execute: H): H {
  return (async (...args: unknown[]) => {
    try {
      const result = (await (execute as (...inner: unknown[]) => unknown)(
        ...args
      )) as object;
      const error = getErrorCode(result);
      const resultCount = getResultCount(result);

      track('webmcp_tool_called', {
        ...(error ? { error } : {}),
        ...(resultCount === undefined ? {} : { result_count: resultCount }),
        success: !('error' in result),
        tool_name: toolName,
      });

      return result;
    } catch (error) {
      track('webmcp_tool_called', {
        error: error instanceof Error ? error.message : 'tool_error',
        success: false,
        tool_name: toolName,
      });

      throw error;
    }
  }) as H;
}
