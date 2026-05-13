import type {
  ApiEndpoint,
  ApiEndpointWithBody,
  CreateLinkDto,
  Link,
  UpdateLinkDto,
} from './types.js';
import { withLocaleQuery } from './query-utils.js';

/**
 * Links API definitions
 * Pure data contracts - no fetch, no React, no Next.js
 */
export const linksApi = {
  list: (locale?: string): ApiEndpoint<Link[]> => ({
    url: withLocaleQuery('/links', locale),
    method: 'GET',
  }),

  detail: (id: number, locale?: string): ApiEndpoint<Link> => ({
    url: withLocaleQuery(`/links/${id}`, locale),
    method: 'GET',
  }),

  create: (data: CreateLinkDto): ApiEndpointWithBody<CreateLinkDto, Link> => ({
    url: '/links',
    method: 'POST',
    body: data,
  }),

  update: (
    id: number,
    data: UpdateLinkDto,
    locale?: string,
  ): ApiEndpointWithBody<UpdateLinkDto, Link> => ({
    url: withLocaleQuery(`/links/${id}`, locale),
    method: 'PATCH',
    body: data,
  }),

  delete: (id: number): ApiEndpoint<void> => ({
    url: `/links/${id}`,
    method: 'DELETE',
  }),
};
