'use client';

import { useConvex } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { revalidateUserLists } from '@/features/users/actions/revalidate-user-lists';
import { useCurrentUser } from '@/features/users/hooks/use-current-user';

function loadWebMcpTools() {
  return import('@/features/webmcp/tools');
}

export function WebMcpTools() {
  const convex = useConvex();
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const signedIn = !isLoading && user !== null;

  useEffect(() => {
    if (!document.modelContext) {
      return;
    }

    const controller = new AbortController();

    void loadWebMcpTools()
      .then((tools) => {
        if (controller.signal.aborted) {
          return;
        }

        return tools.registerWebMcpTools({
          document,
          navigate: (href) => {
            router.push(href);
          },
          origin: window.location.origin,
          searchTalks: tools.createSearchTalks(convex.query.bind(convex)),
          signal: controller.signal,
        });
      })
      .catch(() => {});

    return () => {
      controller.abort();
    };
  }, [convex, router]);

  useEffect(() => {
    if (!signedIn || !document.modelContext) {
      return;
    }

    const controller = new AbortController();

    void loadWebMcpTools()
      .then((tools) => {
        if (controller.signal.aborted) {
          return;
        }

        return tools.registerSignedInWebMcpTools({
          document,
          mutate: convex.mutation.bind(convex),
          origin: window.location.origin,
          query: convex.query.bind(convex),
          refreshLists: () =>
            revalidateUserLists({
              refreshPage:
                window.location.pathname.startsWith('/account/favorites') ||
                window.location.pathname.startsWith('/account/finished'),
            }),
          signal: controller.signal,
        });
      })
      .catch(() => {});

    return () => {
      controller.abort();
    };
  }, [convex, signedIn]);

  return null;
}
