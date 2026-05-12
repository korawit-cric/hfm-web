import type { ApiEndpoint } from './types.js';
import { withLocaleQuery } from './query-utils.js';
import type { Ranking } from './types.js';

export const rankingsApi = {
  list: (locale?: string): ApiEndpoint<Ranking[]> => ({
    url: withLocaleQuery('/rankings', locale),
    method: 'GET',
  }),

  detail: (id: number, locale?: string): ApiEndpoint<Ranking> => ({
    url: withLocaleQuery(`/rankings/${id}`, locale),
    method: 'GET',
  }),
};
