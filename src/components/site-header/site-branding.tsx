import Link from 'next/link';

import { Logo } from '@/components/logo';
import { site } from '@/configs/site';

interface SiteBrandingProps {
  className?: string;
}

export function SiteBranding({ className }: SiteBrandingProps) {
  return (
    <Link className={className} href="/">
      <Logo className="block h-5 w-auto" />
      <span className="sr-only">{site.name}</span>
    </Link>
  );
}
