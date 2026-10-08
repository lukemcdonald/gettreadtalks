import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui';

export function NewSpeakerButton() {
  return (
    <Button render={<Link href="/speakers/new" />} size="sm">
      <PlusIcon className="size-4" />
      New Speaker
    </Button>
  );
}
