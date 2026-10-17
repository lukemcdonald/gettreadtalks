import type { ReactNode } from 'react';

import { AccountTable } from '@/app/account/_components/account-table';
import { TabsPanel } from '@/components/ui';

interface FavoritesTabPanelProps<T> {
  items: T[];
  label: string;
  renderItem: (item: T) => ReactNode;
  value: string;
}

export function FavoritesTabPanel<T>({
  items,
  label,
  renderItem,
  value,
}: FavoritesTabPanelProps<T>) {
  if (items.length === 0) {
    return null;
  }

  return (
    <TabsPanel value={value}>
      <AccountTable label={label}>{items.map(renderItem)}</AccountTable>
    </TabsPanel>
  );
}
