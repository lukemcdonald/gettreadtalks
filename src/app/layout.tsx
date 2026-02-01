import type { Metadata } from 'next';

import { Inter, Playfair_Display } from 'next/font/google';

import { AuthProvider } from '@/components/auth-provider';
import { ErrorBoundary } from '@/components/error-boundary';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { ThemeProvider } from '@/components/theme-provider';

import '@/assets/styles.css';

import type { ReactNode } from 'react';

import { SkipNavLink } from '@/components/site-header/navigation/skip-nav-link';
import { cn } from '@/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  description: 'Faith-based talks and content platform',
  icons: {
    // icon: '/favicon.svg', // place in public folder. Add apple icon too.
  },
  title: 'TREAD Talks',
};

export default async function RootLayout({
  children,
  sheet,
}: Readonly<{
  children: ReactNode;
  sheet: ReactNode;
}>) {
  return (
    <html
      className={cn('h-full', inter.variable, playfair.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <body className={'flex min-h-full flex-col bg-background bg-cover text-foreground'}>
        <ErrorBoundary>
          <ThemeProvider>
            <AuthProvider>
              <SkipNavLink href="#main" />
              <SiteHeader />
              <div className="flex-1 py-6 sm:py-8 md:py-10 lg:py-12" id="content">
                {children}
              </div>
              <SiteFooter />
              {sheet}
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
