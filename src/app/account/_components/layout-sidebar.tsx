import { LayoutSidebarNav } from '@/app/account/_components/layout-sidebar-nav';
import { UserAvatar } from '@/components/user-avatar';
import { getCurrentUser } from '@/services/auth/server';

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

      <LayoutSidebarNav />
    </div>
  );
}
