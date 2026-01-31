import { ExternalLinkIcon } from 'lucide-react';

import { Button, Link } from '@/components/ui';

interface ExternalLinkButtonProps {
  href: string;
}

export function ExternalLinkButton({ href }: ExternalLinkButtonProps) {
  return (
    <Button render={<Link href={href} target="_blank" />} variant="outline">
      <ExternalLinkIcon className="h-4 w-4" />
      Open Media
    </Button>
  );
}
