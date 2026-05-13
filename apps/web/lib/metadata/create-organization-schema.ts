import { hasLocale } from 'next-intl';

import { defaultLocale } from '@/lib/i18n/navigation';
import { routing } from '@/lib/i18n/routing';

const createBaseUrl = (url: string) =>
  url.startsWith('http') ? url : `https://${url}`;

const pickUrl = (env: string | undefined, fallback: string) => {
  const v = env?.trim();
  return v && v.length > 0 ? v : fallback;
};

/**
 * JSON-LD `Organization` (schema.org) for the active locale.
 * Name and URLs come from public env; social defaults match `Footer` links.
 */
export type OrganizationSchema = {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
};

export function createOrganizationSchema(locale: string): OrganizationSchema {
  const typedLocale = hasLocale(routing.locales, locale)
    ? locale
    : defaultLocale;

  const fullBaseUrl = createBaseUrl(
    process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000',
  ).replace(/\/$/, '');

  const name = pickUrl(process.env.NEXT_PUBLIC_SITE_NAME, 'HF Markets');
  const siteUrl = `${fullBaseUrl}/${typedLocale}`;

  const logo = pickUrl(
    process.env.NEXT_PUBLIC_LOGO_URL,
    `${fullBaseUrl}/favicon.ico`,
  );

  const sameAs = [
    pickUrl(
      process.env.NEXT_PUBLIC_FACEBOOK_URL,
      'https://www.facebook.com/hfmbroker',
    ),
    pickUrl(process.env.NEXT_PUBLIC_X_URL, 'https://x.com/hfmbroker'),
    pickUrl(process.env.NEXT_PUBLIC_TELEGRAM_URL, 'https://t.me/hfmbroker'),
    pickUrl(
      process.env.NEXT_PUBLIC_INSTAGRAM_URL,
      'https://www.instagram.com/hfmbroker/',
    ),
    pickUrl(
      process.env.NEXT_PUBLIC_YOUTUBE_URL,
      'https://www.youtube.com/@hfmbroker',
    ),
    pickUrl(
      process.env.NEXT_PUBLIC_LINKEDIN_URL,
      'https://www.linkedin.com/company/hfmbroker',
    ),
    pickUrl(process.env.NEXT_PUBLIC_MEDIUM_URL, 'https://hfmarkets.medium.com'),
    siteUrl,
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: siteUrl,
    logo,
    sameAs: [...new Set(sameAs)],
  };
}

/** Safe to pass to `dangerouslySetInnerHTML` on a `application/ld+json` script tag. */
export function organizationSchemaToJsonLd(schema: OrganizationSchema): string {
  return JSON.stringify(schema);
}
