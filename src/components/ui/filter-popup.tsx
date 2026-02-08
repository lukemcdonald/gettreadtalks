import { SearchIcon } from 'lucide-react';

import {
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
} from '@/components/ui';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterPopupProps {
  label?: string;
  name: string;
}

/**
 * Shared ComboboxPopup with search at top (industry standard UX).
 * Used by both InlineMultiFilter and ComboboxMultiFilter.
 */
export function FilterPopup({ label, name }: FilterPopupProps) {
  return (
    <ComboboxPopup aria-label={label ?? `Select ${name}`}>
      <div className="border-b p-2">
        <ComboboxInput
          className="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
          placeholder={`Search ${name}...`}
          showTrigger={false}
          startAddon={<SearchIcon />}
        />
      </div>
      <ComboboxEmpty>No items found.</ComboboxEmpty>
      <ComboboxList>
        {(option: FilterOption) => (
          <ComboboxItem key={option.value} value={option}>
            {option.label}
          </ComboboxItem>
        )}
      </ComboboxList>
    </ComboboxPopup>
  );
}
