'use client';

import type { Route } from 'next';

import { Mail, Rss } from 'lucide-react';
import Link from 'next/link';

import { Copyright } from '@/components/copyright';
import { cn } from '@/lib/utils';

type FooterColumnProps = {
  children: React.ReactNode;
  className?: string;
  title: string;
};

function FooterColumn({ children, className, title }: FooterColumnProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="font-semibold text-foreground text-sm uppercase">{title}</h3>
      <nav aria-label={title} className="flex flex-col space-y-2">
        {children}
      </nav>
    </div>
  );
}

type FooterLinkProps = {
  children: React.ReactNode;
  href: string;
};

function FooterLink({ children, href }: FooterLinkProps) {
  return (
    <Link
      className="text-muted-foreground transition-colors hover:text-foreground"
      href={href as Route}
    >
      {children}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <FooterColumn title="ENGAGE">
              <FooterLink href="/talks">Talks</FooterLink>
              <FooterLink href="/speakers">Speakers</FooterLink>
              <FooterLink href="/collections">Series</FooterLink>
              <FooterLink href="/clips">Clips</FooterLink>
            </FooterColumn>

            <FooterColumn title="GENERAL">
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/beliefs">Beliefs</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </FooterColumn>

            <FooterColumn title="RESOURCES">
              <FooterLink href="/resources/bibles">Bibles</FooterLink>
              <FooterLink href="/resources/bible-app">Bible App</FooterLink>
              <FooterLink href="/resources/bible-study-tools">Bible Study Tools</FooterLink>
            </FooterColumn>

            <FooterColumn title="GLORY TO THE HOLY ONE">
              <div className="relative">
                <a
                  aria-label="Glory To The Holy One book by Jeff Lippincott & R.C. Sproul (affiliate link)"
                  className="block"
                  href="https://www.ligonier.org/store/glory-to-the-holy-one-hardcover"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-teal-600 to-teal-800">
                    {/* Decorative swirls/patterns background */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="-left-4 -top-4 absolute size-32 rounded-full bg-white/30 blur-2xl" />
                      <div className="-right-4 -bottom-4 absolute size-40 rounded-full bg-white/20 blur-3xl" />
                      <div className="absolute top-8 right-8 size-24 rounded-full bg-white/25 blur-xl" />
                    </div>
                    {/* Content */}
                    <div className="relative flex h-full flex-col items-center justify-center p-4 text-center text-white">
                      <p className="mb-3 font-medium text-xs">JEFF LIPPINCOTT & R.C. SPROUL</p>
                      <p className="font-bold text-2xl italic leading-tight">
                        Glory To The Holy One
                      </p>
                    </div>
                    {/* Affiliate badge */}
                    <div className="absolute right-2 bottom-2 rounded bg-foreground px-2 py-1 font-medium text-background text-xs">
                      Affiliate
                    </div>
                  </div>
                </a>
              </div>
            </FooterColumn>
          </div>
        </div>
      </div>

      <div className="border-t bg-background">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-muted-foreground text-sm">
              <Copyright />
            </p>
            <p className="text-muted-foreground text-sm">
              Made with <span className="text-red-500">❤️</span> by Luke McDonald
            </p>
            <div className="flex items-center gap-4">
              <a
                aria-label="Send email to contact@gettreadtalks.com"
                className="text-muted-foreground transition-colors hover:text-foreground"
                href="mailto:contact@gettreadtalks.com"
              >
                <Mail className="size-5" />
              </a>
              <a
                aria-label="RSS feed"
                className="text-muted-foreground transition-colors hover:text-foreground"
                href="/feed"
              >
                <Rss className="size-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
