import { rankingsApi } from '@repo/api-client';
import type { Ranking } from '@repo/api-client';
import { getLocale } from 'next-intl/server';

import { serverFetch } from '../../lib/fetch/server';

export async function getRankings(): Promise<Ranking[]> {
  try {
    const locale = await getLocale();
    return await serverFetch(rankingsApi.list(locale));
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return [];
  }
}

export async function getRanking(id: number): Promise<Ranking | null> {
  try {
    const locale = await getLocale();
    return await serverFetch(rankingsApi.detail(id, locale));
  } catch (error) {
    console.error(`Error fetching ranking ${id}:`, error);
    return null;
  }
}
