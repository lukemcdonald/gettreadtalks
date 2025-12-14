import type { StatusType } from '@/convex/lib/validators/shared';

import {
  Label,
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';

type StatusSelectFieldProps = {
  defaultValue?: StatusType;
  onChange?: (value: StatusType) => void;
  value?: StatusType;
};

export function StatusSelectField({
  defaultValue = 'backlog',
  onChange,
  value,
}: StatusSelectFieldProps) {
  const items = [
    { label: 'Approved', value: 'approved' },
    { label: 'Archived', value: 'archived' },
    { label: 'Backlog', value: 'backlog' },
    { label: 'Published', value: 'published' },
  ];

  return (
    <div>
      <Label htmlFor="status">Status</Label>
      <Select
        defaultValue={defaultValue}
        items={items}
        name="status"
        onValueChange={(v) => onChange?.(v as StatusType)}
        required
        value={value}
      >
        <SelectTrigger id="status">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
          <SelectItem value="backlog">Backlog</SelectItem>
          <SelectItem value="published">Published</SelectItem>
        </SelectPopup>
      </Select>
    </div>
  );
}
