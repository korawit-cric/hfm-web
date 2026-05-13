import type { MetadataRoute } from 'next';

import { locales } from '@/lib/i18n/navigation';
import { getStaticPathsForSitemap } from '@/lib/sitemap/registry';

export const revalidate = 3600;

const createFullBaseUrl = (): string => {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  return base.startsWith('http') ? base : `https://${base}`;
};

/** Locale-prefixed path after the origin, with trailing slash except we normalize below. */
const localePathSuffix = (path: string): string => {
  if (path === '/') return '/';
  const trimmed = path.replace(/\/$/, '');
  return `${trimmed}/`;
};

/**
 * Emits one URL per locale for each path returned by {@link getStaticPathsForSitemap}.
 * Add CMS or dynamic segments later by extending the registry and this generator.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const fullBaseUrl = createFullBaseUrl();
  const paths = getStaticPathsForSitemap();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of paths) {
      entries.push({
        url: `${fullBaseUrl}/${locale}${localePathSuffix(path)}`,
        lastModified: new Date(),
        changeFrequency: path === '/' ? 'weekly' : 'monthly',
        priority: path === '/' ? 1 : 0.8,
      });
    }
  }

  return entries;
}
