import assert from 'node:assert/strict';
import { register } from 'node:module';
import { after, before, describe, test } from 'node:test';

register(new URL('../../../scripts/node-test-hooks.mjs', import.meta.url));

const {
  createMcpAuthMetadataOptions,
  isProtectedMcpToolCall,
  mcpOAuthMetadataResponse,
  mcpResourceUrl,
  PROTECTED_MCP_TOOL,
  publicOrigin,
  withProtectedMcpToolAuth,
} = await import('./oauth.ts');

const ORIGIN = 'https://www.gettreadtalks.com';

function jsonRequest(url: string, body: unknown, headers: HeadersInit = {}) {
  return new Request(url, {
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json, text/event-stream',
      'Content-Type': 'application/json',
      ...headers,
    },
    method: 'POST',
  });
}

describe('publicOrigin', () => {
  test('uses SITE_URL when set', () => {
    const previous = process.env.SITE_URL;
    process.env.SITE_URL = 'https://preview.example.com/';

    try {
      assert.equal(
        publicOrigin(new Request('https://internal.example/mcp')),
        'https://preview.example.com'
      );
    } finally {
      if (previous === undefined) {
        delete process.env.SITE_URL;
      } else {
        process.env.SITE_URL = previous;
      }
    }
  });
});

describe('mcp resource metadata', () => {
  let previousSiteUrl: string | undefined;

  before(() => {
    previousSiteUrl = process.env.SITE_URL;
    delete process.env.SITE_URL;
  });

  after(() => {
    if (previousSiteUrl === undefined) {
      delete process.env.SITE_URL;
    } else {
      process.env.SITE_URL = previousSiteUrl;
    }
  });

  test('names the mcp resource and authorization server', () => {
    const options = createMcpAuthMetadataOptions(ORIGIN);

    assert.equal(options.resourceServerUrl.href, `${ORIGIN}/mcp`);
    assert.equal(options.oauthMetadata.issuer, ORIGIN);
    assert.equal(
      options.oauthMetadata.authorization_endpoint,
      `${ORIGIN}/api/auth/oauth2/authorize`
    );
    assert.equal(
      options.oauthMetadata.token_endpoint,
      `${ORIGIN}/api/auth/oauth2/token`
    );
    assert.deepEqual(options.oauthMetadata.code_challenge_methods_supported, [
      'S256',
    ]);
  });

  test('serves both well-known documents', async () => {
    const resource = mcpOAuthMetadataResponse(
      new Request(`${ORIGIN}/.well-known/oauth-protected-resource`)
    );
    const inserted = mcpOAuthMetadataResponse(
      new Request(`${ORIGIN}/.well-known/oauth-protected-resource/mcp`)
    );
    const authorizationServer = mcpOAuthMetadataResponse(
      new Request(`${ORIGIN}/.well-known/oauth-authorization-server`)
    );

    assert.ok(resource);
    assert.ok(inserted);
    assert.ok(authorizationServer);
    assert.equal(resource.status, 200);
    assert.equal(inserted.status, 200);
    assert.equal(authorizationServer.status, 200);

    const resourceBody = (await resource.json()) as {
      authorization_servers?: string[];
      resource?: string;
    };
    const authorizationBody = (await authorizationServer.json()) as {
      authorization_endpoint?: string;
      issuer?: string;
      token_endpoint?: string;
    };

    assert.equal(resourceBody.resource, `${ORIGIN}/mcp`);
    assert.deepEqual(resourceBody.authorization_servers, [ORIGIN]);
    assert.equal(authorizationBody.issuer, ORIGIN);
    assert.equal(
      authorizationBody.authorization_endpoint,
      `${ORIGIN}/api/auth/oauth2/authorize`
    );
    assert.equal(
      authorizationBody.token_endpoint,
      `${ORIGIN}/api/auth/oauth2/token`
    );
  });
});

describe('protected MCP tool auth', () => {
  test('detects the stub tool call', async () => {
    const request = jsonRequest(`${ORIGIN}/mcp`, {
      id: 1,
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        arguments: {},
        name: PROTECTED_MCP_TOOL,
      },
    });

    assert.equal(await isProtectedMcpToolCall(request), true);
    assert.equal(request.bodyUsed, false);
  });

  test('leaves public catalog calls open', async () => {
    const request = jsonRequest(`${ORIGIN}/mcp`, {
      id: 1,
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        arguments: { query: 'Romans' },
        name: 'search_talks',
      },
    });

    assert.equal(await isProtectedMcpToolCall(request), false);
  });

  test('returns a 401 challenge for the stub without a token', async () => {
    const handler = withProtectedMcpToolAuth(() =>
      Promise.resolve(Response.json({ ok: true }))
    );
    const response = await handler(
      jsonRequest(`${ORIGIN}/mcp`, {
        id: 7,
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          arguments: {},
          name: PROTECTED_MCP_TOOL,
        },
      })
    );
    const challenge = response.headers.get('WWW-Authenticate') ?? '';
    const resourceUrl = mcpResourceUrl(ORIGIN);

    assert.equal(response.status, 401);
    assert.match(challenge, /Bearer/u);
    assert.match(challenge, /resource_metadata=/u);
    assert.match(challenge, /\/\.well-known\/oauth-protected-resource\/mcp/u);
    assert.equal(resourceUrl.href, `${ORIGIN}/mcp`);
  });

  test('does not challenge a public tool', async () => {
    const handler = withProtectedMcpToolAuth(() =>
      Promise.resolve(Response.json({ ok: true }))
    );
    const response = await handler(
      jsonRequest(`${ORIGIN}/mcp`, {
        id: 1,
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          arguments: {},
          name: 'list_speakers',
        },
      })
    );

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
  });
});
