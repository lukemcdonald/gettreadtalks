import type { ComponentProps } from 'react';

import { SidebarNavItem } from '@/components/layouts/sidebar-nav-item';

interface SidebarNavProps {
  items: ComponentProps<typeof SidebarNavItem>[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-2">
      {items.map(({ icon, href, label }) => (
        <SidebarNavItem href={href} icon={icon} key={href} label={label} />
      ))}
    </nav>
  );
}
