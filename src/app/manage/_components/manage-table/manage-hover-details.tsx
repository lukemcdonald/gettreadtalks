export interface ManageHoverItem {
  label: string;
  value?: boolean | number | string | null;
}

export function getHoverItems(items: readonly ManageHoverItem[]) {
  return items.flatMap(({ label, value }) => {
    if (typeof value === 'number') {
      return [{ label, value: String(value) }];
    }

    if (value === true) {
      return [{ label, value: 'Yes' }];
    }

    if (typeof value === 'string' && value.length > 0) {
      return [{ label, value }];
    }

    return [];
  });
}

export function ManageHoverDetails({
  items,
}: {
  items: readonly { label: string; value: string }[];
}) {
  return (
    <dl className="flex w-full flex-col gap-2">
      {items.map(({ label, value }) => (
        <div key={label}>
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
