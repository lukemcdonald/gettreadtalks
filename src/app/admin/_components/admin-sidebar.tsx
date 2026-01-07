import { SidebarNav } from '@/components/layouts/sidebar-nav';
import { SidebarContent } from '@/components/sidebar-content';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Talks', href: '/admin/talks' },
  { label: 'Clips', href: '/admin/clips' },
  { label: 'Speakers', href: '/admin/speakers' },
  { label: 'Topics', href: '/admin/topics' },
  { label: 'Collections', href: '/admin/collections' },
];

export function AdminSidebar() {
  return (
    <SidebarContent>
      <SidebarNav items={NAV_ITEMS} />
    </SidebarContent>
  );
}
