import { Badge } from '@/components/ui';
import { pluralize } from '@/utils';

interface CountBadgeProps {
  count: number;
  label: string;
}

export function CountBadge({ count, label }: CountBadgeProps) {
  return (
    <Badge variant="secondary">
      {count === 0
        ? `No ${label}s`
        : `${count} ${pluralize(count, label, `${label}s`)}`}
    </Badge>
  );
}
