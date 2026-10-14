import type { EventMap } from '@/services/analytics/events';

import { createHash } from 'node:crypto';

const CLIENT_INFO_MAX = 500;
const CLIENT_INFO_META_KEY = 'io.modelcontextprotocol/clientInfo';
const CLIENT_INFO_TTL_MS = 60 * 60 * 1000;
const LIST_RESULT_KEYS: Record<string, string> = {
  get_collection: 'talks',
  list_clips: 'clips',
  list_collections: 'collections',
  list_speakers: 'speakers',
  list_topics: 'topics',
  search_talks: 'talks',
};

interface McpClientInfo {
  name?: string;
  version?: string;
}

interface CachedClientInfo extends McpClientInfo {
  expiresAt: number;
}

interface McpRequestPeek {
  clientInfo?: McpClientInfo;
  query?: string;
  toolName?: string;
}

interface McpToolCallInput {
  clientName?: string;
  clientVersion?: string;
  durationMs: number;
  error?: string;
  query?: string;
  resultCount?: number;
  success: boolean;
  toolName: string;
  userAgent?: string;
}

type McpAnalyticsSchedule = (
  build: () => Promise<{
    anonymousId: string;
    event: 'mcp_tool_called';
    properties: EventMap['mcp_tool_called'];
  }>
) => void;

const clientInfoByAnonymousId = new Map<string, CachedClientInfo>();

