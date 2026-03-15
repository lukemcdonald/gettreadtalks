import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui';
import { Link } from '@/components/ui/link';

export function NewClipButton() {
  return (
    <Button render={<Link href="/clips/new" prefetch="hover" />} size="sm">
      <PlusIcon className="size-4" />
      New Clip
    </Button>
  );
}
