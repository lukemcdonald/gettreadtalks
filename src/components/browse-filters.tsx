import type { ReactNode } from 'react';

import { MobileFilterDrawer, SearchInput } from '@/components/ui';

import { SidebarContent } from './sidebar-content';

interface BrowseFiltersSearch {
  paramName?: string;
  placeholder: string;
}

interface BrowseFiltersProps {
  children: ReactNode;
  search?: BrowseFiltersSearch;
}

interface BrowseFilterPaneProps {
  children: ReactNode;
  search?: BrowseFiltersSearch;
}

function BrowseSearch({
  className,
  label,
  search,
}: {
  className?: string;
  label?: string;
  search: BrowseFiltersSearch;
}) {
  return (
    <SearchInput
      className={className}
      label={label}
      paramName={search.paramName}
      placeholder={search.placeholder}
    />
  );
}

function MobileBrowseFilters({ children, search }: BrowseFilterPaneProps) {
  return (
    <div className={search ? 'flex items-center gap-2 md:hidden' : 'md:hidden'}>
      {search ? <BrowseSearch className="flex-1" search={search} /> : null}
      <MobileFilterDrawer variant={search ? 'icon' : 'default'}>
        {children}
      </MobileFilterDrawer>
    </div>
  );
}

function DesktopBrowseFilters({ children, search }: BrowseFilterPaneProps) {
  return (
    <div className="hidden md:flex md:flex-col md:gap-4">
      {search ? <BrowseSearch label="Search" search={search} /> : null}
      {children}
    </div>
  );
}

/**
 * Responsive browse-page filters: inline search + icon drawer on mobile,
 * full sidebar on desktop. Omit `search` for filter-only pages.
 */
export function BrowseFilters({ children, search }: BrowseFiltersProps) {
  return (
    <SidebarContent className="space-y-4">
      <MobileBrowseFilters search={search}>{children}</MobileBrowseFilters>
      <DesktopBrowseFilters search={search}>{children}</DesktopBrowseFilters>
    </SidebarContent>
  );
}
