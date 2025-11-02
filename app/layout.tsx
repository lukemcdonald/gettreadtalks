import type { Metadata } from 'next';

import { Suspense } from 'react';

import { Inter } from 'next/font/google';

import { AuthProvider } from '@/components/auth-provider';
import { ErrorBoundary } from '@/components/error-boundary';
import { SiteHeader } from '@/components/site-header';
import { ThemeProvider } from '@/components/theme-provider';

import './_assets/css/styles.css';

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider>
            <AuthProvider>
              <Suspense
                fallback={
                  <div className="h-16 bg-background border-b-2 border-slate-200 dark:border-slate-800" />
                }
              >
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
