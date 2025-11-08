import Link from 'next/link';

import { Logo } from '@/components/logo';

export function SiteBranding() {
  return (
    <h1 className="flex flex-1 items-center justify-center text-2xl md:items-stretch md:justify-start">
      <Link href="/" className="flex shrink-0 items-center">
        <Logo className="block h-6 w-auto" />
        <span className="sr-only">TREADTalks</span>
      </Link>
    </h1>
  );
}
