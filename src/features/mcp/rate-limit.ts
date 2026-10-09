import { createHash } from 'node:crypto';

import { getClientIp } from '../../../convex/lib/clientIp.ts';

export interface McpRateLimitResult {
  ok: boolean;
  retryAfter: number | null;
}

export type ConsumeMcpRateLimit = (
  request: Request
) => Promise<McpRateLimitResult>;

const MCP_CORS_HEADERS = {
  'Access-Control-Allow-Headers':
    'Accept, Authorization, Content-Type, Last-Event-ID, MCP-Protocol-Version, MCP-Session-Id',
  'Access-Control-Allow-Methods': 'DELETE, GET, OPTIONS, POST',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Expose-Headers': 'MCP-Session-Id, WWW-Authenticate',
  'Access-Control-Max-Age': '86400',
};

function sha256Hex(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export function mcpLimiterToken(secret: string | undefined) {
  if (!secret) {
    return;
  }

  return sha256Hex(`mcp-limiter:${secret}`);
}

export function mcpRateLimitKey(request: Request, secret?: string) {
  const ip = getClientIp(request);

  if (!secret) {
    return ip;
  }

  return sha256Hex(`mcp:${secret}:${ip}`);
}

export function withMcpCors(response: Response) {
  const headers = new Headers(response.headers);

  for (const [key, value] of Object.entries(MCP_CORS_HEADERS)) {
    headers.set(key, value);
  }

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

export function createMcpRateLimitedHandler(
  handler: (request: Request) => Promise<Response>,
  consume: ConsumeMcpRateLimit
) {
  return async (request: Request) => {
    let limit: McpRateLimitResult;

    try {
      limit = await consume(request);
    } catch {
      limit = { ok: true, retryAfter: null };
    }

    if (!limit.ok) {
      const retryAfterSeconds = Math.ceil((limit.retryAfter ?? 60_000) / 1000);

      return withMcpCors(
        Response.json(
          { error: 'Rate limit exceeded' },
          {
            headers: {
              'Retry-After': String(retryAfterSeconds),
            },
            status: 429,
          }
        )
      );
    }

    return withMcpCors(await handler(request));
  };
}
