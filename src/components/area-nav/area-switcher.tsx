'use client';

import { usePathname } from 'next/navigation';

import { Link } from '@/components/ui/link';
import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { ACCOUNT_PATH, MANAGE_PATH } from '@/lib/entities/paths';
import { isAdmin } from '@/services/auth/utils';
import { cn } from '@/utils';

const AREAS = [
  { href: ACCOUNT_PATH, label: 'Account' },
  { href: MANAGE_PATH, label: 'Manage' },
] as const;

function isAreaActive(href: string, pathname: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AreaSwitcher() {
  const pathname = usePathname();
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading || !isAdmin(user)) {
    return null;
  }

  return (
    <nav aria-label="Areas">
      <ul className="bg-muted grid grid-cols-2 rounded-lg p-1">
        {AREAS.map((area) => {
          const isActive = isAreaActive(area.href, pathname);

          return (
            <li key={area.href}>
              <Link
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium',
                  isActive
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                href={area.href}
              >
                {area.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
