import { countriesApi, type Country } from '@repo/api-client';
import { getLocale } from 'next-intl/server';

import { serverFetch } from '@/lib/fetch/server';

/** Server-side: use in Server Components with {@link serverFetch}. */
export async function getCountries(): Promise<Country[]> {
  try {
    const locale = await getLocale();
    return await serverFetch(countriesApi.list(locale));
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}
