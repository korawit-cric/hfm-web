import type { ApiEndpointWithBody } from './types.js';

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
 * Applications API — create a marketing / signup application row.
 */
export const applicationsApi = {
  create: (
    body: CreateApplicationBody,
  ): ApiEndpointWithBody<CreateApplicationBody, SavedApplication> => ({
    url: '/applications',
    method: 'POST',
    body,
  }),
};
