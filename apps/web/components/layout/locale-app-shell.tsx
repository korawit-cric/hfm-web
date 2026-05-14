import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { DocumentLocaleSync } from '@/components/document-locale-sync';
import { Footer } from '@/components/layout/footer';
import { NavigationBar } from '@/components/layout/navigation-bar';
import { Providers } from '@/providers';
import {
  createOrganizationSchema,
  organizationSchemaToJsonLd,
} from '@/lib/metadata/create-organization-schema';

type Props = {
  locale: string;
  children: React.ReactNode;
};

/** Shared chrome for localized routes and root `not-found` (same as `[locale]/layout`). */
export async function LocaleAppShell({ locale, children }: Props) {
  setRequestLocale(locale);
  const messages = await getMessages();

  const localeFontClass =
    locale === 'th' ? 'font-ibm-plex-sans-thai' : 'font-open-sans';

  const organizationJsonLd = organizationSchemaToJsonLd(
    createOrganizationSchema(locale),
  );

  return (
    <NextIntlClientProvider messages={messages}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: organizationJsonLd }}
      />
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
