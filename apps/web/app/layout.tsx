import { Open_Sans, Prompt } from 'next/font/google';
import { headers } from 'next/headers';

import '@repo/ui/styles.css';
import './globals.css';
import { Locale } from '@/lib/i18n/navigation';

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

const prompt = Prompt({
  variable: '--font-prompt',
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await headers()).get('x-next-intl-locale') ?? 'en';

  const fontClass =
    locale === Locale.TH
      ? `${prompt.variable} font-prompt`
      : `${openSans.variable} font-open-sans`;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={fontClass}>{children}</body>
    </html>
  );
}
