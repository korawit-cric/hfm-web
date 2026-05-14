import type { ApiEndpoint } from './types.js';
import { withLocaleQuery } from './query-utils.js';
import type { Faq } from './types.js';

export const faqsApi = {
  list: (locale?: string): ApiEndpoint<Faq[]> => ({
    url: withLocaleQuery('/faqs', locale),
    method: 'GET',
  }),

  detail: (id: number, locale?: string): ApiEndpoint<Faq> => ({
    url: withLocaleQuery(`/faqs/${id}`, locale),
    method: 'GET',
  }),
};
