import type {
  CommandSearchGroup,
  CommandSearchItem,
  HeaderSearchStatus,
} from '@/features/search/types';

import {
  CommandCollection,
  CommandGroup,
  CommandGroupLabel,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui';
import { VIEW_ALL_SEARCH_GROUP } from '@/features/search/utils';

function SearchCommandItem({
  item,
  onSelect,
}: {
  item: CommandSearchItem;
  onSelect: (item: CommandSearchItem) => void;
}) {
  return (
    <CommandItem
      className="-mx-2 px-4"
      onClick={() => {
        onSelect(item);
      }}
      value={item.value}
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <span>{item.label}</span>
        {!!item.subtitle && (
          <span className="text-muted-foreground text-sm">{item.subtitle}</span>
        )}
      </span>
    </CommandItem>
  );
}

function SearchCommandStatus({ status }: { status: HeaderSearchStatus }) {
  if (status !== 'empty') {
    return null;
  }

  return (
    <p className="text-muted-foreground px-2 py-6 text-center text-sm">
      No results
    </p>
  );
}

function SearchCommandGroup({
  group,
  onSelect,
}: {
  group: CommandSearchGroup;
  onSelect: (item: CommandSearchItem) => void;
}) {
  return (
    <>
      <CommandGroup items={group.items}>
        {group.value === VIEW_ALL_SEARCH_GROUP ? null : (
          <CommandGroupLabel>{group.value}</CommandGroupLabel>
        )}
        <CommandCollection>
          {(item: CommandSearchItem) => (
            <SearchCommandItem
              item={item}
              key={item.value}
              onSelect={onSelect}
            />
          )}
        </CommandCollection>
      </CommandGroup>
      <CommandSeparator />
    </>
  );
}

export function SearchCommandResults({
  groups,
  onSelect,
  status,
}: {
  groups: CommandSearchGroup[];
  onSelect: (item: CommandSearchItem) => void;
  status: HeaderSearchStatus;
}) {
  return (
    <>
      <SearchCommandStatus status={status} />
      {groups.length > 0 ? (
        <CommandList className="h-full">
          {(group: CommandSearchGroup) => (
            <SearchCommandGroup
              group={group}
              key={group.value}
              onSelect={onSelect}
            />
          )}
        </CommandList>
      ) : null}
    </>
  );
}
