import { AccountMenu } from '@/components/site-header/account-menu/account-menu';
import { getCurrentUser } from '@/services/auth/server';

/**
 * Async server component that fetches auth state for the account menu.
 * Isolated from the main header to enable granular Suspense boundaries.
 */
export async function AccountMenuServer() {
  const user = await getCurrentUser();
  return <AccountMenu initialUser={user ?? undefined} />;
}
