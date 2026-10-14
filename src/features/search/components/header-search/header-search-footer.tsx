import { ArrowDownIcon, ArrowUpIcon, CornerDownLeftIcon } from 'lucide-react';

import { CommandFooter, Kbd, KbdGroup } from '@/components/ui';

export function HeaderSearchFooter() {
  return (
    <CommandFooter>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <KbdGroup>
            <Kbd>
              <ArrowUpIcon />
            </Kbd>
            <Kbd>
              <ArrowDownIcon />
            </Kbd>
          </KbdGroup>
          <span>Navigate</span>
        </div>
        <div className="flex items-center gap-2">
          <Kbd>
            <CornerDownLeftIcon />
          </Kbd>
          <span>Open</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Kbd>Esc</Kbd>
        <span>Close</span>
      </div>
    </CommandFooter>
  );
}
