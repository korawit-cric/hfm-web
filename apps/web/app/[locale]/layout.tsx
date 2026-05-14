import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { LocaleAppShell } from '@/components/layout/locale-app-shell';
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

  return <LocaleAppShell locale={locale}>{children}</LocaleAppShell>;
}
