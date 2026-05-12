import { Prompt } from 'next/font/google';
import { headers } from 'next/headers';

import '@repo/ui/styles.css';
import './globals.css';

const prompt = Prompt({
  variable: '--font-prompt',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await headers()).get('x-next-intl-locale') ?? 'en';

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${prompt.variable} font-prompt`}>{children}</body>
    </html>
  );
}
