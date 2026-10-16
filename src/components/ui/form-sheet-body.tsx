import type { ReactNode } from 'react';

import { DrawerFooter, DrawerPanel } from '@/components/ui/primitives/drawer';

interface FormSheetBodyProps {
  children: ReactNode;
  footer: ReactNode;
}

export function FormSheetBody({ children, footer }: FormSheetBodyProps) {
  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col">
        <DrawerPanel>{children}</DrawerPanel>
      </div>

      <DrawerFooter className="overflow-hidden">{footer}</DrawerFooter>
    </>
  );
}
