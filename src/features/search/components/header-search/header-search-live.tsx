'use client';

import { AuthProvider } from '@/components/auth-provider';
import { HeaderSearch } from '@/features/search/components/header-search/header-search';

export function HeaderSearchLive() {
  return (
    <AuthProvider>
      <HeaderSearch />
    </AuthProvider>
  );
}
