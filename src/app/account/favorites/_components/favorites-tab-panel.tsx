import type { ReactNode } from 'react';

import { TabsPanel } from '@/components/ui';
import { AccountTable } from '../../_components/account-table';

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
