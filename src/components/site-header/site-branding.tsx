import Link from 'next/link';

import { Logo } from '@/components/logo';

export function SiteBranding() {
  return (
    <Link href="/">
      <Logo className="block h-5 w-auto" />
      <span className="sr-only">TREAD Talks</span>
    </Link>
  );
}
