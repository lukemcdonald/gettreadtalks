'use client';

import dynamic from 'next/dynamic';

import { HeaderSearchFallback } from '@/features/search/components/header-search/header-search';

const HeaderSearchLive = dynamic(
  () =>
    import('@/features/search/components/header-search/header-search-live').then(
      (mod) => mod.HeaderSearchLive
    ),
  {
    loading: () => <HeaderSearchFallback />,
    ssr: false,
  }
);

export function HeaderSearchIsland() {
  return <HeaderSearchLive />;
}
