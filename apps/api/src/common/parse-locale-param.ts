import { Locale } from '@repo/prisma';

export function parseLocaleParam(value?: string): Locale {
  if (value === Locale.th || value === 'th') {
    return Locale.th;
  }
  return Locale.en;
}
