import type { ApiEndpoint, ApiEndpointWithBody } from './types.js';

export type CreateApplicationBody = {
  firstName: string;
  lastName: string;
  countryId: number;
  phoneCode: string;
  phone: string;
  email: string;
  experienceId: number;
  consent: boolean;
};

/** Row returned after POST /applications (persisted fields, camelCase). */
export type SavedApplication = {
  id: number;
  firstName: string;
  lastName: string;
  countryId: number;
  codeId: number;
  experienceId: number;
  phone: string;
  email: string;
  consent: boolean;
};

/**
 * Applications API — list, read, and create marketing signup rows.
 */
export const applicationsApi = {
  list: (): ApiEndpoint<SavedApplication[]> => ({
    url: '/applications',
    method: 'GET',
  }),

  getById: (id: number): ApiEndpoint<SavedApplication> => ({
    url: `/applications/${id}`,
    method: 'GET',
  }),

  create: (
    body: CreateApplicationBody,
  ): ApiEndpointWithBody<CreateApplicationBody, SavedApplication> => ({
    url: '/applications',
    method: 'POST',
    body,
  }),
};
