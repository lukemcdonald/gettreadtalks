'use client';

import { useConvex } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function loadWebMcpTools() {
  return import('@/features/webmcp/tools');
}

export function WebMcpTools() {
  const convex = useConvex();
  const router = useRouter();

  useEffect(() => {
    if (!document.modelContext) {
      return;
    }

    const controller = new AbortController();

    void loadWebMcpTools()
      .then(({ createSearchTalks, registerWebMcpTools }) =>
        registerWebMcpTools({
          document,
          navigate: (href) => {
            router.push(href);
          },
          origin: window.location.origin,
          searchTalks: createSearchTalks(convex.query),
          signal: controller.signal,
        })
      )
      .catch(() => {});

    return () => {
      controller.abort();
    };
  }, [convex, router]);

  return null;
}
