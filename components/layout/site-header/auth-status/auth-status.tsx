'use client';

import type { User } from '@/lib/services/auth/types';

import { useAuthUser } from '@/lib/features/users/hooks';

import AuthenticatedContent from './authenticated-content';
import UnauthenticatedContent from './unauthenticated-content';

interface AuthStatusProps {
  initialUser?: User;
}

function AuthStatus({ initialUser }: AuthStatusProps) {
  const { data: user } = useAuthUser(initialUser);

  if (!user) {
    return <UnauthenticatedContent />;
  }

  return <AuthenticatedContent user={user} />;
}

export default AuthStatus;
