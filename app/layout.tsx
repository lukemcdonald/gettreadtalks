import type { Metadata } from 'next';

import { Inter } from 'next/font/google';

import { ErrorBoundary } from '@/components/error-boundary';
import SiteHeader from '@/components/layout/site-header';

import './globals.css';
import AuthProvider from '@/components/providers/auth-provider';
import ThemeProvider from '@/components/providers/theme-provider';

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

export default function RootLayout({
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
              <SiteHeader />
              {children}
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
