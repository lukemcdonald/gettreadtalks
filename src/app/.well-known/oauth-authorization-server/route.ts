import { mcpOAuthMetadataResponse } from '@/features/mcp/oauth';

function handle(request: Request) {
  return (
    mcpOAuthMetadataResponse(request) ?? new Response(null, { status: 404 })
  );
}

export { handle as GET, handle as OPTIONS };
