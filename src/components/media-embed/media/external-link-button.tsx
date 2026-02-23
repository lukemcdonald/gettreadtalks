import { ExternalLinkIcon } from 'lucide-react';

import { Button, Link } from '@/components/ui';

interface ExternalLinkButtonProps {
  className: string;
  href: string;
  label: string;
}

export function ExternalLinkButton({ href, label, ...delegated }: ExternalLinkButtonProps) {
  const size = label ? 'xl' : 'icon-xl';
  return (
    <Button render={<Link href={href} target="_blank" />} size={size} {...delegated}>
      <ExternalLinkIcon className="h-4 w-4" />
      {label}
    </Button>
  );
}
