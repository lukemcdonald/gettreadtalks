import type { SearchOverlayProps } from '@/features/search/types';

import {
  CommandDialog,
  CommandDialogPopup,
  CommandPanel,
  DialogTitle,
} from '@/components/ui';

import { HeaderSearchFooter } from './header-search-footer';
import { SearchCommand, SearchCommandField } from './search-command';
import { SearchCommandResults } from './search-command-results';

export function DesktopSearchDialog({
  groups,
  isLoading,
  onOpenChange,
  onSelect,
  onValueChange,
  open,
  status,
  value,
}: SearchOverlayProps) {
  return (
    <CommandDialog onOpenChange={onOpenChange} open={open}>
      <CommandDialogPopup>
        <DialogTitle className="sr-only">Search</DialogTitle>
        <SearchCommand
          groups={groups}
          onInputValueChange={onValueChange}
          value={value}
        >
          <SearchCommandField autoFocus isLoading={isLoading} />
          <CommandPanel>
            <SearchCommandResults
              groups={groups}
              onSelect={onSelect}
              status={status}
            />
          </CommandPanel>
          <HeaderSearchFooter />
        </SearchCommand>
      </CommandDialogPopup>
    </CommandDialog>
  );
}
