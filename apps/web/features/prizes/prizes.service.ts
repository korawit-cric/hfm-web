import { prizesApi } from '@repo/api-client';
import type { Prize } from '@repo/api-client';
import { getLocale } from 'next-intl/server';

import { serverFetch } from '../../lib/fetch/server';

export async function getPrizes(): Promise<Prize[]> {
  try {
    const locale = await getLocale();
    return await serverFetch(prizesApi.list(locale));
  } catch (error) {
    console.error('Error fetching prizes:', error);
    return [];
  }
}