function sha256Hex(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

function asNonEmptyString(value: unknown) {
  if (typeof value !== 'string') {
    return;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return;
  }

  return trimmed;
}

function asRecord(value: unknown) {
  if (!value || typeof value !== 'object') {
    return;
  }

  return value as Record<string, unknown>;
}

function httpOutcome(httpOk: boolean) {
  return {
    error: httpOk ? undefined : 'http_error',
    resultCount: undefined,
    success: httpOk,
  };
}

function readClientInfo(value: unknown): McpClientInfo | undefined {
  if (!value || typeof value !== 'object') {
    return;
  }

  const record = value as Record<string, unknown>;
  const name = asNonEmptyString(record.name);
  const version = asNonEmptyString(record.version);

  if (!(name || version)) {
    return;
  }

  return {
    name,
    version,
  };
}

function clientInfoFromParams(params: Record<string, unknown> | undefined) {
  if (!params) {
    return;
  }

  const meta =
    params._meta && typeof params._meta === 'object'
      ? (params._meta as Record<string, unknown>)
      : undefined;

  return (
    readClientInfo(meta?.[CLIENT_INFO_META_KEY]) ??
    readClientInfo(params.clientInfo)
  );
}

function readSearchTerm(args: Record<string, unknown> | undefined) {
  if (!args) {
    return;
  }

  return asNonEmptyString(args.query) ?? asNonEmptyString(args.search);
}

function requestFingerprint(request: Request) {
  const sessionId = request.headers.get('mcp-session-id')?.trim();

  if (sessionId) {
    return `session:${sessionId}`;
  }

  const ip =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'anonymous';
  const userAgent = request.headers.get('user-agent') ?? '';

  return `ip:${ip}\nua:${userAgent}`;
}

function mcpAnonymousId(request: Request) {
  return `mcp:${sha256Hex(requestFingerprint(request)).slice(0, 32)}`;
}

function rememberMcpClientInfo(anonymousId: string, info: McpClientInfo) {
  if (!(info.name || info.version)) {
    return;
  }

  clientInfoByAnonymousId.delete(anonymousId);
  clientInfoByAnonymousId.set(anonymousId, {
    expiresAt: Date.now() + CLIENT_INFO_TTL_MS,
    name: info.name,
    version: info.version,
  });

  while (clientInfoByAnonymousId.size > CLIENT_INFO_MAX) {
    const oldest = clientInfoByAnonymousId.keys().next().value;

    if (oldest === undefined) {
      break;
    }

    clientInfoByAnonymousId.delete(oldest);
  }
}

function getMcpClientInfo(anonymousId: string) {
  const cached = clientInfoByAnonymousId.get(anonymousId);

  if (!cached) {
    return;
  }

  if (cached.expiresAt <= Date.now()) {
    clientInfoByAnonymousId.delete(anonymousId);

    return;
  }

  return {
    name: cached.name,
    version: cached.version,
  };
}

function parseJsonRecord(text: string) {
  let value: unknown;

  try {
    value = JSON.parse(text);
  } catch {
    value = null;
  }

  return asRecord(value);
}

function peekFromRpc(rpc: Record<string, unknown>): McpRequestPeek {
  const params = asRecord(rpc.params);
  const clientInfo = clientInfoFromParams(params);

  if (rpc.method !== 'tools/call') {
    return { clientInfo };
  }

  return {
    clientInfo,
    query: readSearchTerm(asRecord(params?.arguments)),
    toolName: asNonEmptyString(params?.name),
  };
}

async function peekMcpRequest(
  request: Request
): Promise<McpRequestPeek | undefined> {
  if (request.method !== 'POST') {
    return;
  }

  const rpc = asRecord(
    await request
      .clone()
      .json()
      .catch(() => null)
  );

  if (!rpc) {
    return;
  }

  return peekFromRpc(rpc);
}

function parseMcpJsonRpc(text: string) {
  const jsonLine = text
    .split('\n')
    .map((line) => line.replace(/^data:\s*/u, '').trim())
    .find((line) => line.startsWith('{'));

  if (!jsonLine) {
    return;
  }

  return parseJsonRecord(jsonLine);
}

function parseToolPayload(result: Record<string, unknown>) {
  const { content } = result;

  if (!Array.isArray(content)) {
    return;
  }

  const text = asNonEmptyString(asRecord(content[0])?.text);

  if (!text) {
    return;
  }

  return parseJsonRecord(text);
}

function resultCountFromPayload(
  payload: Record<string, unknown> | undefined,
  toolName: string
) {
  if (!payload) {
    return;
  }

  const listKey = LIST_RESULT_KEYS[toolName];

  if (listKey) {
    const value = payload[listKey];

    if (Array.isArray(value)) {
      return value.length;
    }

    return;
  }

  if (toolName === 'get_clip' || toolName === 'get_talk') {
    return 1;
  }
}

function failedOutcome(error: string, resultCount?: number) {
  return {
    error,
    resultCount,
    success: false,
  };
}

function toolResultOutcome(
  toolResult: Record<string, unknown>,
  httpOk: boolean,
  toolName: string
) {
  const payload = parseToolPayload(toolResult);

  if (toolResult.isError) {
    return failedOutcome(asNonEmptyString(payload?.error) ?? 'tool_error', 0);
  }

  return {
    error: undefined,
    resultCount: resultCountFromPayload(payload, toolName),
    success: httpOk,
  };
}

function mcpToolCallOutcome(text: string, httpOk: boolean, toolName: string) {
  const rpc = parseMcpJsonRpc(text);
  const rpcError = asRecord(rpc?.error);

  if (rpcError) {
    return failedOutcome(asNonEmptyString(rpcError.message) ?? 'rpc_error');
  }

  const toolResult = asRecord(rpc?.result);

  if (!(rpc && toolResult)) {
    return httpOutcome(httpOk);
  }

  return toolResultOutcome(toolResult, httpOk, toolName);
}

export function mcpToolCallProperties(
  input: McpToolCallInput
): EventMap['mcp_tool_called'] {
  return {
    client_name: input.clientName,
    client_version: input.clientVersion,
    duration_ms: input.durationMs,
    error: input.error,
    query: input.query,
    result_count: input.resultCount,
    success: input.success,
    tool_name: input.toolName,
    user_agent: input.userAgent,
  };
}

export function createMcpAnalyticsHandler(
  handler: (request: Request) => Promise<Response>,
  schedule: McpAnalyticsSchedule
) {
  return async (request: Request) => {
    const peek = await peekMcpRequest(request);
    const anonymousId = mcpAnonymousId(request);

    if (peek?.clientInfo) {
      rememberMcpClientInfo(anonymousId, peek.clientInfo);
    }

    const startedAt = performance.now();
    const response = await handler(request);

    const toolName = peek?.toolName;

    if (!toolName) {
      return response;
    }

    try {
      const durationMs = Math.round(performance.now() - startedAt);
      const responseBody = response.clone();
      const clientInfo = peek.clientInfo ?? getMcpClientInfo(anonymousId);
      const userAgent = request.headers.get('user-agent') ?? undefined;

      schedule(async () => {
        const outcome = mcpToolCallOutcome(
          await responseBody.text(),
          response.ok,
          toolName
        );

        return {
          anonymousId,
          event: 'mcp_tool_called',
          properties: mcpToolCallProperties({
            clientName: clientInfo?.name,
            clientVersion: clientInfo?.version,
            durationMs,
            error: outcome.error,
            query: peek.query,
            resultCount: outcome.resultCount,
            success: outcome.success,
            toolName,
            userAgent,
          }),
        };
      });
    } catch {
      return response;
    }

    return response;
  };
}
