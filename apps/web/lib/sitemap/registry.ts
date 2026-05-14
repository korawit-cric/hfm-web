/**
 * Application sitemap — route registry aligned with `app/[locale]/` and nav targets.
 * Set `includeInSitemap: true` when a shell starts returning real content so
 * `/sitemap.xml` stays free of 404 URLs.
 */

export interface RouteMetadata {
  title: string;
  description: string;
}

export interface RouteParameter {
  name: string;
  description: string;
  type: string;
}

export interface RouteInfo {
  readonly path: string;
  readonly label: string;
  readonly metadata: RouteMetadata;
  readonly requiresAuth: boolean;
  readonly isDynamic?: boolean;
  readonly parameters?: readonly RouteParameter[];
  readonly parent?: string;
  /**
   * When true, the path is emitted in `sitemap.xml`. Omit or false for shells and placeholders.
   */
  readonly includeInSitemap?: boolean;
}

/**
 * Marketing / content routes. Dynamic auth flows are omitted until the app adds them.
 */
export const SITEMAP = {
  HOME: {
    path: '/',
    label: 'Home',
    metadata: {
      title: 'HFM Web',
      description: 'hfm-web monorepo — Next.js frontend',
    },
    requiresAuth: false,
    includeInSitemap: true,
  },

  /** `app/[locale]/(home)/page.tsx` — same path segment as HOME; listed once as `/`. */

  PRODUCTS: {
    path: '/products',
    label: 'Products',
    metadata: {
      title: 'Products',
      description: 'Trading products and account types.',
    },
    requiresAuth: false,
    includeInSitemap: false,
  },

  ABOUT: {
    path: '/about',
    label: 'About',
    metadata: {
      title: 'About',
      description: 'About HF Markets.',
    },
    requiresAuth: false,
    includeInSitemap: false,
  },

  RESOURCES: {
    path: '/resources',
    label: 'Resources',
    metadata: {
      title: 'Resources',
      description: 'Educational resources and tools.',
    },
    requiresAuth: false,
    includeInSitemap: false,
  },

  SUPPORT: {
    path: '/support',
    label: 'Support',
    metadata: {
      title: 'Support',
      description: 'Help and support.',
    },
    requiresAuth: false,
    includeInSitemap: false,
  },

  CONTACT: {
    path: '/contact',
    label: 'Contact',
    metadata: {
      title: 'Contact',
      description: 'Contact us.',
    },
    requiresAuth: false,
    includeInSitemap: false,
  },

  PARTNER: {
    path: '/partner',
    label: 'Partner with us',
    metadata: {
      title: 'Partner with us',
      description: 'Partnership opportunities.',
    },
    requiresAuth: false,
    includeInSitemap: false,
  },

  DOWNLOAD: {
    path: '/download',
    label: 'Download App',
    metadata: {
      title: 'Download App',
      description: 'Download the mobile app.',
    },
    requiresAuth: false,
    includeInSitemap: false,
  },
} as const satisfies Record<string, RouteInfo>;

/** Type-safe path shortcuts (registry keys stay the source of truth). */
export const ROUTES = {
  HOME: SITEMAP.HOME.path,
  PRODUCTS: SITEMAP.PRODUCTS.path,
  ABOUT: SITEMAP.ABOUT.path,
  RESOURCES: SITEMAP.RESOURCES.path,
  SUPPORT: SITEMAP.SUPPORT.path,
  CONTACT: SITEMAP.CONTACT.path,
  PARTNER: SITEMAP.PARTNER.path,
  DOWNLOAD: SITEMAP.DOWNLOAD.path,
} as const;

const DEFAULT_LOGIN_URL = 'https://www.hfm.com/';
const DEFAULT_REGISTER_URL = 'https://www.hfm.com/en/open-live-account';

/**
 * External client portal targets for header CTAs. Override in `.env` for each
 * environment; defaults point at the public HF Markets site.
 */
export function getAuthPortalUrls(): { login: string; register: string } {
  const login = process.env.NEXT_PUBLIC_LOGIN_URL?.trim();
  const register = process.env.NEXT_PUBLIC_REGISTER_URL?.trim();
  return {
    login: login && login.length > 0 ? login : DEFAULT_LOGIN_URL,
    register: register && register.length > 0 ? register : DEFAULT_REGISTER_URL,
  };
}

function routeEntries(): RouteInfo[] {
  return Object.values(SITEMAP) as RouteInfo[];
}

/**
 * Paths to emit in `sitemap.xml` (no locale prefix). Non-dynamic, indexable, public routes only.
 */
export function getStaticPathsForSitemap(): string[] {
  return routeEntries()
    .filter(
      (route) =>
        route.includeInSitemap === true &&
        route.requiresAuth !== true &&
        !route.isDynamic,
    )
    .map((route) => route.path);
}

/**
 * All registered static paths (for guards, docs, or tooling), including those excluded from XML.
 */
export function getAllStaticRoutePaths(): string[] {
  return routeEntries()
    .filter((route) => !route.isDynamic)
    .map((route) => route.path);
}
