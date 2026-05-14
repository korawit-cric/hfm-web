import type { ApiEndpoint, Experience } from './types.js';
import { withLocaleQuery } from './query-utils.js';

/** Experiences API — localized label per locale query (like countries). */
export const experiencesApi = {
  list: (locale?: string): ApiEndpoint<Experience[]> => ({
    url: withLocaleQuery('/experiences', locale),
    method: 'GET',
  }),
};
