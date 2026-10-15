'use client';

import type { ReactNode } from 'react';

import dynamic from 'next/dynamic';

const AuthProvider = dynamic(() =>
  import('@/components/auth-provider').then((mod) => mod.AuthProvider)
);

export function AuthProviderLoader({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
