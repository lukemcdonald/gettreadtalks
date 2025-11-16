import Link from 'next/link';

import { Logo } from '@/components/logo';

export function SiteBranding() {
  return (
    <Link className="flex shrink-0 items-center" href="/">
      <Logo className="block h-6 w-auto" />
      <span className="sr-only">TREAD Talks</span>
    </Link>
  );
}
