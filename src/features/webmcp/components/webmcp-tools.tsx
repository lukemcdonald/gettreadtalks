'use client';

import dynamic from 'next/dynamic';

const WebMcpRegistrar = dynamic(
  () =>
    import('@/features/webmcp/components/webmcp-registrar').then(
      (module) => module.WebMcpRegistrar
    ),
  { ssr: false }
);

export function WebMcpTools() {
  return <WebMcpRegistrar />;
}
