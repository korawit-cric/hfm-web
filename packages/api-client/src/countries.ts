import type { ApiEndpoint, Country } from './types.js';
import { withLocaleQuery } from './query-utils.js';

/**
 * Countries API — localized name per locale query parameter.
 */
export const countriesApi = {
  list: (locale?: string): ApiEndpoint<Country[]> => ({
    url: withLocaleQuery('/countries', locale),
    method: 'GET',
  }),
};
