import type { User } from '@/services/auth/types';

export function getCurrentUserQueryArgs(isAuthenticated: boolean) {
  return isAuthenticated ? {} : 'skip';
}

export function getCurrentUserState({
  data,
  initialData,
  isAuthenticated,
  isAuthLoading,
}: {
  data: User | null | undefined;
  initialData?: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
}) {
  // A skipped query stays `undefined`. Signed-out visitors are ready once
  // auth has finished; only signed-in visitors wait for query data.
  const isClientReady =
    !isAuthLoading && (!isAuthenticated || data !== undefined);

  return {
    data: isClientReady ? (data ?? null) : (initialData ?? null),
    isLoading: !isClientReady && initialData === undefined,
  };
}
