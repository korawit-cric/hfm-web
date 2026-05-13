import { notFound } from 'next/navigation';

/**
 * Catch-all under `[locale]`: unknown paths (e.g. `/th/resources`) hit this
 * segment, then we delegate to `not-found.tsx`. Next.js does not render
 * `[locale]/not-found.tsx` for missing routes unless `notFound()` runs from a
 * matched route — see next-intl “Catching unknown routes”.
 */
export default function CatchAllLocalePage() {
  notFound();
}
