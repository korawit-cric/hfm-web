import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';

import { routing } from './routing';

type MessagesModule = { default: Record<string, unknown> };

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const mod = (await import(`../../messages/${locale}.json`)) as MessagesModule;

  return {
    locale,
    messages: mod.default,
  };
});
