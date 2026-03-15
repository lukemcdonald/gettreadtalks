import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui';
import { Link } from '@/components/ui/link';

export function NewSpeakerButton() {
  return (
    <Button render={<Link href="/speakers/new" prefetch="hover" />} size="sm">
      <PlusIcon className="size-4" />
      New Speaker
    </Button>
  );
}
