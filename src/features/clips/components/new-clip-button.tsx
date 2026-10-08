import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui';

export function NewClipButton() {
  return (
    <Button render={<Link href="/clips/new" />} size="sm">
      <PlusIcon className="size-4" />
      New Clip
    </Button>
  );
}
