import { Open_Sans } from 'next/font/google';
import { headers } from 'next/headers';

import '@repo/ui/styles.css';
import './globals.css';

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await headers()).get('x-next-intl-locale') ?? 'en';

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${openSans.variable} font-open-sans`}>{children}</body>
    </html>
  );
}
