import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/layout/footer';
import { NavigationBar } from '@/components/layout/navigation-bar';
import { Providers } from '@/providers';
import { DocumentLocaleSync } from '@/components/document-locale-sync';
import { createMetadata } from '@/lib/metadata/create-metadata';
import { routing } from '@/lib/i18n/routing';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const generateMetadata = createMetadata({
  namespace: 'Root',
  pathname: '/',
});

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const localeFontClass =
    locale === 'th' ? 'font-ibm-plex-sans-thai' : 'font-open-sans';

  return (
    <NextIntlClientProvider messages={messages}>
      <DocumentLocaleSync />
      <Providers>
        <div className={`flex min-h-screen flex-col ${localeFontClass}`}>
          <NavigationBar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </Providers>
    </NextIntlClientProvider>
  );
}
