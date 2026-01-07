import { SidebarNav } from '@/components/layouts/sidebar-nav';
import { UserAvatar } from '@/components/user-avatar';
import { getCurrentUser } from '@/services/auth/server';

const NAV_ITEMS = [
  { href: '/account', label: 'Settings' },
  { href: '/account/favorites', label: 'Favorites' },
  { href: '/account/finished', label: 'Finished' },
];

export async function LayoutSidebar() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <UserAvatar user={user} />

        <p className="flex flex-col truncate">
          <span className="text-muted-foreground text-xs">Signed in as</span>
          <span className="font-semibold text-foreground text-sm">{user.email}</span>
        </p>
      </div>

      <SidebarNav items={NAV_ITEMS} />
    </div>
  );
}
