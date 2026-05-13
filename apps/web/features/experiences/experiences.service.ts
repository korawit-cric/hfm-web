import { experiencesApi, type Experience } from '@repo/api-client';
import { getLocale } from 'next-intl/server';

import { serverFetch } from '@/lib/fetch/server';

/** Server-side: use in Server Components (same pattern as {@link getCountries}). */
export async function getExperiences(): Promise<Experience[]> {
  try {
    const locale = await getLocale();
    return await serverFetch(experiencesApi.list(locale));
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }
}
