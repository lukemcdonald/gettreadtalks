import type { Metadata } from 'next';

import { Suspense } from 'react';
import { Inter } from 'next/font/google';

import { AuthProvider } from '@/components/auth-provider';
import { ErrorBoundary } from '@/components/error-boundary';
import { SiteHeader } from '@/components/site-header/site-header';
import { ThemeProvider } from '@/components/theme-provider';

import './_assets/css/styles.css';

import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter-sans',
});

export const metadata: Metadata = {
  description: 'TREADTalks - Faith-based talks and content platform',
  icons: {
    // icon: '/favicon.svg', // place in public folder. Add apple icon too.
  },
  title: 'TREADTalks',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={cn(inter.className, 'h-full bg-cover bg-gray-100 dark:bg-gray-950')}>
        <ErrorBoundary>
          <ThemeProvider>
            <AuthProvider>
              <Suspense>
                <SiteHeader />
              </Suspense>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
