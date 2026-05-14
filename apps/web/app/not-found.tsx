import { hasLocale } from 'next-intl';
import { headers } from 'next/headers';

import { I18nNotFoundView } from '@/components/i18n-not-found-view';
import { LocaleAppShell } from '@/components/layout/locale-app-shell';
import { routing } from '@/lib/i18n/routing';

/**
 * Next may resolve unknown URLs to root `not-found`, skipping `[locale]/layout`.
 * Reuse `LocaleAppShell` so nav/footer and providers match localized pages.
 */
export default async function RootNotFound() {
  const headerLocale = (await headers()).get('x-next-intl-locale');
  const locale = hasLocale(routing.locales, headerLocale ?? '')
    ? headerLocale!
    : routing.defaultLocale;

  return (
    <LocaleAppShell locale={locale}>
      <I18nNotFoundView />
    </LocaleAppShell>
  );
}
