import type { AuthMetadataOptions } from '@modelcontextprotocol/server';

import {
  getOAuthProtectedResourceMetadataUrl,
  OAuthError,
  OAuthErrorCode,
  oauthMetadataResponse,
  requireBearerAuth,
} from '@modelcontextprotocol/server';

const MCP_SCOPES = [
  'favorites:read',
  'favorites:write',
  'offline_access',
  'openid',
  'profile',
  'profile:read',
  'profile:write',
] as const;

export const PROTECTED_MCP_TOOL = 'whoami';

export function publicOrigin(request: Request) {
  const siteUrl = process.env.SITE_URL;

  if (siteUrl) {
    return siteUrl.replace(/\/$/u, '');
  }

  return new URL(request.url).origin;
}

export function mcpResourceUrl(origin: string) {
  return new URL('/mcp', `${origin}/`);
}

export function createMcpAuthMetadataOptions(
  origin: string
): AuthMetadataOptions {
  const authorizationServer = `${origin}/api/auth`;
  const insecure = !origin.startsWith('https://');

  return {
    dangerouslyAllowInsecureIssuerUrl: insecure,
    oauthMetadata: {
      authorization_endpoint: `${authorizationServer}/oauth2/authorize`,
      code_challenge_methods_supported: ['S256'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      issuer: origin,
      response_types_supported: ['code'],
      scopes_supported: [...MCP_SCOPES],
      token_endpoint: `${authorizationServer}/oauth2/token`,
      token_endpoint_auth_methods_supported: ['none'],
    },
    resourceName: 'TREAD Talks',
    resourceServerUrl: mcpResourceUrl(origin),
    scopesSupported: [...MCP_SCOPES],
  };
}

function stripTrailingSlash(path: string) {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
}

export function mcpOAuthMetadataResponse(request: Request) {
  const options = createMcpAuthMetadataOptions(publicOrigin(request));
  const url = new URL(request.url);
  const path = stripTrailingSlash(url.pathname);

  if (path === '/.well-known/oauth-protected-resource') {
    url.pathname = '/.well-known/oauth-protected-resource/mcp';

    return oauthMetadataResponse(new Request(url, request), options);
  }

  return oauthMetadataResponse(request, options);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function isProtectedMcpToolCall(request: Request) {
  if (request.method !== 'POST') {
    return false;
  }

  let body: unknown;

  try {
    body = await request.clone().json();
  } catch {
    return false;
  }

  if (!isRecord(body) || body.method !== 'tools/call') {
    return false;
  }

  const { params } = body;

  return isRecord(params) && params.name === PROTECTED_MCP_TOOL;
}

export function withProtectedMcpToolAuth(
  handler: (request: Request) => Promise<Response>
) {
  return async (request: Request) => {
    if (!(await isProtectedMcpToolCall(request))) {
      return handler(request);
    }

    const resourceUrl = mcpResourceUrl(publicOrigin(request));
    const auth = await requireBearerAuth({
      expectedResource: resourceUrl,
      resourceMetadataUrl: getOAuthProtectedResourceMetadataUrl(resourceUrl),
      requiredScopes: ['profile:read'],
      verifier: {
        verifyAccessToken: () =>
          Promise.reject(
            new OAuthError(
              OAuthErrorCode.InvalidToken,
              'MCP access tokens are not issued yet.'
            )
          ),
      },
    })(request);

    if (auth instanceof Response) {
      return auth;
    }

    return handler(request);
  };
}
