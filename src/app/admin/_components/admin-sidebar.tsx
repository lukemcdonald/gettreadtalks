'use client';

import {
  ClipboardListIcon,
  FolderIcon,
  LayoutDashboardIcon,
  MicIcon,
  TagIcon,
  VideoIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SidebarContent } from '@/components/sidebar-content';
import { cn } from '@/utils';

const adminNavItems = [
  {
    href: '/admin',
    icon: LayoutDashboardIcon,
    label: 'Dashboard',
  },
  {
    href: '/admin/talks',
    icon: MicIcon,
    label: 'Talks',
  },
  {
    href: '/admin/clips',
    icon: VideoIcon,
    label: 'Clips',
  },
  {
    href: '/admin/speakers',
    icon: ClipboardListIcon,
    label: 'Speakers',
  },
  {
    href: '/admin/topics',
    icon: TagIcon,
    label: 'Topics',
  },
  {
    href: '/admin/collections',
    icon: FolderIcon,
    label: 'Collections',
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <SidebarContent>
      <div className="space-y-1">
        <h3 className="mb-4 px-3 font-semibold text-muted-foreground text-sm">Admin</h3>
        <nav className="space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                href={item.href}
                key={item.href}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </SidebarContent>
  );
}
