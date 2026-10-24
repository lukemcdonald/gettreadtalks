import { track } from '@/services/analytics';

function getErrorCode(result: object) {
  if ('code' in result && typeof result.code === 'string') {
    return result.code;
  }
}

export function withToolTracking<H>(toolName: string, execute: H): H {
  return (async (...args: unknown[]) => {
    try {
      const result = (await (execute as (...inner: unknown[]) => unknown)(
        ...args
      )) as object;
      const error = getErrorCode(result);

      track('webmcp_tool_called', {
        ...(error ? { error } : {}),
        success: !('error' in result),
        tool_name: toolName,
      });

      return result;
    } catch (error) {
      track('webmcp_tool_called', {
        error: 'exception',
        success: false,
        tool_name: toolName,
      });

      throw error;
    }
  }) as H;
}
