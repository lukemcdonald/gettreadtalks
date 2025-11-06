import { Label } from '@/components/ui/label';
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StatusSelectFieldProps {
  defaultValue?: 'backlog' | 'published' | 'archived';
}

export function StatusSelectField({ defaultValue = 'backlog' }: StatusSelectFieldProps) {
  const items = [
    { label: 'Backlog', value: 'backlog' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' },
  ];

  return (
    <div>
      <Label htmlFor="status">Status</Label>
      <Select defaultValue={defaultValue} items={items} name="status" required>
        <SelectTrigger id="status">
          <SelectValue />
        </SelectTrigger>
        <SelectPopup>
          <SelectItem value="backlog">Backlog</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectPopup>
      </Select>
    </div>
  );
}
