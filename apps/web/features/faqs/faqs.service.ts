import { faqsApi } from '@repo/api-client';
import type { Faq } from '@repo/api-client';
import { getLocale } from 'next-intl/server';

import { serverFetch } from '../../lib/fetch/server';

export async function getFaqs(): Promise<Faq[]> {
  try {
    const locale = await getLocale();
    return await serverFetch(faqsApi.list(locale));
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}
