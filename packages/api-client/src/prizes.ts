import type { ApiEndpoint } from './types.js';
import { withLocaleQuery } from './query-utils.js';
import type { Prize } from './types.js';

export const prizesApi = {
  list: (locale?: string): ApiEndpoint<Prize[]> => ({
    url: withLocaleQuery('/prizes', locale),
    method: 'GET',
  }),

  detail: (id: number, locale?: string): ApiEndpoint<Prize> => ({
    url: withLocaleQuery(`/prizes/${id}`, locale),
    method: 'GET',
  }),
};
