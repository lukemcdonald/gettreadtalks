import type { Metadata } from 'next';

import { Inter } from 'next/font/google';

import { AuthProvider } from '@/components/auth-provider';
import { ErrorBoundary } from '@/components/error-boundary';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header/site-header';
import { ThemeProvider } from '@/components/theme-provider';

import '@/assets/styles.css';

import { Suspense } from 'react';

import { SkipToMainLink } from '@/components/site-header/navigation/skip-to-main-link';
import { cn } from '@/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  description: 'Faith-based talks and content platform',
  icons: {
    // icon: '/favicon.svg', // place in public folder. Add apple icon too.
  },
  title: 'TREAD Talks',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full" lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          'flex min-h-full flex-col bg-cover bg-gray-100 dark:bg-gray-950',
        )}
      >
        <ErrorBoundary>
          <ThemeProvider>
            <AuthProvider>
              <SkipToMainLink href="#content" />
              <Suspense>
                <SiteHeader />
              </Suspense>
              <div className="flex-1" id="content">
                {children}
              </div>
              <SiteFooter />
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
