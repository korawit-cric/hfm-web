import { type Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { defaultLocale, locales } from '@/lib/i18n/navigation';
import { routing } from '@/lib/i18n/routing';

export type PageMetadataProps = {
  /**
   * Translation key for the page title (within `namespace`, default `title`).
   */
  title?: string;
  /**
   * Translation key for the page description (within `namespace`, default `description`).
   */
  description?: string;
  /**
   * next-intl message namespace (JSON top-level key). Defaults to `Root`.
   */
  namespace?: string;
  /**
   * Path after the locale segment. Must start with `/`.
   * Omit or `/` for the homepage; use `/about` for `/[locale]/about`, etc.
   */
  pathname?: string;
  keywords?: string | string[];
};

const createBaseUrl = (url: string) =>
  url.startsWith('http') ? url : `https://${url}`;

const createLocalePaths = ({
  baseUrl,
  uniformPathname,
}: {
  baseUrl: string;
  uniformPathname: string;
}): Record<string, string> =>
  Object.fromEntries(
    locales.map((locale) => [locale, `${baseUrl}/${locale}${uniformPathname}`]),
  );

const normalizePathname = (pathname: string): string =>
  pathname === '/' ? '/' : `${pathname.replace(/\/$/, '')}/`;

/**
 * Returns a `generateMetadata` function with locale-aware canonical URL,
 * `hreflang` alternates, Open Graph, and Twitter card fields.
 * Open Graph `siteName` uses `NEXT_PUBLIC_SITE_NAME` when set.
 */
export function createMetadata({
  title: titleKey,
  description: descriptionKey,
  namespace,
  pathname = '/',
  keywords,
}: PageMetadataProps = {}) {
  const ns = namespace ?? 'Root';
  const titleMsgKey = titleKey ?? 'title';
  const descriptionMsgKey = descriptionKey ?? 'description';

  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }): Promise<Metadata> {
    const { locale } = await params;
    const safeLocale = hasLocale(routing.locales, locale)
      ? locale
      : routing.defaultLocale;

    const baseUrl = createBaseUrl(
      process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000',
    );
    const uniformPathname = normalizePathname(pathname);
    const canonicalUrl = `${baseUrl}/${safeLocale}${uniformPathname}`;

    const t = await getTranslations({ locale: safeLocale, namespace: ns });
    const metadataTitle = t(titleMsgKey);
    const metadataDescription = t(descriptionMsgKey);

    const alternates = {
      canonical: canonicalUrl,
      languages: {
        ...createLocalePaths({ baseUrl, uniformPathname }),
        'x-default': `${baseUrl}/${defaultLocale}${uniformPathname}`,
      },
    };

    const siteName = process.env.NEXT_PUBLIC_SITE_NAME;

    return {
      metadataBase: new URL(baseUrl),
      title: metadataTitle,
      description: metadataDescription,
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title: metadataTitle,
        description: metadataDescription,
        url: canonicalUrl,
        ...(siteName ? { siteName } : {}),
        locale: safeLocale,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: metadataTitle,
        description: metadataDescription,
      },
      alternates,
      ...(keywords !== undefined ? { keywords } : {}),
    };
  };
}
