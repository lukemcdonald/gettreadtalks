import { ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui';

interface ExternalLinkButtonProps {
  href: string;
}

export function ExternalLinkButton({ href }: ExternalLinkButtonProps) {
  return (
    <Button
      render={<Link href={href} rel="noopener noreferrer" target="_blank" />}
      variant="outline"
    >
      <ExternalLinkIcon className="h-4 w-4" />
      Open Media
    </Button>
  );
}
