import {
  IBM_Plex_Sans_Thai,
  Open_Sans,
  Sofia_Sans_Condensed,
} from 'next/font/google';
import { headers } from 'next/headers';

import '@repo/ui/styles.css';
import './globals.css';

import { SonnerToaster } from '@/components/sonner-toaster';

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

const sofiaSansCondensed = Sofia_Sans_Condensed({
  variable: '--font-sofia-sans-condensed',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  variable: '--font-ibm-plex-sans-thai',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await headers()).get('x-next-intl-locale') ?? 'en';

  /* All next/font variable classes on body so every locale can use any utility. */
  const fontVariables = `${openSans.variable} ${sofiaSansCondensed.variable} ${ibmPlexSansThai.variable}`;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={fontVariables}>
        {children}
        <SonnerToaster />
      </body>
    </html>
  );
}
