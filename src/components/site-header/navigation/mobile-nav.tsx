'use client';

import type { Route } from 'next';

import { useState } from 'react';
import { Menu as MenuIcon, X as XIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NAVIGATION_LINKS } from '@/components/site-header/constants';
import { ModeSwitcher } from '@/components/site-header/mode-switcher';
import { SiteBranding } from '@/components/site-header/site-branding';
import { Button, Sheet, SheetClose, SheetHeader, SheetPopup, SheetTrigger } from '@/components/ui';
import { cn } from '@/utils';

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger
        render={
          <Button
            aria-expanded={open}
            aria-label="Open navigation menu"
            className={className}
            size="icon-lg"
            variant="ghost"
          >
            <MenuIcon className="size-6 transition-transform" />
          </Button>
        }
      />

      <SheetPopup showCloseButton={false} side="right">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SiteBranding />
          <div className="flex items-center gap-2">
            <ModeSwitcher className="size-10" />
            <SheetClose
              render={
                <Button aria-label="Close navigation menu" size="icon-lg" variant="ghost">
                  <XIcon className="size-6" />
                </Button>
              }
            />
          </div>
        </SheetHeader>

        <nav aria-label="Mobile navigation" className="flex flex-col gap-2 px-4">
          {NAVIGATION_LINKS.map((link) => (
            <SheetClose key={link.href}>
              <Button
                className={cn(
                  'w-full justify-start text-lg transition-colors',
                  pathname === link.href ? 'text-primary' : 'text-foreground',
                )}
                render={<Link href={link.href as Route} />}
                variant="ghost"
              >
                {link.label}
              </Button>
            </SheetClose>
          ))}
        </nav>
      </SheetPopup>
    </Sheet>
  );
}
