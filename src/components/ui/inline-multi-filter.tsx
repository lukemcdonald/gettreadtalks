'use client';

import type { ReactNode } from 'react';

import { useTransition } from 'react';
import { ChevronsUpDown, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Badge, Button, Combobox, ComboboxTrigger, Group, GroupSeparator } from '@/components/ui';
import { FilterPopup } from '@/components/ui/filter-popup';

interface FilterOption {
  label: string;
  value: string;
}

interface InlineMultiFilterProps {
  label?: string;
  name: string;
  options: FilterOption[];
  placeholder?: string;
  startAddon?: ReactNode;
}

/**
 * Inline multi-select filter with compact Group-based design.
 * Shows first selected item + "+N" badge for remaining count.
 * Perfect for embedding in description text or inline contexts.
 */
export function InlineMultiFilter({
  label,
  name,
  options,
  placeholder = 'Select...',
  startAddon,
}: InlineMultiFilterProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const searchParamValue = searchParams.get(name);
  const selectedValues = searchParamValue
    ? searchParamValue.split(',').filter((v) => options.some((opt) => opt.value === v))
    : [];

  const selectedOptions = selectedValues
    .map((value) => options.find((opt) => opt.value === value))
    .filter((opt): opt is FilterOption => opt !== undefined);

  const handleChange = (newValue: FilterOption[] | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newValue && newValue.length > 0) {
      params.set(name, newValue.map((opt) => opt.value).join(','));
    } else {
      params.delete(name);
    }

    params.delete('cursor');

    startTransition(() => {
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(name);
    params.delete('cursor');
    startTransition(() => {
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  };

  const renderTriggerContent = () => {
    if (selectedOptions.length === 0) {
      return placeholder;
    }
    const firstOption = selectedOptions[0];
    const remainingCount = selectedOptions.length - 1;

    return (
      <div className="flex items-center gap-2">
        <span className="truncate">{firstOption?.label}</span>
        {remainingCount > 0 && (
          <Badge className="tabular-nums" variant="secondary">
            +{remainingCount}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <span className="inline-flex align-middle">
      <Group>
        <Combobox
          autoHighlight
          disabled={isPending}
          items={options}
          multiple
          onValueChange={handleChange}
          value={selectedOptions}
        >
          <ComboboxTrigger
            render={
              <Button
                className={selectedOptions.length === 0 ? 'justify-between' : undefined}
                size="sm"
                variant="outline"
              />
            }
          >
            {startAddon}
            {renderTriggerContent()}
            {selectedOptions.length === 0 && <ChevronsUpDown className="-me-1!" />}
          </ComboboxTrigger>
          <FilterPopup label={label} name={name} />
        </Combobox>
        {selectedOptions.length > 0 && (
          <>
            <GroupSeparator />
            <Button
              aria-label={`Clear ${name} filter`}
              disabled={isPending}
              onClick={handleClear}
              size="icon-sm"
              variant="outline"
            >
              <X />
            </Button>
          </>
        )}
      </Group>
    </span>
  );
}
