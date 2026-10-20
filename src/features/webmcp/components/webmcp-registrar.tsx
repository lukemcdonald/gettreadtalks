'use client';

import { useConvex } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { api } from '@/convex/_generated/api';
import { registerDocumentWebMcpTools } from '@/features/webmcp/register-tools';

export function WebMcpRegistrar() {
  const convex = useConvex();
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();

    void registerDocumentWebMcpTools({
      document,
      navigate: (href) => {
        router.push(href);
      },
      origin: window.location.origin,
      searchSite: (args) => convex.query(api.search.searchSite, args),
      signal: controller.signal,
    }).catch(() => {});

    return () => {
      controller.abort();
    };
  }, [convex, router]);

  return null;
}
