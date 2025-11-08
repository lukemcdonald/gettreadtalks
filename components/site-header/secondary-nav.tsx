import { AccountMenu } from '@/components/site-header/account-menu/account-menu';
import { ModeSwitcher } from '@/components/site-header/mode-switcher';
import { getCurrentUser } from '@/lib/services/auth/server';

export async function SecondaryNav() {
  const initialUser = await getCurrentUser();

  return (
    <div className="flex items-center gap-2">
      <AccountMenu initialUser={initialUser} />
      <ModeSwitcher />
    </div>
  );
}
