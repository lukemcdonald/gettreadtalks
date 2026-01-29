import { SidebarNav } from '@/components/layouts/sidebar-nav';
import { UserAvatar } from '@/components/user-avatar';
import { getCurrentUser } from '@/services/auth/server';
import { isAdmin } from '@/services/auth/utils';

const ACCOUNT_NAV_ITEMS = [
  { href: '/account', label: 'Settings' },
  { href: '/account/favorites', label: 'Favorites' },
  { href: '/account/finished', label: 'Finished' },
];

const ADMIN_NAV_ITEMS = [
  { href: '/account/talks', label: 'Talks' },
  { href: '/account/clips', label: 'Clips' },
  { href: '/account/speakers', label: 'Speakers' },
  { href: '/account/topics', label: 'Topics' },
  { href: '/account/collections', label: 'Collections' },
];

export async function LayoutSidebar() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const isAdminUser = isAdmin(user);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <UserAvatar user={user} />

        <p className="flex flex-col truncate">
          <span className="text-muted-foreground text-xs">Signed in as</span>
          <span className="font-semibold text-foreground text-sm">{user.email}</span>
        </p>
      </div>

      <div className="space-y-6">
        <SidebarNav items={ACCOUNT_NAV_ITEMS} />

        {!!isAdminUser && (
          <div className="space-y-3">
            <h3 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Content Management
            </h3>
            <SidebarNav items={ADMIN_NAV_ITEMS} />
          </div>
        )}
      </div>
    </div>
  );
}
