import { Open_Sans, Prompt, Sofia_Sans_Condensed } from 'next/font/google';
import { headers } from 'next/headers';

import '@repo/ui/styles.css';
import './globals.css';

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

const sofiaSansCondensed = Sofia_Sans_Condensed({
  variable: '--font-sofia-sans-condensed',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await headers()).get('x-next-intl-locale') ?? 'en';

  /* All next/font variable classes on body so every locale can use any utility. */
  const fontVariables = `${openSans.variable} ${prompt.variable} ${sofiaSansCondensed.variable}`;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={fontVariables}>{children}</body>
    </html>
  );
}
