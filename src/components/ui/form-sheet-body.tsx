import type { ReactNode } from 'react';

import { BottomDrawerPanel } from '@/components/ui/bottom-drawer';
import { DrawerFooter } from '@/components/ui/primitives/drawer';

interface FormSheetBodyProps {
  children: ReactNode;
  footer: ReactNode;
  scrollable?: boolean;
}

export function FormSheetBody({
  children,
  footer,
  scrollable = true,
}: FormSheetBodyProps) {
  return (
    <>
      <BottomDrawerPanel scrollable={scrollable}>{children}</BottomDrawerPanel>

      <DrawerFooter className="overflow-hidden">{footer}</DrawerFooter>
    </>
  );
}
