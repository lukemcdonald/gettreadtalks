import type { ReactNode } from 'react';

import { DrawerFooter, DrawerPanel } from '@/components/ui/primitives/drawer';

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
      <div className="flex min-h-0 flex-1 flex-col">
        <DrawerPanel
          className={scrollable ? undefined : 'flex min-h-0 flex-1 flex-col'}
          scrollable={scrollable}
        >
          {children}
        </DrawerPanel>
      </div>

      <DrawerFooter className="overflow-hidden">{footer}</DrawerFooter>
    </>
  );
}
