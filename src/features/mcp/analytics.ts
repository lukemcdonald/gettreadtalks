import type { EventMap } from '@/services/analytics/events';

import { randomUUID } from 'node:crypto';

import { scheduleServerTrack } from '@/services/analytics/server';

interface ToolArgs {
  query?: unknown;
  search?: unknown;
}

interface ToolExtra {
  http?: { req?: Request };
  sessionId?: string;
}

function text(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function buildMcpToolCallProperties({
  durationMs: duration_ms,
  error,
  query,
  success,
  toolName: tool_name,
  userAgent: user_agent,
}: {
  durationMs: number;
  error?: string;
  query?: string;
  success: boolean;
  toolName: string;
  userAgent?: string;
}): EventMap['mcp_tool_called'] {
  return {
    duration_ms,
    error,
    query,
    success,
    tool_name,
    user_agent,
  };
}

export function withToolTracking<H>(toolName: string, handler: H): H {
  return (async (args: ToolArgs, extra: ToolExtra = {}) => {
    const startedAt = performance.now();
    const finish = (success: boolean, error?: string) =>
      scheduleServerTrack(() =>
        Promise.resolve({
          anonymousId: extra.sessionId ?? randomUUID(),
          event: 'mcp_tool_called',
          properties: buildMcpToolCallProperties({
            durationMs: Math.round(performance.now() - startedAt),
            error,
            query: text(args.query) ?? text(args.search),
            success,
            toolName,
            userAgent: extra.http?.req?.headers.get('user-agent') ?? undefined,
          }),
        })
      );

    try {
      const result = await (
        handler as (
          a: ToolArgs,
          e?: ToolExtra
        ) => Promise<{ isError?: boolean }>
      )(args, extra);
      finish(!result.isError, result.isError ? 'tool_error' : undefined);

      return result;
    } catch (error) {
      finish(false, 'exception');
      throw error;
    }
  }) as H;
}
