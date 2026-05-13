import type { Locale } from '@repo/prisma';

export type { Locale };

// API request/response types
export interface ApiEndpoint<TResponse = unknown> {
  url: string;
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  _response?: TResponse; // Phantom type for inference
}

export interface ApiEndpointWithBody<
  TBody = unknown,
  TResponse = unknown,
> extends ApiEndpoint<TResponse> {
  body?: TBody;
}

/** Resolved link for the requested locale (API flattens translations). */
export interface Link {
  id: number;
  url: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LinkTranslationInput {
  locale: Locale;
  title: string;
  description?: string;
}

export interface CreateLinkDto {
  url: string;
  translations: LinkTranslationInput[];
}

export interface UpdateLinkDto {
  url?: string;
  translations?: LinkTranslationInput[];
}

/** Leaderboard row for the requested locale (decimals as strings in JSON). */
export interface Ranking {
  id: number;
  sn: string;
  gain: string;
  bonus: string;
  rank: number;
  name: string;
}

export interface Faq {
  id: number;
  q: string;
  a: string;
}

export interface Prize {
  id: number;
  amount: string;
  rank: number;
  description: string | null;
}

/** Country row localized for the requested locale; includes primary dialing prefix when linked in DB. */
export interface Country {
  id: number;
  name: string;
  phoneCode: string;
}
