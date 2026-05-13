import { linksApi } from '@repo/api-client';
import type { Link } from '@repo/api-client';
import { getLocale } from 'next-intl/server';

import { serverFetch } from '../../lib/fetch/server';

/**
 * Server-side service for fetching links
 * Use in Server Components and Route Handlers
 */
export async function getLinks(): Promise<Link[]> {
  try {
    const locale = await getLocale();
    return await serverFetch(linksApi.list(locale));
  } catch (error) {
    console.error('Error fetching links:', error);
    return [];
  }
}

export async function getLink(id: number): Promise<Link | null> {
  try {
    const locale = await getLocale();
    return await serverFetch(linksApi.detail(id, locale));
  } catch (error) {
    console.error(`Error fetching link ${id}:`, error);
    return null;
  }
}
