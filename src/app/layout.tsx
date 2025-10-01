import type { Metadata } from 'next';

import { Inter } from 'next/font/google';

import SiteHeader from '@/components/layout/site-header';

import './globals.css';
import AuthProvider from '@/components/providers/auth-provider';

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
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SiteHeader />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
