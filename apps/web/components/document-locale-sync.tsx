'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';

/**
 * Root `app/layout` does not re-run on client locale transitions, so `lang` and
 * body-only classes would stay stale. Syncs `<html lang>` after navigation.
 */
export function DocumentLocaleSync() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
