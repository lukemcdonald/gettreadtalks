import { sha256 } from 'js-sha256';

const MCP_UNAUTHORIZED = {
  ok: false,
  retryAfter: 60_000,
} as const;

export function mcpLimiterToken(secret?: string) {
  if (!secret) {
    return;
  }

  return sha256(`mcp-limiter:${secret}`);
}

export function authorizeMcpLimiter(token: string, secret?: string) {
  const expected = mcpLimiterToken(secret);

  if (!expected || token !== expected) {
    return MCP_UNAUTHORIZED;
  }
}
